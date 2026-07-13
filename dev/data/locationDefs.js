/* OPERATION MK DEV — 장소 정의 (The Missing Key v1 §7/§14.6).
   Static catalog, same idiom as caseFileData.js/shopItems.js. First content
   slice: 1주차 Phase 1 관광 자유 탐색 (§12.2) — the exploration hub's own
   framework (explorationState.js, dev/explore/) is week/phase-agnostic, this
   file is just its first real data.

   No hardcoded static asset paths — background/character art follows the
   same AssetDB upload pipeline every other scene uses (DevGameState.
   getBackgroundId(locationId) / AssetDB.getAsset), so a location's own `id`
   doubles as its background-asset key, exactly like a VN scene's `id` does
   in dev/game/index.html. `firstVisitFlag` (optional) is set once, the first
   time a location is actually entered — see dev/explore/index.html's
   moveTo() — so shop-catalog unlockConditions like
   outfit-w1-harbour-breiz/outfit-w1-rocks-vintage (dev/data/shopItems.js)
   have something real driving them. */

const locationDefs = {
  'w1-circular-quay': {
    id: 'w1-circular-quay',
    week: 1,
    name: '서큘러키 산책로',
    phases: ['W1_TOURISM'],
    characters: ['youngwoo'],
    exits: ['w1-opera-view', 'w1-bridge-view', 'w1-the-rocks-lane'],
    firstVisitFlag: 'visitedCircularQuay',
    // §12.2 — week1-scene-001 hands off straight into this hub now (see
    // dialogueData.js) instead of chaining into week1-scene-002 directly.
    // firstVisitSceneId keeps that scene's own content (사진 포즈 루프,
    // 전시장 발견 선택지) completely intact — it just fires automatically
    // the first time the player actually arrives here, then behaves like
    // any other hub location on later visits (see moveTo() in
    // dev/explore/index.html).
    firstVisitSceneId: 'week1-scene-002',
  },
  'w1-opera-view': {
    id: 'w1-opera-view',
    week: 1,
    name: '오페라하우스 전망 구역',
    phases: ['W1_TOURISM'],
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-bridge-view'],
  },
  'w1-bridge-view': {
    id: 'w1-bridge-view',
    week: 1,
    name: '하버브리지 전망 구역',
    phases: ['W1_TOURISM'],
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-opera-view', 'w1-the-rocks-lane'],
  },
  'w1-the-rocks-lane': {
    id: 'w1-the-rocks-lane',
    week: 1,
    name: '더 록스 골목',
    phases: ['W1_TOURISM'],
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-bridge-view', 'w1-the-rocks-boutique', 'w1-exhibition-entrance'],
  },
  'w1-the-rocks-boutique': {
    id: 'w1-the-rocks-boutique',
    week: 1,
    name: '더 록스 옷가게',
    phases: ['W1_TOURISM'],
    characters: [],
    exits: ['w1-the-rocks-lane'],
    firstVisitFlag: 'visitedTheRocksBoutique',
    // A location can hand off to a routed page instead of showing hotspots —
    // the hub screen treats this exactly like game/index.html's minigame
    // handoff (sessionStorage return-url, see dev/explore/index.html).
    routeOnEnter: '/dev/shop/',
  },
  'w1-exhibition-entrance': {
    id: 'w1-exhibition-entrance',
    week: 1,
    name: '빈티지 전시장 입구',
    phases: ['W1_TOURISM'],
    characters: ['youngwoo'],
    exits: ['w1-the-rocks-lane'],
    // A location can also hand off *back into the VN* instead of only to
    // another routed page (routeOnEnter) or hub location (exits) — the hub
    // screen shows this as a distinct "들어간다" action, not a normal exit
    // chip, since it leaves the hub for good (spec §12.2's soft-gate: the
    // player chose "조금 더 둘러본다" earlier from week1-scene-002, wandered
    // the hub, and this is where they finally commit to going in).
    enterSceneId: 'week1-scene-003',
    enterSceneLabel: '전시장에 들어간다',
  },

  /* ===== Phase 4 — 용의자 탐문 (The Missing Key v1 §12.6) =====
     Reached from week1-scene-005b's nextSceneId (다니엘 최초 진술 종료 후).
     Each suspect spot has exactly one interaction: a full hand-off into
     that suspect's existing, untouched interrogation scene (week1-scene-006/
     007/008) — see dev/data/interactionDefs.js. Visiting 레오 (008) is the
     one that already had its own downstream chain (timeline minigame ->
     008a -> 009); the other two return here via 'week1-suspect-interview-
     return' (see MINIGAME_ROUTES in game/index.html). */
  'w1-suspect-hub': {
    id: 'w1-suspect-hub',
    week: 1,
    name: '전시장 앞 광장 (탐문 거점)',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    // 영우는 이 광장에 지수와 계속 같이 있다 — Phase 1 사전 복선(§신규)이
    // 실제 증거로 바뀌는 회상 topic(w1sh-topic-van-recall, see
    // interactionDefs.js)을 걸 chip이 필요해서 추가했다. 용의자 3인은 각자의
    // spot(mina/adrian/leo-spot)에만 있으므로 여기 목록엔 안 넣는다.
    characters: ['youngwoo'],
    exits: ['w1-suspect-mina-spot', 'w1-suspect-adrian-spot', 'w1-suspect-leo-spot'],
  },
  'w1-suspect-mina-spot': {
    id: 'w1-suspect-mina-spot',
    week: 1,
    name: '더 록스 골목',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    characters: ['minah'],
    exits: ['w1-suspect-hub'],
  },
  'w1-suspect-adrian-spot': {
    id: 'w1-suspect-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    characters: ['adrian'],
    exits: ['w1-suspect-hub'],
  },
  'w1-suspect-leo-spot': {
    id: 'w1-suspect-leo-spot',
    week: 1,
    name: '접수대·직원 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    characters: ['leo'],
    exits: ['w1-suspect-hub'],
  },

  /* ===== Phase 5 — 모순 재검증 (The Missing Key v1 §12.8) =====
     Reached from week1-scene-010's nextSceneId (윤민아 재오픈 직후). 세 재검증
     대상(윤민아 최종 심문/애드리언 재심문/마틴 베일 통화)은 서로 참조하는
     내부 condition이 없어 자유 순서로 열어 둔다 — Phase 4와 동일한
     "통짜 씬 단위 hand-off" 패턴. 사건 재구성(week1-scene-012)으로 넘어가는
     조건은 일부러 강제하지 않았다(§10.4 "제안을 미뤄도 추가 탐색 가능") —
     세 곳을 다 안 돌아도 hub-center에서 언제든 진행할 수 있다. */
  'w1-reverify-hub': {
    id: 'w1-reverify-hub',
    week: 1,
    name: '전시장 앞 광장 (재검증 거점)',
    phases: ['W1_REVERIFICATION'],
    characters: [],
    exits: ['w1-reverify-mina-spot', 'w1-reverify-adrian-spot', 'w1-reverify-martin-spot'],
    enterSceneId: 'week1-scene-012',
    enterSceneLabel: '지금까지의 단서로 사건을 재구성한다',
  },
  'w1-reverify-mina-spot': {
    id: 'w1-reverify-mina-spot',
    week: 1,
    name: '서큘러키 편집숍',
    phases: ['W1_REVERIFICATION'],
    characters: ['minah'],
    exits: ['w1-reverify-hub'],
  },
  'w1-reverify-adrian-spot': {
    id: 'w1-reverify-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_REVERIFICATION'],
    characters: ['adrian'],
    exits: ['w1-reverify-hub'],
  },
  'w1-reverify-martin-spot': {
    id: 'w1-reverify-martin-spot',
    week: 1,
    name: '서큘러키 이동 중 (통화)',
    phases: ['W1_REVERIFICATION'],
    characters: ['martin'],
    exits: ['w1-reverify-hub'],
  },
};
