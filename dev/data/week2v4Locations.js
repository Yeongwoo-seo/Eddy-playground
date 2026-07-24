// 2주차 v4 재설계 — 장소별 배경 이미지 프롬프트 데이터.
// dev/week2/redesign/locations/index.html 에서 읽는다.
//
// `hubLocationId`가 있는 항목은 dev/data/locationDefs.js에 이미 등록된 실제
// 허브 장소(서큘러키/더 록스 골목/전시장 입구 — v4에서도 물리적으로 같은
// 곳)라서 realVisualBrief를 그대로 가져와 재사용한다. `hubLocationId`가
// 없는 항목(전시장 내부·카페·숙소)은 허브가 아니라 씬 전용(legacy) 배경이라
// 아래 anchorSceneId(week2v4Scenes.js에 등록된 v4 씬)로만 업로드를 연결한다.
const week2v4Locations = [
  {
    id: 'loc-circular-quay', hubLocationId: 'w2-circular-quay', name: '서큘러키 산책로',
    realVisualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
    v4Note: 'Ch2에서 다니엘이 처음 등장하는 장소. 여전히 평범한 관광 스팟이어야 하고, 이후 반전을 알고 다시 봐도 "수상해 보이는" 연출을 넣지 않는다.',
    appearsIn: ['Ch2. 서큘러키, 우연한 가이드'],
    anchorSceneId: 'week2v4-ch02',
  },
  {
    id: 'loc-the-rocks-lane', hubLocationId: 'w2-the-rocks-lane', name: '더 록스 골목',
    realVisualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목.',
    v4Note: 'Ch3에서 다니엘이 카페 임시 보관함 구조를 익히는 장소. 골목 안쪽에 카페 입구와 보관함이 눈에 띄지 않게(배경 소품 수준으로) 자리한 구도가 필요하다.',
    appearsIn: ['Ch3. 더 록스, 보관함을 익히다'],
    anchorSceneId: 'week2v4-ch03',
  },
  {
    id: 'loc-exhibition-entrance', hubLocationId: 'w2-exhibition-entrance', name: '빈티지 전시장 입구',
    realVisualBrief: '더 록스 골목 한쪽에 자리한 작은 팝업 전시장의 유리문 입구. "K-01: 잃어버린 시간들" 배너가 입구 위에 걸려 있고, 유리문 너머로 전시 공간 일부가 살짝 비쳐 보인다.',
    v4Note: 'Ch6 단체사진의 배경. 다니엘이 사람들을 배치하는 구도가 자연스러워야 하므로, 입구 앞에 여러 사람이 설 수 있는 폭 넓은 공간감이 필요하다.',
    appearsIn: ['Ch4. 사람들과의 첫 만남', 'Ch6. 단체사진, 평범한 배경'],
    anchorSceneId: 'week2v4-ch06',
  },
  {
    id: 'loc-exhibition-interior', hubLocationId: null, name: '전시장 내부 · K-01 진열대',
    realVisualBrief: '(씬 전용 배경 — 기존 week2-scene-003/004가 쓰는 실내 전시 공간과 동일한 위치를 가리킨다.) 황동 공예품이 놓인 유리 진열장들, 중앙에 K-01 진열대.',
    v4Note: 'Ch5(작은 균열들)·Ch7(도난 발생)·Ch9(윤민아 심문)·Ch12(K-01 정밀 조사)·Ch20(다니엘 최종 심문)까지 가장 많이 재사용되는 핵심 공간. 진열장이 비어 있는 버전(도난 후)과 K-01이 있는 버전 두 컷이 필요할 수 있다.',
    appearsIn: ['Ch5', 'Ch7', 'Ch9', 'Ch12', 'Ch20'],
    anchorSceneId: 'week2v4-ch07',
  },
  {
    id: 'loc-cafe', hubLocationId: null, name: 'Café near Circular Quay',
    realVisualBrief: '(씬 전용 배경.) 서큘러키 근처의 작은 카페 — 임시 보관함이 놓인 골목 안쪽 구역도 함께 필요.',
    v4Note: 'Ch10~11(레오 심문·K-01 회수)의 보관함 구역, Ch16(소피의 기억)의 카페 실내, Ch19(일정표 재해석)·Ch21(최종 재구성)의 자리까지 폭넓게 쓰인다. 보관함이 뚜렷이 보이는 컷 하나는 꼭 필요.',
    appearsIn: ['Ch10', 'Ch11', 'Ch16', 'Ch19', 'Ch21'],
    anchorSceneId: 'week2v4-ch11',
  },
  {
    id: 'loc-accommodation', hubLocationId: null, name: 'Sydney Accommodation',
    realVisualBrief: '(씬 전용 배경 — 기존 1주차/2주차 엔딩이 쓰는 숙소 내부와 동일 위치.)',
    v4Note: 'Ch1(짧은 아침)과 Ch22(엔딩)의 배경. 아침의 밝은 톤과 밤의 차분한 톤, 두 가지 조명 버전이 있으면 좋다.',
    appearsIn: ['Ch1. 짧은 아침, 풀리지 않은 열쇠', 'Ch22. 엔딩 — M.K.라는 불안'],
    anchorSceneId: 'week2v4-ch22',
  },
];

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
