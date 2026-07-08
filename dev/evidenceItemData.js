/* OPERATION MK DEV — 증거 수집 아이템 데이터 (핸드폰을 찾아라).
   Single source of truth for item defs / recipes / hotspot->item mapping,
   shared by minigame-phone-search/ (which reads this to run the actual
   game) and /dev/evidence/settings/ (which reads it to render read-only
   아이템위치/조합법 reference views — a dev shouldn't have to open the
   minigame's source to answer "어느 핫스팟에 무슨 아이템이 있지?"). Moved out
   of minigame-phone-search/index.html so both sides always see the same
   data instead of two copies drifting apart. */

const ITEM_DEFS = {
  'dead-flashlight': { icon: '🔦', name: '손전등', selectable: true, inspect: '배터리가 들어 있지 않다.' },
  'aa-batteries': { icon: '🔋', name: 'AA 건전지', selectable: false, inspect: 'AA 건전지 두 개다.' },
  'working-flashlight': { icon: '🔦', name: '작동 손전등', selectable: true, inspect: '불빛이 밝게 켜진다.' },
  'metal-hanger': { icon: '🧷', name: '철제 옷걸이', selectable: false, inspect: '길게 펴면 뭔가에 쓸 수 있을 것 같다.' },
  'garden-stake': { icon: '🥢', name: '정원용 지지대', selectable: false, inspect: '끝에 무언가 걸 수 있을 것 같다.' },
  'long-hook': { icon: '🪝', name: '긴 갈고리', selectable: true, inspect: '옷걸이와 지지대를 엮어 만든 갈고리다.' },
  'unknown-key': { icon: '🗝️', name: '낡은 열쇠', selectable: false, inspect: '어디에 쓰는 열쇠인지 모르겠다.' },
  'jisu-phone': { icon: '📱', name: '핸드폰', selectable: false },
  // Section 18 decoys — one-time flavor collectibles, never used by any
  // recipe or hotspot gating. Purely for "방 탐색 감각 강화".
  'dish-towel': { icon: '🧻', name: '행주', selectable: false, inspect: '평범한 행주다.' },
  'plastic-bag': { icon: '🛍️', name: '비닐봉지', selectable: false, inspect: '접힌 비닐봉지다.' },
  'rubber-band': { icon: '➰', name: '고무줄', selectable: false, inspect: '작은 고무줄이다.' },
  'small-coin': { icon: '🪙', name: '동전', selectable: false, inspect: '동전 하나다.' },
  'dry-twig': { icon: '🌿', name: '마른 나뭇가지', selectable: false, inspect: '마른 나뭇가지다.' },
  'bottle-cap': { icon: '🧢', name: '병뚜껑', selectable: false, inspect: '녹슨 병뚜껑이다.' },
  receipt: { icon: '🧾', name: '영수증', selectable: false, inspect: '오래돼서 글씨가 잘 안 보인다.' },
  paperclip: { icon: '📎', name: '클립', selectable: false, inspect: '작은 클립이다.' },
};

// Section 9/10 — 2-item combination recipes. Order-independent.
const RECIPES = [
  {
    id: 'make-working-flashlight',
    inputItemIds: ['dead-flashlight', 'aa-batteries'],
    outputItemId: 'working-flashlight',
    consumeInputItems: true,
    successMessage: '건전지를 넣자 손전등이 켜졌다.',
  },
  {
    id: 'make-long-hook',
    inputItemIds: ['metal-hanger', 'garden-stake'],
    outputItemId: 'long-hook',
    consumeInputItems: true,
    successMessage: '옷걸이를 길게 펴 지지대 끝에 고정했다.\n임시 긴 갈고리를 만들었다.',
  },
];
function findRecipe(idA, idB) {
  return RECIPES.find(r =>
    (r.inputItemIds[0] === idA && r.inputItemIds[1] === idB) ||
    (r.inputItemIds[0] === idB && r.inputItemIds[1] === idA)
  );
}

// One-time decoy pickups (section 18) keyed by hotspot ID — no gating, no
// recipe use, just an inventory flavor item the first time each is tapped.
const DECOY_ITEMS = {
  'kitchen-oven-handle': { itemId: 'dish-towel', message: '[ 행주를 발견했다 ]' },
  'kitchen-left-lower-cabinet': { itemId: 'plastic-bag', message: '[ 비닐봉지를 발견했다 ]' },
  'bathroom-vanity-drawer': { itemId: 'rubber-band', message: '[ 서랍을 열었다 ]\n작은 고무줄을 발견했다.' },
  'bathroom-tub-edge': { itemId: 'small-coin', message: '[ 작은 동전을 발견했다 ]' },
  'exterior-left-bush': { itemId: 'dry-twig', message: '[ 마른 나뭇가지를 발견했다 ]' },
  'exterior-grass': { itemId: 'bottle-cap', message: '[ 병뚜껑을 발견했다 ]' },
  'bedroom-floorboards': { itemId: 'receipt', message: '[ 영수증을 발견했다 ]' },
  'bedroom-mantel-shelf': { itemId: 'paperclip', message: '[ 작은 클립을 발견했다 ]' },
};

// Hotspot ID -> itemId, for every hotspot whose handler can hand the player
// an item. DECOY_ITEMS is table-driven so its mapping is read straight off
// it; the core-route handlers below aren't, so those are kept in sync by
// hand. Used to narrow the DEV sheet's SHOW HOTSPOTS overlay down to just
// the spots worth checking (and to label each with the item it holds), and
// by /dev/evidence/settings/items to list every hotspot->item placement.
const ITEM_HOTSPOT_ITEM_IDS = new Map([
  ...Object.entries(DECOY_ITEMS).map(([id, d]) => [id, d.itemId]),
  ['kitchen-right-lower-drawer', 'aa-batteries'],
  ['kitchen-fridge-gap', 'jisu-phone'], // win condition
  ['bathroom-behind-door', 'metal-hanger'],
  ['exterior-center-shrubs', 'garden-stake'],
  ['bedroom-bedside-table', 'dead-flashlight'],
  ['bedroom-right-vent', 'unknown-key'],
]);
