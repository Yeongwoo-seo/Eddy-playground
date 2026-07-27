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
  // 2주차 v4 전면 재설계 — week2Scenes는 22챕터를 nextSceneId로 잇는 대부분
  // 선형 구조이며, 미니게임 두 개(사진 속 인물 찾기/시간대 정리)는 그대로
  // 재사용한다 — see dialogueData.js의 week2-scene-008/010b, minigame-photo-
  // zoom·minigame-timeline의 하드코딩된 복귀 리다이렉트.
  'week2-scene-008-minigame': '/play/minigame-photo-zoom/',
  'week2-scene-010-minigame': '/play/minigame-timeline/',
  // [허브 재도입] v4 아웃라인 자체가 "자유 탐색 허브에서 순차적으로 만난다"고
  // 서술하는 조사/탐문 구간 세 곳(전시장 인물 자유 관람/용의자 탐문/재검증)만
  // 탐색 허브(dev/state/explorationState.js + play/explore/)로 다시 연결했다
  // — 심문 라운드 내부는 여전히 선형이다. 라우트가 '/play/explore/'로
  // 시작하면 play/explore/index.html의 onInlineSceneComplete가 페이지 이동
  // 대신 그 안에서 phase/location만 바꾼다(풀 리로드 없음) — see 그 함수의
  // 자체 주석.
  'week2-hub-entry-exhibit': '/play/explore/?phase=W2_EXHIBIT_FREE_LOOK&location=w2-exhibit-floor',
  'week2-hub-entry-suspects': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
  'week2-suspect-interview-return': '/play/explore/?phase=W2_SUSPECT_INTERVIEWS&location=w2-hub-plaza',
  'week2-hub-entry-reverify': '/play/explore/?phase=W2_REVERIFICATION&location=w2-hub-plaza',
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
  'week1-scene-train-minigame': 'week1-scene-train-2',
  'week1-scene-shop-visit': 'week1-scene-circular-quay',
  'week1-scene-circular-quay-minigame': 'week1-scene-002-1',
};
