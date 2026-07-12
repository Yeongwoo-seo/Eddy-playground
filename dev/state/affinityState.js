/* OPERATION MK DEV — 캐릭터별 호감도 상태.
   Same idiom as EconomyState (economyState.js): a plain global object, one
   JSON blob in localStorage, defensive Object.assign-onto-defaults on load.
   Kept in its own file/key so save-slot code can snapshot/restore it
   alongside points/shop/wardrobe/exploration state without those modules
   knowing anything about affinity.

   Score is per characterId (dialogueData.js's dialogueCharacters ids, e.g.
   'youngwoo', 'mika'), clamped to [AFFINITY_MIN, AFFINITY_MAX]. A character
   with no score yet reads as AFFINITY_MIN rather than throwing — scenes can
   freely addAffinity() a character the player just met without a separate
   "register this character" step. */

const AFFINITY_STATE_KEY = 'mkAffinityState_v1';
const AFFINITY_MIN = 0;
const AFFINITY_MAX = 100;

// Ordered low -> high; getLevel() picks the last tier whose `min` the score
// clears. Generic labels (not "romance"-specific) since the same system
// tracks suspects' willingness to open up as well as closer relationships.
const AFFINITY_LEVELS = [
  { min: 0, label: '경계' },
  { min: 20, label: '어색함' },
  { min: 40, label: '친근함' },
  { min: 60, label: '호감' },
  { min: 80, label: '신뢰' },
  { min: 95, label: '특별한 사이' },
];

function defaultAffinityState() {
  return {
    // scores[characterId] = number, only present once a character has ever
    // had addAffinity/setAffinity called for them.
    scores: {},
    // Dev-mode transaction log (same shape/limit idea as EconomyState) so a
    // playthrough's affinity changes can be inspected/debugged.
    transactions: [],
  };
}

const AFFINITY_TXN_LOG_LIMIT = 200;

function loadAffinityState() {
  try {
    const raw = JSON.parse(localStorage.getItem(AFFINITY_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultAffinityState();
    return Object.assign(defaultAffinityState(), raw, {
      scores: Object.assign({}, raw.scores || {}),
      transactions: Array.isArray(raw.transactions) ? raw.transactions : [],
    });
  } catch (e) { return defaultAffinityState(); }
}

let affinityState = loadAffinityState();
function saveAffinityState() { localStorage.setItem(AFFINITY_STATE_KEY, JSON.stringify(affinityState)); }

function clampAffinity(value) {
  return Math.max(AFFINITY_MIN, Math.min(AFFINITY_MAX, value));
}

function logAffinityTxn(characterId, delta, meta) {
  affinityState.transactions.push(Object.assign({
    id: 'atxn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    characterId, delta, timestamp: Date.now(),
  }, meta || {}));
  if (affinityState.transactions.length > AFFINITY_TXN_LOG_LIMIT) {
    affinityState.transactions = affinityState.transactions.slice(-AFFINITY_TXN_LOG_LIMIT);
  }
}

const AffinityState = {
  getAffinity(characterId) {
    return affinityState.scores[characterId] || 0;
  },

  // Relative change (may be negative) — the common case for scene/choice
  // effects ("이 대답으로 +5"). Returns the new clamped value.
  addAffinity(characterId, amount, meta) {
    if (!characterId || !amount) return this.getAffinity(characterId);
    const next = clampAffinity(this.getAffinity(characterId) + amount);
    affinityState.scores[characterId] = next;
    logAffinityTxn(characterId, amount, meta);
    saveAffinityState();
    return next;
  },

  // Absolute set — for dev tools / debug and scripted "이 시점엔 항상 X" beats.
  setAffinity(characterId, value, meta) {
    if (!characterId) return 0;
    const prev = this.getAffinity(characterId);
    const next = clampAffinity(value);
    affinityState.scores[characterId] = next;
    logAffinityTxn(characterId, next - prev, meta);
    saveAffinityState();
    return next;
  },

  // Returns the tier the character's current score falls into, e.g.
  // { label: '호감', min: 40, max: 60, value: 47, progress: 0.35 } — max is
  // the next tier's min (or AFFINITY_MAX for the top tier), progress is how
  // far through the current tier the score sits (0..1), for a meter UI.
  getLevel(characterId) {
    const value = this.getAffinity(characterId);
    let tierIndex = 0;
    for (let i = 0; i < AFFINITY_LEVELS.length; i++) {
      if (value >= AFFINITY_LEVELS[i].min) tierIndex = i;
    }
    const tier = AFFINITY_LEVELS[tierIndex];
    const nextTier = AFFINITY_LEVELS[tierIndex + 1];
    const max = nextTier ? nextTier.min : AFFINITY_MAX;
    const span = max - tier.min;
    return {
      label: tier.label,
      min: tier.min,
      max,
      value,
      progress: span > 0 ? (value - tier.min) / span : 1,
    };
  },

  getTransactions() { return affinityState.transactions.slice(); },

  /* ===== 저장/불러오기 연동 — CaseFileState.saveSlot/loadSlot wraps this via
     a snapshot/restore pair rather than owning affinityState itself, same as
     EconomyState/ShopState/WardrobeState/ExplorationState. */
  snapshot() { return JSON.parse(JSON.stringify(affinityState)); },
  restore(snapshot) {
    affinityState = Object.assign(defaultAffinityState(), snapshot || {}, {
      scores: Object.assign({}, (snapshot && snapshot.scores) || {}),
      transactions: Array.isArray(snapshot && snapshot.transactions) ? snapshot.transactions : [],
    });
    saveAffinityState();
  },

  /* ===== DEV debug ===== */
  resetAll() {
    affinityState = defaultAffinityState();
    saveAffinityState();
  },
};
