// 2주차 v4 재설계 — 장소별 배경 이미지 프롬프트 데이터.
// dev/week2/redesign/locations/index.html 에서 읽는다.
//
// `hubLocationId`가 있는 항목은 dev/data/locationDefs.js에 이미 등록된 실제
// 허브 장소(서큘러키/더 록스 골목/전시장 입구 — v4에서도 물리적으로 같은
// 곳)라서 realVisualBrief를 그대로 가져와 재사용한다. `hubLocationId`가
// 없는 항목(전시장 내부·카페·숙소)은 허브가 아니라 씬 전용(legacy) 배경이라
// 아래 anchorSceneId(week2v4Scenes.js에 등록된 v4 씬)로만 업로드를 연결한다.
//
// 아래는 빈 배열이다 — 항목을 추가할 땐 이 양식을 그대로 따른다:
// {
//   id: 'loc-example', hubLocationId: 'w2-example' /* 또는 씬 전용이면 null */, name: '장소 이름',
//   realVisualBrief: '기본 묘사 (허브 장소면 locationDefs.js의 visualBrief를 그대로 가져온다)',
//   v4Note: 'v4 재설계에서 이 장소가 어떻게 쓰이는지',
//   appearsIn: ['Ch0. 챕터 제목'],
//   anchorSceneId: 'week2v4-chNN',
// },
const week2v4Locations = [];

function buildWeek2v4LocationPrompt(loc) {
  const lines = [];
  lines.push(`아래 장소의 배경 일러스트 생성을 위한 프롬프트야. "The Missing Key" 비주얼노벨의 기존 배경 아트 스타일(반사실적 채색 일러스트, 인물 없는 순수 배경)에 맞춰줘.`);
  lines.push('');
  lines.push(`# 장소: ${loc.name}`);
  lines.push(`- 기본 묘사: ${loc.realVisualBrief}`);
  lines.push(`- v4 재설계에서의 쓰임: ${loc.v4Note}`);
  lines.push(`- 등장 챕터: ${loc.appearsIn.join(', ')}`);
  lines.push('');
  lines.push('# 준수 사항');
  lines.push('- 인물은 그리지 않는다(배경 전용, 캐릭터는 별도 레이어).');
  lines.push('- 가로형 16:9~4:3 구도, 모바일 비주얼노벨 배경으로 쓸 수 있게 상하 여백을 충분히 둔다.');
  lines.push('- 기존 등록된 다른 배경들과 톤(채도·조명 스타일)을 맞춘다.');
  return lines.join('\n');
}
