/* 영우 테스트 — scenario bank for /dev/youngwoo-test. Each entry is a
   situation with 4 plausible reactions that get RANKED (not single-picked) —
   see the page's UI: tapping options in order assigns them rank 1~4 in tap
   order, so every option ends up scored relative to the others instead of
   just picking one "best" answer. There's no correct order here, this is
   just raw preference data (which reaction the real 영우 ranks higher) to
   reference later when designing the affection/choice system's response
   logic. Answers are stored separately
   (AssetDB.getYoungwooTestAnswers/setYoungwooTestAnswer), keyed by each
   scenario's `id` — don't reuse/change an existing id, or its saved answer
   becomes orphaned. Every scenario must have exactly 4 options — the ranking
   UI assumes it. */
const youngwooTestScenarios = [
  // ===== 연애/썸 =====
  {
    id: 'late-text',
    situation: '약속 시간에 30분째 연락도 없이 늦고 있는데, 방금 "미안 지금 출발!" 문자가 왔어요. 마음에 드는 순서대로 매겨보세요.',
    options: [
      { id: 'a', label: '"괜찮아, 천천히 와" 하고 웃으며 넘긴다' },
      { id: 'b', label: '"무슨 일 있었어? 걱정했잖아" 하고 이유부터 묻는다' },
      { id: 'c', label: '"많이 늦었네ㅋㅋ 벌칙 각오해" 장난스럽게 받아친다' },
      { id: 'd', label: '"좀 서운하긴 하다" 솔직하게 티를 낸다' },
    ],
  },
  {
    id: 'compliment',
    situation: '상대가 갑자기 "오늘따라 좀 멋있어 보이는데?" 라고 진지하게 말해요.',
    options: [
      { id: 'a', label: '부끄러워서 화제를 돌린다' },
      { id: 'b', label: '"그치? 나도 알아" 능청스럽게 받는다' },
      { id: 'c', label: '고맙다고 담백하게 말한다' },
      { id: 'd', label: '"갑자기 왜?" 하고 의심스럽게 되묻는다' },
    ],
  },
  {
    id: 'silent-mood',
    situation: '평소와 달리 말수가 줄고 표정이 안 좋은 상대. 먼저 다가간다면?',
    options: [
      { id: 'a', label: '"무슨 일 있어?" 바로 직설적으로 묻는다' },
      { id: 'b', label: '옆에 조용히 있어주며 때를 기다린다' },
      { id: 'c', label: '분위기를 풀려고 농담을 건다' },
      { id: 'd', label: '일단 모른 척하고 나중에 따로 물어본다' },
    ],
  },
  {
    id: 'disagreement',
    situation: '사소한 일(저녁 메뉴, 약속 계획 등)로 의견이 갈렸어요.',
    options: [
      { id: 'a', label: '내 의견을 명확히 얘기하고 설득하려 한다' },
      { id: 'b', label: '상대 의견에 맞춰준다' },
      { id: 'c', label: '반반 섞은 대안을 제시한다' },
      { id: 'd', label: '그냥 넘어가고 나중에 다시 얘기한다' },
    ],
  },
  {
    id: 'gift',
    situation: '예상 못한 선물을 받았어요.',
    options: [
      { id: 'a', label: '바로 크게 좋아하며 표현한다' },
      { id: 'b', label: '"이런 거 안 해도 되는데" 하면서도 좋아한다' },
      { id: 'c', label: '답례로 뭘 해줄지부터 고민한다' },
      { id: 'd', label: '왜 준 건지 이유를 먼저 궁금해한다' },
    ],
  },
  {
    id: 'jealousy',
    situation: '상대가 다른 이성 얘기를 아무렇지 않게 꺼내요.',
    options: [
      { id: 'a', label: '별생각 없이 넘긴다' },
      { id: 'b', label: '티는 안 내지만 속으로 신경 쓰인다' },
      { id: 'c', label: '"그 사람 누군데?" 하고 바로 물어본다' },
      { id: 'd', label: '장난스럽게 질투하는 척 놀린다' },
    ],
  },
  {
    id: 'first-love',
    situation: '처음으로 "좋아해" 라는 말을 들었어요.',
    options: [
      { id: 'a', label: '바로 같은 마음을 표현한다' },
      { id: 'b', label: '당황해서 말을 얼버무린다' },
      { id: 'c', label: '장난처럼 받아치며 진심을 숨긴다' },
      { id: 'd', label: '시간을 달라고 하고 진지하게 생각해본다' },
    ],
  },
  {
    id: 'apology',
    situation: '상대가 실수로 나를 서운하게 했다가 사과해요.',
    options: [
      { id: 'a', label: '바로 괜찮다고 풀어준다' },
      { id: 'b', label: '왜 그랬는지 설명을 들어야 풀린다' },
      { id: 'c', label: '시간이 좀 지나야 자연스럽게 풀린다' },
      { id: 'd', label: '"다음부턴 조심해" 하고 짧게 넘어간다' },
    ],
  },
  {
    id: 'skinship',
    situation: '사람들 앞에서 스킨십(손잡기, 팔짱 등)을 하게 됐어요.',
    options: [
      { id: 'a', label: '전혀 상관없다, 오히려 먼저 한다' },
      { id: 'b', label: '둘만 있을 땐 괜찮지만 남들 앞에선 어색하다' },
      { id: 'c', label: '상대가 먼저 하면 맞춰준다' },
      { id: 'd', label: '사람 많은 곳에서는 좀 부담스럽다' },
    ],
  },
  {
    id: 'plan-style',
    situation: '데이트 계획을 짤 때 나는?',
    options: [
      { id: 'a', label: '미리 다 정해두는 걸 좋아한다' },
      { id: 'b', label: '그때그때 즉흥적으로 정하는 게 좋다' },
      { id: 'c', label: '상대가 정하면 따라가는 편이다' },
      { id: 'd', label: '큰 틀만 정하고 세부는 즉흥적으로' },
    ],
  },
  {
    id: 'crying',
    situation: '상대가 눈물을 보여요.',
    options: [
      { id: 'a', label: '바로 안아주며 위로한다' },
      { id: 'b', label: '왜 우는지부터 차분히 묻는다' },
      { id: 'c', label: '말없이 옆에 있어준다' },
      { id: 'd', label: '당황해서 어쩔 줄 몰라 한다' },
    ],
  },
  {
    id: 'text-speed',
    situation: '상대의 답장이 평소보다 많이 느려요.',
    options: [
      { id: 'a', label: '별생각 없이 기다린다' },
      { id: 'b', label: '무슨 일 있나 싶어 신경이 쓰인다' },
      { id: 'c', label: '"바빠?" 하고 먼저 연락해본다' },
      { id: 'd', label: '서운하지만 티는 안 낸다' },
    ],
  },
  {
    id: 'honest-opinion',
    situation: '상대가 "나 오늘 좀 별로지?" 라고 물어봐요 (사실 좀 그렇다).',
    options: [
      { id: 'a', label: '솔직하게 말해준다' },
      { id: 'b', label: '좋은 점만 골라서 말해준다' },
      { id: 'c', label: '"무슨 소리야, 예뻐" 하고 다독인다' },
      { id: 'd', label: '대답을 얼버무리며 화제를 돌린다' },
    ],
  },
  {
    id: 'future-talk',
    situation: '먼 미래 얘기(결혼, 장기 계획 등)가 나왔어요.',
    options: [
      { id: 'a', label: '진지하게 구체적으로 얘기하고 싶어한다' },
      { id: 'b', label: '아직 이르다고 생각해서 피하고 싶다' },
      { id: 'c', label: '가볍게 웃으며 넘기지만 속으로는 생각한다' },
      { id: 'd', label: '상대가 어떻게 생각하는지부터 궁금하다' },
    ],
  },

  // ===== 우정 =====
  {
    id: 'friend-vanish',
    situation: '친구가 며칠째 연락도 없이 잠수를 탔다가 아무 일 없었다는 듯 연락이 왔어요.',
    options: [
      { id: 'a', label: '"무슨 일 있었어?" 걱정부터 한다' },
      { id: 'b', label: '"너 잠수 타는 거 진짜 못 참겠다" 하고 서운함을 표현한다' },
      { id: 'c', label: '별일 아닌 듯 평소처럼 대한다' },
      { id: 'd', label: '이유를 캐묻지 않고 그냥 넘긴다' },
    ],
  },
  {
    id: 'friend-vs-plan',
    situation: '애인과 약속이 있었는데 친구가 급하게 도움을 요청해요.',
    options: [
      { id: 'a', label: '애인에게 양해를 구하고 친구를 도우러 간다' },
      { id: 'b', label: '애인과의 약속을 지키고 친구에게는 다음에 도와주겠다고 한다' },
      { id: 'c', label: '둘 다 만족시킬 방법을 찾아본다 (짧게 도와주고 이동 등)' },
      { id: 'd', label: '애인에게 먼저 상황을 설명하고 같이 결정한다' },
    ],
  },
  {
    id: 'group-chat-fight',
    situation: '단체 채팅방에서 의견 충돌이 났어요.',
    options: [
      { id: 'a', label: '적극적으로 내 의견을 말하고 논쟁에 참여한다' },
      { id: 'b', label: '중재하려고 나선다' },
      { id: 'c', label: '조용히 지켜보며 끼어들지 않는다' },
      { id: 'd', label: '나중에 당사자에게 개인적으로 연락해서 얘기한다' },
    ],
  },

  // ===== 가족 =====
  {
    id: 'family-nagging',
    situation: '부모님이 사생활(연애, 진로 등)에 대해 잔소리를 하세요.',
    options: [
      { id: 'a', label: '솔직하게 내 생각을 말하고 부딪힌다' },
      { id: 'b', label: '일단 "네네" 하고 넘긴다' },
      { id: 'c', label: '화제를 슬쩍 돌린다' },
      { id: 'd', label: '차분히 설명하며 이해시키려 한다' },
    ],
  },
  {
    id: 'family-gathering',
    situation: '가족 모임이나 명절에 참석하는 게 나는?',
    options: [
      { id: 'a', label: '즐겁고 기대된다' },
      { id: 'b', label: '의무감으로 참석한다' },
      { id: 'c', label: '부담스럽고 피하고 싶다' },
      { id: 'd', label: '누가 오는지에 따라 다르다' },
    ],
  },

  // ===== 직장/학업 =====
  {
    id: 'boss-unreasonable',
    situation: '상사(선생님)가 무리한 요구를 해요.',
    options: [
      { id: 'a', label: '바로 문제 제기하며 이의를 표한다' },
      { id: 'b', label: '일단 알겠다고 하고 나중에 방법을 찾는다' },
      { id: 'c', label: '스트레스 받지만 묵묵히 해낸다' },
      { id: 'd', label: '동료/친구에게 하소연하며 푼다' },
    ],
  },
  {
    id: 'teamwork-freeload',
    situation: '팀 프로젝트에서 한 명이 계속 일을 안 해요.',
    options: [
      { id: 'a', label: '직접 얘기해서 역할을 나눈다' },
      { id: 'b', label: '그냥 내가 더 맡아서 끝낸다' },
      { id: 'c', label: '다른 팀원들과 같이 문제 제기한다' },
      { id: 'd', label: '평가에 반영되게 기록해두고 넘긴다' },
    ],
  },
  {
    id: 'mistake-at-work',
    situation: '일/과제에서 큰 실수를 했어요.',
    options: [
      { id: 'a', label: '바로 인정하고 사과한 뒤 수습한다' },
      { id: 'b', label: '혼자 조용히 고치려고 한다' },
      { id: 'c', label: '왜 그렇게 됐는지부터 원인을 분석한다' },
      { id: 'd', label: '자책하며 한동안 신경 쓴다' },
    ],
  },
  {
    id: 'praised',
    situation: '다른 사람들 앞에서 갑자기 칭찬을 받았어요.',
    options: [
      { id: 'a', label: '당당하게 받아들인다' },
      { id: 'b', label: '겸손하게 손사래치며 낮춘다' },
      { id: 'c', label: '같이 한 사람들 덕분이라고 돌린다' },
      { id: 'd', label: '민망해서 빨리 화제를 넘긴다' },
    ],
  },

  // ===== 갈등/위기 =====
  {
    id: 'stranger-conflict',
    situation: '낯선 사람과 사소한 시비가 붙었어요 (새치기, 부딪힘 등).',
    options: [
      { id: 'a', label: '바로 할 말은 한다' },
      { id: 'b', label: '그냥 참고 넘어간다' },
      { id: 'c', label: '정중하지만 확실하게 짚고 넘어간다' },
      { id: 'd', label: '상황을 피해서 자리를 뜬다' },
    ],
  },
  {
    id: 'failure',
    situation: '열심히 준비한 일에서 실패했어요.',
    options: [
      { id: 'a', label: '바로 털어내고 다음을 준비한다' },
      { id: 'b', label: '한동안 곱씹으며 힘들어한다' },
      { id: 'c', label: '왜 실패했는지 원인부터 분석한다' },
      { id: 'd', label: '주변 사람들에게 털어놓고 위로받는다' },
    ],
  },

  // ===== 여가/가치관 =====
  {
    id: 'weekend-style',
    situation: '아무 계획 없는 주말이 생겼어요.',
    options: [
      { id: 'a', label: '집에서 혼자 쉬는 게 제일 좋다' },
      { id: 'b', label: '누군가를 만나서 시간을 보내고 싶다' },
      { id: 'c', label: '즉흥적으로 어딘가 나간다' },
      { id: 'd', label: '밀린 할 일이나 자기계발을 한다' },
    ],
  },
  {
    id: 'stress-relief',
    situation: '스트레스를 풀 때 나는?',
    options: [
      { id: 'a', label: '몸을 움직인다 (운동, 산책 등)' },
      { id: 'b', label: '누군가에게 털어놓고 얘기한다' },
      { id: 'c', label: '혼자 조용히 시간을 보낸다' },
      { id: 'd', label: '다른 데 몰입해서 잊는다 (게임, 취미 등)' },
    ],
  },
  {
    id: 'new-challenge',
    situation: '새롭고 낯선 도전(이사, 새 일, 새 사람 등)이 생겼어요.',
    options: [
      { id: 'a', label: '설레고 적극적으로 뛰어든다' },
      { id: 'b', label: '신중하게 계획부터 세운다' },
      { id: 'c', label: '일단 불안하지만 해본다' },
      { id: 'd', label: '주변에 조언을 구하고 나서 결정한다' },
    ],
  },
  {
    id: 'spending-style',
    situation: '돈을 쓸 때 나는?',
    options: [
      { id: 'a', label: '하고 싶은 건 일단 하고 본다' },
      { id: 'b', label: '필요한 것 위주로 계획적으로 쓴다' },
      { id: 'c', label: '아끼다가 가끔 크게 지른다' },
      { id: 'd', label: '남을 위해 쓰는 게 더 좋다' },
    ],
  },
  {
    id: 'honesty-vs-comfort',
    situation: '솔직함과 배려 중 고르라면 나는?',
    options: [
      { id: 'a', label: '불편해도 솔직한 게 낫다고 생각한다' },
      { id: 'b', label: '상황에 따라 다르게 판단한다' },
      { id: 'c', label: '배려가 우선이라고 생각한다' },
      { id: 'd', label: '굳이 말 안 해도 될 건 넘어간다' },
    ],
  },
];
