/* OPERATION MK — WEEK 0 · SCENE 01 v4 「진짜 왔네」
   Dialogue Set: dialogue-week0-scene001-v4
   Scene: week0-scene-001 (Sydney Airport Arrival Area, 09:30)
   Merged into week0-scene-flight (see that scene's header comment) — its
   first line below carries the sceneTransition into this location. */

// role 'protagonist' gets its own dedicated CharacterTransform; every other
// role shares one common default transform (see DevGameState in assetDb.js) —
// tune it once on any non-protagonist character and it applies to all of them.
// `expressions` lists which of the 10 dialogueExpressions below this
// character actually needs — per the "최종 감정 이미지 최소 제작표" in the
// character-art spec (44 portraits total across all 11 characters). 인물 DB's
// 감정표현 picker in /dev/upload only offers these, so NPCs can't be uploaded
// under an emotion the story never uses for them.
const dialogueCharacters = [
  { id: 'jisoo', name: '지수', role: 'protagonist', expressions: ['neutral', 'happy', 'annoyed', 'shocked', 'smirk', 'suspicious', 'serious'] },
  { id: 'youngwoo', name: '영우', role: 'other', expressions: ['neutral', 'happy', 'soft', 'smirk', 'shocked', 'serious'] },
  { id: 'mika', name: '미카 코바치', role: 'other', expressions: ['neutral', 'annoyed', 'shocked', 'suspicious', 'serious'] },
  { id: 'minah', name: '윤민아', role: 'other', expressions: ['neutral', 'annoyed', 'shocked'] },
  { id: 'adrian', name: '애드리언 콜', role: 'other', expressions: ['neutral', 'suspicious', 'serious'] },
  { id: 'leo', name: '레오 박', role: 'other', expressions: ['neutral', 'blank', 'shocked', 'serious'] },
  { id: 'sora', name: '한소라', role: 'other', expressions: ['neutral', 'happy', 'shocked', 'serious'] },
  { id: 'ethan', name: '이든 브룩스', role: 'other', expressions: ['neutral', 'annoyed'] },
  { id: 'daniel', name: '다니엘 우', role: 'other', expressions: ['neutral', 'shocked', 'annoyed'] },
  { id: 'noah', name: '노아 리', role: 'other', expressions: ['neutral', 'curious', 'serious'] },
  { id: 'evelyn', name: '에블린 쇼', role: 'other', expressions: ['neutral', 'suspicious', 'shocked', 'serious'] },
];

// Every dialogue line's `expression` field is one of these ids — 인물 DB
// (character upload) registers one image per (character, expression) pair,
// and /dev/game looks that pair up to pick the portrait for each line.
const dialogueExpressions = [
  { id: 'neutral', label: '기본' },
  { id: 'happy', label: '기쁨' },
  { id: 'annoyed', label: '짜증' },
  { id: 'shocked', label: '놀람' },
  { id: 'soft', label: '다정' },
  { id: 'smirk', label: '장난' },
  { id: 'suspicious', label: '의심' },
  { id: 'blank', label: '멍함' },
  { id: 'curious', label: '호기심' },
  { id: 'serious', label: '진지' },
];

// Sentinel "expression" a minigame face photo is stored/looked up under in
// the same (character, expression) asset map 인물 DB uses — not a real mood,
// just one dedicated square close-up per character for small in-minigame
// portrait slots (e.g. minigame-eastwood's dlg-strip), which look wrong
// scaled down from a half-body 표정 crop. See "미니게임 얼굴 DB" in
// /dev/upload.
const MINIGAME_FACE_EXPRESSION = 'minigame-face';

/* OPERATION MK — WEEK 0 · SCENE 00 「시드니 상공」 v3
   Dialogue Set: dialogue-week0-scene-flight
   Scene: week0-scene-flight (In flight, 10 minutes before landing)
   No mystery here — per the brief, 0주차 opens on anticipation and reunion,
   not plot. This is purely the "지수 시점 오프닝 + 카톡" beat.
   Merged with week0Scene001Lines below (both part of the same "도착" beat,
   no minigame in between) — the location change from In Flight to Sydney
   Airport Arrival Area is carried by a `sceneTransition` marker on that
   array's first line instead of a scene-list split. See week0Scenes'
   week0-scene-flight entry (locations: [...]) for the two background slots
   this scene now needs. */
const week0SceneFlightLines = [
  { id: 'line-001', speaker: '', text: '시드니 상공.\n착륙 10분 전.', characterId: null },
  { id: 'line-002', speaker: '', text: '구름 아래로 도시의 윤곽이 천천히 드러났다.\n낯선 도로와 건물 사이로 아침 햇빛이 번졌다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '와...', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-004', speaker: '지수', text: '진짜 다 왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '', text: '기내에 착륙 안내방송이 흐른다.\n"곧 시드니 킹스포드 스미스 공항에 착륙하겠습니다."', characterId: null },
  { id: 'line-006', speaker: '', text: '지수가 비행기 모드를 해제하자마자\n쌓여 있던 메시지가 한꺼번에 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '영우', text: '착륙했어??', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-008', speaker: '영우', text: '나 도착층 B 출구 앞이야\n천천히 나와 ㅎㅎ', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-009', speaker: '지수', text: '오', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '지수', text: '이번엔 위치 설명이 정확한데요??', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-011', speaker: '영우', text: '나 호주 살면서 성장했어', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-012', speaker: '지수', text: '아직 검증 전입니다\n서영우씨', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-013', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n일단 착륙부터 하세요 손님', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '가고 있잖아요오\n지금 하늘인데 어케 빨리 가!!!!', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '', text: '지수는 웃으며 폰을 내려놓았다.\n\n조금 전까지는 여행을 간다는 느낌뿐이었는데,\n이제는 정말 영우를 만나러 왔다는 실감이 났다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-016', speaker: '', text: '설렘 반, 긴장 반.\n\n시드니가 창밖에서 점점 가까워지고 있었다.', characterId: null },
];

// Pure stage-direction beats (no speaker) use characterId to say who, if
// anyone, stays on screen for that beat — keeps the portrait from flickering
// out and back in across a beat with no line of its own.
const week0Scene001Lines = [
  {
    id: 'line-001', speaker: '', text: '시드니 공항.\n오전 9시 30분.', characterId: null,
    sceneTransition: { backgroundKey: 'week0-scene-flight--arrival', introLabel: 'SYDNEY', time: '09:30' },
  },
  { id: 'line-002', speaker: '', text: '긴 입국 절차를 마친 지수가\n캐리어를 끌고 도착층으로 나왔다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: 'B 출구...', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: 'B가 어디야.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-005', speaker: '영우', text: '지수야아아!!!!', characterId: null },
  { id: 'line-006', speaker: '', text: '익숙한 목소리에 지수가 고개를 든다.\n사람들 사이에서 영우가 한 손을 높이 흔들고 있었다.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '지수', text: '헐.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '지수', text: '영우우우우!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009', speaker: '', text: '지수가 캐리어를 끌며 빠르게 다가간다.\n영우는 웃으면서 지수의 캐리어 손잡이를 받아 들었다.', characterId: null },
  { id: 'line-010', speaker: '영우', text: '와\n진짜 왔네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-011', speaker: '지수', text: '그니까!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '지수', text: '나 진짜 왔어 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-013', speaker: '영우', text: 'ㅎㅎ\n너무 보고 싶었어', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-014', speaker: '지수', text: '아니 왜저래애애', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-015', speaker: '지수', text: '도착하자마자 그러기 있어요?????', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-016', speaker: '영우', text: '보고 싶었으니까\n보고 싶었다고 하지', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-017', speaker: '지수', text: '미쳤나봐아아\n사람들 다 있자나!!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-018', speaker: '', text: '지수가 영우의 팔을 가볍게 때린다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-019', speaker: '지수', text: '바부야 👊', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-020', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그래도 웃네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-021', speaker: '지수', text: '반가워서 봐주는 거예요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-022', speaker: '영우', text: '오\n입국 첫날 특별사면이네', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-023', speaker: '지수', text: '마자.\n오늘만이에요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-024', speaker: '', text: '서로 얼굴을 보고 웃고 있는데도\n아직 화면 속 사람을 보는 것처럼 조금 낯설었다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-025', speaker: '영우', text: '왜 그렇게 봐?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-026', speaker: '지수', text: '그냥.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-027', speaker: '지수', text: '맨날 폰 안에 있던 사람이\n진짜 앞에 있어서.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-028', speaker: '영우', text: '나도 그래.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-029', speaker: '영우', text: '근데 화면보다 훨씬 좋다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-030', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-031', speaker: '지수', text: '아 진짜\n오늘 왜 이래애.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-032', speaker: '영우', text: '오늘만 특별사면이라며\n할 말 다 해야지', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-033', speaker: '지수', text: '취소할까.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-034', speaker: '영우', text: '아니\n벌써요?????', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-035', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n잘해요 그럼.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-036', speaker: '영우', text: '네에\n최선을 다하겠습니다', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-037', speaker: '', text: '두 사람은 도착층을 빠져나가기 시작했다.\n영우는 자연스럽게 캐리어를 끌고,\n지수는 그 옆에 바짝 붙어 걸었다.', characterId: null },
  { id: 'line-038', speaker: '지수', text: '근데 영우.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-039', speaker: '영우', text: '웅웅', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-040', speaker: '지수', text: '시드니 입국 서비스\n현재까지 별 다섯 개예요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-041', speaker: '영우', text: '오\n캐리어 들어줘서?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-042', speaker: '지수', text: '그것도 있고.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-043', speaker: '지수', text: '마중 나온 사람이 마음에 들어서.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-044', speaker: '영우', text: '아.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-045', speaker: '지수', text: '왜\n갑자기 조용해졌어????', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-046', speaker: '영우', text: '아니\n그건 좀 반칙이지', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-047', speaker: '지수', text: '헤헤\n내가 이겼다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-048', speaker: '영우', text: '이게 왜 승부야 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-049', speaker: '지수', text: '방금부터 승부였어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-050', speaker: '영우', text: '아 진짜 지수답네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-051', speaker: '지수', text: '칭찬이죠?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-052', speaker: '영우', text: '웅.\n개칭찬.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-053', speaker: '지수', text: '야르.\n인정해드립니다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-054', speaker: '', text: '영우가 휴대폰으로 이동 경로를 확인한다.\n지수가 옆에서 화면을 슬쩍 들여다본다.', characterId: null },
  { id: 'line-055', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-056', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-057', speaker: '지수', text: '아까부터 화면 왜 자꾸 빨리 꺼요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-058', speaker: '영우', text: '내가?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-059', speaker: '지수', text: '웅.\n뭐 숨기죠.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-060', speaker: '영우', text: '아닌데.\n그냥 길 보는 건데.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-061', speaker: '지수', text: '흐으음.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-062', speaker: '영우', text: '왜\n입국 심사 한 번 더 받아야 돼?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-063', speaker: '지수', text: '일단 보류.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-064', speaker: '지수', text: '근데 쌤 뭔가 있는 건 알아요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-065', speaker: '영우', text: '와\n벌써 시작이네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-066', speaker: '지수', text: '그러니까 잘 숨겨요.\n제가 찾아낼 거니까.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-067', speaker: '영우', text: '일단 숙소 가는 길부터 찾아내 주세요\n김탐정님', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-068', speaker: '지수', text: '오키.\n그건 제가 해드리죠.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-069', speaker: '', text: '지수의 첫날은,\n아직까지는 평범한 여행에 가까웠다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 05 「진짜 같이 있네」
   Dialogue Set: dialogue-week0-scene002-1
   Scene: week0-scene-002-1 (Sydney Accommodation, 20:18)
   Merged with week0SceneDinnerLines + week0SceneChargerLines below (no
   minigame in between) into one registry entry — heading out to dinner and
   back are both plain location changes now, carried by `sceneTransition`
   markers on those arrays' first lines instead of separate scene-list
   entries. The phone goes missing later that night, in the charger portion,
   which still ends on its own minigame handoff. */
const week0Scene002_1Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n오후 8시 18분.', characterId: null },
  { id: 'line-002', speaker: '', text: '공항에서 나온 뒤,\n두 사람은 짐을 맡기고 근처를 천천히 둘러봤다.\n\n긴 이동과 체크인까지 마치고 나서야\n드디어 예약한 방 앞에 도착했다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '여기야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-005', speaker: '지수', text: '진짜 여기 맞아요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-006', speaker: '영우', text: '웅.\n왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '생각보다 너무 좋은데????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '영우', text: '그치.\n사진보다 괜찮지?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '지수', text: '흐으음.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '영우', text: '그 표정 뭐야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '영우가 고른 숙소치고\n너무 완벽해서요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '아니 내가 평소에 뭘 어떻게 했길래!!!!', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-013', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n칭찬이에요 칭찬.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '영우', text: '전혀 칭찬처럼 안 들렸는데요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-015', speaker: '지수', text: '중요한 건 결과죠.\n일단 들어가 봅시다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '', text: '영우가 카드키를 대고 문을 연다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-017', speaker: '지수', text: '헐.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-018', speaker: '지수', text: '우와아아아!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-019', speaker: '', text: '지수는 방 안으로 들어서자마자\n창가 쪽으로 빠르게 걸어갔다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-020', speaker: '영우', text: '지수야.\n캐리어는 두고 가지 그래.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-021', speaker: '지수', text: '아.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-022', speaker: '지수', text: '영우가 들고 있잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-023', speaker: '영우', text: '왜 이렇게 자연스러워?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-024', speaker: '지수', text: '적응 완료.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-025', speaker: '영우', text: '입국한 지 하루도 안 됐는데 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-026', speaker: '지수', text: '영우 여기 와봐요.\n창문 진짜 크다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-027', speaker: '', text: '영우가 캐리어를 세워두고\n지수 옆으로 다가간다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-028', speaker: '지수', text: '이상하다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-029', speaker: '영우', text: '뭐가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-030', speaker: '지수', text: '나 지금 시드니 숙소에 있고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-031', speaker: '지수', text: '옆에 영우 있고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-032', speaker: '지수', text: '진짜 같이 있네.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-033', speaker: '영우', text: '그러게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034', speaker: '영우', text: '이제야 좀 실감 난다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-035', speaker: '지수', text: '나도.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-036', speaker: '', text: '두 사람은 잠시 말없이 창밖을 바라봤다.\n\n화면 너머로 수없이 상상했던 시간이\n아무렇지 않게 현실이 되어 있었다.', characterId: null },
  { id: 'line-037', speaker: '영우', text: '근데 여행 첫날 평가\n몇 점이야?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-038', speaker: '지수', text: '음.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-039', speaker: '지수', text: '길찾기 A.\n\n숙소 A+.\n\n체력은 둘 다 C.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-040', speaker: '영우', text: '남자친구 항목은?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-041', speaker: '지수', text: '그건 아직 심사 중.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-042', speaker: '영우', text: '아니 왜!!!!', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-043', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n반응이 너무 재밌어서.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-044', speaker: '영우', text: '이의 신청합니다.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-045', speaker: '지수', text: '그럼 지금은 A.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-046', speaker: '영우', text: 'A+ 아니고?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-047', speaker: '지수', text: '욕심내면 내려가요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-048', speaker: '영우', text: '네.\n조용히 있겠습니다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-049', speaker: '지수', text: '구래구래.\n아주 좋아요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-050', speaker: '', text: '잠시 방에서 쉬고 난 뒤,\n두 사람은 늦은 저녁을 먹으러 다시 숙소를 나섰다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 06 「첫날 저녁」
   Dialogue Set: dialogue-week0-scene-dinner
   Scene: week0-scene-dinner (근처 식당, 21:10)
   No mystery — per the brief, just food/photos/a short tired spat that
   resolves fast. Merged into week0-scene-002-1 (see that scene's header
   comment) — its first line below carries the sceneTransition into this
   location. */
const week0SceneDinnerLines = [
  {
    id: 'line-001', speaker: '', text: '숙소 근처 작은 식당.\n오후 9시 10분.', characterId: null,
    sceneTransition: { backgroundKey: 'week0-scene-002-1--dinner', introLabel: 'DINNER', time: '21:10' },
  },
  { id: 'line-002', speaker: '', text: '영우가 미리 찾아둔 식당은\n크지는 않았지만 따뜻한 조명과 음식 냄새로 가득했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '헐.\n여기 냄새 미쳤다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '영우', text: '그치?\n여기 괜찮아 보여서 저장해놨어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-005', speaker: '지수', text: '오늘 준비성 점수 계속 올라가는데요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-006', speaker: '영우', text: 'A+ 가능합니까.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-007', speaker: '지수', text: '일단 음식 먹어보고요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '영우', text: '평가가 엄격하네 진짜.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '지수', text: '영우 뭐 먹을 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-010', speaker: '영우', text: '나는 이거.\n지수는?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-011', speaker: '지수', text: '저는 이거 먹고 싶은데\n영우 것도 먹고 싶어요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '그럼 다른 거 두 개 시켜서 나눠 먹자.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-013', speaker: '지수', text: '오.\n바로 A+.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '영우', text: '이렇게 쉬운 거였어?????', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-015', speaker: '지수', text: '먹는 건 중요하니까요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '', text: '음식이 나오자\n지수는 여러 각도에서 사진을 찍기 시작했다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-017', speaker: '영우', text: '지수야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-018', speaker: '지수', text: '웅.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-019', speaker: '영우', text: '음식 식기 전에\n사진 촬영이 끝날 가능성 있습니까?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-020', speaker: '지수', text: '잠시만요.\n지금 여행 기록 중입니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021', speaker: '영우', text: '음식의 생전 모습을 기록하는 건가요?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-022', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아 샤갈\n그렇게 말하니까 이상하잖아!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-023', speaker: '영우', text: '빨리 먹자 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-024', speaker: '', text: '두 사람은 서로의 접시를 자연스럽게 바꿔가며\n늦은 저녁을 먹었다.', characterId: null },
  { id: 'line-025', speaker: '', text: '식사가 거의 끝날 무렵,\n영우가 조용해진 지수를 바라본다.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '지수.\n많이 피곤하지?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-027', speaker: '지수', text: '조금?', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-028', speaker: '지수', text: '근데 괜찮아요.\n오늘 첫날인데 좀 더 놀고 싶어.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-029', speaker: '영우', text: '더 놀고 싶은 건 나도 그런데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-030', speaker: '영우', text: '지금 눈이 반쯤 감겼어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-031', speaker: '지수', text: '안 감겼는데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-032', speaker: '영우', text: '방금 거의 음식한테 인사하고 있었어.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-033', speaker: '지수', text: '아니거든요오.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-034', speaker: '영우', text: '그럼 숙소까지 조금만 걷고\n오늘은 들어가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-035', speaker: '지수', text: '음...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-036', speaker: '영우', text: '내일 아침부터 같이 있잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-037', speaker: '지수', text: '웅.\n그건 마자.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-038', speaker: '지수', text: '그럼 딱 10분만 걸어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-039', speaker: '영우', text: '오키.\n10분.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-040', speaker: '지수', text: '11분 되면 제가 벌금 받아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-041', speaker: '영우', text: '무슨 벌금?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-042', speaker: '지수', text: '내일 간식 사기.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-043', speaker: '영우', text: '그냥 내가 사고 싶다고 말해 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-044', speaker: '지수', text: '헤헤.\n들켰네.', characterId: 'jisoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 0 · SCENE 07 「떨어진 충전기」
   Dialogue Set: dialogue-week0-scene-charger
   Scene: week0-scene-charger (Sydney Accommodation, 22:30)
   The 침대 밑 손 넣기 beat plants the "something else is in here" hook, but
   the actual unknown-key pickup still happens inside the room-search
   minigame (behind the vent + long-hook combo, per
   ROOM_SEARCH_CORE_ITEM_HOTSPOTS) — this scene doesn't award it directly,
   just supplies the reason both the phone AND "that glint" need looking for.
   Ends on a MINIGAME START beat — nextSceneId hands off to the existing
   point-and-click phone-hunt scene, week0-scene-002-2. Merged into
   week0-scene-002-1 (see that scene's header comment) — its first line
   below carries the sceneTransition back into the accommodation, reusing
   that scene's own default background key since it's the same room. */
const week0SceneChargerLines = [
  {
    id: 'line-001', speaker: '', text: '숙소.\n밤 10시 30분.', characterId: null,
    sceneTransition: { backgroundKey: 'week0-scene-002-1', introLabel: 'ACCOMMODATION', time: '22:30' },
  },
  { id: 'line-002', speaker: '', text: '숙소로 돌아온 두 사람은\n씻을 준비를 하며 각자 짐을 정리하기 시작했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '영우.\n충전기 어디 꽂아야 돼요?', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '침대 옆에 콘센트 있어.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '오키.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-006', speaker: '', text: '지수가 가방에서 충전 케이블을 꺼내다\n손에서 놓친다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '어어어.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '', text: '충전 케이블이 바닥에 떨어져\n침대 밑으로 미끄러져 들어갔다.', characterId: null },
  { id: 'line-009', speaker: '지수', text: '아 샤갈.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-010', speaker: '영우', text: '내가 꺼내줄게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '아니에요.\n제가 떨어뜨렸으니까 제가 할게요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-012', speaker: '', text: '지수가 바닥에 엎드려\n침대 밑으로 손을 뻗는다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-014', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015', speaker: '지수', text: '안쪽에 뭐가 반짝이는데?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-016', speaker: '영우', text: '충전기 말고?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '웅.\n충전기는 앞에 있고...', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '지수', text: '저 뒤에 금속 같은 게 있어.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-019', speaker: '영우', text: '휴대폰 플래시 켜봐.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-020', speaker: '지수', text: '어?', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-021', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '내 폰 어디 갔지????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-023', speaker: '영우', text: '엉?\n아까 들어올 때 들고 있었잖아.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-024', speaker: '지수', text: '그러니까.\n나 식당에서도 사진 찍었고...', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-025', speaker: '지수', text: '숙소 와서는 어디 뒀지?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '내 폰으로 전화해볼게.\n일단 소리부터 들어보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-027', speaker: '', text: '영우가 지수의 번호로 전화를 건다.\n\n잠시 뒤,\n방 어딘가에서 희미한 진동음이 울린다.', characterId: null },
  { id: 'line-028', speaker: '지수', text: '잠만잠만.\n저쪽에서 들려.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-029', speaker: '영우', text: '같이 찾아보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-030', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 08 「근데 이 열쇠 뭐지?」
   Dialogue Set: dialogue-week0-scene002-3
   Scene: week0-scene-002-3 (Sydney Accommodation, right after the phone-hunt
   minigame). Reached by minigame-phone-search/'s GAME CLEAR redirect, not by
   another scene's nextSceneId — see MINIGAME_ROUTES in game/index.html and
   the redirect at the bottom of minigame-phone-search/index.html. Narration/
   system beats use speaker:'' (no name shown), matching the convention used
   throughout week0Scene001Lines/week0Scene002_1Lines. This is the M.K.
   engraving reveal — the seed for the whole 4-week mystery — so it doesn't
   loop or dead-end; it ends deciding to call the landlord instead of going
   down to a lobby (week0-scene-frontdesk, now a phone call — see that
   scene's own header comment). */
const week0Scene002_3Lines = [
  { id: 'line-001', speaker: '지수', text: '찾았다!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-002', speaker: '영우', text: '아 다행이다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-003', speaker: '지수', text: '이불이랑 침대 사이에 끼어 있었네.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-004', speaker: '영우', text: '범인은 지수 본인이었습니다.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-005', speaker: '지수', text: '아니거든요.\n침대가 숨긴 거거든요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-006', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n침대도 억울하겠다', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-007', speaker: '지수', text: '그리고 아까 반짝이던 것도 꺼냈어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-008', speaker: '', text: '지수가 손바닥 위에 올려둔 물건을\n영우에게 보여준다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '', text: '[ 낡은 황동 열쇠 ]', characterId: null },
  { id: 'line-010', speaker: '영우', text: '열쇠네.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '웅.\n근데 숙소 열쇠는 아니잖아.', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'line-012', speaker: '영우', text: '여긴 카드키고.', characterId: 'youngwoo', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-accommodation-keycard', code: 'E-000', title: '숙소 카드키',
        description: '두 사람이 묵고 있는 숙소의 정식 카드키. 낡은 열쇠와는 다른 물건이다.',
        discoveredLocationText: '숙소 객실',
      },
    }],
  },
  { id: 'line-013', speaker: '영우', text: '크기 보면 방문 열쇠보다는\n작은 보관함이나 서랍 쪽 같은데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '잠만.\n뒤에 뭐 써 있어.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-015', speaker: '', text: '지수가 열쇠를 뒤집는다.\n\n낡은 표면 한쪽에\n작은 글자가 새겨져 있었다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-016', speaker: '', text: '[ M.K. ]', characterId: null },
  { id: 'line-017', speaker: '지수', text: 'M.K.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-018', speaker: '영우', text: '사람 이니셜인가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '그럴 수도 있고.\n장소 이름일 수도 있고.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-020', speaker: '지수', text: '근데 일단 이니셜만 보고\n누구 거라고 정하면 안 될 것 같아.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'line-020-choice', type: 'choice', speaker: '', text: '지수는 열쇠를 만지작거리며 생각했다.', characterId: 'jisoo', expression: 'suspicious',
    choices: [
      {
        id: 'hunch-danger', label: '“왠지 불길한 느낌이 드는데...”',
        effects: [{
          type: 'addQuestion',
          question: { id: 'question-key-hunch', title: '이 열쇠, 위험한 물건일까?', description: '지수는 열쇠에서 왠지 불길한 기운을 느꼈다.' },
        }],
      },
      {
        id: 'hunch-curious', label: '“그냥 순수하게 궁금한데?”',
        effects: [{
          type: 'addQuestion',
          question: { id: 'question-key-hunch', title: '이 열쇠는 대체 누구 것일까?', description: '지수는 순수한 호기심을 느꼈다.' },
        }],
      },
    ],
  },
  { id: 'line-021', speaker: '영우', text: '웅웅.\n사진부터 찍자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-022', speaker: '영우', text: '그리고 숙소 관리자한테 물어보자.\n객실 비품이면 바로 돌려줘야 하니까.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-023', speaker: '지수', text: '오키.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-024', speaker: '', text: '지수는 열쇠의 앞뒤를 촬영한 뒤,\n예약 확인서에 적힌 연락처를 찾았다.', characterId: null },
  { id: 'line-025', speaker: '지수', text: '어.\n잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-027', speaker: '', text: '통화 버튼 위에 표시된 연락처 이름이\n지수의 눈에 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-028', speaker: '', text: '[ M. KOV... ]', characterId: null },
  { id: 'line-029', speaker: '지수', text: '영우.\n이 사람 이름도 M.K.로 시작하는데?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-030', speaker: '영우', text: '그러네.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-031', speaker: '영우', text: '근데 M이랑 K가 흔하긴 하니까\n일단 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '웅.\n나도 그 생각이야.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-033', speaker: '', text: '지수가 통화 버튼을 누른다.\n\n몇 번의 신호음 끝에\n낮고 잠긴 목소리가 들려왔다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 09 「집주인과의 통화」 v3
   Dialogue Set: dialogue-week0-scene-frontdesk
   Scene: week0-scene-frontdesk (Sydney Accommodation, continues directly
   from week0Scene002_3Lines — same call, same room, no location change).
   The landlord's hesitation on "M.K." is the seed for the whole 4-week
   mystery; per the brief it must NOT resolve into a full name here.
   [1주차 추리 개편 v2] The full name is no longer revealed anywhere in Week 1
   either (see week1-scene-007/009/011/013 in this file) — the overhaul brief
   requires Week 1 to end with only the M.K. / MK_Consult account-level clue,
   full identity deferred further out. week2-scene-012 onward still uses the
   literal name "Mika Kovac"/"미카 코바치" (written before this overhaul), which
   is now a continuity seam a future Week 2 pass should address. */
const week0SceneFrontdeskLines = [
  { id: 'line-001', speaker: '집주인', text: '여보세요?', characterId: null },
  { id: 'line-002', speaker: '지수', text: '안녕하세요.\n지금 숙소에 묵고 있는 손님인데요.\n\n밤늦게 죄송해요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '집주인', text: '괜찮습니다.\n무슨 일이시죠?', characterId: null },
  { id: 'line-004', speaker: '지수', text: '방을 정리하다가\n침대 밑에서 낡은 열쇠를 하나 발견했어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-005', speaker: '집주인', text: '열쇠요?', characterId: null },
  {
    id: 'line-006', type: 'evidence', speaker: '', text: '전화로 무엇을 설명할지 골라보세요.', characterId: 'jisoo', expression: 'curious',
    evidenceIds: ['evidence-unknown-key'],
    wrongText: '지수: “어, 이건 아니고...” 집주인이 갸웃하는 게 느껴진다.',
  },
  { id: 'line-007', speaker: '집주인', text: '...', characterId: null },
  { id: 'line-008', speaker: '집주인', text: 'M.K.요?', characterId: null },
  { id: 'line-009', speaker: '지수', text: '네.\n혹시 숙소에서 사용하는 물건인가요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '집주인', text: '아니요.\n저희 객실에서 사용하는 열쇠는 아닙니다.', characterId: null },
  { id: 'line-011', speaker: '영우', text: '그럼 이전 투숙객 분실물일 가능성이 있을까요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-012', speaker: '집주인', text: '그럴 수는 있겠네요.', characterId: null },
  { id: 'line-013', speaker: '집주인', text: '사진을 메시지로 보내주시겠어요?\n제가 청소 담당자와 이전 기록을 확인해 보겠습니다.', characterId: null },
  { id: 'line-014', speaker: '지수', text: '네.\n바로 보내드릴게요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-015', speaker: '집주인', text: '당장은 객실 시설과 관련된 열쇠는 아닌 것 같으니\n잃어버리지 않게 보관만 부탁드립니다.', characterId: null },
  { id: 'line-016', speaker: '집주인', text: '확인되는 게 있으면\n내일 연락드리겠습니다.', characterId: null },
  { id: 'line-017', speaker: '지수', text: '알겠습니다.\n늦게 연락드려서 죄송해요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-018', speaker: '집주인', text: '괜찮습니다.\n편안한 밤 보내세요.', characterId: null },
  { id: 'line-019', speaker: '', text: '통화가 종료된다.', characterId: null },
  { id: 'line-020', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-021', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '방금 들었어?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-023', speaker: '영우', text: 'M.K. 말했을 때\n잠깐 멈춘 거?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-024', speaker: '지수', text: '웅.\n모른다는 사람 반응치고는\n한 번 더 확인하는 느낌이었어.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-025', speaker: '영우', text: '나도 조금 그렇게 들리긴 했어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-026', speaker: '지수', text: '근데 목소리만 듣고\n숨기는 게 있다고 단정하진 말자.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-027', speaker: '영우', text: '오키.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-028', speaker: '영우', text: '내일 답 오는지 보고,\n안 오면 한 번 더 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-029', speaker: '지수', text: '웅.\n그게 좋겠다.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-030', speaker: '', text: '영우가 책상 위에 있던 작은 투명 봉투를 가져온다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '영우', text: '여기 넣어두자.\n그냥 두면 또 어디 갔는지 찾을 것 같아.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '아니 왜 저를 보면서 말해요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-033', speaker: '영우', text: '오늘 휴대폰 실종 사건의 전력이 있으셔서.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-034', speaker: '지수', text: '그 사건은 해결됐거든요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-035', speaker: '영우', text: '범인도 검거됐고?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-036', speaker: '지수', text: '웅.\n침대가 범인이었어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-037', speaker: '영우', text: '끝까지 침대 탓이네 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-038', speaker: '', text: '[ ITEM ACQUIRED ]\n\nUNKNOWN KEY\n각인: M.K.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 10 「첫날 밤」
   Dialogue Set: dialogue-week0-scene-firstnight
   Scene: week0-scene-firstnight (Sydney Accommodation, 23:15)
   Closes out 0주차 — no nextSceneId, this is the last scene of the week. */
const week0SceneFirstNightLines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 11시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '두 사람은 침대에 기대앉아\n다음 날 일정을 간단히 확인했다.\n\n투명 봉투에 든 열쇠는\n협탁 위에 조용히 놓여 있었다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '내일은 뭐부터 해요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '아침 먹고 시티 쪽 가자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '지수 컨디션 괜찮으면\n오페라하우스 쪽까지 걷고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '헐.\n개쥬아.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-007', speaker: '지수', text: '근데 영우.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '웅?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '저 열쇠\n진짜 그냥 이전 손님 물건일까?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '영우', text: '가능성이 제일 크긴 하지.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-011', speaker: '영우', text: '근데 관리자가 왜 멈췄는지는\n나도 좀 걸려.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-012', speaker: '지수', text: '그치.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '일단 내일까지 기다려보자.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-014', speaker: '영우', text: '웅.\n오늘은 그만 생각하고 자자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-015', speaker: '지수', text: '보물 열쇠면 어떡해요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '영우', text: '그럼 반씩 나누자.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-017', speaker: '지수', text: '왜 반씩이에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-018', speaker: '영우', text: '같이 찾았으니까?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '제가 발견했는데요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-020', speaker: '영우', text: '내가 플래시 켜고 봉투도 가져왔는데요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-021', speaker: '지수', text: '음.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '그럼 저 7.\n영우 3.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-023', speaker: '영우', text: '협상 시작부터 왜 내가 불리해!!!!', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-024', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그럼 내일 다시 협상해요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-025', speaker: '영우', text: '자고 일어나면 8 대 2 되는 거 아니야?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-026', speaker: '지수', text: '눈치가 빨라졌네.\n호주 생활 많이 늘었다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-027', speaker: '영우', text: '아 진짜 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-028', speaker: '', text: '한참을 웃고 난 뒤,\n방 안은 조금씩 조용해졌다.', characterId: null },
  { id: 'line-029', speaker: '지수', text: '영우.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-030', speaker: '영우', text: '웅.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '지수', text: '오늘 진짜 좋았어.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-032', speaker: '영우', text: '나도.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-033', speaker: '지수', text: '아직도 좀 꿈 같긴 한데.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-034', speaker: '영우', text: '내일 일어나도 여기 있을게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-035', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-036', speaker: '지수', text: '아 진짜아.\n마지막에 또 그러네.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-037', speaker: '영우', text: 'ㅎㅎ\n잘 자 지수야.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-038', speaker: '지수', text: '웅.\n영우도 잘 자.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-039', speaker: '', text: '얼마 지나지 않아\n두 사람의 대화도 천천히 잦아들었다.', characterId: null },
  { id: 'line-040', speaker: '', text: '협탁 위,\n작은 황동 열쇠만이 조용히 남아 있었다.', characterId: null },
  { id: 'line-041', speaker: '', text: '[ M.K. ]', characterId: null },
  { id: 'line-042', speaker: '', text: '0주차 종료.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 1-2 「시드니 지리 파악」 v3
   Dialogue Set: dialogue-week0-scene001-2
   Scene: week0-scene-001-2 (Sydney Airport arrivals concourse, map signage, 09:45)
   Setup beat before the route-map minigame — teaches 시드니 CBD/공항/숙소
   (Marayong)/영우 근무지(Kings Park)/Eastwood as five map anchors instead of
   the old 3-stop station-name drill. nextSceneId hands off to that minigame
   page directly (not another VN scene).
   [v3 지리 개편] minigameStages on this scene's week0Scenes registry entry
   below now lists the 5 locations this setup dialogue teaches; the actual
   /dev/minigame-eastwood/ implementation still plays the older 3-stop
   "station in order" tap game (STAGES const in that file) and hasn't been
   rebuilt for the label-placement/relationship-connect/route-trace design
   this scene now describes — needs its own follow-up implementation pass. */
const week0Scene001_2Lines = [
  { id: 'line-001', speaker: '', text: '공항 도착층을 빠져나온 두 사람은\n열차 표지판과 시드니 광역 지도가 있는 안내판 앞에 멈춰 섰다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-003', speaker: '지수', text: '우리 지금 시드니 어디쯤 있는 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '여기.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '', text: '영우가 지도 아래쪽에 있는 공항 표시를 가리킨다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-006', speaker: '영우', text: '공항은 시티보다 아래쪽에 있어.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '엥.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '지수', text: '나 시드니 도착했으니까\n바로 오페라하우스 옆인 줄 알았는데????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n시드니가 그렇게 작진 않아요 손님', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-010', speaker: '지수', text: '아아.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '지금부터 현실 지리 수업 시작이네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '웅.\n김지수 시드니 생존교육 1교시.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-013', speaker: '지수', text: '선생님 설명 잘하세요.\n평가 들어갑니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '일단 공항이 여기.\n\n시티는 그 위쪽.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-015', speaker: '영우', text: '오페라하우스랑 하버브리지는\n시티 북쪽 항구 쪽에 있고.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-016', speaker: '지수', text: '공항 아래쪽.\n시티 위쪽.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '오키.\n여기까진 이해했어요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '영우', text: '그리고 우리가 묵을 곳은\n시티보다 훨씬 서쪽이야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '지수', text: '숙소가 여기예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-020', speaker: '', text: '지수가 지도 서쪽의 Marayong 표시를 누른다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-021', speaker: '영우', text: '웅.\nMarayong 근처.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-022', speaker: '지수', text: '헐.\n생각보다 멀리 가네????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-023', speaker: '영우', text: '그래서 열차 타고 좀 가야 돼.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-024', speaker: '지수', text: '공항에서 시티 쪽으로 올라갔다가\n서쪽으로 빠지는 느낌?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-025', speaker: '영우', text: '오.\n마자마자.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-026', speaker: '지수', text: '벌써 지리 천재.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-027', speaker: '영우', text: '아직 두 군데 남았습니다.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-028', speaker: '지수', text: '뭐가 또 있어요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-029', speaker: '영우', text: '내가 일하는 곳.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-030', speaker: '', text: '영우가 숙소 근처의 Kings Park 지역을 가리킨다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '영우', text: '여기가 Kings Park 쪽.\n내가 일하는 곳은 이 근처야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '숙소랑 생각보다 가깝네.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-033', speaker: '영우', text: '웅.\n그래서 평소 생활권은 거의 이쪽이야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-034', speaker: '지수', text: '오오.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-035', speaker: '지수', text: '여기가 영우 출몰 지역이구나.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-036', speaker: '영우', text: '출몰은 뭐야 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-037', speaker: '지수', text: '주로 야간에 발견됨.\n커피와 도시락을 들고 다님.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-038', speaker: '영우', text: '아 너무 정확한데 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-039', speaker: '지수', text: '그럼 Eastwood는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-040', speaker: '영우', text: '여기는 Eastwood.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-041', speaker: '영우', text: '한인 식당이나 마트 갈 때 자주 가는 쪽이고,\n나중에 지수랑도 갈 거야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-042', speaker: '지수', text: '헐.\n한국 음식 있어요?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-043', speaker: '영우', text: '지리 설명보다 반응이 훨씬 빠른데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-044', speaker: '지수', text: '먹는 건 중요하니까요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-045', speaker: '영우', text: '정리하면,\n\n공항은 남동쪽.\n\n시티는 공항보다 위쪽.\n\n숙소는 서쪽의 Marayong.\n\n내 일터는 그 근처 Kings Park.\n\nEastwood는 우리가 중간중간 갈 생활권.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-046', speaker: '지수', text: '잠만.\n내가 해볼게.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-047', speaker: '지수', text: '공항 여기.\n\n시티 여기.\n\n숙소 여기.\n\n영우 일하는 데 여기.\n\nEastwood 여기.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-048', speaker: '영우', text: '오.\n다 맞았어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-049', speaker: '지수', text: '야르!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-050', speaker: '지수', text: '이제 저 시드니 사람 다 됐죠?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-051', speaker: '영우', text: '아직 열차도 안 탔는데요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-052', speaker: '지수', text: '아놔.\n칭찬 좀 길게 해줘요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-053', speaker: '영우', text: '잘했어 지수야.\n진짜 처음 본 것치고 엄청 빨리 찾았어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-054', speaker: '지수', text: '헤헤.\n이제 됐어요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-055', speaker: '영우', text: '그럼 마지막으로\n실제 이동 경로를 연결해보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-056', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 04 「열차 — 지도에서 현실로」 v3
   Dialogue Set: dialogue-week0-scene-train
   Scene: week0-scene-train (Sydney Trains, 10:05)
   minigame-eastwood's GAME CLEAR redirect hands off here (not straight to
   the accommodation scene) — this scene's opening lines are the minigame's
   own "성공 시" exchange (지수/영우 문답), then 무깽이 리마인드 #1 gets its own
   beat per the brief's "매우 약하게" instruction — no clue UI, no music cue,
   just banter. */
const week0SceneTrainLines = [
  { id: 'line-001', speaker: '지수', text: '오오오.\n이제 진짜 감 잡았어요!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-002', speaker: '영우', text: '그치?\n나중에 장소 이름 나와도\n대충 어느 쪽인지 알겠지?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '지수', text: '웅웅.\n영우 생활반경 접수 완료.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-004', speaker: '영우', text: '말이 왜 무섭지.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '지수', text: '헤헤.\n도망 못 가요 이제.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '', text: 'Sydney Trains 열차 안.\n오전 10시 05분.', characterId: null },
  { id: 'line-007', speaker: '', text: '지도 위에서만 보던 장소들을 확인한 뒤,\n두 사람은 숙소 방향 열차에 자리를 잡았다.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '그러면 지금은\n공항에서 숙소 쪽으로 가는 중인 거죠?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '영우', text: '웅웅.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-010', speaker: '영우', text: '조금 전 지도에서 본 것처럼\n시티 방향으로 올라갔다가 서쪽으로 이동하는 거야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-011', speaker: '지수', text: '그리고 Marayong 근처가 숙소.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '그 옆 Kings Park 쪽이 영우 일하는 데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '영우', text: '마자.\n진짜 잘 기억하네.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '당연하죠.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '지수', text: '여자친구가 남자친구 서식지를 파악하는 건\n기본입니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '영우', text: '서식지 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-017', speaker: '지수', text: '근데 실제로 보니까\n지도보다 훨씬 넓다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '영우', text: '시드니가 동네마다 분위기도 많이 달라.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '영우', text: '시티는 건물 많고 관광지 느낌이고,\n우리가 가는 쪽은 주택이랑 공업 지역이 더 많아.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-020', speaker: '지수', text: '그럼 영우가 일 끝나고 보는 풍경은\n저런 느낌이에요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-021', speaker: '영우', text: '웅.\n밤에는 훨씬 조용하고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '지수', text: '신기하다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-023', speaker: '지수', text: '맨날 전화로만 듣던 데를\n지금 내가 지나가고 있네.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-024', speaker: '영우', text: '그러게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-025', speaker: '', text: '지수가 창밖으로 지나가는 역 이름을 하나씩 확인한다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '지수', text: '나중에 Eastwood도 데려가 줘요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-027', speaker: '영우', text: '웅.\n거기 가서 장도 보고 밥도 먹자.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-028', speaker: '지수', text: '개쥬아.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-029', speaker: '지수', text: '오늘 지리 수업 만족도 올라갔습니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-030', speaker: '영우', text: 'A+ 가능합니까.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-031', speaker: '지수', text: '아직 실습 중이에요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-032', speaker: '영우', text: '평가 진짜 오래 하네.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-033', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n끝까지 긴장하세요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-034', speaker: '', text: '열차가 지상 구간으로 들어서자\n낮은 주택과 작은 상점, 넓은 도로가 이어졌다.', characterId: null },
  { id: 'line-035', speaker: '영우', text: '비행기는 괜찮았어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-036', speaker: '지수', text: '중간까지는.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-037', speaker: '지수', text: '자다가 목이 이렇게 꺾여서\n옆사람이 한 번 쳐다봤어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-038', speaker: '영우', text: '어떻게 잤길래 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-039', speaker: '지수', text: '몰라요.\n살기 위해 잔 거예요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-040', speaker: '영우', text: '아구.\n진짜 고생했네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-041', speaker: '지수', text: '그래도 오니까 좋다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-042', speaker: '지수', text: '영우는 어제 잠 좀 잤어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-043', speaker: '영우', text: '음.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-044', speaker: '지수', text: '그 음 뭐야.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-045', speaker: '영우', text: '평소보다는 일찍 잤지.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-046', speaker: '지수', text: '몇 시.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-047', speaker: '영우', text: '두 시쯤?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-048', speaker: '지수', text: '그게 일찍이에요?????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-049', speaker: '영우', text: '내 기준에는.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-050', speaker: '지수', text: '아구 진짜.\n오늘 나 때문에 더 피곤한 거 아니에요?', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-051', speaker: '영우', text: '아니야.\n지수 와서 오히려 안 피곤해.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-052', speaker: '지수', text: '그건 지금 신나서 모르는 거고.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-053', speaker: '지수', text: '숙소 가면 잠깐이라도 쉬어요.\n알겠죠?', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-054', speaker: '영우', text: '웅웅.\n지수도 같이.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-055', speaker: '지수', text: '저는 감독할 건데요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-056', speaker: '영우', text: '감독이 먼저 잘 것 같은데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-057', speaker: '지수', text: '아니거든요오.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-058', speaker: '', text: '말은 그렇게 했지만,\n지수는 얼마 지나지 않아 창에 머리를 기댔다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-059', speaker: '영우', text: '지수야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-060', speaker: '지수', text: '웅...', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-061', speaker: '영우', text: '무깽이 보고 싶지.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-062', speaker: '지수', text: '웅.\n지금쯤 나 찾으려나.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-063', speaker: '영우', text: '네 침대 가운데 누워서\n드디어 내 세상이다 하고 있을걸.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-064', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아 진짜 그럴 것 같아.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-065', speaker: '지수', text: '나중에 영상통화 해봐야지.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-066', speaker: '영우', text: '웅.\n같이 보자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-067', speaker: '', text: '지수는 대답 대신\n영우의 소매 끝을 살짝 잡았다.', characterId: null },
  { id: 'line-068', speaker: '', text: '지도 속 낯선 지명들은\n창밖의 실제 풍경으로 하나씩 바뀌고 있었다.', characterId: null },
];

// OPERATION MK — Week 0 Scene 2-2 room-search minigame's area/hotspot
// registry (v3 — "실제 4개 장소 이미지 기반" brief). Single source of truth
// shared by minigame-phone-search/ (which hotspots exist and what they're
// called) and /dev/upload (which lets a dev upload a real room photo per
// area and mark each hotspot's tap position on it, via the 4-corner-tap
// area designator — see /dev/upload's "정답 영역 지정" section). Each area's
// own background+hotspots are stored under the sceneId
// `${ROOM_SEARCH_MINIGAME_ID}-${area.id}` — see roomSearchAreaSceneId below.
//
// Every hotspot ID here corresponds to something actually visible in one of
// the 4 real accommodation photos (주방/욕실/외부/침실) — no invented
// furniture. Only IDs + display labels live here; per-hotspot flavor text,
// item grants, and gating logic live in minigame-phone-search/index.html.
const ROOM_SEARCH_MINIGAME_ID = 'week0-scene-002-2';
const roomSearchAreas = [
  { id: 'kitchen', label: '주방', hotspots: [
    { id: 'kitchen-left-counter', label: '좌측 조리대' },
    { id: 'kitchen-kettle', label: '전기포트' },
    { id: 'kitchen-mini-fridge', label: '소형 냉장고' },
    { id: 'kitchen-fridge-gap', label: '냉장고 옆 틈' },
    { id: 'kitchen-back-door', label: '안쪽 나무문' },
    { id: 'kitchen-upper-cabinets', label: '상부 수납장' },
    { id: 'kitchen-rangehood', label: '레인지 후드' },
    { id: 'kitchen-knife-block', label: '칼꽂이' },
    { id: 'kitchen-cooktop', label: '가스레인지' },
    { id: 'kitchen-pots', label: '냄비' },
    { id: 'kitchen-microwave', label: '전자레인지' },
    { id: 'kitchen-oven', label: '오븐' },
    { id: 'kitchen-oven-handle', label: '오븐 손잡이' },
    { id: 'kitchen-left-lower-cabinet', label: '좌측 하부장' },
    { id: 'kitchen-right-lower-drawer', label: '하부 서랍' },
    { id: 'kitchen-right-lower-cabinet', label: '우측 하부장' },
  ] },
  { id: 'bathroom', label: '욕실', hotspots: [
    { id: 'bathroom-bathtub', label: '욕조' },
    { id: 'bathroom-tub-edge', label: '욕조 가장자리' },
    { id: 'bathroom-mirror', label: '벽거울' },
    { id: 'bathroom-sink-bowl', label: '세면대' },
    { id: 'bathroom-faucet', label: '수도꼭지' },
    { id: 'bathroom-vanity-top', label: '세면대 상판' },
    { id: 'bathroom-vanity-drawer', label: '하부 서랍' },
    { id: 'bathroom-vanity-cabinet', label: '하부 수납장' },
    { id: 'bathroom-plant', label: '화분' },
    { id: 'bathroom-right-door', label: '우측 문' },
    { id: 'bathroom-behind-door', label: '문 뒤' },
    { id: 'bathroom-towel-rail', label: '수건걸이' },
    { id: 'bathroom-wall-switch', label: '벽 스위치' },
  ] },
  { id: 'exterior', label: '외부', hotspots: [
    { id: 'exterior-left-tree', label: '좌측 과실수' },
    { id: 'exterior-left-bush', label: '좌측 수풀' },
    { id: 'exterior-center-shrubs', label: '중앙 수풀' },
    { id: 'exterior-right-shrubs', label: '우측 수풀' },
    { id: 'exterior-grass', label: '잔디' },
    { id: 'exterior-side-path', label: '옆길' },
    { id: 'exterior-driveway', label: '진입로' },
    { id: 'exterior-garage-edge', label: '차고' },
    { id: 'exterior-extension-windows', label: '증축부 창문' },
    { id: 'exterior-house-wall', label: '외벽' },
    { id: 'exterior-main-house', label: '본채' },
    { id: 'exterior-entry-porch', label: '뒤쪽 현관' },
  ] },
  { id: 'bedroom', label: '침실', hotspots: [
    { id: 'bedroom-bed', label: '침대' },
    { id: 'bedroom-under-bed', label: '침대 밑' },
    { id: 'bedroom-pillows', label: '베개' },
    { id: 'bedroom-duvet', label: '이불' },
    { id: 'bedroom-folded-towels', label: '접힌 수건' },
    { id: 'bedroom-bedside-table', label: '협탁' },
    { id: 'bedroom-bedside-lamp', label: '협탁 램프' },
    { id: 'bedroom-bedside-bottle', label: '협탁 위 병' },
    { id: 'bedroom-window', label: '창문' },
    { id: 'bedroom-blind', label: '블라인드' },
    { id: 'bedroom-left-vent', label: '좌측 환기구' },
    { id: 'bedroom-right-vent', label: '우측 환기구' },
    { id: 'bedroom-mantel-shelf', label: '벽난로 선반' },
    { id: 'bedroom-mantel-painting', label: '선반 위 그림' },
    { id: 'bedroom-black-vases', label: '검은 화병' },
    { id: 'bedroom-hanging-plant', label: '늘어진 식물' },
    { id: 'bedroom-floor-plant', label: '바닥 화분' },
    { id: 'bedroom-floor-fan', label: '선풍기' },
    { id: 'bedroom-wall-art', label: '액자' },
    { id: 'bedroom-floorboards', label: '바닥' },
    { id: 'bedroom-bed-gap', label: '침대 옆 틈' },
  ] },
];
function roomSearchAreaSceneId(areaId) { return `${ROOM_SEARCH_MINIGAME_ID}-${areaId}`; }

// Core item -> the default hotspot its hand-written handler grants it from,
// mirroring ITEM_HOTSPOT_ITEM_IDS's core entries in
// minigame-phone-search/index.html. /dev/upload's 아이템 tab reads this as
// the fallback when a dev hasn't repositioned the item, and both that page
// and the minigame itself derive "which hotspots are currently a core
// item's" from it (plus any saved override) instead of a separate static
// list — a dev can drag a core item's location elsewhere and the handler
// (and this reserved-ness) follows it there. working-flashlight/long-hook
// are recipe outputs, not hotspot pickups, so they're absent here on
// purpose and stay non-repositionable.
const ROOM_SEARCH_CORE_ITEM_HOTSPOTS = {
  'aa-batteries': 'kitchen-right-lower-drawer',
  'jisu-phone': 'kitchen-fridge-gap',
  'metal-hanger': 'bathroom-behind-door',
  'garden-stake': 'exterior-center-shrubs',
  'dead-flashlight': 'bedroom-bedside-table',
  'unknown-key': 'bedroom-right-vent',
};

// Hotspot IDs with their own hand-written flavor logic but no item attached
// (mirrors minigame-phone-search's own HOTSPOT_HANDLERS non-core entries).
// /dev/upload's 아이템 tab excludes these from every item's location picker,
// core or custom — pointing an item at one would silently replace that
// logic instead of layering on top of it (e.g. moving an item onto
// 'bathroom-right-door' would swallow the handler that opens the door
// 'bathroom-behind-door' depends on).
const ROOM_SEARCH_SPECIAL_HOTSPOT_IDS = [
  'kitchen-pots',
  'bathroom-mirror', 'bathroom-wall-switch', 'bathroom-right-door',
  'exterior-extension-windows',
  'bedroom-blind', 'bedroom-left-vent',
];

// Flat id/name/icon catalog of the room-search minigame's core (code-gated)
// items — mirrors minigame-phone-search's own ITEM_DEFS (same reasoning as
// caseFileData.js's inventoryItemDefs above it) so /dev/upload's 아이템 tab
// can list every item, core or custom, from one place without needing the
// gating logic that actually lives in the minigame file. Each core item's
// full definition (inspect text, selectable flag, hotspot wiring) still
// lives only in minigame-phone-search/index.html.
const ROOM_SEARCH_CORE_ITEMS = [
  { id: 'dead-flashlight', name: '손전등', icon: '🔦' },
  { id: 'aa-batteries', name: 'AA 건전지', icon: '🔋' },
  { id: 'working-flashlight', name: '작동 손전등', icon: '🔦' },
  { id: 'metal-hanger', name: '철제 옷걸이', icon: '🧷' },
  { id: 'garden-stake', name: '정원용 지지대', icon: '🥢' },
  { id: 'long-hook', name: '긴 갈고리', icon: '🪝' },
  { id: 'unknown-key', name: '낡은 열쇠', icon: '🗝️' },
  { id: 'jisu-phone', name: '핸드폰', icon: '📱' },
];

// Concatenates line arrays from scenes that got folded into one merged
// entry below (scenes are grouped by location, not by time slice, so
// several old scene beats now live under a single id) and re-numbers
// `id` sequentially so dialogue-override lookups (keyed by line id — see
// AssetDB.getDialogueOverrides/setDialogueOverrides) stay unique within
// the merged scene instead of colliding on 'line-001' etc.
function mergeLines(...lineArrays) {
  let n = 0;
  return lineArrays.flat().map(line => ({ ...line, id: 'line-' + String(++n).padStart(3, '0') }));
}

// Registry of testable Week 0 scenes — /dev/week0 lists these, each linking
// to /dev/game/?scene=<id>. Covers the full 0주차 ARRIVAL arc (W0-S01~S10 in
// the story doc) — 비행기 오프닝부터 첫날 밤 마무리까지, including the M.K.
// engraving reveal that seeds the entire 4-week mystery.
//
// Grouped into 3 beats (week0SceneGroups below: #1-2, #3-5, #6-12) rather
// than one entry per original scene/time-slice. A scene only keeps its own
// registry entry when it hands off to a minigame (nextSceneId) — that
// handoff always has to be the last beat of an entry, since a minigame is a
// separate routed page, not a `lines` array. A plain location change inside
// a merged entry (e.g. In Flight -> Sydney Airport Arrival Area) is instead
// carried by a `sceneTransition` marker on the first line of the new
// location (see mergeLines above for how ids get renumbered across the
// merge, and playSceneTransition in game/index.html for the black-card
// beat it triggers). Each such scene also declares a `locations` array
// naming every background slot it now needs — one per location segment,
// each its own virtual scene-id key, same one-slot-per-id pattern
// minigameId already used for a scene's separate minigame background.
const week0Scenes = [
  {
    id: 'week0-scene-flight',
    order: 1,
    name: '시드니 상공 · 진짜 왔네',
    location: 'In Flight',
    introLabel: 'IN FLIGHT',
    time: '착륙 10분 전',
    // Merged week0-scene-flight + week0-scene-001 (no minigame between them) —
    // week0Scene001Lines' first line carries the sceneTransition into the
    // second location below.
    locations: [
      { key: 'week0-scene-flight', label: 'In Flight' },
      { key: 'week0-scene-flight--arrival', label: 'Sydney Airport Arrival Area' },
    ],
    lines: mergeLines(week0SceneFlightLines, week0Scene001Lines),
    // Hands off into 지하철 역 찾기 — a real playthrough (시작하기 on /play/test)
    // taps straight through the whole week instead of stopping here. Note
    // this also means the "UNKNOWN SIGNAL" foreshadow beat in game/index.html
    // (gated on !nextSceneId) no longer fires at this scene's end.
    nextSceneId: 'week0-scene-001-2',
  },
  {
    id: 'week0-scene-001-2',
    order: 2,
    name: '시드니 지리 파악 · 지하철 지도 튜토리얼',
    location: 'Sydney Airport Station',
    introLabel: 'SYDNEY',
    time: '09:45',
    lines: week0Scene001_2Lines,
    // Hands off straight into the route-map minigame (not another VN scene) —
    // see MINIGAME_ROUTES in game/index.html. minigameId marks that this
    // scene has its own separate "미니게임" background slot in 배경 DB
    // (the route-map image), distinct from this scene's own VN background.
    nextSceneId: 'week0-scene-001-2-minigame',
    minigameId: 'week0-scene-001-2-minigame',
    // [v3 지리 개편] 5 map anchors the setup dialogue teaches, in the order it
    // introduces them — 배경 DB's 정답 영역 editor uses this to offer one
    // hotspot slot per location on the shared map image. NOTE: the actual
    // /dev/minigame-eastwood/ page still runs the older 3-stop "station in
    // order" tap game (its own STAGES const) and hasn't been rebuilt for the
    // label-placement/relationship-connect/route-trace design this scene's
    // dialogue now describes — a follow-up implementation pass is needed
    // before this array reflects real in-game hotspots.
    minigameStages: ['공항 (Sydney International Airport)', '시티 (Sydney CBD)', '숙소 (Marayong)', '영우 근무지 (Kings Park)', '이스트우드 (Eastwood)'],
  },
  {
    id: 'week0-scene-001-2-minigame',
    order: 3,
    name: '시드니 지리 파악 (미니게임)',
    location: 'Sydney Airport Station',
    time: '09:50',
    route: '/dev/minigame-eastwood/',
  },
  {
    id: 'week0-scene-train',
    order: 4,
    name: '열차 — 지도에서 현실로',
    location: 'Sydney Trains',
    introLabel: 'SYDNEY TRAINS',
    time: '10:05',
    lines: week0SceneTrainLines,
    // Hands off into 진짜 같이 있네 (숙소 도착) — see week0-scene-flight's own
    // nextSceneId comment above for why this chain matters now.
    nextSceneId: 'week0-scene-002-1',
  },
  {
    id: 'week0-scene-002-1',
    order: 5,
    name: '진짜 같이 있네 · 첫날 저녁 · 떨어진 충전기',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:18',
    // Merged week0-scene-002-1 + week0-scene-dinner + week0-scene-charger —
    // dinner and the trip back are plain location changes now (see
    // sceneTransition markers on week0SceneDinnerLines/week0SceneChargerLines'
    // first lines), not minigame boundaries, so they no longer need their
    // own registry entries. Still ends on charger's own minigame handoff —
    // that has to stay the last beat of this entry.
    locations: [
      { key: 'week0-scene-002-1', label: 'Sydney Accommodation' },
      { key: 'week0-scene-002-1--dinner', label: 'Restaurant near Accommodation' },
    ],
    lines: mergeLines(week0Scene002_1Lines, week0SceneDinnerLines, week0SceneChargerLines),
    // Not a loop — this scene hands off to the point-and-click phone-hunt
    // minigame (week0-scene-002-2). See MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week0-scene-002-2',
  },
  {
    id: 'week0-scene-002-2',
    order: 6,
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    time: '22:35',
    // No `lines` — this isn't a VN scene, it's the point-and-click minigame
    // itself. `route` overrides /dev/week0's default /dev/game/?scene=<id>
    // link so this entry opens the minigame page directly, letting it be
    // tested standalone instead of only via week0-scene-charger's VN handoff.
    route: '/dev/minigame-phone-search/',
  },
  {
    id: 'week0-scene-002-3',
    order: 7,
    name: '근데 이 열쇠 뭐지? · 집주인과의 통화 · 첫날 밤',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '22:41',
    // Reached from the phone-search minigame's GAME CLEAR redirect (hardcoded
    // in minigame-phone-search/index.html) — keeps this id even after the
    // merge below so that redirect still resolves.
    //
    // Merged week0-scene-002-3 + week0-scene-frontdesk + week0-scene-firstnight
    // (all Sydney Accommodation, back to back, no minigame handoff between
    // them now that the old lobby/front-desk trip was reworked into a phone
    // call from the room — see week0SceneFrontdeskLines' header comment).
    lines: mergeLines(week0Scene002_3Lines, week0SceneFrontdeskLines, week0SceneFirstNightLines),
  },
];

// 0주차's 3 narrative beats — /dev/week0 groups week0Scenes under these
// headers instead of one flat list, each range naming the original (pre-
// merge) scene numbers it covers. A group's sceneIds list its member
// registry entries in play order, minigames included in sequence alongside
// the VN scenes around them — a minigame can never be folded into a single
// `lines` array (it's a separate routed page), so it stays its own entry
// even inside a group whose other members got merged.
const week0SceneGroups = [
  { range: '#1-2', label: '공항 도착', sceneIds: ['week0-scene-flight'] },
  { range: '#3-5', label: '지하철 · 열차', sceneIds: ['week0-scene-001-2', 'week0-scene-001-2-minigame', 'week0-scene-train'] },
  { range: '#6-12', label: '숙소 첫날', sceneIds: ['week0-scene-002-1', 'week0-scene-002-2', 'week0-scene-002-3'] },
];

/* OPERATION MK — WEEK 1 · SCENE 01 「시티로 출발」
   Dialogue Set: dialogue-week1-scene001
   Scene: week1-scene-001 (Circular Quay 이동 중, 09:40)

   ===== 1주차 장편 확장 v2 · §5 =====
   페이즈 A(여행 대화, 원래 내용 유지) + 페이즈 B(선택지 3회) 확장. 선택은
   전부 flag로만 남고(§22 investigationState/interrogationState와 같은 결의
   "가벼운 분기") 이후 대사를 크게 바꾸진 않는다 — 그 자체로 관계성/캐릭터
   플레이타임을 늘리는 것이 목적이라는 문서 §3의 취지에 맞춘 선택이다. */
const week1Scene001Lines = [
  { id: 'line-001', speaker: '', text: '며칠째 이어진 여행.\n오늘은 시티로 나가는 날이다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '오늘 드디어 오페라하우스 가는 날이죠?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-003', speaker: '영우', text: '웅웅.\n서큘러키 쪽으로 쭉 걸을 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '지수', text: '사진 엄청 찍어야지.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '영우', text: '또 나 세워놓고 열 장씩 찍을 거지', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '스무 장.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-007', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n늘었네 또', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-008', speaker: '지수', text: '오늘은 그냥 평범하게 놀고 싶어요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-009', speaker: '영우', text: '평범하게?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '지수', text: '웅.\n사건도 없고 열쇠도 없고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '그냥 관광객처럼요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n그거 좋다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-013', speaker: '영우', text: '근데 지수야, 그 열쇠는 계속 갖고 다닐 거야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-014', speaker: '지수', text: '...\n네. 그냥, 왠지 놓고 오면 안 될 것 같아서요.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-015', speaker: '영우', text: '오늘은 그거 신경 끄기로 했잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-016', speaker: '지수', text: '맞아요.\n오늘은 그냥 지수랑 영우 날이에요.', characterId: 'jisoo', expression: 'happy' },
  {
    id: 'choice-plan', type: 'choice', speaker: '지수', text: '오늘 가장 먼저 하고 싶은 게 뭐예요?', characterId: 'jisoo', expression: 'curious',
    choices: [
      { id: 'opera', label: '오페라하우스 사진부터', goto: 'plan-opera', effects: [{ type: 'setFlag', key: 'w1-first-pick', value: 'opera' }] },
      { id: 'bridge', label: '하버브리지 쪽으로 걷기', goto: 'plan-bridge', effects: [{ type: 'setFlag', key: 'w1-first-pick', value: 'bridge' }] },
      { id: 'cafe', label: '카페부터 가기', goto: 'plan-cafe', effects: [{ type: 'setFlag', key: 'w1-first-pick', value: 'cafe' }] },
    ],
  },
  { id: 'plan-opera', speaker: '영우', text: '역시. 그럴 줄 알았어.', characterId: 'youngwoo', expression: 'happy', goto: 'choice-pose' },
  { id: 'plan-bridge', speaker: '영우', text: '오, 오늘은 걷는 쪽이야?', characterId: 'youngwoo', expression: 'curious', goto: 'choice-pose' },
  { id: 'plan-cafe', speaker: '영우', text: '역시 카페부터. 지수답다.', characterId: 'youngwoo', expression: 'soft', goto: 'choice-pose' },
  {
    id: 'choice-pose', type: 'choice', speaker: '영우', text: '지수 사진, 오늘은 어떻게 찍어줄까?', characterId: 'youngwoo', expression: 'curious',
    choices: [
      { id: 'classic', label: '정석 구도로', goto: 'pose-classic', effects: [{ type: 'setFlag', key: 'w1-photo-style', value: 'classic' }] },
      { id: 'burst', label: '장난스럽게 연사로', goto: 'pose-burst', effects: [{ type: 'setFlag', key: 'w1-photo-style', value: 'burst' }] },
      { id: 'candid', label: '몰래 자연스러운 걸로', goto: 'pose-candid', effects: [{ type: 'setFlag', key: 'w1-photo-style', value: 'candid' }] },
    ],
  },
  { id: 'pose-classic', speaker: '지수', text: '역시 기본이 최고죠.', characterId: 'jisoo', expression: 'smirk', goto: 'choice-jinx' },
  { id: 'pose-burst', speaker: '지수', text: '그럼 저도 이상한 표정 준비할게요.', characterId: 'jisoo', expression: 'happy', goto: 'choice-jinx' },
  { id: 'pose-candid', speaker: '지수', text: '...\n몰래는 좀 부담스러운데.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank', goto: 'choice-jinx' },
  {
    id: 'choice-jinx', type: 'choice', speaker: '영우', text: '오늘 사건 같은 건 없겠지?', characterId: 'youngwoo', expression: 'curious',
    choices: [
      { id: 'never', label: '절대 없다', goto: 'jinx-never', effects: [{ type: 'setFlag', key: 'w1-jinx-pick', value: 'never' }] },
      { id: 'flag', label: '그런 말 하면 꼭 생긴다', goto: 'jinx-flag', effects: [{ type: 'setFlag', key: 'w1-jinx-pick', value: 'flag' }] },
      { id: 'key-only', label: '열쇠만 아니면 된다', goto: 'jinx-key', effects: [{ type: 'setFlag', key: 'w1-jinx-pick', value: 'key' }] },
    ],
  },
  { id: 'jinx-never', speaker: '지수', text: '절대 없어요. 오늘은 진짜.', characterId: 'jisoo', expression: 'smirk', goto: 'line-017' },
  { id: 'jinx-flag', speaker: '지수', text: '...\n그런 말이 제일 위험한 거 몰라요?', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious', goto: 'line-017' },
  { id: 'jinx-key', speaker: '지수', text: '그거 하나는 진짜 부탁이에요.', characterId: 'jisoo', expression: 'annoyed', goto: 'line-017' },
  { id: 'line-017', speaker: '영우', text: '오늘은 진짜 아무 일도 없을 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-018', speaker: '', text: '영우의 그 말은,\n오래가지 못했다.', characterId: 'youngwoo', expression: 'soft' },
];

/* OPERATION MK — WEEK 1 · SCENE 02 「관광객 모드」
   Dialogue Set: dialogue-week1-scene002
   Scene: week1-scene-002 (Circular Quay, 10:15)

   ===== 1주차 장편 확장 v2 · §6 =====
   사진 포즈 루프(선택지 3회 반복) + 각도 미니 선택. 마지막으로 고른 포즈/각도는
   flag로 남아 week1-scene-004(사건 직후 사진 분석)에서 "그 사진도 섞여
   들어왔다"는 한 줄 콜백에 쓰인다. */
const week1Scene002Lines = [
  { id: 'line-001', speaker: '', text: 'Circular Quay.\n오전 10시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '오페라하우스와 하버브리지가 한눈에 들어온다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '와아아 진짜 사진으로 보던 그대로다.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-004', speaker: '영우', text: '여기 서봐.\n찍어줄게.', characterId: 'youngwoo', expression: 'soft' },
  {
    id: 'pose-loop', type: 'choice', speaker: '', text: '이번엔 어떤 포즈로 찍을까요? (세 번 골라볼 수 있어요)', characterId: null,
    choices: [
      { id: 'v', label: '브이', goto: 'pose-v' },
      { id: 'heart', label: '손가락 하트', goto: 'pose-heart' },
      { id: 'turn', label: '뒤돌아보기', goto: 'pose-turn' },
      { id: 'smile', label: '그냥 웃기', goto: 'pose-smile' },
      { id: 'together', label: '영우와 같이 찍기', goto: 'pose-together' },
    ],
  },
  { id: 'pose-v', speaker: '지수', text: '브이!', characterId: 'jisoo', expression: 'happy', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }, { type: 'setFlag', key: 'w1-last-pose', value: '브이' }], goto: 'pose-loop-check' },
  { id: 'pose-heart', speaker: '지수', text: '이렇게, 손가락 하트.', characterId: 'jisoo', expression: 'smirk', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }, { type: 'setFlag', key: 'w1-last-pose', value: '손가락 하트' }], goto: 'pose-loop-check' },
  { id: 'pose-turn', speaker: '', text: '지수가 살짝 뒤돌아보는 포즈를 취한다.', characterId: 'jisoo', expression: 'curious', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }, { type: 'setFlag', key: 'w1-last-pose', value: '뒤돌아보기' }], goto: 'pose-loop-check' },
  { id: 'pose-smile', speaker: '지수', text: '그냥 웃을게요.', characterId: 'jisoo', expression: 'happy', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }, { type: 'setFlag', key: 'w1-last-pose', value: '그냥 웃기' }], goto: 'pose-loop-check' },
  { id: 'pose-together', speaker: '영우', text: '나도? 그럼 셀프타이머로.', characterId: 'youngwoo', expression: 'soft', effects: [{ type: 'incrementFlag', key: 'w2-pose-count' }, { type: 'setFlag', key: 'w1-last-pose', value: '같이 찍기' }], goto: 'pose-loop-check' },
  {
    id: 'pose-loop-check', type: 'choice', speaker: '', text: '더 찍어볼까요?', characterId: null,
    choices: [
      { id: 'more', label: '한 번 더', goto: 'pose-loop' },
      { id: 'enough', label: '이 정도면 충분해요', goto: 'line-005' },
    ],
  },
  { id: 'line-005', speaker: '', text: '지수가 브이를 했다가, 손가락 하트를 했다가,\n결국 그냥 웃는 얼굴로 정착한다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '영우', text: '역시 그냥 웃는 게 제일 낫다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-007', speaker: '지수', text: '그럼 나머지는 왜 찍었어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '영우', text: '비교군이 있어야 알지 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '지수', text: '이제 저도 하나 찍어줄게요.\n이리 와요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '나는 됐는데', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '안 돼요.\n기록 남겨야죠.', characterId: 'jisoo', expression: 'smirk' },
  {
    id: 'angle-choice', type: 'choice', speaker: '지수', text: '음, 어떤 각도로 찍을까요?', characterId: 'jisoo', expression: 'curious',
    choices: [
      { id: 'opera-center', label: '오페라하우스 중심', goto: 'angle-opera', effects: [{ type: 'setFlag', key: 'w1-angle-pick', value: 'opera' }] },
      { id: 'bridge-center', label: '하버브리지 중심', goto: 'angle-bridge', effects: [{ type: 'setFlag', key: 'w1-angle-pick', value: 'bridge' }] },
      { id: 'face-center', label: '영우 얼굴 중심', goto: 'angle-face', effects: [{ type: 'setFlag', key: 'w1-angle-pick', value: 'face' }] },
    ],
  },
  { id: 'angle-opera', speaker: '지수', text: '오페라하우스 딱 걸리게.', characterId: 'jisoo', expression: 'curious', goto: 'line-012' },
  { id: 'angle-bridge', speaker: '지수', text: '다리도 같이 나오게.', characterId: 'jisoo', expression: 'curious', goto: 'line-012' },
  { id: 'angle-face', speaker: '지수', text: '오늘은 그냥 얼굴 위주로.', characterId: 'jisoo', expression: 'smirk', goto: 'line-012' },
  { id: 'line-012', speaker: '', text: '한참을 그렇게 놀던 중,\n지수의 눈에 낯선 팻말 하나가 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '지수', text: '어?\n저기 저거 뭐예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-014', speaker: '영우', text: '어디?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015', speaker: '지수', text: '저 골목 안쪽.\n뭔가 전시하나 본데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-016', speaker: '영우', text: '오, 팝업 전시네.\n한번 볼래?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-017', speaker: '지수', text: '웅웅 잠깐만 보고 가요.', characterId: 'jisoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 1 · SCENE 03 「증거 수집 · 전시장」
   Dialogue Set: dialogue-week1-scene003
   Scene: week1-scene-003 (빈티지 팝업 전시장, 10:40)

   ===== 전시장 자유 조사 -> 증거 수집으로 전환 =====
   원래 여기 있던 10개 핫스팟 텍스트 선택지 루프(hotspot-menu)는
   week1-scene-003-minigame(dev/minigame-exhibition-search)으로 옮겼고, 이후
   `minigames`가 아니라 `evidenceCollections`(/dev/evidence, § 증거 수집)로
   재분류됐다 — minigame-phone-search(핸드폰을 찾아라)와 같은 "핫스팟 탐색 +
   증거 획득 토스트" 방식에, /dev/upload로 실제 전시장 사진을 업로드하고
   핫스팟 위치를 지정할 수 있는 room-hotspot 파이프라인까지 동일하게
   붙였다(§ minigameId/roomHotspots 참고). 사진이 아직 없으면 기존 그리드
   카드 모드로 그대로 동작한다.
   이 VN 씬은 짧은 도입부만 담당하고, K-01 발견/필수·선택 조사/붐빔 전환/
   보너스 단서는 전부 미니게임 쪽에 있다(§ minigame-exhibition-search 참고).

   미니게임으로 넘어가기 직전, 입장 직후에 전시장 직원과 짧게 안내를 주고받고
   영우/지수 티키타카 한 소절을 끼워 넣는다(staff-greet-1~4, banter-1~9).
   flag/effect 없는 순수 텍스트 비트로, 미니게임 핸드오프에는 영향을 주지 않는다. */
const week1Scene003Lines = [
  { id: 'line-001', speaker: '', text: '빈티지 팝업 전시장.\n오전 10시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '작은 공간에 오래된 시계, 카메라, 금속 공예품들이\n유리 진열장 안에 나란히 놓여 있다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '오 여기 나름 알차네.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '그치.\n생각보다 물건이 많아.\n천천히 한번 둘러볼래?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'staff-greet-1', speaker: '전시장 직원', text: '어서 오세요.\n편하게 둘러보시면 됩니다.', characterId: null },
  { id: 'staff-greet-2', speaker: '지수', text: '감사합니다!', characterId: 'jisoo', expression: 'happy' },
  { id: 'staff-greet-3', speaker: '전시장 직원', text: '사진은 자유롭게 찍으셔도 되는데,\n진열장 안쪽은 손대지 말아주세요.', characterId: null },
  { id: 'staff-greet-4', speaker: '영우', text: '네, 조심할게요.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'banter-1', speaker: '지수', text: '근데 여기 입장료도 없던데,\n이런 덴 어떻게 운영되는 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'banter-2', speaker: '영우', text: '팝업이라 그런 걸걸.\n짧게 열고 닫는 대신 홍보 목적이 크니까.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'banter-3', speaker: '지수', text: '오, 의외로 좀 아네요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'banter-4', speaker: '영우', text: '가이드북에 다 나와 있던데.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'banter-5', speaker: '지수', text: '역시 우리 인간 가이드북.', characterId: 'jisoo', expression: 'happy' },
  { id: 'banter-6', speaker: '영우', text: '그 별명 진짜 별로다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'banter-7', speaker: '지수', text: '그래도 마음엔 들죠?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'banter-8', speaker: '영우', text: '...\n조금.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'banter-9', speaker: '지수', text: 'ㅋㅋㅋ\n자, 그럼 슬슬 구경해볼까요?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-005', speaker: '지수', text: '웅웅, 하나씩 다 볼래요.', characterId: 'jisoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 1 · SCENE 04 「도난 발생 및 사진 분석」
   Dialogue Set: dialogue-week1-scene004
   Scene: week1-scene-004 (빈티지 팝업 전시장, 10:47)
   Ends on a MINIGAME START beat — nextSceneId hands off to the expanded
   photo-zoom minigame (week1-scene-004-minigame), whose own completion then
   redirects into week1-scene-004-review for the remaining 시간순 배열/시간
   범위 선택 단계 (§8 1~2단계, 5단계 — 3~4단계는 미니게임 자체가 담당). */
const week1Scene004Lines = [
  { id: 'line-001', speaker: '', text: '같은 전시장.\n오전 10시 47분.', characterId: null },
  { id: 'line-002', speaker: '', text: '단체 관광객 무리가 빠져나가고 나서야\n전시장이 다시 조용해졌다.', characterId: null },
  { id: 'line-003', speaker: '전시장 직원', text: '어...\n잠깐만요.', characterId: null },
  { id: 'line-004', speaker: '', text: '직원이 진열장 하나를 붙잡고 당황한 얼굴을 하고 있다.', characterId: null },
  { id: 'line-005', speaker: '지수', text: '무슨 일이에요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '전시장 직원', text: '여기 있던 물건이 없어졌어요.', characterId: null },
  { id: 'line-007', speaker: '영우', text: '없어지다니요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '전시장 직원', text: 'K-01이요.\n분명 아까까지 여기 있었는데.', characterId: null },
  { id: 'line-009', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'shocked' },
  { id: 'line-010', speaker: '지수', text: '아까 그 황동 장치요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-011', speaker: '전시장 직원', text: '네, 그거요.\n혹시 방금 사진 찍으셨죠?', characterId: null },
  { id: 'line-012', speaker: '지수', text: '아, 네.\n찍긴 했는데요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '전시장 직원', text: '그거 저희한테 잠깐 좀 보여주실 수 있어요?\n마지막으로 있던 게 언제인지 확인해야 해서요.', characterId: null },
  { id: 'line-014', speaker: '영우', text: '보안 카메라는 없어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015', speaker: '전시장 직원', text: '있긴 한데, 방금 그 인파 때문에 화면이 거의 안 보여요.', characterId: null },
  { id: 'line-016', speaker: '전시장 직원', text: '손님 사진이 그나마 제일 선명할 것 같아서요.', characterId: null },
  { id: 'line-017', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-018', speaker: '영우', text: '지수야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '왜요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-020', speaker: '영우', text: '이거 진짜 아무 일도 없는 하루 맞아?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-021', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-022', speaker: '지수', text: '일단 보여드릴게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-023', speaker: '전시장 직원', text: '여기, 사진들이요.\n확대해서 한 명씩 보시면 도움이 될 것 같아요.', characterId: null },
  { id: 'line-024', speaker: '지수', text: '몇 장이나 있어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-025', speaker: '전시장 직원', text: '일곱 장 정도요.\n사람들이 겹쳐 나와서 좀 헷갈리실 수도 있어요.', characterId: null },
  { id: 'line-026', speaker: '영우', text: '그럼 하나씩 확대해서 보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-027', speaker: '지수', text: '웅.\n누가 K-01 근처에 계속 있었는지, 그리고 케이스 자체가 어떻게 바뀌었는지가 중요하겠죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-028', speaker: '영우', text: '진짜 탐정 같네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-029', speaker: '지수', text: '지금은 그런 말 넣어두세요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-030', speaker: '', text: '지수와 영우가 사진들을 하나씩 확대해서 살펴보기 시작했다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-031', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 04-REVIEW 「사진 분석 마무리」
   Dialogue Set: dialogue-week1-scene004-review
   Scene: week1-scene-004-review (빈티지 팝업 전시장, 10:56)

   ===== 1주차 장편 확장 v2 · §8 =====
   photo-zoom 미니게임(2~3단계: 상태 변화/인물 태그) 완료 직후 이어지는
   VN 파트 — 1단계(시간순 배열)와 5단계(사건 발생 시간 선택)를 choice
   체인으로 마무리한다. 1단계는 5장을 시간순으로 하나씩 골라야 하고(순서
   틀리면 짧은 반응 후 같은 단계로), 5단계는 "정답은 넓은 구간으로 먼저
   제시" 원칙대로 10:44~10:48 하나만 정답으로 두고 나머지는 오답 처리한다. */
const week1Scene004ReviewLines = [
  { id: 'line-001', speaker: '', text: '전시장 한쪽.\n오전 10시 56분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '이제 이 사진들, 시간 순서대로 한번 놓아볼까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '영우', text: '그래, 하나씩 짚어보자.', characterId: 'youngwoo', expression: 'soft' },
  {
    id: 'order-1', type: 'choice', speaker: '', text: '가장 이른 사진은?', characterId: null,
    choices: [
      { id: 'a', label: '10:41 — 한산한 전시장', goto: 'order-2' },
      { id: 'b', label: '10:47 — 인파가 몰리는 순간', goto: 'order-wrong' },
      { id: 'c', label: '10:53 — 텅 빈 케이스', goto: 'order-wrong' },
    ],
  },
  { id: 'order-wrong', speaker: '영우', text: '음... 그건 아직 이르지 않아?', characterId: 'youngwoo', expression: 'curious', goto: 'order-1' },
  {
    id: 'order-2', type: 'choice', speaker: '', text: '그다음은?', characterId: null,
    choices: [
      { id: 'a', label: '10:43 — 케이스 앞에 두 사람', goto: 'order-3' },
      { id: 'b', label: '10:48 — 진열장 문이 열려 있다', goto: 'order-wrong-2' },
      { id: 'c', label: '10:53 — 텅 빈 케이스', goto: 'order-wrong-2' },
    ],
  },
  { id: 'order-wrong-2', speaker: '지수', text: '아직 순서가 안 맞아요.', characterId: 'jisoo', expression: 'suspicious', goto: 'order-2' },
  {
    id: 'order-3', type: 'choice', speaker: '', text: '그다음은?', characterId: null,
    choices: [
      { id: 'a', label: '10:45 — 다시 케이스 앞', goto: 'order-4' },
      { id: 'b', label: '10:53 — 텅 빈 케이스', goto: 'order-wrong-3' },
    ],
  },
  { id: 'order-wrong-3', speaker: '영우', text: '아니, 그건 한참 뒤 얘기야.', characterId: 'youngwoo', expression: 'blank', goto: 'order-3' },
  {
    id: 'order-4', type: 'choice', speaker: '', text: '그다음은?', characterId: null,
    choices: [
      { id: 'a', label: '10:47/10:48 — 인파와 진열장 문', goto: 'order-5' },
      { id: 'b', label: '10:53 — 텅 빈 케이스', goto: 'order-wrong-4' },
    ],
  },
  { id: 'order-wrong-4', speaker: '지수', text: '그건 마지막이에요.', characterId: 'jisoo', expression: 'suspicious', goto: 'order-4' },
  {
    id: 'order-5', type: 'choice', speaker: '', text: '마지막은?', characterId: null,
    choices: [
      { id: 'a', label: '10:53 — 텅 빈 케이스', goto: 'order-done' },
      { id: 'b', label: '10:41 — 한산한 전시장', goto: 'order-wrong-5' },
    ],
  },
  { id: 'order-wrong-5', speaker: '영우', text: '그건 이미 아까 지나갔잖아.', characterId: 'youngwoo', expression: 'curious', goto: 'order-5' },
  { id: 'order-done', speaker: '지수', text: '좋아요, 순서 맞췄어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '그럼 이제, 실제로 없어진 시간대는 언제쯤일까?', characterId: 'youngwoo', expression: 'curious' },
  {
    id: 'range-choice', type: 'choice', speaker: '', text: '사건 발생 시간대를 골라보세요. (넓게 잡아도 괜찮아요)', characterId: null,
    choices: [
      { id: 'narrow', label: '10:46~10:47 사이, 아주 정확히', goto: 'range-wrong' },
      { id: 'wide', label: '10:44~10:48 사이, 대략 이쯤', goto: 'range-correct' },
      { id: 'toowide', label: '10:40~11:00 사이, 아무 때나', goto: 'range-wrong' },
    ],
  },
  { id: 'range-wrong', speaker: '지수', text: '음... 아직 그렇게까지 좁히거나 넓힐 근거는 없는 것 같아요.', characterId: 'jisoo', expression: 'suspicious', goto: 'range-choice' },
  {
    id: 'range-correct', speaker: '영우', text: '그 정도면 사진들이랑 딱 맞네.', characterId: 'youngwoo', expression: 'soft',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-theft-time-range', code: 'E-TR1', title: '사건 발생 추정 시간대',
        description: '사진 분석 결과, K-01이 사라진 시점은 10시 44분에서 10시 48분 사이로 추정된다. 정확한 순간은 아직 좁혀지지 않았다.',
        discoveredLocationText: 'Pop-up Exhibition · 사진 분석',
      },
    }],
  },
  { id: 'line-005', speaker: '지수', text: '일단 이 정도면 됐어요.\n이제 사람들한테 물어보러 가죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '누구부터?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '사진에 제일 많이 나온 사람부터 볼까요.', characterId: 'jisoo', expression: 'suspicious' },
];

/* OPERATION MK — WEEK 1 · SCENE 05 「용의자 선별 및 현장 재조사」 (신규)
   Dialogue Set: dialogue-week1-scene005
   Scene: week1-scene-005 (빈티지 팝업 전시장, 11:00)

   ===== 1주차 장편 확장 v2 · §9 =====
   신규 씬. 단계 A(용의자 후보 선택, 반복 선택 루프) → 단계 B(현장 재조사,
   §18의 선택 조사 A/B/C를 여기 포함) → 단계 C(첫 가설 선택, 정답은 항상
   "아직 판단 불가"지만 고른 값은 flag로 남아 이후 지수 대사에 살짝
   반영된다). 선택 조사 evidence 중 일부는 이후 레오 집중 심문(Round 5)에서
   "정답 증거"의 대체 옵션으로도 인정된다(evidenceIds 배열에 같이 등재). */
const week1Scene005Lines = [
  { id: 'line-001', speaker: '', text: '전시장 한쪽, 사람들이 빠져나간 자리.\n오전 11시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '자, 사진에 나온 사람들부터 다시 짚어볼게요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'suspect-menu', type: 'choice', speaker: '', text: '누구를 용의선상에 올릴까요?', characterId: null,
    choices: [
      { id: 'minah', label: '베이지 코트 여성', goto: 'suspect-minah' },
      { id: 'adrian', label: '네이비 수트 남성', goto: 'suspect-adrian' },
      { id: 'leo', label: '그레이 후드 남성', goto: 'suspect-leo' },
      { id: 'touristA', label: '그냥 지나가던 관광객 A', goto: 'suspect-wrong' },
      { id: 'touristB', label: '가족 단위 관광객 B', goto: 'suspect-wrong' },
      { id: 'done', label: '이 정도면 후보는 다 나온 것 같다', condition: { flags: ['suspect-selection-complete'] }, goto: 'reexam-intro' },
    ],
  },
  {
    id: 'suspect-minah', speaker: '지수', text: '이분, 사진마다 계속 나와요. 다시 만나봐야겠어요.', characterId: 'jisoo', expression: 'suspicious', goto: 'suspect-menu',
    effects: [
      { type: 'setFlag', key: 'suspect-picked:minah', value: true },
      { type: 'setFlagIfAll', flags: ['suspect-picked:minah', 'suspect-picked:adrian', 'suspect-picked:leo'], key: 'suspect-selection-complete' },
    ],
  },
  {
    id: 'suspect-adrian', speaker: '영우', text: '이분은 정장 차림인데, 직원인가 관계자인가 애매하네.', characterId: 'youngwoo', expression: 'curious', goto: 'suspect-menu',
    effects: [
      { type: 'setFlag', key: 'suspect-picked:adrian', value: true },
      { type: 'setFlagIfAll', flags: ['suspect-picked:minah', 'suspect-picked:adrian', 'suspect-picked:leo'], key: 'suspect-selection-complete' },
    ],
  },
  {
    id: 'suspect-leo', speaker: '지수', text: '이 사람, 인파 몰리기 직전까지 케이스 바로 앞에 있었어요.', characterId: 'jisoo', expression: 'suspicious', goto: 'suspect-menu',
    effects: [
      { type: 'setFlag', key: 'suspect-picked:leo', value: true },
      { type: 'setFlagIfAll', flags: ['suspect-picked:minah', 'suspect-picked:adrian', 'suspect-picked:leo'], key: 'suspect-selection-complete' },
    ],
  },
  { id: 'suspect-wrong', speaker: '영우', text: '음, 이분은 그냥 한 번 스쳐 지나간 것 같은데.', characterId: 'youngwoo', expression: 'blank', goto: 'suspect-menu' },
  { id: 'reexam-intro', speaker: '영우', text: '그럼 이제, 사건 전이랑 뭐가 달라졌는지 다시 한번 볼까?', characterId: 'youngwoo', expression: 'curious' },
  {
    // 태그 위치/먼지 자국은 나중에 필수 심문 게이트(week1-scene-007 R4,
    // week1-scene-009 R4/R5)의 유일하거나 핵심적인 근거라, 재조사 루프의
    // "선택" 항목이 아니라 여기서 먼저 확정적으로 보여준다 — 선택 조사(§18)는
    // 아래 reexam-menu 루프에만 남긴다.
    id: 'reexam-tag', speaker: '지수', text: '어? 태그 위치가 아까 봤을 때랑 다른데요.', characterId: 'jisoo', expression: 'suspicious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-staff-tag-position-after', code: 'E-H01B', title: '직원용 태그 위치 (사건 후)',
        description: '사건 전 접수대 오른쪽에 있던 직원용 태그가, 지금은 왼쪽으로 옮겨져 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 현장 재조사',
      },
    }],
  },
  {
    id: 'reexam-dust', speaker: '영우', text: '이거 봐, 진열장 유리 안쪽에 자국이 남아 있어.', characterId: 'youngwoo', expression: 'curious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-case-dust-mark', code: 'E-H05', title: '진열장 먼지 자국',
        description: '진열장 유리 안쪽, K-01이 있던 자리 주변에 누군가 손을 짚은 듯한 자국이 남아 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 현장 재조사',
      },
    }],
  },
  {
    id: 'reexam-menu', type: 'choice', speaker: '', text: '그 밖에 더 살펴볼까요? (선택)', characterId: null,
    choices: [
      { id: 'staffdoor', label: '직원 전용문', goto: 're-staffdoor' },
      { id: 'guestbook', label: '방명록 페이지', goto: 're-guestbook' },
      { id: 'staff-ask', label: '전시장 직원에게 더 물어보기', goto: 're-staff-ask' },
      { id: 'cafe-ask', label: '카페 직원에게 물어보기', goto: 're-cafe-ask' },
      { id: 'tourist-ask', label: '관광객에게 사진 요청하기', goto: 're-tourist-ask' },
      { id: 'reexam-done', label: '이 정도면 됐다', goto: 'hypothesis-intro' },
    ],
  },
  {
    id: 're-staffdoor', speaker: '지수', text: '아까는 닫혀 있었는데, 지금은 반쯤 열려 있어요.', characterId: 'jisoo', expression: 'suspicious', goto: 'reexam-menu',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-staffdoor-ajar', code: 'E-H06', title: '직원 전용문 반쯤 열림',
        description: '자유 조사 때는 닫혀 있던 직원 전용문이, 지금은 반쯤 열려 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 현장 재조사',
      },
    }],
  },
  {
    id: 're-guestbook', speaker: '영우', text: '방명록 페이지 한 장이 접혀 있네.', characterId: 'youngwoo', expression: 'curious', goto: 'reexam-menu',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-guestbook-folded-page', code: 'E-H07', title: '방명록 페이지 접힘',
        description: '방명록 한 페이지 모서리가 접혀 있다. 급하게 넘기다 그런 것처럼 보인다.',
        discoveredLocationText: 'Pop-up Exhibition · 현장 재조사',
      },
    }],
  },
  {
    id: 're-staff-ask', speaker: '전시장 직원', text: '아, 태그요? 그건 저희가 진열장 정리할 때만 써요.\n잠금 확인은 오늘 아침 9시에 한 번 했고요.', characterId: null, goto: 'reexam-menu',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-staff-lock-check-time', code: 'E-SEL1', title: '진열장 잠금 확인 시각',
        description: '직원 — 진열장 잠금은 오늘 아침 9시에 한 번 확인했다. 그 이후로는 따로 확인하지 않았다.',
        discoveredLocationText: 'Pop-up Exhibition · 선택 조사(직원)',
      },
    }],
  },
  {
    id: 're-cafe-ask', speaker: '카페 직원', text: '그레이 후드요? 아, 그 손님 커피 주문하고 바로 안 앉으시더라고요.\n가방은 의자 밑에 뒀고, 누구랑 통화도 하시던데요.', characterId: null, goto: 'reexam-menu',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-cafe-staff-tip', code: 'E-SEL2', title: '카페 직원 증언',
        description: '카페 직원 — 그레이 후드 남성은 주문 후 바로 앉지 않았고, 가방을 의자 아래 뒀으며, 누군가와 통화를 했다.',
        discoveredLocationText: 'Café near Circular Quay · 선택 조사(카페)',
      },
    }],
  },
  {
    id: 're-tourist-ask', speaker: '관광객 일행', text: '어, 사진이요? 저희가 찍은 거 중에 하나 보내드릴게요.\n저기 저 문 근처에도 누가 지나가는 게 찍혔더라고요.', characterId: null, goto: 'reexam-menu',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-tourist-extra-photo', code: 'E-SEL3', title: '관광객 추가 사진 — 직원 전용문 근처 실루엣',
        description: '관광객이 추가로 건네준 사진. 직원 전용문 근처를 지나가는 그레이 후드 남성의 실루엣이 찍혀 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 선택 조사(관광객)',
      },
    }],
  },
  { id: 'hypothesis-intro', speaker: '지수', text: '자, 정리해볼게요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'hypothesis-choice', type: 'choice', speaker: '', text: '현재 가장 가능성 높은 것은?', characterId: null,
    choices: [
      { id: 'impulse', label: '외부 방문객의 충동 절도', goto: 'hyp-any', effects: [{ type: 'setFlag', key: 'w1-first-hypothesis', value: '충동 절도' }] },
      { id: 'insider', label: '내부 직원의 계획적 절도', goto: 'hyp-any', effects: [{ type: 'setFlag', key: 'w1-first-hypothesis', value: '내부 계획' }] },
      { id: 'commission', label: '누군가 특정 물건만 노린 의뢰형 사건', goto: 'hyp-any', effects: [{ type: 'setFlag', key: 'w1-first-hypothesis', value: '의뢰형' }] },
      { id: 'unsure', label: '아직 판단 불가', goto: 'hyp-any', effects: [{ type: 'setFlag', key: 'w1-first-hypothesis', value: '판단 불가' }] },
    ],
  },
  { id: 'hyp-any', speaker: '영우', text: '그럴듯한데, 아직은 뭐가 맞는지 모르겠다.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-003', speaker: '지수', text: '맞아요.\n일단 한 명씩 직접 만나서 물어보죠.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 1 · SCENE 06 「윤민아 1차 심문」
   Dialogue Set: dialogue-week1-scene006
   Scene: week1-scene-006 (Pop-up Exhibition, 11:10)

   ===== 1주차 장편 확장 v2 · §10 =====
   4라운드로 확장: 체류시간(Round1) → 촬영여부(Round2) → 촬영목적(Round3) →
   삭제사진(Round4). Round4의 "그냥 넘어간다" 선택은 게임을 막지 않되
   flag('mina-photo-recovery-skipped')를 남겨 week1-scene-011(최종 심문)에서
   자동으로 다시 등장한다 — 문서 §10 "넘어가도 이후 자동 재요청 가능"의 구현. */
const week1Scene006Lines = [
  {
    id: 'line-001', speaker: '', text: '전시장 한쪽.\n오전 11시 10분.', characterId: null,
    effects: [{
      type: 'addPerson',
      person: { id: 'minah', name: '윤민아', role: '용의자', status: 'suspect', summary: 'K-01 진열장 앞에서 여러 번 목격된 여성.' },
    }],
  },
  { id: 'line-002', speaker: '', text: '사진 속에서 세 번이나 K-01 근처에 있던 여자,\n윤민아를 찾아냈다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저기, 잠시만요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '윤민아', text: '네?', characterId: 'minah', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '아까 이 근처에 계속 계셨죠?\n이 진열장 앞에서요.', characterId: 'jisoo', expression: 'curious' },

  {
    id: 'mina-r1', type: 'evidence', speaker: '윤민아', text: '아... 아니요. 진열장 앞에는 잠깐만 있었어요.', characterId: 'minah', expression: 'neutral',
    evidenceIds: ['evidence-photo-minah'],
    wrongText: ['윤민아가 눈을 피하며 말끝을 흐린다. 아직 결정적인 게 아닌 듯하다.', '그건 이미 보여드린 거예요 — 다른 걸 찾아보세요.'],
    correctGoto: 'mina-r1-break',
  },
  { id: 'mina-r1-break', speaker: '영우', text: '사진에는 세 번이나 나오시던데요. "잠깐"치고는 좀 길지 않아요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'mina-r1-2', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'mina-r1-3', speaker: '윤민아', text: '그, 그건... 물건이 예뻐서 계속 눈이 갔을 뿐이에요.', characterId: 'minah', expression: 'annoyed' },

  {
    id: 'mina-r2', type: 'evidence', speaker: '윤민아', text: '아무튼 사진은 안 찍었어요.', characterId: 'minah', expression: 'neutral',
    evidenceIds: ['evidence-mina-lens-reflection'],
    wrongText: ['윤민아: "그게 왜요?" — 아직 촬영 자체를 증명하진 못했다.', '지수가 다시 생각해본다. 카메라 자체에서 뭔가 찾을 수 있지 않을까?'],
    correctGoto: 'mina-r2-break',
  },
  { id: 'mina-r2-break', speaker: '지수', text: '근데 이 렌즈에 K-01이 또렷하게 비치는데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'mina-r2-2', speaker: '윤민아', text: '...\n하아.', characterId: 'minah', pauseBeforeMs: 400, expression: 'annoyed' },
  { id: 'mina-r2-3', speaker: '윤민아', text: '...\n네, 찍었어요.', characterId: 'minah', expression: 'annoyed' },

  {
    id: 'mina-r3', type: 'choice', speaker: '지수', text: '왜 몰래 촬영했어요?', characterId: 'jisoo', expression: 'curious',
    choices: [
      { id: 'sell', label: '전시품 판매', goto: 'mina-r3-wrong' },
      { id: 'moodboard', label: '무드보드 제작', goto: 'mina-r3-correct' },
      { id: 'commission', label: 'K-01 의뢰 수행', goto: 'mina-r3-wrong' },
    ],
  },
  { id: 'mina-r3-wrong', speaker: '윤민아', text: '아니에요, 그런 거.', characterId: 'minah', expression: 'annoyed', goto: 'mina-r3' },
  {
    id: 'mina-r3-correct', speaker: '윤민아', text: '...\n맞아요. 제가 하는 편집숍 무드보드용으로 필요해서요.', characterId: 'minah', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-illegal-photo', code: 'E-M01', title: '윤민아의 비공식 촬영 자백',
        description: '전시품을 촬영 금지 규정을 어기고 몰래 찍었다고 시인했다. 이유는 "편집숍 무드보드 참고용".',
        discoveredLocationText: 'Pop-up Exhibition · 윤민아 1차 조사',
      },
    }],
  },
  { id: 'mina-r3-2', speaker: '영우', text: '여기 촬영 금지인 거 알고 계셨죠?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'mina-r3-3', speaker: '윤민아', text: '네... 알아요. 그래서 들킬까봐 그 앞에서만 계속 서성인 거예요.\n죄송해요.', characterId: 'minah', expression: 'neutral' },

  { id: 'mina-r4-1', speaker: '지수', text: '그럼 그 사진들, 지금 폰에 있어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'mina-r4-2', speaker: '윤민아', text: '아니요.\n찍은 사진은 전부 지웠어요.', characterId: 'minah', expression: 'neutral' },
  {
    id: 'mina-r4-choice', type: 'choice', speaker: '', text: '어떻게 할까요?', characterId: null,
    choices: [
      { id: 'recover', label: '삭제 사진 복구를 요청한다', goto: 'mina-r4-recover' },
      { id: 'skip', label: '그냥 넘어간다', goto: 'mina-r4-skip' },
    ],
  },
  {
    id: 'mina-r4-recover', speaker: '윤민아', text: '...\n네? 그것까지 봐야 해요?', characterId: 'minah', expression: 'annoyed',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-recovered-photo-fragment', code: 'E-M02', title: '복구된 삭제 사진 일부',
        description: '완전히 복구되진 않았지만, K-01 뒷면 각인 부분을 확대 촬영한 흔적이 남아 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 윤민아 1차 조사',
      },
    }, { type: 'setFlag', key: 'mina-photo-recovery-done', value: true }],
    goto: 'mina-end-1',
  },
  {
    id: 'mina-r4-skip', speaker: '지수', text: '...\n일단 넘어가죠.', characterId: 'jisoo', expression: 'blank',
    effects: [{ type: 'setFlag', key: 'mina-photo-recovery-skipped', value: true }],
    goto: 'mina-end-1',
  },
  { id: 'mina-end-1', speaker: '지수', text: '그럼 K-01 자체는 신경 안 쓰셨다는 거죠?', characterId: 'jisoo', expression: 'curious' },
  { id: 'mina-end-2', speaker: '윤민아', text: '그게 뭔지도 몰랐는데요.', characterId: 'minah', expression: 'neutral' },
  { id: 'mina-end-3', speaker: '영우', text: '...\n일단은 아닌 것 같은데.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'mina-end-4', speaker: '지수', text: '그러게요.\n그냥 촬영하다 걸릴까봐 그런 거네요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'mina-end-5', speaker: '지수', text: '감사합니다.\n확인차 여쭤봤어요.', characterId: 'jisoo', expression: 'soft' },
  {
    id: 'mina-end-6', speaker: '윤민아', text: '아뇨, 저도 놀랐어요.\n뭐 없어졌다니.', characterId: 'minah', expression: 'shocked',
    effects: [
      {
        type: 'setPersonStatus', id: 'minah', status: 'cleared',
        patch: {
          knownFacts: ['K-01 진열장 앞에서 세 차례 반복 목격됨 (사진 기록)', '카메라 렌즈 반사로 촬영 사실 확인', '촬영 금지 규정을 어기고 K-01 등 전시품을 몰래 촬영함 (편집숍 무드보드용)'],
          lies: ['"진열장 앞에는 잠깐만 있었다" (1차)', '"사진은 안 찍었다" (2차)'],
          unknowns: ['찍은 사진을 어디로, 누구에게 전달했는지'],
        },
      },
      { type: 'setQuestionStatus', id: 'question-mina-repeat', status: 'partial', resolutionText: '촬영 금지 규정 위반은 시인했다. 다만 도난 자체와의 직접적 연관은 아직 확인되지 않았다.' },
    ],
  },
  { id: 'mina-end-7', speaker: '', text: '[ 현재 판단: 윤민아 — 일부 해명 · 직접 절도 혐의 낮음 · 사진 유출 가능성 미확인 ]', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 07 「애드리언 1차 심문」
   Dialogue Set: dialogue-week1-scene007
   Scene: week1-scene-007 (Pop-up Exhibition 접수대, 11:25)

   ===== 1주차 장편 확장 v2 · §11 =====
   4라운드로 확장. 실명은 여전히 노출하지 않는다(M.K. 계정명까지만).
   Round4는 문서 지시대로 "직접 모순으로 확정하지 않고 의문으로 남긴다" —
   question-adrian-tag는 이 씬 안에서 resolved되지 않고 unresolved로 남는다. */
const week1Scene007Lines = [
  {
    id: 'line-001', speaker: '', text: '전시장 접수대 근처.\n오전 11시 25분.', characterId: null,
    effects: [{
      type: 'addPerson',
      person: { id: 'adrian', name: '애드리언 콜', role: '목격자', status: 'witness', summary: '팝업 전시를 기획한 갤러리 관계자.' },
    }],
  },
  { id: 'line-002', speaker: '', text: '사진 속 두 번째 인물, 애드리언 콜은\n이 팝업 전시를 기획한 갤러리 관계자였다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '실례합니다.\n잠깐 여쭤봐도 될까요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '애드리언 콜', text: '아, 네.\nK-01 때문에 그러시죠?', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '어떻게 아셨어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '애드리언 콜', text: '직원한테 들었어요.', characterId: 'adrian', expression: 'neutral' },

  { id: 'adrian-r1-1', speaker: '지수', text: '혹시 K-01에 대해 뭔가 짚이는 거 있으세요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'adrian-r1-2', speaker: '애드리언 콜', text: '음... 사실 최근에 외부 문의가 하나 있긴 했어요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'adrian-r1-3', speaker: '영우', text: '어떤 문의였는데요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'adrian-r1-4', speaker: '애드리언 콜', text: '그런 문의는 저희 쪽에 흔해요.\n갤러리 물건에 관심 갖는 분들 많거든요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'adrian-r1-5', speaker: '지수', text: '정확히 어떤 내용이었는데요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'adrian-r1-6', speaker: '애드리언 콜', text: '...\n음, 다시 생각해보니 좀 이례적이긴 했어요.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'adrian-r1-7', speaker: '애드리언 콜', text: '제작 시기, 재질, 세부 각인까지 꽤 구체적으로 물어봤거든요.', characterId: 'adrian', expression: 'neutral' },
  {
    id: 'adrian-r1-8', speaker: '지수', text: '비슷한 물건을 찾는다는 느낌이었어요, 아니면...?', characterId: 'jisoo', expression: 'suspicious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-inquiry', code: 'E-B01', title: 'K-01 외부 문의 기록',
        description: '최근 K-01과 비슷한 황동 물건에 대한 외부 문의가 있었다. 제작 시기, 재질, 세부 각인까지 비정상적으로 구체적이었다.',
        discoveredLocationText: 'Pop-up Exhibition · 접수대',
      },
    }],
  },
  { id: 'adrian-r1-9', speaker: '애드리언 콜', text: '그러게요.\n그냥 궁금해서 묻는 것치고는 너무 자세했어요.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'adrian-r1-10', speaker: '영우', text: '혹시 누가 보낸 건지 알 수 있을까요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'adrian-r1-11', speaker: '애드리언 콜', text: '잠시만요.\n메일함에 남아있을 거예요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'adrian-r1-12', speaker: '', text: '애드리언이 태블릿을 꺼내 메일을 띄운다.', characterId: 'adrian', expression: 'neutral' },
  {
    id: 'adrian-r1-13', speaker: '', text: '[ 발신 계정: M.K. ]\n[ 제목: Re: 문의드립니다 — 회신 주소 없음 · 소속 미표기 ]', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-sender', code: 'E-B02', title: '문의 발신 계정 — M.K.',
        description: '문의 메일의 발신 계정명은 "M.K."뿐이었다. 회신 주소나 소속 표기가 전혀 없었다.',
        discoveredLocationText: 'Pop-up Exhibition · 접수대',
      },
    }, {
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-email-re-prefix', code: 'E-B02B', title: '메일 제목의 "Re:"',
        description: '문의 메일 제목이 "Re: 문의드립니다"로 시작한다. Re:는 보통 답장에 붙는 접두사다 — 애초에 누군가 먼저 답장을 보낸 적 있다는 뜻일 수 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 접수대',
      },
    }],
  },
  { id: 'adrian-r1-14', speaker: '지수', text: '...\nM.K.?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'adrian-r1-15', speaker: '영우', text: '어디서 많이 본 이니셜인데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'adrian-r1-16', speaker: '애드리언 콜', text: '아는 이름이에요?', characterId: 'adrian', expression: 'suspicious' },
  { id: 'adrian-r1-17', speaker: '지수', text: '아... 아니요.\n비슷한 걸 본 적이 있어서요.', characterId: 'jisoo', expression: 'neutral' },

  {
    id: 'adrian-r2', type: 'evidence', speaker: '애드리언 콜', text: '아무튼, 답장은 하지 않았습니다.\n저희는 판매하는 곳이 아니라서요.', characterId: 'adrian', expression: 'neutral',
    evidenceIds: ['evidence-adrian-email-re-prefix'],
    wrongText: ['애드리언은 담담한 표정을 유지한다. 아직 정곡을 못 찔렀다.', '메일 자체 말고, 제목 표기를 다시 보세요.'],
    correctGoto: 'adrian-r2-break',
  },
  { id: 'adrian-r2-break', speaker: '지수', text: '근데 제목이 "Re:"로 시작하는데요.\n이거, 답장 아니에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'adrian-r2-2', speaker: '애드리언 콜', text: '...', characterId: 'adrian', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'adrian-r2-3', speaker: '애드리언 콜', text: '...\n아, 맞아요. 짧게 답장은 했어요.', characterId: 'adrian', expression: 'neutral' },

  {
    id: 'adrian-r3-1', type: 'choice', speaker: '지수', text: '뭐라고 답장하셨는데요?', characterId: 'jisoo', expression: 'curious',
    choices: [
      { id: 'ask-again', label: '(다시 물어본다)', goto: 'adrian-r3-2' },
    ],
  },
  { id: 'adrian-r3-2', speaker: '애드리언 콜', text: '그냥, 판매 불가 물품이라고만 답했어요.', characterId: 'adrian', expression: 'neutral' },
  {
    id: 'adrian-r3-3', type: 'choice', speaker: '영우', text: '정말요? 보낸 메일함 좀 보여주시겠어요?', characterId: 'youngwoo', expression: 'suspicious',
    choices: [
      { id: 'press', label: '(계속 요청한다)', goto: 'adrian-r3-4' },
    ],
  },
  { id: 'adrian-r3-4', speaker: '애드리언 콜', text: '...\n음, 잠시만요.', characterId: 'adrian', expression: 'suspicious' },
  {
    id: 'adrian-r3-5', speaker: '', text: '[ 보낸 메일함 — 캐시 기록 ]', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-sent-mail-cache', code: 'E-B08', title: '애드리언 보낸메일 캐시',
        description: '애드리언이 M.K. 계정에 보낸 답장 캐시. "판매 불가"뿐 아니라 이번 전시 일정(요일별 개방 시간)까지 함께 적혀 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 접수대',
      },
    }],
  },
  { id: 'adrian-r3-6', speaker: '지수', text: '여기, 전시 날짜까지 적혀 있는데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'adrian-r3-7', speaker: '애드리언 콜', text: '...\n아, 그거는... 그냥 일반적인 안내였어요.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'adrian-r3-8', speaker: '애드리언 콜', text: '판매 불가라고 답하면서, 언제 와서 직접 보시라고 안내한 것뿐이에요.', characterId: 'adrian', expression: 'neutral' },

  { id: 'adrian-r4-1', speaker: '영우', text: '한 가지만 더요. 사건 시간대에 직원용 태그는 누가 관리했어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'adrian-r4-2', speaker: '애드리언 콜', text: '그건 직원한테 맡겼죠. 저는 따로 안 만졌어요.', characterId: 'adrian', expression: 'neutral' },
  {
    id: 'adrian-r4-evidence', type: 'evidence', speaker: '', text: '제시할 증거를 골라보세요.', characterId: null,
    evidenceIds: ['evidence-staff-tag-position-before', 'evidence-staff-tag-position-after'],
    wrongText: '애드리언: "그게 무슨 상관이죠?" — 아직 태그 위치와 직접 연결되지 않았다.',
    correctGoto: 'adrian-r4-break',
  },
  { id: 'adrian-r4-break', speaker: '지수', text: '근데 사진에는, 애드리언씨 태블릿 케이스 바로 옆에 태그가 있던데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'adrian-r4-3', speaker: '애드리언 콜', text: '...', characterId: 'adrian', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'adrian-r4-4', speaker: '애드리언 콜', text: '음, 잠깐 옮겨놨을 수도 있고... 정확힌 기억이 안 나네요.', characterId: 'adrian', expression: 'neutral' },
  {
    id: 'adrian-r4-5', speaker: '영우', text: '...\n일단 알겠습니다.', characterId: 'youngwoo', expression: 'blank',
    effects: [{
      type: 'addQuestion',
      question: { id: 'question-adrian-tag', title: '왜 애드리언 근처에서 직원용 태그가 목격됐는가?', linkedEvidenceIds: ['evidence-staff-tag-position-before', 'evidence-staff-tag-position-after'] },
    }],
  },

  { id: 'line-007', speaker: '지수', text: '...\n알겠습니다. 감사해요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-008', speaker: '애드리언 콜', text: '그 시간에 진열장 근처에 있던 사람이라면... 저 말고도 몇 명 더 있었을 거예요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-009', speaker: '영우', text: '몇 명 더요?', characterId: 'youngwoo', expression: 'curious' },
  {
    id: 'line-010', speaker: '애드리언 콜', text: '그건 제가 알 수 없죠.\n손님이시니까.', characterId: 'adrian', expression: 'neutral',
    effects: [{
      type: 'setPersonStatus', id: 'adrian', status: 'witness',
      patch: {
        knownFacts: ['K-01에 대한 외부 문의가 있었음', '문의 내용이 비정상적으로 구체적 (제작 시기·재질·각인)', '"답장하지 않았다"고 했으나 실제로는 짧게 답장함 (전시 일정 포함)'],
        lies: ['"답장하지 않았습니다" (1차 부인)'],
        unknowns: ['발신 계정 M.K.의 실제 신원', '애드리언 근처에서 목격된 직원용 태그의 진짜 이유'],
      },
    }],
  },
  { id: 'line-011', speaker: '', text: '애드리언과 헤어진 뒤,\n지수가 수첩에 뭔가를 적었다.', characterId: null },
  { id: 'line-012', speaker: '', text: '[ M.K. — 문의 발신 계정, 실명 불명 ]', characterId: null },
  {
    id: 'line-013', speaker: '영우', text: '...\nM.K.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'serious',
    effects: [{
      type: 'addQuestion',
      question: { id: 'question-adrian-sender', title: 'K-01 문의를 보낸 M.K.는 누구인가?', linkedEvidenceIds: ['evidence-adrian-sender'] },
    }],
  },
  { id: 'line-014', speaker: '지수', text: '그 열쇠에 새겨진 거랑 똑같아요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-015', speaker: '', text: '[ 애드리언: 조사 필요 · 정보 유출 확인 · 직접 범행 미확인 ]', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 08 「레오 1차 심문 및 타임라인」
   Dialogue Set: dialogue-week1-scene008
   Scene: week1-scene-008 (전시장 근처 카페, 11:40)

   ===== 1주차 장편 확장 v2 · §12 =====
   레오의 진술 6가지(입장시각/한바퀴구경/K-01몰랐음/바로카페이동/대화안함/
   가방계속닫힘)를 명시적으로 다 진술시킨다 — 이후 week1-scene-009의
   여러 라운드가 이 6개를 하나씩 무너뜨리는 구조라, 여기서 전부 등장해야
   나중에 "본인이 스스로 한 말"로 되돌려 제시할 수 있다.
   Ends on a MINIGAME START beat — nextSceneId hands off to the expanded
   5단계 timeline minigame (week1-scene-008-minigame). */
const week1Scene008Lines = [
  {
    id: 'line-001', speaker: '', text: '전시장 근처 카페.\n오전 11시 40분.', characterId: null,
    effects: [{
      type: 'addPerson',
      person: { id: 'leo', name: '레오 박', role: '용의자', status: 'suspect', summary: '전시장 근처 카페에서 발견된 남성. 사진 속 K-01 진열장 근처에 반복 등장했다.' },
    }],
  },
  { id: 'line-002', speaker: '', text: '사진 속 세 번째 인물, 레오 박은\n전시장 바로 옆 카페에서 커피를 마시고 있었다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저기, 죄송한데 잠깐만요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '레오 박', text: '네?\n무슨 일이시죠.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '옆 전시장에서 물건이 하나 없어졌어요.\n혹시 아까 그 안에 계셨나요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '레오 박', text: '아, 그거요.\n네, 잠깐 들어갔었어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-007', speaker: '레오 박', text: '10시 42분쯤 들어가서 10시 58분쯤 나왔을 거예요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-008', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-009', speaker: '지수', text: '되게 정확하시네요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '레오 박', text: '아, 제가 원래 시간 체크하는 습관이 있어서요.\n다음 미팅이 있었거든요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-011', speaker: '영우', text: '그 안에서는 뭐 하셨어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '레오 박', text: '그냥 한 바퀴 구경했죠.\n딱히 특별한 건 없었어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-013', speaker: '지수', text: 'K-01은 알고 계셨어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-014', speaker: '레오 박', text: 'K-01이요? 아니요, 오늘 처음 들어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-015', speaker: '영우', text: '구경하고 바로 카페로 오신 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-016', speaker: '레오 박', text: '네, 바로 왔어요. 다른 데 들를 데도 없었고요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-017', speaker: '지수', text: '그 안에서 누구랑 얘기하신 분은요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '레오 박', text: '아니요, 아무하고도 얘기 안 했어요. 혼자 조용히 봤어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-019', speaker: '영우', text: '가방은 계속 그대로였어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-020', speaker: '레오 박', text: '네, 계속 닫혀 있었어요. 딱히 열 일이 없었으니까요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-021', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-022', speaker: '지수', text: '사진에는 K-01 진열장 앞에 꽤 오래 서 계신 걸로 나오는데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-023', speaker: '레오 박', text: '...\n그런가요.\n딱히 의식은 안 했는데.', characterId: 'leo', expression: 'blank' },
  { id: 'line-024', speaker: '영우', text: '지수야, 그 사진들 시간대별로 다시 한번 정리해볼까?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-025', speaker: '지수', text: '웅.\n이분 말이랑 실제 사진 시간이 맞는지 한번 맞춰보죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-026', speaker: '레오 박', text: '...\n그러세요.\n전 딱히 숨길 거 없으니까.', characterId: 'leo', expression: 'blank' },
  { id: 'line-027', speaker: '', text: '지수와 영우가 사진 속 시간과 레오의 진술을\n하나씩 시간축 위에 배치하기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-028', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 09 「레오 집중 심문」
   Dialogue Set: dialogue-week1-scene009
   Scene: week1-scene-009 (Pop-up Exhibition, 12:05)

   ===== 1주차 장편 확장 v2 · §13 =====
   1주차의 핵심 씬. 9라운드 전부 구현:
   R1 시간오류 → R2 K-01 인지 → R3 촬영목적 → R4 물건접촉 → R5 진열장 개방
   수단 → R6 단순이동 주장 → R7 의뢰 메시지 공개 → R8 참고사진 비교(A 재부상
   트리거) → R9 물건 반출 여부 인정.
   §3.3 진입 조건(타임라인 공백 + K-01 명찰 사진)을 choice condition으로
   게이트한다 — 조건 미충족 시 'wait' 옵션만 보이고 씬이 곧장 재시작되어
   사실상 "잠금 표시"처럼 동작한다(§20 게임오버 없음 원칙 유지).
   evidence-leo-bag-volume-change/evidence-cafe-cctv-bag-thicker는 R6/R9에서
   쓰이는데, 두 사람이 인터뷰 사이사이 확인해 둔 것으로 보고 씬 시작과
   동시에 자동 지급한다(놓칠 수 없게). */
const week1Scene009Lines = [
  {
    id: 'gate', type: 'choice', speaker: '', text: '레오씨를 다시 추궁하기 전에 — 준비는 다 됐나요?', characterId: null,
    choices: [
      { id: 'go', label: '레오씨에게 간다', condition: { hasEvidence: ['evidence-leo-timeline-gap', 'evidence-k01-nameplate-photo'] }, goto: 'line-001' },
      { id: 'wait', label: '아직인 것 같다', goto: 'gate-fail' },
    ],
  },
  { id: 'gate-fail', speaker: '', text: '아직 정황이 부족한 것 같다.\n타임라인이랑 사진부터 더 봐야겠어.', characterId: null, goto: 'gate' },

  {
    id: 'line-001', speaker: '', text: '전시장 앞.\n낮 12시 05분.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-first-statement', code: 'E-TL0', title: '레오 박의 최초 진술',
          description: '"10시 42분쯤 들어가서 10시 58분쯤 나왔다"는 레오 박 본인의 진술. 시간을 정확히 체크하는 습관이 있다고 스스로 강조했었다.',
          discoveredLocationText: 'Café near Circular Quay · 레오 박 조사',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-bag-volume-change', code: 'E-TL3', title: '레오 가방 부피 변화',
          description: '전시장 안에서 찍힌 사진과 이후 카페 사진을 비교하면, 레오의 가방이 눈에 띄게 더 두꺼워져 있다.',
          discoveredLocationText: 'Café near Circular Quay · 사진 대조',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-cafe-cctv-bag-thicker', code: 'E-TL4', title: '카페 CCTV 스틸 — 두꺼워진 가방',
          description: '카페 CCTV 스틸 화면. 레오가 자리에 앉을 때 가방이 전시장에서 나올 때보다 눈에 띄게 두꺼워 보인다.',
          discoveredLocationText: 'Café near Circular Quay · CCTV',
        },
      },
    ],
  },
  { id: 'line-002', speaker: '', text: '시간축을 다 맞춰보니,\n레오의 진술과 사진 사이에 공백이 있었다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '10시 47분부터 10시 58분까지.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '레오가 말한 시간이랑 안 맞아요.\n그 사이 사진에서 레오가 사라져요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '11분이면 뭘 하기엔 짧은 시간 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '물건 하나 빼서 가방에 넣기엔 충분해요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '', text: '다시 레오를 찾아갔다.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '레오씨, 여쭤볼 게 좀 더 있어서요.', characterId: 'jisoo', expression: 'neutral' },

  /* ===== Round 1. 시간 오류 ===== */
  {
    id: 'leo-r1', type: 'evidence', speaker: '레오 박', text: '전시장을 나오자마자 바로 카페에 갔습니다. 그게 전부예요.', characterId: 'leo', expression: 'neutral',
    evidenceIds: ['evidence-leo-timeline-gap'],
    wrongText: ['레오 박은 표정 변화 없이 같은 말을 반복한다. 아직 결정적이지 않다.', '시간표 자체를 다시 짚어보세요.'],
    correctGoto: 'leo-r1-break',
  },
  { id: 'leo-r1-break', speaker: '레오 박', text: '...\n하아.', characterId: 'leo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'leo-r1-2', speaker: '레오 박', text: '그 사진, 다시 한번 보여주시겠어요.', characterId: 'leo', expression: 'blank' },
  { id: 'leo-r1-3', speaker: '', text: '지수가 시간대별로 정리된 사진과 시간축을 다시 보여준다.', characterId: null },
  { id: 'leo-r1-4', speaker: '레오 박', text: '...\n제가 시간을 착각했나 봐요. 정확히 언제 나왔는지는 잘 모르겠네요.', characterId: 'leo', expression: 'blank' },

  /* ===== Round 2. K-01 인지 ===== */
  {
    id: 'leo-r2', type: 'evidence', speaker: '레오 박', text: 'K-01이라는 것도 사건 터지고 나서 처음 들었어요.', characterId: 'leo', expression: 'neutral',
    evidenceIds: ['evidence-k01-nameplate-photo'],
    wrongText: ['영우가 고개를 갸웃한다. "그거 말고, 명찰 쪽 자료를 다시 보세요."', '레오 박: "그게 왜요?" — 아직 결정적이지 않다.'],
    correctGoto: 'leo-r2-break',
  },
  { id: 'leo-r2-break', speaker: '지수', text: '근데 이 명찰 클로즈업, 딱 레오씨가 서 있던 자리에서 찍힌 각도예요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r2-2', speaker: '레오 박', text: '...', characterId: 'leo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'leo-r2-3', speaker: '레오 박', text: '...\n그거, 제가 찍은 거 맞아요. 명찰만요.', characterId: 'leo', expression: 'blank' },

  /* ===== Round 3. 촬영 목적 ===== */
  {
    id: 'leo-r3', type: 'choice', speaker: '지수', text: '왜 명찰을 확대 촬영했어요?', characterId: 'jisoo', expression: 'curious',
    choices: [
      { id: 'personal', label: '개인 관심', goto: 'leo-r3-wrong' },
      { id: 'resale', label: '중고 거래', goto: 'leo-r3-wrong' },
      { id: 'work', label: '업무 의뢰', goto: 'leo-r3-correct' },
    ],
  },
  { id: 'leo-r3-wrong', speaker: '레오 박', text: '...\n아니요, 그런 거 아니에요.', characterId: 'leo', expression: 'blank', goto: 'leo-r3' },
  { id: 'leo-r3-correct', speaker: '레오 박', text: '...\n네. 업무로 받은 요청이었어요.', characterId: 'leo', expression: 'blank' },

  /* ===== Round 4. 물건 접촉 ===== */
  {
    id: 'leo-r4', type: 'evidence', speaker: '레오 박', text: '그래도 물건에는 손대지 않았어요.', characterId: 'leo', expression: 'neutral',
    evidenceIds: ['evidence-case-dust-mark'],
    wrongText: ['레오 박: "제가요? 아닌데요." — 아직 접촉을 증명하지 못했다.', '진열장 자체에서 뭔가 찾을 수 있지 않을까요?'],
    correctGoto: 'leo-r4-break',
  },
  { id: 'leo-r4-break', speaker: '영우', text: '근데 진열장 유리 안쪽에 손자국이 남아 있던데요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'leo-r4-2', speaker: '레오 박', text: '...', characterId: 'leo', pauseBeforeMs: 400, expression: 'blank' },
  {
    id: 'leo-r4-3', type: 'choice', speaker: '지수', text: '이걸 레오씨랑 연결할 수 있는 다른 자료는요?', characterId: 'jisoo', expression: 'suspicious',
    choices: [
      { id: 'mina-photo', label: '윤민아 삭제 사진 속 검은 소매', goto: 'leo-r4-connect' },
      { id: 'cafe-receipt', label: '카페 영수증', goto: 'leo-r4-wrong' },
      { id: 'guestbook', label: '방명록', goto: 'leo-r4-wrong' },
    ],
  },
  { id: 'leo-r4-wrong', speaker: '영우', text: '음, 그건 이거랑 직접 상관은 없는 것 같은데.', characterId: 'youngwoo', expression: 'curious', goto: 'leo-r4-3' },
  { id: 'leo-r4-connect', speaker: '지수', text: '이 검은 소매, 레오씨 옷이랑 똑같은데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r4-connect-2', speaker: '레오 박', text: '...\n...네, 만졌어요. 잠깐 만졌을 뿐이에요.', characterId: 'leo', expression: 'blank' },

  /* ===== Round 5. 진열장 개방 수단 ===== */
  { id: 'leo-r5-1', speaker: '레오 박', text: '근데 그거, 원래 열려 있었어요. 제가 연 게 아니에요.', characterId: 'leo', expression: 'blank' },
  {
    id: 'leo-r5', type: 'evidence', speaker: '', text: '반박할 증거를 골라보세요.', characterId: null,
    evidenceIds: ['evidence-staff-lock-check-time', 'evidence-staff-tag-position-after'],
    wrongText: '레오 박: "그게 무슨 상관인데요?" — 아직 진열장 개방 수단과 연결되지 않았다.',
    correctGoto: 'leo-r5-break',
  },
  { id: 'leo-r5-break', speaker: '영우', text: '직원이 오늘 아침 9시에 이미 잠금 확인을 했대요.\n그 뒤로 다시 잠근 사람은 없어요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'leo-r5-2', speaker: '지수', text: '그리고 직원용 태그도, 그 시간대에 애매하게 옮겨져 있었고요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r5-3', speaker: '레오 박', text: '...\n그건 저도 몰라요. 그냥 열려 있길래.', characterId: 'leo', expression: 'blank' },

  /* ===== Round 6. 단순 이동 주장 ===== */
  {
    id: 'leo-r6', type: 'evidence', speaker: '레오 박', text: '진짜예요. 그냥 사진 찍기 편하게 위치만 살짝 옮겼어요.', characterId: 'leo', expression: 'blank',
    evidenceIds: ['evidence-leo-bag-volume-change'],
    wrongText: '레오 박: "위치만요. 진짜예요." — 아직 "위치만"이라는 말을 반박하지 못했다.',
    correctGoto: 'leo-r6-break',
  },
  { id: 'leo-r6-break', speaker: '지수', text: '근데 그 이후 사진, 가방이 눈에 띄게 두꺼워졌는데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r6-2', speaker: '레오 박', text: '...', characterId: 'leo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'leo-r6-3', speaker: '레오 박', text: '...\n...네. 옮긴 것도 맞아요.\n근데 훔치려던 건 아니었어요. 진짜예요.', characterId: 'leo', expression: 'shocked' },
  {
    id: 'leo-press', type: 'choice', speaker: '', text: '좀 더 물어볼까요?', characterId: null,
    choices: [
      { id: 'why', label: '"그럼 왜 그러셨어요?"', goto: 'leo-r7-1' },
      { id: 'listen', label: '"일단 끝까지 들어보죠."', goto: 'leo-r7-1' },
    ],
  },

  /* ===== Round 7. 의뢰 메시지 공개 ===== */
  { id: 'leo-r7-1', speaker: '레오 박', text: '얼마 전에 익명으로 짧은 의뢰가 하나 왔었어요.', characterId: 'leo', expression: 'serious' },
  { id: 'leo-r7-2', speaker: '레오 박', text: '그냥 물건 하나 확인하고, 사진 찍어서 넘기는 거였어요.', characterId: 'leo', expression: 'serious' },
  { id: 'leo-r7-3', speaker: '영우', text: '어떤 사진을 찍어야 하는지는 어떻게 아셨어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'leo-r7-4', speaker: '레오 박', text: '의뢰 쪽에서 메시지랑 참고 이미지를 같이 보내줬어요.', characterId: 'leo', expression: 'serious' },
  { id: 'leo-r7-5', speaker: '', text: '레오가 의뢰 메시지를 보여준다.', characterId: null },
  { id: 'leo-r7-6', speaker: '', text: '[ 요청 사항 ]\n1. K-01 우측면\n2. 하단 각인\n3. 크기 비교(동전 등)\n4. 배경 포함해서', characterId: null },
  { id: 'leo-r7-7', speaker: '지수', text: '되게 구체적이네요.', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'leo-r7-8', speaker: '레오 박', text: '네, 그래서 저도 좀 이상하다 생각은 했어요.', characterId: 'leo', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-leo-commission-message', code: 'E-C01', title: '레오가 받은 의뢰 메시지',
        description: 'K-01 우측면, 하단 각인, 크기 비교, 배경 포함까지 — 매우 구체적인 촬영 요청 목록.',
        discoveredLocationText: 'Pop-up Exhibition · 레오 박 집중 심문',
      },
    }],
  },

  /* ===== Round 8. 참고사진 비교 (A 재부상 트리거) ===== */
  { id: 'leo-r8-1', speaker: '영우', text: '근데 참고 이미지도 같이 왔다고 하셨죠? 그것도 볼 수 있을까요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'leo-r8-2', speaker: '레오 박', text: '네, 여기요.', characterId: 'leo', expression: 'serious' },
  { id: 'leo-r8-3', speaker: '', text: '레오가 폰에 남아 있던 참고 이미지를 보여준다.', characterId: null },
  {
    id: 'leo-r8-compare', type: 'choice', speaker: '', text: '이 참고 이미지, 어디서 본 것 같은데요.', characterId: null,
    choices: [
      { id: 'same', label: '"이거... 아까 그 사진들이랑 구도가 똑같은데요?"', goto: 'leo-r8-reveal' },
      { id: 'coincidence', label: '"그냥 우연히 비슷한 거겠죠."', goto: 'leo-r8-doubt' },
    ],
  },
  { id: 'leo-r8-doubt', speaker: '영우', text: '...\n아니, 다시 봐도 똑같은데?', characterId: 'youngwoo', expression: 'curious', goto: 'leo-r8-reveal' },
  { id: 'leo-r8-reveal', speaker: '지수', text: '이거, 윤민아씨가 몰래 찍던 사진들이랑 각도가 완전히 똑같아요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'leo-r8-4', speaker: '영우', text: '...\n설마.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'leo-r8-5', speaker: '레오 박', text: '네? 누구요?', characterId: 'leo', expression: 'serious' },
  { id: 'leo-r8-6', speaker: '지수', text: '아니에요, 저희끼리 얘기예요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'leo-r8-7', speaker: '', text: '레오가 보여준 참고 이미지의 구도, 조명, 각도가\n윤민아가 몰래 찍던 사진들과 정확히 일치했다.', characterId: null },
  { id: 'leo-r8-8', speaker: '레오 박', text: '...\n저도 이게 누구 사진인지는 몰라요.\n그냥 파일로 받은 거라서.', characterId: 'leo', expression: 'serious' },
  {
    id: 'leo-r8-9', speaker: '레오 박', text: '중개 계정을 통해서 받았어요. 이거요.', characterId: 'leo', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-leo-reference-image', code: 'E-C02', title: '레오가 받은 참고 이미지',
        description: '레오가 의뢰받을 때 함께 전달받은 참고 이미지. 구도·조명·각도가 윤민아가 몰래 찍던 사진들과 정확히 일치한다.',
        discoveredLocationText: 'Pop-up Exhibition · 레오 박 집중 심문',
      },
    }, {
      type: 'addEvidence',
      evidence: {
        id: 'evidence-k01-inscription-request', code: 'E-C03', title: '각인 확대 촬영 요청',
        description: '참고 이미지 요청에는 K-01 뒷면·하단 각인을 최대한 선명하게 확대해서 찍어달라는 구체적인 조건이 포함되어 있었다.',
        discoveredLocationText: 'Pop-up Exhibition · 레오 박 집중 심문',
      },
    }],
  },
  { id: 'leo-r8-10', speaker: '', text: '[ 중개 계정명: MK_Consult ]', characterId: null },
  {
    id: 'leo-r8-11', speaker: '지수', text: '...\n또 M.K.네요.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'shocked',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mk-consult-account', code: 'E-C04', title: '중개 계정 — MK_Consult',
        description: '레오가 익명 의뢰를 받은 중개 계정명. 애드리언이 봤던 발신 계정 "M.K."와 같은 계열로 보인다.',
        discoveredLocationText: 'Pop-up Exhibition · 레오 박 집중 심문',
      },
    }, {
      type: 'addQuestion',
      question: { id: 'question-mina-reopen', title: '레오가 받은 참고 이미지는 왜 윤민아의 구도와 똑같은가?', linkedEvidenceIds: ['evidence-leo-reference-image'] },
    }],
  },

  /* ===== Round 9. 물건 반출 여부 ===== */
  { id: 'leo-r9-1', speaker: '지수', text: '그럼 지금 그 물건은요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r9-2', speaker: '레오 박', text: '사진만 찍고 다시 넣어두려고 했어요. 진짜예요.', characterId: 'leo', expression: 'shocked' },
  {
    id: 'leo-r9', type: 'evidence', speaker: '', text: '반박할 증거를 골라보세요.', characterId: null,
    evidenceIds: ['evidence-cafe-cctv-bag-thicker'],
    wrongText: '레오 박: "진짜 다시 넣으려고 했어요." — 아직 반출 자체를 증명하지 못했다.',
    correctGoto: 'leo-r9-break',
  },
  { id: 'leo-r9-break', speaker: '영우', text: '근데 카페 CCTV엔, 전시장에서 나올 때보다 카페 자리에 앉을 때 가방이 더 두꺼워요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'leo-r9-2b', speaker: '레오 박', text: '...', characterId: 'leo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'leo-r9-3', speaker: '레오 박', text: '...\n네, 들고 나온 거 맞아요.', characterId: 'leo', expression: 'shocked' },
  { id: 'leo-r9-4', speaker: '레오 박', text: '근데 그 인파 때문에 다시 넣을 타이밍을 놓쳤고,\n그대로 도난 소동이 나버린 거예요.', characterId: 'leo', expression: 'shocked' },
  { id: 'leo-r9-5', speaker: '지수', text: '지금 그 물건은요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'leo-r9-6', speaker: '레오 박', text: '의뢰인 쪽에 이미 넘겼어요.\n사진만 찍어서 보내는 조건이었는데, 당황해서 그냥 통째로 보내버렸어요.', characterId: 'leo', expression: 'shocked' },
  { id: 'leo-r9-7', speaker: '레오 박', text: '죄송해요.\n제가 이렇게 일이 커질 줄은 몰랐어요.', characterId: 'leo', expression: 'shocked' },

  {
    id: 'leo-end-1', speaker: '영우', text: '전시장 쪽에는 저희가 사정 설명 도와드릴게요.', characterId: 'youngwoo', expression: 'soft',
    effects: [
      {
        type: 'setPersonStatus', id: 'leo', status: 'involved',
        patch: {
          knownFacts: ['K-01을 직접 만지고 진열장 밖으로 이동시킴', '10:47~10:58 사이 K-01을 촬영해 의뢰인에게 전달하려 함', '가방에 넣어 실제로 반출함(카페 CCTV로 확인)', '중개 계정명 MK_Consult 확인', '전달받은 참고 이미지가 윤민아의 촬영 구도와 정확히 일치'],
          lies: ['"전시장을 나오자마자 카페에 갔다" (1차)', '"K-01은 사건 뒤 처음 들었다" (2차)', '"물건에는 손대지 않았다" (3차)', '"진열장은 원래 열려 있었다" (4차)', '"위치만 옮겼다" (5차)'],
          unknowns: ['MK_Consult 운영자의 실제 정체'],
        },
      },
      { type: 'setQuestionStatus', id: 'question-leo-gap', status: 'resolved', resolutionText: '레오 박은 K-01을 직접 옮기고 사진을 찍어 익명 의뢰인(MK_Consult)에게 전달하려 했으며, 실제로 물건을 반출했다고 인정했다.' },
    ],
  },
  { id: 'leo-end-2', speaker: '지수', text: '대신 그 계정명은 저희가 좀 적어갈게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'leo-end-3', speaker: '지수', text: '...\n윤민아씨, 다시 만나봐야겠어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'leo-end-4', speaker: '영우', text: '그냥 몰래 찍은 게 아니었나 보네.', characterId: 'youngwoo', expression: 'blank' },
];

/* OPERATION MK — WEEK 1 · SCENE 10 「중간 추리 및 윤민아 재오픈」
   Dialogue Set: dialogue-week1-scene010
   Scene: week1-scene-010 (Pop-up Exhibition 앞, 12:20)

   ===== 1주차 장편 확장 v2 · §14 =====
   4개 질문을 choice 체인으로 재구성(오답은 짧은 반응 후 같은 질문으로).
   질문4의 정답은 "아직 판단 불가" — 확정하지 않는다. scene005에서 고른
   첫 가설(w1-first-hypothesis)이 있으면 짧은 콜백 한 줄을 덧붙인다. */
const week1Scene010Lines = [
  { id: 'line-001', speaker: '', text: '전시장 앞.\n낮 12시 20분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '지금까지 나온 거, 한번 임시로 정리해볼까요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'q1', type: 'choice', speaker: '', text: 'Q1. K-01을 직접 꺼낸 사람은?', characterId: null,
    choices: [
      { id: 'leo', label: '레오 박', goto: 'q1-correct' },
      { id: 'minah', label: '윤민아', goto: 'q1-wrong' },
      { id: 'adrian', label: '애드리언 콜', goto: 'q1-wrong' },
    ],
  },
  { id: 'q1-wrong', speaker: '영우', text: '아니, 그 11분 공백 있던 사람이 누구였지?', characterId: 'youngwoo', expression: 'curious', goto: 'q1' },
  { id: 'q1-correct', speaker: '영우', text: '레오. 본인이 직접 인정했으니까.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'q2', type: 'choice', speaker: '', text: 'Q2. 레오가 K-01을 정확히 특정할 수 있었던 이유는?', characterId: null,
    choices: [
      { id: 'ref', label: '참고 이미지', goto: 'q2-correct' },
      { id: 'guess', label: '직접 눈으로 보고 우연히', goto: 'q2-wrong' },
      { id: 'ask', label: '직원에게 물어봐서', goto: 'q2-wrong' },
    ],
  },
  { id: 'q2-wrong', speaker: '지수', text: '아니에요. 그 정도로 자세히 아는 건 뭔가 받은 게 있어서예요.', characterId: 'jisoo', expression: 'suspicious', goto: 'q2' },
  { id: 'q2-correct', speaker: '지수', text: '맞아요. 의뢰 쪽에서 참고 이미지를 받았댔죠.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'q3', type: 'choice', speaker: '', text: 'Q3. 그 참고 이미지의 원본은?', characterId: null,
    choices: [
      { id: 'minah', label: '윤민아 사진', goto: 'q3-correct' },
      { id: 'adrian', label: '애드리언이 갖고 있던 자료', goto: 'q3-wrong' },
      { id: 'staff', label: '전시장 공식 자료', goto: 'q3-wrong' },
    ],
  },
  { id: 'q3-wrong', speaker: '영우', text: '아니, 그 구도랑 각도, 완전히 겹치는 사진 있었잖아.', characterId: 'youngwoo', expression: 'curious', goto: 'q3' },
  { id: 'q3-correct', speaker: '영우', text: '맞아, 윤민아씨 사진이랑 완전히 똑같았어.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'q4', type: 'choice', speaker: '', text: 'Q4. 그렇다면 윤민아는 공범인가?', characterId: null,
    choices: [
      { id: 'yes', label: '맞다, 공범이다', goto: 'q4-wrong' },
      { id: 'no', label: '아니다, 전혀 무관하다', goto: 'q4-wrong' },
      { id: 'unsure', label: '아직 판단 불가', goto: 'q4-correct' },
    ],
  },
  { id: 'q4-wrong', speaker: '지수', text: '...\n아니요, 아직 그렇게 단정하긴 일러요.', characterId: 'jisoo', expression: 'blank', goto: 'q4' },
  { id: 'q4-correct', speaker: '지수', text: '...\n아직은 판단할 수 없어요. 사진이 어디서, 어떻게 넘어갔는지부터 확인해야죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '영우', text: '그때 윤민아씨, 사진을 어디로 보냈는지는 안 물어봤었지.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '웅.\n그때는 그냥 몰래 찍은 것만 확인하고 넘어갔으니까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '다시 만나서 물어봐야겠다.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-006', speaker: '지수', text: '네.\n이번엔 좀 다르게 물어봐야 할 것 같아요.', characterId: 'jisoo', expression: 'serious',
    effects: [
      { type: 'setPersonStatus', id: 'minah', status: 'reopened' },
      { type: 'setQuestionStatus', id: 'question-mina-reopen', status: 'partial', resolutionText: '레오가 받은 참고 이미지가 윤민아의 촬영 구도와 정확히 일치한다는 사실이 확인되어, 윤민아를 다시 조사해야 한다.' },
    ],
  },
  { id: 'line-007', speaker: '', text: '[ 윤민아 — 재조사 필요 ]', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 11 「윤민아 최종 심문」
   Dialogue Set: dialogue-week1-scene011
   Scene: week1-scene-011 (Circular Quay 편집숍 앞, 18:00)

   ===== 1주차 장편 확장 v2 · §15 =====
   8라운드로 확장: 사진보관→공유대상→이미지비교1~3→업로드시각→링크접근기록→
   최종진술. 마지막 진술은 문서 지시대로 "완전히 반박되지 않는다" — 강제
   자백으로 끝내지 않고 불확실성을 남긴다. scene006에서 사진 복구를
   건너뛰었다면(mina-photo-recovery-skipped) 여기서 자동으로 다시 요청한다. */
const week1Scene011Lines = [
  { id: 'line-001', speaker: '', text: 'Circular Quay 편집숍 앞.\n오후 6시.', characterId: null },
  { id: 'line-002', speaker: '', text: '퇴근하려던 윤민아를 다시 붙잡았다.', characterId: null },
  { id: 'line-003', speaker: '윤민아', text: '또 무슨 일이세요?', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-004', speaker: '지수', text: '몇 가지만 더 여쭤볼게요.', characterId: 'jisoo', expression: 'neutral' },

  {
    id: 'recovery-check', type: 'choice', speaker: '', text: '', characterId: null,
    choices: [
      { id: 'redo', label: '(계속)', condition: { flags: ['mina-photo-recovery-skipped'] }, goto: 'recovery-redo' },
      { id: 'skip-ok', label: '(계속)', condition: { flags: ['mina-photo-recovery-done'] }, goto: 'mina-f1' },
    ],
  },
  {
    id: 'recovery-redo', speaker: '지수', text: '아, 그리고 — 아까 지운 사진들, 이번엔 복구 좀 부탁드릴게요.', characterId: 'jisoo', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-recovered-photo-fragment', code: 'E-M02', title: '복구된 삭제 사진 일부',
        description: '완전히 복구되진 않았지만, K-01 뒷면 각인 부분을 확대 촬영한 흔적이 남아 있다.',
        discoveredLocationText: 'Circular Quay 편집숍 · 윤민아 최종 심문',
      },
    }],
  },
  { id: 'recovery-redo-2', speaker: '윤민아', text: '...\n하아. 네, 알겠어요.', characterId: 'minah', expression: 'annoyed', goto: 'mina-f1' },

  /* ===== Round 1. 사진 보관 ===== */
  { id: 'mina-f1', speaker: '지수', text: '아까 그 사진들, 지금 어디 있어요?', characterId: 'jisoo', expression: 'curious' },
  {
    id: 'mina-f1-evidence', type: 'evidence', speaker: '윤민아', text: '사진은 폰에만 있었어요. 다른 데는 없어요.', characterId: 'minah', expression: 'neutral',
    evidenceIds: ['evidence-mina-recovered-photo-fragment'],
    wrongText: ['윤민아: "그게 왜요?" — 폰 안에만 있었다는 말을 아직 반박하지 못했다.', '폰 밖의 다른 저장소를 생각해보세요.'],
    correctGoto: 'mina-f1-mid',
  },
  {
    id: 'mina-f1-mid', speaker: '영우', text: '음, 근데 이거 복구해보니까 클라우드 썸네일 캐시가 남아 있던데요.', characterId: 'youngwoo', expression: 'suspicious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-cloud-thumbnail', code: 'E-A02', title: '클라우드 썸네일 기록',
        description: '윤민아의 사진 앱 클라우드 썸네일 캐시. "폰에만 있었다"는 말과 달리 클라우드에도 자동 업로드된 흔적이 있다.',
        discoveredLocationText: 'Circular Quay 편집숍 · 윤민아 최종 심문',
      },
    }],
  },
  { id: 'mina-f1-break', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'mina-f1-2', speaker: '윤민아', text: '...\n아, 자동 백업이 켜져 있었나 봐요. 저도 몰랐어요.', characterId: 'minah', expression: 'shocked' },

  /* ===== Round 2. 공유 대상 ===== */
  { id: 'mina-f2-1', speaker: '지수', text: '그럼 그 사진, 누구한테 공유하셨어요?', characterId: 'jisoo', expression: 'curious' },
  {
    id: 'mina-f2-evidence', type: 'evidence', speaker: '윤민아', text: '팀원들한테만요. 무드보드 작업하는 사람들끼리.', characterId: 'minah', expression: 'neutral',
    evidenceIds: ['evidence-mina-cloud-thumbnail'],
    wrongText: '윤민아: "그건 이미 말씀드렸잖아요." — 다른 자료가 필요하다.',
    correctGoto: 'mina-f2-mid',
  },
  {
    id: 'mina-f2-mid', speaker: '영우', text: '근데 이 폴더, 공개 링크로 설정돼 있던데요.', characterId: 'youngwoo', expression: 'suspicious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-public-link', code: 'E-A03', title: '공개 링크 설정',
        description: '윤민아의 사진 폴더가 "팀원만"이 아니라 링크를 아는 누구나 볼 수 있는 공개 설정으로 되어 있었다.',
        discoveredLocationText: 'Circular Quay 편집숍 · 윤민아 최종 심문',
      },
    }],
  },
  { id: 'mina-f2-break', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'mina-f2-2', speaker: '윤민아', text: '...\n그거는... 설정을 실수로 잘못 해놨을 수도 있어요.', characterId: 'minah', expression: 'shocked' },

  /* ===== Round 3~5. 이미지 비교 (레오가 받은 참고 이미지 vs 윤민아 사진) ===== */
  { id: 'mina-f3-1', speaker: '영우', text: '레오씨라는 분이 받은 참고 이미지예요.\n윤민아씨 사진이랑 좀 비교해볼까요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'mina-f3-2', speaker: '윤민아', text: '비슷한 사진일 뿐이에요.\n세상에 이런 구도로 찍는 사람이 저 하나겠어요?', characterId: 'minah', expression: 'annoyed' },
  { id: 'mina-f3-3', speaker: '지수', text: '그럼 하나씩 맞춰볼게요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'compare-1', type: 'choice', speaker: '', text: '두 사진 속, 진열장 유리에 앉은 먼지 자국을 비교해보면?', characterId: null,
    choices: [
      { id: 'same', label: '같은 자리에 똑같이 앉아 있다.', goto: 'compare-1-correct' },
      { id: 'diff', label: '먼지 위치가 조금씩 다르다.', goto: 'compare-1-wrong' },
    ],
  },
  { id: 'compare-1-wrong', speaker: '영우', text: '...\n아니, 다시 보니 똑같은데?', characterId: 'youngwoo', expression: 'curious', goto: 'compare-1' },
  { id: 'compare-1-correct', speaker: '지수', text: '먼지 자국까지 똑같아요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'compare-2', type: 'choice', speaker: '', text: 'K-01이 찍힌 각도는 어때 보여요?', characterId: null,
    choices: [
      { id: 'same', label: '두 사진 모두 정확히 같은 각도에서 찍혔다.', goto: 'compare-2-correct' },
      { id: 'diff', label: '미묘하게 다른 각도인 것 같다.', goto: 'compare-2-wrong' },
    ],
  },
  { id: 'compare-2-wrong', speaker: '지수', text: '음, 각도까지 다시 재볼게요.', characterId: 'jisoo', expression: 'suspicious', goto: 'compare-2' },
  { id: 'compare-2-correct', speaker: '영우', text: '각도도 똑같아요.\n삼각대라도 쓴 것처럼.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'compare-3', type: 'choice', speaker: '', text: '배경에 흐릿하게 찍힌 관광객들의 손동작은요?', characterId: null,
    choices: [
      { id: 'same', label: '배경 관광객 손동작까지 똑같다.', goto: 'compare-3-correct' },
      { id: 'coincidence', label: '그 정도는 우연일 수 있다.', goto: 'compare-3-wrong' },
    ],
  },
  { id: 'compare-3-wrong', speaker: '영우', text: '...\n근데 손 모양까지 이렇게 겹치는 게 우연이겠어?', characterId: 'youngwoo', expression: 'suspicious', goto: 'compare-3' },
  {
    id: 'compare-3-correct', speaker: '지수', text: '먼지, 각도, 배경 관광객 손동작까지 세 개나 겹쳐요.\n이건 같은 사진이에요.', characterId: 'jisoo', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-image-match', code: 'E-A01', title: '사진 동일 구도 대조 결과',
        description: '윤민아의 사진과 레오가 받은 참고 이미지는 먼지 자국, 촬영 각도, 배경 관광객 손동작까지 세 가지가 정확히 일치한다.',
        discoveredLocationText: 'Circular Quay 편집숍 · 윤민아 최종 심문',
      },
    }],
  },
  { id: 'mina-f3-break', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'mina-f3-4', speaker: '윤민아', text: '...\n...알겠어요. 보낸 건 맞아요.', characterId: 'minah', expression: 'shocked' },

  /* ===== Round 6. 업로드 시각 ===== */
  { id: 'mina-f6-1', speaker: '지수', text: '언제 업로드하신 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'mina-f6-2', speaker: '윤민아', text: '사건 다 끝나고 나서요. 그때 정신없어서 나중에 정리하면서 올렸어요.', characterId: 'minah', expression: 'neutral' },
  {
    id: 'mina-f6-evidence', type: 'evidence', speaker: '', text: '반박할 증거를 골라보세요.', characterId: null,
    evidenceIds: ['evidence-mina-cloud-thumbnail'],
    wrongText: '윤민아: "그게 왜요?" — 업로드 시각 자체를 아직 짚지 못했다.',
    correctGoto: 'mina-f6-break',
  },
  { id: 'mina-f6-break', speaker: '영우', text: '근데 이 썸네일 캐시, 업로드 시각이 10시 43분으로 찍혀 있는데요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'mina-f6-2b', speaker: '지수', text: '그건 K-01이 없어지기도 전이에요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'mina-f6-3', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'mina-f6-4', speaker: '윤민아', text: '...\n...그건, 저도 설명이 잘 안 되네요.', characterId: 'minah', expression: 'shocked' },

  /* ===== Round 7. 링크 접근 기록 ===== */
  { id: 'mina-f7-1', speaker: '영우', text: '그 공개 링크, 접근 기록 같은 건 안 남아요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'mina-f7-2', speaker: '윤민아', text: '...\n확인은 해볼 수 있는데.', characterId: 'minah', expression: 'shocked' },
  {
    id: 'mina-f7-3', speaker: '', text: '[ 접근 기록 — 짧은 시간에 외부 계정 단 1회 접근 ]\n[ 접근 계정: 익명 relay ]', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-link-access-log', code: 'E-A04', title: '공개 링크 접근 기록',
        description: '윤민아의 공개 링크는 업로드 직후 짧은 시간 안에 외부 계정이 단 한 번 접근했다. 접근 계정은 신원을 감춘 익명 relay다.',
        discoveredLocationText: 'Circular Quay 편집숍 · 윤민아 최종 심문',
      },
    }],
  },
  { id: 'mina-f7-4', speaker: '지수', text: '이 익명 계정, M.K.랑 관련 있을까요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'mina-f7-5', speaker: '영우', text: '계정명 자체는 안 남아 있어서 확실친 않아.', characterId: 'youngwoo', expression: 'blank' },

  /* ===== Round 8. 최종 진술 ===== */
  { id: 'mina-f8-1', speaker: '지수', text: '그래서, 정확히 누구한테 보낸 거예요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'mina-f8-2', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'mina-f8-3', speaker: '윤민아', text: '...\n직접 누구한테 보낸 적은 없어요. 진짜예요.', characterId: 'minah', expression: 'shocked' },
  { id: 'mina-f8-4', speaker: '윤민아', text: '그냥 팀 공유용 무드보드 페이지에 임시로 넣어놨을 뿐이에요.', characterId: 'minah', expression: 'shocked' },
  { id: 'mina-f8-5', speaker: '윤민아', text: '거기 링크가 공개로 걸려 있었는지도 몰랐고요.', characterId: 'minah', expression: 'shocked' },
  { id: 'mina-f8-6', speaker: '영우', text: '...\n그 말은, 누군가 몰래 그 링크를 찾아서 가져갔다는 거네요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'mina-f8-7', speaker: '윤민아', text: '...\n제가 아는 건 이게 다예요.', characterId: 'minah', expression: 'shocked' },
  {
    id: 'mina-f8-8', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank',
    effects: [
      {
        type: 'setPersonStatus', id: 'minah', status: 'involved',
        patch: {
          knownFacts: ['K-01 근처에서 세 차례 반복 목격됨', '촬영 금지 규정을 어기고 K-01의 세부 각인을 확대 촬영함', '사진이 클라우드에 자동 업로드되고 공개 링크로 노출됨', '업로드 시각(10:43)이 K-01 도난 시점보다 이르다', '공개 링크에 익명 계정이 단 1회 접근한 기록이 있음'],
          lies: ['"사진은 폰에만 있었다" (1차)', '"팀원들에게만 공유했다" (2차)', '"참고 이미지가 자기 사진과 다르다" (3차)', '"사건 뒤에 업로드했다" (4차)'],
          unknowns: ['의뢰인의 실제 정체', '본인이 도난 계획에 이용될 줄 알았는지 여부(본인은 몰랐다고 주장, 완전히 반박되진 않음)'],
        },
      },
      { type: 'setQuestionStatus', id: 'question-mina-reopen', status: 'resolved', resolutionText: '윤민아의 사진이 클라우드 공개 링크를 통해 익명 계정에 유출된 것으로 확인됐다. 다만 그녀가 직접 전달했다는 증거는 없다.' },
      {
        type: 'addQuestion',
        question: { id: 'question-mk-identity', title: 'M.K.는 누구인가?', linkedEvidenceIds: ['evidence-adrian-sender', 'evidence-mk-consult-account', 'evidence-mina-link-access-log'] },
      },
    ],
  },
  { id: 'mina-f8-9', speaker: '지수', text: '알겠습니다. 오늘은 여기까지 할게요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'mina-f8-10', speaker: '윤민아', text: '...\n네.', characterId: 'minah', expression: 'shocked' },
  { id: 'mina-f8-11', speaker: '', text: '[ 현재 판단: 윤민아 — 사진 유출 확인 · 직접 절도는 부정 · 공모 여부 미확인 ]', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 12 「사건 재구성」
   Dialogue Set: dialogue-week1-scene012
   Scene: week1-scene-012 (전시장 근처 카페, 19:00)

   ===== 1주차 장편 확장 v2 · §16 =====
   빈칸 3개 → 6개로 확장(정보 유출 경로/참고사진 출처/실제 이동자/개방 수단/
   행동 목적/미해결 연결점) + 추가 반증 질문("왜 레오를 진범으로 확정할 수
   없는가?", 정답 2). 결론은 "레오=단순 범인"이 아니라 역할 분리 구조를
   그대로 유지한다. */
const week1Scene012Lines = [
  { id: 'line-001', speaker: '', text: '전시장 근처 카페.\n오후 7시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '정리해볼까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '영우', text: '정리가 될까 이게.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-004', speaker: '지수', text: '일단 해봐요.', characterId: 'jisoo', expression: 'smirk' },

  {
    id: 'blank-1', type: 'choice', speaker: '', text: '[정보가 외부로 나간 경로]는?', characterId: null,
    choices: [
      { id: 'adrian-reply', label: '애드리언의 답장', goto: 'blank-1-correct' },
      { id: 'staff-leak', label: '전시장 직원의 실수', goto: 'blank-1-wrong' },
      { id: 'public-notice', label: '공식 홍보 자료', goto: 'blank-1-wrong' },
    ],
  },
  { id: 'blank-1-wrong', speaker: '영우', text: '음... 처음 문의에 답장한 사람이 누구였지?', characterId: 'youngwoo', expression: 'curious', goto: 'blank-1' },
  { id: 'blank-1-correct', speaker: '지수', text: '맞아요. 애드리언이 판매 불가라면서도 전시 일정을 답장에 적었어요.', characterId: 'jisoo', expression: 'serious' },

  {
    id: 'blank-2', type: 'choice', speaker: '', text: '[참고사진의 출처]는?', characterId: null,
    choices: [
      { id: 'minah-link', label: '윤민아의 공개 링크', goto: 'blank-2-correct' },
      { id: 'adrian-file', label: '애드리언이 보관하던 파일', goto: 'blank-2-wrong' },
      { id: 'staff-photo', label: '전시장 공식 사진', goto: 'blank-2-wrong' },
    ],
  },
  { id: 'blank-2-wrong', speaker: '지수', text: '아니에요. 구도, 먼지 자국, 손동작까지 겹치는 사진 있었잖아요.', characterId: 'jisoo', expression: 'suspicious', goto: 'blank-2' },
  { id: 'blank-2-correct', speaker: '영우', text: '맞아. 윤민아씨 클라우드 공개 링크였어.', characterId: 'youngwoo', expression: 'serious' },

  {
    id: 'blank-3', type: 'choice', speaker: '', text: '[실제 이동자]는?', characterId: null,
    choices: [
      { id: 'leo', label: '레오 박', goto: 'blank-3-correct' },
      { id: 'minah', label: '윤민아', goto: 'blank-3-wrong' },
      { id: 'adrian', label: '애드리언 콜', goto: 'blank-3-wrong' },
    ],
  },
  { id: 'blank-3-wrong', speaker: '지수', text: '아니에요. 그 11분의 공백, 누구 거였죠?', characterId: 'jisoo', expression: 'suspicious', goto: 'blank-3' },
  { id: 'blank-3-correct', speaker: '영우', text: '맞아, 레오씨가 직접 만지고 카페까지 들고 나왔어.', characterId: 'youngwoo', expression: 'serious' },

  {
    id: 'blank-4', type: 'choice', speaker: '', text: '[진열장 개방 수단]은?', characterId: null,
    choices: [
      { id: 'staff-tag', label: '직원용 태그(관리 공백을 틈타)', goto: 'blank-4-correct' },
      { id: 'broken-lock', label: '자물쇠가 부서짐', goto: 'blank-4-wrong' },
      { id: 'spare-key', label: '여분 열쇠 사용', goto: 'blank-4-wrong' },
    ],
  },
  { id: 'blank-4-wrong', speaker: '영우', text: '아니, 그런 흔적은 없었어. 잠금 확인이 몇 시였는지 다시 생각해봐.', characterId: 'youngwoo', expression: 'curious', goto: 'blank-4' },
  { id: 'blank-4-correct', speaker: '지수', text: '맞아요. 아침 9시 확인 이후로 아무도 다시 잠그지 않았어요.', characterId: 'jisoo', expression: 'serious' },

  {
    id: 'blank-5', type: 'choice', speaker: '', text: '[행동 목적]은?', characterId: null,
    choices: [
      { id: 'commission', label: '의뢰 수행 (사진 확보 목적)', goto: 'blank-5-correct' },
      { id: 'resale', label: '되팔기 위한 절도', goto: 'blank-5-wrong' },
      { id: 'grudge', label: '전시장에 대한 개인적 앙심', goto: 'blank-5-wrong' },
    ],
  },
  { id: 'blank-5-wrong', speaker: '지수', text: '아니에요. 팸플릿에도 판매 불가라고 적혀 있었잖아요.', characterId: 'jisoo', expression: 'suspicious', goto: 'blank-5' },
  { id: 'blank-5-correct', speaker: '영우', text: '맞아. 레오도, 윤민아씨도 결국 "의뢰받은 일"이었다고 했어.', characterId: 'youngwoo', expression: 'serious' },

  {
    id: 'blank-6', type: 'choice', speaker: '', text: '[미해결 연결점]은?', characterId: null,
    choices: [
      { id: 'mk', label: 'M.K. 계열 계정', goto: 'blank-6-correct' },
      { id: 'adrian-account', label: '애드리언의 갤러리 계정', goto: 'blank-6-wrong' },
      { id: 'official', label: '전시장 공식 계정', goto: 'blank-6-wrong' },
    ],
  },
  { id: 'blank-6-wrong', speaker: '영우', text: '아니, 그건 이 사건이랑 직접 상관없는 계정이야.', characterId: 'youngwoo', expression: 'blank', goto: 'blank-6' },
  {
    id: 'blank-6-correct', speaker: '지수', text: '맞아요.\nM.K. — 애드리언한테 온 문의, 레오한테 온 MK_Consult, 윤민아 링크에 접근한 익명 relay까지.', characterId: 'jisoo', expression: 'serious',
    effects: [{
      type: 'addQuestion',
      question: { id: 'question-case-solution', title: 'K-01은 어떻게 사라졌는가?', linkedEvidenceIds: ['evidence-leo-reference-image', 'evidence-mk-consult-account', 'evidence-mina-link-access-log'] },
    }, {
      type: 'setQuestionStatus', id: 'question-case-solution', status: 'resolved',
      resolutionText: '애드리언의 답장으로 정보가 새어나갔고, 윤민아의 공개 링크로 참고사진이 유출됐으며, 레오가 물건을 직접 이동시켰다. 세 사람을 연결한 것은 M.K. 계열의 익명 계정이다.',
    }],
  },

  { id: 'rebuttal-intro', speaker: '영우', text: '근데 그럼, 레오가 그냥 진범 아니야?' , characterId: 'youngwoo', expression: 'curious' },
  {
    id: 'rebuttal', type: 'choice', speaker: '', text: '왜 레오를 사건의 진범으로 확정할 수 없을까요?', characterId: null,
    choices: [
      { id: 'no-touch', label: '레오는 물건에 손대지 않았다', goto: 'rebuttal-wrong' },
      { id: 'no-design', label: '레오는 사건 설계에 필요한 정보를 스스로 만들지 않았다', goto: 'rebuttal-correct' },
      { id: 'not-there', label: '레오는 전시장에 없었다', goto: 'rebuttal-wrong' },
    ],
  },
  { id: 'rebuttal-wrong', speaker: '지수', text: '아니에요. 그건 이미 사실이 아니라고 확인됐잖아요.', characterId: 'jisoo', expression: 'suspicious', goto: 'rebuttal' },
  { id: 'rebuttal-correct', speaker: '지수', text: '맞아요.\n레오는 손을 댄 사람이지, 이 계획을 짠 사람은 아니에요.', characterId: 'jisoo', expression: 'serious' },

  { id: 'line-005', speaker: '', text: '[ 사건 재구성 완료 ]\n정보 유출 — 애드리언의 답장\n참고사진 출처 — 윤민아의 공개 링크\n실제 이동자 — 레오 박\n개방 수단 — 직원용 태그\n행동 목적 — 의뢰 수행\n미해결 연결점 — M.K. 계열 계정', characterId: null },
  { id: 'line-006', speaker: '영우', text: '근데 이걸로 끝은 아니지?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '...\n네.\n레오는 손을 댄 사람, 애드리언과 윤민아는 정보가 샌 경로.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '근데 이 셋을 하나로 묶은 사람은 아직 안 잡혔어요.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 1 · SCENE 13 「엔딩 및 장기 미스터리 등록」
   Dialogue Set: dialogue-week1-scene013
   Scene: week1-scene-013 (Sydney Accommodation, 21:40)
   Closes out Week 1's main weekend arc — 1주차 평일 미니씬(W1-D1~D5)은 별도로
   추가될 예정. No nextSceneId; ends on narration like week0-scene-001.

   ===== 1주차 장편 확장 v2 · §17 =====
   1.전시장 정리 → 2.탐정님/조수 대화 → 3.수사노트 정리 → 4.M.K. 연결점
   등록 → 5.후속 복선(공개 링크 접근 로그 재확인 — 애드리언 답장 후 4분,
   M.K. relay 계정). 동일 인물임은 확정하지 않는다. 실명·퍼센트 의심도는
   여전히 등장하지 않는다(§1.5/§13.3 원칙 유지). */
const week1Scene013Lines = [
  { id: 'line-001', speaker: '', text: '전시장.\n오후 8시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '직원분, 저희가 파악한 건 이 정도예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '전시장 직원', text: '레오라는 분이... 정말요?', characterId: null },
  { id: 'line-004', speaker: '영우', text: '본인이 직접 인정했어요. 되돌려받는 건 저희 쪽에서 연락드릴게요.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '전시장 직원', text: '감사합니다, 정말로.', characterId: null },
  { id: 'line-006', speaker: '', text: '전시장 사건을 정리하고 나오니 어느새 밤이었다.', characterId: null },

  { id: 'line-007', speaker: '', text: '숙소.\n밤 9시 40분.', characterId: null },
  { id: 'line-008', speaker: '영우', text: '오늘 진짜 아무 일도 없을 거랬는데.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-009', speaker: '지수', text: '그러니까요.\n누가 그런 말을 해요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '근데 지수 아까 진짜 대박이었어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '뭐가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '레오씨 알리바이 구멍 찾아낸 거.\n나였으면 그냥 넘어갔을 듯.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-013', speaker: '지수', text: '음... 그건 그냥 딱 봐도 이상했어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '와, 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-015', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-016', speaker: '지수', text: '그거 다시 불러봐요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-017', speaker: '영우', text: '탐정님?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '지수', text: 'ㅎㅎㅎ\n좋다, 그거.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-019', speaker: '영우', text: '그럼 나는 뭔데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-020', speaker: '지수', text: '조수죠.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021', speaker: '영우', text: '내가 나이가 몇인데 조수야.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-022', speaker: '지수', text: '나이 많은 조수도 있어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-023', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그런 게 어딨어', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-024', speaker: '지수', text: '여기요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-025', speaker: '영우', text: '아이고, 알겠습니다 탐정님.\n잘 모시겠습니다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-026', speaker: '지수', text: '진작 그럴 것이지.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-027', speaker: '', text: '장난스러운 말투였지만,\n둘 다 알고 있었다.', characterId: null },
  { id: 'line-028', speaker: '', text: '오늘부로 뭔가 조금 달라졌다는 걸.', characterId: null },

  { id: 'line-029', speaker: '지수', text: '자, 수사노트나 정리해볼까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-030', speaker: '', text: '[ 수사노트 정리 ]\n해결됨 — K-01은 레오 박이 직접 이동시켰다.\n잠정 결론 — 애드리언과 윤민아의 경로로 정보가 새어나갔다.\n미해결 — 이 셋을 하나로 묶은 배후.', characterId: null },
  { id: 'line-031', speaker: '영우', text: '근데 지수야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-032', speaker: '지수', text: '왜요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-033', speaker: '영우', text: '정리는 다 됐는데, 그 M.K.는 결국 뭐야?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034', speaker: '지수', text: '그러니까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-035', speaker: '지수', text: '확실한 건 딱 하나예요.', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'line-036', speaker: '지수', text: '이 계정, 이번이 처음이 아니에요.', characterId: 'jisoo', expression: 'suspicious',
    effects: [
      {
        type: 'addPerson',
        person: {
          id: 'mk', name: 'M.K.', role: '미해결 연결점', status: 'unknown',
          summary: '정체 불명의 계정. K-01 문의와 사진 의뢰 모두에 이 이름이 등장했다.',
          knownFacts: ['K-01 관련 외부 문의 발신자 (애드리언에게)', 'MK_Consult 명의로 레오에게 익명 의뢰', '윤민아의 공개 링크에 익명 relay 계정으로 접근'],
          unknowns: ['정체 불명', '목적 불명', '사람인지 조직인지 불명'],
        },
      },
      { type: 'setQuestionStatus', id: 'question-mk-identity', status: 'unresolved', resolutionText: 'K-01 문의, 레오에게의 의뢰, 윤민아 링크 접근 모두 M.K. 계열의 이름이 등장했지만, 정체는 전혀 밝혀지지 않았다.' },
    ],
  },
  { id: 'line-037', speaker: '', text: '[ 미해결 연결점 ]\nM.K.\n— 정체 불명\n— K-01 문의와 연관\n— 사진 전달·의뢰 계정과 연관\n— 목적 불명', characterId: null },

  { id: 'line-038', speaker: '영우', text: '아, 맞다. 그 공개 링크 접근 로그, 정확히 언제였다고 했지?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-039', speaker: '지수', text: '잠깐만요, 다시 확인해볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-040', speaker: '', text: '[ 접근 시각: 애드리언의 답장 발송 후 4분 ]\n[ 접근 계정: M.K. relay ]', characterId: null },
  { id: 'line-041', speaker: '영우', text: '...\n4분이면, 거의 실시간으로 지켜보고 있었다는 거잖아.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-042', speaker: '지수', text: '그러네요.\n근데 이게 같은 사람인지, 아니면 그냥 같은 계열 계정인지는 아직 모르겠어요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-043', speaker: '영우', text: '이거 진짜... 그냥 넘어가도 되는 걸까.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-044', speaker: '지수', text: '아니요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-045', speaker: '지수', text: '일단 오늘은 여기까지.\n내일부터 또 알아보죠, 조수님.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-046', speaker: '영우', text: '넵, 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-047', speaker: '', text: '지수의 1주차는,\n하나의 이름과 함께 저물었다.', characterId: null },
  { id: 'line-048', speaker: '', text: '아직, 그 이름의 실체는 아무도 몰랐다.', characterId: null },
];

// week1-scene-003-minigame's (전시장 증거 수집) hotspot registry — same role
// as roomSearchAreas plays for minigame-phone-search, just a single "area"
// (one exhibition floor, one photo) instead of four. Lets /dev/upload's
// "정답 영역 지정" room-hotspot editor (scene.roomHotspots) offer these 10 named
// spots for a dev to mark on a real uploaded exhibition photo — see
// week1-scene-003's own `minigameId`/`roomHotspots` fields below, which wire
// this in exactly the way scene.minigameId + scene.roomHotspots are read by
// upload/index.html's renderHotspotSection/backgroundKinds. Only IDs +
// display labels live here; per-hotspot flavor text, evidence records, and
// the K-01 discovery beat live in minigame-exhibition-search/index.html,
// mirroring how roomSearchAreas keeps gating logic out of dialogueData.js.
const exhibitionSearchHotspots = [
  { id: 'k01', label: '황동 장치 K-01' },
  { id: 'desk', label: '접수대' },
  { id: 'entrance', label: '출입구 주변' },
  { id: 'camera', label: '오래된 필름 카메라' },
  { id: 'watch', label: '은제 회중시계' },
  { id: 'tag', label: '직원용 태그' },
  { id: 'staffdoor', label: '직원 전용문' },
  { id: 'pamphlet', label: '안내 팸플릿' },
  { id: 'guestbook', label: '방문객 방명록' },
  { id: 'ceiling', label: '천장 보안카메라' },
];

// Registry of testable Week 1 scenes — /dev/week1 lists these, each linking
// to /dev/game/?scene=<id>. Covers only the 1주차 main weekend arc
// ("사라진 K-01") — 평일 미니씬(W1-D1~D5)은 아직 미구현.
//
// ===== 1주차 장편 확장 v2 =====
// §4 구조 개요대로 재배치: 003(순수 자유조사) → 004(도난+사진분석,
// 004-minigame/004-review) → 005(신규: 용의자 선별+현장 재조사+첫 가설) →
// 006(윤민아 4라운드) → 007(애드리언 4라운드) → 008(레오 1차+타임라인) →
// 009(레오 집중 심문 9라운드) → 010(중간 추리+재오픈) → 011(윤민아 최종
// 8라운드) → 012(사건 재구성 6칸) → 013(엔딩). VN→VN 전환은 기존 관례대로
// nextSceneId를 쓰지 않고 /dev/week1의 순서 목록(order)으로만 안내하며,
// nextSceneId는 미니게임 핸드오프(사진 분석/시간대 정리) 두 곳에만 남아있다.
const week1Scenes = [
  {
    id: 'week1-scene-001',
    order: 1,
    name: '시티로 출발',
    location: 'Circular Quay 이동 중',
    introLabel: 'SYDNEY',
    time: '09:40',
    lines: week1Scene001Lines,
  },
  {
    id: 'week1-scene-002',
    order: 2,
    name: '관광객 모드',
    location: 'Circular Quay',
    introLabel: 'CIRCULAR QUAY',
    time: '10:15',
    lines: week1Scene002Lines,
  },
  {
    id: 'week1-scene-003',
    order: 3,
    name: '전시장 자유 조사',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:40',
    // Hands off into the exhibition hotspot-search minigame — see
    // MINIGAME_ROUTES in game/index.html.
    lines: week1Scene003Lines,
    nextSceneId: 'week1-scene-003-minigame',
    // Wires this scene into /dev/upload's room-hotspot editor the same way
    // week0-scene-001-2 wires in the Eastwood map (scene.minigameId) — picking
    // the "미니게임" background kind there stores a real exhibition photo
    // under the week1-scene-003-minigame sceneId, and scene.roomHotspots
    // (exhibitionSearchHotspots) offers all 10 named spots to mark on it, via
    // DevGameState.getRoomHotspots/setRoomHotspot exactly like minigame-
    // phone-search's rooms. Until a dev marks a photo, the minigame falls
    // back to its existing grid-card mode.
    minigameId: 'week1-scene-003-minigame',
    roomHotspots: exhibitionSearchHotspots,
  },
  {
    id: 'week1-scene-003-minigame',
    order: 4,
    name: '전시장 둘러보기 (미니게임)',
    location: 'Pop-up Exhibition',
    time: '10:44',
    route: '/dev/minigame-exhibition-search/',
  },
  {
    id: 'week1-scene-004',
    order: 5,
    name: '도난 발생',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:47',
    // Hands off into the expanded photo-zoom minigame — see MINIGAME_ROUTES
    // in game/index.html.
    lines: week1Scene004Lines,
    nextSceneId: 'week1-scene-004-minigame',
  },
  {
    id: 'week1-scene-004-minigame',
    order: 6,
    name: '사진 속 인물 찾기 (미니게임)',
    location: 'Pop-up Exhibition',
    time: '10:52',
    route: '/dev/minigame-photo-zoom/',
  },
  {
    id: 'week1-scene-004-review',
    order: 7,
    name: '사진 분석 마무리',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:56',
    lines: week1Scene004ReviewLines,
  },
  {
    id: 'week1-scene-005',
    order: 8,
    name: '용의자 선별 및 현장 재조사',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:00',
    lines: week1Scene005Lines,
  },
  {
    id: 'week1-scene-006',
    order: 9,
    name: '윤민아 1차 심문',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:10',
    lines: week1Scene006Lines,
  },
  {
    id: 'week1-scene-007',
    order: 10,
    name: '애드리언 1차 심문',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:25',
    lines: week1Scene007Lines,
  },
  {
    id: 'week1-scene-008',
    order: 11,
    name: '레오 1차 심문 및 타임라인',
    location: 'Café near Circular Quay',
    introLabel: 'CIRCULAR QUAY',
    time: '11:40',
    lines: week1Scene008Lines,
    // Hands off into the expanded 5단계 timeline minigame — see
    // MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week1-scene-008-minigame',
  },
  {
    id: 'week1-scene-008-minigame',
    order: 12,
    name: '시간대 정리 (미니게임)',
    location: 'Café near Circular Quay',
    time: '11:55',
    route: '/dev/minigame-timeline/',
  },
  {
    id: 'week1-scene-009',
    order: 13,
    name: '레오 집중 심문',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '12:05',
    lines: week1Scene009Lines,
  },
  {
    id: 'week1-scene-010',
    order: 14,
    name: '중간 추리 및 윤민아 재오픈',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '12:20',
    lines: week1Scene010Lines,
  },
  {
    id: 'week1-scene-011',
    order: 15,
    name: '윤민아 최종 심문',
    location: 'Circular Quay 편집숍',
    introLabel: 'CIRCULAR QUAY',
    time: '18:00',
    lines: week1Scene011Lines,
  },
  {
    id: 'week1-scene-012',
    order: 16,
    name: '사건 재구성',
    location: 'Café near Circular Quay',
    introLabel: 'CIRCULAR QUAY',
    time: '19:00',
    lines: week1Scene012Lines,
  },
  {
    id: 'week1-scene-013',
    order: 17,
    name: '1주차 엔딩 · M.K.라는 이름',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '21:40',
    lines: week1Scene013Lines,
  },
];


// [1주차 추리 개편 v2 — 연속성 이음매 주의] Week 1 was reworked so no scene
// reveals the full name "Mika Kovac"/"미카 코바치" — it now ends knowing only
// the M.K. / MK_Consult account. Everything below (Week 2 onward) was written
// before that overhaul and already uses the full name from early on (e.g.
// week2-scene-012's "미카 코바치" mentions, its suspect-card-with-percentage
// beat). That mismatch is a known seam for a future Week 2+ overhaul pass —
// not fixed here since this pass was scoped to Week 1 only.

/* OPERATION MK — WEEK 2 · SCENE 01 「아침 출발」
   Dialogue Set: dialogue-week2-scene001
   Scene: week2-scene-001 (Featherdale 이동 중, 08:20) */
const week2Scene001Lines = [
  { id: 'line-001', speaker: '', text: '2주차 첫째 날 아침.\n숙소를 나와 페더데일로 향하는 길.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '오늘은 늦게 나온다 했더니, 그건 또 뭐야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-003', speaker: '지수', text: '수첩이요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-004', speaker: '영우', text: '수첩?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '탐정 수첩.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-006', speaker: '영우', text: '...\n진심이었어?', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-007', speaker: '지수', text: '지난주에 레오씨 시간 계산할 때\n폰 메모장 스크롤하다가 놓친 거 있었잖아요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '영우', text: '아, 그거.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-009', speaker: '지수', text: '이번엔 손으로 바로바로 적으려고요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '오늘은 그냥 놀러 가는 거 아니었어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '놀러 가는 거 맞아요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '지수', text: '만약을 위해서 준비만 해두는 거지.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-013', speaker: '영우', text: '만약은 무슨.\n오늘은 코알라랑 캥거루 보러 가는 날이야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-014', speaker: '지수', text: '웅웅 알아요.\n근데 또 모르잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '영우', text: '아이고, 알겠습니다 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-016', speaker: '지수', text: '오늘은 그거 안 시켰는데.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-017', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎ\n입에 붙었나 봐.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '', text: '창밖으로 시드니 시내가 점점 멀어지고,\n초록이 짙어지기 시작했다.', characterId: null },
];

/* OPERATION MK — WEEK 2 · SCENE 02 「Featherdale 데이트」
   Dialogue Set: dialogue-week2-scene002
   Scene: week2-scene-002 (Featherdale Wildlife Park, 10:00) */
const week2Scene002Lines = [
  { id: 'line-001', speaker: '', text: 'Featherdale Wildlife Park.\n오전 10시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '엄마야, 저기 코알라 봐요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-003', speaker: '영우', text: '진짜 자기만 하네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '지수', text: '나 안고 사진 찍을래요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-005', speaker: '영우', text: '그건 여기선 안 될걸.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '...\n확인은 해봐야죠.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'smirk' },
  { id: 'line-007', speaker: '', text: '직원에게 물어보러 갔던 지수가\n금방 시무룩한 얼굴로 돌아왔다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-008', speaker: '영우', text: '안 된대?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '어깨 위에 손 올리는 것까지만이래요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-010', speaker: '영우', text: '그거라도 어디야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '', text: '지수가 코알라 옆에서 어정쩡하게 손을 올렸고,\n영우는 그 모습을 놓치지 않고 열 장쯤 찍었다.', characterId: null },
  { id: 'line-012', speaker: '지수', text: '나 표정 이상하지 않았어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '영우', text: '이상해.\n근데 그게 제일 좋은 컷이야.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '그런 게 어딨어요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-015', speaker: '', text: '캥거루 방목장으로 넘어가자\n작은 캥거루 한 마리가 지수 손바닥의 먹이를 덥썩 물었다.', characterId: null },
  { id: 'line-016', speaker: '지수', text: '으아앗!', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-017', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎ\n놀란 얼굴 그거 완전 찍혔다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '지수', text: '지워요, 그거.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-019', speaker: '영우', text: '싫은데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-020', speaker: '지수', text: '영우야.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-021', speaker: '영우', text: '알겠어, 알겠어.\n대신 이건 나만 볼게.', characterId: 'youngwoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 2 · SCENE 03 「고양잇과 동물 앞 농담」
   Dialogue Set: dialogue-week2-scene003
   Scene: week2-scene-003 (Featherdale Wildlife Park, 10:20)
   무깽이 리마인드 #3 — 매우 짧게, 단서 처리 없이 지나가는 농담. */
const week2Scene003Lines = [
  { id: 'line-001', speaker: '', text: '작은 우리 앞 표지판.\n"Spotted-tail Quoll (Native Cat)"', characterId: null },
  { id: 'line-002', speaker: '지수', text: '어? 얘 고양이과래요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-003', speaker: '영우', text: '이름만 그런 거야.\n사실 유대류라던데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '지수', text: '몰라요, 그런 거.\n생긴 건 딱 고양이야.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '지수', text: '무깽이도 지가 저런 줄 알 듯.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '영우', text: '쟤는 자기가 사자라고 생각하지.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-007', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎ\n맞네.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '', text: '둘은 잠깐 웃고는 다음 구역으로 걸음을 옮겼다.', characterId: null },
];

/* OPERATION MK — WEEK 2 · SCENE 04 「투어 그룹 사람들」
   Dialogue Set: dialogue-week2-scene004
   Scene: week2-scene-004 (Featherdale Wildlife Park, 10:40)
   여기서 자연스럽게 스친 소규모 단체 관광객 넷이 다음 씬의 목격자가 된다. */
const week2Scene004Lines = [
  { id: 'line-001', speaker: '', text: '웜뱃 우리 앞.\n오전 10시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '같은 자리에서 사진을 찍던 소규모 투어 그룹과 자리가 겹쳤다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저희가 먼저 볼게요, 하시고 천천히 오세요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '관광객 일행', text: '아뇨아뇨, 편하게 보세요.\n저희도 방금 왔어요.', characterId: null },
  { id: 'line-005', speaker: '영우', text: '단체로 오셨나 봐요.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '관광객 일행', text: '네, 작은 투어 상품으로요.\n오전엔 여기, 오후엔 블루마운틴 가요.', characterId: null },
  { id: 'line-007', speaker: '지수', text: '저희랑 코스가 똑같네요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '관광객 일행', text: '그러네요, 반갑네요.\n웜뱃 진짜 안 움직이죠?', characterId: null },
  { id: 'line-009', speaker: '영우', text: '한 시간째 저 자세인 것 같은데요.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '관광객 일행', text: 'ㅎㅎ 저희도 그거 보면서 웃었어요.', characterId: null },
  { id: 'line-011', speaker: '', text: '별다를 것 없는 짧은 스몰토크였고,\n둘은 곧 다음 구역으로 넘어갔다.', characterId: null },
  { id: 'line-012', speaker: '지수', text: '사람들 되게 친절하다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-013', speaker: '영우', text: '여행 오면 다들 좀 너그러워지잖아.', characterId: 'youngwoo', expression: 'soft' },
];

/* OPERATION MK — WEEK 2 · SCENE 05 「분실된 메모리카드」
   Dialogue Set: dialogue-week2-scene005
   Scene: week2-scene-005 (Featherdale Wildlife Park, 11:15) */
const week2Scene005Lines = [
  { id: 'line-001', speaker: '', text: '캥거루 방목장 근처.\n오전 11시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '아까 그 투어 그룹 쪽에서 다급한 목소리가 들렸다.', characterId: null },
  { id: 'line-003', speaker: '카메라 주인', text: '어, 어...\n제 카메라 메모리카드가 없어졌어요.', characterId: null },
  { id: 'line-004', speaker: '영우', text: '무슨 일이세요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '카메라 주인', text: '가방 안에 카드 케이스가 있었는데,\n지금 열어보니까 카드만 딱 없어요.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '카메라 본체는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '카메라 주인', text: '그건 있어요.\n카드만요.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-009', speaker: '영우', text: '지수야, 그 표정.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-010', speaker: '지수', text: '아뇨, 그냥.\n1주차 생각나서요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '', text: '주변에 있던 일행 세 명이 하나둘 다가왔다.', characterId: null },
  { id: 'line-012', speaker: '관광객 일행', text: '저희 다 같이 있었는데, 아무도 못 봤어요.', characterId: null },
  { id: 'line-013', speaker: '관광객 일행', text: '아, 잠깐만.\n아까 그 여자분 이상하지 않았어요?', characterId: null },
  { id: 'line-014', speaker: '관광객 일행', text: '맞아요, 회색 코트 입은 분.', characterId: null },
  { id: 'line-015', speaker: '관광객 일행', text: '저도 봤어요, 회색 코트.\n계속 저희 근처에서 얼쩡거렸어요.', characterId: null },
  { id: 'line-016', speaker: '관광객 일행', text: '저도요.\n은색 귀걸이 하고 있던 그 여자분.', characterId: null },
  { id: 'line-017', speaker: '지수', text: '...\n회색 코트, 은색 귀걸이.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-018', speaker: '영우', text: '다들 한 명을 정확히 기억하고 있네.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '웅, 근데 저는 그런 사람 못 봤는데.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-020', speaker: '지수', text: '일단 한 분씩 따로 여쭤볼게요.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 2 · SCENE 06 「네 명의 같은 증언」
   Dialogue Set: dialogue-week2-scene006
   Scene: week2-scene-006 (Featherdale Wildlife Park, 11:30)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   증언 문장 겹치기 minigame, week2-scene-006-minigame. Result(표현이 비정상적으로
   유사함을 확인)은 week2-scene-007이 열릴 때 이미 찾은 것으로 취급한다. */
const week2Scene006Lines = [
  { id: 'line-001', speaker: '', text: '방목장 벤치.\n오전 11시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '네 명을 한 명씩 따로 불러 같은 질문을 던졌다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '한 명씩 물어봤는데, 진술이 너무 비슷해.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '저도 그렇게 느꼈어요.\n단어까지 겹쳐요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-005', speaker: '지수', text: '회색 코트, 은색 귀걸이, 낮은 목소리, 왼손잡이.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '넷이 각자 다른 자리에 있었잖아.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '웅.\n근데 표현까지 똑같이 나올 수가 있나.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-008', speaker: '영우', text: '네 사람 진술을 한 번 나란히 놓고 봐야겠다.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-009', speaker: '지수', text: '문장 단위로 겹치는 부분 표시해볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: '지수가 수첩에 네 사람의 진술을 한 줄씩 옮겨 적고,\n같은 표현이 나오는 자리를 겹쳐보기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 2 · SCENE 07 「CCTV에 없는 여자」
   Dialogue Set: dialogue-week2-scene007
   Scene: week2-scene-007 (Featherdale 방문자센터, 13:00) */
const week2Scene007Lines = [
  { id: 'line-001', speaker: '', text: 'Featherdale 방문자센터.\n낮 1시.', characterId: null },
  { id: 'line-002', speaker: '', text: '네 사람의 진술을 겹쳐보니 표현이 비정상적으로 일치했다.\n관리 직원에게 CCTV 확인을 부탁했다.', characterId: null },
  { id: 'line-003', speaker: '방문자센터 직원', text: '말씀하신 시간대, 다 돌려봤는데요.', characterId: null },
  { id: 'line-004', speaker: '영우', text: '회색 코트 입은 여자분, 나오나요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '방문자센터 직원', text: '그게... 없어요.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '없다고요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '방문자센터 직원', text: '그 시간대에 회색 코트 입은 사람 자체가\n어느 화면에도 안 잡혀요.', characterId: null },
  { id: 'line-008', speaker: '영우', text: '넷이나 봤다는 사람이 카메라에는 하나도 안 찍혔다고요?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-009', speaker: '방문자센터 직원', text: '사각지대가 있긴 한데, 넷이 각자 다른 자리에서 봤다면서요.\n그럼 최소 한 대에는 걸려야 정상이에요.', characterId: null },
  { id: 'line-010', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-011', speaker: '지수', text: '그 여자, 처음부터 없었던 거 아니에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '영우', text: '그럼 그 카드는 누가 가져간 건데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '방문자센터 직원', text: '그 시간대에 카드 주인 근처에 계속 있던 분들은\n따로 세 분 정도 걸리네요.', characterId: null },
  { id: 'line-014', speaker: '', text: '화면 속 세 사람이 확대된다.', characterId: null },
  { id: 'line-015', speaker: '', text: '[ 한소라 / 이든 브룩스 / 다니엘 우 ]', characterId: null },
  { id: 'line-016', speaker: '지수', text: '이 세 분, 어디 계신지 알 수 있을까요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-017', speaker: '방문자센터 직원', text: '같은 투어 명단이라 아직 근처에 계실 거예요.', characterId: null },
  { id: 'line-018', speaker: '영우', text: '한 명씩 만나보자.', characterId: 'youngwoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 2 · SCENE 08 「이든 브룩스 조사」
   Dialogue Set: dialogue-week2-scene008
   Scene: week2-scene-008 (Featherdale Wildlife Park, 13:20) */
const week2Scene008Lines = [
  { id: 'line-001', speaker: '', text: '조류 사육장 앞.\n오후 1시 20분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '이든 브룩스 님 맞으시죠?\n잠깐 여쭤볼 게 있어서요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '이든 브룩스', text: '네? 아, 네.\n그 메모리카드 일이요?', characterId: 'ethan', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '아까 그 근처에 계셨죠?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '이든 브룩스', text: '아뇨, 저는 반대쪽에 있었는데요.', characterId: 'ethan', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: 'CCTV에는 그쪽에 계신 걸로 나와서요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '이든 브룩스', text: '...', characterId: 'ethan', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'line-008', speaker: '이든 브룩스', text: '...\n사실 조금 있었어요, 잠깐.', characterId: 'ethan', expression: 'annoyed' },
  { id: 'line-009', speaker: '영우', text: '왜 아니라고 하신 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '이든 브룩스', text: '거기, 촬영 금지 구역이거든요.\n번식장 쪽이라.', characterId: 'ethan', expression: 'annoyed' },
  { id: 'line-011', speaker: '이든 브룩스', text: '몰래 좀 찍고 있었어요.\n괜히 걸릴까 봐 아니라고 한 거예요.', characterId: 'ethan', expression: 'annoyed' },
  { id: 'line-012', speaker: '지수', text: '그럼 메모리카드는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '이든 브룩스', text: '그건 진짜 몰라요.\n제 폰으로 찍었지 카메라도 안 썼어요.', characterId: 'ethan', expression: 'neutral' },
  { id: 'line-014', speaker: '영우', text: '...\n이분은 그냥 촬영 금지 구역 때문에 숨긴 거네.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '웅.\n동기가 안 맞아요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-016', speaker: '이든 브룩스', text: '저 신고하실 건 아니죠...?', characterId: 'ethan', expression: 'annoyed' },
  { id: 'line-017', speaker: '지수', text: '아뇨, 저희는 그쪽 담당 아니에요.\n걱정 마세요.', characterId: 'jisoo', expression: 'soft' },
];

/* OPERATION MK — WEEK 2 · SCENE 09 「다니엘 우 조사」
   Dialogue Set: dialogue-week2-scene009
   Scene: week2-scene-009 (Featherdale Wildlife Park, 13:40) */
const week2Scene009Lines = [
  { id: 'line-001', speaker: '', text: '피크닉 테이블 근처.\n오후 1시 40분.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '다니엘 우 님이세요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-003', speaker: '다니엘 우', text: '네, 맞아요.\n무슨 일이시죠.', characterId: 'daniel', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '아까 카드 없어진 시간대에\n혹시 그 근처 계셨나 해서요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '다니엘 우', text: '아뇨, 전 계속 반대쪽에 있었어요.', characterId: 'daniel', expression: 'neutral' },
  { id: 'line-006', speaker: '영우', text: 'CCTV에는 그 근처에 계신 걸로 나오던데요.', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '다니엘 우', text: '...', characterId: 'daniel', pauseBeforeMs: 400, expression: 'annoyed' },
  { id: 'line-008', speaker: '다니엘 우', text: '아, 그게.\n제가 좀 창피해서 그랬어요.', characterId: 'daniel', expression: 'annoyed' },
  { id: 'line-009', speaker: '지수', text: '창피해서요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-010', speaker: '다니엘 우', text: '거기서 넘어졌거든요, 아무것도 없는데 혼자.\n그게 카메라에 찍혔을까봐 신경 쓰였어요.', characterId: 'daniel', expression: 'shocked' },
  { id: 'line-011', speaker: '다니엘 우', text: '그거 물어보시는 줄 알고 일단 아니라고 한 거예요.', characterId: 'daniel', expression: 'annoyed' },
  { id: 'line-012', speaker: '영우', text: '메모리카드는요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '다니엘 우', text: '전혀 몰라요.\n남 물건에 손댈 이유가 없죠.', characterId: 'daniel', expression: 'neutral' },
  { id: 'line-014', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '이분도 아니네요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-016', speaker: '영우', text: '넘어진 거 안 찍혔을 거예요, 아마.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-017', speaker: '다니엘 우', text: '제발요.', characterId: 'daniel', expression: 'annoyed' },
];

/* OPERATION MK — WEEK 2 · SCENE 10 「한소라 — 기억을 심은 사람」
   Dialogue Set: dialogue-week2-scene010
   Scene: week2-scene-010 (Featherdale Wildlife Park, 14:00)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   대화 순서 재구성 minigame, week2-scene-010-minigame. 미니게임 결과(한소라가
   사건 전 각 목격자에게 서로 다른 특징을 심어 하나의 가짜 여성을 완성했다는 것)는
   week2-scene-011이 열릴 때 이미 밝혀진 것으로 취급한다. */
const week2Scene010Lines = [
  { id: 'line-001', speaker: '', text: '기념품 가게 앞.\n오후 2시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '한소라 님이시죠?\n잠깐 여쭤볼게요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '한소라', text: '아, 네.\n그 카드 없어진 거요?', characterId: 'sora', expression: 'neutral' },
  { id: 'line-004', speaker: '한소라', text: '저도 들었어요, 진짜 놀랐어요.\n회색 코트 여자가 그랬다면서요.', characterId: 'sora', expression: 'shocked' },
  { id: 'line-005', speaker: '영우', text: '그 얘기, 어디서 들으셨어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '한소라', text: '다들 그렇게 얘기하던데요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-008', speaker: '지수', text: '근데 저희가 확인해보니\nCCTV에는 그런 여자가 안 잡혀요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '한소라', text: '...', characterId: 'sora', pauseBeforeMs: 500, expression: 'neutral' },
  { id: 'line-010', speaker: '영우', text: '그리고 CCTV에는 카드 주인 근처에\n소라 님이 계속 계셨던 걸로 나오고요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-011', speaker: '한소라', text: '그건... 우연히 근처에 있었던 거예요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-012', speaker: '지수', text: '넷이 겹쳐 말한 인상착의, 소라 님이 한 명씩 따로\n먼저 얘기 꺼내신 적 있으세요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '한소라', text: '...\n무슨 말씀이신지.', characterId: 'sora', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'line-014', speaker: '영우', text: '누구한테는 회색 코트, 누구한테는 은색 귀걸이,\n따로따로 흘리면 나중에 넷이 모여서 합쳐지잖아요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-015', speaker: '지수', text: '한 사람씩 나눠서 심으면\n실제로 있지도 않은 사람이 완성되죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-016', speaker: '한소라', text: '...', characterId: 'sora', pauseBeforeMs: 500, expression: 'neutral' },
  { id: 'line-017', speaker: '', text: '지수가 아까 넷에게 들은 대화를 순서대로 다시 늘어놓기 시작했다.\n누가 먼저 무슨 말을 꺼냈는지 맞춰보면 답이 나올 것 같았다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-018', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 2 · SCENE 11 「두 번째 추리」
   Dialogue Set: dialogue-week2-scene011
   Scene: week2-scene-011 (Featherdale Wildlife Park, 14:30) */
const week2Scene011Lines = [
  { id: 'line-001', speaker: '', text: '기념품 가게 뒤편.\n오후 2시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '대화 순서를 다시 맞춰보니, 네 사람에게 각각 다른 특징을\n먼저 흘린 사람은 전부 한소라였다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '회색 코트는 첫 번째 분한테,\n은색 귀걸이는 두 번째 분한테.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '낮은 목소리랑 왼손잡이는 나머지 두 분한테.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '넷이 나중에 모여서 얘기하다가\n그게 전부 한 사람 얘기인 줄 알고 합친 거예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '한소라', text: '...\n하아.', characterId: 'sora', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'line-007', speaker: '한소라', text: '...\n맞아요, 제가 그런 거예요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-008', speaker: '영우', text: '카드는 왜 가져가신 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '한소라', text: '그 안에 제가 찍힌 사진이 있었어요.\n좀... 곤란한 자리에서 찍힌 거요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-010', speaker: '지수', text: '지워달라고 하면 되지 않았어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-011', speaker: '한소라', text: '설명하기가 더 복잡했어요.\n그냥 카드째 없애는 게 빠르다고 생각했어요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-012', speaker: '한소라', text: '근데 바로 없어진 걸 알아채실 줄은 몰랐어요.\n그래서 급하게 다른 사람 얘기를 만든 거고요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-013', speaker: '지수', text: '그럼 진짜 회색 코트 여자 같은 건.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-014', speaker: '한소라', text: '없어요.\n제가 지어낸 거예요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-015', speaker: '영우', text: '...\n그럼 이번엔 그냥 소라 님 혼자 벌인 일이네요.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-016', speaker: '한소라', text: '네.\n죄송해요, 카드는 돌려드릴게요.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-017', speaker: '', text: '한소라가 가방에서 메모리카드를 꺼내 건넸다.\n그 순간 폰 알림이 화면에 떴다.', characterId: 'sora', expression: 'neutral' },
  { id: 'line-018', speaker: '지수', text: '어...\n그거 뭐예요?', characterId: 'jisoo', expression: 'shocked' },
];

/* OPERATION MK — WEEK 2 · SCENE 12 「미카의 두 번째 흔적」
   Dialogue Set: dialogue-week2-scene012
   Scene: week2-scene-012 (Sydney Accommodation, 21:00)
   Closes out Week 2's main weekend arc — 2주차 평일 미니씬(W2-D1~D5)은 별도로
   추가될 예정. No nextSceneId; ends on narration like week1-scene-011. */
const week2Scene012Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 9시.', characterId: null },
  { id: 'line-002', speaker: '', text: '한소라가 얼결에 보여준 화면이 계속 마음에 걸렸다.\n숙소로 돌아와 사진을 다시 확인해봤다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '아까 그 알림, 뭐라고 찍혀 있었어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '제가 사진 찍어놨어요.\n잠깐만요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '[ 발신: M. Kovac ]\n[ 요청: 특정 날짜, 특정 관광객 동선의 원본 사진 확보 ]', characterId: null },
  { id: 'line-006', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-007', speaker: '지수', text: '며칠 전에 소라 님한테 온 문의래요.\n저희 일이랑은 상관없이요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '영우', text: '근데 왜 하필 또 M.K.야.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-009', speaker: '지수', text: '첨부돼 있던 계약서도 같이 보내주셨어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: '[ 문서 메타데이터 · 작성자: MKOVAC ]', characterId: null },
  { id: 'line-011', speaker: '영우', text: '1주차 그 문의 메일이랑 똑같은 이름이잖아.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-012', speaker: '지수', text: '웅.\n이번엔 도난이랑 상관도 없는데 또 나왔어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '소라 님 사건은 소라 님 혼자 벌인 거고,\nM.K.는 그냥 사진을 사려고 한 것뿐이에요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '근데 그 사진 문의가 하필 이 동네, 이 시기에 왔어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-016', speaker: '지수', text: '이제 우연이라고 하지 마.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-017', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 500, expression: 'blank' },
  { id: 'line-018', speaker: '', text: '영우는 대답하지 못했다.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-019', speaker: '지수', text: '용의자 카드 업데이트할게요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-020', speaker: '', text: '[ 용의자 카드 갱신 ]\n미카 코바치 — M.K. 가능성 65%', characterId: null },
  { id: 'line-021', speaker: '', text: '지수의 2주차는,\n또 하나의 M.K.를 남기고 저물었다.', characterId: null },
];

// Registry of testable Week 2 scenes — /dev/week2 lists these, each linking
// to /dev/game/?scene=<id>. Covers only the 2주차 main weekend arc
// (W2-S01~S12, "존재하지 않는 여자") — 2주차 평일 미니씬(W2-D1~D5)은 아직 미구현.
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week0Scenes.
const week2Scenes = [
  {
    id: 'week2-scene-001',
    order: 1,
    name: '아침 출발',
    location: 'Featherdale 이동 중',
    introLabel: 'FEATHERDALE',
    time: '08:20',
    lines: week2Scene001Lines,
  },
  {
    id: 'week2-scene-002',
    order: 2,
    name: 'Featherdale 데이트 · 분실된 메모리카드',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '10:00',
    // Merged week2-scene-002~006 (all Featherdale Wildlife Park, back to
    // back). Hands off into the (not yet built) 증언 문장 겹치기 minigame —
    // see MINIGAME_ROUTES in game/index.html. Falls back to a "MINIGAME
    // START" placeholder overlay until that route exists.
    lines: mergeLines(week2Scene002Lines, week2Scene003Lines, week2Scene004Lines, week2Scene005Lines, week2Scene006Lines),
    nextSceneId: 'week2-scene-006-minigame',
  },
  {
    id: 'week2-scene-007',
    order: 3,
    name: 'CCTV에 없는 여자',
    location: 'Featherdale 방문자센터',
    introLabel: 'FEATHERDALE',
    time: '13:00',
    lines: week2Scene007Lines,
  },
  {
    id: 'week2-scene-008',
    order: 4,
    name: '이든 · 다니엘 · 한소라 조사',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '13:20',
    // Merged week2-scene-008~010 (all Featherdale Wildlife Park, back to
    // back). Hands off into the (not yet built) 대화 순서 재구성 minigame
    // that surfaces 한소라's coached testimony — same placeholder fallback
    // as above.
    lines: mergeLines(week2Scene008Lines, week2Scene009Lines, week2Scene010Lines),
    nextSceneId: 'week2-scene-010-minigame',
  },
  {
    id: 'week2-scene-011',
    order: 5,
    name: '두 번째 추리',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '14:30',
    lines: week2Scene011Lines,
  },
  {
    id: 'week2-scene-012',
    order: 6,
    name: '미카의 두 번째 흔적',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '21:00',
    lines: week2Scene012Lines,
  },
];

// Registry of standalone-testable minigames — /dev/minigames lists these.
// Tapping one no longer jumps straight into the live game: it opens
// `setupUrl` first (그 미니게임의 배경/정답영역 에디터, focused via
// /dev/upload's ?minigame= param — see applyFocusModeChrome there), and
// only that screen's floating 테스트하기 button (entry.route) actually
// starts the game. Keep `route` in sync with MINIGAME_ROUTES in game/index.html.
const minigames = [
  {
    id: 'week0-scene-001-2-minigame',
    name: '지하철 역 찾기',
    location: 'Sydney Airport Station',
    route: '/dev/minigame-eastwood/',
    setupUrl: '/dev/upload/?scene=week0-scene-001-2&kind=minigame&minigame=week0-scene-001-2-minigame',
  },
  {
    // Standalone physics/AI minigame — no background image or hand-marked
    // hotspots to set up, so setupUrl is its own difficulty/motion-type
    // picker (dev/minigame-fishing/index.html) instead of an /dev/upload
    // editor screen; route is the actual play page, which reads those
    // choices back off the query string.
    id: 'fishing-minigame',
    name: '낚시',
    location: '독립형 미니게임 (스토리 미연동)',
    route: '/dev/minigame-fishing/play/',
    setupUrl: '/dev/minigame-fishing/',
  },
  {
    // Standalone Suika-style merge game — same setupUrl/route split as
    // fishing above, but the settings screen picks a per-fruit photo
    // instead of difficulty/motion.
    id: 'watermelon-minigame',
    name: '수박 게임',
    location: '독립형 미니게임 (스토리 미연동)',
    route: '/dev/minigame-watermelon/play/',
    setupUrl: '/dev/minigame-watermelon/',
  },
  {
    // Standalone combination-puzzle minigame — same setupUrl/route split as
    // fishing/watermelon above. Settings screen picks difficulty/mode/fx/
    // motion instead of a photo; play screen reads them back off the query
    // string (see dev/minigame-transform/play/'s settingsParams block).
    id: 'transform-minigame',
    name: '변신 마법',
    location: '독립형 미니게임 (스토리 미연동)',
    route: '/dev/minigame-transform/play/',
    setupUrl: '/dev/minigame-transform/',
  },
  {
    // Standalone (no dev-marked background/hotspots to set up — see
    // minigame-item-scan's comment above for the same reasoning) photo
    // zoom-and-tap investigation. setupUrl === route since there's no
    // separate settings screen.
    id: 'week1-scene-004-minigame',
    name: '사진 속 인물 찾기',
    location: 'Pop-up Exhibition',
    route: '/dev/minigame-photo-zoom/',
    setupUrl: '/dev/minigame-photo-zoom/',
  },
  {
    // Standalone tap-to-order timeline puzzle — same no-setup-screen
    // reasoning as above.
    id: 'week1-scene-008-minigame',
    name: '시간대 정리',
    location: 'Café near Circular Quay',
    route: '/dev/minigame-timeline/',
    setupUrl: '/dev/minigame-timeline/',
  },
];

// Registry of standalone-testable 증거 수집 (evidence-collection) scenes —
// /dev/evidence lists these. Same shape/flow as `minigames` above (tap opens
// `setupUrl`'s 배경/핫스팟 에디터 first, only its 테스트하기 button actually
// starts the game) — 핸드폰을 찾아라 was the first of these and moved out of
// `minigames` since it's item/inventory-driven investigation, not an
// arcade-style minigame. Use this entry as the template for any future
// addition.
// Keep `route` in sync with MINIGAME_ROUTES in game/index.html.
const evidenceCollections = [
  {
    id: 'week0-scene-002-2',
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    route: '/dev/minigame-phone-search/',
    setupUrl: `/dev/upload/?scene=${roomSearchAreaSceneId(roomSearchAreas[0].id)}&minigame=week0-scene-002-2`,
  },
  {
    // Moved out of `minigames` — same reasoning as 핸드폰을 찾아라 above, now
    // that this has a real dev-configurable background/room-hotspot editor
    // (see week1-scene-003's minigameId/roomHotspots fields) instead of being
    // a fixed grid-only card list. setupUrl points at the VN scene's own id
    // (week1-scene-003), not the minigame's — see backgroundKinds() in
    // upload/index.html for why the "미니게임" background kind resolves to
    // scene.minigameId regardless of which scene id is in the URL.
    id: 'week1-scene-003-minigame',
    name: '전시장 둘러보기',
    location: 'Pop-up Exhibition',
    route: '/dev/minigame-exhibition-search/',
    setupUrl: '/dev/upload/?scene=week1-scene-003&minigame=week1-scene-003-minigame',
  },
  {
    // Standalone/self-contained like fishing-minigame — the player's own
    // uploaded photo IS the background, so there's no dev-marked
    // background/hotspot pair to set up in /dev/upload first.
    id: 'special-ability-test',
    name: '특수 능력 테스트',
    location: '독립형 테스트 (스토리 미연동)',
    route: '/dev/minigame-item-scan/',
    setupUrl: '/dev/minigame-item-scan/',
  },
];

/* OPERATION MK — WEEK 3 · SCENE 01 「숙소 — 지금까지 정리」
   Dialogue Set: dialogue-week3-scene001
   Scene: week3-scene-001 (Sydney Accommodation, 09:00) */
const week3Scene001Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n오전 9시.', characterId: null },
  { id: 'line-002', speaker: '', text: '3주차 첫날, 지수는 벽에 그동안의 단서를 하나씩 붙이기 시작했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: 'M.K. 열쇠, M. KOV... 봉투, Mika Kovac 문의, MK_Consult.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: 'KOVAC 문자열, M. Kovac 사진 문의, MKOVAC 메타데이터.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '이렇게 늘어놓으니까 진짜 많다.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '이게 미카 아니면 누군데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '영우', text: '문제는 왜 우리 근처에 있냐는 거지.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-008', speaker: '지수', text: '...\n그건 저도 모르겠어요.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-009', speaker: '영우', text: '오늘은 일단 좀 쉬자.\n본다이 가기로 했잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '지수', text: '웅웅.\n오늘 하루는 진짜 그냥 놀 거예요.', characterId: 'jisoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 3 · SCENE 02 「Bondi — 그냥 놀자」
   Dialogue Set: dialogue-week3-scene002
   Scene: week3-scene-002 (Bondi Beach, 11:00)
   미스터리 없음 — 브리프대로 하루 정도 사건을 잊는 낭만 파트. */
const week3Scene002Lines = [
  { id: 'line-001', speaker: '', text: 'Bondi Beach.\n오전 11시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '바다다아!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-003', speaker: '영우', text: '뛰지 마, 넘어져.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '', text: '지수는 이미 신발을 벗어던지고 모래사장을 가로지르고 있었다.', characterId: null },
  { id: 'line-005', speaker: '지수', text: '사진 찍어줘요!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '영우', text: '벌써 몇 장째야.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-007', speaker: '지수', text: '오늘은 사건 얘기 안 하기로 했잖아요.\n대신 사진은 무제한.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '영우', text: '그런 규칙이 어딨어 ㅋㅋㅋ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '', text: '둘은 파도 앞에서 한참을 장난치며 놀았다.', characterId: null },
  { id: 'line-010', speaker: '지수', text: '아 진짜 오랜만에 아무 생각이 없다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-011', speaker: '영우', text: '그치.\n오늘은 그냥 이렇게 있자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-012', speaker: '', text: '한참 뒤, 둘은 짐을 챙겨두었던 자리로 돌아왔다.', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 03 「황동 열쇠 실종」
   Dialogue Set: dialogue-week3-scene003
   Scene: week3-scene-003 (Bondi Beach, 12:30) */
const week3Scene003Lines = [
  { id: 'line-001', speaker: '', text: 'Bondi Beach, 짐을 둔 자리.\n낮 12시 30분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '가방 좀 열어볼게요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '', text: '지수가 가방을 뒤적이다 멈춘다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '어?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-005', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '지갑 있고, 폰 있고, 선크림도 있는데.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '지수', text: '열쇠가 없어요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '영우', text: '그 M.K. 열쇠?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-009', speaker: '지수', text: '웅.\n다른 건 다 그대로인데 그것만요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '영우', text: '단순 분실이면 다른 것도 없어져야 정상 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '그러니까요.\n딱 그것만 가져갔어요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '영우', text: '...\n오늘은 사건 얘기 안 하기로 했는데.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-013', speaker: '지수', text: '얘기가 저를 찾아온 거예요.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 3 · SCENE 04 「Bondi 동선 재구성」
   Dialogue Set: dialogue-week3-scene004
   Scene: week3-scene-004 (Bondi Beach, 12:40)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   결제/사진 시각 · 벤치/탈의공간/카페 동선 재구성 minigame,
   week3-scene-004-minigame. */
const week3Scene004Lines = [
  { id: 'line-001', speaker: '', text: 'Bondi Beach 산책로.\n낮 12시 40분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '오늘 우리 동선부터 한번 정리해봐요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '영우', text: '카페에서 결제하고, 사진 찍고, 벤치에 앉았다가,\n탈의 공간 갔다 왔잖아.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '그 사이 어느 순간에 가방을 손 뻗을 거리에 안 뒀는지가 중요해요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '결제 영수증에 시간 찍혀 있을 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '사진 찍은 시간도 있고요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '영우', text: '그럼 그 시간들이랑 우리가 어디 있었는지를 겹쳐보자.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '단순 분실이면 이렇게까지 안 맞아떨어질 텐데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '', text: '지수가 영수증과 사진, 기억나는 동선을\n하나씩 시간 순서에 맞춰 배치하기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 05 「사진 속 검은 재킷」
   Dialogue Set: dialogue-week3-scene005
   Scene: week3-scene-005 (Bondi Beach, 13:10)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   1주차/3주차 사진 실루엣 비교 minigame, week3-scene-005-minigame. */
const week3Scene005Lines = [
  { id: 'line-001', speaker: '', text: 'Bondi Beach 산책로.\n오후 1시 10분.', characterId: null },
  { id: 'line-002', speaker: '', text: '동선을 다시 맞춰보니, 탈의 공간에 다녀온 5분 사이\n가방이 손이 안 닿는 곳에 있었다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '그 5분 사이에 누가 지나갔는지가 관건이네.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '그때 찍은 사진들 배경에 사람들 있을 거예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '지수가 그 시간대 사진들을 확대해서 살펴본다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '...\n잠깐.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '이 재킷, 1주차 전시장 사진에서 본 그 실루엣 아니에요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: '설마.\n한번 나란히 놓고 보자.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-010', speaker: '', text: '지수가 1주차 전시장 사진과 방금 찍은 사진을 나란히 띄운다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 06 「Fish Market — 노아 리」
   Dialogue Set: dialogue-week3-scene006
   Scene: week3-scene-006 (Sydney Fish Market, 16:00) */
const week3Scene006Lines = [
  { id: 'line-001', speaker: '', text: 'Sydney Fish Market 근처, 공예품 가판.\n오후 4시.', characterId: null },
  { id: 'line-002', speaker: '', text: '재킷 절개선, 은색 USB 케이스, 왼손 시계까지\n1주차 사진 속 인물과 동일했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저기, 실례합니다.\n금속 공예 하시는 분 맞으시죠?', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '노아 리', text: '네, 맞아요.\n뭐 도와드릴까요?', characterId: 'noah', expression: 'neutral' },
  { id: 'line-005', speaker: '', text: '지수가 사라졌던 열쇠 사진을 보여준다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '이 열쇠, 혹시 봐주실 수 있어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '노아 리', text: '음...', characterId: 'noah', pauseBeforeMs: 300, expression: 'curious' },
  { id: 'line-008', speaker: '노아 리', text: '이거 오래된 거 아니에요.', characterId: 'noah', expression: 'serious' },
  { id: 'line-009', speaker: '영우', text: '네?\n딱 봐도 낡았는데요.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '노아 리', text: '겉만 그렇게 보이게 만든 거예요.\n표면 처리가 딱 그 방식이에요.', characterId: 'noah', expression: 'serious' },
  { id: 'line-011', speaker: '지수', text: '그게 무슨 말이에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '노아 리', text: '제대로 확인해봐도 될까요?\n좀 더 자세히 볼게요.', characterId: 'noah', expression: 'neutral' },
];

/* OPERATION MK — WEEK 3 · SCENE 07 「낡게 만든 열쇠」
   Dialogue Set: dialogue-week3-scene007
   Scene: week3-scene-007 (Sydney Fish Market, 16:20)
   브리프가 명시한 "미카 진범설의 가장 강한 물리 증거" 장면. */
const week3Scene007Lines = [
  { id: 'line-001', speaker: '', text: 'Sydney Fish Market 근처, 공예품 가판.\n오후 4시 20분.', characterId: null },
  { id: 'line-002', speaker: '노아 리', text: '역시 그렇네요.', characterId: 'noah', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '뭐가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '노아 리', text: '인공 산화 처리예요.\n녹슬어 보이게 화학약품으로 처리한 거고, 가공 자체는 최근이에요.', characterId: 'noah', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '그럼 이거 맞춤 제작이라는 거예요?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-006', speaker: '노아 리', text: '네, 각인 방식 보면 확실해요.\n저희 업계에서 흔히 쓰는 방식이거든요.', characterId: 'noah', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '어디서 만든 건지 알 수 있어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '노아 리', text: '저희 쪽 업계 주문망에 비슷한 요청이 있었는지 한번 찾아볼게요.', characterId: 'noah', expression: 'neutral' },
  { id: 'line-009', speaker: '', text: '노아가 태블릿으로 주문 기록을 뒤진다.', characterId: 'noah', expression: 'curious' },
  { id: 'line-010', speaker: '노아 리', text: '...\n찾았어요.', characterId: 'noah', pauseBeforeMs: 400, expression: 'serious' },
  { id: 'line-011', speaker: '', text: '[ 주문 담당: M. KOVAC / CLIENT CONFIDENTIAL ]', characterId: null },
  { id: 'line-012', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-013', speaker: '영우', text: '이건 진짜 물건이잖아.\n각인, 주문 기록, 다 남아 있어.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-014', speaker: '지수', text: '이 열쇠, 처음부터 진짜 낡은 게 아니었어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '지수', text: '미카 코바치가 일부러 만들어서 우리한테 흘린 거예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-016', speaker: '노아 리', text: '도움이 되셨다니 다행이네요.\n근데 이거, 좀 불안하실 것 같은데요.', characterId: 'noah', expression: 'curious' },
  { id: 'line-017', speaker: '영우', text: '...\n그러게요.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
];

/* OPERATION MK — WEEK 3 · SCENE 08 「지수와 영우의 갈등」
   Dialogue Set: dialogue-week3-scene008
   Scene: week3-scene-008 (Sydney Fish Market 근처 부두, 17:00) */
const week3Scene008Lines = [
  { id: 'line-001', speaker: '', text: 'Fish Market 근처 부두.\n오후 5시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '이거 이제 진짜 무서워요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-003', speaker: '영우', text: '그래서 하는 말인데, 이제 경찰에 말하는 게 어때.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '뭐라고요?\nM.K.가 우리 여행마다 나온다고요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-005', speaker: '영우', text: '그거 말고 뭐라고 설명해.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-006', speaker: '지수', text: '증거라고는 이니셜 몇 개랑 맞춤 제작 열쇠 하나예요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-007', speaker: '영우', text: '그래도 이건 우리 동선을 안다는 거잖아.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-008', speaker: '지수', text: '그러니까 제가 더 파야죠.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-009', speaker: '영우', text: '지수야, 이거 게임 아니야.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-010', speaker: '지수', text: '누가 게임이래요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-011', speaker: '영우', text: '요즘 계속 이 얘기만 하잖아.\n나는 그냥 지수가 걱정돼서 그래.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-012', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-013', speaker: '지수', text: '저도 알아요.\n근데 여기까지 와서 그냥 덮을 순 없잖아요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-014', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-015', speaker: '', text: '둘 다 한동안 말이 없었다.', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 09 「고래 투어 — 화해」
   Dialogue Set: dialogue-week3-scene009
   Scene: week3-scene-009 (Whale Watching Boat, 다음날 09:30)
   브리프대로 말보다 행동으로 화해하는 파트 — 갈등을 억지로 봉합하는 대사 없이 지나간다. */
const week3Scene009Lines = [
  { id: 'line-001', speaker: '', text: 'Whale Watching 보트.\n다음날 오전 9시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '어젯밤의 어색함이 아직 남은 채로, 둘은 나란히 뱃머리에 서 있었다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '춥지 않아?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '지수', text: '괜찮아요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-005', speaker: '', text: '멀리서 물기둥이 솟아오른다.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '어! 저기!', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '지수', text: '영우야, 여기 와봐요!\n빨리!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '', text: '지수가 반사적으로 영우의 손을 잡아끈다.', characterId: null },
  { id: 'line-009', speaker: '영우', text: '와...', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-010', speaker: '', text: '고래가 수면 위로 몸을 반쯤 드러냈다 사라졌다.', characterId: null },
  { id: 'line-011', speaker: '지수', text: '봤어요?? 봤어요??', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '영우', text: '봤어, 봤어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-013', speaker: '', text: '둘은 한참을 그렇게 손을 잡은 채 바다만 바라봤다.\n사과의 말은 필요 없었다.', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 10 「첫 직접 연락」
   Dialogue Set: dialogue-week3-scene010
   Scene: week3-scene-010 (Whale Watching Boat, 11:00) */
const week3Scene010Lines = [
  { id: 'line-001', speaker: '', text: 'Whale Watching 보트, 갑판.\n오전 11시.', characterId: null },
  { id: 'line-002', speaker: '', text: '지수의 폰이 짧게 진동한다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '어?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '', text: '[ 발신: M.K. ]', characterId: null },
  { id: 'line-006', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '뭐야, 왜 그래.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '이거 봐요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '', text: '[ You are looking for the wrong person. ]', characterId: null },
  { id: 'line-010', speaker: '영우', text: '...\n뭐라는 거야 이게.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '틀린 사람을 찾고 있다는 거잖아요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '영우', text: '들켰다는 거 아니야?\n그래서 다른 사람 보라고 흔드는 거고.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '지수', text: '그럴 수도 있죠.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-014', speaker: '지수', text: '근데 미카가 자기 자신 아니라고 할 이유가 있나?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-015', speaker: '영우', text: '당연히 있지, 들키기 싫으니까.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-016', speaker: '지수', text: '...\n그런가.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-017', speaker: '지수', text: '일단 이 메시지, 어디서 온 건지 추적해볼게요.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 3 · SCENE 11 「발신 흔적」
   Dialogue Set: dialogue-week3-scene011
   Scene: week3-scene-011 (숙소, 20:00)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   네트워크 경로 단순 추적 minigame, week3-scene-011-minigame. */
const week3Scene011Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 8시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '메시지 발신 경로, 한번 따라가볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '영우', text: '그런 것도 할 수 있어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '완전히는 안 되겠지만, 중간에 거쳐간 경로 정도는요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '검색해보니까 이런 거 관련 공개 툴이 있긴 하더라.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '한번 넣어볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '', text: '지수가 발신 경로를 한 단계씩 추적하기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 12 「Aquarium — 에블린 쇼」
   Dialogue Set: dialogue-week3-scene012
   Scene: week3-scene-012 (SEA LIFE Sydney Aquarium, 다음날 14:00) */
const week3Scene012Lines = [
  { id: 'line-001', speaker: '', text: 'SEA LIFE Sydney Aquarium.\n다음날 오후 2시.', characterId: null },
  { id: 'line-002', speaker: '', text: '추적 끝에 나온 중간 릴레이 노드 하나가\n과거 미카가 썼던 보안 서비스와 일치했다.', characterId: null },
  { id: 'line-003', speaker: '', text: '그 서비스를 소개해준 사람이 지금 이 수족관에서 일한다는 정보를 얻었다.', characterId: null },
  { id: 'line-004', speaker: '지수', text: '에블린 쇼 님 맞으실까요?', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-005', speaker: '에블린 쇼', text: '네, 맞는데요.\n무슨 일이시죠?', characterId: 'evelyn', expression: 'neutral' },
  { id: 'line-006', speaker: '영우', text: '익명 의뢰 중개 쪽 일 하신 적 있으시다고 들어서요.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '에블린 쇼', text: '...\n누구한테 들으셨어요?', characterId: 'evelyn', expression: 'suspicious' },
  { id: 'line-008', speaker: '지수', text: '혹시 M.K.라는 이름, 들어보신 적 있으세요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '에블린 쇼', text: '...', characterId: 'evelyn', pauseBeforeMs: 500, expression: 'neutral' },
  { id: 'line-010', speaker: '에블린 쇼', text: 'M.K.?\n그 여자, 직접 본 적 있어요.', characterId: 'evelyn', expression: 'serious' },
  { id: 'line-011', speaker: '지수', text: '...\n미카 코바치요?', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-012', speaker: '에블린 쇼', text: '...', characterId: 'evelyn', pauseBeforeMs: 500, expression: 'neutral' },
  { id: 'line-013', speaker: '영우', text: '왜 대답을 안 하세요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-014', speaker: '에블린 쇼', text: '아니, 그냥.\n오랜만에 그 이름 들으니까.', characterId: 'evelyn', expression: 'neutral' },
  { id: 'line-015', speaker: '에블린 쇼', text: '자리 좀 옮겨서 얘기할까요.', characterId: 'evelyn', expression: 'neutral' },
];

/* OPERATION MK — WEEK 3 · SCENE 13 「가짜 목격 증언」
   Dialogue Set: dialogue-week3-scene013
   Scene: week3-scene-013 (SEA LIFE Sydney Aquarium 카페, 14:20)
   브리프 명시 사항: 에블린은 실제로 얼굴을 선명하게 본 적이 없다는 사실은
   여기서 밝히지 않는다 — 4주차에 가서야 드러난다. */
const week3Scene013Lines = [
  { id: 'line-001', speaker: '', text: 'Aquarium 내 카페.\n오후 2시 20분.', characterId: null },
  { id: 'line-002', speaker: '에블린 쇼', text: '몇 년 전에 딱 한 번 마주친 적 있어요.', characterId: 'evelyn', expression: 'neutral' },
  { id: 'line-003', speaker: '지수', text: '어떤 사람이었어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '에블린 쇼', text: '검은 재킷 입고 있었고, 동유럽 억양이 있었어요.', characterId: 'evelyn', expression: 'serious' },
  { id: 'line-005', speaker: '에블린 쇼', text: '은색 케이스를 항상 들고 다녔고, 왼손에 시계를 찼었어요.', characterId: 'evelyn', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-007', speaker: '지수', text: '검은 재킷, 은색 케이스, 왼손 시계.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '지수', text: '지금까지 저희가 본 사진이랑 완전히 똑같아요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '에블린 쇼', text: '그렇겠죠.\nM.K.면 항상 그런 모습이었으니까.', characterId: 'evelyn', expression: 'neutral' },
  { id: 'line-010', speaker: '영우', text: '확실한 거죠?\n직접 보셨다는 거.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '에블린 쇼', text: '네, 확실해요.', characterId: 'evelyn', expression: 'neutral' },
  { id: 'line-012', speaker: '지수', text: '이제 진짜 다 맞아떨어지네요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '에블린 쇼', text: '조심하세요.\n그 사람 근처엔 안 가는 게 나아요.', characterId: 'evelyn', expression: 'suspicious' },
  { id: 'line-014', speaker: '', text: '지수는 그 말을 오래 곱씹게 될 줄, 아직 몰랐다.', characterId: null },
];

/* OPERATION MK — WEEK 3 · SCENE 14 「열쇠의 귀환」
   Dialogue Set: dialogue-week3-scene014
   Scene: week3-scene-014 (Sydney Accommodation, 22:00)
   Closes out Week 3's main weekend arc — 3주차 평일 미니씬(W3-D1~D5)은 별도로
   추가될 예정. No nextSceneId; ends on the "NOT WHO. WHY." note per brief §8. */
const week3Scene014Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 10시.', characterId: null },
  { id: 'line-002', speaker: '', text: '방으로 들어온 두 사람은 협탁 위를 보고 그대로 멈춰 섰다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-004', speaker: '영우', text: '이거.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-005', speaker: '', text: '협탁 한가운데, 사라졌던 열쇠가 돌아와 있었다.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '문은 분명 잠겨 있었잖아요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-008', speaker: '', text: '열쇠 옆에 작은 종이 한 장이 놓여 있다.', characterId: null },
  { id: 'line-009', speaker: '', text: '[ NOT WHO. ]\n[ WHY. ]', characterId: null },
  { id: 'line-010', speaker: '', text: '하단에 작은 서명.', characterId: null },
  { id: 'line-011', speaker: '', text: '[ M.K. ]', characterId: null },
  { id: 'line-012', speaker: '지수', text: '...\n미카가 우리 갖고 노는 거야.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-013', speaker: '영우', text: '아니면 진짜로 하고 싶은 말이 있는 걸 수도 있고.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '...\n어느 쪽이든, 다음 주엔 끝내야겠어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '', text: '지수의 3주차는,\nWHY라는 질문 하나를 남기고 저물었다.', characterId: null },
];

// Registry of testable Week 3 scenes — /dev/week3 lists these, each linking
// to /dev/game/?scene=<id>. Covers only the 3주차 main weekend arc
// (W3-S01~S14, "사라진 원본 열쇠") — 3주차 평일 미니씬(W3-D1~D5)은 아직 미구현.
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week0Scenes.
const week3Scenes = [
  {
    id: 'week3-scene-001',
    order: 1,
    name: '숙소 — 지금까지 정리',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '09:00',
    lines: week3Scene001Lines,
  },
  {
    id: 'week3-scene-002',
    order: 2,
    name: 'Bondi — 그냥 놀자 · 황동 열쇠 실종',
    location: 'Bondi Beach',
    introLabel: 'BONDI BEACH',
    time: '11:00',
    // Merged week3-scene-002~004 (all Bondi Beach, back to back). Hands off
    // into the (not yet built) 동선 재구성 minigame — see MINIGAME_ROUTES in
    // game/index.html. Falls back to a "MINIGAME START" placeholder overlay
    // until that route exists.
    lines: mergeLines(week3Scene002Lines, week3Scene003Lines, week3Scene004Lines),
    nextSceneId: 'week3-scene-004-minigame',
  },
  {
    id: 'week3-scene-005',
    order: 3,
    name: '사진 속 검은 재킷',
    location: 'Bondi Beach',
    introLabel: 'BONDI BEACH',
    time: '13:10',
    lines: week3Scene005Lines,
    // Hands off into the (not yet built) 실루엣 비교 minigame — same
    // placeholder fallback as above.
    nextSceneId: 'week3-scene-005-minigame',
  },
  {
    id: 'week3-scene-006',
    order: 4,
    name: 'Fish Market — 노아 리 · 지수와 영우의 갈등',
    location: 'Sydney Fish Market',
    introLabel: 'FISH MARKET',
    time: '16:00',
    // Merged week3-scene-006~008 (all Sydney Fish Market, back to back).
    lines: mergeLines(week3Scene006Lines, week3Scene007Lines, week3Scene008Lines),
  },
  {
    id: 'week3-scene-009',
    order: 5,
    name: '고래 투어 — 화해 · 첫 직접 연락',
    location: 'Whale Watching Boat',
    introLabel: 'WHALE WATCHING',
    time: '09:30',
    // Merged week3-scene-009 + 010 (both Whale Watching Boat, back to back).
    lines: mergeLines(week3Scene009Lines, week3Scene010Lines),
  },
  {
    id: 'week3-scene-011',
    order: 6,
    name: '발신 흔적',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:00',
    lines: week3Scene011Lines,
    // Hands off into the (not yet built) 네트워크 경로 추적 minigame — same
    // placeholder fallback as above.
    nextSceneId: 'week3-scene-011-minigame',
  },
  {
    id: 'week3-scene-012',
    order: 7,
    name: 'Aquarium — 에블린 쇼 · 가짜 목격 증언',
    location: 'SEA LIFE Sydney Aquarium',
    introLabel: 'AQUARIUM',
    time: '14:00',
    // Merged week3-scene-012 + 013 (both SEA LIFE Sydney Aquarium, back to
    // back).
    lines: mergeLines(week3Scene012Lines, week3Scene013Lines),
  },
  {
    id: 'week3-scene-014',
    order: 8,
    name: '열쇠의 귀환',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '22:00',
    lines: week3Scene014Lines,
  },
];

/* OPERATION MK — WEEK 4 · SCENE 01 「마지막 주 아침」
   Dialogue Set: dialogue-week4-scene001
   Scene: week4-scene-001 (Sydney Accommodation, 09:00) */
const week4Scene001Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n오전 9시.', characterId: null },
  { id: 'line-002', speaker: '', text: '마지막 주, 지수는 벽에 붙여둔 모든 자료를 다시 펼쳤다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '황동 열쇠, 봉투, 문의 메일, 중개 계정, 사진 문의, 맞춤 제작, 발신 흔적, 목격담.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '전부 한 방향을 가리키고 있어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '웅.\nM.K. = Mika Kovac.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '그럼 이제 남은 건.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '왜 하필 우리한테 접근했느냐, 그거예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '영우', text: '위치는 The Rocks 쪽으로 좁혀졌었지.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-009', speaker: '지수', text: '보관함, 픽업 지점, 릴레이 접속.\n전부 그 동네예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '영우', text: '그럼 오늘 거기부터 가보자.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-011', speaker: '지수', text: '이번 주엔 끝내요, 진짜로.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 02 「The Rocks 이동」
   Dialogue Set: dialogue-week4-scene002
   Scene: week4-scene-002 (The Rocks 이동 중, 10:00) */
const week4Scene002Lines = [
  { id: 'line-001', speaker: '', text: 'The Rocks 이동 중.\n오전 10시.', characterId: null },
  { id: 'line-002', speaker: '', text: '좁은 골목과 오래된 사암 건물들이 늘어선 동네였다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '여기 진짜 오래된 동네네요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '숨기 좋은 동네지, 뭘 하든.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '보관함 위치부터 가볼까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '웅, 지도에 표시해둔 데로.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-007', speaker: '', text: '둘은 말없이 걸었다.\n이전 세 번의 사건과는 다른 긴장감이었다.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '떨려요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '영우', text: '조금.\n지수는?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '지수', text: '저도요.\n근데 여기까지 왔으니까.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 03 「첫 보관함」
   Dialogue Set: dialogue-week4-scene003
   Scene: week4-scene-003 (The Rocks 공용 보관함, 10:30)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   4자리 코드 추리 minigame, week4-scene-003-minigame. */
const week4Scene003Lines = [
  { id: 'line-001', speaker: '', text: 'The Rocks 공용 보관함 구역.\n오전 10시 30분.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '번호 자물쇠네.\n4자리.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-003', speaker: '지수', text: '단서가 될 만한 숫자들, 정리해볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: 'K-01 사건 날짜, K-01이라는 번호, 사진 파일 번호.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '조합해보면 뭔가 나올 것 같은데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-006', speaker: '', text: '지수가 지금까지 모은 숫자들을 하나씩 조합해보기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 4 · SCENE 04 「포렌식 작업실 흔적」
   Dialogue Set: dialogue-week4-scene004
   Scene: week4-scene-004 (폐업한 공유 작업실, 11:30) */
const week4Scene004Lines = [
  { id: 'line-001', speaker: '', text: '폐업한 공유 작업실.\n오전 11시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '보관함에서 나온 영수증 주소를 따라가니\n오래전에 문을 닫은 공유 작업실이 나왔다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '보관함 안엔 빈 USB 케이스랑 황동 가루,\n영수증뿐이었는데.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '영수증 수취인, M. KOVAC.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '관리인의 협조로 예전 대여 기록을 확인할 수 있었다.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '여기, 이 자리예요.\n미카가 실제로 썼던 좌석.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '', text: '자리 근처 서랍에서 오래된 외장 드라이브 하나가 나온다.', characterId: null },
  { id: 'line-008', speaker: '영우', text: '이거 열어봐도 될까?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '일단 열어봐요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: '안에는 SSD 이미지 파일과 단발성 의뢰 목록,\n그리고 폴더 하나가 있었다.', characterId: null },
  { id: 'line-011', speaker: '', text: '[ 폴더명: MK ]', characterId: null },
  { id: 'line-012', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-013', speaker: '영우', text: '...\n찾았다.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-014', speaker: '지수', text: '이 자리, 아직도 쓰는 사람이 있을까요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '', text: '그때, 작업실 입구에서 인기척이 들렸다.', characterId: null },
];

/* OPERATION MK — WEEK 4 · SCENE 05 「미카 코바치 등장」
   Dialogue Set: dialogue-week4-scene005
   Scene: week4-scene-005 (폐업한 공유 작업실, 11:35)
   첫 실물 대면 — 그녀는 도망치지 않는다. */
const week4Scene005Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n오전 11시 35분.', characterId: null },
  { id: 'line-002', speaker: '', text: '문 앞에 한 여자가 서 있었다.\n검은 재킷, 은색 케이스, 왼손의 시계.', characterId: null },
  { id: 'line-003', speaker: '미카 코바치', text: '생각보다 늦었네요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-005', speaker: '영우', text: '당신이...', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-006', speaker: '미카 코바치', text: '미카 코바치예요.\n이미 짐작하셨겠지만.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '도망 안 가요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-008', speaker: '미카 코바치', text: '왜요.\n딱히 도망갈 이유가 없는데.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-009', speaker: '미카 코바치', text: '열쇠, 아직 가지고 있죠?', characterId: 'mika', expression: 'neutral' },
  { id: 'line-010', speaker: '지수', text: '...\n네.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-011', speaker: '미카 코바치', text: '앉아서 얘기할까요.\n어차피 오늘 끝낼 거잖아요, 그쪽도.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 06 「지수의 추리 제시」
   Dialogue Set: dialogue-week4-scene006
   Scene: week4-scene-006 (폐업한 공유 작업실, 11:45)
   플레이어 확신 100% — 하지만 미카가 그대로 인정한다는 것 자체가
   최종 반전을 값싸지 않게 만드는 장치. */
const week4Scene006Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n오전 11시 45분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '처음부터 순서대로 말씀드릴게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '1주차, 황동 물건을 찾는 문의가 애드리언 콜한테 갔어요.\n발신인 Mika Kovac.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '레오 박이 그 일감을 받았고, 중개 계정은 MK_Consult였고요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '2주차, 한소라한테 사진 구매 문의가 갔어요.\n발신 M. Kovac, 메타데이터 작성자 MKOVAC.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '지수', text: '3주차, 제 열쇠는 맞춤 제작이었고\n주문 담당은 M. KOVAC이었어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '발신 경로 추적하니까 당신이 예전에 쓰던 보안 릴레이가 나왔고,\n그게 이 동네로 좁혀졌어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '그리고 방금, 이 자리에서 MK 폴더를 찾았어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-009', speaker: '지수', text: 'M.K.는 당신이야.\n미카 코바치.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: '잠깐 정적이 흘렀다.', characterId: null },
  { id: 'line-011', speaker: '미카 코바치', text: '맞아요.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 07 「가짜 진범 고백」
   Dialogue Set: dialogue-week4-scene007
   Scene: week4-scene-007 (폐업한 공유 작업실, 11:50)
   미카는 실제로 관여한 것들을 전부 인정한다 — 거짓 단서가 아니라 진짜
   연결 인물이었음을 확정하는 장면. */
const week4Scene007Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n오전 11시 50분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '전부 맞아요.\nMK 프로젝트 폴더, 제가 쓴 거예요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-003', speaker: '미카 코바치', text: '황동 물건 조사했고, 레오 씨 쪽 작업 흐름에도 관여했고요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-004', speaker: '미카 코바치', text: '한소라 씨한테 사진 문의도 보냈고,\n그쪽 열쇠 회수·촬영·반환도 제가 중개했어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-005', speaker: '미카 코바치', text: '메시지 일부도 제가 직접 전달했고요.\n"틀린 사람을 찾고 있다"는 것도요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-006', speaker: '영우', text: '그럼 그거 진짜 자기 자신 얘기 아니었어요?', characterId: 'youngwoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '미카 코바치', text: '아니었어요.\n제 얘기가 아니라.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-008', speaker: '지수', text: '그럼 끝났네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-009', speaker: '미카 코바치', text: '아뇨.', characterId: 'mika', expression: 'serious' },
  { id: 'line-010', speaker: '지수', text: '...\n뭐가 아니에요.\n다 인정했잖아요.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-011', speaker: '미카 코바치', text: '제가 한 일들은 다 맞아요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-012', speaker: '미카 코바치', text: '근데 그게 제가 다라는 뜻은 아니에요.', characterId: 'mika', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 08 「한 문장으로 붕괴」
   Dialogue Set: dialogue-week4-scene008
   Scene: week4-scene-008 (폐업한 공유 작업실, 11:55) */
const week4Scene008Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n오전 11시 55분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '난 내가 뭘 찾는지도 몰랐어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '무슨 소리예요.\nM.K.가 당신이라며.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-004', speaker: '미카 코바치', text: '내 이름도 M.K.죠.', characterId: 'mika', expression: 'serious' },
  { id: 'line-005', speaker: '미카 코바치', text: '그래서 처음엔 나도 그렇게 생각했어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '그게 무슨 말이에요, 처음엔이라니.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-007', speaker: '미카 코바치', text: '난 그 의뢰인을 한 번도 만난 적 없어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 600, expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: '잠깐만요.\n그럼 지금까지 그 문의들은 다 누가 보낸 거예요?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-010', speaker: '미카 코바치', text: '그걸 저도 몰라서 이러고 있는 거예요, 몇 달째.', characterId: 'mika', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 09 「미카의 진실」
   Dialogue Set: dialogue-week4-scene009
   Scene: week4-scene-009 (폐업한 공유 작업실, 12:05) */
const week4Scene009Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 5분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '몇 달 전부터 이상한 단발성 의뢰가 계속 들어왔어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-003', speaker: '미카 코바치', text: '매번 계정이 달랐고, 결제 수단도 달랐어요.\n근데 다 정상적으로 처리됐고요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '내용은요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '미카 코바치', text: '특정 황동 물건 사진 찾기, 특정 시간대 원본 사진 확보,\n특정 열쇠 촬영 후 반환, 특정 인물의 귀환 일정 확인.', characterId: 'mika', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '전부 작고 합법이거나 애매한 회색지대였네요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-007', speaker: '미카 코바치', text: '맞아요.\n근데 문장 습관이랑 목표가 이상하게 똑같았어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-008', speaker: '미카 코바치', text: '그래서 편의상 제 이니셜이랑 겹쳐서\n"MK 프로젝트"로 분류해둔 거예요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-009', speaker: '지수', text: '...\n그럼 M.K.가 당신을 가리키는 것도 맞고,', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-010', speaker: '지수', text: '당신 뒤에 있는 무언가를 가리키는 것도 맞다는 거예요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-011', speaker: '미카 코바치', text: '그런 것 같아요.', characterId: 'mika', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 10 「플레이어 추리의 재평가」
   Dialogue Set: dialogue-week4-scene010
   Scene: week4-scene-010 (폐업한 공유 작업실, 12:15)
   브리프의 핵심 감정 비트 — "속은 게 아니라 한 층 부족했을 뿐"이라는 걸
   대사로 직접 짚어준다. */
const week4Scene010Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 15분.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '지수야, 괜찮아?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '지수', text: '...\n모르겠어요.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-004', speaker: '지수', text: '근데 이상하게 속은 기분은 아니에요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-005', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '지금까지 본 증거들, 다 진짜였잖아요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '틀린 게 아니라 딱 한 층 부족했던 거예요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '미카 코바치', text: '정확해요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-009', speaker: '지수', text: '그럼 이제 물어볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '지수', text: '그 의뢰인, 진짜 목적이 뭐였어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '미카 코바치', text: '그건 저도 궁금해요, 진심으로.', characterId: 'mika', expression: 'serious' },
];

/* OPERATION MK — WEEK 4 · SCENE 11 「질문 전환」
   Dialogue Set: dialogue-week4-scene011
   Scene: week4-scene-011 (폐업한 공유 작업실, 12:20) */
const week4Scene011Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 20분.', characterId: null },
  { id: 'line-002', speaker: '', text: '지수가 3주차에 받았던 종이를 다시 꺼내 든다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '', text: '[ NOT WHO. ]\n[ WHY. ]', characterId: null },
  { id: 'line-004', speaker: '지수', text: '미카가 누군지는 맞았어.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '근데 얘가 말한 건 그게 아니었네.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '이거, 미카가 우리한테 남긴 거잖아.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-007', speaker: '미카 코바치', text: '...\n네, 제가 남긴 거 맞아요.', characterId: 'mika', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'line-008', speaker: '미카 코바치', text: '누군지는 이미 알려드린 셈이니까.\n다음 질문으로 넘어가시라고요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-009', speaker: '지수', text: '왜 M.K.는 계속 무언가를 찾았을까요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '미카 코바치', text: '그거, 같이 다시 짚어볼래요?\n제가 처리했던 의뢰들 기준으로.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 12 「세 사건 재해석」
   Dialogue Set: dialogue-week4-scene012
   Scene: week4-scene-012 (폐업한 공유 작업실, 12:30) */
const week4Scene012Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 30분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '1주차 K-01, 그건 도난을 원한 게 아니었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-003', speaker: '미카 코바치', text: '비슷한 황동 물건이 맞는지 확인하고, 사진만 확보하면 되는 일이었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '근데 레오 씨가 욕심을 냈고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '미카 코바치', text: '맞아요.\n그쪽 사정으로 일이 커진 거예요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '2주차 메모리카드는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '미카 코바치', text: '기억 조작 같은 건 필요 없었어요.\n그냥 특정 시간대 원본 사진이 필요했을 뿐이에요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-008', speaker: '영우', text: '한소라 씨가 자기 사정 때문에 범죄를 만든 거고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-009', speaker: '미카 코바치', text: '네.\n그것도 제 의도랑은 상관없는 일이었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-010', speaker: '지수', text: '제 열쇠는요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-011', speaker: '미카 코바치', text: '촬영, 확인, 반환.\n그게 전부였어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-012', speaker: '미카 코바치', text: '그래서 다른 귀중품은 손도 안 댄 거고요.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 13 「M.K.의 목적어」
   Dialogue Set: dialogue-week4-scene013
   Scene: week4-scene-013 (폐업한 공유 작업실, 12:40) */
const week4Scene013Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 40분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '의뢰문들, 지금 다시 보면 이상한 게 하나 있어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-003', speaker: '지수', text: '뭐가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '미카 코바치', text: '뭘 찾는지, 누굴 기다리는지는 한 번도 명확히 안 써 있어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '그럼 뭐가 써 있는데요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '미카 코바치', text: '돌아오다, 집, 기다리다, 찾다.\n이 네 단어만 계속 반복돼요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'blank' },
  { id: 'line-008', speaker: '지수', text: '그거, 사람한테 쓰는 말이 아니라\n뭔가 기다리는 존재가 쓰는 말 같은데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '미카 코바치', text: '이건 사람 한 명의 문체라기엔 이상해요.\n제가 처음부터 그렇게 생각했어요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-010', speaker: '영우', text: '...\n지수야.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '왜요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '아니야, 아무것도.', characterId: 'youngwoo', expression: 'blank' },
];

/* OPERATION MK — WEEK 4 · SCENE 14 「무깽이 연결」
   Dialogue Set: dialogue-week4-scene014
   Scene: week4-scene-014 (폐업한 공유 작업실, 12:50)
   브리프의 "무깽이 리마인드 #5이자 첫 강한 연결" — 여기서 처음으로
   무깽이가 미스터리와 접촉한다. */
const week4Scene014Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 50분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '이것도 보여드릴게요.\n의뢰 로그에 첨부돼 있던 이미지 아이콘이에요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-003', speaker: '', text: '작은 발바닥 모양의 아이콘이 화면에 뜬다.', characterId: null },
  { id: 'line-004', speaker: '지수', text: '...\n어?', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-005', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '이거 좀 닮지 않았어요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '', text: '지수가 폰에서 무깽이 옷 위에 누운 사진, 오래된 발바닥 사진을 함께 띄운다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '설마.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-009', speaker: '지수', text: '...\n무깽이?', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-010', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 500, expression: 'blank' },
  { id: 'line-011', speaker: '미카 코바치', text: '...\n왜 그러세요?', characterId: 'mika', expression: 'suspicious' },
  { id: 'line-012', speaker: '영우', text: '아니, 잠깐.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-013', speaker: '영우', text: '이 이름...\n내가 쓴 적 있어.', characterId: 'youngwoo', expression: 'blank' },
];

/* OPERATION MK — WEEK 4 · SCENE 15 「최종 정체」
   Dialogue Set: dialogue-week4-scene015
   Scene: week4-scene-015 (폐업한 공유 작업실, 13:00)
   영우가 직접 설명하는 최종 캐논 — 무깽이 관련 자동화 계정이
   여러 실행자를 거치며 남긴 동일한 작업 패턴. */
const week4Scene015Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 1시.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '무슨 소리예요, 쓴 적 있다니.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-003', speaker: '영우', text: '...\n한국에서, 지수 만나기 전에.', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-004', speaker: '영우', text: '무깽이 집 상태 확인하고, 사진 정리하고,\n루틴 자동화하려고 작은 계정 하나 만들었었어.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '영우', text: '필요하면 사람한테 작은 일 맡기는 기능도 넣었고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-006', speaker: '지수', text: '...\n그 계정 이름이.', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '이니셜로 대충 지었었어.\n그러고 완전히 잊고 있었고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-008', speaker: '미카 코바치', text: '...\n그게 사실이면, 설명이 되네요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-009', speaker: '미카 코바치', text: '계정마다 다 달랐던 이유, 근데 문체는 똑같았던 이유.', characterId: 'mika', expression: 'serious' },
  { id: 'line-010', speaker: '미카 코바치', text: '사람이 하나하나 지시한 게 아니라\n오래된 자동화 계정이 여러 서비스랑 사람을 거치면서\n같은 패턴을 반복한 거예요.', characterId: 'mika', expression: 'serious' },
  { id: 'line-011', speaker: '지수', text: '그럼 저는요.\n저 지금까지 뭘 쫓은 거예요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '미카 코바치', text: '전부 다 맞았어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-013', speaker: '미카 코바치', text: 'M.K.는 미카 코바치이기도 하고,\nMissing Key이기도 하고,', characterId: 'mika', expression: 'neutral' },
  { id: 'line-014', speaker: '미카 코바치', text: '그쪽 고양이랑 연결된 이름이기도 해요.\n셋 다 참이에요.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 16 「감정 반전」
   Dialogue Set: dialogue-week4-scene016
   Scene: week4-scene-016 (폐업한 공유 작업실, 13:10)
   브리프 지정 순서: 황당함 → 안 믿김 → 웃음 → 영우 타박 → 뒤늦은 뭉클함. */
const week4Scene016Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 1시 10분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '잠깐.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-003', speaker: '지수', text: '그러니까 내가 4주 동안 쫓은 M.K.가...', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-004', speaker: '영우', text: '미카도 맞긴 한데...', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '지수', text: '그 말 하지 마.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-006', speaker: '', text: '잠깐 정적이 흘렀다.', characterId: null },
  { id: 'line-007', speaker: '지수', text: '...\n무깽이 때문이라고?', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'shocked' },
  { id: 'line-008', speaker: '영우', text: '어...\n결과적으로는.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-009', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 500, expression: 'blank' },
  { id: 'line-010', speaker: '지수', text: 'ㅋㅋㅋㅋㅋㅋ 미친.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-011', speaker: '영우', text: '...\n왜 웃어.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '안 웃게 생겼어요, 이게?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-013', speaker: '지수', text: '4주 내내 탐정 놀이 했는데 범인이 우리 집 고양이 계정이라니.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '영우', text: '내 계정이었지, 정확히는.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '그러니까 당신 탓이잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '영우', text: '...\n미안.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-017', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'soft' },
  { id: 'line-018', speaker: '지수', text: '근데 생각해보면, 그거 다 무깽이 잘 있나 걱정돼서 만든 거잖아요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-019', speaker: '영우', text: '...\n그렇지.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'soft' },
  { id: 'line-020', speaker: '지수', text: '바보같이 다정하네, 진짜.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-021', speaker: '미카 코바치', text: '...\n두 분, 얘기 다 끝나셨으면 저는 이만.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-022', speaker: '지수', text: '아, 죄송해요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-023', speaker: '미카 코바치', text: '아니에요.\n오히려 저도 후련하네요, 몇 달 만에.', characterId: 'mika', expression: 'neutral' },
];

/* OPERATION MK — WEEK 4 · SCENE 17 「마지막 영상」
   Dialogue Set: dialogue-week4-scene017
   Scene: week4-scene-017 (Sydney Accommodation, 20:00)
   거창한 편집 없이 평범한 무깽이 영상 하나로 끝맺는다. */
const week4Scene017Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 8시.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '가족한테 영상통화 걸어볼까.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '지수', text: '웅웅, 좋아요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '', text: '화면 너머로 무깽이가 잠깐 비쳤다.', characterId: null },
  { id: 'line-005', speaker: '', text: '하품을 하고, 카메라를 완전히 무시하고,\n지수 옷 위에 가서 앉는다.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '...\nㅋㅋㅋㅋ 쟤 진짜 아무것도 모르네.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-007', speaker: '영우', text: '알 리가 없지.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-008', speaker: '지수', text: '4주 내내 이 정도로 평범할 줄이야.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009', speaker: '영우', text: '오히려 그래서 다행인 것 같아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '지수', text: '웅.\n너무 거창했으면 더 이상했을 듯.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-011', speaker: '', text: '거대했던 미스터리의 끝이,\n너무 평범해서 오히려 마음이 놓였다.', characterId: null },
];

/* OPERATION MK — WEEK 4 · SCENE 18 「다음 날 체크아웃」
   Dialogue Set: dialogue-week4-scene018
   Scene: week4-scene-018 (Sydney Accommodation, 다음날 10:00) */
const week4Scene018Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n다음날 오전 10시.', characterId: null },
  { id: 'line-002', speaker: '', text: '캐리어를 정리하며 둘은 짐을 챙겼다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '이제 진짜 끝난 거지?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '아마도?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '지수', text: '아마도 하지 마.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-006', speaker: '영우', text: 'ㅋㅋㅋ 알겠어, 끝났어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-007', speaker: '지수', text: '됐어요, 이미 늦었어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '영우', text: '그 열쇠는 어떻게 할 거야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '기념품이죠, 뭐.\n4주짜리 기념품.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '무거운 기념품이네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '그만큼 값진 거죠.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '', text: '둘은 캐리어를 끌고 방을 나섰다.', characterId: null },
];

/* OPERATION MK — WEEK 4 · SCENE 19 「12초」
   Dialogue Set: dialogue-week4-scene019
   Scene: week4-scene-019 (Sydney Accommodation, 빈 방)
   엔딩 컷 — 0주차부터 있던 녹슨 나사가 떨어지며 K-02가 등장한다.
   No nextSceneId; ends 4주차 and the whole 시즌. */
const week4Scene019Lines = [
  { id: 'line-001', speaker: '', text: '숙소, 빈 방.', characterId: null },
  { id: 'line-002', speaker: '', text: '문이 닫힌다.', characterId: null },
  { id: 'line-003', speaker: '', text: '정적.', characterId: null },
  { id: 'line-004', speaker: '', text: '환풍기가 멈춘다.', characterId: null },
  { id: 'line-005', speaker: '', text: '0주차부터 있던 녹슨 나사가 떨어진다.', characterId: null },
  { id: 'line-006', speaker: '', text: '작은 금속음.', characterId: null },
  { id: 'line-007', speaker: '', text: '환풍구 안쪽에서, 작은 황동 열쇠 하나가 굴러떨어진다.', characterId: null },
  { id: 'line-008', speaker: '', text: '태그.', characterId: null },
  { id: 'line-009', speaker: '', text: '[ K-02 ]', characterId: null },
  { id: 'line-010', speaker: '', text: '컷.', characterId: null },
];

// Registry of testable Week 4 scenes — /dev/week4 lists these, each linking
// to /dev/game/?scene=<id>. Covers only the 4주차 main arc (W4-S01~S19,
// "M.K.는 미카 코바치인가" + NOT WHO, WHY 최종부) — 4주차 평일 미니씬
// (W4-D1~D5)은 아직 미구현.
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week0Scenes. The Former Shared Workspace confrontation (원래
// week4-scene-004~016, 13 beats) never leaves that one room, so it's now a
// single long entry — a not-yet-built minigame never interrupts it.
const week4Scenes = [
  {
    id: 'week4-scene-001',
    order: 1,
    name: '마지막 주 아침',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '09:00',
    lines: week4Scene001Lines,
  },
  {
    id: 'week4-scene-002',
    order: 2,
    name: 'The Rocks 이동 · 첫 보관함',
    location: 'The Rocks',
    introLabel: 'THE ROCKS',
    time: '10:00',
    // Merged week4-scene-002 + 003 (both The Rocks, back to back). Hands off
    // into the (not yet built) 4자리 코드 추리 minigame — see
    // MINIGAME_ROUTES in game/index.html. Falls back to a "MINIGAME START"
    // placeholder overlay until that route exists.
    lines: mergeLines(week4Scene002Lines, week4Scene003Lines),
    nextSceneId: 'week4-scene-003-minigame',
  },
  {
    id: 'week4-scene-004',
    order: 3,
    name: '포렌식 작업실 — 미카 코바치와의 대면',
    location: 'Former Shared Workspace',
    introLabel: 'THE ROCKS',
    time: '11:30',
    // Merged week4-scene-004~016 (all Former Shared Workspace, back to
    // back) — 포렌식 흔적 발견부터 미카 등장, 지수의 추리, 가짜 진범 붕괴,
    // 미카의 진실, 최종 정체 공개, 감정 반전까지 전부 이 방을 벗어나지 않는다.
    lines: mergeLines(
      week4Scene004Lines, week4Scene005Lines, week4Scene006Lines, week4Scene007Lines,
      week4Scene008Lines, week4Scene009Lines, week4Scene010Lines, week4Scene011Lines,
      week4Scene012Lines, week4Scene013Lines, week4Scene014Lines, week4Scene015Lines,
      week4Scene016Lines,
    ),
  },
  {
    id: 'week4-scene-017',
    order: 4,
    name: '마지막 영상 · 체크아웃 · 12초',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:00',
    // Merged week4-scene-017~019 (all Sydney Accommodation, back to back).
    lines: mergeLines(week4Scene017Lines, week4Scene018Lines, week4Scene019Lines),
  },
];

// Groups scene registries by week — 배경 DB (/dev/upload) lists scenes under
// their week here instead of hardcoding a single week's worth of scenes.
//
// /dev/upload's picker gets one extra pseudo-scene per room-search area
// (`roomHotspots` marks it as such) so a dev can upload that area's photo
// and mark its hotspots — /dev/week0's list reads week0Scenes directly, not
// weeks, so these stay invisible there and don't clutter the scene list.
const week0UploadScenes = week0Scenes.concat(roomSearchAreas.map(area => ({
  id: roomSearchAreaSceneId(area.id),
  name: `핸드폰찾기 · ${area.label}`,
  roomHotspots: area.hotspots,
})));
const weeks = [
  { id: 'week0', label: '0주차', scenes: week0UploadScenes },
  { id: 'week1', label: '1주차', scenes: week1Scenes },
  { id: 'week2', label: '2주차', scenes: week2Scenes },
  { id: 'week3', label: '3주차', scenes: week3Scenes },
  { id: 'week4', label: '4주차', scenes: week4Scenes },
];

// Combined lookup across every week's scenes — /dev/game resolves a
// requested ?scene= id against this instead of a single week's array, since
// a scene can belong to any week. Per-week test pages (/dev/week0 ~
// /dev/week4) still read their own week*Scenes array directly so their
// listing stays scoped to just that week.
const allScenes = week0Scenes.concat(week1Scenes).concat(week2Scenes).concat(week3Scenes).concat(week4Scenes);
