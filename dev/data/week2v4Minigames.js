// 2주차 v4 재설계 — 미니게임 목록. 기존 미니게임을 그대로 재사용하는 것과
// v4에서 새로 필요한 것을 함께 관리한다. dev/week2/redesign/minigames/에서 읽는다.
//
// `reusedMinigameId`가 있으면 dev/dialogueData.js의 실제 `minigames` 배열에
// 등록된 항목이다 — 그 항목의 route/setupUrl을 그대로 가져다 쓴다(중복
// 정의하지 않음). 없으면 v4에서 새로 설계해야 하는 미니게임이라 아직 route가
// 없고, 대신 구현 설계 프롬프트만 제공한다.
const week2v4Minigames = [
  {
    id: 'mg-photo-zoom', name: '사진 속 인물 찾기', status: 'reused', reusedMinigameId: 'week2-scene-004-minigame',
    relatedChapter: 'Ch8. 사진 속 인물 찾기',
    purpose: '7장의 연속 사진에서 인물·단서 핫스팟을 찾아 시간대별 동선을 확인한다. v4에서도 구조는 그대로 재사용 — "누가 진열장 문이 열린 사진에 가까이 있었는가"에 집중하도록 캡션만 다시 씀.',
    requiredUi: [],
  },
  {
    id: 'mg-timeline', name: '시간대 정리', status: 'reused', reusedMinigameId: 'week2-scene-008-minigame',
    relatedChapter: 'Ch10. 레오를 향한 접근',
    purpose: '레오의 동선을 시간순으로 정리하는 기존 미니게임. v4에서는 "몇 시 몇 분"이 최종 결론이 되지 않도록, 완료 후 곧장 레오 자백(Ch11)으로 넘어가는 보조 단계로만 쓴다.',
    requiredUi: [],
  },
  {
    id: 'mg-k01-compare', name: 'K-01 두 시점 비교 슬라이더', status: 'new',
    relatedChapter: 'Ch11(내부 분해 흔적 발견) · Ch20(다니엘 최종 심문 결정타)',
    purpose: '사건 전 사진과 회수된 K-01 사진을 좌우(또는 전/후) 슬라이더로 겹쳐 보여주고, 나사 방향·결합선 위치 같은 차이점을 플레이어가 직접 짚어내게 한다. Ch20에서는 서큘러키 커플 사진의 확대판으로 재사용해 다니엘의 시선이 열쇠를 향해 있었음을 짚어내는 최종 결정타로 쓴다.',
    requiredUi: ['두 이미지를 겹쳐 드래그로 비교하는 슬라이더', '차이점 핫스팟(탭하면 정답/오답 판정)', '오답 시 힌트, 정답 시 다음 진술 단계로 진행'],
    // Ch11용 비교쌍 — 반드시 같은 카메라 각도·거리·조명으로 촬영해야 슬라이더로
    // 겹쳤을 때 나사 방향 차이만 도드라진다. Ch20용 비교쌍은 별도 사진이 아니라
    // ev-circular-quay-photo(서큘러키 커플 사진)의 확대판을 재사용하므로 여기
    // 목록엔 없다 — dev/data/week2v4Evidence.js 참고.
    requiredPhotos: [
      {
        id: 'k01-before', label: 'K-01 사건 전 사진',
        photoBrief: '도난 전, 정상 상태의 K-01 하단부 접사. 받침과 몸체가 맞물린 결합선과 나사 머리가 특정 방향(예: 세로 정렬)으로 고정된 모습이 뚜렷이 보이는 각도.',
      },
      {
        id: 'k01-after', label: 'K-01 회수 후 사진',
        photoBrief: '카페 보관함에서 회수된 이후의 K-01 하단부 접사 — "사건 전 사진"과 반드시 동일한 카메라 각도·거리·조명·해상도로 촬영. 겉보기엔 거의 동일하되 나사 방향이 미세하게(예: 가로에 가깝게) 어긋나 있고 결합선에 아주 살짝 벌어진 흔적이 있어야 한다.',
      },
    ],
  },
  {
    id: 'mg-itinerary-match', name: '일정표 매칭 재해석', status: 'new',
    relatedChapter: 'Ch19. 일정표와 단체사진 재해석',
    purpose: '"표면상 일정" 카드와 "실제 기능" 카드를 매칭시켜 관광 일정표가 작전표였음을 재해석하는 미니게임. docs/week2-storyline-outline-v4.md §6의 5행 표가 정답 데이터.',
    requiredUi: ['좌: 표면상 일정 카드 5개', '우: 실제 기능 카드 5개(순서 섞임)', '드래그 또는 탭으로 매칭, 정답 시 카드가 합쳐지며 재해석 문구 노출'],
  },
  {
    id: 'mg-final-reconstruction', name: '최종 사건 재구성 (12단계)', status: 'new',
    relatedChapter: 'Ch21. 최종 사건 재구성',
    purpose: '사건 조각 12개를 순서대로 배열하고, 각 조각마다 "행동의 목적"을 4지선다로 함께 고르는 최종 정리 미니게임. docs/week2-storyline-outline-v4.md §13의 12단계 목록이 정답 데이터.',
    requiredUi: ['12개 사건 조각 드래그 정렬 리스트', '조각별 목적 4지선다(정답 시 다음 조각 잠금 해제)', '전부 완료 시 요약 카드(다니엘 자백 + M.K. 불안 엔딩으로 연결)'],
  },
];

function buildWeek2v4MinigamePrompt(mg) {
  const lines = [];
  lines.push(`너는 "The Missing Key" 비주얼노벨의 미니게임을 설계/구현하는 개발자야.`);
  lines.push(`아래 미니게임을 dev/play 기존 미니게임들과 같은 스타일(모바일 우선, 다크 테마, IBM Plex Mono/Pretendard 폰트)로 새로 구현해줘.`);
  lines.push('');
  lines.push(`# 미니게임: ${mg.name}`);
  lines.push(`- 관련 챕터: ${mg.relatedChapter}`);
  lines.push(`- 목적: ${mg.purpose}`);
  if (mg.requiredUi.length) {
    lines.push(`- 필요한 UI 요소:`);
    mg.requiredUi.forEach(item => lines.push(`  - ${item}`));
  }
  lines.push('');
  lines.push('# 준수 사항');
  lines.push('- 전체 설계 맥락은 docs/week2-storyline-outline-v4.md 를 참고한다.');
  lines.push('- 기존 미니게임(/play/minigame-photo-zoom/, /play/minigame-timeline/ 등)의 코드 스타일·라우팅 패턴을 그대로 따른다.');
  lines.push('- 완료 후 다음 씬으로 넘어가는 처리(nextSceneId 또는 콜백)를 남긴다.');
  lines.push('- 정답 데이터는 하드코딩해도 되지만, 위치를 명확히 주석으로 표시한다.');
  return lines.join('\n');
}

// 미니게임 자체의 코드/UI 구현과는 별개로, 그 미니게임 안에서 실제로 쓰일
// 사진 소재의 생성 프롬프트 — mg.requiredPhotos에 등록된 항목에만 존재한다
// (mg-itinerary-match/mg-final-reconstruction은 카드·텍스트 UI 위주라 별도
// 사진이 필요 없다고 보고 비워뒀다).
function buildWeek2v4MinigamePhotoPrompt(mg, photo) {
  const lines = [];
  lines.push(`아래 사진은 "${mg.name}" 미니게임(${mg.relatedChapter})에서 실제로 쓰일 소재 사진이야. "The Missing Key" 비주얼노벨의 기존 증거/배경 사진 스타일(사실적인 스마트폰 스냅샷/클로즈업)에 맞춰줘.`);
  lines.push('');
  lines.push(`# 사진: ${photo.label}`);
  lines.push(`- 사진에 담아야 할 것: ${photo.photoBrief}`);
  lines.push(`- 미니게임 목적: ${mg.purpose}`);
  lines.push('');
  lines.push('[비율] 1:1 또는 4:5 (비교 슬라이더에 겹쳐 쓰기 좋은 클로즈업)');
  lines.push('');
  lines.push('[피해야 할 것]');
  lines.push('- 텍스트, 워터마크, 로고, UI 요소');
  lines.push('- 짝을 이루는 다른 사진과 다른 카메라 각도·거리·조명·색감 (비교 슬라이더이므로 반드시 맞춰야 한다)');
  lines.push('- 이름 있는 등장인물의 얼굴이나 전신');
  lines.push('');
  lines.push('위 조건에 맞는 이미지를 10가지 버전으로 만들어줘.');
  return lines.join('\n');
}
