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
   yet by design (§12.2 — sightseeing is free-form). */

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
};

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
