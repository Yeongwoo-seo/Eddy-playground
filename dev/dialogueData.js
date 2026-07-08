/* OPERATION MK — WEEK 1 · SCENE 01 v4 「진짜 왔네」
   Dialogue Set: dialogue-week1-scene001-v4
   Scene: week1-scene-001 (Sydney Airport Arrival Area, 09:30)
   Loaded into /dev/game for VN UX testing. */

// role 'protagonist' gets its own dedicated CharacterTransform; every other
// role shares one common default transform (see DevGameState in assetDb.js) —
// tune it once on any non-protagonist character and it applies to all of them.
const dialogueCharacters = [
  { id: 'jisoo', name: '지수', role: 'protagonist' },
  { id: 'youngwoo', name: '영우', role: 'other' }
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
const week1Scene001Lines = [
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

/* OPERATION MK — WEEK 1 · SCENE 2-1 「진짜 같이 있네」
   Dialogue Set: dialogue-week1-scene002-1
   Scene: week1-scene-002-1 (Sydney Accommodation, 20:18)
   Ends on a MINIGAME START beat — nextSceneId hands off to the (not yet
   built) point-and-click phone-hunt scene, week1-scene-002-2. */
const week1Scene002_1Lines = [
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

/* OPERATION MK — WEEK 1 · SCENE 2-3 「근데 이 열쇠 뭐지?」
   Dialogue Set: dialogue-week1-scene002-3
   Scene: week1-scene-002-3 (Sydney Accommodation, right after the phone-hunt
   minigame). Reached by minigame-phone-search/'s GAME CLEAR redirect, not by
   another scene's nextSceneId — see MINIGAME_ROUTES in game/index.html and
   the redirect at the bottom of minigame-phone-search/index.html. Narration/
   system beats use speaker:'' (no name shown), matching the convention used
   throughout week1Scene001Lines/week1Scene002_1Lines. No nextSceneId yet —
   loops like week1-scene-001 until Week 1 Scene 3 is written. */
const week1Scene002_3Lines = [
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

/* OPERATION MK — WEEK 1 · SCENE 1-2 「지하철 역 찾기」
   Dialogue Set: dialogue-week1-scene001-2
   Scene: week1-scene-001-2 (Sydney Airport Station concourse, 09:45)
   Setup beat before the 3-stop "find the station" route-map minigame
   (International Airport → Eastwood → Marayong, in order) —
   nextSceneId hands off to that minigame page directly (not another VN scene). */
const week1Scene001_2Lines = [
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

// OPERATION MK — Week 1 Scene 2-2 room-search minigame's area/hotspot
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
const ROOM_SEARCH_MINIGAME_ID = 'week1-scene-002-2';
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

// Hotspot IDs already wired by hand to a core-route handler (or a core
// item's hardcoded gating logic) in minigame-phone-search's HOTSPOT_HANDLERS/
// ITEM_HOTSPOT_ITEM_IDS. /dev/upload's 아이템 tab reads this to keep a
// dev from assigning a new custom item to a hotspot that's already spoken
// for — that assignment would just silently never fire, since the core
// handler always wins.
const ROOM_SEARCH_RESERVED_HOTSPOT_IDS = [
  'kitchen-right-lower-drawer', 'kitchen-fridge-gap',
  'bathroom-behind-door',
  'exterior-center-shrubs',
  'bedroom-bedside-table', 'bedroom-right-vent',
];

// Core item -> the (reserved) hotspot its hand-written handler grants it
// from, mirroring ITEM_HOTSPOT_ITEM_IDS's core entries in
// minigame-phone-search/index.html. /dev/upload's 아이템 tab reads this to
// show a core item's location read-only instead of hiding the row outright
// — a dev can't reassign it (the handler is hardcoded), but seeing where it
// already lives is still useful. working-flashlight/long-hook are recipe
// outputs, not hotspot pickups, so they're absent here on purpose.
const ROOM_SEARCH_CORE_ITEM_HOTSPOTS = {
  'aa-batteries': 'kitchen-right-lower-drawer',
  'jisu-phone': 'kitchen-fridge-gap',
  'metal-hanger': 'bathroom-behind-door',
  'garden-stake': 'exterior-center-shrubs',
  'dead-flashlight': 'bedroom-bedside-table',
  'unknown-key': 'bedroom-right-vent',
};

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

// Registry of testable Week 1 scenes — /dev/week1 lists these, each linking
// to /dev/game/?scene=<id>. Add future scenes here as they're written.
const week1Scenes = [
  {
    id: 'week1-scene-001',
    order: 1,
    name: '진짜 왔네',
    location: 'Sydney Airport Arrival Area',
    introLabel: 'SYDNEY',
    time: '09:30',
    lines: week1Scene001Lines,
  },
  {
    id: 'week1-scene-001-2',
    order: 2,
    name: '지하철 역 찾기',
    location: 'Sydney Airport Station',
    introLabel: 'SYDNEY',
    time: '09:45',
    lines: week1Scene001_2Lines,
    // Hands off straight into the route-map minigame (not another VN scene) —
    // see MINIGAME_ROUTES in game/index.html. minigameId marks that this
    // scene has its own separate "미니게임" background slot in 배경 DB
    // (the route-map image), distinct from this scene's own VN background.
    nextSceneId: 'week1-scene-001-2-minigame',
    minigameId: 'week1-scene-001-2-minigame',
    // 3-stop sequence for this minigame, in find-order — 배경 DB's 정답 영역
    // editor uses this to offer one hotspot slot per stop on the shared map image.
    minigameStages: ['공항 (International Airport)', '이스트우드 (Eastwood)', '마라용 (Marayong)'],
  },
  {
    id: 'week1-scene-002-1',
    order: 3,
    name: '진짜 같이 있네',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:18',
    lines: week1Scene002_1Lines,
    // Not a loop — this scene hands off to the point-and-click phone-hunt
    // minigame (week1-scene-002-2). See MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week1-scene-002-2',
  },
  {
    id: 'week1-scene-002-2',
    order: 4,
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    time: '20:20',
    // No `lines` — this isn't a VN scene, it's the point-and-click minigame
    // itself. `route` overrides /dev/week1's default /dev/game/?scene=<id>
    // link so this entry opens the minigame page directly, letting it be
    // tested standalone instead of only via week1-scene-002-1's VN handoff.
    route: '/dev/minigame-phone-search/',
  },
  {
    id: 'week1-scene-002-3',
    order: 5,
    name: '근데 이 열쇠 뭐지?',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:41',
    lines: week1Scene002_3Lines,
    // Reached from the phone-search minigame's GAME CLEAR redirect, not from
    // another VN scene's nextSceneId — listed here so /dev/week1 and the
    // dev asset selector can still target it directly for testing.
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
    id: 'week1-scene-001-2-minigame',
    name: '지하철 역 찾기',
    location: 'Sydney Airport Station',
    route: '/dev/minigame-eastwood/',
    setupUrl: '/dev/upload/?scene=week1-scene-001-2&kind=minigame&minigame=week1-scene-001-2-minigame',
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
    id: 'week1-scene-002-2',
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    route: '/dev/minigame-phone-search/',
    setupUrl: `/dev/upload/?scene=${roomSearchAreaSceneId(roomSearchAreas[0].id)}&minigame=week1-scene-002-2`,
  },
];

// Groups scene registries by week — 배경 DB (/dev/upload) lists scenes under
// their week here instead of hardcoding a single week's worth of scenes.
//
// /dev/upload's picker gets one extra pseudo-scene per room-search area
// (`roomHotspots` marks it as such) so a dev can upload that area's photo
// and mark its hotspots — /dev/week1's list reads week1Scenes directly, not
// weeks, so these stay invisible there and don't clutter the scene list.
const week1UploadScenes = week1Scenes.concat(roomSearchAreas.map(area => ({
  id: roomSearchAreaSceneId(area.id),
  name: `핸드폰찾기 · ${area.label}`,
  roomHotspots: area.hotspots,
})));
const weeks = [
  { id: 'week1', label: '1주차', scenes: week1UploadScenes },
];
