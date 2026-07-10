/* 영우 테스트 — scenario bank for /dev/youngwoo-test. Each entry is a
   dating-sim-style situation with a handful of plausible reactions; there's
   no "correct" option or scoring here, this is just raw preference data
   (which reaction actually matches how the real 영우 responds) to reference
   later when designing the affection/choice system's response logic. Answers
   are stored separately (AssetDB.getYoungwooTestAnswers/setYoungwooTestAnswer),
   keyed by each scenario's `id` — don't reuse/change an existing id, or its
   saved answer becomes orphaned. */
const youngwooTestScenarios = [
  {
    id: 'late-text',
    situation: '약속 시간에 30분째 연락도 없이 늦고 있는데, 방금 "미안 지금 출발!" 문자가 왔어요. 뭐라고 답할 것 같아요?',
    options: [
      { id: 'a', label: '"괜찮아, 천천히 와" 하고 웃으며 넘긴다' },
      { id: 'b', label: '"무슨 일 있었어? 걱정했잖아" 하고 이유부터 묻는다' },
      { id: 'c', label: '"많이 늦었네ㅋㅋ 벌칙 각오해" 장난스럽게 받아친다' },
      { id: 'd', label: '"좀 서운하긴 하다" 솔직하게 티를 낸다' },
    ],
  },
  {
    id: 'compliment',
    situation: '상대가 갑자기 "오늘따라 좀 멋있어 보이는데?" 라고 진지하게 말해요. 반응은?',
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
    situation: '사소한 일(저녁 메뉴, 약속 계획 등)로 의견이 갈렸어요. 이럴 때 나는?',
    options: [
      { id: 'a', label: '내 의견을 명확히 얘기하고 설득하려 한다' },
      { id: 'b', label: '상대 의견에 맞춰준다' },
      { id: 'c', label: '반반 섞은 대안을 제시한다' },
      { id: 'd', label: '그냥 넘어가고 나중에 다시 얘기한다' },
    ],
  },
  {
    id: 'gift',
    situation: '예상 못한 선물을 받았어요. 반응은?',
    options: [
      { id: 'a', label: '바로 크게 좋아하며 표현한다' },
      { id: 'b', label: '"이런 거 안 해도 되는데" 하면서도 좋아한다' },
      { id: 'c', label: '답례로 뭘 해줄지부터 고민한다' },
      { id: 'd', label: '왜 준 건지 이유를 먼저 궁금해한다' },
    ],
  },
  {
    id: 'jealousy',
    situation: '상대가 다른 이성 얘기를 아무렇지 않게 꺼내요. 내 반응은?',
    options: [
      { id: 'a', label: '별생각 없이 넘긴다' },
      { id: 'b', label: '티는 안 내지만 속으로 신경 쓰인다' },
      { id: 'c', label: '"그 사람 누군데?" 하고 바로 물어본다' },
      { id: 'd', label: '장난스럽게 질투하는 척 놀린다' },
    ],
  },
  {
    id: 'first-love',
    situation: '처음으로 "좋아해" 라는 말을 들었어요. 반응은?',
    options: [
      { id: 'a', label: '바로 같은 마음을 표현한다' },
      { id: 'b', label: '당황해서 말을 얼버무린다' },
      { id: 'c', label: '장난처럼 받아치며 진심을 숨긴다' },
      { id: 'd', label: '시간을 달라고 하고 진지하게 생각해본다' },
    ],
  },
  {
    id: 'apology',
    situation: '상대가 실수로 나를 서운하게 했다가 사과해요. 나는?',
    options: [
      { id: 'a', label: '바로 괜찮다고 풀어준다' },
      { id: 'b', label: '왜 그랬는지 설명을 들어야 풀린다' },
      { id: 'c', label: '시간이 좀 지나야 자연스럽게 풀린다' },
      { id: 'd', label: '"다음부턴 조심해" 하고 짧게 넘어간다' },
    ],
  },
  {
    id: 'skinship',
    situation: '사람들 앞에서 스킨십(손잡기, 팔짱 등)을 하게 됐어요. 나는?',
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
    situation: '상대가 눈물을 보여요. 나는?',
    options: [
      { id: 'a', label: '바로 안아주며 위로한다' },
      { id: 'b', label: '왜 우는지부터 차분히 묻는다' },
      { id: 'c', label: '말없이 옆에 있어준다' },
      { id: 'd', label: '당황해서 어쩔 줄 몰라 한다' },
    ],
  },
  {
    id: 'text-speed',
    situation: '상대의 답장이 평소보다 많이 느려요. 나는?',
    options: [
      { id: 'a', label: '별생각 없이 기다린다' },
      { id: 'b', label: '무슨 일 있나 싶어 신경이 쓰인다' },
      { id: 'c', label: '"바빠?" 하고 먼저 연락해본다' },
      { id: 'd', label: '서운하지만 티는 안 낸다' },
    ],
  },
  {
    id: 'honest-opinion',
    situation: '상대가 "나 오늘 좀 별로지?" 라고 물어봐요 (사실 좀 그렇다). 나는?',
    options: [
      { id: 'a', label: '솔직하게 말해준다' },
      { id: 'b', label: '좋은 점만 골라서 말해준다' },
      { id: 'c', label: '"무슨 소리야, 예뻐" 하고 다독인다' },
      { id: 'd', label: '대답을 얼버무리며 화제를 돌린다' },
    ],
  },
  {
    id: 'future-talk',
    situation: '먼 미래 얘기(결혼, 장기 계획 등)가 나왔어요. 나는?',
    options: [
      { id: 'a', label: '진지하게 구체적으로 얘기하고 싶어한다' },
      { id: 'b', label: '아직 이르다고 생각해서 피하고 싶다' },
      { id: 'c', label: '가볍게 웃으며 넘기지만 속으로는 생각한다' },
      { id: 'd', label: '상대가 어떻게 생각하는지부터 궁금하다' },
    ],
  },
];
