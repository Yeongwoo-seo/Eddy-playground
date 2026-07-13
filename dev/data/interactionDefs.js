/* OPERATION MK DEV — 상호작용 정의 (The Missing Key v1 §7.3/§7.4/§14.7).
   Static catalog read by explorationState.js + dev/explore/index.html.
   First content slice: 1주차 Phase 1 관광 자유 탐색 (§12.2 "관광 자유 탐색
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

   "사전 복선" 패턴 (아래 w1ov-topic-crop 근처 주석 참고, 검토 답변서 반영판
   — 최초 버전은 "수상한 사람 4명"이었으나 실제 사건 타임라인과 안 맞는
   레드헤링이라 폐기됨) — 사건이 아직 일어나지 않은 자유 탐색 구간에서
   setFlag만으로 "봤다는 기억"만 남기는 재사용 가능한 관례. addQuestion은
   쓰지 않는다 — 넷 다 같은 무게의 CASE FILE 의문점으로 등록되면 플레이어가
   "이번 주차 안에 넷 다 풀리겠구나"라고 오해하게 된다. 대신 각 장소가 실제
   사건 구조(관계자 진술서 참고)의 서로 다른 한 조각을 조용히 미리 보여주고,
   회수는 나중에(있다면) 그 조각이 이미 의미를 가진 시점에 일어난다. 1주차
   전용이 아니라 이 파일/explorationState.js 구조 자체가 범용이므로, 다음
   주차에서 같은 성격의 구간을 쓸 때도 그대로 따라 쓰면 된다. */

const interactionDefs = {
  'w1cq-topic-ferries': {
    id: 'w1cq-topic-ferries',
    characterId: 'youngwoo',
    locationIds: ['w1-circular-quay'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '페리 구경하기',
    lines: [
      { speaker: '지수', text: '와 페리 진짜 많이 다니네.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '여기가 시드니에서 페리 제일 많이 타는 선착장이야.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '나중에 한 번 타보고 싶다.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '담에 시간 맞으면 타러 가자.', characterId: 'youngwoo', expression: 'soft' },
    ],
  },
  'w1cq-topic-buskers': {
    id: 'w1cq-topic-buskers',
    characterId: 'youngwoo',
    locationIds: ['w1-circular-quay'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '버스커 구경하기',
    lines: [
      { speaker: '', text: '산책로 한쪽에서 버스커가 기타를 치고 있다.', characterId: null },
      { speaker: '지수', text: '오 잘한다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '여기 주말마다 버스커들 꽤 많이 나와.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '분위기 좋다.', characterId: 'jisoo', expression: 'soft' },
    ],
  },
  'w1ov-topic-building': {
    id: 'w1ov-topic-building',
    characterId: 'youngwoo',
    locationIds: ['w1-opera-view'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '오페라하우스 감상하기',
    lines: [
      { speaker: '지수', text: '실제로 보니까 진짜 크다.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '조개껍데기 모양이라고 많이들 그러던데\n난 볼 때마다 돛 같아.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '오, 그러네.', characterId: 'jisoo', expression: 'curious' },
    ],
  },
  // §12.3 하버 포토 미니게임 — a 'minigame'-type interaction hands off to a
  // routed page instead of playing inline lines (see dev/explore/index.html's
  // playInteraction). Points-bearing and reusable any number of times, but
  // only pays out once (EconomyState.claimReward inside the minigame itself).
  'w1ov-minigame-photo': {
    id: 'w1ov-minigame-photo',
    characterId: 'youngwoo',
    locationIds: ['w1-opera-view'],
    phases: ['W1_TOURISM'],
    type: 'minigame',
    label: '사진 찍기 (하버 포토)',
    icon: '📷',
    route: '/dev/minigame-harbour-photo/?bg=opera',
  },
  // ===== "사전 복선" 패턴 (1주차 장편 확장 v3, 검토 답변서 반영판) =====
  // 재사용 가능한 일반 패턴 — 특정 사건이 아직 일어나지 않은 자유 탐색
  // 단계(Phase)의 관광/탐색 장소마다 실제 사건 구조의 한 조각을 조용히
  // 미리 보여준다. addQuestion은 쓰지 않고 setFlag만 쓴다(§22 idiom) — "이건
  // 정답이다"라는 게임의 확언 없이, 그냥 지나가는 관광 디테일처럼 보이는 게
  // 핵심이다. 지수/영우 둘 다 결론을 내리지 않는다. 다음 주차들도 사건 발생
  // 전 자유 탐색 구간이 있다면 이 패턴(topic 상호작용 + setFlag 효과, id는
  // 'w2-'/'w3-'/'w4-' 등 해당 주차 프리픽스)을 그대로 따라 쓰면 된다 — 1주차
  // 전용 메커니즘이 아니라 이 파일/explorationState.js 어디에도 주차
  // 하드코딩이 없는 범용 구조다.
  //
  // 오페라하우스 — 사진 크롭 튜토리얼. 레오가 나중에 공개하는 "크롭된 참고
  // 이미지"(evidence-leo-reference-image, week1-scene-008)가 윤민아의 원본
  // 사진에서 맥락(주변 인물·간판)만 잘려나간 것이었다는 걸, 플레이어가 여기서
  // 미리 "크롭하면 원본의 맥락이 사라진다"는 걸 직접 해봐서 체감하게 한다.
  // 사건 단서로 표시하면 안 되므로 flag만 남기고 question/evidence는 없다.
  'w1ov-topic-crop': {
    id: 'w1ov-topic-crop',
    characterId: 'youngwoo',
    locationIds: ['w1-opera-view'],
    phases: ['W1_TOURISM'],
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
  'w1bv-topic-bridge': {
    id: 'w1bv-topic-bridge',
    characterId: 'youngwoo',
    locationIds: ['w1-bridge-view'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '다리 구경하기',
    lines: [
      { speaker: '지수', text: '하버브리지 생각보다 훨씬 웅장하네.', characterId: 'jisoo', expression: 'shocked' },
      { speaker: '영우', text: '저 위 꼭대기까지 올라가는 투어도 있어.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '진짜요? 나 그거 완전 하고 싶다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '다음에 예약해서 같이 가자.', characterId: 'youngwoo', expression: 'soft' },
    ],
  },
  'w1bv-topic-memory': {
    id: 'w1bv-topic-memory',
    characterId: 'youngwoo',
    locationIds: ['w1-bridge-view'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '영우와 추억 이야기하기',
    lines: [
      { speaker: '영우', text: '나 예전에 여기 혼자 왔었거든.', characterId: 'youngwoo', expression: 'soft' },
      { speaker: '지수', text: '혼자요? 좀 외로웠겠다.', characterId: 'jisoo', expression: 'soft' },
      { speaker: '영우', text: '그때 생각했어.\n다음엔 꼭 같이 와야지.', characterId: 'youngwoo', expression: 'soft' },
      { speaker: '지수', text: '...\n지금 진짜 반칙이에요.', characterId: 'jisoo', expression: 'blank', pauseBeforeMs: 400 },
    ],
  },
  'w1bv-minigame-photo': {
    id: 'w1bv-minigame-photo',
    characterId: 'youngwoo',
    locationIds: ['w1-bridge-view'],
    phases: ['W1_TOURISM'],
    type: 'minigame',
    label: '사진 찍기 (하버 포토)',
    icon: '📷',
    route: '/dev/minigame-harbour-photo/?bg=bridge',
  },
  // 하버브리지 — 대기 중인 서비스 밴. 범죄 영화처럼 강조하지 않고, 그냥
  // 배경에 있는 밴으로 지나간다 — Phase 4의 w1sh-topic-van-recall(unlockCond:
  // 이 flag + evidence-service-magnet-missing)에서만 선택적으로 회수되는
  // "선택형 보강 증거"로 취급한다(필수 아님).
  'w1bv-topic-van': {
    id: 'w1bv-topic-van',
    characterId: 'youngwoo',
    locationIds: ['w1-bridge-view'],
    phases: ['W1_TOURISM'],
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
  'w1rl-topic-vintage': {
    id: 'w1rl-topic-vintage',
    characterId: 'youngwoo',
    locationIds: ['w1-the-rocks-lane'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '골목 구경하기',
    lines: [
      { speaker: '지수', text: '와 여기 가게들 다 예쁘다.', characterId: 'jisoo', expression: 'happy' },
      { speaker: '영우', text: '더 록스가 원래 시드니에서 제일 오래된 동네 중 하나야.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '그래서 그런지 골목 느낌이 다르네.', characterId: 'jisoo', expression: 'curious' },
    ],
  },
  'w1rl-topic-exhibition-spot': {
    id: 'w1rl-topic-exhibition-spot',
    characterId: 'youngwoo',
    locationIds: ['w1-the-rocks-lane'],
    phases: ['W1_TOURISM'],
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
  // week1-scene-008/009a에서 이미 스크립트된 반전)을 사건 전에 미리 눈에
  // 익혀두는 역할 — 별도 회수 지점은 없다(그 반전 자체가 이미 존재하는
  // 스토리이므로 이 파일에서 추가로 연결할 게 없음).
  'w1rl-topic-magnet': {
    id: 'w1rl-topic-magnet',
    characterId: 'youngwoo',
    locationIds: ['w1-the-rocks-lane'],
    phases: ['W1_TOURISM'],
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
  'w1ee-topic-outside': {
    id: 'w1ee-topic-outside',
    characterId: 'youngwoo',
    locationIds: ['w1-exhibition-entrance'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '입구에서 둘러보기',
    lines: [
      { speaker: '', text: '작은 팝업 전시장 입구.\n"K-01: 잃어버린 시간들" 이라는 배너가 걸려 있다.', characterId: null },
      { speaker: '지수', text: 'K-01... 뭘까요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '들어가보면 알겠지.', characterId: 'youngwoo', expression: 'neutral' },
    ],
  },
  // 전시장 입구 — Maker's Mark 안내문. 특정 인물을 등장시키지 않고 전시장
  // 자체의 일반 교육용 패널로 처리한다. 마틴 베일 통화(week1-scene-011b)의
  // "의뢰인은 물건 전체보다 하단 각인을 원했다" 반전과, 이미 존재하는
  // evidence-k01-inscription-request(E-C03)/evidence-mk-inscription-focused
  // -inquiries(E-MV5)의 밑밥. 그 반전과 질문(q-w1-request-purpose)은 이미
  // week1-scene-011b에 스크립트돼 있으므로 여기서 새 question은 만들지
  // 않는다 — 순수하게 플레이어가 나중에 스스로 연결짓는 조용한 밑밥.
  'w1ee-topic-provenance': {
    id: 'w1ee-topic-provenance',
    characterId: 'youngwoo',
    locationIds: ['w1-exhibition-entrance'],
    phases: ['W1_TOURISM'],
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

  /* ===== Phase 4 — 용의자 탐문 (§12.6) =====
     Each suspect's *entire* existing interrogation scene (already scripted,
     multi-round, choice-heavy — see dev/dialogueData.js week1Scene006/007/
     008Lines) is treated as one atomic hub interaction rather than being
     decomposed into topics. Decomposing a real interrogation's internal
     round/hint/hypothesis structure into hub topic-state nodes would risk
     breaking flag dependencies inside content this careful; a coarse
     "visit = launch the whole scene" hand-off (type:'minigame', same
     mechanism as the 하버 포토 hand-off) gets the free-order benefit
     spec §12.6 asks for with zero risk to the existing script. */
  // "사전 복선" 패턴의 유일한 회수 사례(선택형) — w1bv-topic-van(Phase 1,
  // 하버브리지)에서 심어둔 flag(discoveredBridgeVan)를 여기서 실제 증거로
  // 바꾼다. 다만 검토 답변서 §2.4 방침대로 "필수 증거"가 아니라 순수 보강
  // 증거로 — unlockConditions에 evidence-service-magnet-missing(레오 사건이
  // 실질적으로 풀린 뒤라는 대용 조건, "E11 레오 업무 채팅 획득 이후"의 대체)
  // 까지 요구해서, 이미 사건 구조를 어느 정도 파악한 뒤에만 이 조각이
  // 맞춰지도록 한다. 광장에 영우 chip을 새로 연 이유(locationDefs.js 참고)가
  // 이 topic 하나 때문이다. 나머지 3개(오페라뷰 크롭/록스골목 자석/전시장입구
  // 안내문)는 순수 flag만 남기고 회수 지점이 없다 — §신규 원칙대로 넷 다 같은
  // 무게로 취급하지 않는다.
  'w1sh-topic-van-recall': {
    id: 'w1sh-topic-van-recall',
    characterId: 'youngwoo',
    locationIds: ['w1-suspect-hub'],
    phases: ['W1_SUSPECT_INTERVIEWS'],
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
  'w1suspect-mina-interview': {
    id: 'w1suspect-mina-interview',
    characterId: 'minah',
    locationIds: ['w1-suspect-mina-spot'],
    phases: ['W1_SUSPECT_INTERVIEWS'],
    type: 'minigame',
    label: '심문하기',
    icon: '🔍',
    route: '/dev/game/?scene=week1-scene-006',
  },
  'w1suspect-adrian-interview': {
    id: 'w1suspect-adrian-interview',
    characterId: 'adrian',
    locationIds: ['w1-suspect-adrian-spot'],
    phases: ['W1_SUSPECT_INTERVIEWS'],
    type: 'minigame',
    label: '심문하기',
    icon: '🔍',
    route: '/dev/game/?scene=week1-scene-007',
  },
  'w1suspect-leo-interview': {
    id: 'w1suspect-leo-interview',
    characterId: 'leo',
    locationIds: ['w1-suspect-leo-spot'],
    phases: ['W1_SUSPECT_INTERVIEWS'],
    type: 'minigame',
    label: '심문하기',
    icon: '🔍',
    route: '/dev/game/?scene=week1-scene-008',
  },

  /* ===== Phase 5 — 모순 재검증 (§12.8) =====
     Same coarse "visit = launch the whole existing scene" hand-off as Phase
     4's suspect interviews — see dev/data/locationDefs.js's w1-reverify-*
     entries for the free-order rationale. */
  'w1reverify-mina-interview': {
    id: 'w1reverify-mina-interview',
    characterId: 'minah',
    locationIds: ['w1-reverify-mina-spot'],
    phases: ['W1_REVERIFICATION'],
    type: 'minigame',
    label: '최종 심문하기',
    icon: '🔍',
    route: '/dev/game/?scene=week1-scene-011',
  },
  'w1reverify-adrian-interview': {
    id: 'w1reverify-adrian-interview',
    characterId: 'adrian',
    locationIds: ['w1-reverify-adrian-spot'],
    phases: ['W1_REVERIFICATION'],
    type: 'minigame',
    label: '재심문하기',
    icon: '🔍',
    route: '/dev/game/?scene=week1-scene-011a',
  },
  'w1reverify-martin-call': {
    id: 'w1reverify-martin-call',
    characterId: 'martin',
    locationIds: ['w1-reverify-martin-spot'],
    phases: ['W1_REVERIFICATION'],
    type: 'minigame',
    label: '전화 걸기',
    icon: '📞',
    route: '/dev/game/?scene=week1-scene-011b',
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
  {
    characterId: 'minah', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-mina-illegal-photo', result: 'correct',
    reactionText: '윤민아: "...그거 이미 말씀드렸잖아요. 또 그 얘기예요?"',
  },
  {
    characterId: 'minah', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-mina-photo-timestamps', result: 'partial',
    reactionText: '윤민아: "그 시간에 사진 찍고 있었던 건 맞는데... 그게 왜요?"',
  },
  {
    characterId: 'minah', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-staff-tag-position-after', result: 'interesting',
    reactionText: '윤민아: "태그요? 그런 건 관심 없었는데... 직원들이나 아는 거 아니에요?"',
  },
  {
    characterId: 'adrian', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-adrian-sender', result: 'correct',
    reactionText: '애드리언: "...그 계정, 어디서 찾으셨죠." (표정이 굳는다)',
  },
  {
    characterId: 'adrian', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-adrian-inquiry', result: 'partial',
    reactionText: '애드리언: "문의 메일이야 저 아니어도 여러 사람이 보냈을 텐데요."',
  },
  {
    characterId: 'adrian', phase: 'W1_REVERIFICATION', evidenceId: 'evidence-mina-illegal-photo', result: 'blocked',
    reactionText: '애드리언: "그건 제가 아니라 그쪽 여성분 얘기 아닌가요? 저랑 무슨 상관이죠?"',
  },
];
const defaultPresentReaction = { result: 'wrong', reactionText: '음... 이게 지금 왜 필요한지는 잘 모르겠는데.' };

// 1주차 Phase 1의 "필수 조사" 체크리스트(§10.2) — 관광 파트는 조사가 아니라
// 자유도 중심이라 필수 fact는 없지만, §12.2의 전시장 진입 제안 조건(관광
// 장소 2곳 이상 방문 또는 특정 인터랙션 완료)은 여기서 표현해 둔다. 실제
// "제안" UI(소프트 게이트, §10.3)는 아직 dev/explore/index.html에 연결하지
// 않음 — 후속 작업.
const phaseGoals = {
  W1_TOURISM: {
    requiredFactIds: [],
    suggestNextConditions: [
      { type: 'visitedLocationsAtLeast', count: 2 },
      { type: 'completedInteraction', id: 'w1rl-topic-exhibition-spot' },
    ],
  },
};
