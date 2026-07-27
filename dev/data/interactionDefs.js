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
  // Phase 진입 시 자동 재생되는 도입 대화 (§신규) — 예전엔 week2-scene-002라는
  // 별도 VN 씬(dev/dialogueData.js, locationDefs.js의 w2-circular-quay.
  // firstVisitSceneId로 /play/game까지 갔다 오던 구조)이었지만, 탐색허브
  // 진입 흐름 전체가 이미 허브 안에 있으므로 이 내용도 허브 네이티브
  // 콘텐츠로 옮겼다 — 대사/선택지/효과는 그대로, 그릇만 옮겨졌다(사진 포즈
  // 루프, 전시장 발견 선택지). type:'phaseIntro'는 탭으로 여는 topic/scene과
  // 달리 그 phase에 처음 진입할 때 자동 재생되고 하단 액션바 목록엔 노출되지
  // 않는다 — completeInteraction으로 "이미 봤음"을 기록해 두 번 다시 안
  // 뜬다. "지금 들어가요"/"조금 더 둘러보다 갈래요" 둘 다 결국 이 허브
  // 화면으로 이어지므로(더 이상 다른 페이지로 나가는 흐름이 아니므로),
  // 원래 wander-more 선택지에 있던 returnToExploration 이펙트는 뺐다 — see
  // performMove()/playSceneInline() in play/explore/index.html.
  'w2-phase1-intro': {
    id: 'w2-phase1-intro',
    type: 'phaseIntro',
    phases: ['W2_TOURISM'],
    lines: [
      { id: 'line-001', speaker: '', text: 'Circular Quay.\n오전 10시 15분.', characterId: null },
      { id: 'line-002', speaker: '', text: '오페라하우스와 하버브리지가 한눈에 들어온다.', characterId: null },
      { id: 'line-003', speaker: '지수', text: '와아아 진짜 사진으로 보던 그대로다.', characterId: 'jisoo', expression: 'shocked' },
      { id: 'line-004', speaker: '영우', text: '여기 서봐.\n찍어줄게.', characterId: 'youngwoo', expression: 'soft' },
      {
        id: 'pose-loop', type: 'choice', speaker: '', text: '이번엔 어떤 포즈로 찍을까요? (세 번 골라볼 수 있어요)', characterId: null,
        choices: [
          { id: 'v', label: '브이', goto: 'pose-v' },
          { id: 'heart', label: '손가락 하트', goto: 'pose-heart' },
          { id: 'turn', label: '뒤돌아보기', goto: 'pose-turn' },
          { id: 'smile', label: '그냥 웃기', goto: 'pose-smile' },
          { id: 'together', label: '영우와 같이 찍기', goto: 'pose-together' },
        ],
      },
      { id: 'pose-v', speaker: '지수', text: '브이!', characterId: 'jisoo', expression: 'happy', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }], goto: 'pose-loop-check' },
      { id: 'pose-heart', speaker: '지수', text: '이렇게, 손가락 하트.', characterId: 'jisoo', expression: 'smirk', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }], goto: 'pose-loop-check' },
      { id: 'pose-turn', speaker: '', text: '지수가 살짝 뒤돌아보는 포즈를 취한다.', characterId: 'jisoo', expression: 'curious', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }], goto: 'pose-loop-check' },
      { id: 'pose-smile', speaker: '지수', text: '그냥 웃을게요.', characterId: 'jisoo', expression: 'happy', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }], goto: 'pose-loop-check' },
      { id: 'pose-together', speaker: '영우', text: '나도? 그럼 셀프타이머로.', characterId: 'youngwoo', expression: 'soft', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }], goto: 'pose-loop-check' },
      {
        id: 'pose-loop-check', type: 'choice', speaker: '', text: '더 찍어볼까요?', characterId: null,
        choices: [
          { id: 'more', label: '한 번 더', goto: 'pose-loop' },
          { id: 'enough', label: '이 정도면 충분해요', goto: 'line-005' },
        ],
      },
      { id: 'line-005', speaker: '', text: '지수가 브이를 했다가, 손가락 하트를 했다가,\n결국 그냥 웃는 얼굴로 정착한다.', characterId: 'jisoo', expression: 'happy' },
      { id: 'line-006', speaker: '영우', text: '역시 그냥 웃는 게 제일 낫다.', characterId: 'youngwoo', expression: 'soft' },
      { id: 'line-007', speaker: '지수', text: '그럼 나머지는 왜 찍었어요.', characterId: 'jisoo', expression: 'smirk' },
      { id: 'line-008', speaker: '영우', text: '비교군이 있어야 알지 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
      { id: 'line-009', speaker: '지수', text: '이제 저도 하나 찍어줄게요.\n이리 와요.', characterId: 'jisoo', expression: 'smirk' },
      { id: 'line-010', speaker: '영우', text: '나는 됐는데', characterId: 'youngwoo', expression: 'blank' },
      { id: 'line-011', speaker: '지수', text: '안 돼요.\n기록 남겨야죠.', characterId: 'jisoo', expression: 'smirk' },
      {
        id: 'angle-choice', type: 'choice', speaker: '지수', text: '음, 어떤 각도로 찍을까요?', characterId: 'jisoo', expression: 'curious',
        choices: [
          { id: 'opera-center', label: '오페라하우스 중심', goto: 'angle-opera' },
          { id: 'bridge-center', label: '하버브리지 중심', goto: 'angle-bridge' },
          { id: 'face-center', label: '영우 얼굴 중심', goto: 'angle-face' },
        ],
      },
      { id: 'angle-opera', speaker: '지수', text: '오페라하우스 딱 걸리게.', characterId: 'jisoo', expression: 'curious', goto: 'line-012' },
      { id: 'angle-bridge', speaker: '지수', text: '다리도 같이 나오게.', characterId: 'jisoo', expression: 'curious', goto: 'line-012' },
      { id: 'angle-face', speaker: '지수', text: '오늘은 그냥 얼굴 위주로.', characterId: 'jisoo', expression: 'smirk', goto: 'line-012' },
      { id: 'line-012', speaker: '', text: '한참을 그렇게 놀던 중,\n지수의 눈에 낯선 팻말 하나가 들어왔다.', characterId: 'jisoo', expression: 'curious' },
      { id: 'line-013', speaker: '지수', text: '어?\n저기 저거 뭐예요?', characterId: 'jisoo', expression: 'curious' },
      { id: 'line-014', speaker: '영우', text: '어디?', characterId: 'youngwoo', expression: 'curious' },
      { id: 'line-015', speaker: '지수', text: '저 골목 안쪽.\n뭔가 전시하나 본데.', characterId: 'jisoo', expression: 'curious' },
      {
        id: 'line-016', type: 'choice', speaker: '영우', text: '오, 팝업 전시네.\n지금 들어가 볼까, 조금 더 둘러보다 갈까?', characterId: 'youngwoo', expression: 'soft',
        choices: [
          { id: 'enter-now', label: '“지금 들어가요.”', goto: 'line-017' },
          { id: 'wander-more', label: '“조금 더 둘러보다 갈래요.”', effects: [{ type: 'setFlag', key: 'discoveredPopupExhibition', value: true }] },
        ],
      },
      { id: 'line-017', speaker: '지수', text: '웅웅 잠깐만 보고 가요.', characterId: 'jisoo', expression: 'happy' },
    ],
  },
  'w2cq-topic-ferries': {
    id: 'w2cq-topic-ferries',
    characterId: 'youngwoo',
    locationIds: ['w2-circular-quay'],
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
    type: 'topic',
    label: '팝업 전시장 발견하기',
    lines: [
      { speaker: '지수', text: '어? 저기 팝업 전시장 있는데?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '오, 진짜네. 한번 들어가볼까?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '좋아요, 궁금하다.', characterId: 'jisoo', expression: 'happy' },
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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

  /* ===== w2-adrian-spot (전시장 보조 진열 구역) — W2_TOURISM 전용 자유 조사
     10개 핫스팟 (§신규, 구 minigame-exhibition-search/HOTSPOTS 이식). 미니게임
     자체 UI(진행도 카운터, "다시 봐도 똑같다" 재방문 토스트, 3개 이상
     선택 관찰 시 보너스 증거)는 폐기했다 — 조사하기 자체가 이미 완료
     상태(state-exhausted)를 마커로 보여주고, addEvidence가 id로 중복을
     막아주므로 재방문 시 같은 짧은 대사가 다시 보이는 정도는 문제 없다.
     k01만 원래 대사 그대로 여러 줄(K01_DISCOVERY_LINES) 유지, 나머지 9개는
     원래 미니게임의 단문 관찰(line) 하나만 그대로 옮겼다 — 다른 페이즈의
     대화하기 topic들처럼 지수/영우 티키타카를 새로 지어 붙이지 않았다
     (원본에 없던 내용이라). characterId는 이 파일의 다른 W2_TOURISM
     topic들과 같은 관례로 'youngwoo'를 쓰지만, 이 phase의 w2-adrian-spot엔
     `characters`가 비어 있어(locationDefs.js) 대화하기 목록엔 뜨지 않고
     오직 조사하기 핫스팟으로만 열린다. */
  'w2as-topic-k01': {
    id: 'w2as-topic-k01',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
    type: 'topic',
    label: '오래된 필름 카메라 살펴보기',
    lines: [{ speaker: '', text: '접이식 빈티지 카메라. 렌즈 캡이 없어 안쪽이 살짝 뿌옇다.', characterId: null }],
  },
  'w2as-topic-watch': {
    id: 'w2as-topic-watch',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_TOURISM'],
    type: 'topic',
    label: '은제 회중시계 살펴보기',
    lines: [{ speaker: '', text: '은제 회중시계. 뒷면에 낯선 이니셜이 새겨져 있는데, 이 열쇠와는 다른 이니셜이다.', characterId: null }],
  },
  'w2as-topic-desk': {
    id: 'w2as-topic-desk',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_TOURISM'],
    type: 'topic',
    label: '접수대 살펴보기',
    lines: [{ speaker: '', text: '접수대. 안내 책자와 방명록, 작은 태그 몇 개가 놓여 있다.', characterId: null }],
  },
  'w2as-topic-tag': {
    id: 'w2as-topic-tag',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
    type: 'topic',
    label: '직원 전용문 살펴보기',
    lines: [{ speaker: '', text: '직원 전용문. "관계자 외 출입 금지"라고 적혀 있다. 살짝 닫혀 있다.', characterId: null }],
  },
  'w2as-topic-pamphlet': {
    id: 'w2as-topic-pamphlet',
    characterId: 'youngwoo',
    locationIds: ['w2-adrian-spot'],
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
    phases: ['W2_TOURISM'],
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
  'w2-exhibit-phase-intro': {
    id: 'w2-exhibit-phase-intro',
    type: 'phaseIntro',
    phases: ['W2_EXHIBIT_FREE_LOOK'],
    lines: [
      { id: 'line-001', speaker: '', text: '전시장 입구. 접수대에 클레어가 앉아 있다.', characterId: null },
      {
        id: 'line-002', speaker: '클레어', text: '어서 오세요, 팝업 전시 K-Collection에 오신 걸 환영합니다.\n입장은 무료고, 사진 촬영은 개인 소장용만 가능해요.', characterId: 'claire', expression: 'neutral',
        effects: [{
          type: 'addEvidence',
          evidence: {
            id: 'evidence-claire-alibi-statement', code: 'E-CL1', category: 'testimony', title: '클레어의 최초 진술 — 접수대 상주',
            description: '클레어 모건 — 자신은 근무 시간 내내 접수대에 있었고 자리를 비운 적이 없다는 진술.',
            discoveredLocationText: 'Pop-up Exhibition 접수대 · 클레어 최초 진술',
          },
        }],
      },
      { id: 'line-003', speaker: '지수', text: '아 네 감사합니다.', characterId: 'jisoo', expression: 'neutral' },
      { id: 'line-004', speaker: '영우', text: '안쪽에 뭐가 제일 유명해요?', characterId: 'youngwoo', expression: 'neutral' },
      { id: 'line-005', speaker: '클레어', text: '저희 메인 전시품은 K-01이에요. 이 지역 공예가가 만든 황동 작품인데, 안쪽 진열대에 있어요.', characterId: 'claire', expression: 'neutral' },
      { id: 'line-006', speaker: '영우', text: '한번 둘러보고 다들 만나보자.', characterId: 'youngwoo', expression: 'neutral' },
      { id: 'line-007', speaker: '지수', text: '좋아!!!! 한 명씩 인사하고 다닐게 ㅎㅎ', characterId: 'jisoo', expression: 'happy' },
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
      { speaker: '', text: '전시장 안쪽 카페 코너, 소피가 서 있다.', characterId: null },
      { speaker: '소피', text: '어머 안녕하세요! 커피 한 잔 하고 구경하실래요?', characterId: 'sophie', expression: 'curious' },
      { speaker: '지수', text: '오 좋아요 ㅎㅎ', characterId: 'jisoo', expression: 'happy' },
      { speaker: '소피', text: '여기 요즘 동네에 이 전시 때문에 사람들 좀 왔다갔다해요. 저 골목 카페들도 다 요즘 붐빈다니까.', characterId: 'sophie', expression: 'curious' },
      { speaker: '영우', text: '아 그렇구나.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '소피', text: '천천히 구경하고 가세요~', characterId: 'sophie', expression: 'curious' },
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
      { speaker: '', text: '전시장 중앙, 윤민아가 몸을 낮춰 K-01 하단을 확대 촬영하고 있다.', characterId: null },
      { speaker: '영우', text: '어, 저분 뭔가 되게 열심히 찍으시네.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '그러게, 근데 좀 조심스러워 보이는데.', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '', text: '윤민아가 두 사람을 발견하고 재빨리 폰을 내린다.', characterId: null },
      { speaker: '윤민아', text: '아, 안녕하세요. 그냥 콘텐츠용으로 좀.', characterId: 'minah', expression: 'annoyed' },
      { speaker: '지수', text: '아 네 ㅎㅎ 편하게 하세요.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '윤민아', text: '...네.', characterId: 'minah', expression: 'annoyed' },
      { speaker: '', text: '[ 의문점: 윤민아가 뭔가 급히 숨기는 것 같다 ] 등록.', characterId: null },
      { speaker: '클레어', text: '저기요, 손님.', characterId: 'claire', expression: 'annoyed' },
      { speaker: '윤민아', text: '네?', characterId: 'minah', expression: 'annoyed' },
      { speaker: '클레어', text: '상업적 촬영은 별도 허가가 필요해요. 지금 찍으신 거 확인 좀 할게요.', characterId: 'claire', expression: 'annoyed' },
      { speaker: '윤민아', text: '아 이거 그냥...', characterId: 'minah', expression: 'shocked' },
      { speaker: '', text: '윤민아가 서둘러 사진 몇 장을 지운다.', characterId: null },
      { speaker: '윤민아', text: '죄송해요, 그냥 개인 소장용으로 몇 장만...', characterId: 'minah', expression: 'shocked' },
      { speaker: '클레어', text: '다음부턴 주의해주세요.', characterId: 'claire', expression: 'neutral' },
      {
        speaker: '', text: '[ 증거: 윤민아의 확대 사진(무단 촬영 자료) ] 등록.', characterId: null,
        effects: [{
          type: 'addEvidence',
          evidence: {
            id: 'evidence-mina-photo-confiscated', code: 'E-V01', category: 'photo', title: '윤민아의 확대 사진',
            description: 'K-01 하단을 몰래 확대 촬영한 사진. 클레어에게 걸려 대부분 급히 지워졌다.',
            discoveredLocationText: 'Pop-up Exhibition · K-01 진열대',
          },
        }],
      },
      { speaker: '지수', text: '(작게) 영우, 저 사람 왜 저렇게 급하게 지웠지.', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '영우', text: '그러게, 좀 이상하긴 하다.', characterId: 'youngwoo', expression: 'neutral' },
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
      { speaker: '', text: 'K-01 진열대 근처를 애드리언이 서성이고 있다.', characterId: null },
      { speaker: '애드리언', text: '좋은 작품이죠, 이거. 황동 세공이 정말 섬세해요.', characterId: 'adrian', expression: 'neutral' },
      { speaker: '영우', text: '이거 사실 수도 있어요?', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '애드리언', text: '음... 그런 쪽은 제가 직접 다루는 건 아니고요, 그냥 보는 걸 좋아해서.', characterId: 'adrian', expression: 'suspicious' },
      { speaker: '', text: '[ 의문점: 애드리언이 가격 얘기를 피한다 ] 등록.', characterId: null },
      { speaker: '', text: '애드리언이 클레어에게 다가간다.', characterId: null },
      { speaker: '애드리언', text: '클레어씨, 하나만 여쭤볼게요. 이 받침 내부 깊이가 어느 정도 되나요?', characterId: 'adrian', expression: 'suspicious' },
      { speaker: '클레어', text: '네...? 그건 왜...', characterId: 'claire', expression: 'suspicious' },
      { speaker: '애드리언', text: '아, 그냥 구조가 궁금해서요, 공예적으로.', characterId: 'adrian', expression: 'suspicious' },
      { speaker: '', text: '어색한 침묵. [ 의문점: 애드리언은 왜 가격이 아니라 구조를 묻는가 ] 등록.', characterId: null },
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
      { speaker: '', text: '전시장 뒤쪽에서 짐을 나르던 레오가 지수와 부딪힐 뻔한다.', characterId: null },
      { speaker: '레오', text: '아 죄송해요!!', characterId: 'leo', expression: 'shocked' },
      { speaker: '지수', text: '아니에요 제가 잘 안 보고.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '', text: '그 순간 지수의 가방 고리에서 M.K. 열쇠가 떨어진다.', characterId: null },
      { speaker: '레오', text: '어 이거.', characterId: 'leo', expression: 'neutral' },
      { speaker: '', text: '레오가 열쇠를 주워 지수에게 건넨다.', characterId: null },
      { speaker: '레오', text: '떨어뜨리신 거 같은데... 어, M.K.네요?', characterId: 'leo', expression: 'neutral' },
      { speaker: '지수', text: '어? 아세요?', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '레오', text: '아 아니, 그냥 이니셜이 특이해서요 ㅎㅎ', characterId: 'leo', expression: 'neutral' },
      { speaker: '지수', text: '아 감사합니다!!!!\n큰일 날 뻔했어요.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '레오', text: '별말씀을요, 전시 재밌게 보고 가세요.', characterId: 'leo', expression: 'neutral' },
      { speaker: '영우', text: '지수야, 방금 또 뭐 흘렸어.', characterId: 'youngwoo', expression: 'smirk' },
      { speaker: '지수', text: '아니거든?????', characterId: 'jisoo', expression: 'annoyed' },
      { speaker: '영우', text: '열쇠 흘리고 다니는 거 은근 위험한데.', characterId: 'youngwoo', expression: 'smirk' },
      { speaker: '지수', text: '바부야 👊\n다신 안 그럴 거야.', characterId: 'jisoo', expression: 'annoyed' },
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
      { speaker: '', text: '지수와 영우가 K-01 진열대 앞으로 다가간다. 정교한 황동 공예품이 조명 아래 놓여 있다.', characterId: null },
      { speaker: '지수', text: '와, 진짜 예쁘다.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '영우', text: '이거 세공 미쳤는데, 하단 무늬 봐봐.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '', text: '그때 다니엘이 잠깐 전시장에 들른다.', characterId: null },
      { speaker: '다니엘', text: '어, 여기 계셨네요.', characterId: 'daniel-guide', expression: 'curious' },
      { speaker: '지수', text: '어! 다니엘씨!!!!', characterId: 'jisoo', expression: 'happy' },
      { speaker: '다니엘', text: '이 진열장 처음 보는 구조인데 신기하네요.', characterId: 'daniel-guide', expression: 'curious' },
      { speaker: '다니엘', text: '직원문이 저쪽으로 열리는 구조인가.', characterId: 'daniel-guide', expression: 'neutral' },
      { speaker: '영우', text: '어 그런가봐요.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '', text: '다니엘이 별생각 없다는 듯 웃으며 다시 나간다. [ 복선: 다니엘이 직원문 방향을 이미 안다 ] 등록.', characterId: null },
      { speaker: '지수', text: '저분 진짜 아는 것도 많으시네.', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '영우', text: '그러게, 로컬이라 그런가.', characterId: 'youngwoo', expression: 'neutral' },
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
  'w1suspect-leo-interview': {
    id: 'w1suspect-leo-interview',
    characterId: 'leo',
    locationIds: ['w2-suspect-leo-spot'],
    phases: ['W2_SUSPECT_INTERVIEWS'],
    type: 'scene',
    isInterrogation: true,
    autoPlayOnFirstVisit: true,
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
  W2_TOURISM: {
    requiredFactIds: [],
    suggestNextConditions: [
      { type: 'visitedLocationsAtLeast', count: 2 },
      { type: 'completedInteraction', id: 'w2rl-topic-exhibition-spot' },
    ],
  },
};
