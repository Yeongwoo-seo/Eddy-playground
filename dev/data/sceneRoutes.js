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
  // [레이튼 퀴즈 삽입] 열차에서 지수가 켜본 두뇌 퍼즐(PZ-H02) — 낚시와 같은
  // 오픈형 미니게임 계약: 클리어 조건 없이 SHOP_TUTORIAL_RETURN_SCENE이
  // 정해준 씬으로 뒤로가기 버튼이 돌아간다.
  'week1-scene-train-minigame': '/play/minigame-layton/?puzzle=pz-h02',
  // [v08 재편] 서큘러키 사진+낚시 제안 (week1-scene-circular-quay 참고) —
  // 독립형 낚시 미니게임(fishing-minigame, play/minigame-fishing/) 재사용.
  // 클리어 조건이 따로 없는 오픈형 미니게임이라 게임 쪽에서 자동으로 다음
  // 씬으로 넘기지 않고, 대신 SHOP_TUTORIAL_RETURN_SCENE로 설정한
  // mkShopReturnUrl을 그 화면의 뒤로가기 버튼이 읽어 돌아온다(옷가게/옷장과
  // 같은 계약).
  'week1-scene-circular-quay-minigame': '/play/minigame-fishing/',
  'week1-scene-002-2': '/play/minigame-phone-search/',
  'week1-scene-shop-visit': '/play/shop/',
  // 2주차 v4 전면 재설계 — week2Scenes가 완전 선형 구조로 바뀌면서 옛
  // 탐색 허브(W2_TOURISM/W2_SUSPECT_INTERVIEWS/W2_REVERIFICATION) 진입/복귀
  // virtual id들은 전부 제거했다. 미니게임 두 개(사진 속 인물 찾기/시간대
  // 정리)만 그대로 재사용하며, 새 씬 id로 다시 연결한다 — see
  // dialogueData.js의 week2-scene-008/010, minigame-photo-zoom·
  // minigame-timeline의 하드코딩된 복귀 리다이렉트.
  'week2-scene-008-minigame': '/play/minigame-photo-zoom/',
  'week2-scene-010-minigame': '/play/minigame-timeline/',
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
  'week1-scene-train-minigame': 'week1-scene-train-2',
  'week1-scene-shop-visit': 'week1-scene-circular-quay',
  'week1-scene-circular-quay-minigame': 'week1-scene-002-1',
};
