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
// 아래는 빈 배열이다 — 항목을 추가할 땐 이 양식을 그대로 따른다:
// {
//   id: 'hub-example', locationId: 'w2-example', locationName: '장소 이름',
//   relatedChapter: 'Ch0. 챕터 제목',
//   name: '상호작용 이름',
//   purpose: '이 상호작용의 목적 (관계 형성 단계·복선 등)',
//   characters: ['지수', '영우', '...'],
//   previewHref: '/play/explore/?phase=W2_TOURISM&location=w2-example',
// },
const week2v4HubTopics = [];

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
