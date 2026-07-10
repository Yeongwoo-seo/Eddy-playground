/* OPERATION MK DEV — CASE FILE investigation menu runtime state.
   Same idiom as DevGameState in assetDb.js: a plain global object, one
   JSON blob in localStorage, defensive Object.assign-onto-defaults on load
   (mirrors mkPhoneSearchState_v1's loadState()) so adding a field later
   can't crash an existing save. Save slots live in a SEPARATE key so
   "저장하기" doesn't have to touch live state, and a debug "CLEAR CASE DATA"
   reset doesn't also wipe save slots (or vice versa). */

const CASE_STATE_KEY = 'mkInvestigationState_v1';
const CASE_SAVE_SLOTS_KEY = 'mkInvestigationSaveSlots_v1';
const CASE_SAVE_SLOT_COUNT = 3;

function defaultCaseState() {
  return {
    evidence: [],
    questions: [],
    persons: [],
    visitedSceneIds: [],
    forceUnlockedLocationIds: [],
    inventoryItemIds: [],
    settings: { textSpeed: 'normal', sfx: true, bgm: true, vibration: true },
  };
}

function loadCaseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(CASE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultCaseState();
    return Object.assign(defaultCaseState(), raw, {
      settings: Object.assign(defaultCaseState().settings, raw.settings || {}),
    });
  } catch (e) { return defaultCaseState(); }
}

let caseState = loadCaseState();
function saveCaseState() { localStorage.setItem(CASE_STATE_KEY, JSON.stringify(caseState)); }

function loadSaveSlots() {
  try {
    const raw = JSON.parse(localStorage.getItem(CASE_SAVE_SLOTS_KEY));
    return (raw && typeof raw === 'object') ? raw : {};
  } catch (e) { return {}; }
}

const CaseFileState = {
  /* ===== 증거 ===== */
  addEvidence(item) {
    if (caseState.evidence.some(e => e.id === item.id)) return false;
    caseState.evidence.push(Object.assign({
      discoveredAt: Date.now(),
      status: 'new',
      relatedQuestionIds: [],
      tags: [],
    }, item));
    saveCaseState();
    return true;
  },
  getEvidence() { return caseState.evidence.slice(); },
  markEvidenceReviewed(id) {
    const item = caseState.evidence.find(e => e.id === id);
    if (!item || item.status !== 'new') return;
    item.status = 'reviewed';
    saveCaseState();
  },

  /* ===== 의문점 ===== */
  addQuestion(item) {
    if (caseState.questions.some(q => q.id === item.id)) return false;
    caseState.questions.push(Object.assign({
      description: '',
      createdAt: Date.now(),
      status: 'unresolved',
      linkedEvidenceIds: [],
      resolutionText: null,
      isNew: true,
    }, item));
    saveCaseState();
    return true;
  },
  getQuestions() { return caseState.questions.slice(); },
  setQuestionStatus(id, status, resolutionText) {
    const q = caseState.questions.find(q => q.id === id);
    if (!q) return;
    q.status = status;
    if (resolutionText !== undefined) q.resolutionText = resolutionText;
    saveCaseState();
  },
  linkEvidenceToQuestion(questionId, evidenceId) {
    const q = caseState.questions.find(q => q.id === questionId);
    if (!q || q.linkedEvidenceIds.includes(evidenceId)) return;
    q.linkedEvidenceIds.push(evidenceId);
    saveCaseState();
  },
  markQuestionSeen(id) {
    const q = caseState.questions.find(q => q.id === id);
    if (!q || !q.isNew) return;
    q.isNew = false;
    saveCaseState();
  },

  /* ===== 인물 ===== */
  addPerson(item) {
    if (caseState.persons.some(p => p.id === item.id)) return false;
    caseState.persons.push(Object.assign({
      status: 'unknown',
      discoveredAt: Date.now(),
      relatedEvidenceIds: [],
      relatedQuestionIds: [],
    }, item));
    saveCaseState();
    return true;
  },
  getPersons() { return caseState.persons.slice(); },
  // Unlike addPerson (add-once, no-ops on an existing id), this is how a
  // person's status/knownFacts/lies/unknowns actually change over the story
  // (e.g. 1주차 §10-11: suspect -> cleared -> reopened -> involved). `patch`
  // fields replace the matching arrays wholesale rather than merging, since
  // each interrogation stage re-states the full current picture rather than
  // appending to a stale one.
  setPersonStatus(id, status, patch) {
    const p = caseState.persons.find(p => p.id === id);
    if (!p) return;
    if (status) p.status = status;
    if (patch) Object.assign(p, patch);
    saveCaseState();
  },

  /* ===== 소지품 ===== */
  addInventoryItem(id) {
    if (caseState.inventoryItemIds.includes(id)) return false;
    caseState.inventoryItemIds.push(id);
    saveCaseState();
    return true;
  },
  getInventoryItems() {
    return caseState.inventoryItemIds.map(id => Object.assign({ id }, inventoryItemDefs[id] || { name: id, icon: '❔', description: '' }));
  },

  /* ===== 지도 ===== */
  recordSceneVisit(sceneId) {
    if (!sceneId || caseState.visitedSceneIds.includes(sceneId)) return;
    caseState.visitedSceneIds.push(sceneId);
    saveCaseState();
  },
  unlockMapLocation(id) {
    if (caseState.forceUnlockedLocationIds.includes(id)) return;
    caseState.forceUnlockedLocationIds.push(id);
    saveCaseState();
  },
  // status: 'current' (scene active right now) > 'visited' (a related scene
  // was reached) > 'unlocked' (force-unlocked via debug, not visited yet) >
  // 'locked' (default — includes the brief's 3 aspirational placeholder
  // locations, which have no relatedSceneIds at all yet).
  getMapLocations(currentSceneId) {
    return caseMapLocations.map(loc => {
      let status = 'locked';
      if (loc.relatedSceneIds.includes(currentSceneId)) status = 'current';
      else if (loc.relatedSceneIds.some(id => caseState.visitedSceneIds.includes(id))) status = 'visited';
      else if (caseState.forceUnlockedLocationIds.includes(loc.id)) status = 'unlocked';
      return Object.assign({ status }, loc);
    });
  },

  /* ===== 저장 / 불러오기 ===== */
  saveSlot(slotNum, extra) {
    const slots = loadSaveSlots();
    slots[slotNum] = Object.assign({
      caseState: JSON.parse(JSON.stringify(caseState)),
      updatedAt: Date.now(),
    }, extra);
    localStorage.setItem(CASE_SAVE_SLOTS_KEY, JSON.stringify(slots));
  },
  loadSlot(slotNum) {
    const slot = loadSaveSlots()[slotNum];
    if (!slot) return null;
    caseState = Object.assign(defaultCaseState(), slot.caseState, {
      settings: Object.assign(defaultCaseState().settings, (slot.caseState && slot.caseState.settings) || {}),
    });
    saveCaseState();
    return slot;
  },
  listSlots() {
    const slots = loadSaveSlots();
    const list = [];
    for (let i = 1; i <= CASE_SAVE_SLOT_COUNT; i++) list.push(slots[i] ? Object.assign({ slotNum: i, occupied: true }, slots[i]) : { slotNum: i, occupied: false });
    return list;
  },

  /* ===== 설정 ===== */
  getSettings() { return Object.assign({}, caseState.settings); },
  setSetting(key, value) {
    caseState.settings[key] = value;
    saveCaseState();
  },

  /* ===== 배지 카운트 (섹션 37 — 단일 숫자) ===== */
  getInvestigationBadgeCount() {
    return caseState.evidence.filter(e => e.status === 'new').length + caseState.questions.filter(q => q.isNew).length;
  },

  /* ===== DEV debug: CLEAR CASE DATA — resets case data only, leaves save slots untouched ===== */
  resetAll() {
    caseState = defaultCaseState();
    saveCaseState();
  },
};
