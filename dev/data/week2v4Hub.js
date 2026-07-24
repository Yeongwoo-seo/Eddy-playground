// 2주차 v4 재설계 — 탐색허브(Phase 1 관광 자유 탐색)에 새로 필요한 상호작용.
// dev/week2/redesign/hub/에서 읽는다.
//
// v4에서 허브 내비게이션 구조(장소/이동) 자체는 바뀌지 않는다 — 서큘러키·
// 오페라하우스·하버브리지·더 록스 골목·더 록스 옷가게·전시장 입구, 6개
// 장소는 실제 dev/data/locationDefs.js를 그대로 재사용한다. 바뀌는 건 그
// 장소들에서 벌어지는 "내용"뿐이라, 여기서는 그 장소 위에 새로 얹을
// 상호작용(topic) 아이디어와 설계 프롬프트만 관리한다.
//
// 실제 interactionDefs.js에 반영할 땐 반드시 새 phase id(예: 'W2_TOURISM_V4')를
// 써서 실서비스 중인 'W2_TOURISM' 허브에는 노출되지 않게 한다 — 이미 실제로
// 존재하는 인물 소개(소피/클레어/윤민아/애드리언/레오, Ch4)는 허브가 아니라
// 전시장 진입 직후 선형 씬(week2-scene-003)에서 처리되므로 여기 목록에는
// 없다.
const week2v4HubTopics = [
  {
    id: 'hub-rocks-lane-lockers', locationId: 'w2-the-rocks-lane', locationName: '더 록스 골목',
    relatedChapter: 'Ch3. 더 록스, 보관함을 익히다',
    name: '다니엘, 분실물 돕기',
    purpose: '다니엘이 관광객의 분실 가방을 도와 카페 임시 보관함 사용법을 익히는 모습을 지수·영우가 옆에서 목격하는 신규 상호작용. 다니엘의 두 번째 긍정적 관계 형성(②)이자, 이후 회수 단계 복선.',
    characters: ['지수', '영우', '다니엘', '(지나가는 관광객 NPC)'],
    previewHref: '/play/explore/?phase=W2_TOURISM&location=w2-the-rocks-lane',
  },
  {
    id: 'hub-exhibition-group-photo', locationId: 'w2-exhibition-entrance', locationName: '빈티지 전시장 입구',
    relatedChapter: 'Ch6. 단체사진, 평범한 배경',
    name: '단체사진, 자리 배치',
    purpose: '전시장에 들어가기 직전, 다니엘이 관광객 무리의 단체사진 위치를 세밀하게 조정하는 신규 상호작용. 다니엘의 세 번째 긍정 관계 장면(③)이자, 반전 4(입구 시야를 가리는 군중 배치)의 복선.',
    characters: ['지수', '영우', '다니엘', '레오', '관광객 무리(NPC)'],
    previewHref: '/play/explore/?phase=W2_TOURISM&location=w2-exhibition-entrance',
  },
];

function buildWeek2v4HubPrompt(topic) {
  const lines = [];
  lines.push(`너는 "The Missing Key" 비주얼노벨의 탐색허브(dev/data/interactionDefs.js) 콘텐츠 작가야.`);
  lines.push(`아래 상호작용(topic)을 interactionDefs.js에 등록할 수 있는 형태로 새로 써줘 — { speaker, text, characterId, expression } 라인 배열, 필요하면 choice 포함.`);
  lines.push('');
  lines.push(`# 상호작용: ${topic.name}`);
  lines.push(`- 장소: ${topic.locationName} (locationId: ${topic.locationId})`);
  lines.push(`- 관련 챕터: ${topic.relatedChapter}`);
  lines.push(`- 등장인물: ${topic.characters.join(', ')}`);
  lines.push(`- 목적: ${topic.purpose}`);
  lines.push('');
  lines.push('# 준수 사항');
  lines.push('- 3~6줄 내외로 짧게 — 탐색허브의 다른 상호작용들과 분량을 맞춘다.');
  lines.push('- 실제 반영 시에는 새 phase id(예: W2_TOURISM_V4)를 써서 실서비스 중인 W2_TOURISM 허브와 분리한다.');
  lines.push('- 전체 설계 맥락은 docs/week2-storyline-outline-v4.md 를 참고한다.');
  lines.push('- 다니엘은 이 시점에 절대 수상하게 보이면 안 된다 — 나중에 다시 읽었을 때만 의미가 달라지는 자연스러운 행동으로 쓴다.');
  return lines.join('\n');
}
