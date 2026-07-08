/* OPERATION MK — WEEK 0 · SCENE 01 v4 「진짜 왔네」
   Dialogue Set: dialogue-week0-scene001-v4
   Scene: week0-scene-001 (Sydney Airport Arrival Area, 09:30)
   Loaded into /dev/game for VN UX testing. */

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

// Pure stage-direction beats (no speaker) use characterId to say who, if
// anyone, stays on screen for that beat — keeps the portrait from flickering
// out and back in across a beat with no line of its own.
const week0Scene001Lines = [
  { id: 'line-001', speaker: '', text: '시드니 공항.\n오전 9시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '긴 비행 끝에 도착한 지수는\n도착 게이트 앞에서 같은 곳을 네 번째로 둘러보고 있었다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '아 진짜.\n어디 있는 거야 대체.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-004', speaker: '지수', text: '분명 바로 보인댔는데.\n그 바로가 대체 누구 기준이야.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-005', speaker: '지수', text: '쌤?\n저 도착했어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '설마\n아직도 집이에요…?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '영우', text: '지수야아 ㅎㅎㅎㅎ', characterId: null },
  { id: 'line-008', speaker: '지수', text: '...어?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: '여기여기 ㅎㅎㅎㅎㅎ', characterId: null },
  { id: 'line-010', speaker: '', text: '지수가 뒤를 돌아본다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '헐.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-012', speaker: '지수', text: '쌤!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-013', speaker: '영우', text: 'ㅎㅎㅎㅎㅎㅎ\n왜 이제 왔어 바부야', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '아니 내가 왜 이제 와!\n비행기가 이제 왔는데!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-015', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n맞네\n내가 잘못했네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-016', speaker: '지수', text: '아 뭐예요 시작부터,\n진짜.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-017', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n아 근데 진짜 왔네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '지수', text: '그러게.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'soft' },
  { id: 'line-019', speaker: '영우', text: '개신기하다', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-020', speaker: '지수', text: '뭐가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-021', speaker: '영우', text: '그냥\n맨날 폰으로만 보던 지수가\n진짜 여기 있자나', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-023', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n너무 조은데', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-024', speaker: '지수', text: '나도.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-025', speaker: '지수', text: '근데 잠깐.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '웅?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-027', speaker: '지수', text: '언제부터 여기 있었어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-028', speaker: '영우', text: '나?\n음...\n아까부터?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-029', speaker: '지수', text: '아까부터요?????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-030', speaker: '영우', text: '웅웅', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '지수', text: '아니\n근데 왜 말 안 했어요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-032', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 지수가 계속 찾고 있길래\n나도 모르게 보고 있었어', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-033', speaker: '지수', text: '와.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-034', speaker: '영우', text: '미안미안 ㅎㅎㅎㅎ\n근데 진짜 너무 열심히 찾더라', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-035', speaker: '지수', text: '아 당연히 찾죠!\n저 쌤 찾으러 온 건데!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-036', speaker: '영우', text: '아 그러네', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-037', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n생각해보니까 너무 당연한 말이네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-038', speaker: '지수', text: '진짜 얼탱.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-039', speaker: '지수', text: '아니 잠깐.\n이거 약간 그런 거 아니에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-040', speaker: '영우', text: '머가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-041', speaker: '지수', text: '“호주에 도착한 여자친구는\n남자친구를 몇 분 안에 찾을 수 있을까요?”', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-042', speaker: '지수', text: '이런 사회실험.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-043', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n사회실험은 뭐야 진짴ㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-044', speaker: '', text: '영우가 한참 웃는다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-045', speaker: '영우', text: '아니 근데\n그렇게 말하니까 내가 진짜 개이상한 사람이자나', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-046', speaker: '지수', text: '아니에요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-047', speaker: '영우', text: '아니야아', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-048', speaker: '지수', text: '확실해요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-049', speaker: '영우', text: '...', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-050', speaker: '영우', text: '한 80퍼 정도?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-051', speaker: '지수', text: '미친.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-052', speaker: '', text: '지수가 웃음을 터뜨린다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-053', speaker: '지수', text: '아 진짜.\n하나도 안 변했어 ㅋㅎㅋㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-054', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n왜\n실망했어?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-055', speaker: '', text: '지수가 잠깐 영우를 본다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-056', speaker: '지수', text: '아니.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-057', speaker: '지수', text: '다행이지.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-058', speaker: '영우', text: '엉?\n뭐가 다행이야', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-059', speaker: '지수', text: '몰라도 돼.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-060', speaker: '영우', text: '아니 말해놓고 왜 도망가아', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-061', speaker: '지수', text: '응.\n일부러.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-062', speaker: '영우', text: '아놔\n호주 오자마자 더 못돼졌네', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-063', speaker: '지수', text: '아 저 방금 도착했다니까요, 쌤.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-064', speaker: '지수', text: '그리고 이거 원래 쌤한테 배운 거거든요오?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-065', speaker: '영우', text: '내가 언제어', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-066', speaker: '지수', text: '지금도 하고 있잖아요오.\n사람 계속 뚫어져라 보고만 있기.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-067', speaker: '영우', text: '아니 그건', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-068', speaker: '영우', text: '반가워서 봤지', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-069', speaker: '영우', text: '진짜 왔구나 싶어서', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'soft' },
  { id: 'line-070', speaker: '', text: '지수 표정 변화.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-071', speaker: '지수', text: '...', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-072', speaker: '영우', text: '왜애', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-073', speaker: '지수', text: '아니이.\n갑자기 그런 말 하면 저 진짜 뭐라 그래요오.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-074', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n그냥 조으면 좋다고 하는 거지', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-075', speaker: '지수', text: '아 진짜아.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-076', speaker: '영우', text: '지수 그거 무겁지 않아?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-077', speaker: '지수', text: '뭐가요오?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-078', speaker: '영우', text: '캐리어\n줘봐 내가 들게', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-079', speaker: '지수', text: '오오.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-080', speaker: '지수', text: '잠깐만요, 잠깐만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-081', speaker: '영우', text: '왜왜', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-082', speaker: '지수', text: '이거 지금 당장 기록해야 돼.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-083', speaker: '영우', text: '뭘 또 기록해', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-084', speaker: '지수', text: '“2026년.\n서영우 씨.\n시드니 공항에서 여자친구 캐리어 자발적 운반.”', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-085', speaker: '지수', text: '이거 완전 역사적인 순간이잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-086', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아 그러면 안 들래', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-087', speaker: '지수', text: '아니 왜요!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-088', speaker: '영우', text: '부담스럽자나\n기록 남긴다며 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-089', speaker: '지수', text: '아니 그건 그거고오.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-090', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 “그건 그거고”는 뭐야', characterId: 'youngwoo', pauseBeforeMs: 200, expression: 'happy' },
  { id: 'line-091', speaker: '지수', text: '...', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-092', speaker: '영우', text: '아 너무 웃기네 진짜', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-093', speaker: '지수', text: '아 됐어요오.\n그냥 들어주세요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-094', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n갑자기 공손해졌네', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-095', speaker: '지수', text: '쌤이잖아요오.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-096', speaker: '지수', text: '내 사람한테는 정성 다해야죠.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-097', speaker: '영우', text: '아...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-098', speaker: '영우', text: '그렇게 말하면 내가 뭐라 하냐', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-099', speaker: '지수', text: '그치이?\n내가 이겼다!', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-100', speaker: '영우', text: '이게 언제부터 승부였엌ㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-101', speaker: '지수', text: '방금부터요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-102', speaker: '영우', text: '규칙도 없이?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-103', speaker: '지수', text: '응.\n내가 만들 거야아.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-104', speaker: '영우', text: '아 진짜 지수답다', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-105', speaker: '지수', text: '그거 칭찬이에요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-106', speaker: '영우', text: '웅웅\n개칭찬', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-107', speaker: '지수', text: '흠.\n인정, 인정.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-108', speaker: '', text: '둘이 걷기 시작한다.\n공항 배경음이 약간 줄어든다.', characterId: null },
  { id: 'line-109', speaker: '지수', text: '근데 쌤.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-110', speaker: '영우', text: '웅웅', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-111', speaker: '지수', text: '나 진짜 시드니 온 거 아직도 좀 이상해요오.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-112', speaker: '영우', text: '아 그래?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-113', speaker: '지수', text: '그냥...\n맨날 사진으로만 보던 데잖아요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-114', speaker: '지수', text: '오페라하우스 있고.\n하버브리지 있고.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-115', speaker: '지수', text: '그리고 거기에 영우가 있고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-116', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'happy' },
  { id: 'line-117', speaker: '지수', text: '그게 제일 이상해애.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-118', speaker: '영우', text: '나도 그래', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-119', speaker: '지수', text: '진짜아?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-120', speaker: '영우', text: '웅', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-121', speaker: '영우', text: '맨날 화면에 있던 지수가\n진짜 앞에 있으니까', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-122', speaker: '영우', text: '개조아', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-123', speaker: '지수', text: '나도 개조아.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'happy' },
  { id: 'line-124', speaker: '', text: '둘이 잠깐 웃는다.', characterId: null },
  { id: 'line-125', speaker: '지수', text: '근데 쌤.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-126', speaker: '영우', text: '웅?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-127', speaker: '지수', text: '생각해보니까 이거 좀 이상한데에.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-128', speaker: '영우', text: '머가 또', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-129', speaker: '지수', text: '쌤이 너무 정상적이라니까요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-130', speaker: '영우', text: '아니 그게 무슨 말이야', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-131', speaker: '지수', text: '아니 잠깐, 봐봐요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-132', speaker: '지수', text: '공항 마중.\n캐리어 들어줌.\n밥.\n숙소.\n내일부터 관광.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-133', speaker: '지수', text: '이거 봐, 너무 정상적이잖아요오.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-134', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n내가 정상적이면 왜 수상한데', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-135', speaker: '지수', text: '쌤이니까요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-136', speaker: '영우', text: '아니 설명이 하나도 안 됐자나', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-137', speaker: '지수', text: '저한텐 돼요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-138', speaker: '영우', text: '아놔 진짜', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-139', speaker: '지수', text: '그래서 진짜 뭐 없어요오?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-140', speaker: '영우', text: '뭐가 없어', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-141', speaker: '지수', text: '뭐 준비한 거.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-142', speaker: '영우', text: '밥 준비했지', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-143', speaker: '지수', text: '...', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-144', speaker: '영우', text: '배 안 고파?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-145', speaker: '지수', text: '고프긴 한데.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-146', speaker: '영우', text: '그치\n일단 우리 지수 밥부터 먹자', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-147', speaker: '지수', text: '아니 말 돌리지 마아.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-148', speaker: '영우', text: '안 돌렸어어\n진짜 배고플 것 같아서 그러지', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-149', speaker: '지수', text: '쌤.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-150', speaker: '영우', text: '네에', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-151', speaker: '지수', text: '방금 존댓말 쓴 거 더 수상해요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-152', speaker: '영우', text: '아', characterId: 'youngwoo', pauseBeforeMs: 200, expression: 'blank' },
  { id: 'line-153', speaker: '영우', text: '망했네', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-154', speaker: '', text: '지수가 웃음을 터뜨린다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-155', speaker: '지수', text: '아 진짜아.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-156', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 왜 이렇게 눈치가 빨라', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-157', speaker: '', text: '지수 표정 변화.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'smirk' },
  { id: 'line-158', speaker: '지수', text: '봐.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-159', speaker: '영우', text: '아니', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-160', speaker: '지수', text: '방금 인정했어어.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-161', speaker: '영우', text: '아니아니아니', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-162', speaker: '지수', text: '잡았다!', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-163', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 진짜 이게 왜 이렇게 돼', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-164', speaker: '지수', text: '영우야.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-165', speaker: '지수', text: '너 진짜 뭐 준비했지?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-166', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-167', speaker: '영우', text: '일단 밥 먹자', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-168', speaker: '지수', text: '미친.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-169', speaker: '', text: '둘 다 웃음을 터뜨린다.', characterId: null },
  { id: 'line-170', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 진짜 배고프자나', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-171', speaker: '지수', text: '됐어요.\n일단 밥 먹어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-172', speaker: '영우', text: '웅웅\n가자아', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-173', speaker: '지수', text: '근데 저 안 속았거든요오.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-174', speaker: '영우', text: '뭘 안 속아', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-175', speaker: '지수', text: '몰라요.\n아직은.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-176', speaker: '지수', text: '근데 쌤 뭔가 있는 건 확실히 알아요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-177', speaker: '영우', text: '와', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-178', speaker: '영우', text: '진짜 무섭다 우리 지수', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-179', speaker: '지수', text: '그럼 잘해요.\n들키지 말고.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-180', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n알겠습니다', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-181', speaker: '', text: '지수의 첫날은,\n아직 평범한 여행에 가까웠다.', characterId: null }
];

/* OPERATION MK — WEEK 0 · SCENE 2-1 「진짜 같이 있네」
   Dialogue Set: dialogue-week0-scene002-1
   Scene: week0-scene-002-1 (Sydney Accommodation, 20:18)
   Ends on a MINIGAME START beat — nextSceneId hands off to the (not yet
   built) point-and-click phone-hunt scene, week0-scene-002-2. */
const week0Scene002_1Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n오후 8시 18분.', characterId: null },
  { id: 'line-002', speaker: '', text: '공항에서 나온 뒤,\n두 사람은 늦은 저녁을 간단히 먹고 숙소에 도착했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '와아.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-004', speaker: '지수', text: '잠깐만.\n여기 진짜 맞아요??', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-005', speaker: '영우', text: '웅웅.\n여기 맞아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '헐.\n아니 쌤, 이거 생각보다 너무 좋은데요??', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '그치그치 ㅎㅎㅎㅎㅎ\n사진보다 괜찮지 않아?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-008', speaker: '지수', text: '아니 근데 잠깐만요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '영우', text: '웅?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '지수', text: '쌤, 이거 진짜 쌤이 잡은 거 맞아요오?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-011', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n왜 또 의심해 ㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-012', speaker: '지수', text: '아니이.\n너무 멀쩡하잖아요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-013', speaker: '영우', text: '숙소가 멀쩡하면 좋은 거 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-014', speaker: '지수', text: '그건 그렇긴 한데에.\n쌤이 잡았잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '영우', text: '아놔 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 지수야 내가 뭘 어떻게 살았길래', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-016', speaker: '지수', text: '그걸 제가 지금부터 설명해야 돼요오?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-017', speaker: '영우', text: '아니아니 됐어\n안 들을래 ㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '', text: '영우가 카드키를 대고 문을 연다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '지수', text: '헐.\n우와아아.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-020', speaker: '지수', text: '쌤 잠깐만요!\n저 먼저 들어가도 돼요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-021', speaker: '영우', text: '웅웅 들어가아 ㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022', speaker: '', text: '지수가 캐리어도 잊고 방 안으로 먼저 들어간다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-023', speaker: '영우', text: '지수야 캐리어 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-024', speaker: '지수', text: '아.\n쌤이 들고 있잖아요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-025', speaker: '영우', text: '아 그러네\n왜 너무 자연스럽지', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-026', speaker: '지수', text: '적응 빠르죠오?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-027', speaker: '영우', text: '개빠르네 진짜 ㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-028', speaker: '지수', text: '오오 이거 봐.\n창문도 진짜 크다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-029', speaker: '영우', text: '웅웅.\n밤에 보면 더 이쁠 것 같더라구.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-030', speaker: '지수', text: '여보! 여기 와봐요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-031', speaker: '', text: '영우가 창가 쪽으로 다가간다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '아니 이거 진짜 신기하다아.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-033', speaker: '영우', text: '머가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-034', speaker: '지수', text: '그냥.\n나 지금 시드니 숙소에 있고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-035', speaker: '지수', text: '옆에 영우 있고.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-036', speaker: '지수', text: '내 캐리어는 우리 영우가 들고 있고.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-037', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n마지막에 그게 왜 들어가', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-038', speaker: '지수', text: '중요하잖아아.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-039', speaker: '영우', text: '아 그래그래\n아주 중요한 역사적 사건이지', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-040', speaker: '지수', text: '마자.\n기록해야 돼.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-041', speaker: '영우', text: '또 기록해? ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-042', speaker: '지수', text: '서영우 씨.\n호주 현지 적응 후 서비스 정신 향상.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-043', speaker: '영우', text: '미친 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 그게 왜 현지 적응 결과야', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-044', speaker: '지수', text: '그럼 이거 사랑의 힘인가?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-045', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-046', speaker: '지수', text: '왜요오.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-047', speaker: '영우', text: '그건 맞는 것 같아서', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-048', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-049', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n왜애', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-050', speaker: '지수', text: '아니.\n그렇게 갑자기 진지하게 받으면 내가 뭐가 돼.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-051', speaker: '영우', text: '원래 좋았는데\n오늘은 지수가 진짜 앞에 있자나', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-052', speaker: '영우', text: '그래서 더 조아', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-053', speaker: '지수', text: '아 진짜.\n나도 너무 좋아.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-054', speaker: '', text: '잠깐 정적.', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'soft' },
  { id: 'line-055', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ\n이제 좀 실감 나?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-056', speaker: '지수', text: '조금.\n근데 아직도 약간 꿈 같아.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-057', speaker: '영우', text: '나도.\n아까 공항에서도 계속 그 생각했어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-058', speaker: '지수', text: '그래서 사람을 2분 동안이나 지켜봤다?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-059', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 그걸 또 여기서 살리네', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-060', speaker: '지수', text: '안 죽었거든요.\n그 사건 아직 진행 중이에요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-061', speaker: '영우', text: '무슨 사건이야 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-062', speaker: '지수', text: '시드니 공항 잠복 관찰 사건.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-063', speaker: '영우', text: '잠복 안 했다고 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-064', speaker: '지수', text: '피의자는 그렇게 주장하고 있고요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-065', speaker: '영우', text: '아 미치겠네 진짜', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-066', speaker: '지수', text: '현재 피의자는 웃음으로 진술을 회피 중.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-067', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 지수야 그만해 배아파', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-068', speaker: '지수', text: '자백하세요.\n저 귀여워서 보고 있었다고.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-069', speaker: '영우', text: '그건 이미 했자나', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-070', speaker: '영우', text: '귀여웠어.\n개귀여웠어 진짜.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-071', speaker: '지수', text: '아.\n됐어.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-072', speaker: '영우', text: '왜왜 ㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-073', speaker: '지수', text: '자백 받아냈으니까.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-074', speaker: '', text: '영우가 캐리어를 침대 옆에 세운다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-075', speaker: '영우', text: '근데 지수 진짜 안 피곤해?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-076', speaker: '지수', text: '피곤하긴 해.\n근데 신나서 잘 모르겠어.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-077', speaker: '영우', text: '아구.\n그래도 오늘 오래 탔자나.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-078', speaker: '지수', text: '그럼 여보는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-079', speaker: '영우', text: '나는 괜찮지.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-080', speaker: '지수', text: '거짓말.\n쌤도 피곤하잖아요.\n오늘 일도 했고.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-081', speaker: '영우', text: '아 그건...', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-082', speaker: '지수', text: '봐.\n말 끊겼어.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-083', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아니 근데 지수가 왔는데 어떻게 자', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-084', speaker: '영우', text: '아까워.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-085', speaker: '지수', text: '영우야.\n나 안 가아.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-086', speaker: '지수', text: '며칠 있잖아.\n오늘 다 안 놀아도 돼.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-087', speaker: '영우', text: '아.\n마자.\n그러네.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-088', speaker: '지수', text: '왜 벌써 아쉬워해애.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-089', speaker: '영우', text: '몰라 ㅎㅎㅎㅎㅎ\n그냥 너무 기다렸나봐.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-090', speaker: '지수', text: '바부.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-091', speaker: '', text: '잠시 후.\n둘은 방 안에서 잠깐 쉬었다가 다시 나갈 준비를 시작했다.', characterId: null },
  { id: 'line-092', speaker: '지수', text: '쌤!\n우리 이제 나가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-093', speaker: '영우', text: '웅웅.\n지수 괜찮으면 근처만 좀 걷자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-094', speaker: '지수', text: '좋아요.\n잠깐만.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-095', speaker: '', text: '지수가 침대와 테이블 주변을 둘러본다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-096', speaker: '지수', text: '어?!', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-097', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-098', speaker: '지수', text: '내 핸드폰 어디 갔지??', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-099', speaker: '영우', text: '엉?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-100', speaker: '지수', text: '잠깐만.\n분명 아까까지 들고 있었는데.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-101', speaker: '영우', text: '아 그래?\n어디다 뒀지', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-102', speaker: '지수', text: '쌤.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-103', speaker: '영우', text: '아니 왜 나 봐 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-104', speaker: '지수', text: '아니 그냥.\n같이 찾아요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-105', speaker: '영우', text: '웅웅.\n찾아보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-106', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 2-3 「근데 이 열쇠 뭐지?」
   Dialogue Set: dialogue-week0-scene002-3
   Scene: week0-scene-002-3 (Sydney Accommodation, right after the phone-hunt
   minigame). Reached by minigame-phone-search/'s GAME CLEAR redirect, not by
   another scene's nextSceneId — see MINIGAME_ROUTES in game/index.html and
   the redirect at the bottom of minigame-phone-search/index.html. Narration/
   system beats use speaker:'' (no name shown), matching the convention used
   throughout week0Scene001Lines/week0Scene002_1Lines. No nextSceneId yet —
   loops like week0-scene-001 until Week 0 Scene 3 is written. */
const week0Scene002_3Lines = [
  { id: 'line-001', speaker: '지수', text: '찾았다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-002', speaker: '영우', text: '아 다행이다 ㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-003', speaker: '지수', text: '진짜 여기 있었네.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-004', speaker: '영우', text: '아까 봤던 데 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '그러니까.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-006', speaker: '', text: '지수가 손에 들린 낡은 열쇠를 내려다본다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '근데 쌤.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '웅?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '이거 뭐예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-010', speaker: '영우', text: '뭐가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '아까 그 열쇠.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-012', speaker: '', text: '[ 낡은 열쇠 ]', characterId: null },
  { id: 'line-013', speaker: '영우', text: '아.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-014', speaker: '영우', text: '그러게.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '숙소 열쇠는 아니죠?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-016', speaker: '영우', text: '웅.\n여긴 카드키자나.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-017', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-018', speaker: '영우', text: '뭐지?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '몰라.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-020', speaker: '지수', text: '일단 가지고 있어봐요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-021', speaker: '영우', text: '내가?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-022', speaker: '지수', text: '네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-023', speaker: '영우', text: '왜 내가 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-024', speaker: '지수', text: '몰라요.\n그냥 느낌이 그래요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-025', speaker: '', text: '[ ITEM ACQUIRED ]\n\nUNKNOWN KEY', characterId: null },
  { id: 'line-026', speaker: '', text: 'SCENE COMPLETE', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 1-2 「지하철 역 찾기」
   Dialogue Set: dialogue-week0-scene001-2
   Scene: week0-scene-001-2 (Sydney Airport Station concourse, 09:45)
   Setup beat before the 3-stop "find the station" route-map minigame
   (International Airport → Eastwood → Marayong, in order) —
   nextSceneId hands off to that minigame page directly (not another VN scene). */
const week0Scene001_2Lines = [
  { id: 'line-001', speaker: '영우', text: '자, 이제 숙소 가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-002', speaker: '지수', text: '웅웅 ㅎㅎ\n우리 어디로 가야돼 여보?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-003', speaker: '영우', text: '일단 공항역부터 찾아야 돼.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '공항?? 우리 방금 나왔잖아 ㅋㅋㅋ', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '영우', text: '역 이름이 International Airport라고 ㅋㅋ\n그다음엔 Eastwood, 마지막에 Marayong.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-006', speaker: '지수', text: '엥\n세 개나?????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '응 ㅋㅋㅋㅋ 노선도 보고 순서대로 찾아봐.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-008', speaker: '지수', text: '아놔 여보 ㅋㅎㅋㅎㅋㅎㅋㅎ\n나 영어 못하는데에;;;;', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-009', speaker: '영우', text: '역 이름만 찾으면 되잖아 ㅋㅋㅋㅋ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-010', speaker: '지수', text: '아아 알게써 ㅠㅋㅋㅋㅋ\n어디보자아...\n공항...', characterId: 'jisoo', expression: 'blank', pauseBeforeMs: 200 },
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

// Registry of testable Week 0 scenes — /dev/week0 lists these, each linking
// to /dev/game/?scene=<id>. Add future scenes here as they're written.
const week0Scenes = [
  {
    id: 'week0-scene-001',
    order: 1,
    name: '진짜 왔네',
    location: 'Sydney Airport Arrival Area',
    introLabel: 'SYDNEY',
    time: '09:30',
    lines: week0Scene001Lines,
  },
  {
    id: 'week0-scene-001-2',
    order: 2,
    name: '지하철 역 찾기',
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
    // 3-stop sequence for this minigame, in find-order — 배경 DB's 정답 영역
    // editor uses this to offer one hotspot slot per stop on the shared map image.
    minigameStages: ['공항 (International Airport)', '이스트우드 (Eastwood)', '마라용 (Marayong)'],
  },
  {
    id: 'week0-scene-002-1',
    order: 3,
    name: '진짜 같이 있네',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:18',
    lines: week0Scene002_1Lines,
    // Not a loop — this scene hands off to the point-and-click phone-hunt
    // minigame (week0-scene-002-2). See MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week0-scene-002-2',
  },
  {
    id: 'week0-scene-002-2',
    order: 4,
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    time: '20:20',
    // No `lines` — this isn't a VN scene, it's the point-and-click minigame
    // itself. `route` overrides /dev/week0's default /dev/game/?scene=<id>
    // link so this entry opens the minigame page directly, letting it be
    // tested standalone instead of only via week0-scene-002-1's VN handoff.
    route: '/dev/minigame-phone-search/',
  },
  {
    id: 'week0-scene-002-3',
    order: 5,
    name: '근데 이 열쇠 뭐지?',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:41',
    lines: week0Scene002_3Lines,
    // Reached from the phone-search minigame's GAME CLEAR redirect, not from
    // another VN scene's nextSceneId — listed here so /dev/week0 and the
    // dev asset selector can still target it directly for testing.
  },
];

/* OPERATION MK — WEEK 1 · SCENE 01 「시티로 출발」
   Dialogue Set: dialogue-week1-scene001
   Scene: week1-scene-001 (Circular Quay 이동 중, 09:40) */
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
  { id: 'line-013', speaker: '영우', text: '오늘은 진짜 아무 일도 없을 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-014', speaker: '', text: '영우의 그 말은,\n오래가지 못했다.', characterId: 'youngwoo', expression: 'soft' },
];

/* OPERATION MK — WEEK 1 · SCENE 02 「관광객 모드」
   Dialogue Set: dialogue-week1-scene002
   Scene: week1-scene-002 (Circular Quay, 10:15) */
const week1Scene002Lines = [
  { id: 'line-001', speaker: '', text: 'Circular Quay.\n오전 10시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '오페라하우스와 하버브리지가 한눈에 들어온다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '와아아 진짜 사진으로 보던 그대로다.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-004', speaker: '영우', text: '여기 서봐.\n찍어줄게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '지수', text: '음...\n이 각도?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '영우', text: '옆으로 살짝만 더.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '이래요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '웅웅 딱 좋다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '', text: '지수가 브이를 했다가, 손가락 하트를 했다가,\n결국 그냥 웃는 얼굴로 정착한다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-010', speaker: '영우', text: '역시 그냥 웃는 게 제일 낫다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '그럼 나머지 열아홉 장은 왜 찍었어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '비교군이 있어야 알지 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-013', speaker: '지수', text: '이제 저도 하나 찍어줄게요.\n이리 와요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '나는 됐는데', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '안 돼요.\n기록 남겨야죠.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '', text: '한참을 그렇게 놀던 중,\n지수의 눈에 낯선 팻말 하나가 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '어?\n저기 저거 뭐예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '영우', text: '어디?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-019', speaker: '지수', text: '저 골목 안쪽.\n뭔가 전시하나 본데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-020', speaker: '영우', text: '오, 팝업 전시네.\n한번 볼래?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-021', speaker: '지수', text: '웅웅 잠깐만 보고 가요.', characterId: 'jisoo', expression: 'happy' },
];

/* OPERATION MK — WEEK 1 · SCENE 03 「전시장, K-01」
   Dialogue Set: dialogue-week1-scene003
   Scene: week1-scene-003 (빈티지 팝업 전시장, 10:40) */
const week1Scene003Lines = [
  { id: 'line-001', speaker: '', text: '빈티지 팝업 전시장.\n오전 10시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '작은 공간에 오래된 시계, 카메라, 금속 공예품들이\n유리 진열장 안에 나란히 놓여 있다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '오 여기 나름 알차네.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '그치.\n생각보다 물건이 많아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '', text: '지수가 진열장 하나 앞에서 멈춘다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '어?\n영우야, 이거 봐요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '이 작은 황동 장치.\n재질이 그때 그 열쇠랑 되게 비슷하지 않아요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '영우', text: '어디...', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-010', speaker: '', text: '[ 작은 황동 장치 · 카탈로그 번호 K-01 ]', characterId: null },
  { id: 'line-011', speaker: '영우', text: '오, 진짜 비슷하네.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '이름표 봐요.\nK 다시 01.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-013', speaker: '영우', text: '그냥 정리 번호 아니야?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-014', speaker: '지수', text: '알아요.\n근데 그냥 넘어가긴 좀 아깝잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '', text: '지수가 폰을 꺼내 사진을 찍는다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-016', speaker: '영우', text: '이제 그거 취미야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '기록이죠, 기록.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-018', speaker: '영우', text: '아이고, 알겠습니다 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-019', speaker: '지수', text: '아직 탐정 아니거든요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-020', speaker: '', text: '전시장 안쪽이 갑자기 붐비기 시작한다.\n단체 관광객 무리가 밀려들어온다.', characterId: null },
  { id: 'line-021', speaker: '영우', text: '와, 갑자기 사람 많아졌다.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '잠깐 옆으로 비켜요.', characterId: 'jisoo', expression: 'neutral' },
];

/* OPERATION MK — WEEK 1 · SCENE 04 「7분 뒤」
   Dialogue Set: dialogue-week1-scene004
   Scene: week1-scene-004 (빈티지 팝업 전시장, 10:47) */
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
];

/* OPERATION MK — WEEK 1 · SCENE 05 「사건 직전 사진」
   Dialogue Set: dialogue-week1-scene005
   Scene: week1-scene-005 (빈티지 팝업 전시장, 10:52)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   photo zoom-in investigation minigame, week1-scene-005-minigame. Result
   (윤민아 / 애드리언 콜 / 레오 박 / 얼굴 없는 검은 재킷 인물 식별) is assumed
   already found by the time week1-scene-006 opens, same pattern as
   week0-scene-002-1 handing off to the phone-search minigame. */
const week1Scene005Lines = [
  { id: 'line-001', speaker: '전시장 직원', text: '여기, 사진들이요.\n확대해서 한 명씩 보시면 도움이 될 것 같아요.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '몇 장이나 있어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-003', speaker: '전시장 직원', text: '여섯 장 정도요.\n사람들이 겹쳐 나와서 좀 헷갈리실 수도 있어요.', characterId: null },
  { id: 'line-004', speaker: '영우', text: '그럼 하나씩 확대해서 보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '웅.\n누가 K-01 근처에 계속 있었는지가 중요하겠죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '영우', text: '진짜 탐정 같네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-007', speaker: '지수', text: '지금은 그런 말 넣어두세요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '', text: '지수와 영우가 사진들을 하나씩 확대해서 살펴보기 시작했다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 06 「윤민아 조사」
   Dialogue Set: dialogue-week1-scene006
   Scene: week1-scene-006 (빈티지 팝업 전시장, 11:10) */
const week1Scene006Lines = [
  { id: 'line-001', speaker: '', text: '전시장 한쪽.\n오전 11시 10분.', characterId: null },
  { id: 'line-002', speaker: '', text: '사진 속에서 세 번이나 K-01 근처에 있던 여자,\n윤민아를 찾아냈다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저기, 잠시만요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '윤민아', text: '네?', characterId: 'minah', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '아까 이 근처에 계속 계셨죠?\n이 진열장 앞에서요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '윤민아', text: '아... 아니요, 저는 그냥 구경만 했는데요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-007', speaker: '영우', text: '사진에는 세 번이나 나오시던데.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-008', speaker: '윤민아', text: '...', characterId: 'minah', pauseBeforeMs: 400, expression: 'neutral' },
  { id: 'line-009', speaker: '윤민아', text: '저기, 그건 제가 뭘 훔쳐서가 아니라요.', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-010', speaker: '지수', text: '그럼요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-011', speaker: '윤민아', text: '...\n사실 전시품들 몰래 찍고 있었어요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-012', speaker: '영우', text: '몰래요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '윤민아', text: '여기 촬영 금지거든요.\n근데 제가 하는 편집숍 무드보드용으로 꼭 필요해서.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-014', speaker: '윤민아', text: '들킬까봐 그 앞에서만 계속 서성인 거예요.\n죄송해요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-015', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-016', speaker: '지수', text: '그럼 K-01 자체는 신경 안 쓰셨다는 거죠?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-017', speaker: '윤민아', text: '그게 뭔지도 몰랐는데요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-018', speaker: '영우', text: '...\n이 사람은 아닌 것 같은데.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-019', speaker: '지수', text: '그러게요.\n그냥 촬영하다 걸릴까봐 그런 거네.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-020', speaker: '지수', text: '감사합니다.\n죄송하지만 확인차 여쭤봤어요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-021', speaker: '윤민아', text: '아뇨, 저도 놀랐어요.\n뭐 없어졌다니.', characterId: 'minah', expression: 'shocked' },
];

/* OPERATION MK — WEEK 1 · SCENE 07 「애드리언 콜 조사」
   Dialogue Set: dialogue-week1-scene007
   Scene: week1-scene-007 (빈티지 팝업 전시장, 11:25)
   First full reveal of the name Mika Kovac. */
const week1Scene007Lines = [
  { id: 'line-001', speaker: '', text: '전시장 접수대 근처.\n오전 11시 25분.', characterId: null },
  { id: 'line-002', speaker: '', text: '사진 속 두 번째 인물, 애드리언 콜은\n이 팝업 전시를 기획한 갤러리 관계자였다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '실례합니다.\n잠깐 여쭤봐도 될까요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '애드리언 콜', text: '아, 네.\nK-01 때문에 그러시죠?', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-005', speaker: '지수', text: '어떻게 아셨어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '애드리언 콜', text: '직원한테 들었어요.\n마침 저도 그것 때문에 좀 이상한 기억이 있어서요.', characterId: 'adrian', expression: 'serious' },
  { id: 'line-007', speaker: '영우', text: '이상한 기억이요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '애드리언 콜', text: '얼마 전에 이메일로 문의가 하나 왔었거든요.\nK-01이랑 비슷한 종류의 황동 물건을 찾는다고요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-009', speaker: '지수', text: '비슷한 물건이요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '애드리언 콜', text: '네.\n제작 시기, 재질, 세부 각인까지 되게 구체적으로 물어봤어요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-011', speaker: '영우', text: '누가 보낸 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '애드리언 콜', text: '잠시만요.\n메일함에 아직 남아있을 거예요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-013', speaker: '', text: '애드리언이 태블릿을 꺼내 메일을 띄운다.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-014', speaker: '', text: '[ 발신: Mika Kovac ]\n[ 직업: Digital Forensics / Independent Consultant ]', characterId: null },
  { id: 'line-015', speaker: '지수', text: '...\n잠깐, M.K.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-016', speaker: '영우', text: '설마.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-017', speaker: '애드리언 콜', text: '아는 이름이에요?', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-018', speaker: '지수', text: '아... 아니요.\n비슷한 이니셜을 본 적이 있어서요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-019', speaker: '애드리언 콜', text: '그렇군요.\n그분한테 답장은 안 드렸어요, 저희는 판매하는 곳이 아니라서.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-020', speaker: '영우', text: '혹시 그 메일 주소나 연락처는요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-021', speaker: '애드리언 콜', text: '직업란 말고는 따로 없었어요.\n좀 이상하죠, 보통은 회사명이라도 적는데.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-022', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'suspicious' },
  { id: 'line-023', speaker: '지수', text: '감사합니다.\n큰 도움 됐어요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-024', speaker: '', text: '애드리언과 헤어진 뒤,\n둘은 한동안 말이 없었다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-025', speaker: '영우', text: '...\nM.K.', characterId: 'youngwoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-026', speaker: '지수', text: '그 열쇠에 새겨진 거랑 똑같아요.', characterId: 'jisoo', expression: 'suspicious' },
];

/* OPERATION MK — WEEK 1 · SCENE 08 「레오 박 조사」
   Dialogue Set: dialogue-week1-scene008
   Scene: week1-scene-008 (전시장 근처 카페, 11:40)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   timeline-arrangement minigame, week1-scene-008-minigame, which surfaces
   레오's 11-minute gap. */
const week1Scene008Lines = [
  { id: 'line-001', speaker: '', text: '전시장 근처 카페.\n오전 11시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '사진 속 세 번째 인물, 레오 박은\n전시장 바로 옆 카페에서 커피를 마시고 있었다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '저기, 죄송한데 잠깐만요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '레오 박', text: '네?\n무슨 일이시죠.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '옆 전시장에서 물건이 하나 없어졌어요.\n혹시 아까 그 안에 계셨나요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '레오 박', text: '아, 그거요.\n네, 잠깐 들어갔었어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-007', speaker: '레오 박', text: '10시 42분쯤 들어가서 10시 58분쯤 나왔을 거예요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-008', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-009', speaker: '지수', text: '되게 정확하시네요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-010', speaker: '레오 박', text: '아, 제가 원래 시간 체크하는 습관이 있어서요.\n다음 미팅이 있었거든요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-011', speaker: '영우', text: '그럼 그 안에서는 뭐 하셨어요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '레오 박', text: '그냥 구경했죠.\n딱히 특별한 건 없었어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-013', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-014', speaker: '지수', text: '사진에는 K-01 진열장 앞에 꽤 오래 서 계신 걸로 나오는데요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-015', speaker: '레오 박', text: '...\n그런가요.\n딱히 의식은 안 했는데.', characterId: 'leo', expression: 'blank' },
  { id: 'line-016', speaker: '영우', text: '지수야, 그 사진들 시간대별로 다시 한번 정리해볼까?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '웅.\n이분 말이랑 실제 사진 시간이 맞는지 한번 맞춰보죠.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-018', speaker: '레오 박', text: '...\n그러세요.\n전 딱히 숨길 거 없으니까.', characterId: 'leo', expression: 'blank' },
  { id: 'line-019', speaker: '', text: '지수와 영우가 사진 속 시간과 레오의 진술을\n하나씩 시간축 위에 배치하기 시작했다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-020', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* OPERATION MK — WEEK 1 · SCENE 09 「첫 추리」
   Dialogue Set: dialogue-week1-scene009
   Scene: week1-scene-009 (빈티지 팝업 전시장, 12:05) */
const week1Scene009Lines = [
  { id: 'line-001', speaker: '', text: '전시장 앞.\n낮 12시 05분.', characterId: null },
  { id: 'line-002', speaker: '', text: '시간축을 다 맞춰보니,\n레오의 진술과 사진 사이에 11분의 공백이 있었다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '10시 47분부터 10시 58분까지.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '레오가 말한 시간이랑 안 맞아요.\n그 사이 사진에서 레오가 사라져요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '영우', text: '11분이면 뭘 하기엔 짧은 시간 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '물건 하나 빼서 가방에 넣기엔 충분해요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '', text: '다시 레오를 찾아가 사진을 보여주자,\n레오의 표정이 눈에 띄게 굳었다.', characterId: null },
  { id: 'line-008', speaker: '레오 박', text: '...\n하아.', characterId: 'leo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-009', speaker: '레오 박', text: '알겠어요.\n제가 그거 옮긴 거 맞아요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-010', speaker: '지수', text: '왜 그러셨어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '레오 박', text: '얼마 전에 익명으로 짧은 일거리 의뢰가 하나 왔었어요.\n그냥 물건 하나 확인하고 사진 찍어서 넘기는 거였어요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-012', speaker: '영우', text: '훔치라는 건 아니었다는 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '레오 박', text: '네, 절대 아니었어요.\n그냥 잠깐 빼서 사진 찍고 다시 두려고 했어요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-014', speaker: '레오 박', text: '근데 그 인파 때문에 다시 넣을 타이밍을 놓쳤고,\n그대로 도난 소동이 나버린 거예요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-015', speaker: '지수', text: '지금 그 물건은요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-016', speaker: '레오 박', text: '의뢰인 쪽에 이미 넘겼어요.\n사진만 찍어서 보내는 조건이었는데, 당황해서 그냥 통째로 보내버렸어요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-017', speaker: '영우', text: '그 의뢰, 어디로 들어온 거예요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-018', speaker: '레오 박', text: '이거요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-019', speaker: '', text: '레오가 업무 전달용으로 쓰던 화면을 보여준다.', characterId: 'leo', expression: 'blank' },
  { id: 'line-020', speaker: '', text: '[ 중개 계정명: MK_Consult ]', characterId: null },
  { id: 'line-021', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'shocked' },
  { id: 'line-022', speaker: '지수', text: '또 M.K.네요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-023', speaker: '레오 박', text: '죄송해요.\n제가 이렇게 일이 커질 줄은 몰랐어요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-024', speaker: '영우', text: '전시장 쪽에는 저희가 사정 설명 도와드릴게요.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-025', speaker: '지수', text: '대신 그 계정명은 저희가 좀 적어갈게요.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 1 · SCENE 10 「탐정님과 조수」
   Dialogue Set: dialogue-week1-scene010
   Scene: week1-scene-010 (Circular Quay 하버 산책로, 17:30) */
const week1Scene010Lines = [
  { id: 'line-001', speaker: '', text: 'Circular Quay 하버 산책로.\n오후 5시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '전시장 소동을 정리하고 나니 어느새 노을이 지고 있었다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '오늘 진짜 아무 일도 없을 거랬는데.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-004', speaker: '지수', text: '그러니까요.\n누가 그런 말을 해요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '영우', text: '근데 지수 아까 진짜 대박이었어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '뭐가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '영우', text: '레오씨 알리바이 구멍 찾아낸 거.\n나였으면 그냥 넘어갔을 듯.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-008', speaker: '지수', text: '음... 그건 그냥 딱 봐도 이상했어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-009', speaker: '영우', text: '와, 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-010', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '그거 다시 불러봐요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '탐정님?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-013', speaker: '지수', text: 'ㅎㅎㅎ\n좋다, 그거.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '영우', text: '그럼 나는 뭔데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015', speaker: '지수', text: '조수죠.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '영우', text: '내가 나이가 몇인데 조수야.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-017', speaker: '지수', text: '나이 많은 조수도 있어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-018', speaker: '영우', text: '앜ㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그런 게 어딨어', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-019', speaker: '지수', text: '여기요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-020', speaker: '영우', text: '아이고, 알겠습니다 탐정님.\n잘 모시겠습니다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-021', speaker: '지수', text: '진작 그럴 것이지.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-022', speaker: '', text: '장난스러운 말투였지만,\n둘 다 알고 있었다.', characterId: null },
  { id: 'line-023', speaker: '', text: '오늘부로 뭔가 조금 달라졌다는 걸.', characterId: null },
  { id: 'line-024', speaker: '영우', text: '근데 지수야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-025', speaker: '지수', text: '왜요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: 'M.K.는 뭐 좀 알아볼 거야?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-027', speaker: '지수', text: '당연하죠.\n숙소 가서 검색부터 해봐야죠.', characterId: 'jisoo', expression: 'serious' },
];

/* OPERATION MK — WEEK 1 · SCENE 11 「첫 용의자 카드」
   Dialogue Set: dialogue-week1-scene011
   Scene: week1-scene-011 (Sydney Accommodation, 21:40)
   Closes out Week 1's main weekend arc — 1주차 평일 미니씬(W1-D1~D5)은 별도로
   추가될 예정. No nextSceneId; ends on narration like week0-scene-001. */
const week1Scene011Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 9시 40분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '자, 검색 들어갑니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-003', speaker: '영우', text: '진짜 이걸 검색해본다고?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '장난 반 진심 반이에요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '', text: '[ 검색어: Mika Kovac Sydney ]', characterId: null },
  { id: 'line-006', speaker: '지수', text: '어...\n뭔가 뜨긴 뜨네요.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-007', speaker: '영우', text: '뭐라고 나와?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '프리랜서 디지털 포렌식.\n기업 분쟁 자문.\n삭제 파일 복구.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '지수', text: '공개 프로필은 거의 없고요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-010', speaker: '영우', text: '진짜 존재하는 사람이네.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-011', speaker: '지수', text: '그러니까요.\n오늘 하루 만에 이름이 두 번이나 나왔어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-012', speaker: '지수', text: '문의 메일 한 번, 중개 계정 한 번.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '영우', text: '그리고 그 열쇠.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '웅.\nM.K.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'serious' },
  { id: 'line-015', speaker: '', text: '지수가 종이 한 장을 꺼내 이름을 적는다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-016', speaker: '', text: '[ 용의자 카드 생성 ]\n미카 코바치 — M.K. 가능성 35%', characterId: null },
  { id: 'line-017', speaker: '영우', text: '너무 성급한 거 아니야?\n오늘 처음 들은 이름인데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-018', speaker: '지수', text: '그러니까 35%죠.\n100%였으면 벌써 신고했어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-019', speaker: '영우', text: 'ㅎㅎㅎ\n하긴 그것도 맞네.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-020', speaker: '지수', text: '일단 오늘은 여기까지.\n내일부터 또 알아보죠, 조수님.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021', speaker: '영우', text: '넵, 탐정님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022', speaker: '', text: '지수의 1주차는,\n그렇게 하나의 이름을 남기고 저물었다.', characterId: null },
];

// Registry of testable Week 1 scenes — /dev/week1 lists these, each linking
// to /dev/game/?scene=<id>. Covers only the 1주차 main weekend arc
// (W1-S01~S11, "사라진 K-01") — 평일 미니씬(W1-D1~D5)은 아직 미구현.
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
    name: '전시장, K-01',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:40',
    lines: week1Scene003Lines,
  },
  {
    id: 'week1-scene-004',
    order: 4,
    name: '7분 뒤',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:47',
    lines: week1Scene004Lines,
  },
  {
    id: 'week1-scene-005',
    order: 5,
    name: '사건 직전 사진',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:52',
    lines: week1Scene005Lines,
    // Hands off into the (not yet built) photo zoom-in investigation
    // minigame — see MINIGAME_ROUTES in game/index.html. Falls back to a
    // "MINIGAME START" placeholder overlay until that route exists.
    nextSceneId: 'week1-scene-005-minigame',
  },
  {
    id: 'week1-scene-006',
    order: 6,
    name: '윤민아 조사',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:10',
    lines: week1Scene006Lines,
  },
  {
    id: 'week1-scene-007',
    order: 7,
    name: '애드리언 콜 조사',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:25',
    lines: week1Scene007Lines,
  },
  {
    id: 'week1-scene-008',
    order: 8,
    name: '레오 박 조사',
    location: 'Café near Circular Quay',
    introLabel: 'CIRCULAR QUAY',
    time: '11:40',
    lines: week1Scene008Lines,
    // Hands off into the (not yet built) timeline-arrangement minigame that
    // surfaces 레오's 11-minute gap — same placeholder fallback as above.
    nextSceneId: 'week1-scene-008-minigame',
  },
  {
    id: 'week1-scene-009',
    order: 9,
    name: '첫 추리',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '12:05',
    lines: week1Scene009Lines,
  },
  {
    id: 'week1-scene-010',
    order: 10,
    name: '탐정님과 조수',
    location: 'Circular Quay Harbour Walk',
    introLabel: 'CIRCULAR QUAY',
    time: '17:30',
    lines: week1Scene010Lines,
  },
  {
    id: 'week1-scene-011',
    order: 11,
    name: '첫 용의자 카드',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '21:40',
    lines: week1Scene011Lines,
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
    // hotspots to set up, so setupUrl points straight at the playable game
    // instead of an /dev/upload editor screen.
    id: 'fishing-minigame',
    name: '낚시',
    location: '독립형 미니게임 (스토리 미연동)',
    route: '/dev/minigame-fishing/',
    setupUrl: '/dev/minigame-fishing/',
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
];

// Combined lookup across every week's scenes — /dev/game resolves a
// requested ?scene= id against this instead of a single week's array, since
// a scene can belong to any week. Per-week test pages (/dev/week0,
// /dev/week1) still read their own week*Scenes array directly so their
// listing stays scoped to just that week.
const allScenes = week0Scenes.concat(week1Scenes);
