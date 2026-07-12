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
    characters: [],
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
};
