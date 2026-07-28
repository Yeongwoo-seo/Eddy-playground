/* MISSING KEY DEV — 상호작용 정의 (The Missing Key v1 §7.3/§7.4/§14.7).
   Static catalog read by explorationState.js + play/explore/index.html.
   First content slice: 2주차 Phase 1 관광 자유 탐색 (§12.2 "관광 자유 탐색
   상세"). Dialogue lines are authored inline here (not in dev/dialogueData.js)
   since this hub content doesn't correspond to any existing scripted scene —
   it's genuinely new material for the free-roam beat the spec describes,
   kept short (3-6 lines) so a location doesn't feel like a detour from the
   main investigation. Reuses the same { speaker, text, characterId,
   expression } line shape dev/vnPlayer.js already plays.

   unlockConditions use the small vocabulary explorationState.js's
   evaluateInteractionCondition understands (hasEvidence/hasFact/flags/
   flagEquals) — every interaction here has none (always available once its
   location is reached), since Phase 1 tourism has no investigation gating
   yet by design (§12.2 — sightseeing is free-form).

   "사전 복선" 패턴 (아래 w2ov-topic-crop 근처 주석 참고, 검토 답변서 반영판
   — 최초 버전은 "수상한 사람 4명"이었으나 실제 사건 타임라인과 안 맞는
   레드헤링이라 폐기됨) — 사건이 아직 일어나지 않은 자유 탐색 구간에서
   setFlag만으로 "봤다는 기억"만 남기는 재사용 가능한 관례. addQuestion은
   쓰지 않는다 — 넷 다 같은 무게의 CASE FILE 의문점으로 등록되면 플레이어가
   "이번 주차 안에 넷 다 풀리겠구나"라고 오해하게 된다. 대신 각 장소가 실제
   사건 구조(관계자 진술서 참고)의 서로 다른 한 조각을 조용히 미리 보여주고,
   회수는 나중에(있다면) 그 조각이 이미 의미를 가진 시점에 일어난다. 2주차
   전용이 아니라 이 파일/explorationState.js 구조 자체가 범용이므로, 다음
   주차에서 같은 성격의 구간을 쓸 때도 그대로 따라 쓰면 된다. */

const interactionDefs = {
  // Phase 진입 시 자동 재생되는 도입 대화 — type:'phaseIntro'는 탭으로 여는
  // topic/scene과 달리 그 phase에 처음 진입할 때 자동 재생되고 하단
  // 액션바 목록엔 노출되지 않는다 — completeInteraction으로 "이미 봤음"을
  // 기록해 두 번 다시 안 뜬다.
  //
  // [2주차 관광 자유 탐색 이식] 이 항목은 원래(v4 재설계 이전) week2-scene-002
  // 전체(서큘러키 도착·사진 포즈·팝업 전시 발견)를 허브 네이티브 콘텐츠로
  // 옮긴 것이었다. 그런데 이후 v4가 그 도착·사진·발견 비트를 다니엘과의
  // 첫 만남으로 다시 써서 week2-scene-002/003(선형, 다니엘 동행)으로
  // 확정했고, week2-scene-003의 nextSceneId가 이 허브로 들어온다(dev/
  // dialogueData.js 참고) — 즉 플레이어는 이미 서큘러키에서 사진을 찍고
  // 다니엘과 함께 전시장 입구까지 안내받은 뒤에 이 허브로 들어온다. 옛
  // 도입부(처음 보는 반응의 사진 포즈 루프, "저게 뭐지?" 팝업 전시 발견)를
  // 그대로 두면 방금 겪은 장면을 처음인 것처럼 되풀이하므로, 다니엘과
  // 헤어진 직후로 다시 썼다 — 대사만 교체, 그릇(phaseIntro 계약)은 그대로.
  // 관광 스팟과 전시장 내부가 지금은 같은 phase(W2_EXHIBIT_FREE_LOOK)라
  // 이 항목이 그 phase의 유일한 phaseIntro다 — 전시장 내부(w2-exhibit-floor)
  // 진입 시의 클레어 환영 인사는 phaseIntro가 아니라 장소 단위
  // autoPlayOnFirstVisit로 재생된다(아래 w2-exhibit-phase-intro 참고).
  'w2-phase1-intro': {
    id: 'w2-phase1-intro',
    type: 'phaseIntro',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    lines: [
      { id: 'line-001', speaker: '', text: '다니엘이 손을 흔들며 골목 저편으로 사라진 뒤,\n지수와 영우만 남았다.', characterId: null },
      { id: 'line-002', speaker: '지수', text: '전시장 들어가기 전에\n우리 조금만 더 둘러볼까요?', characterId: 'jisoo', expression: 'curious' },
      { id: 'line-003', speaker: '영우', text: '그럴까?\n아직 시간 넉넉하니까.', characterId: 'youngwoo', expression: 'soft' },
      { id: 'line-004', speaker: '지수', text: '서큘러키 쪽도 다시 가보고,\n다리 쪽도 가까이서 보고 싶어요.', characterId: 'jisoo', expression: 'happy' },
      { id: 'line-005', speaker: '영우', text: '좋아, 천천히 다 둘러보고\n마음 내킬 때 들어가자.', characterId: 'youngwoo', expression: 'soft' },
    ],
  },
  'w2cq-topic-ferries': {
    id: 'w2cq-topic-ferries',
    characterId: 'youngwoo',
    locationIds: ['w2-circular-quay'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '페리 구경하기',
    lines: [
      { speaker: '지수', text: '와 페리 진짜 많이 다니네.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '여기가 시드니에서 페리 제일 많이 타는 선착장이야.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '나중에 한 번 타보고 싶다.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '담에 시간 맞으면 타러 가자.', characterId: 'youngwoo', expression: 'soft' },
    ],
  },
  'w2cq-topic-buskers': {
    id: 'w2cq-topic-buskers',
    characterId: 'youngwoo',
    locationIds: ['w2-circular-quay'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '버스커 구경하기',
    lines: [
      { speaker: '', text: '산책로 한쪽에서 버스커가 기타를 치고 있다.', characterId: null },
      { speaker: '지수', text: '오 잘한다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '여기 주말마다 버스커들 꽤 많이 나와.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '분위기 좋다.', characterId: 'jisoo', expression: 'soft' },
    ],
  },
  'w2ov-topic-building': {
    id: 'w2ov-topic-building',
    characterId: 'youngwoo',
    locationIds: ['w2-opera-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '오페라하우스 감상하기',
    lines: [
      { speaker: '지수', text: '실제로 보니까 진짜 크다.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '조개껍데기 모양이라고 많이들 그러던데\n난 볼 때마다 돛 같아.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '오, 그러네.', characterId: 'jisoo', expression: 'curious' },
    ],
  },
  // §12.3 하버 포토 미니게임 — a 'minigame'-type interaction hands off to a
  // routed page instead of playing inline lines (see play/explore/index.html's
  // playInteraction). Points-bearing and reusable any number of times, but
  // only pays out once (EconomyState.claimReward inside the minigame itself).
  'w2ov-minigame-photo': {
    id: 'w2ov-minigame-photo',
    characterId: 'youngwoo',
    locationIds: ['w2-opera-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'minigame',
    label: '사진 찍기 (하버 포토)',
    icon: '📷',
    route: '/dev/minigame-harbour-photo/?bg=opera',
  },
  // ===== "사전 복선" 패턴 (2주차 장편 확장 v3, 검토 답변서 반영판) =====
  // 재사용 가능한 일반 패턴 — 특정 사건이 아직 일어나지 않은 자유 탐색
  // 단계(Phase)의 관광/탐색 장소마다 실제 사건 구조의 한 조각을 조용히
  // 미리 보여준다. addQuestion은 쓰지 않고 setFlag만 쓴다(§22 idiom) — "이건
  // 정답이다"라는 게임의 확언 없이, 그냥 지나가는 관광 디테일처럼 보이는 게
  // 핵심이다. 지수/영우 둘 다 결론을 내리지 않는다. 다음 주차들도 사건 발생
  // 전 자유 탐색 구간이 있다면 이 패턴(topic 상호작용 + setFlag 효과, id는
  // 'w2-'/'w3-'/'w4-' 등 해당 주차 프리픽스)을 그대로 따라 쓰면 된다 — 2주차
  // 전용 메커니즘이 아니라 이 파일/explorationState.js 어디에도 주차
  // 하드코딩이 없는 범용 구조다.
  //
  // 오페라하우스 — 사진 크롭 튜토리얼. 레오가 나중에 공개하는 "크롭된 참고
  // 이미지"(evidence-leo-reference-image, week2-scene-008)가 윤민아의 원본
  // 사진에서 맥락(주변 인물·간판)만 잘려나간 것이었다는 걸, 플레이어가 여기서
  // 미리 "크롭하면 원본의 맥락이 사라진다"는 걸 직접 해봐서 체감하게 한다.
  // 사건 단서로 표시하면 안 되므로 flag만 남기고 question/evidence는 없다.
  'w2ov-topic-crop': {
    id: 'w2ov-topic-crop',
    characterId: 'youngwoo',
    locationIds: ['w2-opera-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '사진 잘라보기',
    lines: [
      { speaker: '지수', text: '여보, 오른쪽 사람만 좀 잘라내줘요.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '이 정도?', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '오. 이렇게 자르니까 아예 다른 사진 같네.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '원본은 남겨두자.\n잘라놓으면 원래 옆에 뭐 있었는지 모르잖아.', characterId: 'youngwoo', expression: 'soft' },
    ],
    effects: [{ type: 'setFlag', key: 'completedW1CropTutorial', value: true }],
  },
  'w2bv-topic-bridge': {
    id: 'w2bv-topic-bridge',
    characterId: 'youngwoo',
    locationIds: ['w2-bridge-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '다리 구경하기',
    lines: [
      { speaker: '지수', text: '하버브리지 생각보다 훨씬 웅장하네.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '저 위 꼭대기까지 올라가는 투어도 있어.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '진짜요? 나 그거 완전 하고 싶다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '다음에 예약해서 같이 가자.', characterId: 'youngwoo', expression: 'soft' },
    ],
  },
  'w2bv-topic-memory': {
    id: 'w2bv-topic-memory',
    characterId: 'youngwoo',
    locationIds: ['w2-bridge-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '영우와 추억 이야기하기',
    lines: [
      { speaker: '영우', text: '나 예전에 여기 혼자 왔었거든.', characterId: 'youngwoo', expression: 'soft' },
      { speaker: '지수', text: '혼자요? 좀 외로웠겠다.', characterId: 'jisoo', expression: 'soft' },
      { speaker: '영우', text: '그때 생각했어.\n다음엔 꼭 같이 와야지.', characterId: 'youngwoo', expression: 'soft' },
      { speaker: '지수', text: '...\n지금 진짜 반칙이에요.', characterId: 'jisoo', expression: 'blank', pauseBeforeMs: 400 },
    ],
  },
  'w2bv-minigame-photo': {
    id: 'w2bv-minigame-photo',
    characterId: 'youngwoo',
    locationIds: ['w2-bridge-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'minigame',
    label: '사진 찍기 (하버 포토)',
    icon: '📷',
    route: '/dev/minigame-harbour-photo/?bg=bridge',
  },
  // 하버브리지 — 대기 중인 서비스 밴. 범죄 영화처럼 강조하지 않고, 그냥
  // 배경에 있는 밴으로 지나간다 — Phase 4의 w2sh-topic-van-recall(unlockCond:
  // 이 flag + evidence-service-magnet-missing)에서만 선택적으로 회수되는
  // "선택형 보강 증거"로 취급한다(필수 아님).
  'w2bv-topic-van': {
    id: 'w2bv-topic-van',
    characterId: 'youngwoo',
    locationIds: ['w2-bridge-view'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '서비스 밴 발견하기',
    lines: [
      { speaker: '지수', text: '저 차 아까부터 계속 있네.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '기사님 쉬는 중인가 보지.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '시동은 켜져 있는 것 같은데.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '그러네. 춥나 보다.', characterId: 'youngwoo', expression: 'neutral' },
    ],
    effects: [{ type: 'setFlag', key: 'discoveredBridgeVan', value: true }],
  },
  'w2rl-topic-vintage': {
    id: 'w2rl-topic-vintage',
    characterId: 'youngwoo',
    locationIds: ['w2-the-rocks-lane'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '골목 구경하기',
    lines: [
      { speaker: '지수', text: '와 여기 가게들 다 예쁘다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '더 록스가 원래 시드니에서 제일 오래된 동네 중 하나야.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '그래서 그런지 골목 느낌이 다르네.', characterId: 'jisoo', expression: 'curious' },
    ],
  },
  'w2rl-topic-exhibition-spot': {
    id: 'w2rl-topic-exhibition-spot',
    characterId: 'youngwoo',
    locationIds: ['w2-the-rocks-lane'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '팝업 전시장 쪽 다시 보기',
    lines: [
      { speaker: '지수', text: '저기가 다니엘씨가 말한 그 전시장이죠?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '맞아, 골목 끝.\n조금 더 둘러보다가 들어가자.', characterId: 'youngwoo', expression: 'soft' },
      { speaker: '지수', text: '좋아요, 기대된다.', characterId: 'jisoo', expression: 'happy' },
    ],
    effects: [{ type: 'setFlag', key: 'discoveredPopupExhibition', value: true }],
  },
  // 더 록스 골목 — 서비스 자석으로 열리는 직원 통용문을 목격. 새 용의자를
  // 만들지 않고, 정상적인 직원의 평범한 출입 장면으로 처리한다. 레오가 실제로
  // 쓴 개방 수단(서비스 자석, evidence-service-magnet-missing —
  // week2-scene-008/009a에서 이미 스크립트된 반전)을 사건 전에 미리 눈에
  // 익혀두는 역할 — 별도 회수 지점은 없다(그 반전 자체가 이미 존재하는
  // 스토리이므로 이 파일에서 추가로 연결할 게 없음).
  'w2rl-topic-magnet': {
    id: 'w2rl-topic-magnet',
    characterId: 'youngwoo',
    locationIds: ['w2-the-rocks-lane'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '직원 통용문 여는 모습 보기',
    lines: [
      { speaker: '', text: '옆 건물 직원이 얇고 납작한 회색 태그를 문 옆에 갖다 댔다.', characterId: null },
      { speaker: '', text: '짧은 전자음과 함께 서비스 문이 열렸다.', characterId: null },
      { speaker: '', text: '문 안쪽에는 B-1, B-2, B-3이라고 적힌 작은 보관함이 보였다.', characterId: null },
      { speaker: '지수', text: '저거 열쇠 아니고 자석인가?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '응. 서비스 문 잠금장치 같은데.', characterId: 'youngwoo', expression: 'neutral' },
    ],
    effects: [{ type: 'setFlag', key: 'noticedServiceMagnet', value: true }],
  },
  'w2ee-topic-outside': {
    id: 'w2ee-topic-outside',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibition-entrance'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '입구에서 둘러보기',
    lines: [
      { speaker: '', text: '작은 팝업 전시장 입구.\n"K-01: 잃어버린 시간들" 이라는 배너가 걸려 있다.', characterId: null },
      { speaker: '지수', text: 'K-01... 뭘까요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '들어가보면 알겠지.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  // 전시장 입구 — Maker's Mark 안내문. 특정 인물을 등장시키지 않고 전시장
  // 자체의 일반 교육용 패널로 처리한다. 마틴 베일 통화(week2-scene-011b)의
  // "의뢰인은 물건 전체보다 하단 각인을 원했다" 반전과, 이미 존재하는
  // evidence-k01-inscription-request(E-C03)/evidence-mk-inscription-focused
  // -inquiries(E-MV5)의 밑밥. 그 반전과 질문(q-w2-request-purpose)은 이미
  // week2-scene-011b에 스크립트돼 있으므로 여기서 새 question은 만들지
  // 않는다 — 순수하게 플레이어가 나중에 스스로 연결짓는 조용한 밑밥.
  'w2ee-topic-provenance': {
    id: 'w2ee-topic-provenance',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibition-entrance'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: "Maker's Mark 안내문 읽기",
    lines: [
      { speaker: '', text: '입구 옆, 작은 안내 패널이 붙어 있다.', characterId: null },
      { speaker: '', text: '[ MAKER\'S MARKS & PROVENANCE ]\n오래된 금속 공예품의 하단 각인은 제작자와 소유 이력을 확인하는 중요한 단서입니다.\n세척, 보수, 재각인으로 표시가 이전보다 선명해질 수 있으므로, 현재 사진만으로 진위를 판단하지 않고 과거 기록과 함께 비교합니다.', characterId: null },
      { speaker: '지수', text: '물건 밑바닥 사진도 따로 보는구나.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '누가 만들었는지 확인하려면 그런가 봐.', characterId: 'youngwoo', expression: 'neutral' },
    ],
    effects: [{ type: 'setFlag', key: 'sawMakersMarkPlacard', value: true }],
  },
  // w2-exhibition-entrance investigateHotspot 1개 (§신규) — 위 두 개
  // (w2ee-topic-outside/provenance)는 캐릭터 칩 기반 topic이라, 같은
  // 장소에 탭으로 찾는 조사하기 하나를 별도로 둔다. 증거 없는 순수
  // 분위기용 — 다섯 인물을 만나기 전(w2-exhibit-floor에 들어가기 전)이라
  // 특정 인물과 엮인 물증을 놓기엔 이르다.
  'w2en-hotspot-flyer': {
    id: 'w2en-hotspot-flyer',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibition-entrance'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '바닥에 떨어진 전단지 조각 보기',
    lines: [
      { speaker: '', text: '입구 바닥에 안내 전단지 한 귀퉁이가 찢어진 채 떨어져 있다.', characterId: null },
      { speaker: '지수', text: '이것도 그 전시 거네.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '영우', text: '누가 밟고 지나갔나보다.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },

  /* ===== w2-adrian-spot (전시장 보조 진열 구역) — W2_EXHIBIT_FREE_LOOK
     구간에서 다섯 인물을 만나기 전 자유 조사 10개 핫스팟 (§신규, 구
     minigame-exhibition-search/HOTSPOTS 이식). 미니게임 자체 UI(진행도
     카운터, "다시 봐도 똑같다" 재방문 토스트, 3개 이상 선택 관찰 시 보너스
     증거)는 폐기했다 — 조사하기 자체가 이미 완료 상태(state-exhausted)를
     마커로 보여주고, addEvidence가 id로 중복을 막아주므로 재방문 시 같은
     짧은 대사가 다시 보이는 정도는 문제 없다. k01만 원래 대사 그대로 여러
     줄(K01_DISCOVERY_LINES) 유지, 나머지 9개는 원래 미니게임의 단문
     관찰(line) 하나만 그대로 옮겼다 — 다른 페이즈의 대화하기 topic들처럼
     지수/영우 티키타카를 새로 지어 붙이지 않았다(원본에 없던 내용이라).
     characterId는 이 파일의 다른 관광 topic들과 같은 관례로 'youngwoo'를
     쓰지만, 다섯 인물을 아직 안 만난 시점엔 w2-adrian-spot의 `characters`가
     비어 있어(locationDefs.js) 대화하기 목록엔 뜨지 않고 오직 조사하기
     핫스팟으로만 열린다. */
  'w2as-topic-k01': {
    id: 'w2as-topic-k01',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '황동 장치 K-01 살펴보기',
    lines: [
      { speaker: '지수', text: '어?\n영우야, 이거 봐요.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '이 작은 황동 장치.\n재질이 그때 그 열쇠랑 되게 비슷하지 않아요?', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '영우', text: '어디...\n오, 진짜 비슷하네.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '', text: '[ 작은 황동 장치 · 카탈로그 번호 K-01 ]', characterId: null },
      { speaker: '지수', text: '이름표 봐요.\nK 다시 01.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '그냥 정리 번호 아니야?', characterId: 'youngwoo', expression: 'blank' },
      { speaker: '지수', text: '알아요.\n근데 그냥 넘어가긴 좀 아깝잖아요.', characterId: 'jisoo', expression: 'smirk' },
      { speaker: '', text: '지수가 폰을 꺼내 사진을 찍는다.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '이제 그거 취미야?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '기록이죠, 기록.', characterId: 'jisoo', expression: 'smirk' },
    ],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-k01-early-inscription-note', code: 'E-000', category: 'record', title: 'K-01 사전 관찰 메모',
        description: '진열장 유리 너머로 봤을 때, 후면에 작은 각인 같은 게 있는 듯했다. 이 각도에서는 정확히 확인되지 않는다.',
        discoveredLocationText: 'Pop-up Exhibition · 사전 조사',
      },
    }],
  },
  'w2as-topic-camera': {
    id: 'w2as-topic-camera',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '오래된 필름 카메라 살펴보기',
    lines: [{ speaker: '', text: '접이식 빈티지 카메라. 렌즈 캡이 없어 안쪽이 살짝 뿌옇다.', characterId: null }],
  },
  'w2as-topic-watch': {
    id: 'w2as-topic-watch',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '은제 회중시계 살펴보기',
    lines: [{ speaker: '', text: '은제 회중시계. 뒷면에 낯선 이니셜이 새겨져 있는데, 이 열쇠와는 다른 이니셜이다.', characterId: null }],
  },
  'w2as-topic-desk': {
    id: 'w2as-topic-desk',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '접수대 살펴보기',
    lines: [{ speaker: '', text: '접수대. 안내 책자와 방명록, 작은 태그 몇 개가 놓여 있다.', characterId: null }],
  },
  'w2as-topic-tag': {
    id: 'w2as-topic-tag',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '직원용 태그 살펴보기',
    lines: [{ speaker: '', text: '직원용 태그 — 접수대 오른쪽에 놓여 있다. 진열장을 정리할 때 쓰는 것 같다.', characterId: null }],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-staff-tag-position-before', code: 'E-H01', category: 'physical', title: '직원용 태그 위치 (사건 전)',
        description: '사건이 일어나기 전, 직원용 태그는 접수대 오른쪽에 놓여 있었다.',
      },
    }],
  },
  'w2as-topic-staffdoor': {
    id: 'w2as-topic-staffdoor',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '직원 전용문 살펴보기',
    lines: [{ speaker: '', text: '직원 전용문. "관계자 외 출입 금지"라고 적혀 있다. 살짝 닫혀 있다.', characterId: null }],
  },
  'w2as-topic-pamphlet': {
    id: 'w2as-topic-pamphlet',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '안내 팸플릿 살펴보기',
    lines: [{ speaker: '', text: '안내 팸플릿. K-01 항목 옆에 "판매 불가 · 전시 전용" 표시가 있다.', characterId: null }],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-k01-pamphlet-not-for-sale', code: 'E-H02', category: 'record', title: 'K-01 팸플릿 표기',
        description: '안내 팸플릿에는 K-01이 "판매 불가 · 전시 전용" 물품으로 표기되어 있다. 단순 되팔기 목적의 충동 절도라면 이상한 선택이다.',
      },
    }],
  },
  'w2as-topic-guestbook': {
    id: 'w2as-topic-guestbook',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '방문객 방명록 살펴보기',
    lines: [{ speaker: '', text: '오늘 자 방명록 어디에도 "레오"로 추정되는 이름이 없다.', characterId: null }],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-guestbook-no-leo', code: 'E-H03', category: 'record', title: '방명록 — 레오 이름 없음',
        description: '오늘 자 방명록 어디에도 "레오"로 추정되는 이름이 없다.',
      },
    }],
  },
  'w2as-topic-ceiling': {
    id: 'w2as-topic-ceiling',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '천장 보안카메라 살펴보기',
    lines: [{ speaker: '', text: '천장 보안카메라가 진열장 정면이 아니라 출입구 쪽을 향해 있다.', characterId: null }],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-cctv-angle', code: 'E-H04', category: 'photo', title: '보안카메라 각도',
        description: '천장 보안카메라가 K-01 진열장 정면이 아니라 출입구 쪽을 향해 있다. 진열장 근처는 사각지대에 가깝다.',
      },
    }],
  },
  'w2as-topic-entrance': {
    id: 'w2as-topic-entrance',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '출입구 주변 살펴보기',
    lines: [{ speaker: '', text: '사람들이 끊임없이 들고 난다. 바로 옆 골목엔 작은 카페가 보인다.', characterId: null }],
  },

  /* ===== Phase W2_EXHIBIT_FREE_LOOK — 전시장 자유 관람 (v4 Ch4~5, 탐색허브
     재도입) =====
     dev/data/locationDefs.js의 w2-exhibit-floor 주석 참고. 도난 사건 이전
     구간이라 Phase 1과 같은 톤(ungated, 순수 관계 형성/복선)으로 다섯 개
     topic + 진입 도입부 하나를 둔다. 대사는 dev/dialogueData.js의
     week2Scene004Lines/005Lines(더 이상 재생 경로에 없음)에서 옮겨 썼다 —
     내용은 그대로, 다섯 인물별 독립 대화로 쪼갰을 뿐이다. */
  /* ===== W2_EXHIBIT_FREE_LOOK 안, 전시장 내부(w2-exhibit-floor) — 전시장
     자유 관람 (v4 Ch4~5, 탐색허브 재도입) =====
     dev/data/locationDefs.js의 w2-exhibit-floor 주석 참고. 도난 사건 이전
     구간이라 관광 스팟들과 같은 톤(ungated, 순수 관계 형성/복선)으로 다섯 개
     topic + 진입 도입부 하나를 둔다. 대사는 docs/week2-v4-script.md의
     Scene 4-1/4-2/5-1/5-2(보이스 바이블 기준 확장판)에서 옮겨 썼다 —
     다섯 인물별 독립 대화로 쪼갰다.
     [2주차 관광 자유 탐색 이식] 관광 스팟(서큘러키 등)과 이 전시장이 이제
     같은 phase(W2_EXHIBIT_FREE_LOOK)를 쓰므로, phase 하나엔 자동 재생
     도입부(type:'phaseIntro')가 하나만 존재할 수 있다(findPhaseIntro가
     `.find()`로 첫 번째 것만 찾는다 — play/explore/index.html 참고). phase
     진입 자동 재생은 w2-phase1-intro(다니엘과 작별한 직후, 서큘러키)가
     맡고, 클레어의 환영 인사는 "이 phase에서 처음"이 아니라 "이 장소에
     처음 도착했을 때"만 재생돼야 하므로 autoPlayOnFirstVisit(장소 단위 자동
     재생, w1suspect-*-interview와 같은 관례)로 바꿨다 — 그릇만 바뀌었을 뿐
     내용은 그대로. */
  'w2-exhibit-phase-intro': {
    id: 'w2-exhibit-phase-intro',
    characterId: 'claire',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    autoPlayOnFirstVisit: true,
    lines: [
      { id: "line-001", speaker: '', text: "전시장 입구에 들어서자 서늘한 실내 공기가 훅 끼친다. 낮은 조명 아래 황동 공예품들이 유리 진열장 안에서 은은하게 빛나고, 벽에는 작가들의 소개 패널이 걸려 있다. 접수대에 클레어가 앉아 태블릿을 들여다보고 있다.", characterId: null },
      { id: "line-002", speaker: "클레어", text: "어서 오세요, 팝업 전시 K-Collection에 오신 걸 환영합니다\n입장은 무료고, 사진 촬영은 개인 소장용만 가능해요", characterId: "claire", expression: "neutral" ,
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-claire-alibi-statement', code: 'E-CL1', category: 'testimony', title: '클레어의 최초 진술 — 접수대 상주',
              description: '클레어 모건 — 자신은 근무 시간 내내 접수대에 있었고 자리를 비운 적이 없다는 진술.',
              discoveredLocationText: 'Pop-up Exhibition 접수대 · 클레어 최초 진술',
            },
          },
        ],
      },
      { id: "line-003", speaker: "지수", text: "아 네 감사합니다", characterId: "jisoo", expression: "neutral" },
      { id: "line-004", speaker: "클레어", text: "혹시 궁금하신 거 있으면 언제든 말씀해주세요\n안내 팸플릿은 저기 입구 쪽에 있고요", characterId: "claire", expression: "neutral" },
      { id: "line-005", speaker: "영우", text: "안쪽에 뭐가 제일 유명해요?", characterId: "youngwoo", expression: "neutral" },
      { id: "line-006", speaker: "클레어", text: "저희 메인 전시품은 K-01이에요\n이 지역 공예가가 만든 황동 작품인데\n안쪽 진열대에 있어요", characterId: "claire", expression: "neutral" },
      { id: "line-007", speaker: "클레어", text: "받침대까지 포함해서 이 전시에서 제일 정교한 작품이라\n다들 그 앞에서 사진 많이 찍으세요", characterId: "claire", expression: "neutral" },
      { id: "line-008", speaker: "지수", text: "오 그럼 저희도 꼭 봐야겠다", characterId: "jisoo", expression: "neutral" },
      { id: "line-009", speaker: "클레어", text: "네, 천천히 둘러보세요", characterId: "claire", expression: "neutral" },
    ],
  },
  'w2ef-topic-sophie': {
    id: 'w2ef-topic-sophie',
    characterId: 'sophie',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '소피와 얘기하기',
    lines: [
      { speaker: '', text: "전시장 안으로 들어서면 카페 코너에 소피가 있다. 원두를 갈던 손을 멈추고 반갑게 손을 흔든다.", characterId: null },
      { speaker: "소피", text: "어머 안녕하세요!\n커피 한 잔 하고 구경하실래요?", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "오 좋아요 ㅎㅎ", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "저는 아메리카노로 부탁드려요", characterId: "youngwoo", expression: "neutral" },
      { speaker: "지수", text: "저는... 음 라떼 주세요", characterId: "jisoo", expression: "neutral" },
      { speaker: "소피", text: "오케이, 잠시만요", characterId: "sophie", expression: "neutral" },
      { speaker: '', text: "소피가 커피를 내리며 계속 말을 건다.", characterId: null },
      { speaker: "소피", text: "여기 요즘 동네에 이 전시 때문에 사람들 좀 왔다갔다해요\n저 골목 카페들도 다 요즘 붐빈다니까", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "아 그렇구나", characterId: "youngwoo", expression: "neutral" },
      { speaker: "소피", text: "전시 기간이 짧아서 그런가\n다들 놓치기 아깝다고 오시더라고요\n근데 두 분은 여행 오신 거예요?", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "네, 어제 도착해서 시드니는 처음이에요", characterId: "youngwoo", expression: "neutral" },
      { speaker: "소피", text: "그럼 이 동네 진짜 잘 오신 거예요\n관광지 느낌도 있으면서 동네 느낌도 있고\n저는 여기서 몇 년째 일하는데 아직도 안 질려요", characterId: "sophie", expression: "neutral" },
      { speaker: "소피", text: "이 동네 사람들이 다 이 전시 도와줬어요\n저 안쪽 접수대 클레어씨도 거의 매일 나와서 고생하고\n짐 나르는 친구도 하나 있는데 되게 부지런해요", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "좋다\n이런 얘기 들으니까 더 자세히 보고 싶어지네요", characterId: "jisoo", expression: "happy" },
      { speaker: '', text: "소피가 커피 두 잔을 건넨다.", characterId: null },
      { speaker: "소피", text: "자, 여기요\n천천히 구경하고 가세요~\n궁금한 거 있으면 아무 때나 물어보시고", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "감사합니다!!", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "잘 마실게요", characterId: "youngwoo", expression: "happy" },
      { speaker: '', text: "윤민아와 애드리언, 레오와의 짧은 인사를 마친 지수와 영우가 다시 카페 카운터로 돌아온다. 소피가 원두 봉투를 정리하다가 반갑게 손짓한다.", characterId: null },
      { speaker: "소피", text: "어, 아직 안 가셨네요?", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "네 ㅎㅎ 커피가 너무 맛있어서\n좀 더 있다 가려고요", characterId: "jisoo", expression: "happy" },
      { speaker: "소피", text: "그래요, 천천히 계세요\n저도 지금 잠깐 한가해서", characterId: "sophie", expression: "neutral" },
      { speaker: '', text: "소피가 카운터에 팔을 괴고 편하게 이야기를 이어간다.", characterId: null },
      { speaker: "소피", text: "근데 오늘 아침부터 좀 정신없었어요\n사람들이 왔다 갔다 왔다 갔다", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "전시 첫날이라 그런가요?", characterId: "youngwoo", expression: "neutral" },
      { speaker: "소피", text: "그것도 있고\n오늘따라 다니엘씨도 카페 쪽을 몇 번 왔다 갔다 하시더라고요", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "아 다니엘씨요?", characterId: "jisoo", expression: "curious" },
      { speaker: "소피", text: "네, 커피 주문은 안 하고\n그냥 왔다 갔다만 하시길래\n\"오늘 바쁘신가보다\" 했죠 ㅎㅎ", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "저희도 아까 서큘러키에서 만났어요\n사진도 찍어주시고 여기도 소개해주셨어요", characterId: "youngwoo", expression: "neutral" },
      { speaker: "소피", text: "어머 그랬구나\n그럴 만해요, 이 동네에서 워낙 여기저기 얼굴 비추시는 분이라", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "완전 동네 마당발이시네요 ㅎㅎㅎㅎㅎㅎ", characterId: "jisoo", expression: "happy" },
      { speaker: "소피", text: "그니까요\n저보다 이 골목 더 잘 아시는 것 같다니까요", characterId: "sophie", expression: "happy" },
      { speaker: '', text: "소피가 웃으며 원두 봉투를 정리하는 손을 다시 움직인다.", characterId: null },
      { speaker: "소피", text: "아무튼 두 분은 오늘 여기 처음이시죠?", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "네, 어제 도착해서 오늘 처음 나와봤어요", characterId: "youngwoo", expression: "neutral" },
      { speaker: "소피", text: "그럼 이 동네 다 낯설겠다\n저는 여기서 몇 년째라 이제 골목 하나하나 다 눈감고도 다녀요", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "와 부럽다\n저는 방향치라 맨날 헤매는데", characterId: "jisoo", expression: "happy" },
      { speaker: "소피", text: "저도 처음엔 그랬어요\n근데 매일 같은 길 오가다 보면\n어느 순간 그냥 몸이 기억하더라고요", characterId: "sophie", expression: "happy" },
      { speaker: "영우", text: "지수도 몇 년 지나면 시드니 길 잘 알겠다\n오늘부터 시작이니까", characterId: "youngwoo", expression: "smirk" },
      { speaker: "지수", text: "오늘부터 며칠 안 남았는데?????\n우리 다음 주에 한국 가야 되잖아", characterId: "jisoo", expression: "smirk" },
      { speaker: "영우", text: "ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그러네", characterId: "youngwoo", expression: "happy" },
      { speaker: "소피", text: "에이, 짧게 있어도 좋은 기억 많이 남기고 가면 되죠\n저도 여행 왔다가 눌러앉은 케이스라 ㅎㅎ", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "헐 진짜요?", characterId: "jisoo", expression: "shocked" },
      { speaker: "소피", text: "네, 원래 여행 온 김에 잠깐 일하려고 했는데\n어쩌다 보니 몇 년째 여기 있네요", characterId: "sophie", expression: "neutral" },
      { speaker: "영우", text: "오 인생이 그렇게도 흘러가는구나", characterId: "youngwoo", expression: "happy" },
      { speaker: '', text: "그때 클레어가 접수대 쪽에서 소피를 부른다.", characterId: null },
      { speaker: "클레어", text: "소피씨, 잠깐만요!", characterId: "claire", expression: "neutral" },
      { speaker: "소피", text: "네 갈게요!", characterId: "sophie", expression: "neutral" },
      { speaker: "소피", text: "저 잠깐 가볼게요\n편하게 구경하고 계세요~", characterId: "sophie", expression: "neutral" },
      { speaker: "지수", text: "네!! 감사합니다", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "말씀 즐거웠어요", characterId: "youngwoo", expression: "happy" },
      { speaker: '', text: "소피가 접수대 쪽으로 종종걸음으로 향한다. 지수와 영우는 남은 커피를 마저 마신다.", characterId: null },
      { speaker: "지수", text: "좋은 분이다 진짜\n말 걸면 다 받아주시고", characterId: "jisoo", expression: "neutral" },
      { speaker: "영우", text: "그러게\n근데 다니엘씨 오늘 여기저기 진짜 많이 다니시나봐", characterId: "youngwoo", expression: "neutral" },
      { speaker: "지수", text: "바쁜 가이드님인가보지 뭐\n아무튼 우리도 슬슬 안쪽 구경하러 가자", characterId: "jisoo", expression: "neutral" },
      { speaker: "영우", text: "그래\nK-01부터 다시 보러 가자", characterId: "youngwoo", expression: "neutral" },
      { speaker: '', text: "전시장을 자유롭게 둘러볼 수 있는 상태가 된다.", characterId: null ,
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-sophie-neighborhood-chat', code: 'E-SF1', category: 'testimony', title: '소피의 동네 잡담(다니엘 목격 최초 언급)',
              description: '소피 첸 — 오늘 아침 다니엘이 커피 주문 없이 카페 쪽을 몇 번이나 왔다 갔다 했다는 무심한 잡담. 지금은 그냥 바쁜 사람의 동선처럼 들린다.',
              discoveredLocationText: 'Pop-up Exhibition 카페 코너 · 소피 잡담',
            },
          },
        ],
      },
    ],
  },
  'w2ef-topic-minah': {
    id: 'w2ef-topic-minah',
    characterId: 'minah',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '윤민아에게 다가가기',
    lines: [
      { speaker: '', text: "전시장 중앙, 윤민아가 휴대폰으로 무언가를 급히 촬영하고 있다. 몸을 낮추고 각도를 요리조리 바꿔가며 화면을 들여다본다.", characterId: null },
      { speaker: "영우", text: "어\n저분 뭔가 되게 열심히 찍으시네", characterId: "youngwoo", expression: "curious" },
      { speaker: "지수", text: "그러게\n근데 좀 조심스러워 보이는데", characterId: "jisoo", expression: "curious" },
      { speaker: '', text: "윤민아가 두 사람을 발견하고 재빨리 폰을 내린다.", characterId: null },
      { speaker: "윤민아", text: "아, 안녕하세요\n그냥 콘텐츠용으로 좀", characterId: "minah", expression: "suspicious" },
      { speaker: "지수", text: "아 네 ㅎㅎ 편하게 하세요", characterId: "jisoo", expression: "neutral" },
      { speaker: "윤민아", text: "...네", characterId: "minah", expression: "suspicious" },
      { speaker: "영우", text: "여기 콘텐츠 만드시는 거예요?", characterId: "youngwoo", expression: "neutral" },
      { speaker: "윤민아", text: "아 뭐... 그냥 개인 채널이요\n크게 뭐 하는 건 아니고", characterId: "minah", expression: "suspicious" },
      { speaker: "영우", text: "채널 컨셉이 뭐예요?", characterId: "youngwoo", expression: "neutral" },
      { speaker: "윤민아", text: "그냥... 여행지 소품이나 작품 클립 같은 거 짧게 올려요\n이번 컷도 그냥 배경으로 몇 개 찍으려던 거고", characterId: "minah", expression: "suspicious" },
      { speaker: "영우", text: "오 멋지시다", characterId: "youngwoo", expression: "neutral" },
      { speaker: "윤민아", text: "아니에요 뭐", characterId: "minah", expression: "suspicious" },
      { speaker: '', text: "윤민아가 폰을 주머니에 넣으며 살짝 몸을 돌린다. 시선이 자꾸 두 사람과 K-01 진열대를 번갈아 오간다.", characterId: null },
      { speaker: "지수", text: "저희는 그냥 구경하는 거니까\n신경 쓰지 마세요 ㅎㅎ", characterId: "jisoo", expression: "neutral" },
      {
        speaker: "윤민아", text: "네... 감사합니다", characterId: "minah", expression: "suspicious",
        effects: [{
          type: 'addQuestion',
          question: { id: 'question-minah-hiding-something', title: '윤민아가 뭔가 급히 숨기는 것 같다', description: '윤민아가 두 사람을 보자마자 재빨리 폰을 내렸다. 무언가를 촬영하다 들킨 듯한 반응이다.' },
        }],
      },
      { speaker: '', text: "지수가 카메라를 들어 K-01을 몇 장 찍는다. 근처에서 윤민아가 몸을 낮춰 K-01 하단을 확대 촬영하고 있다.", characterId: null },
      { speaker: "영우", text: "(작게) 저분 또 저러시네", characterId: "youngwoo", expression: "curious" },
      { speaker: "지수", text: "(작게) 아까 그분이지\n근데 되게 각도를 세밀하게 잡으시는데", characterId: "jisoo", expression: "curious" },
      { speaker: '', text: "클레어가 빠른 걸음으로 다가온다.", characterId: null },
      { speaker: "클레어", text: "저기요, 손님", characterId: "claire", expression: "serious" },
      { speaker: "윤민아", text: "네?", characterId: "minah", expression: "shocked" },
      { speaker: "클레어", text: "상업적 촬영은 별도 허가가 필요해요\n지금 찍으신 거 확인 좀 할게요", characterId: "claire", expression: "serious" },
      { speaker: "윤민아", text: "아 이거 그냥...\n개인 채널이라", characterId: "minah", expression: "shocked" },
      { speaker: "클레어", text: "개인 채널이어도 협찬이나 홍보 목적이면 상업 촬영으로 분류돼요\n계정 좀 보여주실 수 있을까요", characterId: "claire", expression: "neutral" },
      { speaker: "윤민아", text: "아... 그게", characterId: "minah", expression: "shocked" },
      { speaker: '', text: "윤민아가 서둘러 사진 몇 장을 지운다. 손가락이 화면 위에서 미세하게 떨린다.", characterId: null },
      { speaker: "윤민아", text: "죄송해요\n그냥 개인 소장용으로 몇 장만...\n업로드 안 할게요", characterId: "minah", expression: "annoyed" },
      { speaker: "클레어", text: "다음부턴 주의해주세요\n저희도 작가님 작품 저작권 때문에 민감해서요", characterId: "claire", expression: "neutral" },
      { speaker: "윤민아", text: "네... 죄송합니다", characterId: "minah", expression: "shocked" },
      { speaker: '', text: "클레어가 다시 접수대 쪽으로 걸어간다.", characterId: null ,
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-mina-photo-confiscated', code: 'E-V01', category: 'photo', title: '윤민아의 확대 사진',
              description: 'K-01 하단을 몰래 확대 촬영한 사진. 클레어에게 걸려 대부분 급히 지워졌다.',
              discoveredLocationText: 'Pop-up Exhibition · K-01 진열대',
            },
          },
        ],
      },
      { speaker: "지수", text: "(작게) 영우\n저 사람 왜 저렇게 급하게 지웠지", characterId: "jisoo", expression: "curious" },
      { speaker: "영우", text: "그러게\n좀 이상하긴 하다\n그냥 몇 장 지우면 되는 걸 완전 허둥지둥하시네", characterId: "youngwoo", expression: "curious" },
      { speaker: "지수", text: "근데 그렇다고\n그게 무슨 큰 잘못을 한 건 아닐 수도 있자나", characterId: "jisoo", expression: "curious" },
      { speaker: "영우", text: "그치\n그냥 규정 몰랐을 수도 있고", characterId: "youngwoo", expression: "neutral" },
    ],
  },
  'w2ef-topic-adrian': {
    id: 'w2ef-topic-adrian',
    characterId: 'adrian',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '애드리언에게 다가가기',
    lines: [
      { speaker: '', text: "K-01 진열대 근처를 애드리언이 서성이고 있다. 진열장 유리에 얼굴을 가까이 대고 각도를 바꿔가며 들여다보는 중이다.", characterId: null },
      { speaker: "애드리언", text: "좋은 작품이죠, 이거\n황동 세공이 정말 섬세해요", characterId: "adrian", expression: "neutral" },
      { speaker: "지수", text: "아 안녕하세요", characterId: "jisoo", expression: "neutral" },
      { speaker: "영우", text: "이거 사실 수도 있어요?", characterId: "youngwoo", expression: "neutral" },
      { speaker: "애드리언", text: "음... 그런 쪽은 제가 직접 다루는 건 아니고요\n그냥 보는 걸 좋아해서", characterId: "adrian", expression: "annoyed" },
      { speaker: "지수", text: "그럼 이런 전시 자주 보러 다니세요?", characterId: "jisoo", expression: "curious" },
      { speaker: "애드리언", text: "음... 자주라면 자주죠\n근데 그건 왜 궁금하세요?", characterId: "adrian", expression: "annoyed" },
      { speaker: "지수", text: "아 그냥 여쭤본건데 ㅎㅎ", characterId: "jisoo", expression: "shocked" },
      { speaker: "애드리언", text: "아 죄송해요, 습관이라\n저도 모르게 질문을 질문으로 받네요\n이런 작품들, 소장하는 분들 입장에서는\n그냥 예쁘다는 것보다 더 중요하게 보는 게 있거든요", characterId: "adrian", expression: "annoyed" },
      { speaker: "지수", text: "어떤 거요?", characterId: "jisoo", expression: "curious" },
      { speaker: "애드리언", text: "음... 글쎄요\n그건 보는 사람마다 다르지 않을까요", characterId: "adrian", expression: "annoyed" },
      { speaker: '', text: "애드리언이 웃으며 말끝을 흐린다. 지수와 영우가 서로 눈을 마주친다.", characterId: null },
      { speaker: "지수", text: "(작게) 뭔가 대답을 안 하시는 느낌인데", characterId: "jisoo", expression: "curious" },
      {
        speaker: "영우", text: "(작게) 그러게\n질문을 질문으로 받으시네", characterId: "youngwoo", expression: "curious",
        effects: [{
          type: 'addQuestion',
          question: { id: 'question-adrian-avoids-price', title: '애드리언이 가격 얘기를 피한다', description: '애드리언은 공예품 얘기를 하면서도 가격이나 판매 쪽 얘기는 한 번도 꺼내지 않았다.' },
        }],
      },
      { speaker: '', text: "윤민아가 자리를 옮겨 전시장 반대편으로 이동한다. 폰을 계속 만지작거리며 걷는다.", characterId: null },
      { speaker: '', text: "애드리언이 클레어에게 다가간다.", characterId: null },
      { speaker: "애드리언", text: "클레어씨, 하나만 여쭤볼게요\n이 받침 내부 깊이가 어느 정도 되나요?", characterId: "adrian", expression: "neutral" },
      { speaker: "클레어", text: "네...? 그건 왜...", characterId: "claire", expression: "shocked" },
      { speaker: "애드리언", text: "아, 그냥 구조가 궁금해서요\n공예적으로\n혹시 내부가 분리되는 구조인가요?", characterId: "adrian", expression: "annoyed" },
      { speaker: "클레어", text: "그것도... 저는 전시 관리만 해서요\n왜 그게 궁금하세요?", characterId: "claire", expression: "shocked" },
      { speaker: "애드리언", text: "아뇨 그냥\n공예 작품들 볼 때 습관적으로 궁금해지는 부분이라서요", characterId: "adrian", expression: "annoyed" },
      { speaker: '', text: "어색한 침묵.", characterId: null ,
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-adrian-structure-question', code: 'E-B00', category: 'testimony', title: '애드리언의 이상한 질문 — 가격 대신 구조',
              description: '애드리언 콜 — K-01 앞에서 가격은 한 번도 묻지 않고, 받침 내부 깊이와 분리 가능한 구조인지만 클레어에게 캐물었다. 공예 애호가치고는 이상한 관심사.',
              discoveredLocationText: 'Pop-up Exhibition · 애드리언과 클레어의 대화',
            },
          },
        ],
      },
      { speaker: "영우", text: "(작게) 저 질문 좀 특이하다\n보통 사람들은 가격부터 물어보지 않나", characterId: "youngwoo", expression: "curious" },
      { speaker: "지수", text: "(작게) 그러게\n가격이 아니라 안쪽 구조를 궁금해하시네", characterId: "jisoo", expression: "curious" },
      { speaker: "영우", text: "뭐 그럴 수도 있지\n공예 좋아하시는 분들은 만듦새를 더 궁금해하기도 하니까", characterId: "youngwoo", expression: "neutral" },
      { speaker: "지수", text: "그런가\n근데 뭔가 좀... 아니다\n그냥 넘어가자", characterId: "jisoo", expression: "curious" },
      { speaker: '', text: "다니엘이 나가고 얼마 지나지 않아, 애드리언이 조금 머쓱한 얼굴로 다시 지수와 영우 쪽으로 다가온다.", characterId: null },
      { speaker: "애드리언", text: "아까는 제가 좀 이상하게 굴었죠\n질문에 자꾸 질문으로 답해서", characterId: "adrian", expression: "neutral" },
      { speaker: "지수", text: "아 아니에요 ㅎㅎ\n그냥 그런 스타일이신가보다 했어요", characterId: "jisoo", expression: "neutral" },
      { speaker: "애드리언", text: "사실 제가 이 동네 공예품 보는 걸 좋아해서\n아는 척을 좀 많이 하는 편이에요", characterId: "adrian", expression: "annoyed" },
      { speaker: "영우", text: "원래 이런 거 수집하시는 거예요?", characterId: "youngwoo", expression: "curious" },
      { speaker: "애드리언", text: "수집이라고 하기엔 거창하고\n그냥... 어릴 때부터 저희 집에 오래된 물건들이 좀 있었거든요\n할머니가 이것저것 모으시던 분이라", characterId: "adrian", expression: "neutral" },
      { speaker: "지수", text: "오 그런 집안이시구나", characterId: "jisoo", expression: "curious" },
      { speaker: "애드리언", text: "네, 그래서 그런지 저도 자연스럽게\n물건 하나하나에 사연이 있다고 믿는 편이에요\n누가 만들었고, 어디를 거쳐왔고", characterId: "adrian", expression: "neutral" },
      { speaker: "영우", text: "그럼 이런 전시 보실 때 그냥 눈으로만 안 보시겠네요", characterId: "youngwoo", expression: "happy" },
      { speaker: "애드리언", text: "네, 좀 유난스럽죠\n가격보다 그 물건이 어떻게 여기까지 왔는지가 더 궁금해요", characterId: "adrian", expression: "neutral" },
      { speaker: "지수", text: "아뇨 멋있는데요?\n저는 그런 거 하나도 모르고 그냥 예쁘다고만 봤거든요", characterId: "jisoo", expression: "happy" },
      { speaker: "애드리언", text: "그것도 충분히 좋은 방식이에요\n저는 그냥... 습관이 좀 유난할 뿐이고요", characterId: "adrian", expression: "happy" },
      { speaker: '', text: "애드리언이 K-01 쪽을 흘긋 바라본다. 표정이 살짝 진지해진다.", characterId: null },
      { speaker: "지수", text: "그럼 이 작품은요?\n이것도 사연이 궁금하세요?", characterId: "jisoo", expression: "curious" },
      { speaker: "애드리언", text: "음... 그건 좀\n아직은 뭐라 말씀드리기가", characterId: "adrian", expression: "annoyed" },
      { speaker: "영우", text: "이 작품, 어디서 왔는지 아세요?", characterId: "youngwoo", expression: "curious" },
      { speaker: '', text: "애드리언이 잠깐 침묵하다가 다시 예의 바른 미소로 돌아온다.", characterId: null },
      { speaker: "애드리언", text: "글쎄요, 그건 저도 궁금한 부분이라서요", characterId: "adrian", expression: "neutral" },
      { speaker: "애드리언", text: "아무튼 제가 괜히 아까 이상하게 굴어서\n불편하셨다면 죄송해요", characterId: "adrian", expression: "neutral" },
      { speaker: "지수", text: "아니에요 전혀요 ㅎㅎ\n오히려 얘기 들으니까 더 재밌었어요", characterId: "jisoo", expression: "neutral" },
      { speaker: "애드리언", text: "다행이네요\n그럼 편하게 구경하세요, 저는 좀 더 둘러볼게요", characterId: "adrian", expression: "neutral" },
      { speaker: '', text: "애드리언이 K-01 반대편으로 자리를 옮긴다. 지수와 영우가 마주 본다.", characterId: null },
      { speaker: "영우", text: "(작게) 근데 방금도 결국 대답은 안 했어", characterId: "youngwoo", expression: "curious" },
      { speaker: "지수", text: "(작게) 그러게\n근데 나쁜 사람 같지는 않아\n그냥 뭔가... 조심스러운 느낌?", characterId: "jisoo", expression: "curious" },
      {
        speaker: "영우", text: "그럴 수도 있지\n아무튼 계속 지켜보자", characterId: "youngwoo", expression: "neutral",
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-adrian-collector-story', code: 'E-AD1', category: 'testimony', title: '애드리언의 수집 취미 이야기',
              description: '애드리언 콜 — 집안 대대로 오래된 물건을 모아온 내력, 가격보다 물건의 사연을 좇는 습관. 그러나 K-01의 출처를 묻자 다시 말을 아꼈다.',
              discoveredLocationText: 'Pop-up Exhibition · 애드리언과의 대화',
            },
          },
        ],
      },
    ],
  },
  'w2ef-topic-leo': {
    id: 'w2ef-topic-leo',
    characterId: 'leo',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '레오와 마주치기',
    lines: [
      { speaker: '', text: "전시장 뒤쪽에서 짐을 나르던 레오가 상자를 든 채 빠르게 걸어오다 지수와 부딪힐 뻔한다.", characterId: null },
      { speaker: "레오", text: "아 죄송해요!!", characterId: "leo", expression: "shocked" },
      { speaker: "지수", text: "아니에요 제가 잘 안 보고", characterId: "jisoo", expression: "shocked" },
      { speaker: "레오", text: "아니 진짜 제가 급하게 오느라\n다치신 데는 없으시죠?", characterId: "leo", expression: "shocked" },
      { speaker: "지수", text: "네 전혀요 ㅎㅎ 괜찮아요", characterId: "jisoo", expression: "neutral" },
      { speaker: '', text: "그 순간 지수의 가방 고리에서 M.K. 열쇠가 떨어진다. 바닥에 부딪히며 짧게 쇳소리를 낸다.", characterId: null },
      { speaker: "레오", text: "어 이거", characterId: "leo", expression: "neutral" },
      { speaker: '', text: "레오가 상자를 옆에 내려놓고 열쇠를 주워 지수에게 건넨다.", characterId: null },
      { speaker: "레오", text: "떨어뜨리신 거 같은데\n...어, M.K.네요?", characterId: "leo", expression: "neutral" },
      { speaker: "지수", text: "어? 아세요?", characterId: "jisoo", expression: "shocked" },
      { speaker: "레오", text: "아 아니\n그냥 이니셜이 특이해서요 ㅎㅎ\n흔한 조합은 아니잖아요", characterId: "leo", expression: "annoyed" },
      { speaker: "영우", text: "그러네요\n저희도 어제 우연히 주운 건데 뭔지 모르겠어요", characterId: "youngwoo", expression: "curious" },
      { speaker: "레오", text: "오 그래요?\n뭔가 사연 있어 보이는데", characterId: "leo", expression: "neutral" },
      { speaker: "지수", text: "아 감사합니다!!!!\n큰일 날 뻔했어요", characterId: "jisoo", expression: "happy" },
      { speaker: "레오", text: "별말씀을요\n가방 고리가 좀 헐거우신가봐요\n제가 꽉 잠가드릴게요", characterId: "leo", expression: "neutral" },
      { speaker: '', text: "레오가 열쇠고리를 몇 번 눌러 조인다.", characterId: null },
      { speaker: "레오", text: "자 이제 좀 나을 거예요\n그래도 자주 확인은 해주세요", characterId: "leo", expression: "neutral" },
      { speaker: "지수", text: "와 감사합니다 진짜", characterId: "jisoo", expression: "happy" },
      { speaker: "레오", text: "전시 재밌게 보고 가세요", characterId: "leo", expression: "neutral" },
      { speaker: '', text: "레오가 다시 상자를 들고 안쪽으로 향한다.", characterId: null },
      { speaker: "영우", text: "지수야\n방금 또 뭐 흘렸어", characterId: "youngwoo", expression: "smirk" },
      { speaker: "지수", text: "아니거든?????\n고리가 헐거웠던 거지 내 잘못이 아니야", characterId: "jisoo", expression: "annoyed" },
      { speaker: "영우", text: "열쇠 흘리고 다니는 거 은근 위험한데\n그러다 진짜 잃어버리면 어떡해", characterId: "youngwoo", expression: "smirk" },
      { speaker: "지수", text: "바부야 👊\n방금 레오씨가 꽉 잠가주셨자나\n다신 안 그럴 거야", characterId: "jisoo", expression: "annoyed" },
      { speaker: "영우", text: "ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n알겠어알겠어\n근데 오늘 여기 사람들 다 왜케 친절하지", characterId: "youngwoo", expression: "happy" },
      { speaker: "지수", text: "그니까\n너무 좋쟈나 ㅎㅎ", characterId: "jisoo", expression: "happy" },
    ],
  },
  'w2ef-topic-k01': {
    id: 'w2ef-topic-k01',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: 'K-01 자세히 보기',
    lines: [
      { speaker: '', text: "지수와 영우가 K-01 진열대 앞으로 다가간다. 정교한 황동 공예품이 조명 아래 놓여 있다. 표면의 세공이 빛을 받아 은은하게 일렁이고, 받침대 하단에는 작은 무늬가 촘촘하게 새겨져 있다.", characterId: null },
      { speaker: "지수", text: "와\n진짜 예쁘다", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "이거 세공 미쳤는데\n하단 무늬 봐봐\n이 정도 디테일이면 몇 달은 걸렸을 거 같은데", characterId: "youngwoo", expression: "happy" },
      { speaker: "지수", text: "가까이서 보니까 더 좋다\n사진 찍어도 되려나", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "아까 개인 소장용은 된다고 했으니까\n찍어도 될 거 같은데", characterId: "youngwoo", expression: "neutral" },
      { speaker: '', text: "그때 다니엘이 잠깐 전시장에 들른다. 캐주얼한 걸음으로 들어와 두 사람을 발견하고 손을 든다.", characterId: null },
      { speaker: "다니엘", text: "어, 여기 계셨네요", characterId: "daniel-guide", expression: "neutral" },
      { speaker: "지수", text: "어! 다니엘씨!!!!", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "안녕하세요, 또 뵙네요", characterId: "youngwoo", expression: "happy" },
      { speaker: "다니엘", text: "지나가는 길에 잠깐 들렀어요\n전시는 좀 둘러보셨어요?", characterId: "daniel-guide", expression: "neutral" },
      { speaker: "지수", text: "네! 방금 K-01 보고 있었어요\n진짜 예쁘더라구요", characterId: "jisoo", expression: "happy" },
      { speaker: '', text: "다니엘이 진열대 앞으로 다가와 몸을 살짝 숙여 들여다본다.", characterId: null },
      { speaker: "다니엘", text: "이 진열장 처음 보는 구조인데\n신기하네요", characterId: "daniel-guide", expression: "curious" },
      { speaker: "영우", text: "그런가요?\n저희는 그냥 예쁘다고만 생각했는데", characterId: "youngwoo", expression: "neutral" },
      { speaker: "다니엘", text: "받침대랑 유리 케이스 결합 방식이 좀 특이해서요\n이런 임시 전시에서는 흔치 않은 구조라", characterId: "daniel-guide", expression: "curious" },
      { speaker: "다니엘", text: "직원문이 저쪽으로 열리는 구조인가", characterId: "daniel-guide", expression: "neutral" },
      { speaker: "영우", text: "어 그런가봐요", characterId: "youngwoo", expression: "neutral" },
      { speaker: "지수", text: "그러고 보니 저기 문 있었네요\n전혀 못 봤어요", characterId: "jisoo", expression: "neutral" },
      { speaker: '', text: "다니엘이 별생각 없다는 듯 웃으며 다시 나간다.", characterId: null ,
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-daniel-staffdoor-foreknowledge', code: 'E-DN0', category: 'testimony', title: '다니엘의 직원문 선지식',
              description: '다니엘 리드 — "이 진열장 처음 보는 구조"라면서도 직원문이 열리는 방향까지 곧바로 맞혔다. 처음 온 사람치고는 너무 정확한 감.',
              discoveredLocationText: 'Pop-up Exhibition · K-01 진열대 앞, 다니엘과의 대화',
            },
          },
        ],
      },
      { speaker: "다니엘", text: "저는 다시 일 좀 보러 가볼게요\n오후에 시간 되시면 또 뵈어요", characterId: "daniel-guide", expression: "neutral" },
      { speaker: "지수", text: "네 감사합니다!!", characterId: "jisoo", expression: "happy" },
      { speaker: '', text: "다니엘이 손을 흔들고 전시장 밖으로 나간다.", characterId: null },
      { speaker: "지수", text: "저분 진짜 아는 것도 많으시네", characterId: "jisoo", expression: "neutral" },
      { speaker: "영우", text: "그러게\n로컬이라 그런가\n길도 잘 알고 이런 것도 다 알고", characterId: "youngwoo", expression: "neutral" },
      { speaker: "지수", text: "오늘 진짜 좋은 사람들만 만나는 거 같아\n사진 찍어주신 것도 그렇고\n보관함 도와주신 것도 그렇고", characterId: "jisoo", expression: "happy" },
      { speaker: "영우", text: "그니까\n나중에 다니엘씨한테 시드니 관광청 표창장이라도 드려야 되는 거 아니야", characterId: "youngwoo", expression: "smirk" },
      { speaker: "지수", text: "ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n무슨 표창장이야\n그래도 인정은 인정", characterId: "jisoo", expression: "happy" },
    ],
  },

  /* ===== w2-exhibit-floor investigateHotspots (§신규) =====
     w2-adrian-spot의 w2as-topic-*(구 미니게임 핫스팟)와 같은 패턴 — 캐릭터
     칩과 별개로 화면을 탭해서 찾는 순수 조사하기 topic 셋. K-01
     조명(w2ef-hotspot-k01-light)은 증거 없는 순수 분위기용, 나머지 둘은
     사건 전 자유 관람 시점에 미리 놓인 물증(§신규 원칙대로 "필수 증거"
     게이트는 아니고 보강 증거)이다. 레오/애드리언 쪽 물증으로만 채워
     다니엘이 배후라는 반전과 어긋나지 않게 한다. */
  'w2ef-hotspot-k01-light': {
    id: 'w2ef-hotspot-k01-light',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: 'K-01 진열대 조명 살펴보기',
    lines: [
      { speaker: '', text: 'K-01 위쪽 조명을 올려다본다. 각도가 미묘하게 세공 부분을 강조하도록 맞춰져 있다.', characterId: null },
      { speaker: '지수', text: '조명 하나로 이렇게 느낌이 다르구나.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '그러게, 신경 좀 썼네.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  'w2ef-hotspot-staffdoor': {
    id: 'w2ef-hotspot-staffdoor',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '직원 전용문 살펴보기',
    lines: [
      { speaker: '', text: '전시장 안쪽, "관계자 외 출입 금지"라고 적힌 직원 전용문이 보인다. 지금은 굳게 닫혀 있다.', characterId: null },
      { speaker: '지수', text: '저 문은 뭐지?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '직원용인가봐\n지금은 잠겨 있는 것 같은데', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '', text: '문턱 아래 틈에 작은 포장용 테이프 조각이 떨어져 있다. 짐을 옮기다 흘린 것 같다.', characterId: null },
      { speaker: '지수', text: '이런 것도 막 떨어져 있네.', characterId: 'jisoo', expression: 'neutral' },
      {
        speaker: '영우', text: '짐 나르다 흘렸나보다\n대수롭지 않은 거겠지', characterId: 'youngwoo', expression: 'neutral',
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-staffdoor-tape-scrap', code: 'E-EF1', category: 'physical', title: '직원문 앞 포장용 테이프 조각',
              description: '직원 전용문 문턱 아래 떨어져 있던 포장용 테이프 조각. 지금은 그냥 짐을 나르다 흘린 부스러기처럼 보인다.',
              discoveredLocationText: 'Pop-up Exhibition · 직원 전용문 앞',
            },
          },
        ],
      },
    ],
  },
  'w2ef-hotspot-pedestal': {
    id: 'w2ef-hotspot-pedestal',
    characterId: 'youngwoo',
    locationIds: ['w2-exhibit-floor'],
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    type: 'topic',
    label: '보조 진열대 살펴보기',
    lines: [
      { speaker: '', text: 'K-01 진열대 옆, 보조 진열용 받침대 하나가 비어 있다.', characterId: null },
      { speaker: '영우', text: '이건 뭐 놓으려고 비워둔 건가?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '', text: '받침대 옆면에 연필로 그은 듯한 작은 눈금 자국이 남아 있다. 누군가 치수를 재본 흔적 같다.', characterId: null },
      { speaker: '지수', text: '어? 여기 뭐 재본 자국 있는데.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '진짜네\n누가 이런 걸 재나', characterId: 'youngwoo', expression: 'curious' },
      {
        speaker: '지수', text: '전시 준비하면서 그랬겠지 뭐.', characterId: 'jisoo', expression: 'neutral',
        effects: [
          {
            type: 'addEvidence',
            evidence: {
              id: 'evidence-pedestal-pencil-marks', code: 'E-EF2', category: 'physical', title: '보조 받침대의 눈금 자국',
              description: 'K-01 옆 빈 받침대 옆면에 남은 연필 눈금 자국. 누군가 정확한 치수를 재본 흔적으로 보인다.',
              discoveredLocationText: 'Pop-up Exhibition · 보조 진열 구역',
            },
          },
        ],
      },
    ],
  },

  /* ===== Phase 4 — 용의자 탐문 (§12.6) =====
     Each suspect's *entire* existing interrogation scene (already scripted,
     multi-round, choice-heavy — see dev/dialogueData.js week2Scene006/007/
     008Lines) is treated as one atomic hub interaction rather than being
     decomposed into topics. Decomposing a real interrogation's internal
     round/hint/hypothesis structure into hub topic-state nodes would risk
     breaking flag dependencies inside content this careful; a coarse
     "visit = launch the whole scene" hand-off gets the free-order benefit
     spec §12.6 asks for with zero risk to the existing script.
     type: 'scene' (§신규) — 이 hand-off은 더 이상 play/game/index.html로
     완전히 페이지 이동하지 않는다. sceneId가 가리키는 씬(스크립트는 그대로)을
     허브 자신의 하단 패널 안에서 인라인 재생한다 — see play/explore/index.html
     playSceneInline. */
  // Phase 진입 시 자동 재생되는 도입 대화 — w2-phase1-intro(위)와 같은
  // type:'phaseIntro' 패턴. week2-scene-005b(다니엘 최초 진술)의 마지막 줄
  // 바로 다음 순간이라, 인사/자기소개 없이 곧장 "이제 사진 속 세 사람을
  // 만나보자"는 정리 대사로 시작한다. Phase 1의 사진놀이 같은 선택지 루프는
  // 없다 — 관광의 들뜬 톤과 달리 탐문 phase는 차분하게 바로 자유 탐색으로
  // 넘어가는 편이 맞다.
  'w2-phase4-intro': {
    id: 'w2-phase4-intro',
    type: 'phaseIntro',
    phases: ['W2_SUSPECT_INTERVIEWS'],
    lines: [
      { id: 'line-001', speaker: '', text: '전시장 앞 광장.', characterId: null },
      { id: 'line-002', speaker: '영우', text: '자, 정리해보자.\n사진에 찍힌 사람이 세 명이었지?', characterId: 'youngwoo', expression: 'serious' },
      { id: 'line-003', speaker: '지수', text: '네. 윤민아, 애드리언 콜, 레오 박.', characterId: 'jisoo', expression: 'serious' },
      { id: 'line-004', speaker: '영우', text: '한 명씩 만나서 얘기 들어보자.\n순서는 상관없을 것 같은데.', characterId: 'youngwoo', expression: 'neutral' },
      { id: 'line-005', speaker: '지수', text: '좋아요.\n누구부터 만날지는 제가 정할게요.', characterId: 'jisoo', expression: 'smirk' },
    ],
  },
  // Phase 4의 "앞쪽 대화" — Phase 1(관광 자유 탐색)이 모든 장소에 가벼운
  // 잡담용 topic을 깔아둔 것과 같은 목적으로, 탐문 거점에도 심문과 무관한
  // ungated 플레이버 topic을 하나 둔다. w2-hub-plaza의 visualBrief(위
  // locationDefs.js)가 이미 "안내판이나 임시 표지판이 하나 정도 추가된"이라고
  // 적어둔 디테일을 그대로 대사로 옮긴 것 — 새 단서/플래그는 없다(순수 분위기).
  'w2sh-topic-notice': {
    id: 'w2sh-topic-notice',
    characterId: 'youngwoo',
    locationIds: ['w2-hub-plaza'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'topic',
    label: '임시 안내판 읽기',
    lines: [
      { speaker: '', text: '전시장 입구 옆, 급하게 붙인 듯한 안내문이 보인다.', characterId: null },
      { speaker: '', text: '[ 안내 ]\n내부 사정으로 잠시 관계자 외 출입을 제한합니다.\n양해 부탁드립니다.', characterId: null },
      { speaker: '지수', text: '진짜 뭔가 있긴 있나 보다.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '그러니까 우리가 물어보러 온 거지.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  // "사전 복선" 패턴의 유일한 회수 사례(선택형) — w2bv-topic-van(Phase 1,
  // 하버브리지)에서 심어둔 flag(discoveredBridgeVan)를 여기서 실제 증거로
  // 바꾼다. 다만 검토 답변서 §2.4 방침대로 "필수 증거"가 아니라 순수 보강
  // 증거로 — unlockConditions에 evidence-service-magnet-missing(레오 사건이
  // 실질적으로 풀린 뒤라는 대용 조건, "E11 레오 업무 채팅 획득 이후"의 대체)
  // 까지 요구해서, 이미 사건 구조를 어느 정도 파악한 뒤에만 이 조각이
  // 맞춰지도록 한다. 광장에 영우 chip을 새로 연 이유(locationDefs.js 참고)가
  // 이 topic 하나 때문이다. 나머지 3개(오페라뷰 크롭/록스골목 자석/전시장입구
  // 안내문)는 순수 flag만 남기고 회수 지점이 없다 — §신규 원칙대로 넷 다 같은
  // 무게로 취급하지 않는다.
  'w2sh-topic-van-recall': {
    id: 'w2sh-topic-van-recall',
    characterId: 'youngwoo',
    locationIds: ['w2-hub-plaza'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'topic',
    label: '그 서비스 밴, 다시 생각해보기',
    unlockConditions: [
      { type: 'flags', keys: ['discoveredBridgeVan'] },
      { type: 'hasEvidence', ids: ['evidence-service-magnet-missing'] },
    ],
    lines: [
      { speaker: '영우', text: '아 맞다, 하버브리지에서 봤던 그 밴...', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '시동 켜놓고 계속 서 있던 그 차요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '그때 와이퍼에 종이 한 장 끼워져 있길래 그냥 찍어뒀거든. 그땐 흐려서 안 읽혔는데.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '', text: '사진을 확대해보니 이제야 글자가 읽힌다.', characterId: null },
      { speaker: '', text: '[ FIELD COLLECTION ]\nWindow: 11:10–11:30\nZone: TR-2\nRef: SR-184\nHOLD UNTIL CONFIRMATION', characterId: null },
      { speaker: '지수', text: '...TR-2면 이 근처잖아요. 시간대도 딱 그때고.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '그 서비스 자석 얘기랑도 얼추 맞물리는 것 같은데.', characterId: 'youngwoo', expression: 'suspicious' },
    ],
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-bridge-van-collection-note', code: 'E-P01', category: 'physical', title: '밴에서 찾은 현장 수거 메모',
        description: '"FIELD COLLECTION / Window: 11:10-11:30 / Zone: TR-2 / Ref: SR-184 / HOLD UNTIL CONFIRMATION" — 사건 당일 오전, 전시장 인근 구역(TR-2)에서 무언가를 수거할 예정이었다는 메모. 레오 사건과 정확히 어떻게 연결되는지는 아직 확정되지 않았다.',
        discoveredLocationText: 'Circular Quay · 하버브리지 전망 구역 (촬영해둔 사진 확대)',
      },
    }],
  },
  // isInterrogation (§신규) — the hub shows these as a floating "심문하기"
  // button above the bottom bar instead of burying them in the normal 대화
  // topic list (see play/explore/index.html renderInterrogateBtn/
  // getInterrogationInteraction) — 전화 걸기(w1reverify-martin-call 등, 아래)
  // 처럼 route를 갖는 다른 minigame형 hand-off와 구분하기 위한 플래그.
  //
  // type: 'scene' (심문 씬 허브 인라인 재생, §신규) — 예전엔 type:'minigame'
  // + route로 play/game/index.html이라는 별도 페이지로 완전히 이동했지만,
  // 지금은 sceneId가 가리키는 dev/dialogueData.js의 스크립트(라운드·선택지·
  // 가설·미니게임 임베드 그대로)를 허브 자신의 하단 패널 안에서 재생한다
  // (play/explore/index.html playSceneInline) — 대화하기가 이미 인라인
  // 전환된 것과 같은 패턴. 씬 데이터/구조 자체는 전혀 손대지 않았고 오직
  // "어디서 재생되는가"만 바뀐 것이라, 씬이 사라지는 게 아니다.
  // Phase 4 "앞쪽 대화" — 용의자 chip을 눌렀을 때 심문하기(isInterrogation)와
  // 별개로 뜨는 가벼운 대화하기 topic. 실제 심문 씬(week2Scene006Lines)의
  // 오프닝("저기, 잠시만요" 등)과 겹치지 않도록, 다가가서 말 걸기 전 멀리서
  // 지켜보는 관찰 비트로만 구성한다 — Phase 1의 구경하기/관찰하기 topic들과
  // 같은 톤. 새 단서/플래그는 없다(순수 분위기).
  'w1suspect-mina-topic-watch': {
    id: 'w1suspect-mina-topic-watch',
    characterId: 'minah',
    locationIds: ['w2-suspect-mina-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'topic',
    label: '윤민아 살펴보기',
    lines: [
      { speaker: '', text: '더 록스 골목, 벤치 근처에 한 여자가 앉아 있다.', characterId: null },
      { speaker: '지수', text: '저 사람이 사진에 세 번이나 나온 사람 맞죠?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '응, 맞아.\n근데 표정이 좀 불편해 보이는데.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '뭔가 찔리는 게 있나?', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '영우', text: '일단 가서 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  // autoPlayOnFirstVisit (§신규) — 처음 만나는 용의자는 심문하기 버튼을
  // 누르지 않아도 그 장소에 처음 들어가는 순간 심문 씬이 자동 재생된다
  // (findAutoInterrogation/performMove, play/explore/index.html) — phaseIntro가
  // phase 단위로 "낯선 도입부는 자동 재생"하는 것과 같은 원칙을 장소 단위로
  // 적용한 것. 재방문(이미 state가 'new'가 아님) 이후엔 대화하기/심문하기
  // 버튼이 그대로 남아 다시 열어볼 수 있다. Phase 5 재검증의 isInterrogation
  // 항목들(w1reverify-*)은 이 플래그를 일부러 안 붙인다 — "이미 아는 사람을
  // 다시 찾아가는" 재검증은 §10.4 방침대로 플레이어가 스스로 타이밍을
  // 고르는 게 맞다("처음 보는 사람"이 아니므로).
  'w1suspect-mina-interview': {
    id: 'w1suspect-mina-interview',
    characterId: 'minah',
    locationIds: ['w2-suspect-mina-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'scene',
    isInterrogation: true,
    autoPlayOnFirstVisit: true,
    label: '심문하기',
    icon: '🔍',
    sceneId: 'week2-scene-009',
  },
  // 위 mina-topic-watch와 같은 목적 — 애드리언의 대화하기 chip에 뜨는 순수
  // 관찰 비트, week2Scene007Lines의 실제 오프닝과는 겹치지 않는다.
  'w1suspect-adrian-topic-watch': {
    id: 'w1suspect-adrian-topic-watch',
    characterId: 'adrian',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'topic',
    label: '애드리언 콜 살펴보기',
    lines: [
      { speaker: '', text: '보조 진열 구역, 갤러리 관계자로 보이는 남자가 태블릿을 보며 서 있다.', characterId: null },
      { speaker: '지수', text: '저 사람이 두 번째 목격자죠?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '응, 여기 기획한 갤러리 쪽 사람이래.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '되게 차분해 보이네요.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '영우', text: '협조적일 것 같은데, 가서 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  'w1suspect-adrian-interview': {
    id: 'w1suspect-adrian-interview',
    characterId: 'adrian',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'scene',
    isInterrogation: true,
    autoPlayOnFirstVisit: true,
    label: '심문하기',
    icon: '🔍',
    sceneId: 'week2-scene-010',
  },
  // 위 두 topic과 같은 목적 — 레오의 대화하기 chip에 뜨는 순수 관찰 비트,
  // week2Scene008Lines의 실제 오프닝과는 겹치지 않는다.
  'w1suspect-leo-topic-watch': {
    id: 'w1suspect-leo-topic-watch',
    characterId: 'leo',
    locationIds: ['w2-suspect-leo-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'topic',
    label: '레오 박 살펴보기',
    lines: [
      { speaker: '', text: '접수대 옆 카페, 한 남자가 커피를 앞에 두고 앉아 있다.', characterId: null },
      { speaker: '지수', text: '저 사람, 사진 속 세 번째 인물이죠?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '응.\n되게 여유로워 보이네.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '...너무 여유로운 거 아니에요?', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '영우', text: '일단 가서 얘기 좀 해보자.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  // unlockConditions 게이트(§신규, 리뷰 지적 반영) — 레오 쪽만 허브로 안
  // 돌아오고 곧장 week2-scene-010b→minigame-timeline→011→012→013까지 이어져
  // 버리는데(위 주석 참고), 윤민아/애드리언 스팟은 순서 제약이 전혀 없어
  // 플레이어가 셋 중 레오를 먼저 찍으면 그 판본에서 윤민아 심문(009)·
  // 애드리언 1차 응대(010)를 영영 못 보게 된다 — 세 스팟이 겉보기엔 동등한
  // 자유 탐색처럼 보이는데 실제론 하나만 "돌아올 수 없는 허브 탈출"이라
  // 사고로 걸리기 쉬운 구조였다. autoPlayOnFirstVisit도 getInteractionState
  // === 'new' 조건이라 locked면 자동 재생되지 않고, 심문하기 버튼도
  // getInterrogationInteraction이 locked를 걸러내 안 뜬다(레오 살펴보기
  // topic은 ungated라 그대로 보임 — 대화하기는 정상 동작, 놀러 온
  // 느낌만 유지).
  'w1suspect-leo-interview': {
    id: 'w1suspect-leo-interview',
    characterId: 'leo',
    locationIds: ['w2-suspect-leo-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'scene',
    isInterrogation: true,
    autoPlayOnFirstVisit: true,
    unlockConditions: [
      { type: 'interactionCompleted', ids: ['w1suspect-mina-interview', 'w1suspect-adrian-interview'] },
    ],
    label: '심문하기',
    icon: '🔍',
    sceneId: 'week2-scene-010b',
  },

  /* ===== Phase 5 — 모순 재검증 / 2부 재조사 (v4 Ch14~19, 탐색허브 재도입) =====
     Same coarse "visit = launch the whole existing scene" hand-off as Phase
     4's suspect interviews — see dev/data/locationDefs.js's w2-reverify-*
     entries for the free-order rationale. [탐색허브 재도입] v4에서 이
     phase에 대응하는 여섯 챕터는 마틴 통화(014)/애드리언 재심문(015)/레오
     재심문(016)/소피의 기억(017)/다니엘 신원 확인(018)/관광객 재조사(019) —
     윤민아는 여기 없다. v4 아웃라인상 윤민아의 2부 역할(나사 방향·결합선
     차이를 알아보는 시각 자료 전문가)은 이미 1부 마지막(week2-scene-012,
     K-01 회수)에서 소화되므로 별도 재심문 챕터가 없다 — 옛 Phase 5의
     w1reverify-mina-interview/w2-reverify-mina-spot은 그래서 삭제했다(v4엔
     대응 씬 자체가 없어 새 번호를 붙일 수도 없었다). */
  'w1reverify-adrian-interview': {
    id: 'w1reverify-adrian-interview',
    characterId: 'adrian',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '재심문하기',
    icon: '🔍',
    sceneId: 'week2-scene-015',
  },
  // type:'scene'로 전환 — 다른 재검증 대상들과 같은 인라인 재생/허브 복귀
  // 패턴을 쓴다(예전엔 type:'minigame'+route로 /play/game/까지 완전히
  // 나갔다 돌아오는 별도 왕복이었다).
  'w1reverify-martin-call': {
    id: 'w1reverify-martin-call',
    characterId: 'martin',
    locationIds: ['w2-reverify-martin-spot'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '전화 걸기',
    icon: '📞',
    sceneId: 'week2-scene-014',
  },
  'w1reverify-leo-interview': {
    id: 'w1reverify-leo-interview',
    characterId: 'leo',
    locationIds: ['w2-suspect-leo-spot'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '재심문하기',
    icon: '🔍',
    sceneId: 'week2-scene-016',
  },
  'w1reverify-sophie-interview': {
    id: 'w1reverify-sophie-interview',
    characterId: 'sophie',
    locationIds: ['w2-reverify-sophie-spot'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '이야기 나누기',
    icon: '☕',
    sceneId: 'week2-scene-017',
  },
  'w1reverify-daniel-interview': {
    id: 'w1reverify-daniel-interview',
    characterId: 'daniel-guide',
    locationIds: ['w2-hub-plaza'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '신원 확인하기',
    icon: '🔍',
    sceneId: 'week2-scene-018',
  },
  'w1reverify-tourists-interview': {
    id: 'w1reverify-tourists-interview',
    characterId: 'youngwoo',
    locationIds: ['w2-circular-quay'],
    phases: ['W2_REVERIFICATION'],
    type: 'scene',
    isInterrogation: true,
    label: '관광객들과 다시 얘기하기',
    icon: '🗣️',
    sceneId: 'week2-scene-019',
  },
};

/* ===== 증거 제시 판정 규칙 (The Missing Key v1 §8/§14.8) =====
   Real first content for the hub's own "증거 제시" action (previously always
   fell through to a generic default) — a handful of rules against evidence
   already established by the existing 006/007 심문 씬s, usable once the
   player reaches the Phase 5 재검증 허브 (where they've actually had a
   chance to collect that evidence). This is *supplementary* flavor on top
   of the untouched scripted scenes (011/011a), not a replacement for their
   own internal evidence gates — presenting evidence here never resolves a
   question or advances the case on its own, it only ever reacts.
   result 은 §8.2의 5분류(correct/partial/interesting/wrong/blocked)를
   그대로 쓴다; wrong/blocked엔 페널티가 없다는 원칙(§8.4)도 그대로
   따른다 — reactionText만 다를 뿐 포인트·진행 차감은 없다. */
const presentEvidenceRules = [
  // Phase 4(용의자 탐문) correct 룰 — 아직 실제 컨텐츠로 다듬어진 반응은
  // 아니고, 탐색허브 제시하기 시트의 "정답 제시(테스트용)" 버튼
  // (presentTestCorrectAnswer, play/explore/index.html)이 심문마다 곧바로
  // 시험해볼 correct 경로를 갖도록 임시로 채운 것 — 실제 심문 씬(006/
  // 007/008)이 이미 그 자체 증거 게이트로 진행되므로, 이 반응 자체는 여전히
  // 순수 부가 flavor(§8.2 원칙 그대로)다. 나중에 실제 스토리에 맞는
  // reactionText/evidenceId로 다듬으면 된다.
  {
    characterId: 'minah', phase: 'W2_SUSPECT_INTERVIEWS', evidenceId: 'evidence-mina-illegal-photo', result: 'correct',
    reactionText: '[테스트] 윤민아: "...그거 어디서 났어요?"',
  },
  {
    characterId: 'adrian', phase: 'W2_SUSPECT_INTERVIEWS', evidenceId: 'evidence-adrian-sender', result: 'correct',
    reactionText: '[테스트] 애드리언: "...그 계정, 어디서 찾으셨죠."',
  },
  {
    characterId: 'leo', phase: 'W2_SUSPECT_INTERVIEWS', evidenceId: 'evidence-leo-bag-strap-shape', result: 'correct',
    reactionText: '[테스트] 레오: "...가방 끈이 왜요?"',
  },
  {
    characterId: 'minah', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-mina-illegal-photo', result: 'correct',
    reactionText: '윤민아: "...그거 이미 말씀드렸잖아요. 또 그 얘기예요?"',
  },
  {
    characterId: 'minah', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-mina-photo-timestamps', result: 'partial',
    reactionText: '윤민아: "그 시간에 사진 찍고 있었던 건 맞는데... 그게 왜요?"',
  },
  {
    characterId: 'minah', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-staff-tag-position-after', result: 'interesting',
    reactionText: '윤민아: "태그요? 그런 건 관심 없었는데... 직원들이나 아는 거 아니에요?"',
  },
  {
    characterId: 'adrian', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-adrian-sender', result: 'correct',
    reactionText: '애드리언: "...그 계정, 어디서 찾으셨죠." (표정이 굳는다)',
  },
  {
    characterId: 'adrian', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-adrian-inquiry', result: 'partial',
    reactionText: '애드리언: "문의 메일이야 저 아니어도 여러 사람이 보냈을 텐데요."',
  },
  {
    characterId: 'adrian', phase: 'W2_REVERIFICATION', evidenceId: 'evidence-mina-illegal-photo', result: 'blocked',
    reactionText: '애드리언: "그건 제가 아니라 그쪽 여성분 얘기 아닌가요? 저랑 무슨 상관이죠?"',
  },
];
const defaultPresentReaction = { result: 'wrong', reactionText: '음... 이게 지금 왜 필요한지는 잘 모르겠는데.' };

// 2주차 Phase 1의 "필수 조사" 체크리스트(§10.2) — 관광 파트는 조사가 아니라
// 자유도 중심이라 필수 fact는 없지만, §12.2의 전시장 진입 제안 조건(관광
// 장소 2곳 이상 방문 또는 특정 인터랙션 완료)은 여기서 표현해 둔다. 실제
// "제안" UI(소프트 게이트, §10.3)는 아직 play/explore/index.html에 연결하지
// 않음 — 후속 작업.
const phaseGoals = {
  W2_EXHIBIT_FREE_LOOK: {
    requiredFactIds: [],
    suggestNextConditions: [
      { type: 'visitedLocationsAtLeast', count: 2 },
      { type: 'completedInteraction', id: 'w2rl-topic-exhibition-spot' },
    ],
  },
};
