// 2주차 v4 재설계 아웃라인 데이터 — docs/week2-storyline-outline-v4.md 의 요약본.
// dev/week2/redesign/index.html 에서 챕터 목록·분기별 AI 프롬프트 UI를 그리는 데 쓴다.
// 문서 원본이 바뀌면 이 배열도 같이 갱신해야 한다 (자동 추출 아님).
//
// existingSceneId가 있는 챕터는 아직 v3 시절 대사가 남아있는 실제 씬과 골격을
// 공유한다는 뜻 — "바로 플레이"가 그 씬으로 연결된다(대사 자체는 재작성 필요).
// null인 챕터는 v4 전면 신규 구간이라 아직 플레이할 대사가 없다.
const week2RedesignV4Chapters = [
  {
    id: 'ch1', order: 1, part: 1, title: '짧은 아침, 풀리지 않은 열쇠',
    location: 'Sydney Accommodation', characters: ['지수', '영우'],
    purpose: '1주차 엔딩(M.K. 황동 열쇠 발견)을 짧게 상기시키고 오늘 하루를 관광으로 여는 도입',
    twist: null,
    believe: '열쇠는 그냥 신기한 물건이다',
    truth: '이 열쇠가 오늘 하루 전체를 다니엘이 설계한 이유다',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch2', order: 2, part: 1, title: '서큘러키, 우연한 가이드',
    location: 'Circular Quay', characters: ['지수', '영우', '다니엘'],
    purpose: '다니엘을 "유능하고 다정한 사람"으로 각인시키는 첫 긍정적 관계 형성 장면(①)',
    twist: null,
    believe: '친절한 가이드가 사진을 찍어주고 좋은 곳을 추천해줬다',
    truth: '다니엘은 이미 M.K. 열쇠를 보고 지수·영우를 관찰 대상으로 정했다',
    newEvidence: ['서큘러키 커플 사진', '다니엘 명찰'],
    existingSceneId: 'week2-scene-001',
  },
  {
    id: 'ch3', order: 3, part: 1, title: '더 록스, 보관함을 익히다',
    location: 'The Rocks 골목, 카페 앞', characters: ['지수', '영우', '다니엘'],
    purpose: '다니엘의 두 번째 긍정적 관계 형성(②) + 카페 임시 보관함 시스템을 배경 정보로 등록',
    twist: null,
    believe: '다니엘은 그냥 오지랖 넓고 책임감 있는 사람이다',
    truth: '다니엘은 회수 단계에 필요한 보관함 구조와 공용 코드를 확인하는 중이다',
    newEvidence: ['카페 임시 보관함 시스템'],
    existingSceneId: null,
  },
  {
    id: 'ch4', order: 4, part: 1, title: '사람들과의 첫 만남',
    location: 'Pop-up Exhibition 입구~내부', characters: ['지수', '영우', '소피', '클레어', '윤민아', '애드리언', '레오'],
    purpose: '자유 탐색 허브에서 다섯 인물과 순차적으로 짧은 관계 형성 대화(소소한 부탁 해결 포함)',
    twist: null,
    believe: '다섯 명 다 그냥 전시장에서 만난 사람들이다',
    truth: '윤민아·애드리언·클레어·레오는 각자 다른 이유로 뭔가를 숨기고 있다',
    newEvidence: ['소피의 카페 잡담', '클레어의 K-01 소개'],
    existingSceneId: 'week2-scene-003',
  },
  {
    id: 'ch5', order: 5, part: 1, title: '전시장 자유 관람 — 작은 균열들',
    location: 'Pop-up Exhibition, K-01 진열대 앞', characters: ['지수', '영우', '윤민아', '애드리언', '클레어', '다니엘'],
    purpose: '반전 1(윤민아)과 반전 3(내부 부품)의 복선을 동시에 심는다',
    twist: '반전 1·3의 사전 복선',
    believe: '윤민아가 제일 수상하다',
    truth: '윤민아의 사진은 나중에 K-01의 "정상 상태"를 증명하는 기준 자료가 된다',
    newEvidence: ['윤민아의 확대 사진', '애드리언의 구조 질문'],
    existingSceneId: 'week2-scene-003',
  },
  {
    id: 'ch6', order: 6, part: 1, title: '단체사진, 평범한 배경',
    location: 'Pop-up Exhibition 입구', characters: ['지수', '영우', '다니엘', '레오'],
    purpose: '다니엘의 세 번째 긍정 관계 장면(③) + 레오와의 두 번째 신뢰 형성(②), "군중 배치" 복선',
    twist: '반전 4의 사전 복선',
    believe: '즐거운 단체 기념사진일 뿐',
    truth: '이 사진 속 사람들의 위치가 훗날 "입구 시야를 가리는 배치"였음이 드러난다',
    newEvidence: ['관광팀 단체사진'],
    existingSceneId: null,
  },
  {
    id: 'ch7', order: 7, part: 1, title: 'K-01 도난 발생',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '클레어', '소피', '윤민아', '애드리언', '레오'],
    purpose: '사건 발생. 도난품 정의를 "K-01 전체"로 등록(나중에 갱신될 초기값)',
    twist: null,
    believe: 'K-01 전체가 도난당했다',
    truth: '이 시점엔 이것이 사건의 전체 진실처럼 보이는 게 의도된 연출',
    newEvidence: ['카메라 11분 루프 기록'],
    existingSceneId: 'week2-scene-004',
  },
  {
    id: 'ch8', order: 8, part: 1, title: '사진 속 인물 찾기',
    location: 'Pop-up Exhibition', characters: ['윤민아(사진)', '애드리언(사진)', '레오(사진)'],
    purpose: '7장의 연속 사진으로 시간대별 동선을 확인 — "누가 진열장 문이 열린 사진에 가까이 있었는가"에 집중',
    twist: null,
    believe: '사진으로 범인을 좁혀갈 수 있다',
    truth: '사진은 물리적 반출자(레오)까지만 밝혀낼 수 있고, 설계자는 밝히지 못한다',
    newEvidence: ['사진 속 그레이 후드 남성', '진열장 문 열림 순간'],
    existingSceneId: 'week2-scene-004-minigame',
  },
  {
    id: 'ch9', order: 9, part: 1, title: '윤민아 1차 심문 — 반전 1',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '윤민아', '클레어', '다니엘'],
    purpose: '"거짓말을 했으므로 범인"이라는 결론을 무너뜨림',
    twist: '반전 1 — 가장 수상한 윤민아는 범인이 아니다',
    believe: '윤민아는 범인이 아니고, 이제 진짜 용의자를 찾아야 한다',
    truth: '맞다 — 다만 이 심문을 이끈 정보 중 일부(회색 캡)는 다니엘이 흘린 것',
    newEvidence: ['회색 캡 목격담(1차)', '카메라가 반복 화면이었다는 확인'],
    existingSceneId: 'week2-scene-005',
  },
  {
    id: 'ch10', order: 10, part: 1, title: '레오를 향한 접근',
    location: 'Pop-up Exhibition, Café near Circular Quay', characters: ['지수', '영우', '레오', '애드리언'],
    purpose: '직원문·열쇠·사진 반사·포장재를 통해 레오를 조사 대상으로 좁힘 (반전 2 준비)',
    twist: null,
    believe: '레오가 뭔가 숨기고 있다',
    truth: '맞다 — 레오가 실행범이다',
    newEvidence: ['레오의 크로스백', '잘린 완충재'],
    existingSceneId: 'week2-scene-007',
  },
  {
    id: 'ch11', order: 11, part: 1, title: '레오 집중 심문과 K-01 회수 — 반전 2·3',
    location: 'Pop-up Exhibition, Café near Circular Quay', characters: ['지수', '영우', '레오', '윤민아'],
    purpose: '레오의 6단계 자백으로 물리적 범행을 완전히 입증한 뒤, K-01 회수 직후 내부 분해 흔적 발견',
    twist: '반전 2 — 친절한 레오는 실제 실행범이다 / 반전 3 — K-01은 돌아왔지만 사건은 해결되지 않았다',
    believe: '레오가 범인이고, K-01만 찾으면 사건은 끝난다',
    truth: '절반만 맞다 — 내부 황동 인덱스가 사라졌다. 진짜 사건은 이제부터',
    newEvidence: ['MK_Consult 메시지', '카페 보관함 기록', 'K-01 내부 분해 흔적'],
    existingSceneId: 'week2-scene-009',
  },
  {
    id: 'ch12', order: 12, part: 2, title: '사건의 이름을 다시 붙이다',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '클레어'],
    purpose: '2부 개막 — 사건 재정의의 물리적 근거 확보 (무게·나사·결합선 정밀 비교)',
    twist: null,
    believe: '뭔가 내부에 있었고 사라졌다',
    truth: '맞다',
    newEvidence: ['K-01 등록 무게와의 대조'],
    existingSceneId: null,
  },
  {
    id: 'ch13', order: 13, part: 2, title: '마틴 베일과의 통화 — 내부 인덱스',
    location: 'Circular Quay 이동 중 (전화)', characters: ['지수', '영우', '마틴 베일'],
    purpose: '내부 인덱스의 존재를 제작 관련 인물을 통해 확인',
    twist: null,
    believe: '진짜 도난품은 K-01이 아니라 인덱스였다',
    truth: '맞다',
    newEvidence: ['내부 황동 인덱스의 존재'],
    existingSceneId: null,
  },
  {
    id: 'ch14', order: 14, part: 2, title: '애드리언의 메일함 — 진짜 의뢰 목적',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '애드리언'],
    purpose: '애드리언의 거짓말을 완전히 벗기되, 범행과 등가로 만들지 않음',
    twist: null,
    believe: '범행 목적이 "고가품 절도"가 아니라 "정보·부품 회수"였다',
    truth: '맞다',
    newEvidence: ['애드리언의 의뢰인 메일'],
    existingSceneId: null,
  },
  {
    id: 'ch15', order: 15, part: 2, title: '레오 재심문 — 보관함과 익명 지시',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '레오'],
    purpose: '레오의 1부 증언을 무효화하지 않으면서 새 사실(보관함 이후 행적)을 확보',
    twist: null,
    believe: '레오는 정말로 모른다 — 배후가 따로 있다',
    truth: '맞다',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch16', order: 16, part: 2, title: '소피의 생활 기억 — 조력자의 균열',
    location: 'Café near Circular Quay', characters: ['지수', '영우', '소피'],
    purpose: '다니엘의 정체 반전 1단계(②→③) — 단정하지 않되 위화감 축적',
    twist: null,
    believe: '다니엘이 우연히 여러 번 그 자리에 있었을 뿐일 수도 있다',
    truth: '우연이 아니다',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch17', order: 17, part: 2, title: '신원 조회 — 등록되지 않은 가이드',
    location: 'Pop-up Exhibition / 전화', characters: ['지수', '영우', '다니엘'],
    purpose: '반전 5의 시작 — 명찰이 신분 증명이 아니라 침입 도구였음을 밝히는 첫 단계',
    twist: '반전 5 사전 단계',
    believe: '다니엘이 뭔가 숨기고 있지만 아직 범행과는 별개일 수 있다',
    truth: '명찰 자체가 위장 출입증이다',
    newEvidence: ['다니엘 소속 여행사 미등록 확인'],
    existingSceneId: null,
  },
  {
    id: 'ch18', order: 18, part: 2, title: '관광팀의 증언 — 서로 모르는 사람들',
    location: 'Circular Quay', characters: ['지수', '영우'],
    purpose: '반전 4(일정표=작전표)의 근거 확보, 군중이 "형성된" 것임을 확인',
    twist: null,
    believe: '다니엘이 관광 가이드처럼 보이려고 사람들을 모았다',
    truth: '맞다 — 이 군중은 입구 시야를 가리는 용도였다',
    newEvidence: ['관광팀 단체사진 재해석 근거'],
    existingSceneId: null,
  },
  {
    id: 'ch19', order: 19, part: 2, title: '일정표와 단체사진 재해석 — 작전표',
    location: 'Café near Circular Quay', characters: ['지수', '영우'],
    purpose: '반전 4 완성 — 표면상 일정과 실제 기능을 나란히 대조',
    twist: '반전 4 — 관광 일정표는 작전표다',
    believe: '다니엘이 처음부터 이 하루 전체를 설계했다',
    truth: '맞다, 다만 왜 M.K. 열쇠부터였는지는 최종 심문에서 완성',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch20', order: 20, part: 2, title: '다니엘 최종 심문',
    location: 'Pop-up Exhibition', characters: ['지수', '영우', '다니엘'],
    purpose: '신분·사전 인지·설계·회수 네 가지를 8단계 진술 수정으로 차례로 입증',
    twist: '반전 5·6·7·8 완성',
    believe: '(심문 중반까지) 다니엘이 발뺌할 여지가 남아 있다',
    truth: '다니엘이 전시장을 추천하기 전부터 M.K. 표식을 알고 있었다 — 우연한 관광 가이드일 수 없다',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch21', order: 21, part: 2, title: '최종 사건 재구성',
    location: 'Café near Circular Quay', characters: ['지수', '영우'],
    purpose: '12개 사건 조각을 순서대로 배열 + 각 행동의 "목적"을 함께 선택하는 미니게임',
    twist: null,
    believe: '이제 전체 그림을 안다',
    truth: '맞다 — 다만 M.K.의 최종 정체는 여전히 불명',
    newEvidence: [],
    existingSceneId: null,
  },
  {
    id: 'ch22', order: 22, part: 2, title: '엔딩 — M.K.라는 불안',
    location: 'Sydney Accommodation', characters: ['지수', '영우'],
    purpose: '사건 해결 + 장기 미스터리 불안감을 동시에 남기는 엔딩',
    twist: null,
    believe: '사건은 끝났다',
    truth: '이 사건은 더 큰 흐름의 일부였을 뿐이다',
    newEvidence: [],
    existingSceneId: 'week2-scene-013',
  },
];

// 프롬프트는 저장하지 않고 매번 이 함수로 조립한다 — 위 22개 항목 중 하나를
// 고치면 프롬프트도 자동으로 같이 갱신되게 하기 위해서다(따로 손으로 22개
// 프롬프트 문자열을 유지보수하지 않아도 됨).
function buildWeek2RedesignPrompt(ch) {
  const lines = [];
  lines.push(`너는 비주얼노벨 "The Missing Key" 2주차(v4 재구성판)의 대사 작가야.`);
  lines.push(`아래 챕터 한 편의 실제 대사(장면 지문 + 인물 대사)를 써줘.`);
  lines.push('');
  lines.push(`# 챕터: Chapter ${ch.order}. ${ch.title}`);
  lines.push(`- 장소: ${ch.location}`);
  lines.push(`- 등장인물: ${ch.characters.join(', ')}`);
  lines.push(`- 장면 목적: ${ch.purpose}`);
  if (ch.twist) lines.push(`- 관련 반전: ${ch.twist}`);
  lines.push(`- 이 시점에 플레이어가 믿어야 하는 것: ${ch.believe}`);
  lines.push(`- 실제 진실(플레이어에게 직접 노출 금지, 대사는 이 진실과 모순되면 안 됨): ${ch.truth}`);
  if (ch.newEvidence.length) lines.push(`- 이 챕터에서 새로 등록되는 증거/기록: ${ch.newEvidence.join(', ')}`);
  lines.push('');
  lines.push('# 준수 사항');
  lines.push('- 전체 아웃라인 문서는 docs/week2-storyline-outline-v4.md 를 따른다 (인물 성격, 절대 진실, 금지사항 포함).');
  lines.push('- 다니엘은 절대 초반부터 수상하게 굴지 않는다. 실제로 유능하고 친절해야 한다.');
  lines.push('- 레오의 친절은 연기가 아니라 진짜였다는 인상을 유지한다.');
  lines.push('- 이 챕터의 "실제 진실"을 대사로 직접 설명하지 말고, 나중에 다시 보면 의미가 달라지는 자연스러운 행동/대사로만 심는다.');
  lines.push('- 기존 게임 대사 톤(반말/존댓말 혼용, 이모지·말줄임표 활용, 짧은 카톡체 대사)을 참고해서 맞춘다.');
  lines.push('- 씬 전환 포맷은 기존 dev/dialogueData.js 의 다른 씬들과 동일하게 맞춘다.');
  return lines.join('\n');
}
