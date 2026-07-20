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
    // 2주차 장편 확장 v2 §22 — generic string-keyed bag backing both
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

/* 주차 재번호화 마이그레이션 (2026-07) — 0주차/week0가 1주차/week1로,
   1주차/week1가 2주차/week2로, 2주차/week2가 3주차/week3로 전부 밀렸다
   (구 3주차 "사라진 원본 열쇠"는 이번 개편에서 완전히 삭제됨). 개편 전
   id 체계로 저장된 기존 세이브를 새 체계로 옮겨준다.

   isLegacyPreRenumberSave가 유일하게 기대는 신호는 'week0-' 접두 sceneId의
   존재다 — 0주차(프롤로그)는 게임의 맨 처음이라 조금이라도 진행한 세이브는
   반드시 이 접두어를 최소 하나는 갖고 있고, 개편 이후에는 'week0-'라는
   접두어 자체가 다시는 생성되지 않으므로(새 프롤로그는 'week1-') 오탐 없이
   "개편 전 세이브"만 골라낸다. 'week3-'만으로는 판별할 수 없다 — 개편 전
   에는 삭제된 옛 3주차를, 개편 후에는 새 3주차(구 2주차)를 가리켜 의미가
   달라지기 때문에 사용하지 않는다. */
function isLegacyPreRenumberSave(caseStateRaw, sceneId) {
  const visited = (caseStateRaw && caseStateRaw.visitedSceneIds) || [];
  if (visited.some(id => typeof id === 'string' && id.startsWith('week0-'))) return true;
  if (typeof sceneId === 'string' && sceneId.startsWith('week0-')) return true;
  const flags = (caseStateRaw && caseStateRaw.flags) || {};
  return Object.prototype.hasOwnProperty.call(flags, 'week0Completed')
    || Object.prototype.hasOwnProperty.call(flags, 'week0MapMinigameCleared');
}

// 구 3주차(삭제됨)에 멈춰있던 세이브의 대체 재개 지점 — 새 3주차(구 2주차)
// 종료 지점 바로 다음, 4주차 시작 씬으로 보낸다.
const LEGACY_WEEK3_FALLBACK_SCENE_ID = 'week4-scene-001';

function migrateLegacySceneId(id) {
  if (typeof id !== 'string') return id;
  if (id.startsWith('week0-')) return 'week1-' + id.slice('week0-'.length);
  if (id.startsWith('week1-')) return 'week2-' + id.slice('week1-'.length);
  if (id.startsWith('week2-')) return 'week3-' + id.slice('week2-'.length);
  if (id.startsWith('week3-')) return null; // 구 3주차 — 삭제됨, 호출부에서 폴백 처리
  return id;
}
function migrateLegacySceneIdList(ids) {
  if (!Array.isArray(ids)) return ids;
  return ids
    .map(migrateLegacySceneId)
    .filter(id => id !== null); // 구 3주차 방문 기록은 더 이상 참조할 콘텐츠가 없으므로 제거
}
// flags/reward id처럼 접두어가 아니라 문자열 중간에 주차 토큰이 박힌 값용.
function migrateLegacyWeekToken(str) {
  if (typeof str !== 'string') return str;
  if (str.includes('week0')) return str.replace('week0', 'week1');
  if (str.includes('week1')) return str.replace('week1', 'week2');
  if (str.includes('week2')) return str.replace('week2', 'week3');
  return str;
}
function migrateLegacyFlags(flags) {
  const out = {};
  Object.keys(flags || {}).forEach(key => { out[migrateLegacyWeekToken(key)] = flags[key]; });
  return out;
}
// 탐색 허브 phase 상수(W1_TOURISM 등)·장소/토픽 id(w1-circular-quay,
// w1cq-topic-ferries 등) 전용 — 개편 전에는 1주차(week1)만 이 체계를 썼으므로
// 옮겨줄 옛 토큰도 W1_/w1- 하나뿐이다.
function migrateLegacyPhaseOrLocationToken(str) {
  if (typeof str !== 'string') return str;
  if (/^W1_/.test(str)) return str.replace(/^W1_/, 'W2_');
  if (/^w1[a-z]{2}-/.test(str)) return str.replace(/^w1([a-z]{2})-/, 'w2$1-');
  if (/^w1-/.test(str)) return str.replace(/^w1-/, 'w2-');
  return str;
}
function migrateLegacyExplorationSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return snapshot;
  const out = Object.assign({}, snapshot);
  if (out.currentPhase) out.currentPhase = migrateLegacyPhaseOrLocationToken(out.currentPhase);
  if (out.currentLocationId) out.currentLocationId = migrateLegacyPhaseOrLocationToken(out.currentLocationId);
  if (Array.isArray(out.unlockedLocationIds)) out.unlockedLocationIds = out.unlockedLocationIds.map(migrateLegacyPhaseOrLocationToken);
  if (Array.isArray(out.visitedLocationIds)) out.visitedLocationIds = out.visitedLocationIds.map(migrateLegacyPhaseOrLocationToken);
  if (Array.isArray(out.completedInteractionIds)) out.completedInteractionIds = out.completedInteractionIds.map(migrateLegacyPhaseOrLocationToken);
  if (out.interactionOverrides && typeof out.interactionOverrides === 'object') {
    const overrides = {};
    Object.keys(out.interactionOverrides).forEach(key => { overrides[migrateLegacyPhaseOrLocationToken(key)] = out.interactionOverrides[key]; });
    out.interactionOverrides = overrides;
  }
  return out;
}
function migrateLegacyEconomySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return snapshot;
  const out = Object.assign({}, snapshot);
  if (out.rewardClaims && typeof out.rewardClaims === 'object') {
    const claims = {};
    Object.keys(out.rewardClaims).forEach(key => { claims[migrateLegacyWeekToken(key)] = out.rewardClaims[key]; });
    out.rewardClaims = claims;
  }
  return out;
}

function loadCaseState() {
  try {
    const raw = JSON.parse(localStorage.getItem(CASE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultCaseState();
    const isLegacy = isLegacyPreRenumberSave(raw, null);
    return Object.assign(defaultCaseState(), raw, {
      settings: Object.assign(defaultCaseState().settings, raw.settings || {}),
      flags: isLegacy ? migrateLegacyFlags(raw.flags || {}) : Object.assign({}, raw.flags || {}),
      hypothesisDefs: Object.assign({}, raw.hypothesisDefs || {}),
      currentHypotheses: Object.assign({}, raw.currentHypotheses || {}),
      hypothesisHistory: Object.assign({}, raw.hypothesisHistory || {}),
      testimonyHistory: Object.assign({}, raw.testimonyHistory || {}),
      evidenceStages: Object.assign({}, raw.evidenceStages || {}),
      evidence: migrateEvidenceIds(raw.evidence || []),
      visitedSceneIds: isLegacy ? migrateLegacySceneIdList(raw.visitedSceneIds || []) : (raw.visitedSceneIds || []),
    });
  } catch (e) { return defaultCaseState(); }
}

const CASE_STATE_IS_FRESH_DEVICE = !localStorage.getItem(CASE_STATE_KEY);
let caseState = loadCaseState();
function saveCaseState() { localStorage.setItem(CASE_STATE_KEY, JSON.stringify(caseState)); }

// New device / reinstalled / storage-cleared browser (no local case state at
// all yet) — pull down whatever settings were last saved from another
// device instead of starting from hardcoded defaults. Runs once at load;
// deliberately skipped on a device that already has local state so it can't
// stomp a setting the player just changed on THIS device with a stale
// server copy (see setSetting above for the write side of this sync).
if (CASE_STATE_IS_FRESH_DEVICE) {
  AssetDB.getPlayerSettings().then(serverSettings => {
    if (!serverSettings) return;
    caseState.settings = Object.assign({}, caseState.settings, serverSettings);
    saveCaseState();
  }).catch(() => {});
}

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
  // (e.g. 2주차 §10-11: suspect -> cleared -> reopened -> involved). `patch`
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
  // "already finished 1주차 before the economy system existed" (see
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
     load those three scripts (most minigames, /dev/week1, etc.) still load
     this file and must not throw on save/load.

     Slots are now mirrored to AssetDB (Supabase) so a save survives losing
     this device / this browser's storage getting cleared / reinstalling —
     the same problem addAsset's header comment describes for images, just
     for progress instead. localStorage stays as an immediate, offline-safe
     local copy: saveSlot writes it first (a save must never be lost just
     because the network call after it fails), and loadSlot/listSlots prefer
     whichever copy (server vs local) has the newer updatedAt, since a slot
     saved while offline can be locally newer than what's on the server. */
  async saveSlot(slotNum, extra) {
    const slot = Object.assign({
      caseState: JSON.parse(JSON.stringify(caseState)),
      economyState: (typeof EconomyState !== 'undefined') ? EconomyState.snapshot() : undefined,
      shopState: (typeof ShopState !== 'undefined') ? ShopState.snapshot() : undefined,
      wardrobeState: (typeof WardrobeState !== 'undefined') ? WardrobeState.snapshot() : undefined,
      explorationState: (typeof ExplorationState !== 'undefined') ? ExplorationState.snapshot() : undefined,
      relationshipState: (typeof RelationshipState !== 'undefined') ? RelationshipState.snapshot() : undefined,
      updatedAt: Date.now(),
    }, extra);
    const slots = loadSaveSlots();
    slots[slotNum] = slot;
    localStorage.setItem(CASE_SAVE_SLOTS_KEY, JSON.stringify(slots));
    try { await AssetDB.setSaveSlot(slotNum, slot); }
    catch (e) { /* offline/server unavailable — the local copy above still holds the save */ }
    return slot;
  },
  async loadSlot(slotNum) {
    const localSlot = loadSaveSlots()[slotNum] || null;
    let serverSlot = null;
    try { serverSlot = (await AssetDB.getSaveSlots())[slotNum] || null; }
    catch (e) { /* offline/server unavailable — fall back to the local copy */ }
    const slot = (serverSlot && (!localSlot || (serverSlot.updatedAt || 0) >= (localSlot.updatedAt || 0))) ? serverSlot : localSlot;
    if (!slot) return null;
    const isLegacy = isLegacyPreRenumberSave(slot.caseState, slot.sceneId);
    if (isLegacy) {
      slot.sceneId = migrateLegacySceneId(slot.sceneId) || LEGACY_WEEK3_FALLBACK_SCENE_ID;
    }
    caseState = Object.assign(defaultCaseState(), slot.caseState, {
      settings: Object.assign(defaultCaseState().settings, (slot.caseState && slot.caseState.settings) || {}),
      flags: isLegacy ? migrateLegacyFlags((slot.caseState && slot.caseState.flags) || {}) : Object.assign({}, (slot.caseState && slot.caseState.flags) || {}),
      hypothesisDefs: Object.assign({}, (slot.caseState && slot.caseState.hypothesisDefs) || {}),
      currentHypotheses: Object.assign({}, (slot.caseState && slot.caseState.currentHypotheses) || {}),
      hypothesisHistory: Object.assign({}, (slot.caseState && slot.caseState.hypothesisHistory) || {}),
      testimonyHistory: Object.assign({}, (slot.caseState && slot.caseState.testimonyHistory) || {}),
      evidenceStages: Object.assign({}, (slot.caseState && slot.caseState.evidenceStages) || {}),
      evidence: migrateEvidenceIds((slot.caseState && slot.caseState.evidence) || []),
      visitedSceneIds: isLegacy
        ? migrateLegacySceneIdList((slot.caseState && slot.caseState.visitedSceneIds) || [])
        : ((slot.caseState && slot.caseState.visitedSceneIds) || []),
    });
    saveCaseState();
    if (typeof EconomyState !== 'undefined' && slot.economyState) {
      EconomyState.restore(isLegacy ? migrateLegacyEconomySnapshot(slot.economyState) : slot.economyState);
    }
    if (typeof ShopState !== 'undefined' && slot.shopState) ShopState.restore(slot.shopState);
    if (typeof WardrobeState !== 'undefined' && slot.wardrobeState) WardrobeState.restore(slot.wardrobeState);
    if (typeof ExplorationState !== 'undefined' && slot.explorationState) {
      ExplorationState.restore(isLegacy ? migrateLegacyExplorationSnapshot(slot.explorationState) : slot.explorationState);
    }
    if (typeof RelationshipState !== 'undefined' && slot.relationshipState) RelationshipState.restore(slot.relationshipState);
    // slot came from local-only (server was behind or unreachable) — push it
    // up so the server catches up instead of staying stale until next save.
    if (slot === localSlot && (!serverSlot || (localSlot.updatedAt || 0) > (serverSlot.updatedAt || 0))) {
      AssetDB.setSaveSlot(slotNum, localSlot).catch(() => {});
    }
    return slot;
  },
  async listSlots() {
    const localSlots = loadSaveSlots();
    let serverSlots = {};
    try { serverSlots = await AssetDB.getSaveSlots(); }
    catch (e) { /* offline/server unavailable — fall back to local */ }
    const list = [];
    for (let i = 1; i <= CASE_SAVE_SLOT_COUNT; i++) {
      const local = localSlots[i] || null;
      const server = serverSlots[i] || null;
      const slot = (server && (!local || (server.updatedAt || 0) >= (local.updatedAt || 0))) ? server : local;
      list.push(slot ? Object.assign({ slotNum: i, occupied: true }, slot) : { slotNum: i, occupied: false });
      // Backfill the server with a locally-newer slot it doesn't know about yet
      // (e.g. saved while offline) — best-effort, doesn't block rendering the list.
      if (local && slot === local && (!server || (local.updatedAt || 0) > (server.updatedAt || 0))) {
        AssetDB.setSaveSlot(i, local).catch(() => {});
      }
    }
    return list;
  },
  // Synchronous, local-only counterpart to listSlots — caseMenu.js's render()
  // is all synchronous (a menu open/nav push can't await a network round
  // trip), so the 저장/불러오기 screens paint instantly from this while a
  // background listSlots() call refreshes them with the server-merged view.
  listSlotsLocalSync() {
    const localSlots = loadSaveSlots();
    const list = [];
    for (let i = 1; i <= CASE_SAVE_SLOT_COUNT; i++) list.push(localSlots[i] ? Object.assign({ slotNum: i, occupied: true }, localSlots[i]) : { slotNum: i, occupied: false });
    return list;
  },

  /* ===== 설정 =====
     textSpeed/sfx/bgm/vibration은 caseState 안에 있지만 저장 슬롯("저장하기"
     명시적 액션)과 별개로, 바뀔 때마다 바로 서버에도 올라간다 — 다른
     기기에서도 같은 환경설정으로 시작하기 위함. 부팅 시엔 이 기기에 caseState
     저장 기록이 아예 없을 때(새 기기/재설치)만 서버 값으로 덮어써서, 이미
     플레이 중인 기기의 방금 바꾼 설정을 부팅 타이밍에 되돌리는 일이 없게
     한다. */
  getSettings() { return Object.assign({}, caseState.settings); },
  setSetting(key, value) {
    caseState.settings[key] = value;
    saveCaseState();
    AssetDB.setPlayerSettings(caseState.settings).catch(() => {});
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
