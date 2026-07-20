/* OPERATION MK DEV — 여행 만족도 / 영우 호감도 게이지.
   Same idiom as EconomyState (economyState.js): a plain global object, one
   JSON blob in localStorage, defensive Object.assign-onto-defaults on load.

   Design rule (연출용 결정 — 상시 표시하되 스토리/엔딩 분기에는 절대 관여하지
   않음): 이 두 게이지는 순수 캐릭터 연출용이다. 값에 따라 대사나 씬 분기를
   바꾸지 않는다 — 그냥 선택지가 지수/영우다움을 어떻게 표현했는지 보여주는
   장식적 피드백. 그래서 EconomyState의 rewardClaims/chapterCaps 같은 중복
   지급 방지 장치가 없다 — 선택지는 세이브 한 판에서 한 번만 지나가는 노드라
   포인트처럼 "같은 보상을 두 번 받는" 시나리오 자체가 없다. */

const RELATIONSHIP_STATE_KEY = 'mkRelationshipState_v1';
const GAUGE_MIN = 0;
const GAUGE_MAX = 100;
const GAUGE_DEFAULT = 50; // 중립값 — 선택지에 따라 위아래로 움직임

function defaultRelationshipState() {
  return {
    satisfaction: GAUGE_DEFAULT,
    affection: GAUGE_DEFAULT,
  };
}

function clampGauge(value) {
  return Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, value));
}

function loadRelationshipState() {
  try {
    const raw = JSON.parse(localStorage.getItem(RELATIONSHIP_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultRelationshipState();
    return Object.assign(defaultRelationshipState(), raw);
  } catch (e) { return defaultRelationshipState(); }
}

let relationshipState = loadRelationshipState();
function saveRelationshipState() { localStorage.setItem(RELATIONSHIP_STATE_KEY, JSON.stringify(relationshipState)); }

const RelationshipState = {
  getSatisfaction() { return relationshipState.satisfaction; },
  getAffection() { return relationshipState.affection; },

  addSatisfaction(amount) {
    if (!amount) return relationshipState.satisfaction;
    relationshipState.satisfaction = clampGauge(relationshipState.satisfaction + amount);
    saveRelationshipState();
    return relationshipState.satisfaction;
  },
  addAffection(amount) {
    if (!amount) return relationshipState.affection;
    relationshipState.affection = clampGauge(relationshipState.affection + amount);
    saveRelationshipState();
    return relationshipState.affection;
  },

  /* ===== 저장/불러오기 연동 — CaseFileState.saveSlot/loadSlot wraps this via
     a snapshot/restore pair, same pattern as EconomyState. */
  snapshot() { return JSON.parse(JSON.stringify(relationshipState)); },
  restore(snapshot) {
    relationshipState = Object.assign(defaultRelationshipState(), snapshot || {});
    saveRelationshipState();
  },

  /* ===== DEV debug ===== */
  resetAll() {
    relationshipState = defaultRelationshipState();
    saveRelationshipState();
  },
};
