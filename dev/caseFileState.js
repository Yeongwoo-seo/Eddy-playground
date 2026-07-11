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
    // 1주차 장편 확장 v2 §22 — generic string-keyed bag backing both
    // interrogationState (e.g. 'wrong:leo-c1', 'round:leo') and
    // investigationState (e.g. 'hotspot:003:k01', 'optionalCount:003') so
    // authors don't need a bespoke schema per scene; see setFlag/getFlag/
    // hasFlag/incrementFlag below and the 'setFlag' effect in game/index.html.
    flags: {},
    settings: { textSpeed: 'normal', sfx: true, bgm: true, vibration: true },
    // The Missing Key v4 §6/§17 — 추론(가설/추론 사실) 시스템. hypothesisDefs
    // is a write-once catalog (id -> {id, questionId, text}) populated the
    // first time a scene's `setHypothesis` effect references it, mirroring
    // how addEvidence/addQuestion take their full content inline rather than
    // pointing at a second static catalog. currentHypotheses/hypothesisHistory
    // are keyed by questionId; a question can go through several hypotheses
    // over the story (§6.4) without losing the earlier, since-invalidated ones.
    hypothesisDefs: {},
    currentHypotheses: {},
    hypothesisHistory: {},
    facts: [],
    // The Missing Key v5 §5 — 여행 코인. 미니게임/챕터 보상으로 얻어 상점에서
    // 쓰는 메타 재화이며 실제 호주 달러와 동일시하지 않는다(§5.1).
    playerEconomy: { tripCoin: 0, totalEarned: 0, totalSpent: 0, rewardHistory: [], purchaseHistory: [] },
    // v5 §6 — 옷장·아바타. 구매한 의상은 영구 보유되고, 착용 중인 의상은
    // 대사 엔진이 감정과 조합해 자동으로 스프라이트 키를 고른다(§6.5).
    avatarState: {
      jisoo: { currentOutfitId: 'jisoo-outfit-default', ownedOutfitIds: ['jisoo-outfit-default'], ownedAccessoryIds: [], outfitHistory: [] },
      youngwoo: { currentOutfitId: 'youngwoo-outfit-default', ownedOutfitIds: ['youngwoo-outfit-default'] },
    },
    // v5 §8 — 데이트 추억. memoryDefs는 hypothesisDefs와 같은 write-once
    // 카탈로그(id -> 전체 내용)이고, memoryAlbum은 그중 해금된 id만 추적한다.
    memoryAlbum: { unlockedMemoryIds: [], selectedPhotoIds: [], favoriteMemoryId: null },
    memoryDefs: {},
    // v5 §9 — 관계성. 숫자는 화면에 노출하지 않고(§9.1) 이후 분기 조건으로만 쓴다.
    relationshipState: { affection: 0, trust: 0, playfulness: 0, sharedMemories: 0 },
    // v5 §26 — 전시장 자유 관람 기록. 사건 전 무엇을 봤는지로 사건 후 조사
    // 대사를 분기시킨다.
    galleryVisitState: {
      visitedSections: [],
      inspectedItemIds: [],
      talkedToAdrian: false,
      sawStaffTag: false,
      sawStaffDoor: false,
      inspectedK01Features: [],
      completedAllOptionalSections: false,
    },
  };
}

// Shared by loadCaseState (localStorage) and loadSlot (save slots) — both
// need the same defensive Object.assign-onto-defaults so a field added
// after a save was written can't crash loading it back (see file header).
function mergeCaseState(raw) {
  raw = raw || {};
  const d = defaultCaseState();
  return Object.assign(d, raw, {
    settings: Object.assign(d.settings, raw.settings || {}),
    flags: Object.assign({}, raw.flags || {}),
    hypothesisDefs: Object.assign({}, raw.hypothesisDefs || {}),
    currentHypotheses: Object.assign({}, raw.currentHypotheses || {}),
    hypothesisHistory: Object.assign({}, raw.hypothesisHistory || {}),
    playerEconomy: Object.assign(d.playerEconomy, raw.playerEconomy || {}),
    avatarState: {
      jisoo: Object.assign(d.avatarState.jisoo, (raw.avatarState && raw.avatarState.jisoo) || {}),
      youngwoo: Object.assign(d.avatarState.youngwoo, (raw.avatarState && raw.avatarState.youngwoo) || {}),
    },
    memoryAlbum: Object.assign(d.memoryAlbum, raw.memoryAlbum || {}),
    memoryDefs: Object.assign({}, raw.memoryDefs || {}),
    relationshipState: Object.assign(d.relationshipState, raw.relationshipState || {}),
    galleryVisitState: Object.assign(d.galleryVisitState, raw.galleryVisitState || {}),
  });
}

function loadCaseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(CASE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultCaseState();
    return mergeCaseState(raw);
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

  /* ===== 추론 (가설 / 추론 사실) — The Missing Key v4 §6/§17 =====
     "게임이 강제로 바꾸지 않는다" (§14.1): setHypothesis never marks a prior
     entry invalidated on its own — a scene only does that explicitly via
     invalidateCurrentHypothesis, typically from a player's own "폐기한다"
     choice, so a wrong belief can survive right up to the ending if the
     player insists on it. */
  setHypothesis(questionId, hypothesis) {
    if (!caseState.hypothesisDefs[hypothesis.id]) caseState.hypothesisDefs[hypothesis.id] = hypothesis;
    caseState.currentHypotheses[questionId] = hypothesis.id;
    // Also mirrored into the generic flags bag (§22 idiom) as 'hyp:<questionId>'
    // so dialogue authors can gate a choice on the exact current hypothesis
    // via the `flagEquals` condition (see evaluateCondition in game/index.html)
    // without vnPlayer.js or caseFileState needing a bespoke condition type.
    caseState.flags['hyp:' + questionId] = hypothesis.id;
    if (!caseState.hypothesisHistory[questionId]) caseState.hypothesisHistory[questionId] = [];
    caseState.hypothesisHistory[questionId].push({
      hypothesisId: hypothesis.id, selectedAt: Date.now(), invalidatedAt: null, invalidatedBy: null, status: 'current',
    });
    saveCaseState();
  },
  getCurrentHypothesis(questionId) {
    const id = caseState.currentHypotheses[questionId];
    return id ? caseState.hypothesisDefs[id] : null;
  },
  getHypothesisHistory(questionId) {
    return (caseState.hypothesisHistory[questionId] || []).map(h => Object.assign({}, h, { hypothesis: caseState.hypothesisDefs[h.hypothesisId] || null }));
  },
  // Marks the *current* (latest, still-"current"-status) history entry for
  // this question as invalidated by the given fact — a no-op if there's no
  // current entry (e.g. the effect fired before any hypothesis was ever set).
  invalidateCurrentHypothesis(questionId, factId) {
    const hist = caseState.hypothesisHistory[questionId];
    if (!hist || !hist.length) return;
    const last = hist[hist.length - 1];
    if (last.status !== 'current') return;
    last.status = 'invalidated';
    last.invalidatedAt = Date.now();
    last.invalidatedBy = factId || null;
    saveCaseState();
  },

  /* ===== 추론 사실 (증거 연결로 생성됨) ===== */
  addFact(fact) {
    if (caseState.facts.some(f => f.id === fact.id)) return false;
    caseState.facts.push(Object.assign({ sourceEvidenceIds: [], relatedQuestionIds: [], createdAt: Date.now() }, fact));
    saveCaseState();
    return true;
  },
  getFacts() { return caseState.facts.slice(); },
  getFactsForQuestion(questionId) { return caseState.facts.filter(f => (f.relatedQuestionIds || []).includes(questionId)); },

  /* ===== 여행 재화 (v5 §5) ===== */
  addCurrency(amount, reason) {
    caseState.playerEconomy.tripCoin += amount;
    caseState.playerEconomy.totalEarned += amount;
    caseState.playerEconomy.rewardHistory.push({ amount, reason: reason || null, at: Date.now() });
    saveCaseState();
  },
  // Returns false rather than throwing when short — a choice's own
  // `currencyAtLeast` condition (evaluateCondition in game/index.html) is
  // what should keep an unaffordable purchase from being offered at all;
  // this is just the second guard in case an effect fires without one.
  spendCurrency(amount, itemId) {
    if (caseState.playerEconomy.tripCoin < amount) return false;
    caseState.playerEconomy.tripCoin -= amount;
    caseState.playerEconomy.totalSpent += amount;
    caseState.playerEconomy.purchaseHistory.push({ amount, itemId: itemId || null, at: Date.now() });
    saveCaseState();
    return true;
  },
  getCurrency() { return caseState.playerEconomy.tripCoin; },
  hasCurrency(amount) { return caseState.playerEconomy.tripCoin >= amount; },

  /* ===== 옷장 · 아바타 (v5 §6) ===== */
  unlockOutfit(characterId, outfitId) {
    const c = caseState.avatarState[characterId];
    if (!c || c.ownedOutfitIds.includes(outfitId)) return false;
    c.ownedOutfitIds.push(outfitId);
    c.outfitHistory = c.outfitHistory || [];
    c.outfitHistory.push({ outfitId, unlockedAt: Date.now() });
    saveCaseState();
    return true;
  },
  equipOutfit(characterId, outfitId) {
    const c = caseState.avatarState[characterId];
    if (!c || !c.ownedOutfitIds.includes(outfitId)) return false;
    c.currentOutfitId = outfitId;
    saveCaseState();
    return true;
  },
  unlockAccessory(characterId, accessoryId) {
    const c = caseState.avatarState[characterId];
    if (!c) return false;
    c.ownedAccessoryIds = c.ownedAccessoryIds || [];
    if (c.ownedAccessoryIds.includes(accessoryId)) return false;
    c.ownedAccessoryIds.push(accessoryId);
    saveCaseState();
    return true;
  },
  getCurrentOutfit(characterId) {
    const c = caseState.avatarState[characterId];
    return c ? c.currentOutfitId : null;
  },
  // Outfit ids are globally unique (e.g. 'jisoo-outfit-...') so a shop
  // choice's `notOwned` condition (§7.2's shop-blue-preview example) doesn't
  // need to also name the character — just check every wardrobe.
  ownsOutfit(outfitId) {
    return Object.keys(caseState.avatarState).some(cid => caseState.avatarState[cid].ownedOutfitIds.includes(outfitId));
  },
  getAvatarState(characterId) { return Object.assign({}, caseState.avatarState[characterId]); },

  /* ===== 데이트 추억 (v5 §8) — memoryDefs는 hypothesisDefs와 같은
     write-once 카탈로그(defaultCaseState의 hypothesisDefs 주석 참고): 씬이
     매번 전체 추억 데이터를 effect에 인라인으로 담아 보낸다. ===== */
  unlockMemory(memory) {
    if (caseState.memoryAlbum.unlockedMemoryIds.includes(memory.id)) return false;
    caseState.memoryDefs[memory.id] = memory;
    caseState.memoryAlbum.unlockedMemoryIds.push(memory.id);
    saveCaseState();
    return true;
  },
  getMemories() {
    return caseState.memoryAlbum.unlockedMemoryIds.map(id => caseState.memoryDefs[id]).filter(Boolean);
  },
  hasMemory(id) { return caseState.memoryAlbum.unlockedMemoryIds.includes(id); },
  selectMemoryPhoto(id) {
    if (caseState.memoryAlbum.selectedPhotoIds.includes(id)) return;
    caseState.memoryAlbum.selectedPhotoIds.push(id);
    saveCaseState();
  },
  setFavoriteMemory(id) {
    caseState.memoryAlbum.favoriteMemoryId = id;
    saveCaseState();
  },

  /* ===== 관계성 (v5 §9) — 숫자는 화면에 노출하지 않는다(§9.1). ===== */
  adjustRelationship(stat, amount) {
    if (!(stat in caseState.relationshipState)) return;
    caseState.relationshipState[stat] += amount;
    saveCaseState();
  },
  getRelationshipState() { return Object.assign({}, caseState.relationshipState); },

  /* ===== 전시장 관람 기록 (v5 §26) ===== */
  visitGallerySection(id) {
    if (caseState.galleryVisitState.visitedSections.includes(id)) return false;
    caseState.galleryVisitState.visitedSections.push(id);
    saveCaseState();
    return true;
  },
  inspectGalleryItem(id) {
    if (caseState.galleryVisitState.inspectedItemIds.includes(id)) return false;
    caseState.galleryVisitState.inspectedItemIds.push(id);
    saveCaseState();
    return true;
  },
  inspectK01Feature(id) {
    if (caseState.galleryVisitState.inspectedK01Features.includes(id)) return false;
    caseState.galleryVisitState.inspectedK01Features.push(id);
    saveCaseState();
    return true;
  },
  // Generic boolean setter for the flat flags in §26's schema
  // (talkedToAdrian/sawStaffTag/sawStaffDoor/completedAllOptionalSections)
  // instead of one bespoke method per flag.
  setGalleryFlag(key) {
    if (!(key in caseState.galleryVisitState)) return;
    caseState.galleryVisitState[key] = true;
    saveCaseState();
  },
  getGalleryVisitState() { return Object.assign({}, caseState.galleryVisitState); },

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
    caseState = mergeCaseState(slot.caseState);
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

  /* ===== 플래그 (interrogationState / investigationState 겸용, §22) ===== */
  setFlag(key, value) { caseState.flags[key] = value === undefined ? true : value; saveCaseState(); },
  getFlag(key) { return caseState.flags[key]; },
  hasFlag(key) { return !!caseState.flags[key]; },
  incrementFlag(key) {
    caseState.flags[key] = (Number(caseState.flags[key]) || 0) + 1;
    saveCaseState();
    return caseState.flags[key];
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
