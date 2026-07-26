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

  // 옷가게 전체 언락 — 카탈로그에 있는 상품은 스토리 진행/플래그와 무관하게
  // 전부 구매 가능 상태로 노출한다 (unlockConditions는 더 이상 게이팅하지
  // 않음). unlockShopItem(s)로 개별 부여하던 흐름은 그대로 두되 실질적인
  // 효과는 없다 — 카탈로그 존재 여부만으로 이미 언락 상태이기 때문.
  isShopItemUnlocked(itemId) { return Object.prototype.hasOwnProperty.call(shopItems, itemId); },

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
