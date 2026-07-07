/* OPERATION MK DEV — static reference data for the CASE FILE investigation
   menu (dev/caseMenu.js + dev/caseFileState.js). Kept separate from runtime
   state for the same reason dialogueData.js is separate from DevGameState:
   this is content a writer edits, not something that changes at runtime. */

// 지도 locations. Only 숙소/공항/지하철역 have real scene content right now —
// the other three are the brief's own example locations (§16), modeled as
// permanently-locked placeholders so the map has its intended "6 total"
// shape without pretending content exists that hasn't been written yet.
// mapX/mapY are rough placement percentages for a future Sydney map graphic.
const caseMapLocations = [
  { id: 'airport', name: '공항', mapX: 12, mapY: 70, relatedSceneIds: ['week1-scene-001'] },
  { id: 'station', name: '지하철 역', mapX: 30, mapY: 55, relatedSceneIds: ['week1-scene-001-2'] },
  { id: 'accommodation', name: '숙소', mapX: 50, mapY: 40, relatedSceneIds: ['week1-scene-002-1', 'week1-scene-002-2', 'week1-scene-002-3'] },
  { id: 'circular-quay', name: 'Circular Quay', mapX: 62, mapY: 30, relatedSceneIds: [] },
  { id: 'opera-house', name: 'Opera House', mapX: 70, mapY: 22, relatedSceneIds: [] },
  { id: 'harbour-bridge', name: 'Harbour Bridge', mapX: 58, mapY: 18, relatedSceneIds: [] },
];

// 소지품 catalog — name/icon/description mirror minigame-phone-search's own
// ITEM_DEFS (icon/name/inspect) so nothing drifts between the minigame and
// the case file menu. discoveredLocationText is left off for items whose
// exact hotspot isn't meaningfully distinct — renderInventoryDetail already
// falls back to "알 수 없음" rather than guessing at one.
const inventoryItemDefs = {
  'dead-flashlight': { name: '손전등', icon: '🔦', description: '배터리가 들어 있지 않다.' },
  'aa-batteries': { name: 'AA 건전지', icon: '🔋', description: 'AA 건전지 두 개다.' },
  'working-flashlight': { name: '작동 손전등', icon: '🔦', description: '불빛이 밝게 켜진다.' },
  'metal-hanger': { name: '철제 옷걸이', icon: '🧷', description: '길게 펴면 뭔가에 쓸 수 있을 것 같다.' },
  'garden-stake': { name: '정원용 지지대', icon: '🥢', description: '끝에 무언가 걸 수 있을 것 같다.' },
  'long-hook': { name: '긴 갈고리', icon: '🪝', description: '옷걸이와 지지대를 엮어 만든 갈고리다.' },
  'unknown-key': { name: '낡은 열쇠', icon: '🗝️', description: '정체불명의 낡은 열쇠. 수사 노트의 증거 항목에도 등록되어 있다.', discoveredLocationText: '숙소 침실 환기구' },
  'jisu-phone': { name: '핸드폰', icon: '📱', description: '지수의 핸드폰. 드디어 찾았다.' },
  'dish-towel': { name: '행주', icon: '🧻', description: '평범한 행주다.' },
  'plastic-bag': { name: '비닐봉지', icon: '🛍️', description: '접힌 비닐봉지다.' },
  'rubber-band': { name: '고무줄', icon: '➰', description: '작은 고무줄이다.' },
  'small-coin': { name: '동전', icon: '🪙', description: '동전 하나다.' },
  'dry-twig': { name: '마른 나뭇가지', icon: '🌿', description: '마른 나뭇가지다.' },
  'bottle-cap': { name: '병뚜껑', icon: '🧢', description: '녹슨 병뚜껑이다.' },
  receipt: { name: '영수증', icon: '🧾', description: '오래돼서 글씨가 잘 안 보인다.' },
  paperclip: { name: '클립', icon: '📎', description: '작은 클립이다.' },
};

// Evidence/Question content for the one real end-to-end wire-up in this
// build (숙소 미니게임에서 낡은 열쇠 발견 → 증거 등록 → 의문점 등록). Defined
// once here so the real minigame hookup and the DEV debug "add sample"
// shortcuts show identical content instead of two copies drifting apart.
const EVIDENCE_UNKNOWN_KEY = {
  id: 'evidence-unknown-key',
  code: 'E-001',
  title: 'UNKNOWN KEY',
  description: '정체불명의 낡은 열쇠.',
  discoveredLocationText: '숙소 침실 환기구',
};

const QUESTION_KEY_ORIGIN = {
  id: 'question-key-purpose',
  title: '이 열쇠는 무엇을 여는가?',
  linkedEvidenceIds: ['evidence-unknown-key'],
};

const QUESTION_PHONE_LOCATION = {
  id: 'question-key-location',
  title: '왜 숙소 침실 환기구 안에 있었나?',
  linkedEvidenceIds: ['evidence-unknown-key'],
};
