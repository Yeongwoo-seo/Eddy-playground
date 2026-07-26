// 2주차 v4 재설계 — 장소별 배경 이미지 프롬프트 데이터.
// dev/week2/redesign/locations/index.html 에서 읽는다.
//
// `hubLocationId`가 있는 항목은 dev/data/locationDefs.js에 이미 등록된 실제
// 허브 장소(서큘러키/더 록스 골목/전시장 입구 — v4에서도 물리적으로 같은
// 곳)라서 realVisualBrief를 그대로 가져와 재사용한다. `hubLocationId`가
// 없는 항목(전시장 내부·카페·숙소)은 허브가 아니라 씬 전용(legacy) 배경이라
// 아래 anchorSceneId(week2v4Scenes.js에 등록된 v4 씬)로만 업로드를 연결한다.
//
// `needsNewPhoto: false`인 항목은 물리적으로 완전히 같은 공간을 이전 주차
// (1주차 숙소) 또는 탐색허브(서큘러키/더 록스 골목/전시장 입구)가 이미
// 촬영/생성해 갖고 있다는 뜻 — 이 페이지가 "뭘 새로 만들어야 하는지"를 한눈에
// 보여줄 수 있도록, 재사용 가능한 항목은 새 프롬프트를 만들지 않고
// buildWeek2v4LocationPrompt가 짧은 재사용 안내만 반환한다. 전시장 내부/카페는
// 기존(v3, 실제 서비스 중인) 2주차 씬과 물리적으로 같은 공간일 가능성이 높지만
// v4 전용 구도(예: 카페의 임시 보관함 캐비닛이 잘 보이는 각도)가 필요할 수
// 있어 일단 needsNewPhoto: true로 두고 reuseHint에 확인할 점을 적어둔다 —
// 실제로 장소 DB에서 기존 catalog 위치에 배정해 재사용할 수 있는지는
// /dev/upload의 장소 DB 탭에서 직접 확인 후 결정한다.
const week2v4Locations = [
  {
    id: 'loc-accommodation', hubLocationId: null, name: '시드니 숙소 (Eastwood)',
    realVisualBrief: '1주차부터 써온 것과 같은 실제 숙소 — 거실/침실/주방/욕실 구도. 1주차 씬(week1-scene-002-1 등)에 이미 실사 사진이 등록되어 있다.',
    v4Note: 'Ch1(아침, 열쇠를 다시 들여다보는 장면)과 Ch22(엔딩) 배경. 1주차와 물리적으로 완전히 같은 곳이라 새로 찍을 필요가 없다 — 장소 DB에서 1주차 숙소 catalog 위치를 그대로 배정한다.',
    appearsIn: ['Ch1. 짧은 아침, 풀리지 않은 열쇠', 'Ch22. 엔딩 — M.K.라는 불안'],
    anchorSceneId: 'week2v4-ch01',
    needsNewPhoto: false,
    reuseHint: '1주차 숙소 배경(week1-scene-002-1)과 동일 — 장소 DB에서 같은 catalog 위치로 배정하면 끝.',
  },
  {
    id: 'loc-circular-quay', hubLocationId: 'w2-circular-quay', name: '서큘러키 산책로',
    realVisualBrief: '시드니 서큘러키(Circular Quay) 페리 선착장 옆 워터프론트 산책로. 여러 척의 페리가 정박해 있고, 버스커들이 공연하는 넓은 야외 데크. 오페라하우스와 하버브리지가 양쪽 먼 배경에 살짝 보이는 확 트인 구도.',
    v4Note: 'Ch2(다니엘과의 첫 만남, 사진 촬영)·Ch13(마틴과의 통화, 이동 중)·Ch18(관광팀 증언 탐문)의 배경. 탐색허브 Phase 1(W2_TOURISM)에 이미 등록된 실제 장소(w2-circular-quay)와 같은 곳이라 재사용한다.',
    appearsIn: ['Ch2. 서큘러키, 우연한 가이드', 'Ch13. 마틴 베일과의 통화', 'Ch18. 관광팀의 증언'],
    anchorSceneId: 'week2v4-ch02',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-circular-quay와 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-the-rocks-lane', hubLocationId: 'w2-the-rocks-lane', name: '더 록스 골목',
    realVisualBrief: '더 록스(The Rocks) 지구의 오래된 사암 건물과 좁은 자갈길 골목. 빈티지 부티크 상점 간판들이 늘어서 있고, 19세기풍 건물 사이로 좁은 통로와 옆문들이 보이는 아기자기한 관광 골목.',
    v4Note: 'Ch3(카페 임시 보관함의 존재를 알게 되는 장면)의 배경. 탐색허브의 실제 장소(w2-the-rocks-lane)와 같은 곳이라 재사용한다.',
    appearsIn: ['Ch3. 더 록스, 보관함을 익히다'],
    anchorSceneId: 'week2v4-ch03',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-the-rocks-lane과 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-exhibition-entrance', hubLocationId: 'w2-exhibition-entrance', name: '빈티지 전시장 입구',
    realVisualBrief: '더 록스 골목 한쪽에 자리한 작은 팝업 전시장의 유리문 입구. "K-01: 잃어버린 시간들" 배너가 입구 위에 걸려 있고, 유리문 너머로 전시 공간 일부가 살짝 비쳐 보인다.',
    v4Note: 'Ch4(다섯 사람과의 첫 만남 도입부)와 Ch6(단체사진을 찍는 위치)의 배경. 허브 장소(w2-exhibition-entrance)와 같은 곳이라 재사용한다.',
    appearsIn: ['Ch4. 사람들과의 첫 만남', 'Ch6. 단체사진, 평범한 배경'],
    anchorSceneId: 'week2v4-ch06',
    needsNewPhoto: false,
    reuseHint: '탐색허브 w2-exhibition-entrance와 동일 — 장소 DB에서 같은 catalog 위치로 배정.',
  },
  {
    id: 'loc-exhibition-interior', hubLocationId: null, name: '전시장 내부 — K-01 진열 구역',
    realVisualBrief: '전시장 안, K-01이 놓인 유리 진열장이 중심에 있고 주변으로 다른 전시품 몇 점이 놓인 실내 전시 공간. 은은한 스포트라이트 조명, 진열장 뒤로 관람 동선을 위한 좁은 통로.',
    v4Note: '극 중 가장 많이 쓰이는 핵심 배경 — Ch5(작은 균열들)·Ch7(도난 발생)·Ch9(윤민아 1차 심문)·Ch12(사건 재정의)·Ch14(애드리언의 메일함)·Ch15(레오 재심문)·Ch17(신원 조회)·Ch20(다니엘 최종 심문)에서 쓰인다.',
    appearsIn: ['Ch5. 전시장 자유 관람', 'Ch7. K-01 도난 발생', 'Ch9. 윤민아 1차 심문', 'Ch12. 사건의 이름을 다시 붙이다', 'Ch14. 애드리언의 메일함', 'Ch15. 레오 재심문', 'Ch17. 신원 조회', 'Ch20. 다니엘 최종 심문'],
    anchorSceneId: 'week2v4-ch05',
    needsNewPhoto: true,
    reuseHint: '기존(v3) 2주차의 팝업 전시장 실내 씬(week2-scene-003~007)과 물리적으로 같은 공간일 가능성이 높다 — 장소 DB에서 그 catalog 위치가 이미 있는지 먼저 확인하고, 없을 때만 아래 프롬프트로 새로 생성한다.',
  },
  {
    id: 'loc-cafe', hubLocationId: null, name: '서큘러키 근처 카페 (임시 보관함)',
    realVisualBrief: '전시장 근처의 아늑한 카페 내부. 좌석 몇 개와 바 안쪽에 손님 짐을 맡기는 임시 보관함(락커형 캐비닛)이 보이는 구도. 통유리 창 너머로 골목/거리가 살짝 보임.',
    v4Note: 'Ch10(레오를 향한 접근)·Ch11(K-01 회수)·Ch16(소피의 기억)·Ch19(일정표 재해석)·Ch21(최종 재구성)의 배경. 특히 임시 보관함 캐비닛이 화면에 뚜렷이 보여야 Ch3/Ch11의 단서가 이어진다.',
    appearsIn: ['Ch10. 레오를 향한 접근', 'Ch11. 레오 집중 심문과 K-01 회수', 'Ch16. 소피의 생활 기억', 'Ch19. 일정표와 단체사진 재해석', 'Ch21. 최종 사건 재구성'],
    anchorSceneId: 'week2v4-ch10',
    needsNewPhoto: true,
    reuseHint: '기존(v3) "전시장 근처 카페" 씬(week2-scene-008 등)과 같은 공간일 수 있다 — 장소 DB에서 먼저 확인, 없으면 아래 프롬프트로 새로 생성한다.',
  },
];

function buildWeek2v4LocationPrompt(loc) {
  if (!loc.needsNewPhoto) {
    return [
      `이 장소는 새 사진이 필요 없습니다.`,
      '',
      `기존에 이미 등록된 사진을 그대로 재사용하면 됩니다: ${loc.reuseHint || ''}`,
      `(방법: /dev/upload 의 "장소 DB" 탭에서 이 씬의 배경 슬롯을 같은 catalog 장소에 배정)`,
    ].join('\n');
  }
  const lines = [];
  lines.push(`아래 장소의 배경 일러스트 생성을 위한 프롬프트야. "The Missing Key" 비주얼노벨의 기존 배경 아트 스타일(사실적인 사진풍, 스마트폰 스냅샷 느낌, 인물 없는 순수 배경)에 맞춰줘.`);
  lines.push('');
  lines.push(`# 장소: ${loc.name}`);
  lines.push(`- 기본 묘사: ${loc.realVisualBrief}`);
  lines.push(`- v4 재설계에서의 쓰임: ${loc.v4Note}`);
  lines.push(`- 등장 챕터: ${loc.appearsIn.join(', ')}`);
  if (loc.reuseHint) {
    lines.push(`- 참고: ${loc.reuseHint}`);
  }
  lines.push('');
  lines.push('[비율] 4:5 (세로로 살짝 긴 구도)');
  lines.push('');
  lines.push('[준수 사항]');
  lines.push('- 인물은 그리지 않는다(배경 전용, 캐릭터는 별도 레이어로 겹쳐진다).');
  lines.push('- 가로형 구도, 모바일 비주얼노벨 배경으로 쓸 수 있게 상하 여백을 충분히 둔다.');
  lines.push('- 기존 등록된 다른 배경들과 톤(채도·조명 스타일)을 맞춘다.');
  lines.push('');
  lines.push('[피해야 할 것]');
  lines.push('- 텍스트, 워터마크, 로고, UI 요소');
  lines.push('- 만화/애니메이션풍 렌더링, 어안렌즈 왜곡, 과장된 채도');
  lines.push('- 이름 있는 등장인물의 얼굴이나 전신');
  return lines.join('\n');
}
