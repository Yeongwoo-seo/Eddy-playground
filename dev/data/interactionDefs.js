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

   "사전 복선" 패턴 (아래 w1ov-topic-lookout 근처 주석 참고) — 사건이 아직
   일어나지 않은 자유 탐색 구간에서 addQuestion만으로 의문점을 미리 심어
   두는 재사용 가능한 관례. 1주차 전용이 아니라 이 파일/explorationState.js
   구조 자체가 범용이므로, 다음 주차에서 같은 성격의 구간을 쓸 때도 그대로
   따라 쓰면 된다. */

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
  // ===== "사전 복선" 패턴 (1주차 장편 확장 v3에서 처음 도입, §신규) =====
  // 재사용 가능한 일반 패턴 — 특정 사건이 아직 일어나지 않은 자유 탐색
  // 단계(Phase)의 관광/탐색 장소마다 "왜?"로 끝나는 의문점을 하나씩 심어
  // 둔다. 이 시점엔 사건 자체가 없어서 addFact/addEvidence가 아니라
  // addQuestion만 쓴다(§22 idiom) — 나중에 실제 증거로 바뀌는 연결은 별도
  // 씬의 setQuestionStatus+addEvidence+linkEvidenceToQuestion으로 다룬다
  // (아래 4개는 아직 그 연결까지는 없음 — 후속 작업). 지수/영우 둘 다
  // "이상한데?" 선에서 멈추고 결론을 내리지 않는다 — 아직 뭘 의심해야 할지도
  // 모르는 시점이므로. 다음 주차들도 사건 발생 전 자유 탐색 구간이 있다면
  // 이 패턴(topic 상호작용 + addQuestion 효과, id는 'w2-'/'w3-'/'w4-' 등
  // 해당 주차 프리픽스)을 그대로 따라 쓰면 된다 — 1주차 전용 메커니즘이
  // 아니라 interactionDefs.js/explorationState.js 어디에도 주차 하드코딩이
  // 없는 범용 구조다.
  'w1ov-topic-lookout': {
    id: 'w1ov-topic-lookout',
    characterId: 'youngwoo',
    locationIds: ['w1-opera-view'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '이상한 사진사 발견하기',
    lines: [
      { speaker: '지수', text: '어? 저 사람 좀 이상하지 않아요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '누구?', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '저기, 오페라하우스는 안 찍고 계속 반대쪽만 찍고 있어요.', characterId: 'jisoo', expression: 'curious' },
      { speaker: '', text: '남자는 카메라를 든 채, 더 록스 방향을 향해 셔터를 몇 번이고 눌렀다.', characterId: null },
      { speaker: '영우', text: '관광객 아니야? 근데 좀... 유난히 오래 서 있긴 하네.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '그러게요. 뭘 저렇게 열심히 찍는 거지?', characterId: 'jisoo', expression: 'suspicious' },
    ],
    effects: [{
      type: 'addQuestion',
      question: {
        id: 'question-w1-opera-lookout',
        title: '그 사람은 왜 계속 반대쪽만 찍고 있었을까?',
        description: '오페라하우스 전망 구역에서, 낯선 남자가 오페라하우스가 아니라 더 록스 방향을 계속 촬영하고 있었다.',
        linkedEvidenceIds: [],
      },
    }],
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
  // §신규 Phase 1 사전 복선 — w1ov-topic-lookout 참고.
  'w1bv-topic-van': {
    id: 'w1bv-topic-van',
    characterId: 'youngwoo',
    locationIds: ['w1-bridge-view'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '수상한 밴 발견하기',
    lines: [
      { speaker: '영우', text: '어, 저 차 좀 봐봐.', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '차요?', characterId: 'jisoo', expression: 'neutral' },
      { speaker: '', text: '인도 옆에 시동을 켠 채 오래 서 있는 검은색 밴 한 대. 창문에는 짙은 선팅이 되어 있다.', characterId: null },
      { speaker: '지수', text: '주차한 것도 아니고... 계속 저러고 있네요.', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '영우', text: '택배 차 아니야?', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '지수', text: '글쎄요... 그럼 왜 계속 시동을 켜 놓고 있을까요?', characterId: 'jisoo', expression: 'curious' },
    ],
    effects: [{
      type: 'addQuestion',
      question: {
        id: 'question-w1-bridge-van',
        title: '그 검은 밴은 왜 계속 시동을 켠 채 서 있었을까?',
        description: '하버브리지 전망 구역 인도 옆에, 짙게 선팅된 검은색 밴이 시동을 켠 채 오래 정차해 있었다.',
        linkedEvidenceIds: [],
      },
    }],
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
  // §신규 Phase 1 사전 복선 — w1ov-topic-lookout 참고.
  'w1rl-topic-backdoor': {
    id: 'w1rl-topic-backdoor',
    characterId: 'youngwoo',
    locationIds: ['w1-the-rocks-lane'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '뒷문 앞 남자 발견하기',
    lines: [
      { speaker: '지수', text: '어? 저기 저 문, 팝업 전시장 건물 뒤쪽 아니에요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '어, 맞는 것 같은데.', characterId: 'youngwoo', expression: 'neutral' },
      { speaker: '', text: '살짝 열린 뒷문 앞에, 낯선 남자가 담배를 피우며 서 있다. 직원처럼 보이지는 않는다.', characterId: null },
      { speaker: '영우', text: '저 사람은 뭐지? 직원인가?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '지수', text: '글쎄요, 그런 것치곤 옷차림이 좀...', characterId: 'jisoo', expression: 'suspicious' },
      { speaker: '', text: '두 사람의 시선을 느꼈는지, 남자는 슬쩍 뒷문 안쪽으로 들어가 버렸다.', characterId: null },
    ],
    effects: [{
      type: 'addQuestion',
      question: {
        id: 'question-w1-rocks-backdoor',
        title: '그 남자는 왜 전시장 뒷문 앞에 서 있었을까?',
        description: '더 록스 골목, 팝업 전시장 건물의 뒷문이 살짝 열려 있었고 그 앞에 직원처럼 보이지 않는 남자가 서 있었다.',
        linkedEvidenceIds: [],
      },
    }],
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
  // §신규 Phase 1 사전 복선 — w1ov-topic-lookout 참고.
  'w1ee-topic-whisper': {
    id: 'w1ee-topic-whisper',
    characterId: 'youngwoo',
    locationIds: ['w1-exhibition-entrance'],
    phases: ['W1_TOURISM'],
    type: 'topic',
    label: '입구에서 들은 대화',
    lines: [
      { speaker: '', text: '입구 앞에서, 직원처럼 보이는 사람이 낯선 사람과 낮은 목소리로 이야기하고 있다.', characterId: null },
      { speaker: '지수', text: '저 두 분, 뭔가 심각해 보이는데요?', characterId: 'jisoo', expression: 'curious' },
      { speaker: '영우', text: '그러게. 무슨 얘기지?', characterId: 'youngwoo', expression: 'curious' },
      { speaker: '', text: '두 사람의 시선을 느낀 순간, 대화가 뚝 끊겼다. 낯선 쪽은 곧장 자리를 떴다.', characterId: null },
      { speaker: '영우', text: '...\n그냥 지나가자.', characterId: 'youngwoo', expression: 'blank', pauseBeforeMs: 300 },
      { speaker: '지수', text: '네... 근데 좀 이상하긴 했어요.', characterId: 'jisoo', expression: 'suspicious' },
    ],
    effects: [{
      type: 'addQuestion',
      question: {
        id: 'question-w1-entrance-whisper',
        title: '직원과 낯선 사람은 무슨 얘기를 하고 있었을까?',
        description: '전시장 입구에서, 직원으로 보이는 사람이 낯선 사람과 낮은 목소리로 이야기하다가 갑자기 대화를 멈추는 모습을 목격했다.',
        linkedEvidenceIds: [],
      },
    }],
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
