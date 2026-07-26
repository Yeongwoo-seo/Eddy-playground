// 2주차 v4 재설계 — 증거별 사진 생성 프롬프트 데이터.
// dev/week2/redesign/evidence/index.html 에서 읽는다.
//
// 목록·의미 3단계(초반/1부/2부·최종)는 docs/week2-storyline-outline-v4.md
// §10 "증거와 의문점의 전체 갱신표"를 그대로 옮긴 것 — 그 표가 데이터 소스다.
// photoBrief는 그 표엔 없는, 실제 사진에 무엇을 담아야 하는지에 대한 시각적
// 묘사를 새로 붙인 것이다.
//
// `needsNewPhoto: false`인 항목은 1주차/기존(v3) 2주차에서 이미 실사 자산이
// 있어 v4에서 새로 찍을 필요가 없는 것들 — reuseHint에 어디서 가져오는지
// 적어둔다. 그 외에는 v4의 반전(다니엘이 배후) 구도를 반영한 새 사진이
// 필요하다.
const week2v4Evidence = [
  {
    id: 'ev-mk-key', name: 'M.K. 황동 열쇠', firstAppearance: 'Ch1',
    initialMeaning: '1주차의 미해결 기념품', part1Meaning: 'K-01 각인과 닮은 표식',
    finalMeaning: '다니엘이 지수에게 접근한 이유이자 사건 전 인지의 증거',
    photoBrief: '손바닥 위 또는 협탁 위에 놓인 작은 황동 열쇠 클로즈업. 오래되어 살짝 녹슨 듯한 색감, "M.K." 각인이 겨우 알아볼 정도로만 도드라진 실루엣(각인 자체는 확대해야 보이는 수준).',
    needsNewPhoto: false,
    reuseHint: '1주차부터 등장한 실제 아이템 사진(ITEM ACQUIRED — UNKNOWN KEY)을 그대로 재사용 — 아이템 DB에 이미 등록되어 있다.',
  },
  {
    id: 'ev-circular-quay-photo', name: '서큘러키 커플 사진', firstAppearance: 'Ch2',
    initialMeaning: '관광 기념사진', part1Meaning: '다니엘의 초기 알리바이',
    finalMeaning: '다니엘이 M.K. 열쇠를 보고 있었고 명찰이 위조됐음을 보여주는 사진',
    photoBrief: '오페라하우스를 배경으로 지수가 웃으며 포즈를 취한 스냅샷 구도. 다니엘은 프레임 가장자리(어깨 너머 또는 뒤편)에서 카메라가 아니라 지수의 가방/손에 들린 열쇠 쪽을 살짝 내려다보는 시선으로 걸려 있다 — 처음엔 그냥 "구도를 잡아주는 손짓"처럼 자연스럽게 보이되, 확대하면 시선의 방향이 명확히 열쇠를 향하게.',
    needsNewPhoto: true,
    reuseHint: '미니게임(K-01 두 시점 비교 슬라이더) Ch20 결정타에서 이 사진을 확대판으로 재사용하므로, 고해상도로 한 번만 제작해도 된다.',
  },
  {
    id: 'ev-itinerary', name: '관광 일정표', firstAppearance: 'Ch3',
    initialMeaning: '평범한 투어 일정', part1Meaning: '다니엘의 이동 기록',
    finalMeaning: '군중 배치·직원문 확인·보관함 회수를 정리한 작전표',
    photoBrief: '손에 든 A5 크기 인쇄물 또는 접힌 안내지 클로즈업. 시간대별 칸이 표처럼 나뉜 레이아웃 실루엣만 보이면 충분(실제 읽을 수 있는 글자는 넣지 않는다 — 세부 항목은 게임 UI 텍스트로 별도 표시).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-daniel-badge', name: '다니엘 명찰', firstAppearance: 'Ch2',
    initialMeaning: '가이드 신분 증명', part1Meaning: '여행사 소속 확인 자료',
    finalMeaning: '행사 임시 패스를 개조한 위장 출입증',
    photoBrief: '목에 건 랜야드형 명찰 클로즈업. 코팅된 카드 표면의 반사광, 사진란/로고 자리는 흐릿하게 처리해 실제 글자나 얼굴 사진이 읽히지 않게(위조 여부는 게임 UI 설명으로 전달).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-grey-cap', name: '회색 캡 목격담', firstAppearance: 'Ch9',
    initialMeaning: '레오를 본 목격 정보', part1Meaning: '다니엘의 기억 오류',
    finalMeaning: '레오에게 혐의를 집중시키기 위한 의도적 유도',
    photoBrief: '이건 물증이 아니라 증언이라 단독 사진보다, 다른 사진(단체사진/전시장 스냅샷) 한쪽 구석에 회색 캡을 쓴 인물의 뒷모습/옆모습이 흐릿하게 걸린 배경 디테일로 표현하는 편이 자연스럽다. 얼굴은 보이지 않게, 캡의 색과 실루엣만 식별 가능하게.',
    needsNewPhoto: true,
    reuseHint: '독립된 사진이 필요하다기보다, Ch6 단체사진이나 Ch5 전시장 배경 한 켠에 이 인물을 심어 넣는 방식을 우선 검토한다.',
  },
  {
    id: 'ev-mina-photo', name: '윤민아의 확대 사진', firstAppearance: 'Ch5',
    initialMeaning: '무단 촬영 자료', part1Meaning: '윤민아의 알리바이와 레오 접근 흔적',
    finalMeaning: '사건 전 K-01 내부 결합 상태를 증명하는 기준 사진',
    photoBrief: '스마트폰으로 몰래 찍은 듯 살짝 기울어진 구도의 K-01 하단부 접사 사진. 받침과 몸체가 맞물린 결합선, 나사 머리 방향이 뚜렷이 보이는 클로즈업 — 이후 회수된 K-01 사진과 비교했을 때 나사 방향 차이를 알아볼 수 있어야 한다.',
    needsNewPhoto: true,
    reuseHint: 'K-01 두 시점 비교 슬라이더 미니게임(mg-k01-compare)의 "사건 전" 사진과 같은 앵글로 맞춰서 만들면 두 번 쓸 수 있다.',
  },
  {
    id: 'ev-leo-bag', name: '레오의 크로스백', firstAppearance: 'Ch10',
    initialMeaning: '평범한 소지품', part1Meaning: 'K-01 반출 도구',
    finalMeaning: '다니엘이 선택한 희생양 구조와 부분 의뢰의 증거',
    photoBrief: '어두운 색 캔버스/나일론 크로스백 클로즈업. 지퍼가 살짝 열려 안쪽에 완충재 일부가 비치는 각도, 직원 유니폼과 함께 걸쳐진 자연스러운 스냅샷.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-packing-foam', name: '잘린 완충재', firstAppearance: 'Ch10',
    initialMeaning: '행사 쓰레기', part1Meaning: 'K-01 포장 흔적',
    finalMeaning: '레오의 실행은 입증하지만 내부 인덱스 회수는 설명하지 못함',
    photoBrief: '바닥 또는 쓰레기통 근처에 놓인 스티로폼/에어캡 조각 클로즈업. 깔끔하게 잘린 단면이 도드라지게, K-01 크기에 맞춰 파낸 자국이 남아있는 모습.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-cafe-storage-log', name: '카페 보관함 기록', firstAppearance: 'Ch3',
    initialMeaning: '일상적인 보관 기록', part1Meaning: 'K-01 회수 장소',
    finalMeaning: '레오 이후 다니엘이 다시 접근할 수 있었음을 증명',
    photoBrief: '카페 바 안쪽, 손님 보관함 앞에 놓인 종이 대장 또는 태블릿 화면 클로즈업. 시간과 칸 번호가 적힌 표 형태의 레이아웃 실루엣만(실제 읽히는 글자는 넣지 않는다).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-k01', name: 'K-01', firstAppearance: 'Ch7',
    initialMeaning: '도난당한 작품', part1Meaning: '레오가 훔쳤다가 회수된 작품',
    finalMeaning: '내부 인덱스가 제거된 껍데기이자 두 번째 사건의 현장',
    photoBrief: '전시대 위 유리 케이스 안에 놓인 골동품풍 오브제(정교한 황동 장식이 있는 상자/조형물) — 전체 샷과 하단부 클로즈업 두 앵글이 필요하면 함께 준비.',
    needsNewPhoto: true,
    reuseHint: '기존(v3) 2주차에 이미 K-01 전시 사진이 있다면 그대로 재사용 가능한지 먼저 확인 — 있다면 새로 찍을 필요 없음.',
  },
  {
    id: 'ev-mk-consult-message', name: 'MK_Consult 메시지', firstAppearance: 'Ch11',
    initialMeaning: '익명 촬영 의뢰', part1Meaning: '레오를 움직인 배후',
    finalMeaning: '다니엘의 작전 통신이자 표현 습관·현장 정보와 연결되는 증거',
    photoBrief: '스마트폰 메신저 앱 화면을 옆에서 살짝 비스듬히 찍은 듯한 구도. 말풍선 레이아웃과 발신자 아이콘("MK_Consult"라는 이름 대신 익명 아바타)은 보이되, 본문 글자는 흐릿하게 처리(실제 대사는 게임 UI 텍스트로 별도 표시).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-group-photo', name: '관광팀 단체사진', firstAppearance: 'Ch6',
    initialMeaning: '즐거운 단체 사진', part1Meaning: '다니엘의 투어 진행 증명',
    finalMeaning: '정식 관광팀이 아니며 군중 위치가 의도적으로 배치됐다는 증거',
    photoBrief: '전시장 입구 앞, 지수·영우·다니엘을 포함한 여러 인원이 나란히 서서 찍은 단체 스냅샷 구도. 인물들의 배치가 입구 시야를 절묘하게 가리는 각도임을 알 수 있게(나중에 다시 보면 "의도적 배치"로 읽히도록), 얼굴은 이름 있는 주연 캐릭터를 제외한 이름 없는 인물들로 채운다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-cafe-locker-system', name: '카페 임시 보관함 시스템', firstAppearance: 'Ch3',
    initialMeaning: '사소한 친절', part1Meaning: '(자료 없음)',
    finalMeaning: '회수 단계에 필요한 구조와 코드를 확인한 흔적',
    photoBrief: '카페 안쪽 벽면에 설치된 락커형 보관함 캐비닛 전체 샷. 번호가 매겨진 여러 칸, 그중 하나가 살짝 열려 있거나 사용 중 표시가 있는 디테일.',
    needsNewPhoto: false,
    reuseHint: '카페(loc-cafe) 배경 사진 안에 이미 포함되는 요소 — 별도 단독 사진 대신 카페 배경 프롬프트에서 이 캐비닛이 잘 보이도록 요청하는 방식으로 처리한다.',
  },
  {
    id: 'ev-adrian-client-email', name: '애드리언의 의뢰인 메일', firstAppearance: 'Ch4/Ch14',
    initialMeaning: '비공식 매입 정황', part1Meaning: '(미확인)',
    finalMeaning: '의뢰인이 가격보다 각인·구조에만 관심 있었다는 증거',
    photoBrief: '노트북 또는 태블릿 메일 클라이언트 화면 클로즈업. 발신자란에 "M.K."만 적힌 짧은 스레드 레이아웃(제목/본문 줄 수만 표현, 실제 읽히는 문장은 넣지 않는다).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-k01-weight', name: 'K-01 등록 무게', firstAppearance: 'Ch5/Ch12',
    initialMeaning: '일상적인 관리 대장', part1Meaning: '(미확인)',
    finalMeaning: '내부 부품 소실의 물증',
    photoBrief: '전시 등록 대장(바인더 또는 태그) 클로즈업 — 무게 항목 칸에 숫자가 적힌 레이아웃만 보이면 충분, 또는 소형 디지털 저울 위에 K-01을 올려둔 손 클로즈업.',
    needsNewPhoto: true,
  },
];

function buildWeek2v4EvidencePrompt(ev) {
  if (!ev.needsNewPhoto) {
    return [
      `이 증거는 새 사진이 필요 없습니다.`,
      '',
      `기존 자산을 그대로 재사용하면 됩니다: ${ev.reuseHint || ''}`,
    ].join('\n');
  }
  const lines = [];
  lines.push(`아래 증거의 사진 생성을 위한 프롬프트야. "The Missing Key" 비주얼노벨의 기존 증거 사진 스타일(사실적인 스마트폰 스냅샷/클로즈업, 인물 얼굴 없이 사물·손·화면 위주)에 맞춰줘.`);
  lines.push('');
  lines.push(`# 증거: ${ev.name} (첫 등장: ${ev.firstAppearance})`);
  lines.push(`- 사진에 담아야 할 것: ${ev.photoBrief}`);
  lines.push('');
  lines.push('# 이 증거의 의미 변화 (촬영 시 참고 — 화면에 직접 드러날 필요는 없음)');
  lines.push(`- 초반: ${ev.initialMeaning}`);
  lines.push(`- 1부: ${ev.part1Meaning}`);
  lines.push(`- 2부·최종: ${ev.finalMeaning}`);
  if (ev.reuseHint) {
    lines.push('');
    lines.push(`# 참고: ${ev.reuseHint}`);
  }
  lines.push('');
  lines.push('[비율] 1:1 또는 4:5 (증거 노트 썸네일에 쓰이는 정사각형에 가까운 클로즈업)');
  lines.push('');
  lines.push('[피해야 할 것]');
  lines.push('- 실제로 읽을 수 있는 텍스트, 워터마크, 로고, UI 요소 (읽어야 하는 내용은 게임 자체 텍스트로 별도 표시하므로 사진엔 흐릿한 레이아웃 정도만)');
  lines.push('- 만화/애니메이션풍 렌더링, 과장된 채도');
  lines.push('- 이름 있는 등장인물의 얼굴 전체가 드러나는 구도');
  lines.push('');
  lines.push('위 조건에 맞는 이미지를 10가지 버전으로 만들어줘.');
  return lines.join('\n');
}
