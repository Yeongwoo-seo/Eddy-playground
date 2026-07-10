/* OPERATION MK DEV — static reference data for the CASE FILE investigation
   menu (dev/caseMenu.js + dev/caseFileState.js). Kept separate from runtime
   state for the same reason dialogueData.js is separate from DevGameState:
   this is content a writer edits, not something that changes at runtime. */

// 지도 locations. 숙소/공항/지하철역/Circular Quay have real scene content —
// Opera House/Harbour Bridge remain the brief's own example locations (§16),
// modeled as permanently-locked placeholders so the map has its intended
// "6 total" shape without pretending content exists that hasn't been written
// yet. mapX/mapY are rough placement percentages for a future Sydney map graphic.
const caseMapLocations = [
  // week0-scene-flight now also covers week0-scene-001 (진짜 왔네, merged —
  // see week0Scenes in dialogueData.js), hence the id mismatch with this
  // location's own name.
  { id: 'airport', name: '공항', mapX: 12, mapY: 70, relatedSceneIds: ['week0-scene-flight'] },
  { id: 'station', name: '지하철 역', mapX: 30, mapY: 55, relatedSceneIds: ['week0-scene-001-2', 'week0-scene-001-2-minigame', 'week0-scene-train'] },
  {
    id: 'accommodation', name: '숙소', mapX: 50, mapY: 40,
    relatedSceneIds: [
      // week0-scene-dinner + week0-scene-charger merged into week0-scene-002-1;
      // week0-scene-frontdesk (now a landlord phone call, no more lobby trip)
      // and week0-scene-firstnight merged into week0-scene-002-3 — see
      // week0Scenes in dialogueData.js.
      'week0-scene-002-1', 'week0-scene-002-2', 'week0-scene-002-3',
      'week1-scene-013',
    ],
  },
  {
    id: 'circular-quay', name: 'Circular Quay', mapX: 62, mapY: 30,
    relatedSceneIds: [
      // 1주차 추리 개편 v2 — week1-scene-004/005는 week1-scene-003에 합쳐졌고,
      // 애드리언 콜 조사는 자기 씬(week1-scene-007)으로 분리됐다. A 재오픈(010),
      // 최종 심문(011), 사건 재구성(012)도 모두 Circular Quay 권역이라 여기 포함.
      // 엔딩(013)만 숙소라 위 accommodation 항목으로 옮겨졌다 — see week1Scenes
      // in dialogueData.js.
      'week1-scene-001', 'week1-scene-002', 'week1-scene-003',
      'week1-scene-005-minigame',
      'week1-scene-006', 'week1-scene-007', 'week1-scene-008', 'week1-scene-008-minigame',
      'week1-scene-009', 'week1-scene-010', 'week1-scene-011', 'week1-scene-012',
    ],
  },
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
