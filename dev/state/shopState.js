/* MISSING KEY DEV — 옷가게 상태 (The Missing Key v1 §5/§14.2).
   Same idiom as caseFileState.js/economyState.js. Depends on shopItems.js
   (catalog) and economyState.js (spendPoints) both being loaded first, and
   on wardrobeState.js for purchaseShopItem's "구매 = 소유" side effect. */

const SHOP_STATE_KEY = 'mkShopState_v1';

function defaultShopState() {
  return {
    unlocked: false,
    tutorialCompleted: false,
    // Items explicitly unlocked via an `unlockShopItem(s)` effect (e.g. the
    // shop-intro scene granting the 3 starter items) — on top of whatever a
    // catalog entry's own declarative unlockConditions already satisfy.
    unlockedItemIds: [],
    seenItemIds: [],
    purchaseHistory: [],
  };
}

function loadShopState() {
  try {
    const raw = JSON.parse(localStorage.getItem(SHOP_STATE_KEY));
    if (!raw || typeof raw !== 'object') return defaultShopState();
    return Object.assign(defaultShopState(), raw, {
      unlockedItemIds: Array.isArray(raw.unlockedItemIds) ? raw.unlockedItemIds : [],
      seenItemIds: Array.isArray(raw.seenItemIds) ? raw.seenItemIds : [],
      purchaseHistory: Array.isArray(raw.purchaseHistory) ? raw.purchaseHistory : [],
    });
  } catch (e) { return defaultShopState(); }
}

let shopState = loadShopState();
function saveShopState() { localStorage.setItem(SHOP_STATE_KEY, JSON.stringify(shopState)); }

// unlockConditions vocabulary shared with play/game/index.html's own
// evaluateCondition — kept as its own small evaluator here (not imported
// from game/index.html) so shop/wardrobe screens don't need the whole VN
// engine loaded to compute what's for sale.
function evaluateShopUnlockCondition(cond) {
  if (!cond) return true;
  if (cond.type === 'flagEquals') return CaseFileState.getFlag(cond.key) === cond.value;
  if (cond.type === 'flagAtLeast') return (Number(CaseFileState.getFlag(cond.key)) || 0) >= cond.min;
  if (cond.type === 'weekReached') return (Number(CaseFileState.getFlag('currentWeek')) || 0) >= cond.value;
  return true;
}

const ShopState = {
  isUnlocked() { return shopState.unlocked; },
  unlockShop() {
    if (shopState.unlocked) return;
    shopState.unlocked = true;
    saveShopState();
  },

  isTutorialCompleted() { return shopState.tutorialCompleted; },
  completeTutorial() {
    if (shopState.tutorialCompleted) return;
    shopState.tutorialCompleted = true;
    saveShopState();
  },

  unlockShopItem(itemId) {
    if (shopState.unlockedItemIds.includes(itemId)) return;
    shopState.unlockedItemIds.push(itemId);
    saveShopState();
  },
  unlockShopItems(itemIds) { (itemIds || []).forEach(id => this.unlockShopItem(id)); },

  isShopItemUnlocked(itemId) {
    if (shopState.unlockedItemIds.includes(itemId)) return true;
    const def = shopItems[itemId];
    if (!def) return false;
    const conds = def.unlockConditions || [];
    return conds.length > 0 && conds.every(evaluateShopUnlockCondition);
  },

  markShopItemSeen(itemId) {
    if (shopState.seenItemIds.includes(itemId)) return;
    shopState.seenItemIds.push(itemId);
    saveShopState();
  },
  isShopItemSeen(itemId) { return shopState.seenItemIds.includes(itemId); },

  // Every catalog item currently unlocked, decorated with owned/new/price
  // state a shop screen needs directly — context lets a caller (e.g. a
  // debug tool) pass a filter, otherwise defaults to "show everything unlocked".
  getAvailableShopItems() {
    return Object.values(shopItems)
      .filter(item => this.isShopItemUnlocked(item.id))
      .map(item => Object.assign({}, item, {
        owned: WardrobeState.hasOutfit(item.id),
        isNew: !this.isShopItemSeen(item.id),
      }));
  },

  // result: { success: true } | { success: false, reason: 'insufficientPoints' | 'locked' | 'alreadyOwned' | 'notFound' }
  purchaseShopItem(itemId) {
    const def = shopItems[itemId];
    if (!def) return { success: false, reason: 'notFound' };
    if (!this.isShopItemUnlocked(itemId)) return { success: false, reason: 'locked' };
    if (WardrobeState.hasOutfit(itemId)) return { success: false, reason: 'alreadyOwned' };
    if (!EconomyState.canAfford(def.price)) return { success: false, reason: 'insufficientPoints' };
    EconomyState.spendPoints(def.price, { source: 'shop_purchase', itemId });
    WardrobeState.ownOutfit(itemId);
    shopState.purchaseHistory.push({ itemId, price: def.price, purchasedAt: Date.now() });
    saveShopState();
    return { success: true };
  },

  getPurchaseHistory() { return shopState.purchaseHistory.slice(); },

  /* ===== 저장/불러오기 연동 (§16) ===== */
  snapshot() { return JSON.parse(JSON.stringify(shopState)); },
  restore(snapshot) {
    shopState = Object.assign(defaultShopState(), snapshot || {}, {
      unlockedItemIds: Array.isArray(snapshot && snapshot.unlockedItemIds) ? snapshot.unlockedItemIds : [],
      seenItemIds: Array.isArray(snapshot && snapshot.seenItemIds) ? snapshot.seenItemIds : [],
      purchaseHistory: Array.isArray(snapshot && snapshot.purchaseHistory) ? snapshot.purchaseHistory : [],
    });
    saveShopState();
  },

  /* ===== DEV debug (§24) ===== */
  resetAll() {
    shopState = defaultShopState();
    saveShopState();
  },
  debugUnlockAll() {
    shopState.unlockedItemIds = Object.keys(shopItems);
    saveShopState();
  },
};
