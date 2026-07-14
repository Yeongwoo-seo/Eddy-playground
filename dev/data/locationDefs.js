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
   (see buildHubLocationPrompt() there). Not read by the actual game.

   `investigateHotspots` (optional) — array of { x, y, interactionId, icon },
   x/y in % of the background image, read by 조사하기's toggle (see
   renderInvestigateHotspots() in dev/explore/index.html) to place tappable
   markers directly on the location's own pannable/zoomable #locCanvas.
   interactionId can point at any existing interactionDefs entry (topic/
   minigame/etc.) — same playInteraction() hand-off 대화하기 uses, just
   reached by tapping a spot in the photo instead of picking from a list.
   No location defines any yet (needs a dev looking at the actual generated
   background to place them sensibly); 조사하기 still toggles on and works
   with zero hotspots, it just has nothing to mark.

   `charPositions` (optional) — { [characterId]: { x, y } } in px, this
   location's own exception to the hub-wide standing position. Every hub
   character otherwise stands at DEFAULT_HUB_CHAR_POS (dev/explore/index.html,
   currently { x: 0, y: -150 }) — a location only needs this field for the
   rare spot where that shared default doesn't fit. Purely a static code
   value now (no runtime editor/override store backs it) — see
   resolveCharPos() in dev/explore/index.html.

   `mapPosition` (optional) — { x, y } in % over that phase's overview map
   image (phaseMaps below), for locations landmark-level enough to get their
   own pin on a city map (서큘러키/오페라/하버브리지/더 록스처럼 지도에서
   서로 다른 지점). A location reached only *within* another spot (가게/전시장
   입구 등, 골목 안쪽이라 지도에 따로 찍기 애매한 곳)는 이 필드를 생략한다 —
   이동하기 시트(openMoveSheet, dev/explore/index.html)가 그런 위치는 지도
   대신 그 아래 보통 리스트 줄로 보여준다.

   `exits` — 같은 phase 안에서 이동하기가 갈 수 있는 곳을 이 배열로 제한하던
   때가 있었지만(§물리적 인접), 지금은 순전히 참고용 스토리·공간 관계
   기록이다 — 실제 이동하기는 그 phase에 속한 모든 위치를 목적지로 보여준다
   (openMoveSheet). 코드에서 이 필드를 더 읽는 곳은 없다. */

const locationDefs = {
  'w1-circular-quay': {
    id: 'w1-circular-quay',
    week: 1,
    name: '서큘러키 산책로',
    phases: ['W1_TOURISM'],
    visualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
    characters: ['youngwoo'],
    exits: ['w1-opera-view', 'w1-bridge-view', 'w1-the-rocks-lane'],
    mapPosition: { x: 52, y: 66 },
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
    mapPosition: { x: 80, y: 45 },
  },
  'w1-bridge-view': {
    id: 'w1-bridge-view',
    week: 1,
    name: '하버브리지 전망 구역',
    phases: ['W1_TOURISM'],
    visualBrief: '시드니 하버브리지의 거대한 아치형 철제 구조물이 가까이 보이는 워터프론트 인도. 다리 아래로 페리와 요트가 지나다니는 항구, 길가에 정차된 차량 한두 대가 있는 도로변.',
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-opera-view', 'w1-the-rocks-lane'],
    mapPosition: { x: 18, y: 28 },
  },
  'w1-the-rocks-lane': {
    id: 'w1-the-rocks-lane',
    week: 1,
    name: '더 록스 골목',
    phases: ['W1_TOURISM'],
    visualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목.',
    characters: ['youngwoo'],
    exits: ['w1-circular-quay', 'w1-bridge-view', 'w1-the-rocks-boutique', 'w1-exhibition-entrance'],
    mapPosition: { x: 24, y: 55 },
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
    mapPosition: { x: 50, y: 58 },
  },
  'w1-suspect-mina-spot': {
    id: 'w1-suspect-mina-spot',
    week: 1,
    name: '더 록스 골목',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    visualBrief: '더 록스 골목의 조용한 지점 — 오래된 사암 건물 사이, 야외 카페 테이블이나 상점 앞 벤치가 있는 자리.',
    characters: ['minah'],
    exits: ['w1-suspect-hub'],
    mapPosition: { x: 18, y: 38 },
  },
  'w1-suspect-adrian-spot': {
    id: 'w1-suspect-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    visualBrief: '팝업 전시장 내부, 유리 진열장들이 줄지어 있는 보조 전시 구역. 조명이 은은하게 진열품을 비추는 조용한 실내 공간.',
    characters: ['adrian'],
    exits: ['w1-suspect-hub'],
    mapPosition: { x: 72, y: 32 },
  },
  'w1-suspect-leo-spot': {
    id: 'w1-suspect-leo-spot',
    week: 1,
    name: '접수대·직원 구역',
    phases: ['W1_SUSPECT_INTERVIEWS'],
    visualBrief: '전시장 접수대와 그 옆 직원 전용문 경계. 태그 리더기가 붙은 서비스 문, 접수대 위 서랍과 안내 자료가 보이는 업무 공간.',
    characters: ['leo'],
    exits: ['w1-suspect-hub'],
    mapPosition: { x: 68, y: 70 },
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
    mapPosition: { x: 68, y: 60 },
  },
  'w1-reverify-mina-spot': {
    id: 'w1-reverify-mina-spot',
    week: 1,
    name: '서큘러키 편집숍',
    phases: ['W1_REVERIFICATION'],
    visualBrief: '서큘러키 근처의 세련된 편집숍 내부 또는 쇼윈도 앞 — 윤민아가 일하는 곳. 옷걸이와 액세서리 진열대가 보이는 밝고 정돈된 매장.',
    characters: ['minah'],
    exits: ['w1-reverify-hub'],
    mapPosition: { x: 22, y: 35 },
  },
  'w1-reverify-adrian-spot': {
    id: 'w1-reverify-adrian-spot',
    week: 1,
    name: '전시장 보조 진열 구역',
    phases: ['W1_REVERIFICATION'],
    visualBrief: 'w1-suspect-adrian-spot와 같은 팝업 전시장 내부 보조 진열 구역.',
    characters: ['adrian'],
    exits: ['w1-reverify-hub'],
    mapPosition: { x: 82, y: 38 },
  },
  'w1-reverify-martin-spot': {
    id: 'w1-reverify-martin-spot',
    week: 1,
    name: '서큘러키 이동 중 (통화)',
    phases: ['W1_REVERIFICATION'],
    visualBrief: '서큘러키 워터프론트 산책로를 걸으며 휴대폰으로 통화하는 구도 — 항구와 페리가 배경에 보이는 야외 산책로.',
    characters: ['martin'],
    exits: ['w1-reverify-hub'],
    mapPosition: { x: 38, y: 72 },
  },
};

/* ===== 지도 화면 (phase별 오버뷰) =====
   이동하기 시트(openMoveSheet, dev/explore/index.html)가 exit 목록을 보여줄 때,
   그 phase에 여기 정의가 있으면 리스트 대신 지도 그림 위에 원형 핀 버튼을
   얹는다 — 위 locationDefs 항목들의 mapPosition이 핀 좌표. 지도 자체의 배경
   사진은 각 위치 사진과 같은 방식(DevGameState.getBackgroundId)으로 조회하며,
   `id`가 바로 그 조회 키(/dev/upload 탐색허브 탭이 이 phaseMaps도 위치처럼
   노출해 사진을 배정한다). 정의가 없는 phase는 기존 리스트 방식 그대로
   동작하지만, 지금은 세 허브 phase(관광/용의자 탐문/재검증) 모두 자기 지도를
   갖는다 — 탐문·재검증은 구역이 좁아 mapPosition을 아예 생략하고 리스트만
   보여주던 때가 있었으나(§초기 설계), 실제로는 phase마다 별개의 장소들이라
   지도가 있는 편이 이동 감각에 낫다고 판단해 추가했다.

   `visualBrief`는 buildHubLocationPrompt와 같은 조합 방식을 지도용으로 쓸 때
   참고할 실제 지리 설명 — 지도 이미지 자체는 사진이 아니라 일러스트 스타일로
   생성하므로 그 프롬프트는 buildHubLocationPrompt가 아니라 별도로 짠다. */
const phaseMaps = {
  W1_TOURISM: {
    id: 'map-w1-tourism',
    name: '시드니 지도 (1주차 · 관광)',
    visualBrief: '시드니 서큘러키를 중심으로 왼쪽 위엔 하버브리지, 왼쪽 중간엔 더 록스 지구, 오른쪽엔 오페라하우스가 있는 워터프론트 일대. 실제 지리 그대로가 아니라 관광 안내 지도 수준으로 단순화된 구도.',
  },
  W1_SUSPECT_INTERVIEWS: {
    id: 'map-w1-suspect',
    name: '전시장 지도 (1주차 · 용의자 탐문)',
    visualBrief: '팝업 전시장과 그 앞 광장을 중심으로, 왼쪽에 더 록스 골목으로 이어지는 좁은 길이 붙은 구도. 오른쪽 전시장 내부엔 보조 진열 구역과 접수대가 나란히 있다. 도난 사건 이후라 안내판이 늘고 한산해진, 차분한 분위기.',
  },
  W1_REVERIFICATION: {
    id: 'map-w1-reverify',
    name: '전시장·서큘러키 지도 (1주차 · 재검증)',
    visualBrief: '오른쪽에 팝업 전시장(광장과 보조 진열 구역), 왼쪽에 서큘러키 워터프론트(편집숍과 산책로)가 이어지는 구도. 사건이 정리되어가는 늦은 오후, 신중하고 가라앉은 분위기.',
  },
};
