// 2주차 v4 재설계 — 테스트 가능한 씬 데이터. docs/week2-storyline-outline-v4.md의
// 22개 챕터를 각각 하나의 VN 씬으로 등록한다.
//
// 여기 있는 lines는 전부 "초안"이다 — 각 씬의 실제 최종 대사는
// /dev/week2/redesign/dialogue/ 의 챕터별 AI 프롬프트로 새로 써서 교체하는
// 걸 전제로 한다. 지금은 흐름을 실제로 플레이해볼 수 있도록 최소한의
// 뼈대만 채워뒀다.
//
// 기존 week2Scenes(v3, 실제 서비스 중인 대사)는 절대 건드리지 않는다 — 이
// 파일은 완전히 별도의 id 네임스페이스(`week2v4-ch01` ~ `week2v4-ch22`)를
// 쓰고, dialogueData.js의 weeks/allScenes에는 이 스크립트가 로드된 페이지
// (재설계 탭, /play/game, /dev/upload)에서만 조건부로 합쳐진다 — 로드하지
// 않는 나머지 모든 페이지는 지금과 동일하게 동작한다.
//
// 인물 id는 dialogueData.js의 dialogueCharacters에 이미 등록된 것만 쓴다:
// jisoo(지수) / youngwoo(영우) / minah(윤민아) / adrian(애드리언 콜) /
// leo(레오 박) / claire(클레어 모건) / sophie(소피 첸) /
// daniel-guide(다니엘 리드) / martin(마틴 베일).
const DRAFT_NOTE = '[v4 초안 — 최종 대사는 재설계 탭 프롬프트로 다시 작성 예정]';

function draftLine(id, speaker, text, characterId, expression) {
  const line = { id, speaker, text, characterId };
  if (expression) line.expression = expression;
  return line;
}

const week2v4Scenes = [
  {
    id: 'week2v4-ch01', order: 1, name: 'Ch1. 짧은 아침, 풀리지 않은 열쇠',
    location: 'Sydney Accommodation', introLabel: 'ACCOMMODATION', time: '09:20',
    lines: [
      draftLine('w4-01-note', '', DRAFT_NOTE, null),
      draftLine('w4-01-1', '지수', '이 열쇠, 아직도 뭔지 모르겠어요.', 'jisoo', 'curious'),
      draftLine('w4-01-2', '영우', '오늘은 그거 신경 끄고 그냥 놀자.', 'youngwoo', 'soft'),
      draftLine('w4-01-3', '지수', '네. 오늘은 진짜 관광객처럼요.', 'jisoo', 'happy'),
    ],
  },
  {
    id: 'week2v4-ch02', order: 2, name: 'Ch2. 서큘러키, 우연한 가이드',
    location: 'Circular Quay', introLabel: 'CIRCULAR QUAY', time: '09:40',
    lines: [
      draftLine('w4-02-note', '', DRAFT_NOTE, null),
      draftLine('w4-02-1', '', '오페라하우스를 배경으로 사진을 찍으려는데 앵글이 영 안 나온다.', null),
      draftLine('w4-02-2', '다니엘', '제가 찍어드릴까요? 여기서 찍으면 훨씬 잘 나와요.', 'daniel-guide', 'neutral'),
      draftLine('w4-02-3', '지수', '와, 감사합니다!', 'jisoo', 'happy'),
      draftLine('w4-02-4', '다니엘', '혹시 더 록스 쪽 팝업 전시 가보셨어요? 오늘까지만 하는 걸로 아는데.', 'daniel-guide', 'curious'),
      draftLine('w4-02-5', '', '사진을 찍기 직전, 다니엘의 손이 지수 가방 쪽으로 잠깐 스쳤다 — 그냥 구도를 잡아주는 손짓처럼 보였다.', null),
    ],
  },
  {
    id: 'week2v4-ch03', order: 3, name: 'Ch3. 더 록스, 보관함을 익히다',
    location: 'The Rocks 골목, 카페 앞', introLabel: 'CIRCULAR QUAY', time: '09:55',
    lines: [
      draftLine('w4-03-note', '', DRAFT_NOTE, null),
      draftLine('w4-03-1', '', '골목을 걷던 중, 다른 관광객이 가방을 어디 맡길지 몰라 당황하고 있다.', null),
      draftLine('w4-03-2', '다니엘', '여기 카페에 임시 보관함 있어요, 제가 물어봐 드릴게요.', 'daniel-guide', 'neutral'),
      draftLine('w4-03-3', '영우', '되게 잘 아신다, 여기.', 'youngwoo', 'curious'),
      draftLine('w4-03-4', '다니엘', '이 동네 자주 오다 보니까요.', 'daniel-guide', 'neutral'),
    ],
  },
  {
    id: 'week2v4-ch04', order: 4, name: 'Ch4. 사람들과의 첫 만남',
    location: 'Pop-up Exhibition 입구~내부', introLabel: 'CIRCULAR QUAY', time: '10:10',
    lines: [
      draftLine('w4-04-note', '', DRAFT_NOTE, null),
      draftLine('w4-04-1', '클레어', '어서 오세요, K-01 전시 보러 오셨나요?', 'claire', 'neutral'),
      draftLine('w4-04-2', '', '소피와 짧은 잡담, 윤민아가 뭔가 급히 폰을 숨기는 모습, 애드리언이 K-01 근처를 서성이는 모습이 차례로 지나간다.', null),
      draftLine('w4-04-3', '지수', '어, 저 열쇠 떨어뜨렸나 봐요.', 'jisoo', 'shocked'),
      draftLine('w4-04-4', '레오', '이거 떨어뜨리셨어요. M.K.네요?', 'leo', 'neutral'),
      draftLine('w4-04-5', '지수', '감사합니다!', 'jisoo', 'happy'),
    ],
  },
  {
    id: 'week2v4-ch05', order: 5, name: 'Ch5. 전시장 자유 관람 — 작은 균열들',
    location: 'Pop-up Exhibition, K-01 진열대 앞', introLabel: 'CIRCULAR QUAY', time: '10:25',
    lines: [
      draftLine('w4-05-note', '', DRAFT_NOTE, null),
      draftLine('w4-05-1', '클레어', '저기요, 촬영은 사전 허가된 분만 가능해요.', 'claire', 'annoyed'),
      draftLine('w4-05-2', '윤민아', '아, 죄송해요. 지울게요.', 'minah', 'shocked'),
      draftLine('w4-05-3', '애드리언', '이거, 받침 내부 깊이가 얼마나 되나요?', 'adrian', 'suspicious'),
      draftLine('w4-05-4', '클레어', '그건... 왜 물어보시는 거예요?', 'claire', 'suspicious'),
      draftLine('w4-05-5', '다니엘', '저도 여기 진열장 처음 보는데, 신기하네요.', 'daniel-guide', 'curious'),
    ],
  },
  {
    id: 'week2v4-ch06', order: 6, name: 'Ch6. 단체사진, 평범한 배경',
    location: 'Pop-up Exhibition 입구', introLabel: 'CIRCULAR QUAY', time: '10:35',
    lines: [
      draftLine('w4-06-note', '', DRAFT_NOTE, null),
      draftLine('w4-06-1', '다니엘', '다 같이 한 장 찍을까요? 이쪽으로 서시면 다 나와요.', 'daniel-guide', 'neutral'),
      draftLine('w4-06-2', '레오', '제가 각도 잡아드릴게요.', 'leo', 'neutral'),
      draftLine('w4-06-3', '영우', '레오씨도 사진 잘 찍으시네.', 'youngwoo', 'happy'),
      draftLine('w4-06-4', '', '단체사진이 찍혔다. 다니엘이 사람들 위치를 세밀하게 조정한 뒤였다.', null),
    ],
  },
  {
    id: 'week2v4-ch07', order: 7, name: 'Ch7. K-01 도난 발생',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:47',
    lines: [
      draftLine('w4-07-note', '', DRAFT_NOTE, null),
      draftLine('w4-07-1', '클레어', '어... K-01이, K-01이 없어요!', 'claire', 'shocked'),
      draftLine('w4-07-2', '영우', '카메라부터 확인해보죠.', 'youngwoo', 'serious'),
      draftLine('w4-07-3', '', '카메라 화면은 11분째 같은 장면을 반복해서 내보내고 있었다.', null),
      draftLine('w4-07-4', '지수', '이거... 녹화가 아니라 반복 재생이었어요.', 'jisoo', 'shocked'),
    ],
  },
  {
    id: 'week2v4-ch08', order: 8, name: 'Ch8. 사진 속 인물 찾기',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:52',
    route: '/play/minigame-photo-zoom/',
    lines: [
      draftLine('w4-08-note', '', DRAFT_NOTE + ' (실제로는 기존 사진 미니게임으로 연결됨)', null),
      draftLine('w4-08-1', '영우', '소피가 찍어둔 연속 사진이 있대. 하나씩 보자.', 'youngwoo', 'serious'),
    ],
  },
  {
    id: 'week2v4-ch09', order: 9, name: 'Ch9. 윤민아 1차 심문 — 반전 1',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '11:10',
    lines: [
      draftLine('w4-09-note', '', DRAFT_NOTE, null),
      draftLine('w4-09-1', '영우', '윤민아씨, 사진 지운 거 확인했어요.', 'youngwoo', 'serious'),
      draftLine('w4-09-2', '윤민아', '그건... 범행이랑 상관없어요. 그냥 무단 촬영이라서요.', 'minah', 'shocked'),
      draftLine('w4-09-3', '다니엘', '그러고보니 저도 그때 회색 캡 쓴 남자를 본 것 같아요.', 'daniel-guide', 'neutral'),
      draftLine('w4-09-4', '지수', '윤민아씨 사진, 오히려 사건 전 상태를 보여주는 자료네요.', 'jisoo', 'serious'),
    ],
  },
  {
    id: 'week2v4-ch10', order: 10, name: 'Ch10. 레오를 향한 접근',
    location: 'Pop-up Exhibition / Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '11:40',
    lines: [
      draftLine('w4-10-note', '', DRAFT_NOTE, null),
      draftLine('w4-10-1', '영우', '레오씨, 직원문 쪽 기록에 이름이 있던데요.', 'youngwoo', 'serious'),
      draftLine('w4-10-2', '레오', '어... 그건 그냥 지나간 거예요.', 'leo', 'shocked'),
      draftLine('w4-10-3', '', '레오의 폰이 짧게 울렸다. 그는 화면을 보자마자 흠칫했다.', null),
    ],
  },
  {
    id: 'week2v4-ch11', order: 11, name: 'Ch11. 레오 집중 심문과 K-01 회수 — 반전 2·3',
    location: 'Pop-up Exhibition / Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '12:05',
    lines: [
      draftLine('w4-11-note', '', DRAFT_NOTE, null),
      draftLine('w4-11-1', '레오', '...\n맞아요. 제가 진열장 열었어요.', 'leo', 'blank'),
      draftLine('w4-11-2', '레오', '각인 사진만 찍어달라는 의뢰였는데, 나중에 돈을 더 준다고 해서.', 'leo', 'shocked'),
      draftLine('w4-11-3', '지수', '...그래도 옮기기까지 할 줄은.', 'jisoo', 'shocked'),
      draftLine('w4-11-4', '', 'K-01은 카페 보관함에서 무사히 발견됐다. 사건은 해결된 것처럼 보였다.', null),
      draftLine('w4-11-5', '윤민아', '잠깐만요, 이거... 나사 방향이 사건 전 사진이랑 달라요.', 'minah', 'shocked'),
      draftLine('w4-11-6', '지수', '돌아온 건 K-01이 맞아. 그런데...... 안에 있던 게 없어.', 'jisoo', 'blank', ),
    ],
  },
  {
    id: 'week2v4-ch12', order: 12, name: 'Ch12. 사건의 이름을 다시 붙이다',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '13:00',
    lines: [
      draftLine('w4-12-note', '', DRAFT_NOTE, null),
      draftLine('w4-12-1', '클레어', '등록 무게보다 확실히 가벼워요.', 'claire', 'shocked'),
      draftLine('w4-12-2', '영우', '하단 내부가... 비어 있어.', 'youngwoo', 'serious'),
    ],
  },
  {
    id: 'week2v4-ch13', order: 13, name: 'Ch13. 마틴 베일과의 통화 — 내부 인덱스',
    location: 'Circular Quay 이동 중 (전화)', introLabel: 'CIRCULAR QUAY', time: '13:20',
    lines: [
      draftLine('w4-13-note', '', DRAFT_NOTE, null),
      draftLine('w4-13-1', '마틴', '거긴... 절대 열면 안 되는 곳이었는데.', 'martin', 'neutral'),
      draftLine('w4-13-2', '마틴', '작은 황동 인덱스가 있어요. M.K. 계열 표식이 있는.', 'martin', 'neutral'),
      draftLine('w4-13-3', '지수', 'M.K.... 이 열쇠랑 같은 계열이라고요?', 'jisoo', 'shocked'),
    ],
  },
  {
    id: 'week2v4-ch14', order: 14, name: 'Ch14. 애드리언의 메일함 — 진짜 의뢰 목적',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '13:40',
    lines: [
      draftLine('w4-14-note', '', DRAFT_NOTE, null),
      draftLine('w4-14-1', '애드리언', '...\n좋아요. 메일 보여드릴게요.', 'adrian', 'serious'),
      draftLine('w4-14-2', '', '메일 속 의뢰인은 가격이 아니라 하단 각인의 형태와 분해 가능 여부만 집요하게 물었다.', null),
      draftLine('w4-14-3', '애드리언', '저도 이용당한 거였네요.', 'adrian', 'shocked'),
    ],
  },
  {
    id: 'week2v4-ch15', order: 15, name: 'Ch15. 레오 재심문 — 보관함과 익명 지시',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '14:00',
    lines: [
      draftLine('w4-15-note', '', DRAFT_NOTE, null),
      draftLine('w4-15-1', '레오', '넣고 나서 사진만 보내고 바로 돌아왔어요.', 'leo', 'blank'),
      draftLine('w4-15-2', '레오', '그 뒤에 누가 왔는지는... 저도 몰라요.', 'leo', 'shocked'),
    ],
  },
  {
    id: 'week2v4-ch16', order: 16, name: 'Ch16. 소피의 생활 기억 — 조력자의 균열',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '14:30',
    lines: [
      draftLine('w4-16-note', '', DRAFT_NOTE, null),
      draftLine('w4-16-1', '소피', '그러고보니 다니엘씨, 분실물 맡긴다고 보관함 물어봤었어요.', 'sophie', 'curious'),
      draftLine('w4-16-2', '소피', '주문도 안 했는데 카페 안쪽에 두 번 들어왔었고.', 'sophie', 'curious'),
      draftLine('w4-16-3', '영우', '그냥 친절한 분인 줄 알았는데.', 'youngwoo', 'suspicious'),
    ],
  },
  {
    id: 'week2v4-ch17', order: 17, name: 'Ch17. 신원 조회 — 등록되지 않은 가이드',
    location: 'Pop-up Exhibition / 전화', introLabel: 'CIRCULAR QUAY', time: '15:00',
    lines: [
      draftLine('w4-17-note', '', DRAFT_NOTE, null),
      draftLine('w4-17-1', '지수', '여행사에 확인해봤는데, 다니엘씨 이름이 없대요.', 'jisoo', 'suspicious'),
      draftLine('w4-17-2', '다니엘', '아... 제가 프리랜서라 등록이 좀 늦어졌을 거예요.', 'daniel-guide', 'neutral'),
    ],
  },
  {
    id: 'week2v4-ch18', order: 18, name: 'Ch18. 관광팀의 증언 — 서로 모르는 사람들',
    location: 'Circular Quay', introLabel: 'CIRCULAR QUAY', time: '15:30',
    lines: [
      draftLine('w4-18-note', '', DRAFT_NOTE, null),
      draftLine('w4-18-1', '', '단체사진 속 사람들을 하나씩 찾아가 물었다.', null),
      draftLine('w4-18-2', '', '"저희끼리도 사실 그날 처음 봤어요." 다니엘을 정식 가이드로 기억하는 사람은 없었다.', null),
    ],
  },
  {
    id: 'week2v4-ch19', order: 19, name: 'Ch19. 일정표와 단체사진 재해석 — 작전표',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '16:00',
    lines: [
      draftLine('w4-19-note', '', DRAFT_NOTE, null),
      draftLine('w4-19-1', '영우', '이 일정표, 관광이 아니라 순서였던 거야.', 'youngwoo', 'serious'),
      draftLine('w4-19-2', '지수', '단체사진도... 입구 시야를 가리려던 거고.', 'jisoo', 'shocked'),
    ],
  },
  {
    id: 'week2v4-ch20', order: 20, name: 'Ch20. 다니엘 최종 심문',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '16:30',
    lines: [
      draftLine('w4-20-note', '', DRAFT_NOTE, null),
      draftLine('w4-20-1', '지수', '이 사진, 다시 봐요. 카메라가 아니라 제 열쇠를 보고 있었어요.', 'jisoo', 'serious'),
      draftLine('w4-20-2', '다니엘', '...\n', 'daniel-guide', 'shocked'),
      draftLine('w4-20-3', '다니엘', '작품은 돌려놨잖아요. 진짜 절도는 아니었어요.', 'daniel-guide', 'neutral'),
      draftLine('w4-20-4', '지수', '레오한테 일부만 알려주고 전부 뒤집어씌운 건 어떻게 설명할 건데요.', 'jisoo', 'serious'),
    ],
  },
  {
    id: 'week2v4-ch21', order: 21, name: 'Ch21. 최종 사건 재구성',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '17:30',
    lines: [
      draftLine('w4-21-note', '', DRAFT_NOTE + ' (실제로는 12단계 재구성 미니게임으로 연결 예정)', null),
      draftLine('w4-21-1', '영우', '자, 처음부터 순서대로 다시 맞춰보자.', 'youngwoo', 'serious'),
    ],
  },
  {
    id: 'week2v4-ch22', order: 22, name: 'Ch22. 엔딩 — M.K.라는 불안',
    location: 'Sydney Accommodation', introLabel: 'ACCOMMODATION', time: '21:40',
    lines: [
      draftLine('w4-22-note', '', DRAFT_NOTE, null),
      draftLine('w4-22-1', '', '"그 열쇠, 계속 가지고 있으면 다음엔 우연처럼 끝나지 않을 거예요." 다니엘이 남긴 말이 계속 맴돌았다.', null),
      draftLine('w4-22-2', '지수', '우리, 진짜 우연히 그 전시장에 간 걸까요?', 'jisoo', 'blank'),
      draftLine('w4-22-3', '영우', '...\n모르겠어. 근데 다음부턴 그 열쇠, 나도 같이 신경 쓸게.', 'youngwoo', 'serious'),
    ],
  },
];

const week2v4SceneGroups = [
  { range: 'PART 1', label: '보이는 도난', sceneIds: week2v4Scenes.slice(0, 11).map(s => s.id) },
  { range: 'PART 2', label: '안내자가 만든 사건', sceneIds: week2v4Scenes.slice(11).map(s => s.id) },
];
