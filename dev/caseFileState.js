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
    // CaseEntry 재설계 (§6.4/§7.5) — 증언 수정 이력과 신규 API로 추가되는
    // 조사 단계는 hypothesisHistory와 동일한 "id -> 버전 배열" 관용구를
    // 그대로 쓴다. 레거시 증언/증거(§Phase 1~2 카탈로그로 병합되는 것들)는
    // 여기 값이 비어 있어도 caseEntryModel.js가 description으로부터 버전
    // 1을 즉석 합성하므로 상세 화면이 깨지지 않는다.
    testimonyHistory: {},
    evidenceStages: {},
  };
}

/* 증거 DB 노트 v1.1 §5.1 — id 충돌 마이그레이션. 같은 id로 서로 다른 내용이
   등록됐던 항목(예: 'evidence-k01-not-for-sale'가 인터랙션 허브의 팸플릿
   증거와 마틴 베일 통화 증언 두 곳에 다르게 정의됐던 문제, addEvidence는
   id 중복 시 무시하므로 플레이 순서에 따라 카드 내용이 달라졌다)을 정의
   자체는 각각 새 id로 분리해두고(interactionDefs.js/dialogueData.js 참고),
   기존 세이브에 남아있는 옛 id 항목은 로드 시 실제 저장된 내용(category/
   title)으로 판별해 올바른 새 id로 옮겨준다. 게이트 판정(hasEvidence)이나
   evidenceIds 제시 판정에는 이 옛 id가 애초에 참조되지 않으므로 이 이관은
   진행 조건에 영향을 주지 않는다. */
const EVIDENCE_ID_MIGRATIONS = [
  {
    staleId: 'evidence-k01-not-for-sale',
    resolve(item) {
      const haystack = [item.title, item.description, item.category].filter(Boolean).join(' ');
      if (item.category === 'testimony' || /마틴|진술|대여/.test(haystack)) {
        return 'evidence-martin-not-for-sale-testimony';
      }
      return 'evidence-k01-pamphlet-not-for-sale';
    },
  },
];
function migrateEvidenceIds(evidenceList) {
  if (!Array.isArray(evidenceList) || !evidenceList.length) return evidenceList;
  return evidenceList.map(item => {
    const migration = EVIDENCE_ID_MIGRATIONS.find(m => m.staleId === item.id);
    if (!migration) return item;
    return Object.assign({}, item, { id: migration.resolve(item) });
  });
}

function loadCaseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(CASE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultCaseState();
    return Object.assign(defaultCaseState(), raw, {
      settings: Object.assign(defaultCaseState().settings, raw.settings || {}),
      flags: Object.assign({}, raw.flags || {}),
      hypothesisDefs: Object.assign({}, raw.hypothesisDefs || {}),
      currentHypotheses: Object.assign({}, raw.currentHypotheses || {}),
      hypothesisHistory: Object.assign({}, raw.hypothesisHistory || {}),
      testimonyHistory: Object.assign({}, raw.testimonyHistory || {}),
      evidenceStages: Object.assign({}, raw.evidenceStages || {}),
      evidence: migrateEvidenceIds(raw.evidence || []),
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
      category: 'etc',
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
  // 같은 원본을 다시 조사해 얻은 새 정보를 새 카드 없이 기존 카드에 반영
  // (§7.5). addStage는 caseEntryModel.js가 합성하는 stages[] 앞이 아니라
  // 뒤에 이어 붙는다 — 카탈로그로 병합된 레거시 조사 단계(과거) 다음에
  // 신규 API로 추가되는 단계(현재)가 오도록.
  updateEvidence(id, { summary, status, addStage } = {}) {
    const item = caseState.evidence.find(e => e.id === id);
    if (!item) return false;
    if (summary !== undefined) item.description = summary;
    if (status !== undefined) item.status = status;
    if (addStage) {
      if (!caseState.evidenceStages[id]) caseState.evidenceStages[id] = [];
      caseState.evidenceStages[id].push(Object.assign({ unlocked: true, addedAt: Date.now() }, addStage));
    }
    saveCaseState();
    return true;
  },
  getEvidenceStages(id) { return (caseState.evidenceStages[id] || []).slice(); },

  /* ===== 증언 수정 이력 (§6.4/§7.5) — hypothesisHistory와 동일한 패턴:
     새 카드를 만들지 않고 같은 id 안에 버전을 쌓는다. 레거시 증언(이미
     addEvidence로 들어온 category:'testimony')에도 그대로 쓸 수 있다 —
     evidenceId만 기존 증거 id를 가리키면 된다. */
  reviseTestimony(evidenceId, { statement, reason, status, sceneId } = {}) {
    const item = caseState.evidence.find(e => e.id === evidenceId);
    if (!item) return false;
    if (!caseState.testimonyHistory[evidenceId]) {
      // 최초 호출이면 기존 description을 버전 1로 먼저 채워, 이번 수정이
      // 버전 2부터 시작하도록 한다 (기존 발언을 이력에서 잃지 않기 위함).
      caseState.testimonyHistory[evidenceId] = [{
        version: 1, statement: item.description || '', reason: '최초 진술', sceneId: null, active: false, revisedAt: item.discoveredAt || Date.now(),
      }];
    }
    const hist = caseState.testimonyHistory[evidenceId];
    hist.forEach(h => { h.active = false; });
    hist.push({ version: hist.length + 1, statement, reason: reason || '', sceneId: sceneId || null, active: true, revisedAt: Date.now() });
    item.description = statement;
    item.status = status || 'revised';
    saveCaseState();
    return true;
  },
  getTestimonyHistory(evidenceId) { return (caseState.testimonyHistory[evidenceId] || []).slice(); },

  /* ===== 추리 메모 해결 (§7.5) ===== */
  resolveMemo(id, { resolution } = {}) {
    return this.setQuestionStatus(id, 'resolved', resolution);
  },

  /* ===== CaseEntry 통합 조회 (§Phase 1) — evidence/questions를 그대로 두고
     caseEntryModel.js에서 화면용으로 정규화한다. 신규 콘텐츠는 아래
     addCaseEntry를 쓰되, 내부적으로는 기존 addEvidence/addQuestion을 그대로
     호출한다 — addEvidence 자체의 동작은 바꾸지 않는다(§7.4 원칙, 기존
     58곳 호출부에 영향 없음). */
  getCaseEntries() {
    return CaseEntryModel.normalizeCaseFile({ evidence: caseState.evidence, questions: caseState.questions });
  },
  addCaseEntry(data) {
    if (data.kind === 'memo') {
      return this.addQuestion({ id: data.id, title: data.title, description: data.summary || data.description });
    }
    return this.addEvidence({
      id: data.id,
      code: data.code,
      category: data.kind === 'testimony' ? 'testimony' : (data.subtype || 'etc'),
      title: data.title,
      description: data.summary || data.description,
      discoveredLocationText: data.discoveredLocationText,
    });
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
  // The Missing Key v1 §16.2 — migration compensation reads this to detect
  // "already finished 0주차 before the economy system existed" (see
  // game/index.html's applyMigrationCompensation) without needing a new flag
  // that old saves could never have set.
  hasVisitedScene(sceneId) { return caseState.visitedSceneIds.includes(sceneId); },
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

  /* ===== 저장 / 불러오기 =====
     economy/shop/wardrobe state (The Missing Key v1 §16.1) live in their own
     localStorage keys (see economyState.js/shopState.js/wardrobeState.js),
     but a save *slot* still needs to snapshot them alongside caseState so
     "불러오기" restores points/purchases/equipped outfit too, not just the
     investigation board. Guarded with typeof checks since pages that don't
     load those three scripts (most minigames, /dev/week0, etc.) still load
     this file and must not throw on save/load. */
  saveSlot(slotNum, extra) {
    const slots = loadSaveSlots();
    slots[slotNum] = Object.assign({
      caseState: JSON.parse(JSON.stringify(caseState)),
      economyState: (typeof EconomyState !== 'undefined') ? EconomyState.snapshot() : undefined,
      shopState: (typeof ShopState !== 'undefined') ? ShopState.snapshot() : undefined,
      wardrobeState: (typeof WardrobeState !== 'undefined') ? WardrobeState.snapshot() : undefined,
      explorationState: (typeof ExplorationState !== 'undefined') ? ExplorationState.snapshot() : undefined,
      relationshipState: (typeof RelationshipState !== 'undefined') ? RelationshipState.snapshot() : undefined,
      updatedAt: Date.now(),
    }, extra);
    localStorage.setItem(CASE_SAVE_SLOTS_KEY, JSON.stringify(slots));
  },
  loadSlot(slotNum) {
    const slot = loadSaveSlots()[slotNum];
    if (!slot) return null;
    caseState = Object.assign(defaultCaseState(), slot.caseState, {
      settings: Object.assign(defaultCaseState().settings, (slot.caseState && slot.caseState.settings) || {}),
      flags: Object.assign({}, (slot.caseState && slot.caseState.flags) || {}),
      hypothesisDefs: Object.assign({}, (slot.caseState && slot.caseState.hypothesisDefs) || {}),
      currentHypotheses: Object.assign({}, (slot.caseState && slot.caseState.currentHypotheses) || {}),
      hypothesisHistory: Object.assign({}, (slot.caseState && slot.caseState.hypothesisHistory) || {}),
      testimonyHistory: Object.assign({}, (slot.caseState && slot.caseState.testimonyHistory) || {}),
      evidenceStages: Object.assign({}, (slot.caseState && slot.caseState.evidenceStages) || {}),
      evidence: migrateEvidenceIds((slot.caseState && slot.caseState.evidence) || []),
    });
    saveCaseState();
    if (typeof EconomyState !== 'undefined' && slot.economyState) EconomyState.restore(slot.economyState);
    if (typeof ShopState !== 'undefined' && slot.shopState) ShopState.restore(slot.shopState);
    if (typeof WardrobeState !== 'undefined' && slot.wardrobeState) WardrobeState.restore(slot.wardrobeState);
    if (typeof ExplorationState !== 'undefined' && slot.explorationState) ExplorationState.restore(slot.explorationState);
    if (typeof RelationshipState !== 'undefined' && slot.relationshipState) RelationshipState.restore(slot.relationshipState);
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
