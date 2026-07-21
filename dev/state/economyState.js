/* MISSING KEY DEV — 포인트(P) 경제 상태.
   Same idiom as CaseFileState (caseFileState.js): a plain global object, one
   JSON blob in localStorage, defensive Object.assign-onto-defaults on load.
   Kept in its own file/key (The Missing Key v1 §14.1) so save migration can
   detect an old save with no economyState and backfill a default one.

   Design rule (spec §4.2/§8.4): investigation minigames and wrong evidence
   never touch points — only addPoints/spendPoints callers decide that, this
   module just enforces "don't pay out the same reward twice". */

const ECONOMY_STATE_KEY = 'mkEconomyState_v1';

function defaultEconomyState() {
  return {
    points: 0,
    lifetimeEarned: 0,
    lifetimeSpent: 0,
    // rewardClaims[rewardId] = true — first_clear_only rewards use this so a
    // replayed minigame/scene can't pay out twice (spec §4.4/§22.1).
    rewardClaims: {},
    // chapterCaps['<chapterId>::<sourceType>'] = points already paid out this
    // chapter for that reward family — chapter_capped rewards use this to
    // stop repeat-clear farming without banning replays outright (§4.4).
    chapterCaps: {},
    // Dev-mode transaction log (§14.1) — capped so localStorage can't grow
    // unbounded over a long playthrough.
    transactions: [],
  };
}

const ECONOMY_TXN_LOG_LIMIT = 200;

function loadEconomyState() {
  try {
    const raw = JSON.parse(localStorage.getItem(ECONOMY_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultEconomyState();
    return Object.assign(defaultEconomyState(), raw, {
      rewardClaims: Object.assign({}, raw.rewardClaims || {}),
      chapterCaps: Object.assign({}, raw.chapterCaps || {}),
      transactions: Array.isArray(raw.transactions) ? raw.transactions : [],
    });
  } catch (e) { return defaultEconomyState(); }
}

let economyState = loadEconomyState();
function saveEconomyState() { localStorage.setItem(ECONOMY_STATE_KEY, JSON.stringify(economyState)); }

function logTxn(type, amount, meta) {
  economyState.transactions.push(Object.assign({
    id: 'txn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    type, amount, timestamp: Date.now(),
  }, meta || {}));
  if (economyState.transactions.length > ECONOMY_TXN_LOG_LIMIT) {
    economyState.transactions = economyState.transactions.slice(-ECONOMY_TXN_LOG_LIMIT);
  }
}

const EconomyState = {
  getPoints() { return economyState.points; },
  canAfford(amount) { return economyState.points >= amount; },

  // Unconditional add — used by debug tools and by claimReward below. Most
  // scene/minigame code should call claimReward instead so a reward can't be
  // paid out twice; this stays exposed for cases with no natural rewardId
  // (e.g. a straight debug "+100P").
  addPoints(amount, meta) {
    if (!amount) return economyState.points;
    economyState.points += amount;
    economyState.lifetimeEarned += Math.max(0, amount);
    logTxn('earn', amount, meta);
    saveEconomyState();
    return economyState.points;
  },

  spendPoints(amount, meta) {
    if (amount <= 0) return true;
    if (!this.canAfford(amount)) return false;
    economyState.points -= amount;
    economyState.lifetimeSpent += amount;
    logTxn('spend', amount, meta);
    saveEconomyState();
    return true;
  },

  hasClaimedReward(rewardId) { return !!economyState.rewardClaims[rewardId]; },

  // first_clear_only reward (spec §4.4) — pays out once per rewardId, ever.
  // Returns the amount actually paid (0 if already claimed) so a caller can
  // decide whether to show a reward screen at all.
  claimReward(rewardId, amount, meta) {
    if (!rewardId) { this.addPoints(amount, meta); return amount; }
    if (economyState.rewardClaims[rewardId]) return 0;
    economyState.rewardClaims[rewardId] = true;
    this.addPoints(amount, Object.assign({ source: rewardId }, meta));
    return amount;
  },

  getChapterRewardTotal(chapterId, sourceType) {
    return economyState.chapterCaps[chapterId + '::' + sourceType] || 0;
  },

  // chapter_capped reward (spec §4.4) — repeatable, but the total paid out
  // for this (chapterId, sourceType) pair this chapter can't exceed
  // weeklyCap. Returns the amount actually paid (may be less than `amount`,
  // or 0 once the cap is hit).
  claimChapterCappedReward(chapterId, sourceType, amount, weeklyCap, meta) {
    const key = chapterId + '::' + sourceType;
    const already = economyState.chapterCaps[key] || 0;
    const room = Math.max(0, weeklyCap - already);
    const paid = Math.min(amount, room);
    if (paid <= 0) return 0;
    economyState.chapterCaps[key] = already + paid;
    this.addPoints(paid, Object.assign({ source: sourceType, chapterId }, meta));
    return paid;
  },

  getTransactions() { return economyState.transactions.slice(); },

  /* ===== 저장/불러오기 연동 (§16) — CaseFileState.saveSlot/loadSlot wraps
     this via a snapshot/restore pair rather than owning economyState itself,
     so save-slot code doesn't need to know this module's shape. */
  snapshot() { return JSON.parse(JSON.stringify(economyState)); },
  restore(snapshot) {
    economyState = Object.assign(defaultEconomyState(), snapshot || {}, {
      rewardClaims: Object.assign({}, (snapshot && snapshot.rewardClaims) || {}),
      chapterCaps: Object.assign({}, (snapshot && snapshot.chapterCaps) || {}),
      transactions: Array.isArray(snapshot && snapshot.transactions) ? snapshot.transactions : [],
    });
    saveEconomyState();
  },

  /* ===== DEV debug ===== */
  resetAll() {
    economyState = defaultEconomyState();
    saveEconomyState();
  },
};
