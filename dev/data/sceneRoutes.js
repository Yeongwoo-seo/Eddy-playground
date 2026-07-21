/* MISSING KEY DEV — shared nextSceneId -> route table.
   Used by play/game/index.html (its own player.onComplete) and
   play/explore/index.html (심문 씬 인라인 재생 종료 처리, see playSceneInline's
   onInlineSceneComplete) so both know the same "this nextSceneId hands off
   to a real page instead of another VN scene" facts from one place instead
   of two drifting copies. */

// A nextSceneId with no route here and no matching VN scene isn't built
// yet, so the caller falls back to a placeholder instead of navigating to a
// dead page.
const MINIGAME_ROUTES = {
  'week1-scene-001-2-minigame': '/play/minigame-eastwood/',
  // [v08 재편] 서큘러키 사진+낚시 제안 (week1-scene-circular-quay 참고) —
  // 독립형 낚시 미니게임(fishing-minigame, play/minigame-fishing/) 재사용.
  // 클리어 조건이 따로 없는 오픈형 미니게임이라 게임 쪽에서 자동으로 다음
  // 씬으로 넘기지 않고, 대신 SHOP_TUTORIAL_RETURN_SCENE로 설정한
  // mkShopReturnUrl을 그 화면의 뒤로가기 버튼이 읽어 돌아온다(옷가게/옷장과
  // 같은 계약).
  'week1-scene-circular-quay-minigame': '/play/minigame-fishing/',
  'week1-scene-002-2': '/play/minigame-phone-search/',
  'week1-scene-shop-visit': '/play/shop/',
  // §신규 재편 — 전시장 증거 수집이 전용 미니게임(minigame-exhibition-search,
  // 삭제됨)에서 탐색 허브의 w2-adrian-spot 조사하기로 옮겨갔다. week2-scene-003
  // 종료 시 곧장 그 허브 장소로 내려준다 — see dialogueData.js/locationDefs.js.
  'week2-scene-003-exhibition-return': '/play/explore/?phase=W2_TOURISM&location=w2-adrian-spot',
  'week2-scene-004-minigame': '/play/minigame-photo-zoom/',
  'week2-scene-008-minigame': '/play/minigame-timeline/',
  // The Missing Key v1 §12.6 — 세 용의자 자유 순서 탐문. Both virtual ids
  // land on the same shared hub-center location; individual suspect spots
  // are reached from there (see dev/data/locationDefs.js's w2-hub-plaza/
  // w2-*-spot entries — w2-hub-plaza is shared with Phase 5's re-verify
  // hub-entry below, §신규 phase간 중복 장소 통합).
  'week2-suspect-hub-entry': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
  'week2-suspect-interview-return': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
  // §12.2 — 시티 도착 직후 곧장 탐색 허브로. Phase 1(W2_TOURISM) 도입 대화는
  // interactionDefs.js의 'w2-phase1-intro'(type:'phaseIntro')로 이 phase에
  // 처음 진입할 때 허브 안에서 자동 재생된다.
  'week2-hub-entry-tourism': '/play/explore/?phase=W2_TOURISM&location=w2-circular-quay',
  // §12.8 — 재검증 단계 자유 순회.
  'week2-reverify-hub-entry': '/play/explore/?phase=W2_REVERIFICATION&location=w2-hub-plaza',
  'week2-reverify-interview-return': '/play/explore/?phase=W2_REVERIFICATION&location=w2-hub-plaza',
};

// The Missing Key v1 §5.2/§11.3 — week1-scene-shop-intro's own nextSceneId
// hands off into the real shop screen (a routed page, see MINIGAME_ROUTES
// above) rather than another VN scene. /play/shop/'s own "← 돌아가기" button
// reads sessionStorage's mkShopReturnUrl (same contract the CASE FILE menu's
// 옷가게/옷장 cards use) — this scripted handoff sets it explicitly to the
// scene *after* the shop visit instead of back into the intro dialogue, so
// leaving the shop continues the story instead of replaying the boutique
// chat. [v08 재편] The shop visit now returns into week1-scene-circular-quay
// (사진+낚시 제안, the very next beat in the new order) instead of the
// accommodation arrival, and the fishing minigame's own "돌아가기" now
// returns straight into week1-scene-002-1 (accommodation) since the shop
// beat already happened earlier in the day.
const SHOP_TUTORIAL_RETURN_SCENE = {
  'week1-scene-shop-visit': 'week1-scene-circular-quay',
  'week1-scene-circular-quay-minigame': 'week1-scene-002-1',
};
