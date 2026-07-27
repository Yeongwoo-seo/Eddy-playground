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
//
// storyContext는 photoBrief(사진에 뭘 담을지)와 별개로, 그 증거가 스토리 안에서
// "언제·어디서·누구와 함께" 등장하는지를 담은 필드다 — week2-storyline-outline-v4.md
// §6(챕터·씬 아웃라인)과 §10(갱신표)에서 직접 옮겨온 것. 사진 생성 AI에게 시간대·
// 장소·주변 인물 같은 정보를 줘야 기존에 확정된 배경(예: 서큘러키의 오전 햇빛,
// 전시장의 실내 스포트라이트)과 톤이 어긋나지 않는 사진이 나온다.
const week2v4Evidence = [
  {
    id: 'ev-mk-key', name: 'M.K. 황동 열쇠', firstAppearance: 'Ch1',
    initialMeaning: '1주차의 미해결 기념품', part1Meaning: 'K-01 각인과 닮은 표식',
    finalMeaning: '다니엘이 지수에게 접근한 이유이자 사건 전 인지의 증거',
    photoBrief: '손바닥 위 또는 협탁 위에 놓인 작은 황동 열쇠 클로즈업. 오래되어 살짝 녹슨 듯한 색감, "M.K." 각인이 겨우 알아볼 정도로만 도드라진 실루엣(각인 자체는 확대해야 보이는 수준).',
    storyContext: 'Ch1 Scene 1-1, 시드니 숙소(Eastwood) 실내, 아침. 짐을 챙기던 지수·영우가 전날 밤(1주차 엔딩) 환기구에서 찾은 열쇠를 다시 살펴보는 순간 — 이 시점엔 그냥 신기한 기념품이지만, 실제로는 다니엘이 하루 전체를 설계하게 만든 원인이다.',
    needsNewPhoto: false,
    reuseHint: '1주차부터 등장한 실제 아이템 사진(ITEM ACQUIRED — UNKNOWN KEY)을 그대로 재사용 — 아이템 DB에 이미 등록되어 있다.',
  },
  {
    id: 'ev-circular-quay-photo', name: '서큘러키 커플 사진', firstAppearance: 'Ch2',
    initialMeaning: '관광 기념사진', part1Meaning: '다니엘의 초기 알리바이',
    finalMeaning: '다니엘이 M.K. 열쇠를 보고 있었고 명찰이 위조됐음을 보여주는 사진',
    photoBrief: '오페라하우스를 배경으로 지수가 웃으며 포즈를 취한 스냅샷 구도. 다니엘은 프레임 가장자리(어깨 너머 또는 뒤편)에서 카메라가 아니라 지수의 가방/손에 들린 열쇠 쪽을 살짝 내려다보는 시선으로 걸려 있다 — 처음엔 그냥 "구도를 잡아주는 손짓"처럼 자연스럽게 보이되, 확대하면 시선의 방향이 명확히 열쇠를 향하게.',
    storyContext: 'Ch2 Scene 2-1, 서큘러키 산책로, 화창한 오전. 앵글이 잘 안 나와 곤란해하던 지수·영우에게 다니엘이 먼저 다가와 사진을 찍어주겠다고 제안한 직후 — 이것이 다니엘의 첫 번째 긍정적 관계 형성 장면이다. 이 사진은 Ch20 최종 심문의 "두 시점 비교 슬라이더" 결정타로 다시 쓰이므로, 확대해도 시선 방향이 뭉개지지 않을 고해상도가 필요하다.',
    needsNewPhoto: true,
    reuseHint: '미니게임(K-01 두 시점 비교 슬라이더) Ch20 결정타에서 이 사진을 확대판으로 재사용하므로, 고해상도로 한 번만 제작해도 된다.',
  },
  {
    id: 'ev-itinerary', name: '관광 일정표', firstAppearance: 'Ch3',
    initialMeaning: '평범한 투어 일정', part1Meaning: '다니엘의 이동 기록',
    finalMeaning: '군중 배치·직원문 확인·보관함 회수를 정리한 작전표',
    photoBrief: '손에 든 A5 크기 인쇄물 또는 접힌 안내지 클로즈업. 시간대별 칸이 표처럼 나뉜 레이아웃 실루엣만 보이면 충분(실제 읽을 수 있는 글자는 넣지 않는다 — 세부 항목은 게임 UI 텍스트로 별도 표시).',
    storyContext: 'Ch3 Scene 3-1, 더 록스 골목 카페 앞, 낮. 다니엘이 하루 종일 손에 들고 다니는 소품으로 처음 등장 — 이 시점엔 평범한 투어 일정표로만 보인다. Ch19에서 지수·영우가 이 표를 "서큘러키 기념사진=열쇠 확인 / 골목 안내=직원문·보관함 점검 / 단체사진=시야 차단 / 카페 휴식=K-01 회수"로 항목별 재해석하므로, 표의 칸 구획이 시간대순으로 명확히 나뉘어 보여야 재해석 UI와 맞아떨어진다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-daniel-badge', name: '다니엘 명찰', firstAppearance: 'Ch2',
    initialMeaning: '가이드 신분 증명', part1Meaning: '여행사 소속 확인 자료',
    finalMeaning: '행사 임시 패스를 개조한 위장 출입증',
    photoBrief: '목에 건 랜야드형 명찰 클로즈업. 코팅된 카드 표면의 반사광, 사진란/로고 자리는 흐릿하게 처리해 실제 글자나 얼굴 사진이 읽히지 않게(위조 여부는 게임 UI 설명으로 전달).',
    storyContext: 'Ch2 Scene 2-1, 서큘러키 산책로, 야외 오전 채광 아래 다니엘이 목에 걸고 있는 모습으로 첫 등장(가이드 신분 증명처럼 보임). Ch17에서 여행사 미등록이 밝혀지고, Ch20 최종 심문에서 행사 임시 패스를 개조한 위장 출입증으로 확정된다 — "이름 부분만 스티커처럼 새것으로 보인다"는 확대 관찰 포인트가 후속 챕터에 있으므로, 이름란 주변 코팅 결이 다른 부분보다 살짝 미묘하게 달라 보이면 좋다(과하게 티나지 않게).',
    needsNewPhoto: true,
  },
  {
    id: 'ev-grey-cap', name: '회색 캡 목격담', firstAppearance: 'Ch9',
    initialMeaning: '레오를 본 목격 정보', part1Meaning: '다니엘의 기억 오류',
    finalMeaning: '레오에게 혐의를 집중시키기 위한 의도적 유도',
    photoBrief: '이건 물증이 아니라 증언이라 단독 사진보다, 다른 사진(단체사진/전시장 스냅샷) 한쪽 구석에 회색 캡을 쓴 인물의 뒷모습/옆모습이 흐릿하게 걸린 배경 디테일로 표현하는 편이 자연스럽다. 얼굴은 보이지 않게, 캡의 색과 실루엣만 식별 가능하게.',
    storyContext: 'Ch9 Scene 9-1(윤민아 1차 심문, 전시장 실내) 중 다니엘이 증언하는 목격담 — 실제 목격 시점은 Ch6 단체사진(전시장 입구, 낮) 무렵으로 설정한다. 이 시점엔 "단순 실수로 보여도 되는" 정도로만 다뤄야 하며, Ch20에서야 레오에게 혐의를 몰아가려는 의도적 유도였음이 드러난다.',
    needsNewPhoto: true,
    reuseHint: '독립된 사진이 필요하다기보다, Ch6 단체사진이나 Ch5 전시장 배경 한 켠에 이 인물을 심어 넣는 방식을 우선 검토한다.',
  },
  {
    id: 'ev-mina-photo', name: '윤민아의 확대 사진', firstAppearance: 'Ch5',
    initialMeaning: '무단 촬영 자료', part1Meaning: '윤민아의 알리바이와 레오 접근 흔적',
    finalMeaning: '사건 전 K-01 내부 결합 상태를 증명하는 기준 사진',
    photoBrief: '스마트폰으로 몰래 찍은 듯 살짝 기울어진 구도의 K-01 하단부 접사 사진. 받침과 몸체가 맞물린 결합선, 나사 머리 방향이 뚜렷이 보이는 클로즈업 — 이후 회수된 K-01 사진과 비교했을 때 나사 방향 차이를 알아볼 수 있어야 한다.',
    storyContext: 'Ch5 Scene 5-1, 전시장 K-01 진열대 앞, 실내 스포트라이트 조명. 윤민아가 클레어 몰래 K-01 하단을 촬영하다 걸려 사진 일부를 급히 지우는 순간에 찍힌 것 — 도난(Ch7)보다 먼저 찍혔으므로 사건 전 "정상" 결합 상태를 담아야 한다. Ch11-2에서 회수된 K-01과 나란히 놓고 나사 방향·결합선 위치·무게 차이를 비교하는 근거 사진으로 재사용된다.',
    needsNewPhoto: true,
    reuseHint: 'K-01 두 시점 비교 슬라이더 미니게임(mg-k01-compare)의 "사건 전" 사진과 같은 앵글로 맞춰서 만들면 두 번 쓸 수 있다.',
  },
  {
    id: 'ev-leo-bag', name: '레오의 크로스백', firstAppearance: 'Ch10',
    initialMeaning: '평범한 소지품', part1Meaning: 'K-01 반출 도구',
    finalMeaning: '다니엘이 선택한 희생양 구조와 부분 의뢰의 증거',
    photoBrief: '어두운 색 캔버스/나일론 크로스백 클로즈업. 지퍼가 살짝 열려 안쪽에 완충재 일부가 비치는 각도, 직원 유니폼과 함께 걸쳐진 자연스러운 스냅샷.',
    storyContext: 'Ch10 Scene 10-1, 전시장~서큘러키 인근 카페 동선. 레오가 직원 잡일을 도우며 늘 메고 다니던 가방으로 처음 조사 대상에 오른다 — 도난 직후 사진 속 가방 부피가 두꺼워진 것이 Ch11-1 자백을 끌어내는 핵심 근거이므로, "안에 뭔가 들어있어 보이는" 부풀어 오른 인상이 은근히 느껴져야 한다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-packing-foam', name: '잘린 완충재', firstAppearance: 'Ch10',
    initialMeaning: '행사 쓰레기', part1Meaning: 'K-01 포장 흔적',
    finalMeaning: '레오의 실행은 입증하지만 내부 인덱스 회수는 설명하지 못함',
    photoBrief: '바닥 또는 쓰레기통 근처에 놓인 스티로폼/에어캡 조각 클로즈업. 깔끔하게 잘린 단면이 도드라지게, K-01 크기에 맞춰 파낸 자국이 남아있는 모습.',
    storyContext: 'Ch10, 레오가 K-01을 포장했던 직원 구역 또는 카페 인근 쓰레기통 주변에서 발견된다. Ch11-1에서 레오가 "K-01을 잠시 옮겼지만 훔칠 생각은 없었다"고 자백할 때 물리적 반출을 뒷받침하는 증거로 제시되지만, 3부에서는 내부 인덱스 회수(다니엘의 몫)까지는 설명하지 못하는 한계도 함께 드러난다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-cafe-storage-log', name: '카페 보관함 기록', firstAppearance: 'Ch3',
    initialMeaning: '일상적인 보관 기록', part1Meaning: 'K-01 회수 장소',
    finalMeaning: '레오 이후 다니엘이 다시 접근할 수 있었음을 증명',
    photoBrief: '카페 바 안쪽, 손님 보관함 앞에 놓인 종이 대장 또는 태블릿 화면 클로즈업. 시간과 칸 번호가 적힌 표 형태의 레이아웃 실루엣만(실제 읽히는 글자는 넣지 않는다).',
    storyContext: 'Ch3 Scene 3-1, 더 록스 골목 카페(서큘러키 인근)에서 다니엘이 다른 관광객의 분실 가방을 도와주며 자연스럽게 처음 등장(사소한 친절처럼 보임). Ch11-2에서 K-01 회수 장소로 쓰이고, Ch15에서 "레오 이후 다니엘이 다시 접근할 수 있었던 지점"으로 의미가 갱신된다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-k01', name: 'K-01', firstAppearance: 'Ch7',
    initialMeaning: '도난당한 작품', part1Meaning: '레오가 훔쳤다가 회수된 작품',
    finalMeaning: '내부 인덱스가 제거된 껍데기이자 두 번째 사건의 현장',
    photoBrief: '전시대 위 유리 케이스 안에 놓인 골동품풍 오브제(정교한 황동 장식이 있는 상자/조형물) — 전체 샷과 하단부 클로즈업 두 앵글이 필요하면 함께 준비.',
    storyContext: 'Ch5(자유 관람)부터 Ch7(도난 발생)까지 전시장 K-01 진열대(실내 스포트라이트 조명)에 놓여 있다. Ch11-2에서 카페 보관함에서 무사히 회수되지만, Ch12에서 무게·나사 방향·결합선이 사건 전과 달라져 있음이 확인되며 "내부 인덱스가 제거된 껍데기"로 재정의된다 — 전체 샷은 도난 전(멀쩡한 상태), 하단부 클로즈업은 회수 후(빈 내부) 대조에 각각 쓰일 수 있게 준비한다.',
    needsNewPhoto: true,
    reuseHint: '기존(v3) 2주차에 이미 K-01 전시 사진이 있다면 그대로 재사용 가능한지 먼저 확인 — 있다면 새로 찍을 필요 없음.',
  },
  {
    id: 'ev-mk-consult-message', name: 'MK_Consult 메시지', firstAppearance: 'Ch11',
    initialMeaning: '익명 촬영 의뢰', part1Meaning: '레오를 움직인 배후',
    finalMeaning: '다니엘의 작전 통신이자 표현 습관·현장 정보와 연결되는 증거',
    photoBrief: '스마트폰 메신저 앱 화면을 옆에서 살짝 비스듬히 찍은 듯한 구도. 말풍선 레이아웃과 발신자 아이콘("MK_Consult"라는 이름 대신 익명 아바타)은 보이되, 본문 글자는 흐릿하게 처리(실제 대사는 게임 UI 텍스트로 별도 표시).',
    storyContext: 'Ch11-1, 레오 집중 심문(전시장) 중 레오가 공개하는 자신의 폰 화면 — 각인 사진만 찍어달라는 짧고 사무적인 지시가 특징이다("지시는 늘 짧고 사무적이었다"는 레오의 대사가 복선). Ch14 애드리언의 의뢰인 메일과 문체가 닮았다는 인상을 흘려야 하고, Ch20 최종 심문에서 다니엘의 실제 통신 수단으로 확정된다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-group-photo', name: '관광팀 단체사진', firstAppearance: 'Ch6',
    initialMeaning: '즐거운 단체 사진', part1Meaning: '다니엘의 투어 진행 증명',
    finalMeaning: '정식 관광팀이 아니며 군중 위치가 의도적으로 배치됐다는 증거',
    photoBrief: '전시장 입구 앞, 지수·영우·다니엘을 포함한 여러 인원이 나란히 서서 찍은 단체 스냅샷 구도. 인물들의 배치가 입구 시야를 절묘하게 가리는 각도임을 알 수 있게(나중에 다시 보면 "의도적 배치"로 읽히도록), 얼굴은 이름 있는 주연 캐릭터를 제외한 이름 없는 인물들로 채운다.',
    storyContext: 'Ch6 Scene 6-1, 전시장 입구, 낮. 다니엘이 사람들 위치를 세밀히 조정하며 단체사진을 제안하고 레오가 촬영을 돕는 장면 — 다니엘의 세 번째 긍정적 관계 형성이자 레오와의 두 번째 신뢰 형성이라 이 시점엔 훈훈한 기념사진처럼 보여야 한다. Ch18에서 참가자들이 서로 초면이었음이 밝혀지고, Ch19에서 "입구 시야를 가리는 배치"라는 진짜 기능이 재해석된다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-cafe-locker-system', name: '카페 임시 보관함 시스템', firstAppearance: 'Ch3',
    initialMeaning: '사소한 친절', part1Meaning: '(자료 없음)',
    finalMeaning: '회수 단계에 필요한 구조와 코드를 확인한 흔적',
    photoBrief: '카페 안쪽 벽면에 설치된 락커형 보관함 캐비닛 전체 샷. 번호가 매겨진 여러 칸, 그중 하나가 살짝 열려 있거나 사용 중 표시가 있는 디테일.',
    storyContext: 'Ch3 Scene 3-1, 더 록스 골목 카페. 다니엘이 다른 관광객의 분실 가방 문제를 대신 해결해주며 지수·영우도 옆에서 구조를 자연히 목격한다 — 겉으론 오지랖 넓은 친절이지만, 실제로는 다니엘이 회수 단계에 필요한 보관함 구조와 공용 임시 코드를 확인하는 순간이다(다니엘이 번호판을 필요 이상으로 오래 들여다보는 디테일).',
    needsNewPhoto: false,
    reuseHint: '카페(loc-cafe) 배경 사진 안에 이미 포함되는 요소 — 별도 단독 사진 대신 카페 배경 프롬프트에서 이 캐비닛이 잘 보이도록 요청하는 방식으로 처리한다.',
  },
  {
    id: 'ev-adrian-client-email', name: '애드리언의 의뢰인 메일', firstAppearance: 'Ch4/Ch14',
    initialMeaning: '비공식 매입 정황', part1Meaning: '(미확인)',
    finalMeaning: '의뢰인이 가격보다 각인·구조에만 관심 있었다는 증거',
    photoBrief: '노트북 또는 태블릿 메일 클라이언트 화면 클로즈업. 발신자란에 "M.K."만 적힌 짧은 스레드 레이아웃(제목/본문 줄 수만 표현, 실제 읽히는 문장은 넣지 않는다).',
    storyContext: 'Ch4에서 애드리언의 비공식 매입 정황으로 처음 암시되고, Ch14 Scene 14-1(전시장, 낮)에서 애드리언이 직접 메일 일부를 공개하며 실체가 드러난다 — 의뢰인이 가격이 아니라 하단 각인의 정확한 형태·받침 내부 깊이·분해 가능 구조 여부만 집요하게 캐물었다는 점이 핵심이며, 문체가 훗날 MK_Consult 메시지와 닮았다는 인상을 은근히 남겨야 한다.',
    needsNewPhoto: true,
  },
  {
    id: 'ev-k01-weight', name: 'K-01 등록 무게', firstAppearance: 'Ch5/Ch12',
    initialMeaning: '일상적인 관리 대장', part1Meaning: '(미확인)',
    finalMeaning: '내부 부품 소실의 물증',
    photoBrief: '전시 등록 대장(바인더 또는 태그) 클로즈업 — 무게 항목 칸에 숫자가 적힌 레이아웃만 보이면 충분, 또는 소형 디지털 저울 위에 K-01을 올려둔 손 클로즈업.',
    storyContext: 'Ch5(전시장, 자유 관람 중 클레어의 목록 위에 잠깐 스치듯 보이는 선택적 디테일)와 Ch12 Scene 12-1(전시장, 정밀 조사)에서 두 차례 등장한다. 처음엔 그냥 일상적인 관리 대장처럼 보이지만, Ch12에서 클레어가 회수된 K-01을 저울에 다시 올려 등록 무게와 대조하며 확실히 가벼워졌음을 공식 확인 — 내부 부품 소실을 뒷받침하는 물증으로 갱신된다.',
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
  if (ev.storyContext) {
    lines.push('');
    lines.push('# 이 증거가 등장하는 장면 (촬영 시 참고 — 시간대·장소·주변 인물과의 톤을 맞추는 용도, 화면에 직접 드러날 필요는 없음)');
    lines.push(`- ${ev.storyContext}`);
  }
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
