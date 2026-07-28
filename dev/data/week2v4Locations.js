// 2주차 v4 재설계 — 장소별 배경 이미지 프롬프트 데이터.
// dev/week2/redesign/locations/index.html 에서 읽는다.
//
// `hubLocationId`가 있는 항목은 dev/data/locationDefs.js에 이미 등록된 실제
// 허브 장소(서큘러키/더 록스 골목/전시장 입구 — v4에서도 물리적으로 같은
// 곳)라서 realVisualBrief를 그대로 가져와 재사용한다. `hubLocationId`가
// 없는 항목(전시장 내부·카페·숙소·패디스 마켓)은 허브가 아니라 씬 전용
// (legacy) 배경이라 anchorSceneId(dev/dialogueData.js에 실제 등록된
// week2-scene-XXX id)로만 업로드를 연결한다.
//
// `needsNewPhoto: false`인 항목은 물리적으로 완전히 같은 공간을 이전 주차
// (1주차 숙소) 또는 탐색허브(서큘러키/더 록스 골목/전시장 입구)가 이미
// 촬영/생성해 갖고 있다는 뜻 — 이 페이지가 "뭘 새로 만들어야 하는지"를 한눈에
// 보여줄 수 있도록, 재사용 가능한 항목은 새 프롬프트를 만들지 않고
// buildWeek2v4LocationPrompt가 짧은 재사용 안내(+ requiredElements 재확인
// 체크리스트)만 반환한다. 전시장 내부/카페는 기존(v3, 실제 서비스 중인)
// 2주차 씬과 물리적으로 같은 공간일 가능성이 높지만 v4 전용 구도(예: 카페의
// 임시 보관함 캐비닛이 잘 보이는 각도)가 필요할 수 있어 일단
// needsNewPhoto: true로 두고 reuseHint에 확인할 점을 적어둔다 — 실제로
// 장소 DB에서 기존 catalog 위치에 배정해 재사용할 수 있는지는 /dev/upload의
// 장소 DB 탭에서 직접 확인 후 결정한다.
//
// storyContext는 realVisualBrief/v4Note(한 줄 요약)와 별개로, 이 장소가
// 실제로 등장하는 모든 장면을 대본 원문(docs/week2-v4-script.md) 기준으로
// 시간대·조명·분위기·그 순간 인물의 행동까지 옮겨온 필드다 — 톤과 구도를
// 정확히 맞추는 데 쓰고, 화면에 직접 드러날 필요는 없다. 각 문장 끝의
// (script L.xxxx)는 해당 지문/대사의 스크립트 줄 번호다.
//
// requiredElements는 storyContext에서 뽑아낸 "반드시 이 배경 사진에 보여야
// 하는" 구체적 시각 요소 체크리스트다 — 특히 탐색허브의 investigateHotspots
// (dev/data/interactionDefs.js, locationDefs.js)처럼 배경 사진 위 특정
// 지점을 탭해야 하는 상호작용이 걸린 장소는, 그 지점이 실제로 사진에 보이지
// 않으면 좌표를 잡을 수 없다 — 그런 항목을 우선 담았다.
//
// [주의 — 챕터 단위 라벨과 실제 물리적 공간이 어긋나는 경우] 대본은 "Chapter"
// 단위로 묶여 있지만 한 챕터 안에서 장소가 바뀌는 경우가 있다(예: 옛 Ch11은
// 전반부가 전시장 직원문 근처, 후반부가 카페 보관함). 아래 appearsIn은 실제
// dev/dialogueData.js의 week2-scene-XXX 단위(대본의 "Chapter"보다 세밀함)로
// 맞춰 배정했다 — 이전 버전에서 챕터 라벨만 보고 카페/서큘러키에 잘못
// 배정돼 있던 두 건(구 Ch10/11 전체 → 카페, 구 Ch13 → 서큘러키)을 이번에
// 대본 원문 대조로 바로잡았다: week2-scene-011(레오, 무너지다)은 전시장
// 직원문 근처, week2-scene-012(K-01 회수)만 실제 카페이고, week2-scene-014
// (마틴 베일과의 통화)는 "카페 골목을 걸으며"(L.5051)로 명시돼 더 록스
// 골목이다. week2-scene-018(신원 조회)도 "전시장 밖"(L.6166)이라 전시장
// 내부가 아니라 전시장 입구 쪽으로 옮겼다.
const week2v4Locations = [
  {
    id: 'loc-accommodation', hubLocationId: null, name: '시드니 숙소 (Eastwood)',
    realVisualBrief: '1주차부터 써온 것과 같은 실제 숙소 — 거실/침실/주방/욕실 구도. 1주차 씬(week1-scene-002-1 등)에 이미 실사 사진이 등록되어 있다.',
    v4Note: 'Ch1(아침, 열쇠를 다시 들여다보는 장면)과 Ch22 엔딩(저녁, 하루를 되짚는 장면) 배경. 1주차와 물리적으로 완전히 같은 곳이라 새로 찍을 필요가 없다 — 장소 DB에서 1주차 숙소 catalog 위치를 그대로 배정한다.',
    storyContext: 'week2-scene-001(Ch1 Scene 1-1), 이른 아침 — 얇은 커튼을 뚫고 들어온 햇살이 방 안을 옅은 주황빛으로 물들이고, 창밖으로 트램 벨소리·갈매기 울음·먼 페리 경적이 섞여 들려온다(script L.34). 캐리어는 반쯤 열린 채 바닥에 놓여 있고, 지수가 개다 만 카디건 옆에서 황동 열쇠를 발견한다(L.34-39) — 영우가 열쇠를 받아 창문 빛에 비춰보거나 뒷면을 손톱으로 긁어보는 동작이 이어진다(L.78). week2-scene-023(Ch22 Scene 22-1), 늦은 저녁 — 지수와 영우가 짐을 정리하며 하루를 되짚는다(L.8093-8094)는 지문으로 시작해, 창밖으로 시드니의 밤이 저물어가는(L.8323) 어두운 톤으로 마무리된다. 즉 같은 방을 아침의 옅은 주황 역광과 저녁의 어두운 창밖 야경, 두 시간대로 모두 커버해야 한다.',
    requiredElements: [
      '얇은 커튼 너머로 아침 역광이 들어오는 창 (Ch1용)',
      '반쯤 열린 캐리어, 개다 만 카디건 등 짐 정리 흔적',
      '같은 구도로 창밖이 어두워진 밤 버전 (Ch22 엔딩용) — 기존 1주차 자산에 야간 버전이 없다면 이 부분만 추가 확인 필요',
    ],
    appearsIn: ['Ch1. 짧은 아침, 풀리지 않은 열쇠 (week2-scene-001)', 'Ch22. 엔딩 — M.K.라는 불안 (week2-scene-023)'],
    anchorSceneId: 'week2-scene-001',
    needsNewPhoto: false,
    reuseHint: '1주차 숙소 배경(week1-scene-002-1)과 동일 — 장소 DB에서 같은 catalog 위치로 배정하면 끝.',
  },
  {
    id: 'loc-paddys-market', hubLocationId: null, name: '패디스 마켓 (과일 산 · 수박 게임)',
    realVisualBrief: '시티 근처 차이나타운 인근의 실존 실내 과일 마켓. 알록달록한 과일 상자들이 통로와 입구까지 늘어선 활기찬 시장 풍경. 한쪽에 상인이 자리 잡은 작은 가판대/카운터가 있고, 태블릿을 세워둘 수 있는 공간이 보인다.',
    v4Note: '숙소(week2-scene-001)와 서큘러키(week2-scene-002) 사이에 새로 삽입된 막간극(week2-scene-001b) 배경 — 사건과 무관한 일상 비트로, 기존 독립형 수박 게임(dev/minigame-watermelon)의 진입점 역할만 한다. week2v4Locations.js에 지금까지 등록되어 있지 않던 장소라 이번에 신규 추가.',
    storyContext: 'week2-scene-001b — 숙소를 나선 지수와 영우가 서큘러키로 향하는 길에 시티 근처 차이나타운 인근 패디스 마켓 앞을 지난다. 알록달록한 과일 상자들이 입구까지 늘어서 있다(dialogueData.js week2Scene001bLines line-001). 마켓 상인이 태블릿으로 "같은 과일을 계속 합쳐서 수박까지 만들면 진짜 수박 한 통 드려요"라며 도전을 홍보하고(line-006), 지수가 "수박을 진짜 준다고요?"라며 놀라워한다(line-007). 지수가 태블릿 앞에 자리 잡는 순간 화면이 수박 게임(미니게임)으로 전환된다 — 사건과 무관한 순수 일상 막간극이라 밝고 활기찬 톤이어야 한다(docs/week2-storyline-outline-v4.md Scene 1-2).',
    requiredElements: [
      '알록달록한 과일 상자들이 통로/입구까지 늘어선 실존 시장 분위기',
      '상인이 서 있을 법한 가판대/카운터, 태블릿을 세워둘 수 있는 자리',
      '사건 관련 소품(증거·단서)은 전혀 없어야 함 — 순수 일상 배경',
      '밝고 활기찬 채광 (사건 전 여행 초반부 톤)',
    ],
    appearsIn: ['Ch1.5. 패디스 마켓, 과일 산과 수박 게임 (신규, week2-scene-001b)'],
    anchorSceneId: 'week2-scene-001b',
    needsNewPhoto: true,
  },
  {
    id: 'loc-circular-quay', hubLocationId: 'w2-circular-quay', name: '서큘러키 산책로',
    realVisualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
    v4Note: 'Ch2(다니엘과의 첫 만남, 사진 촬영)·Ch18(관광팀 증언 탐문)의 배경. 탐색허브 Phase 1(W2_TOURISM)에 이미 등록된 실제 장소(w2-circular-quay)와 같은 곳이라 재사용한다. [수정] 구 버전엔 Ch13(마틴과의 통화)도 여기 배정돼 있었으나, 대본 원문에 "카페 골목을 걸으며"(L.5051)로 명시돼 있어 loc-the-rocks-lane으로 옮겼다.',
    storyContext: 'week2-scene-002(Ch2 Scene 2-1), 화창한 오전 — 흰 돛을 겹겹이 세운 오페라하우스, 회색 강철 아치의 하버브리지, 물보라를 일으키며 오가는 페리, 낮게 날며 사람들 손의 크루아상을 노리는 갈매기들이 배경이다(script L.264). 지수·영우가 앵글을 못 잡아 몇 번이나 자리를 옮기다(다리가 잘리거나 역광으로 얼굴이 새까맣게 나오는 실패 컷까지 거친 뒤) 지나가던 다니엘이 자연스럽게 다가와 촬영을 제안한다(L.339-372). week2-scene-019(Ch18 Scene 18-1) — 같은 서큘러키로 돌아와 "단체사진에 있던 관광객들을 찾아 다시 말을 건다"(L.6494-6495), 오전과 같은 낮 시간대 그대로 재사용한다.',
    requiredElements: [
      '오페라하우스(흰 돛 형태 지붕)가 먼 배경에 보임',
      '하버브리지(회색 강철 아치)가 반대편 먼 배경에 보임',
      '페리 선착장과 정박한 페리 여러 척, 버스커가 공연할 만한 넓은 야외 데크',
      '갈매기 몇 마리(크루아상을 노리는 디테일, script L.264)',
    ],
    appearsIn: ['Ch2. 서큘러키, 우연한 가이드 (week2-scene-002)', 'Ch18. 관광팀의 증언 (week2-scene-019)'],
    anchorSceneId: 'week2-scene-002',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-circular-quay와 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-the-rocks-lane', hubLocationId: 'w2-the-rocks-lane', name: '더 록스 골목',
    realVisualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목. 골목 안쪽에 카페 간판이 늘어서 있다.',
    v4Note: 'Ch3(카페 임시 보관함의 존재를 알게 되는 장면)의 배경. 탐색허브의 실제 장소(w2-the-rocks-lane)와 같은 곳이라 재사용한다. [수정] Ch13(마틴 베일과의 통화)이 원래 loc-circular-quay에 잘못 배정돼 있었는데, 대본상 "카페 골목을 걸으며"(L.5051) 장면이라 이곳으로 옮겨왔다.',
    storyContext: 'week2-scene-003(Ch3 Scene 3-1) — 사암으로 지은 오래된 건물들과 좁고 구불구불한 골목길, 낡고 예쁘게 닳은 돌바닥이 이어지고, 카페 간판이 골목 안쪽까지 늘어서 있으며 갓 내린 커피 냄새가 은은히 퍼진다(script L.585). 카페 앞에서 캐리어를 든 관광객 NPC가 당황해 서 있고(L.613-614), 다니엘이 자연스럽게 다가가 카페 임시 보관함 시스템을 대신 안내한다(L.624-651) — 이때 다니엘이 보관함 번호판을 필요 이상으로 오래 들여다본다(L.690). 이 카페 내부(번호식 임시 보관함이 늘어선 벽면)는 이후 loc-cafe로 다시 쓰이는 같은 공간이므로, 이 골목 배경엔 카페 입구/간판 정도만 담기고 실내 캐비닛 클로즈업은 loc-cafe 쪽에 맡긴다. week2-scene-014(Ch13 Scene 13-1) — 지수가 "카페 골목을 걸으며" 마틴 베일에게 전화를 건다(L.5051) — 같은 골목 배경을 도보 중 통화 장면으로 재사용한다(휴대폰을 든 손·표정 클로즈업 위주라 배경 비중은 낮다).',
    requiredElements: [
      '사암(sandstone) 건물, 좁고 구불구불한 골목, 낡고 예쁘게 닳은 돌바닥',
      '골목 안쪽까지 늘어선 카페 간판들(그중 하나가 Ch3의 카페 입구 — 안쪽은 loc-cafe로 별도)',
      '기념품 가게·작은 갤러리 간판, 골목 끝으로 전시장 입구가 이어지는 인상',
    ],
    appearsIn: ['Ch3. 더 록스, 보관함을 익히다 (week2-scene-003)', 'Ch13. 마틴 베일과의 통화 (week2-scene-014)'],
    anchorSceneId: 'week2-scene-003',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-the-rocks-lane과 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-exhibition-entrance', hubLocationId: 'w2-exhibition-entrance', name: '빈티지 전시장 입구',
    realVisualBrief: '더 록스 골목 한쪽에 자리한 작은 팝업 전시장의 유리문 입구. "K-01: 잃어버린 시간들" 배너가 입구 위에 걸려 있고, 유리문 너머로 전시 공간 일부(접수대·진열장)가 살짝 비쳐 보인다.',
    v4Note: 'Ch4(다섯 사람과의 첫 만남 도입부)와 Ch6(단체사진을 찍는 위치)의 배경. 허브 장소(w2-exhibition-entrance)와 같은 곳이라 재사용한다. [수정] Ch17(신원 조회)이 원래 loc-exhibition-interior에 배정돼 있었는데, 대본에 "전시장 밖"(L.6166)으로 명시돼 있어 이곳으로 옮겨왔다.',
    storyContext: 'week2-scene-004(Ch4 Scene 4-1) — 전시장 입구에 들어서는 순간 서늘한 실내 공기가 훅 끼치고, 낮은 조명 아래 황동 공예품들이 유리 진열장 안에서 은은하게 빛나며, 접수대에 클레어가 앉아 태블릿을 들여다보고 있다(script L.850) — "입구에 들어서는 시점"이라 유리문과 안쪽 접수대가 한 프레임에 걸려야 한다. week2-scene-006(Ch6 Scene 6-1) — 오전 햇살이 문 앞까지 길게 드리우는 시간대, 다니엘이 관광객 몇 명을 모아 단체사진 위치를 한 명씩 반걸음씩 조정한다(L.2031-2069). week2-scene-018(Ch17 Scene 17-1) — "전시장 밖"에서 지수·영우가 다니엘이 준 여행사 명함으로 전화를 건다(L.6166-6167), 같은 입구 앞 배경을 낮 시간대 그대로 재사용한다.',
    requiredElements: [
      '유리문 입구, "K-01: 잃어버린 시간들" 배너',
      '문 안쪽으로 접수대와 진열장 일부가 살짝 비쳐 보임(Ch4 진입 샷용)',
      '오전 햇살이 문 앞까지 길게 드리우는 각도(Ch6 단체사진용)',
      '여러 명이 나란히 서도 자연스러운 폭(단체사진 구도)',
    ],
    appearsIn: ['Ch4. 사람들과의 첫 만남 (week2-scene-004)', 'Ch6. 단체사진, 평범한 배경 (week2-scene-006)', 'Ch17. 신원 조회 (week2-scene-018)'],
    anchorSceneId: 'week2-scene-004',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-exhibition-entrance와 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-exhibition-interior', hubLocationId: null, name: '전시장 내부 — K-01 진열 구역',
    realVisualBrief: '전시장 안, K-01이 놓인 유리 진열장이 중심에 있고 주변으로 다른 전시품 몇 점이 놓인 실내 전시 공간. 은은한 스포트라이트 조명, 진열장 뒤로 관람 동선을 위한 좁은 통로. 한쪽엔 접수대, 다른 한쪽엔 카페 코너와 보조 진열 구역, 안쪽엔 "관계자 외 출입 금지" 직원 전용문과 뒤편으로 이어지는 계단이 있다.',
    v4Note: '극 중 가장 많이 쓰이는 핵심 배경 — Ch5(작은 균열들)·Ch7(도난 발생)·Ch9(윤민아 1차 심문)·Ch10/Ch11 전반부(레오·애드리언 탐문)·Ch12(사건 재정의)·Ch14(애드리언의 메일함)·Ch15(레오 재심문)·Ch20(다니엘 최종 심문)에서 쓰인다. [수정] 구 버전엔 Ch10/Ch11 전체가 loc-cafe로, Ch17이 여기로 잘못 배정돼 있었다 — 대본 대조 결과 Ch10·Ch11 전반부(week2-scene-010/010b/011)는 실제로 전시장 직원문 근처이고, Ch11 후반부(week2-scene-012, K-01 회수)만 진짜 카페다. Ch17은 "전시장 밖"이라 loc-exhibition-entrance로 옮겼다.',
    storyContext: '이 공간에서 다음 순서로 사건이 진행된다. week2-scene-005(Ch5 Scene 5-1, 자유 관람): "정교한 황동 공예품이 조명 아래 놓여 있다. 표면의 세공이 빛을 받아 은은하게 일렁이고, 받침대 하단에는 작은 무늬가 촘촘하게 새겨져 있다"(L.1547). 이 자유 관람 구간엔 신규 조사하기(탭) 핫스팟 3곳도 걸려 있다 — K-01 위 조명(순수 분위기, 증거 없음), 문턱 아래에 포장용 테이프 조각이 떨어진 채 잠겨 있는 직원 전용문(E-EF1), 연필 눈금 자국이 남은 빈 보조 받침대(E-EF2) — 좌표가 dev/data/locationDefs.js:190-194에 "실제 사진이 없어 잠정 배치"로만 걸려 있어, 사진이 실제로 이 세 지점을 뚜렷이 보여줘야 좌표를 확정할 수 있다. week2-scene-007(Ch7 Scene 7-1): 카페에서 돌아오니 "진열대가 텅 비어 있다"·"받침대만 덩그러니 남아 있다"는 도난 직후 상태(같은 구도, 케이스가 빈 버전이 별도로 필요). week2-scene-009(Ch9 Scene 9-1): "전시장 한쪽, 윤민아가 불안한 표정으로 서 있다"(L.3084) — 윤민아 1차 심문. week2-scene-010/010b(Ch10): "전시장 직원문 앞, 애드리언이 근처에서 서성이고 있다"(L.3550-3551)로 시작해 레오의 크로스백 변화를 포착하는 장면까지 이어진다. week2-scene-011(Ch11 Scene 11-1): "직원문 근처, 지수와 영우가 레오를 다시 붙잡는다. 이번엔 물증을 들고 있다"(L.4015-4016) — 레오가 무너지는 심문. week2-scene-013(Ch12 Scene 12-1): 클레어가 K-01을 저울에 다시 올려 무게를 재고("등록 무게보다 확실히 가벼워요, 한 30그램 정도") 하단을 열어보는 정밀 조사. week2-scene-015(Ch14 Scene 14-1): "전시장, 애드리언이 여전히 K-01 근처를 서성이고 있다"(L.5349) — 재대면. week2-scene-016(Ch15 Scene 15-1): "레오가 전시장 뒤편 계단에 힘없이 앉아 있다"(L.5583) — 같은 공간의 뒤편 통로/계단이 보여야 한다. week2-scene-021(Ch20 Scene 20-1): "전시장. 다니엘이 짐을 정리하는 척 서 있다"(L.6946) — 다니엘 최종 심문.',
    requiredElements: [
      '중앙에 스포트라이트를 받는 K-01 진열대(유리 케이스)',
      '직원 전용문 — "관계자 외 출입 금지" 팻말, 닫힌 채 문턱 아래 작은 포장용 테이프 조각이 떨어져 있어야 함(조사하기 증거 E-EF1)',
      '빈 보조 진열용 받침대 — 옆면에 연필로 그은 눈금 자국이 보여야 함(조사하기 증거 E-EF2, 확대해야 겨우 보이는 수준)',
      '접수대(클레어 자리)와 카페 코너가 한쪽에 보이는 구도',
      '전시장 뒤편으로 이어지는 계단/통로(Ch15 레오 재심문용)',
      '도난 후 케이스가 완전히 빈 버전도 별도로 필요(Ch7) — 같은 앵글, 진열품만 사라진 상태',
    ],
    appearsIn: [
      'Ch5. 전시장 자유 관람 (week2-scene-005)', 'Ch7. K-01 도난 발생 (week2-scene-007)',
      'Ch9. 윤민아 1차 심문 (week2-scene-009)', 'Ch10. 레오를 향한 접근 (week2-scene-010/010b)',
      'Ch11(전반부). 레오, 무너지다 (week2-scene-011)', 'Ch12. 사건의 이름을 다시 붙이다 (week2-scene-013)',
      'Ch14. 애드리언의 메일함 (week2-scene-015)', 'Ch15. 레오 재심문 (week2-scene-016)',
      'Ch20. 다니엘 최종 심문 (week2-scene-021)',
    ],
    anchorSceneId: 'week2-scene-005',
    needsNewPhoto: true,
    reuseHint: '기존(v3) 2주차의 팝업 전시장 실내 씬(week2-scene-003~007)과 물리적으로 같은 공간일 가능성이 높다 — 장소 DB에서 그 catalog 위치가 이미 있는지 먼저 확인하고, 있다면 위 requiredElements(특히 직원문 테이프 조각·보조 받침대 눈금 자국)가 실제로 보이는지 재확인한 뒤 재사용, 없거나 안 보이면 아래 프롬프트로 새로 생성한다.',
  },
  {
    id: 'loc-cafe', hubLocationId: null, name: '서큘러키 근처 카페 (임시 보관함)',
    realVisualBrief: '전시장 근처의 아늑한 카페 내부. 좌석 몇 개와 바 안쪽에 손님 짐을 맡기는 임시 보관함(락커형 캐비닛)이 보이는 구도. 통유리 창 너머로 골목/거리가 살짝 보임.',
    v4Note: 'Ch11 후반부(K-01 회수)·Ch16(소피의 기억)·Ch19(일정표 재해석)·Ch21(최종 재구성)의 배경. 특히 임시 보관함 캐비닛이 화면에 뚜렷이 보여야 Ch3/Ch11의 단서가 이어진다. [수정] 구 버전엔 Ch10·Ch11 전체가 여기 배정돼 있었으나, 대본 대조 결과 Ch10과 Ch11 전반부(레오 심문)는 실제로 전시장 직원문 근처라 loc-exhibition-interior로 옮기고, 실제로 카페인 Ch11 후반부(K-01 회수, week2-scene-012)만 남겼다.',
    storyContext: 'Ch3(week2-scene-003)에서 처음 등장한 "번호식 임시 보관함이 줄지어 붙은" 카페 벽면(script L.651)과 물리적으로 동일한 공간이다. week2-scene-012(Ch11 Scene 11-2): "카페 골목의 임시 보관함, 레오가 알려준 번호로 열자 포장된 K-01이 그대로 들어 있다"(L.4500-4501) — 영우가 번호(0417)를 누르자 잠금장치가 철컥 열리는 순간. week2-scene-017(Ch16 Scene 16-1): "카페 카운터, 소피가 컵을 정리하고 있다"(L.5806-5807) — 바/카운터 구역이 화면에 잡혀야 한다. week2-scene-020(Ch19 Scene 19-1): "카페 골목, 지수와 영우가 지금까지 모은 기록들을 테이블에 펼쳐놓는다"(L.6699) — 앉아서 종이를 펼칠 수 있는 좌석 테이블이 필요. week2-scene-022(Ch21 Scene 21-1): 같은 테이블에서 "심문이 끝난 뒤... 사건 전체를 정리한다"(L.7806-7807)는 최종 재구성.',
    requiredElements: [
      '벽면에 번호식 임시 보관함(락커형 캐비닛)이 줄지어 있고, 그중 하나(번호 0417)가 열리는 장면에 쓸 수 있어야 함',
      '손님이 앉아 종이·기록을 펼칠 수 있는 좌석 테이블(Ch19/21 용)',
      '바/카운터 구역(소피가 서 있는 위치, Ch16 용)',
      '통유리 창 너머로 더 록스 골목이 살짝 보임',
    ],
    appearsIn: ['Ch11(후반부). K-01 회수 (week2-scene-012)', 'Ch16. 소피의 생활 기억 (week2-scene-017)', 'Ch19. 일정표와 단체사진 재해석 (week2-scene-020)', 'Ch21. 최종 사건 재구성 (week2-scene-022)'],
    anchorSceneId: 'week2-scene-012',
    needsNewPhoto: true,
    reuseHint: '기존(v3) "전시장 근처 카페" 씬(week2-scene-008 등)과 같은 공간일 수 있다 — 장소 DB에서 먼저 확인, 없으면 아래 프롬프트로 새로 생성한다.',
  },
];

function buildWeek2v4LocationPrompt(loc) {
  if (!loc.needsNewPhoto) {
    const lines = [
      `이 장소는 새 사진이 필요 없습니다.`,
      '',
      `기존에 이미 등록된 사진을 그대로 재사용하면 됩니다: ${loc.reuseHint || ''}`,
      `(방법: /dev/upload 의 "장소 DB" 탭에서 이 씬의 배경 슬롯을 같은 catalog 장소에 배정)`,
    ];
    if (loc.requiredElements && loc.requiredElements.length) {
      lines.push('');
      lines.push('다만 아래 요소가 기존 사진에 실제로 보이는지는 재확인하세요(안 보이면 재촬영이 필요할 수 있습니다):');
      loc.requiredElements.forEach(item => lines.push(`- ${item}`));
    }
    return lines.join('\n');
  }
  const lines = [];
  lines.push(`아래 장소의 배경 일러스트 생성을 위한 프롬프트야. "The Missing Key" 비주얼노벨의 기존 배경 아트 스타일(사실적인 사진풍, 스마트폰 스냅샷 느낌, 인물 없는 순수 배경)에 맞춰줘.`);
  lines.push('');
  lines.push(`# 장소: ${loc.name}`);
  lines.push(`- 기본 묘사: ${loc.realVisualBrief}`);
  lines.push(`- v4 재설계에서의 쓰임: ${loc.v4Note}`);
  lines.push(`- 등장 챕터: ${loc.appearsIn.join(', ')}`);
  if (loc.storyContext) {
    lines.push('');
    lines.push('# 이 장소가 등장하는 장면들 (대본 원문 기반 — 시간대·조명·분위기·인물 행동까지 톤과 구도를 맞추는 용도, 화면에 직접 드러날 필요는 없음)');
    lines.push(`- ${loc.storyContext}`);
  }
  if (loc.requiredElements && loc.requiredElements.length) {
    lines.push('');
    lines.push('# 필수 구성요소 (반드시 사진에 보여야 함 — 하나라도 빠지면 이후 상호작용이 깨질 수 있음)');
    loc.requiredElements.forEach(item => lines.push(`- ${item}`));
  }
  if (loc.reuseHint) {
    lines.push('');
    lines.push(`# 참고: ${loc.reuseHint}`);
  }
  lines.push('');
  lines.push('[비율] 4:5 (세로로 살짝 긴 구도)');
  lines.push('');
  lines.push('[준수 사항]');
  lines.push('- 인물은 그리지 않는다(배경 전용, 캐릭터는 별도 레이어로 겹쳐진다).');
  lines.push('- 가로형 구도, 모바일 비주얼노벨 배경으로 쓸 수 있게 상하 여백을 충분히 둔다.');
  lines.push('- 기존 등록된 다른 배경들과 톤(채도·조명 스타일)을 맞춘다.');
  lines.push('');
  lines.push('[피해야 할 것]');
  lines.push('- 텍스트, 워터마크, 로고, UI 요소');
  lines.push('- 만화/애니메이션풍 렌더링, 어안렌즈 왜곡, 과장된 채도');
  lines.push('- 이름 있는 등장인물의 얼굴이나 전신');
  lines.push('');
  lines.push('위 조건에 맞는 이미지를 10가지 버전으로 만들어줘.');
  return lines.join('\n');
}
