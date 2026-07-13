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
   have something real driving them.

   `visualBrief` (optional) — a short real-world description of what the
   location physically looks like, used by /dev/upload's 탐색허브 탭 to build
   an AI-image-generation prompt for whichever location a dev has selected
   (see buildHubLocationPrompt() there). Not read by the actual game. */

const locationDefs = {
  'w1-circular-quay': {
    id: 'w1-circular-quay',
    week: 1,
    name: '서큘러키 산책로',
    phases: ['W1_TOURISM'],
    visualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
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
    visualBrief: '서큘러키 건너편에서 시드니 오페라하우스의 흰색 조개껍데기(돛) 모양 지붕이 정면으로 보이는 야외 전망 데크. 관광객들이 난간에 기대 사진을 찍는 밝은 한낮의 워터프론트.',
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-bridge-view'],
  },
  'w1-bridge-view': {
    id: 'w1-bridge-view',
    week: 1,
    name: '하버브리지 전망 구역',
    phases: ['W1_TOURISM'],
    visualBrief: '시드니 하버브리지의 거대한 아치형 철제 구조물이 가까이 보이는 워터프론트 인도. 다리 아래로 페리와 요트가 지나다니는 항구, 길가에 정차된 차량 한두 대가 있는 도로변.',
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-opera-view', 'w1-the-rocks-lane'],
  },
  'w1-the-rocks-lane': {
    id: 'w1-the-rocks-lane',
    week: 1,
    name: '더 록스 골목',
    phases: ['W1_TOURISM'],
    visualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목.',
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-bridge-view', 'w1-the-rocks-boutique', 'w1-exhibition-entrance'],
  },
  'w1-the-rocks-boutique': {
    id: 'w1-the-rocks-boutique',
    week: 1,
    name: '더 록스 옷가게',
    phases: ['W1_TOURISM'],
    visualBrief: '더 록스 골목 안, 작은 편집숍의 쇼윈도와 입구. 옷걸이에 걸린 옷들과 아기자기한 소품이 진열된 쇼윈도가 보이는 아늑한 부티크 외관.',
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
    visualBrief: '더 록스 골목 한쪽에 자리한 작은 팝업 전시장의 유리문 입구. "K-01: 잃어버린 시간들" 배너가 입구 위에 걸려 있고, 유리문 너머로 전시 공간 일부가 살짝 비쳐 보인다.',
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
    visualBrief: '팝업 전시장 입구 앞 작은 광장. 도난 사건 이후라 안내판이나 임시 표지판이 하나 정도 추가된 듯한, 평소보다 한산하고 차분한 분위기의 야외 공간.',
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
    visualBrief: '더 록스 골목의 조용한 지점 — 오래된 사암 건물 사이, 야외 카페 테이블이나 상점 앞 벤치가 있는 자리.',
    characters: ['minah'],
    exits: ['w1-suspect-hub'],
  },
  'w1-suspect-adrian-spot': {
    id: 'w1-suspect-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    visualBrief: '팝업 전시장 내부, 유리 진열장들이 줄지어 있는 보조 전시 구역. 조명이 은은하게 진열품을 비추는 조용한 실내 공간.',
    characters: ['adrian'],
    exits: ['w1-suspect-hub'],
  },
  'w1-suspect-leo-spot': {
    id: 'w1-suspect-leo-spot',
    week: 1,
    name: '접수대·직원 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    visualBrief: '전시장 접수대와 그 옆 직원 전용문 경계. 태그 리더기가 붙은 서비스 문, 접수대 위 서랍과 안내 자료가 보이는 업무 공간.',
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
    visualBrief: 'w1-suspect-hub와 같은 팝업 전시장 앞 광장이지만, 시간이 더 지나 사건이 정리되어가는 느낌의 차분하고 가라앉은 분위기.',
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
    visualBrief: '서큘러키 근처의 세련된 편집숍 내부 또는 쇼윈도 앞 — 윤민아가 일하는 곳. 옷걸이와 액세서리 진열대가 보이는 밝고 정돈된 매장.',
    characters: ['minah'],
    exits: ['w1-reverify-hub'],
  },
  'w1-reverify-adrian-spot': {
    id: 'w1-reverify-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_REVERIFICATION'],
    visualBrief: 'w1-suspect-adrian-spot와 같은 팝업 전시장 내부 보조 진열 구역.',
    characters: ['adrian'],
    exits: ['w1-reverify-hub'],
  },
  'w1-reverify-martin-spot': {
    id: 'w1-reverify-martin-spot',
    week: 1,
    name: '서큘러키 이동 중 (통화)',
    phases: ['W1_REVERIFICATION'],
    visualBrief: '서큘러키 워터프론트 산책로를 걸으며 휴대폰으로 통화하는 구도 — 항구와 페리가 배경에 보이는 야외 산책로.',
    characters: ['martin'],
    exits: ['w1-reverify-hub'],
  },
};
