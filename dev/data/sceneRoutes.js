/* OPERATION MK DEV — shared nextSceneId -> route table.
   Used by dev/game/index.html (its own player.onComplete) and
   dev/explore/index.html (심문 씬 인라인 재생 종료 처리, see playSceneInline's
   onInlineSceneComplete) so both know the same "this nextSceneId hands off
   to a real page instead of another VN scene" facts from one place instead
   of two drifting copies. */

// A nextSceneId with no route here and no matching VN scene isn't built
// yet, so the caller falls back to a placeholder instead of navigating to a
// dead page.
const MINIGAME_ROUTES = {
  'week0-scene-001-2-minigame': '/dev/minigame-eastwood/',
  'week0-scene-002-2': '/dev/minigame-phone-search/',
  'week0-scene-shop-visit': '/dev/shop/',
  'week1-scene-003-minigame': '/dev/minigame-exhibition-search/',
  'week1-scene-004-minigame': '/dev/minigame-photo-zoom/',
  'week1-scene-008-minigame': '/dev/minigame-timeline/',
  // The Missing Key v1 §12.6 — 세 용의자 자유 순서 탐문. Both virtual ids
  // land on the same shared hub-center location; individual suspect spots
  // are reached from there (see dev/data/locationDefs.js's w1-hub-plaza/
  // w1-*-spot entries — w1-hub-plaza is shared with Phase 5's re-verify
  // hub-entry below, §신규 phase간 중복 장소 통합).
  'week1-suspect-hub-entry': '/dev/explore/?phase=W1_SUSPECT_INTERVIEWS&location=w1-hub-plaza',
  'week1-suspect-interview-return': '/dev/explore/?phase=W1_SUSPECT_INTERVIEWS&location=w1-hub-plaza',
  // §12.2 — 시티 도착 직후 곧장 탐색 허브로. Phase 1(W1_TOURISM) 도입 대화는
  // interactionDefs.js의 'w1-phase1-intro'(type:'phaseIntro')로 이 phase에
  // 처음 진입할 때 허브 안에서 자동 재생된다.
  'week1-hub-entry-tourism': '/dev/explore/?phase=W1_TOURISM&location=w1-circular-quay',
  // §12.8 — 재검증 단계 자유 순회.
  'week1-reverify-hub-entry': '/dev/explore/?phase=W1_REVERIFICATION&location=w1-hub-plaza',
  'week1-reverify-interview-return': '/dev/explore/?phase=W1_REVERIFICATION&location=w1-hub-plaza',
};

// The Missing Key v1 §5.2/§11.3 — week0-scene-shop-intro's own nextSceneId
// hands off into the real shop screen (a routed page, see MINIGAME_ROUTES
// above) rather than another VN scene. /dev/shop/'s own "← 돌아가기" button
// reads sessionStorage's mkShopReturnUrl (same contract the CASE FILE menu's
// 옷가게/옷장 cards use) — this scripted handoff sets it explicitly to the
// scene *after* the shop visit (week0-scene-002-1) instead of back into the
// intro dialogue, so leaving the shop continues the story instead of
// replaying the boutique chat.
const SHOP_TUTORIAL_RETURN_SCENE = { 'week0-scene-shop-visit': 'week0-scene-002-1' };
