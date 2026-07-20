/* OPERATION MK DEV — 옷가게 상품 카탈로그 (The Missing Key v1 §5.6/§14.4).
   Static catalog, same idiom as caseFileData.js: a plain object keyed by id,
   read by shopState.js/play/shop/index.html. 1차 구현 범위는 완성 코디
   프리셋만 판매 — 부위별 조합은 하지 않는다 (§5.1).

   Each item's art can come from two sources, tried in this order (see
   WardrobeState.equipOutfit / dev/shop/index.html's updatePreview):
   1. characterAssetKey — a dedicated shop-only upload, looked up through the
      *same* per-(characterId, expression) uploaded-asset pipeline every other
      character portrait uses (see DevGameState.getCharacterAssetId in
      assetDb.js). An outfit's art is just another "character" id an artist
      can upload under via /dev/upload's 인물 DB tab (옷가게 코디 프리뷰 항목).
   2. vnOutfitId — reuses art already uploaded under 지수's existing VN outfit
      slots (dialogueData.js's jisoo.outfits: 'outfit-01'..'outfit-10'), via
      DevGameState.getCharacterAssetIdForOutfit('jisoo', vnOutfitId, ...).
      Equipping such an item also calls DevGameState.setSelectedOutfit so
      every other call site that already renders 지수 via the plain
      getCharacterAssetId('jisoo', expression) — game/game/index.html dialogue,
      explore hub, minigames, weekPreloader — picks up the right outfit *and*
      expression automatically, with no changes needed there.
   Falls back to the base characterId's own portrait whenever neither source
   has anything uploaded yet (see game/index.html applyCharacterForLine). */

const shopItems = {
  /* ===== 0주차 초기 재고 ===== */
  'outfit-w0-soft-cardigan': {
    id: 'outfit-w0-soft-cardigan',
    type: 'outfit',
    name: '소프트 가디건 데이트룩',
    description: '첫날 가볍게 입기 좋은 부드러운 코디.',
    price: 400,
    rarity: 'basic',
    week: 0,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w0_soft_cardigan',
    vnOutfitId: 'outfit-01',
    unlockConditions: [{ type: 'flagEquals', key: 'shopUnlocked', value: true }],
  },
  'outfit-w0-city-denim': {
    id: 'outfit-w0-city-denim',
    type: 'outfit',
    name: '시티 데님 캐주얼',
    description: '이스트우드 거리를 걷기 좋은 캐주얼 코디.',
    price: 500,
    rarity: 'basic',
    week: 0,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w0_city_denim',
    vnOutfitId: 'outfit-02',
    unlockConditions: [{ type: 'flagEquals', key: 'shopUnlocked', value: true }],
  },
  'outfit-w0-ribbon-knit': {
    id: 'outfit-w0-ribbon-knit',
    type: 'outfit',
    name: '리본 니트 코디',
    description: '지도 미니게임을 클리어한 기념으로 해금된 코디.',
    price: 550,
    rarity: 'select',
    week: 0,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w0_ribbon_knit',
    vnOutfitId: 'outfit-03',
    unlockConditions: [{ type: 'flagEquals', key: 'week0MapMinigameCleared', value: true }],
  },
  'outfit-w0-night-walk': {
    id: 'outfit-w0-night-walk',
    type: 'outfit',
    name: '나이트 워크 니트',
    description: '0주차를 마친 뒤에 해금되는 저녁 산책 코디.',
    price: 700,
    rarity: 'select',
    week: 0,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w0_night_walk',
    vnOutfitId: 'outfit-04',
    unlockConditions: [{ type: 'flagEquals', key: 'week0Completed', value: true }],
  },

  /* ===== 1주차 신규 재고 ===== */
  'outfit-w1-harbour-breeze': {
    id: 'outfit-w1-harbour-breeze',
    type: 'outfit',
    name: '하버 브리즈 코디',
    description: '서큘러키를 방문하면 해금되는 관광 코디.',
    price: 650,
    rarity: 'select',
    week: 1,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w1_harbour_breeze',
    vnOutfitId: 'outfit-05',
    unlockConditions: [{ type: 'flagEquals', key: 'visitedCircularQuay', value: true }],
  },
  'outfit-w1-rocks-vintage': {
    id: 'outfit-w1-rocks-vintage',
    type: 'outfit',
    name: '더 록스 빈티지 원피스',
    description: '더 록스 옷가게를 방문하면 해금되는 빈티지 원피스.',
    price: 750,
    rarity: 'select',
    week: 1,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w1_rocks_vintage',
    vnOutfitId: 'outfit-06',
    unlockConditions: [{ type: 'flagEquals', key: 'visitedTheRocksBoutique', value: true }],
  },
  'outfit-w1-detective-check': {
    id: 'outfit-w1-detective-check',
    type: 'outfit',
    name: '탐정 체크 재킷',
    description: '1주차 핵심 질문 3개를 해결하면 해금되는 코디.',
    price: 900,
    rarity: 'premium',
    week: 1,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w1_detective_check',
    vnOutfitId: 'outfit-07',
    unlockConditions: [{ type: 'flagAtLeast', key: 'week1CoreQuestionsResolved', min: 3 }],
  },
  'outfit-w1-photo-perfect': {
    id: 'outfit-w1-photo-perfect',
    type: 'outfit',
    name: '포토 퍼펙트 데이트룩',
    description: '하버 포토 미니게임에서 S등급을 받으면 해금되는 코디.',
    price: 1050,
    rarity: 'premium',
    week: 1,
    characterId: 'jisoo',
    characterAssetKey: 'jisoo_w1_photo_perfect',
    vnOutfitId: 'outfit-08',
    unlockConditions: [{ type: 'flagEquals', key: 'harbourPhotoGradeS', value: true }],
  },

  // outfit-09/10: 지수의 VN 의상 슬롯이 10벌까지 채워져 있는데 옷가게 상품은
  // 8개뿐이었던 걸 맞추려고 추가. 이름·가격·해금 조건은 실제 아트를 보지
  // 못한 상태의 임시값 — shopUnlocked로만 걸어 둬서 아직 안 쓰이는 스토리
  // 플래그를 새로 지어내지 않았다. 실제 코디를 확인한 뒤 다시 조정할 것.
  'outfit-w1-city-nights': {
    id: 'outfit-w1-city-nights',
    type: 'outfit',
    name: '시티 나잇 무드룩',
    description: '(임시 이름) 밤의 시드니 시내를 걷기 좋은 코디.',
    price: 800,
    rarity: 'select',
    week: 1,
    characterId: 'jisoo',
    vnOutfitId: 'outfit-09',
    unlockConditions: [{ type: 'flagEquals', key: 'shopUnlocked', value: true }],
  },
  'outfit-w1-farewell-look': {
    id: 'outfit-w1-farewell-look',
    type: 'outfit',
    name: '굿바이 시드니 코디',
    description: '(임시 이름) 여정의 마지막을 장식하는 코디.',
    price: 850,
    rarity: 'select',
    week: 1,
    characterId: 'jisoo',
    vnOutfitId: 'outfit-10',
    unlockConditions: [{ type: 'flagEquals', key: 'shopUnlocked', value: true }],
  },
};

// 기본(구매 불가) 코디 — WardrobeState의 초기 보유/장착 대상. 상점 카탈로그에는
// 노출하지 않는다.
const DEFAULT_OUTFIT_ID = 'outfit-default';
