/* MISSING KEY DEV — 2주차 조사 라이프 게이지.
   relationshipState.js와 같은 전역 객체 + localStorage 한 방 저장 idiom을
   쓰지만, 목적은 정반대다 — satisfaction/affection은 "절대 진행을 막지 않는
   순수 연출용"인 반면, 이 게이지는 0이 되면 실제로 게임오버(재도전) 판정을
   낸다. 심문 중 오답 증거 제시·오답 선택지처럼 명시적으로 "위험한" 행동에만
   붙는다 — 허브의 자유 '제시하기'(§8.2/§8.4, 오답 힌트만·페널티 없음)는
   설계상 이 게이지를 절대 건드리지 않는다. */

const LIFE_GAUGE_STATE_KEY = 'mkLifeGaugeState_v1';
const LIFE_GAUGE_MAX = 100;

// 경중(severity) 두 단계 — 정확한 배점 기준은 이 게이지를 실제로 붙이는
// 콘텐츠(심문 씬 저자)가 상황에 맞게 고르는 몫이라, 여기서는 "가벼운 오답"과
// "심각한 오답" 두 단계의 기본값만 정해둔다.
const LIFE_GAUGE_DAMAGE = { minor: 10, major: 25 };

function defaultLifeGaugeState() {
  return { value: LIFE_GAUGE_MAX };
}

function clampLife(value) {
  return Math.max(0, Math.min(LIFE_GAUGE_MAX, value));
}

function loadLifeGaugeState() {
  try {
    const raw = JSON.parse(localStorage.getItem(LIFE_GAUGE_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultLifeGaugeState();
    return Object.assign(defaultLifeGaugeState(), raw);
  } catch (e) { return defaultLifeGaugeState(); }
}

let lifeGaugeState = loadLifeGaugeState();
function saveLifeGaugeState() { localStorage.setItem(LIFE_GAUGE_STATE_KEY, JSON.stringify(lifeGaugeState)); }

const LifeGaugeState = {
  MAX: LIFE_GAUGE_MAX,
  DAMAGE: LIFE_GAUGE_DAMAGE,

  getValue() { return lifeGaugeState.value; },
  isDepleted() { return lifeGaugeState.value <= 0; },

  // severity: 'minor' | 'major' (알 수 없는 값은 minor로 취급). 실제로 값을
  // 깎고 저장까지 한 번에 한다 — 화면 쪽 연출(반짝임 후 딜레이 감소)은 호출부가
  // 반환된 from/to/amount로 직접 애니메이션한다(이 모듈은 순수 상태만 관리).
  damage(severity) {
    const amount = LIFE_GAUGE_DAMAGE[severity] || LIFE_GAUGE_DAMAGE.minor;
    const from = lifeGaugeState.value;
    const to = clampLife(from - amount);
    lifeGaugeState.value = to;
    saveLifeGaugeState();
    return { from, to, amount: from - to };
  },

  reset() {
    lifeGaugeState = defaultLifeGaugeState();
    saveLifeGaugeState();
  },

  /* ===== 저장/불러오기 연동 — CaseFileState.saveSlot/loadSlot이 relationshipState와
     같은 방식으로 snapshot/restore를 감싼다. */
  snapshot() { return JSON.parse(JSON.stringify(lifeGaugeState)); },
  restore(snapshot) {
    lifeGaugeState = Object.assign(defaultLifeGaugeState(), snapshot || {});
    saveLifeGaugeState();
  },

  /* ===== DEV debug ===== */
  resetAll() {
    lifeGaugeState = defaultLifeGaugeState();
    saveLifeGaugeState();
  },
};
