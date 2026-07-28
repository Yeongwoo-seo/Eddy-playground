/* MISSING KEY DEV — 장소 정의 (The Missing Key v1 §7/§14.6).
   Static catalog, same idiom as caseFileData.js/shopItems.js. First content
   slice: 2주차 Phase 1 관광 자유 탐색 (§12.2) — the exploration hub's own
   framework (explorationState.js, play/explore/) is week/phase-agnostic, this
   file is just its first real data.

   No hardcoded static asset paths — background/character art follows the
   same AssetDB upload pipeline every other scene uses (DevGameState.
   getBackgroundId(locationId) / AssetDB.getAsset), so a location's own `id`
   doubles as its background-asset key, exactly like a VN scene's `id` does
   in play/game/index.html. `firstVisitFlag` (optional) is set once, the first
   time a location is actually entered — see play/explore/index.html's
   moveTo() — so shop-catalog unlockConditions like
   outfit-w2-harbour-breiz/outfit-w2-rocks-vintage (dev/data/shopItems.js)
   have something real driving them.

   `visualBrief` (optional) — a short real-world description of what the
   location physically looks like, used by /dev/upload's 탐색허브 탭 to build
   an AI-image-generation prompt for whichever location a dev has selected
   (see buildHubLocationPrompt() there). Not read by the actual game.

   `investigateHotspots` (optional) — array of entries, x/y (or x1/y1/x2/y2)
   in % of the background image, read by 조사하기's toggle (see
   renderInvestigateHotspots() in play/explore/index.html) to place invisible
   tappable zones directly on the location's own pannable/zoomable #locCanvas
   (no visible marker — 조사하기 is a "look around and find it" tool, not a
   spoiler UI). Two shapes: a point { x, y, interactionId } (legacy — fixed
   40px circular tap zone, still fine for quick placeholder placement) or an
   area { x1, y1, x2, y2, interactionId } (§신규 — sized to the box, same
   rectangle shape play/minigame-phone-search's room hotspots use; no
   /dev/upload area-drawing editor for hub locations yet, so these are
   hand-typed % coordinates for now). interactionId can point at any existing
   interactionDefs entry (topic/minigame/etc.) — a plain 'topic' entry is
   played in place via playInvestigateHotspot() (investigate mode/pan-zoom
   stay untouched, so several spots can be checked back-to-back);
   scene/minigame types fall through to the normal playInteraction() hand-off
   since those leave the hub view anyway. w2-adrian-spot is the first
   location to use this (see its own comment below).

   `charPositions` (optional) — { [characterId]: { x, y } } in px, this
   location's own exception to the hub-wide standing position. Every hub
   character otherwise stands at DEFAULT_HUB_CHAR_POS (play/explore/index.html,
   currently { x: 0, y: -150 }) — a location only needs this field for the
   rare spot where that shared default doesn't fit. Purely a static code
   value now (no runtime editor/override store backs it) — see
   resolveCharPos() in play/explore/index.html.

   `mapPosition` (optional) — { x, y } in % over that phase's overview map
   image (phaseMaps below), for locations landmark-level enough to get their
   own pin on a city map (서큘러키/오페라/하버브리지/더 록스처럼 지도에서
   서로 다른 지점). A location reached only *within* another spot (가게/전시장
   입구 등, 골목 안쪽이라 지도에 따로 찍기 애매한 곳)는 이 필드를 생략한다 —
   이동하기 시트(openMoveSheet, play/explore/index.html)가 그런 위치는 지도
   대신 그 아래 보통 리스트 줄로 보여준다.

   `exits` — 같은 phase 안에서 이동하기가 갈 수 있는 곳을 이 배열로 제한하던
   때가 있었지만(§물리적 인접), 지금은 순전히 참고용 스토리·공간 관계
   기록이다 — 실제 이동하기는 그 phase에 속한 모든 위치를 목적지로 보여준다
   (openMoveSheet). 코드에서 이 필드를 더 읽는 곳은 없다.

   ===== phase-keyed 필드 (§신규 저작 관습) =====
   같은 실제 장소가 phase마다 새 id로 중복 정의되던 문제(예전 w2-suspect-hub/
   w2-reverify-hub, w2-suspect-adrian-spot/w2-reverify-adrian-spot)를 피하려면,
   장소는 한 번만 정의하고 `phases`에 해당하는 phase를 모두 나열한다. 상호작용
   내용 차이는 interactionDefs.js의 각 항목이 이미 자체 `locationIds`+`phases`로
   걸러주므로 대부분은 이것만으로 충분하다(w2-adrian-spot 참고).

   그래도 `characters`/`enterSceneId`/`enterSceneLabel`/`mapPosition`처럼 장소
   자체의 값이 phase마다 달라져야 하는 드문 경우엔, 평범한 값 대신
   `{ __byPhase: true, [phase]: value }` 객체로 쓴다 — play/explore/index.html의
   resolveByPhase(value, phase)가 현재 phase 기준으로 해석한다. `__byPhase`
   마커를 반드시 붙여야 한다 — mapPosition의 평범한 값 자체가 이미 `{x,y}`
   순수 객체라, 마커 없이 "배열 아닌 객체=phase-keyed"로만 판별하면 평범한
   좌표까지 잘못 phase-keyed로 오인해버린다. w2-hub-plaza가 세 필드 모두를
   이렇게 쓰는 예시, w2-adrian-spot은 mapPosition만 이렇게 쓰는 예시다. */

const locationDefs = {
  'w2-circular-quay': {
    id: 'w2-circular-quay',
    week: 2,
    name: '서큘러키 산책로',
    // [탐색허브 재도입] W2_REVERIFICATION 추가 — Ch19(관광팀의 증언, 신규
    // week2-scene-019)가 같은 물리적 장소로 돌아와 단체사진 속 관광객들을
    // 다시 찾는다. 별도 장소를 새로 만들지 않고 재사용한다.
    phases: ['W2_EXHIBIT_FREE_LOOK', 'W2_REVERIFICATION'],
    visualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
    characters: ['youngwoo'],
    exits: ['w2-opera-view', 'w2-bridge-view', 'w2-the-rocks-lane'],
    // 두 phase의 지도 이미지 구도가 달라(W2_REVERIFICATION은 "왼쪽에 서큘러키"
    // 구도, phaseMaps 참고) phase-keyed로 유지한다.
    mapPosition: { __byPhase: true, W2_EXHIBIT_FREE_LOOK: { x: 52, y: 66 }, W2_REVERIFICATION: { x: 20, y: 55 } },
    firstVisitFlag: 'visitedCircularQuay',
  },
  'w2-opera-view': {
    id: 'w2-opera-view',
    week: 2,
    name: '오페라하우스 전망 구역',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '서큘러키 건너편에서 시드니 오페라하우스의 흰색 조개껍데기(돛) 모양 지붕이 정면으로 보이는 야외 전망 데크. 관광객들이 난간에 기대 사진을 찍는 밝은 한낮의 워터프론트.',
    characters: ['youngwoo'],
    exits: ['w2-circular-quay', 'w2-bridge-view'],
    mapPosition: { x: 80, y: 45 },
  },
  'w2-bridge-view': {
    id: 'w2-bridge-view',
    week: 2,
    name: '하버브리지 전망 구역',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '시드니 하버브리지의 거대한 아치형 철제 구조물이 가까이 보이는 워터프론트 인도. 다리 아래로 페리와 요트가 지나다니는 항구, 길가에 정차된 차량 한두 대가 있는 도로변.',
    characters: ['youngwoo'],
    exits: ['w2-circular-quay', 'w2-opera-view', 'w2-the-rocks-lane'],
    mapPosition: { x: 18, y: 28 },
  },
  'w2-the-rocks-lane': {
    id: 'w2-the-rocks-lane',
    week: 2,
    name: '더 록스 골목',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목.',
    characters: ['youngwoo'],
    exits: ['w2-circular-quay', 'w2-bridge-view', 'w2-the-rocks-boutique', 'w2-exhibition-entrance'],
    mapPosition: { x: 24, y: 55 },
  },
  'w2-the-rocks-boutique': {
    id: 'w2-the-rocks-boutique',
    week: 2,
    name: '더 록스 옷가게',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '더 록스 골목 안, 작은 편집숍의 쇼윈도와 입구. 옷걸이에 걸린 옷들과 아기자기한 소품이 진열된 쇼윈도가 보이는 아늑한 부티크 외관.',
    characters: [],
    exits: ['w2-the-rocks-lane'],
    firstVisitFlag: 'visitedTheRocksBoutique',
    // A location can hand off to a routed page instead of showing hotspots —
    // the hub screen treats this exactly like game/index.html's minigame
    // handoff (sessionStorage return-url, see play/explore/index.html).
    routeOnEnter: '/play/shop/',
  },
  'w2-exhibition-entrance': {
    id: 'w2-exhibition-entrance',
    week: 2,
    name: '빈티지 전시장 입구',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '더 록스 골목 한쪽에 자리한 작은 팝업 전시장의 유리문 입구. "K-01: 잃어버린 시간들" 배너가 입구 위에 걸려 있고, 유리문 너머로 전시 공간 일부가 살짝 비쳐 보인다.',
    characters: ['youngwoo'],
    exits: ['w2-the-rocks-lane'],
    // 영역(x1/y1/x2/y2) 핫스팟 — 좌표는 실제 사진이 없어 잠정 배치(§파일
    // 상단 investigateHotspots 주석과 동일한 관례) — /dev/upload로 사진
    // 올린 뒤 재조정 필요.
    investigateHotspots: [
      { x1: 38, y1: 72, x2: 62, y2: 88, interactionId: 'w2en-hotspot-flyer' },
    ],
    // [2주차 관광 자유 탐색 이식] 예전엔 여기서 enterSceneId로 허브를 완전히
    // 나가 다른 phase(W2_EXHIBIT_FREE_LOOK)의 다른 씬으로 넘어갔다. 지금은
    // 관광 스팟과 전시장 내부(w2-exhibit-floor)가 같은 phase를 쓰므로 그런
    // 특별한 "들어간다" 핸드오프가 필요 없다 — 다른 관광 스팟과 똑같이
    // 이동하기로 바로 전시장 내부까지 갈 수 있다.
  },

  /* ===== w2-exhibit-floor — 전시장 자유 관람 (v4 Ch4~5, 탐색허브 재도입)
     =====
     week2-scene-003의 nextSceneId('week2-hub-entry-exhibit', dev/data/
     sceneRoutes.js)로 W2_EXHIBIT_FREE_LOOK phase에 진입한다(시작 위치는
     w2-circular-quay — 관광 스팟도 이 phase 소속이라 이동하기로 여기까지
     자유롭게 걸어 들어온다). v4 원본은 이 구간(다섯 인물 첫 만남 + K-01
     자세히 보기)을 week2-scene-004/005 두 개의 긴 선형 씬으로 대사화했지만,
     원래 아웃라인 문서(docs/week2-storyline-outline-v4.md Ch4) 자신이
     "자유 탐색 허브에서 다섯 인물과 순차적으로" 만난다고 서술한 구간이라 —
     그 대사를 interactionDefs.js의 w2ef-topic-*로 다시 쓰고 여기서 자유
     순서 방문으로 되돌린다. 도난 사건은 아직 일어나지 않았으므로 심문이
     아니라 순수 관계 형성/복선 topic들이다(unlockConditions 없음, 관광
     스팟들과 같은 톤). 다 둘러본 뒤 이 장소의 enterSceneId로 단체사진
     (week2-scene-006)으로 넘어가면 도난 사건(007)으로 이어진다 — 여기서만
     phase를 완전히 벗어난다(다른 관광/전시장 스팟은 그냥 이동하기로 오가는
     같은 phase 안이라 enterSceneId가 없다). 방문 순서·완료 여부와 무관하게
     언제든 나갈 수 있다(§20 게임오버 없음, 다른 허브 장소와 동일한 원칙). */
  'w2-exhibit-floor': {
    id: 'w2-exhibit-floor',
    week: 2,
    name: '팝업 전시장 내부 · K-01 진열대',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    visualBrief: '작은 팝업 전시장 내부. 중앙에 조명을 받는 황동 공예품 K-01 진열대가 있고, 한쪽엔 카페 코너, 다른 한쪽엔 접수대와 보조 진열 구역이 있는 아늑한 실내 전시 공간.',
    characters: ['claire', 'sophie', 'minah', 'adrian', 'leo'],
    exits: [],
    // 영역(x1/y1/x2/y2) 핫스팟 — 좌표는 실제 사진이 없어 잠정 배치(§파일
    // 상단 investigateHotspots 주석과 동일한 관례) — /dev/upload로 사진
    // 올린 뒤 재조정 필요. 조명은 증거 없는 순수 분위기, 나머지 둘은
    // 레오/애드리언 쪽 보강 물증(필수 게이트 아님 — see interactionDefs.js
    // w2ef-hotspot-* 주석).
    investigateHotspots: [
      { x1: 38, y1: 6, x2: 62, y2: 30, interactionId: 'w2ef-hotspot-k01-light' },
      { x1: 72, y1: 52, x2: 92, y2: 78, interactionId: 'w2ef-hotspot-staffdoor' },
      { x1: 14, y1: 42, x2: 36, y2: 68, interactionId: 'w2ef-hotspot-pedestal' },
    ],
    enterSceneId: 'week2-scene-006',
    enterSceneLabel: '이제 단체사진 찍으러 가자',
  },

  /* ===== Phase 4 — 용의자 탐문 (The Missing Key v1 §12.6) =====
     Reached from week2-scene-005b's nextSceneId (다니엘 최초 진술 종료 후).
     Each suspect spot has exactly one interaction: a full hand-off into
     that suspect's existing, untouched interrogation scene (week2-scene-006/
     007/008) — see dev/data/interactionDefs.js. Visiting 레오 (008) is the
     one that already had its own downstream chain (timeline minigame ->
     008a -> 009); the other two return here via 'week2-suspect-interview-
     return' (see MINIGAME_ROUTES in dev/data/sceneRoutes.js). */
  // w2-hub-plaza — Phase 4(탐문)/Phase 5(재검증)가 같은 실제 장소(전시장 앞
  // 광장)를 썼는데 예전엔 phase마다 별도 id(w2-suspect-hub/w2-reverify-hub)로
  // 중복 정의되어 있었다(§신규 통합 — 저작 부담을 줄이려고 phase-keyed 필드로
  // 병합). characters/enterSceneId/enterSceneLabel/mapPosition처럼 phase마다
  // 값이 달라야 하는 필드는 파일 상단 "phase-keyed 필드" 관례대로 `{ __byPhase:
  // true, [phase]: value }` 형태로 쓴다.
  'w2-hub-plaza': {
    id: 'w2-hub-plaza',
    week: 2,
    name: '전시장 앞 광장',
    phases: ['W2_SUSPECT_INTERVIEWS', 'W2_REVERIFICATION'],
    visualBrief: '팝업 전시장 입구 앞 작은 광장. 탐문 단계엔 도난 사건 직후라 안내판이나 임시 표지판이 하나 정도 추가된 듯한 한산한 분위기, 재검증 단계엔 시간이 더 지나 사건이 정리되어가는 차분하고 가라앉은 분위기.',
    // 영우는 탐문(Phase 4) 동안만 이 광장에 지수와 같이 있다 — Phase 1 사전
    // 복선(§신규)이 실제 증거로 바뀌는 회상 topic(w2sh-topic-van-recall, see
    // interactionDefs.js)을 걸 chip이 필요해서였다. 재검증(Phase 5)엔 그
    // topic 대신 다니엘 신원 확인(w1reverify-daniel-interview, v4 Ch18)이
    // 있어 다니엘이 이 광장에 서 있다.
    characters: { __byPhase: true, W2_SUSPECT_INTERVIEWS: ['youngwoo'], W2_REVERIFICATION: ['daniel-guide'] },
    exits: ['w2-suspect-mina-spot', 'w2-adrian-spot', 'w2-suspect-leo-spot', 'w2-reverify-martin-spot', 'w2-reverify-sophie-spot'],
    // "지금까지의 단서로 사건을 재구성한다" 진행 버튼은 재검증 단계에만 뜬다
    // (§10.4 "제안을 미뤄도 추가 탐색 가능" — 여섯 재검증 대상을 다 안 돌아도
    // 언제든 진행 가능, 강제 조건 없음). [탐색허브 재도입] v4에서 사건 재구성에
    // 해당하는 씬은 일정표 재해석(week2-scene-020)이다 — 옛 week2-scene-012는
    // 이제 1부 안의 다른 비트(K-01 회수)라 더 이상 여기서 쓰지 않는다.
    enterSceneId: { __byPhase: true, W2_REVERIFICATION: 'week2-scene-020' },
    enterSceneLabel: { __byPhase: true, W2_REVERIFICATION: '지금까지의 단서로 사건을 재구성한다' },
    // 두 phase의 지도 이미지(map-w2-suspect/map-w2-reverify)가 서로 다른
    // 그림이라 핀 좌표도 phase마다 따로 유지해야 한다.
    mapPosition: { __byPhase: true, W2_SUSPECT_INTERVIEWS: { x: 50, y: 58 }, W2_REVERIFICATION: { x: 68, y: 60 } },
  },
  'w2-suspect-mina-spot': {
    id: 'w2-suspect-mina-spot',
    week: 2,
    name: '더 록스 골목',
    phases: ['W2_SUSPECT_INTERVIEWS'],
    visualBrief: '더 록스 골목의 조용한 지점 — 오래된 사암 건물 사이, 야외 카페 테이블이나 상점 앞 벤치가 있는 자리.',
    characters: ['minah'],
    exits: ['w2-hub-plaza'],
    mapPosition: { x: 18, y: 38 },
  },
  // w2-adrian-spot — Phase 4/5가 같은 실제 장소(전시장 보조 진열 구역)와 같은
  // 인물(애드리언)을 썼는데 예전엔 phase마다 별도 id로 중복 정의되어 있었다
  // (§신규 통합). 상호작용 내용 차이는 interactionDefs.js의 각 항목이 이미
  // 자체 phases로 걸러주므로 enterSceneId 같은 phase-keyed 필드는 필요 없다
  // — 다만 mapPosition은 두 phase의 지도 이미지가 서로 다른 그림이라 여전히
  // phase-keyed로 유지한다.
  //
  // §신규 — W2_EXHIBIT_FREE_LOOK(사건 이전 자유 조사, 관광 스팟과 같은
  // phase)도 이 같은 물리적 장소를 쓴다. 원래 이 구역의 증거 수집은
  // week2-scene-003 → week2-scene-003-minigame(dev/minigame-exhibition-search,
  // 별도 전용 미니게임 페이지)이 전담했지만, 그 10개 핫스팟을 전부 이
  // 장소의 investigateHotspots(조사하기)로 옮기고 미니게임 자체는
  // 삭제했다 — 탐문/재검증 단계 장소를 사건 전 자유 조사에도 재사용해,
  // 별도 미니게임 UI 없이 허브의 조사하기 하나로 통일한다(§신규 통합,
  // 관련 interactionDefs는 w2as-topic-* 참고). 다섯 인물을 만나기 전(사건
  // 전 자유 조사) 동안은 애드리언이 아직 등장하지 않으므로 `characters`를
  // phase-keyed로 바꿔 그 phase만 비워둔다. mapPosition은 W2_EXHIBIT_FREE_LOOK
  // 키를 일부러 생략했다 — w2-exhibition-entrance와 같은 이유(§파일 상단
  // mapPosition 주석: "안쪽이라 지도에 따로 찍기 애매한 곳")로, 관광
  // 지도엔 핀 대신 이동하기 리스트 줄로 뜬다.
  'w2-adrian-spot': {
    id: 'w2-adrian-spot',
    week: 2,
    name: '전시장 보조 진열 구역',
    phases: ['W2_EXHIBIT_FREE_LOOK', 'W2_SUSPECT_INTERVIEWS', 'W2_REVERIFICATION'],
    visualBrief: '팝업 전시장 내부, 유리 진열장들이 줄지어 있는 보조 전시 구역. 조명이 은은하게 진열품을 비추는 조용한 실내 공간.',
    characters: { __byPhase: true, W2_SUSPECT_INTERVIEWS: ['adrian'], W2_REVERIFICATION: ['adrian'] },
    exits: ['w2-hub-plaza'],
    mapPosition: { __byPhase: true, W2_SUSPECT_INTERVIEWS: { x: 72, y: 32 }, W2_REVERIFICATION: { x: 82, y: 38 } },
    // 사건 전 자유 조사 10개 핫스팟(구 minigame-exhibition-search HOTSPOTS) —
    // x/y는 실제 사진이 아직 없어 잠정 배치한 값이라, /dev/upload로 진짜
    // 사진을 올린 뒤 눈으로 보고 다시 잡아야 한다(§파일 상단 investigateHotspots
    // 주석 참고). 마커가 안 보이는 순수 탭 존이라 icon은 안 쓴다(§신규 —
    // play/explore/index.html의 .investigate-hotspot 참고).
    investigateHotspots: [
      { x: 50, y: 30, interactionId: 'w2as-topic-k01' },
      { x: 20, y: 55, interactionId: 'w2as-topic-camera' },
      { x: 78, y: 50, interactionId: 'w2as-topic-watch' },
      { x: 35, y: 75, interactionId: 'w2as-topic-desk' },
      { x: 60, y: 78, interactionId: 'w2as-topic-tag' },
      { x: 88, y: 72, interactionId: 'w2as-topic-staffdoor' },
      { x: 30, y: 40, interactionId: 'w2as-topic-pamphlet' },
      { x: 65, y: 35, interactionId: 'w2as-topic-guestbook' },
      { x: 50, y: 12, interactionId: 'w2as-topic-ceiling' },
      { x: 10, y: 85, interactionId: 'w2as-topic-entrance' },
    ],
    // [2주차 관광 자유 탐색 이식] 예전엔 W2_TOURISM 동안 여기서 "이제
    // 안쪽으로 들어가자" 버튼으로 다른 phase(W2_EXHIBIT_FREE_LOOK)의
    // week2-scene-004(이미 재생 경로에서 빠진 고아 씬)로 나갔다. 지금은
    // 관광 스팟과 이 장소가 같은 phase라 그런 핸드오프가 필요 없다 —
    // w2-exhibit-floor(다섯 인물)로도 이동하기로 바로 갈 수 있다.
  },
  'w2-suspect-leo-spot': {
    id: 'w2-suspect-leo-spot',
    week: 2,
    // [탐색허브 재도입] W2_REVERIFICATION 추가 — Ch16(레오 재심문, 신규
    // week2-scene-016)이 같은 장소·같은 인물을 다시 쓴다.
    name: '접수대·직원 구역',
    phases: ['W2_SUSPECT_INTERVIEWS', 'W2_REVERIFICATION'],
    visualBrief: '전시장 접수대와 그 옆 직원 전용문 경계. 태그 리더기가 붙은 서비스 문, 접수대 위 서랍과 안내 자료가 보이는 업무 공간.',
    characters: ['leo'],
    exits: ['w2-hub-plaza'],
    mapPosition: { __byPhase: true, W2_SUSPECT_INTERVIEWS: { x: 68, y: 70 }, W2_REVERIFICATION: { x: 78, y: 42 } },
  },

  /* ===== Phase 5 — 모순 재검증 / 2부 재조사 (v4 Ch14~19, 탐색허브 재도입) =====
     Reached from week2-scene-013's nextSceneId('week2-hub-entry-reverify',
     dev/data/sceneRoutes.js). 여섯 재검증 대상(마틴 통화/애드리언 재심문/레오
     재심문/소피/다니엘 신원 확인/관광객 재조사)은 서로 참조하는 내부
     condition이 없어 자유 순서로 열어 둔다 — Phase 4와 동일한 "통짜 씬 단위
     hand-off" 패턴. 사건 재구성(v4에서는 week2-scene-020, 일정표 재해석)으로
     넘어가는 조건은 일부러 강제하지 않았다(§10.4 "제안을 미뤄도 추가 탐색
     가능") — 여섯 곳을 다 안 돌아도 hub-plaza에서 언제든 진행할 수 있다.
     애드리언은 w2-adrian-spot(위, Phase 4/5 공용)에서, 레오는 w2-suspect-
     leo-spot(위, Phase 4/5 공용)에서 이미 다룬다. 윤민아는 v4에 재검증
     챕터가 없어(그의 2부 역할은 이미 week2-scene-012에서 소화됨) 이 phase에
     스팟이 없다. */
  'w2-reverify-martin-spot': {
    id: 'w2-reverify-martin-spot',
    week: 2,
    name: '서큘러키 이동 중 (통화)',
    phases: ['W2_REVERIFICATION'],
    visualBrief: '서큘러키 워터프론트 산책로를 걸으며 휴대폰으로 통화하는 구도 — 항구와 페리가 배경에 보이는 야외 산책로.',
    characters: ['martin'],
    exits: ['w2-hub-plaza'],
    mapPosition: { x: 38, y: 72 },
  },
  // [탐색허브 재도입] v4 Ch17(소피의 생활 기억) 전용 신규 장소 — 옛 Phase 5엔
  // 소피 스팟이 없었다(v3엔 없던 인물 비중). 카페 카운터, 소피가 일하는 곳.
  'w2-reverify-sophie-spot': {
    id: 'w2-reverify-sophie-spot',
    week: 2,
    name: 'Café near Circular Quay',
    phases: ['W2_REVERIFICATION'],
    visualBrief: '서큘러키 근처 작은 카페의 카운터 안쪽. 컵과 원두 봉투가 정리된 선반, 소피가 일하는 아늑한 카페 내부.',
    characters: ['sophie'],
    exits: ['w2-hub-plaza'],
    mapPosition: { x: 30, y: 68 },
  },
};

/* ===== 지도 화면 (phase별 오버뷰) =====
   이동하기 시트(openMoveSheet, play/explore/index.html)가 exit 목록을 보여줄 때,
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
  // [2주차 관광 자유 탐색 이식] phaseMaps 딕셔너리 키는 W2_TOURISM →
  // W2_EXHIBIT_FREE_LOOK으로 옮겼지만(관광 스팟이 이제 그 phase 소속),
  // `id`(배경 에셋 조회 키, /dev/upload가 쓰는 값)는 'map-w2-tourism' 그대로
  // 둔다 — 이미 올려둔 지도 사진이 있다면 끊기지 않게.
  W2_EXHIBIT_FREE_LOOK: {
    id: 'map-w2-tourism',
    name: '시드니 지도 (2주차 · 관광 · 전시장 자유 관람)',
    visualBrief: '시드니 서큘러키를 중심으로 왼쪽 위엔 하버브리지, 왼쪽 중간엔 더 록스 지구, 오른쪽엔 오페라하우스가 있는 워터프론트 일대. 실제 지리 그대로가 아니라 관광 안내 지도 수준으로 단순화된 구도.',
  },
  W2_SUSPECT_INTERVIEWS: {
    id: 'map-w2-suspect',
    name: '전시장 지도 (2주차 · 용의자 탐문)',
    visualBrief: '팝업 전시장과 그 앞 광장을 중심으로, 왼쪽에 더 록스 골목으로 이어지는 좁은 길이 붙은 구도. 오른쪽 전시장 내부엔 보조 진열 구역과 접수대가 나란히 있다. 도난 사건 이후라 안내판이 늘고 한산해진, 차분한 분위기.',
  },
  W2_REVERIFICATION: {
    id: 'map-w2-reverify',
    name: '전시장·서큘러키 지도 (2주차 · 재검증)',
    visualBrief: '오른쪽에 팝업 전시장(광장과 보조 진열 구역), 왼쪽에 서큘러키 워터프론트(편집숍과 산책로)가 이어지는 구도. 사건이 정리되어가는 늦은 오후, 신중하고 가라앉은 분위기.',
  },
};
