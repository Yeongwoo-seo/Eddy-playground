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

/* OPERATION MK — WEEK 0 · SCENE 00 「시드니 상공」
   Dialogue Set: dialogue-week0-scene-flight
   Scene: week0-scene-flight (In flight, 10 minutes before landing)
   No mystery here — per the brief, 0주차 opens on anticipation and reunion,
   not plot. This is purely the "지수 시점 오프닝 + 카톡" beat. */
const week0SceneFlightLines = [
  { id: 'line-001', speaker: '', text: '시드니 상공.\n착륙 10분 전.', characterId: null },
  { id: 'line-002', speaker: '', text: '창밖으로 구름 아래 도시의 불빛이 하나둘 보이기 시작했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '...\n다 왔다.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'neutral' },
  { id: 'line-004', speaker: '', text: '안내방송이 흐릿하게 들린다.\n"곧 시드니 킹스포드 스미스 공항에 착륙하겠습니다."', characterId: null },
  { id: 'line-005', speaker: '지수', text: '와, 진짜 실감 안 나네.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '', text: '지수가 비행기 모드를 풀자마자 메시지 알림이 뜬다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '영우', text: '도착하면 톡해 ㅋㅋ 나 근처야', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-008', speaker: '지수', text: '근처가 어디임\n또 길 잃은 거 아냐', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-009', speaker: '영우', text: '아닌데\n이번엔 진짜 안 잃었는데', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-010', speaker: '지수', text: '그 말 어디서 많이 들었는데.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-011', speaker: '영우', text: 'ㅋㅋㅋㅋ 일단 와봐', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-012', speaker: '지수', text: '가고 있잖아요, 지금.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-013', speaker: '', text: '창밖 풍경이 점점 가까워진다.\n지수는 폰을 무릎에 내려놓고 창에 이마를 기댔다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-014', speaker: '', text: '설렘 반, 긴장 반.\n시드니가 그렇게 가까워지고 있었다.', characterId: null },
];

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

/* OPERATION MK — WEEK 0 · SCENE 05 「진짜 같이 있네」
   Dialogue Set: dialogue-week0-scene002-1
   Scene: week0-scene-002-1 (Sydney Accommodation, 20:18)
   Ends heading out to dinner (week0-scene-dinner) — no nextSceneId/minigame
   handoff here anymore. The phone goes missing later that night, in
   week0-scene-charger, after dinner. */
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
  { id: 'line-095', speaker: '지수', text: '나 배고픈데.\n뭐 먹을 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-096', speaker: '영우', text: '숙소 앞에 괜찮은 데 봐놨어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-097', speaker: '지수', text: '오오, 준비성 좋은데요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-098', speaker: '영우', text: '나름 알아봤지 ㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-099', speaker: '', text: '둘은 짐을 대충 방에 던져두고 숙소를 나섰다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 06 「첫날 저녁」
   Dialogue Set: dialogue-week0-scene-dinner
   Scene: week0-scene-dinner (근처 식당, 21:10)
   No mystery — per the brief, just food/photos/a short tired spat that
   resolves fast. */
const week0SceneDinnerLines = [
  { id: 'line-001', speaker: '', text: '숙소 근처 작은 식당.\n오후 9시 10분.', characterId: null },
  { id: 'line-002', speaker: '', text: '영우가 미리 봐뒀다던 곳은\n생각보다 훨씬 아늑했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '여기 냄새 미쳤다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '영우', text: '그치?\n여기 로컬들만 아는 데래.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-005', speaker: '지수', text: '오, 그럼 뭐 시킬 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '영우', text: '나는 이거.\n지수는?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '음...\n저도 그거요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '똑같은 거 시키면 하나만 시키면 되잖아.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-009', speaker: '지수', text: '싫어요.\n저도 제 거 있어야 돼요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-010', speaker: '영우', text: 'ㅋㅋㅋ 알겠어 알겠어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-011', speaker: '', text: '음식이 나오고,\n지수가 바로 사진부터 찍는다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-012', speaker: '영우', text: '먹기도 전에 열 장은 찍은 것 같은데.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '지수', text: '기록이라니까요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '', text: '한참 먹던 중,\n지수가 갑자기 조용해진다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-015', speaker: '영우', text: '왜 말이 없어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-016', speaker: '지수', text: '아니 그냥.\n좀 피곤한가봐요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-017', speaker: '영우', text: '무리했나보다.\n다 먹으면 바로 들어가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-018', speaker: '지수', text: '아니에요, 괜찮아요.\n오늘 첫날인데 더 놀아야지.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-019', speaker: '영우', text: '그러다 내일 못 일어나.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-020', speaker: '지수', text: '...\n조금만요.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-021', speaker: '영우', text: 'ㅎㅎ 알겠어.\n조금만 더 있다 가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '', text: '짧은 티격태격은 늘 그렇듯 금방 풀렸다.', characterId: null },
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
   point-and-click phone-hunt scene, week0-scene-002-2. */
const week0SceneChargerLines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 10시 30분.', characterId: null },
  { id: 'line-002', speaker: '', text: '저녁을 먹고 돌아온 두 사람은\n잘 준비를 시작했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '폰 충전 좀 할게요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '', text: '지수가 충전기를 꽂으려다\n케이블이 발에 걸려 놓친다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '어어.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-006', speaker: '', text: '충전기가 침대 밑으로 굴러들어간다.', characterId: null },
  { id: 'line-007', speaker: '지수', text: '아 진짜.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-008', speaker: '영우', text: '내가 꺼내줄게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-009', speaker: '지수', text: '아니에요, 제가 떨어뜨렸으니까.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-010', speaker: '', text: '지수가 침대 밑으로 손을 뻗는다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '...\n어?', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-013', speaker: '지수', text: '뭔가 있는 것 같은데.\n안쪽이 너무 깊어서 손이 안 닿아요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-014', speaker: '영우', text: '뭔데?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015', speaker: '지수', text: '몰라요.\n너무 안쪽이라 안 보여요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-016', speaker: '', text: '지수가 결국 충전기만 겨우 꺼낸다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-017', speaker: '영우', text: '내일 밝을 때 다시 보자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-018', speaker: '지수', text: '음...\n그래요.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-019', speaker: '', text: '지수가 충전기를 꽂으려고 폰을 찾는다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-020', speaker: '지수', text: '어?!', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-021', speaker: '영우', text: '또 왜요.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '제 폰 어디 갔지??', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-023', speaker: '영우', text: '엉?\n분명 아까까지 들고 있었잖아.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-024', speaker: '지수', text: '그러니까요.\n갑자기 어디 갔지.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-025', speaker: '영우', text: '침대 밑 그 반짝이는 거랑 같이 있는 거 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-026', speaker: '지수', text: '설마.\n일단 방 전체를 좀 뒤져봐야겠어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-027', speaker: '영우', text: '웅웅.\n같이 찾아보자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-028', speaker: '', text: 'MINIGAME START', characterId: null },
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
   loop or dead-end; it ends heading down to reception (week0-scene-frontdesk). */
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
  { id: 'line-013', speaker: '지수', text: '근데 이거 뒤에 뭐 있어요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-014', speaker: '', text: '지수가 열쇠를 뒤집어 본다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-015', speaker: '', text: '[ 뒷면에 작게 새겨진 M.K. ]', characterId: null },
  { id: 'line-016', speaker: '영우', text: 'M.K.?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '이니셜 같은데.\n누구 거지 이거.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-018', speaker: '영우', text: '전에 있던 사람 물건 아닐까?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '지수', text: '숙소 열쇠는 아니죠?', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'line-020', speaker: '영우', text: '웅.\n여긴 카드키자나.', characterId: 'youngwoo', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-accommodation-keycard', code: 'E-000', title: '숙소 카드키',
        description: '두 사람이 묵고 있는 숙소의 정식 카드키. 낡은 열쇠와는 다른 물건이다.',
        discoveredLocationText: '숙소 객실',
      },
    }],
  },
  { id: 'line-021', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-022', speaker: '영우', text: '뭐지?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-023', speaker: '지수', text: '몰라.', characterId: 'jisoo', expression: 'blank' },
  {
    id: 'line-023-choice', type: 'choice', speaker: '', text: '지수는 열쇠를 만지작거리며 생각했다.', characterId: 'jisoo', expression: 'suspicious',
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
  { id: 'line-024', speaker: '지수', text: '일단 가지고 있어봐요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-025', speaker: '영우', text: '내가?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-026', speaker: '지수', text: '네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-027', speaker: '영우', text: '왜 내가 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-028', speaker: '지수', text: '몰라요.\n그냥 느낌이 그래요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-029', speaker: '', text: '[ ITEM ACQUIRED ]\n\nUNKNOWN KEY', characterId: null },
  { id: 'line-030', speaker: '지수', text: '이거 신경 쓰이는데.\n프런트에 한번 물어볼까요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-031', speaker: '영우', text: '이 시간에?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-032', speaker: '지수', text: '로비에 아직 사람 있던데요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-033', speaker: '영우', text: '음...\n그래, 가보자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034', speaker: '', text: '두 사람은 열쇠를 챙겨 로비로 향했다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 09 「프런트 문의」
   Dialogue Set: dialogue-week0-scene-frontdesk
   Scene: week0-scene-frontdesk (숙소 로비, 22:50)
   Per the brief: the staff member's "M.K..." recollection must NOT resolve
   into the full name Mika Kovac here — that reveal is reserved for
   1주차 (week1-scene-007). */
const week0SceneFrontdeskLines = [
  { id: 'line-001', speaker: '', text: '숙소 로비.\n밤 10시 50분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '저기, 잠깐 여쭤봐도 될까요?', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '프런트 직원', text: '네, 무슨 일이세요?', characterId: null },
  { id: 'line-004', speaker: '지수', text: '방에서 뭘 좀 발견했는데요.\n뭔가 짚이는 게 있으실까 해서요.', characterId: 'jisoo', expression: 'curious' },
  {
    id: 'line-005', type: 'evidence', speaker: '', text: '직원에게 무엇을 보여줄지 골라보세요.', characterId: 'jisoo', expression: 'curious',
    evidenceIds: ['evidence-unknown-key'],
    correctGoto: 'line-006',
    wrongText: '지수: “어, 이건 아니고...” 직원이 고개를 갸웃한다.',
  },
  { id: 'line-006', speaker: '프런트 직원', text: '음...\n저희 쪽 물건은 아닌 것 같은데요.', characterId: null },
  { id: 'line-007', speaker: '프런트 직원', text: '분실물 등록된 것도 없고요.', characterId: null },
  { id: 'line-008', speaker: '영우', text: '그럼 이전 투숙객 거일까요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-009', speaker: '프런트 직원', text: '그럴 수도 있죠.\n저희가 따로 기록은 안 남겨서.', characterId: null },
  { id: 'line-010', speaker: '지수', text: '아, 그렇구나.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '', text: '직원이 열쇠 뒷면을 잠깐 살펴본다.', characterId: null },
  { id: 'line-012', speaker: '프런트 직원', text: 'M.K...', characterId: null },
  { id: 'line-013', speaker: '프런트 직원', text: '잠깐, 비슷한 이름의 이전 문의가 있었던 것 같은데요.', characterId: null },
  { id: 'line-014', speaker: '지수', text: '정말요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-015', speaker: '', text: '직원이 컴퓨터로 뭔가를 검색해본다.', characterId: null },
  { id: 'line-016', speaker: '프런트 직원', text: '음...\n죄송해요, 안 나오네요.\n제가 착각했나봐요.', characterId: null },
  { id: 'line-017', speaker: '영우', text: '그래요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-018', speaker: '프런트 직원', text: '네, 그냥 갖고 계셔도 될 것 같아요.\n혹시 나중에 찾는 분 있으면 다시 알려드릴게요.', characterId: null },
  { id: 'line-019', speaker: '지수', text: '네, 감사합니다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-020', speaker: '', text: '방으로 돌아가는 길,\n지수는 어쩐지 마음에 걸렸다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-021', speaker: '영우', text: '왜 그래?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '아니에요.\n그냥 좀 이상해서.', characterId: 'jisoo', expression: 'blank' },
];

/* OPERATION MK — WEEK 0 · SCENE 09-2 「엘리베이터의 우편 봉투」
   Dialogue Set: dialogue-week0-scene-mailroom
   Scene: week0-scene-mailroom (숙소 엘리베이터 앞, 23:00)
   The brief's "초장 가짜 진범 씨앗" — a seed only the player is meant to
   remember. Full name (Mika Kovac) still not revealed. */
const week0SceneMailroomLines = [
  { id: 'line-001', speaker: '', text: '숙소 엘리베이터 앞.\n밤 11시.', characterId: null },
  { id: 'line-002', speaker: '', text: '엘리베이터를 기다리던 중,\n공용 우편함 쪽에 지수의 눈길이 닿았다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '어?\n저거 뭐예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '뭐가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '저 봉투.\n반송 도장 찍혀있는데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '', text: '오래돼 보이는 봉투 하나가\n우편함 위에 놓여 있었다.', characterId: null },
  { id: 'line-007', speaker: '', text: '수취인 이름 일부가 보인다.', characterId: null },
  { id: 'line-008', speaker: '', text: '[ M. KOV... ]', characterId: null },
  { id: 'line-009', speaker: '지수', text: 'M.K.네 ㅋㅋ', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '세상에 M이랑 K가 한둘이냐.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-011', speaker: '지수', text: '그건 그런데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '', text: '마침 지나가던 직원이 봉투를 집어 든다.', characterId: null },
  { id: 'line-013', speaker: '프런트 직원', text: '아, 이거 다른 투숙객분 우편이에요.', characterId: null },
  { id: 'line-014', speaker: '', text: '직원이 봉투를 챙겨 안쪽으로 사라진다.', characterId: null },
  { id: 'line-015', speaker: '영우', text: '가자, 엘리베이터 왔다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-016', speaker: '지수', text: '웅웅.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-017', speaker: '', text: '별거 아닌 순간이었다.\n적어도 그때는 그렇게 느껴졌다.', characterId: null },
];

/* OPERATION MK — WEEK 0 · SCENE 10 「첫날 밤」
   Dialogue Set: dialogue-week0-scene-firstnight
   Scene: week0-scene-firstnight (Sydney Accommodation, 23:15)
   Closes out 0주차 — no nextSceneId, this is the last scene of the week. */
const week0SceneFirstNightLines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 11시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '방으로 돌아온 두 사람은\n내일 일정을 정리하기 시작했다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '내일은 뭐부터 해요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '일단 시티 쪽 가볼까 하는데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '지수', text: '오오 좋아요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '', text: '지수의 시선이 협탁 위 열쇠로 향한다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '지수', text: '근데 이거 진짜 뭘까요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-008', speaker: '영우', text: '몰라, 그냥 옛날 투숙객 거겠지.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-009', speaker: '지수', text: '그래도 왠지 보물 같지 않아요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-010', speaker: '영우', text: '보물이면 뭐, 반씩 나눌까?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-011', speaker: '지수', text: '보물 열쇠면 내가 8, 너 2.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '왜 줄었는데.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-013', speaker: '지수', text: '제가 찾았잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '아니 애초에 네 충전기 때문에 시작된 일인데.', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-015', speaker: '지수', text: '그거랑 이거랑 무슨 상관이에요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-016', speaker: '영우', text: '아 그러네.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-017', speaker: '지수', text: '그니까 8, 2로 하죠.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-018', speaker: '영우', text: 'ㅎㅎㅎㅎㅎ 알겠어 알겠어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-019', speaker: '', text: '둘은 한참을 그렇게 시답잖은 농담을 주고받다\n하나둘 잠들었다.', characterId: null },
  { id: 'line-020', speaker: '', text: '협탁 위,\n작은 황동 열쇠만이 조용히 남아 있었다.', characterId: null },
  { id: 'line-021', speaker: '', text: '[ M.K. ]', characterId: null },
  { id: 'line-022', speaker: '', text: '0주차 종료.', characterId: null },
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

/* OPERATION MK — WEEK 0 · SCENE 04 「열차 — 밀린 이야기」
   Dialogue Set: dialogue-week0-scene-train
   Scene: week0-scene-train (Sydney Trains, 10:05)
   minigame-eastwood's GAME CLEAR redirect hands off here (not straight to
   the accommodation scene) so 무깽이 리마인드 #1 gets its own beat, per the
   brief's "매우 약하게" instruction — no clue UI, no music cue, just banter. */
const week0SceneTrainLines = [
  { id: 'line-001', speaker: '', text: 'Sydney Trains 열차 안.\n오전 10시 05분.', characterId: null },
  { id: 'line-002', speaker: '', text: '공항역에서 겨우 노선을 찾은 두 사람은\n숙소 방향 열차에 자리를 잡았다.', characterId: null },
  { id: 'line-003', speaker: '영우', text: '거봐, 결국 찾았잖아.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-004', speaker: '지수', text: '제가 찾았죠, 제가.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '영우', text: '그건 그렇지 ㅋㅋㅋ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-006', speaker: '지수', text: '근데 숙소까지 얼마나 걸려요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '영우', text: '한 40분?\n가면서 뭐 먹을지 정하자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-008', speaker: '지수', text: '오오 좋아요.\n저 사실 기내식 말고 뭔가 먹고 싶었어요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009', speaker: '영우', text: '그럴 줄 알고 봐놓은 데 있어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '지수', text: '역시.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-011', speaker: '', text: '지수가 창에 기댄 채 눈을 감는다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-012', speaker: '영우', text: '많이 피곤해?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-013', speaker: '지수', text: '조금요.\n근데 졸리진 않아요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-014', speaker: '지수', text: '무깽이 나 없다고 찾으려나.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'soft' },
  { id: 'line-015', speaker: '영우', text: '지금쯤 네 침대 차지했을 듯.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-016', speaker: '지수', text: 'ㅎㅎ 딱 걔답네.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-017', speaker: '', text: '창밖으로 낯선 동네 풍경이 지나간다.\n열차는 계속 달렸다.', characterId: null },
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
// Grouped by location rather than by time slice — consecutive scenes at the
// same place are merged into one entry (see mergeLines above) so the list
// isn't split on every clock-time change. A scene keeps its own entry when
// the location changes, or when it hands off to a minigame (nextSceneId) —
// that handoff always has to be the last beat of an entry.
const week0Scenes = [
  {
    id: 'week0-scene-flight',
    order: 1,
    name: '시드니 상공',
    location: 'In Flight',
    introLabel: 'IN FLIGHT',
    time: '착륙 10분 전',
    lines: week0SceneFlightLines,
  },
  {
    id: 'week0-scene-001',
    order: 2,
    name: '진짜 왔네',
    location: 'Sydney Airport Arrival Area',
    introLabel: 'SYDNEY',
    time: '09:30',
    lines: week0Scene001Lines,
  },
  {
    id: 'week0-scene-001-2',
    order: 3,
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
    id: 'week0-scene-001-2-minigame',
    order: 4,
    name: '지하철 역 찾기 (미니게임)',
    location: 'Sydney Airport Station',
    time: '09:50',
    route: '/dev/minigame-eastwood/',
  },
  {
    id: 'week0-scene-train',
    order: 5,
    name: '열차 — 밀린 이야기',
    location: 'Sydney Trains',
    introLabel: 'SYDNEY TRAINS',
    time: '10:05',
    lines: week0SceneTrainLines,
  },
  {
    id: 'week0-scene-002-1',
    order: 6,
    name: '진짜 같이 있네',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '20:18',
    lines: week0Scene002_1Lines,
  },
  {
    id: 'week0-scene-dinner',
    order: 7,
    name: '첫날 저녁',
    location: 'Restaurant near Accommodation',
    introLabel: 'DINNER',
    time: '21:10',
    lines: week0SceneDinnerLines,
  },
  {
    id: 'week0-scene-charger',
    order: 8,
    name: '떨어진 충전기',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '22:30',
    lines: week0SceneChargerLines,
    // Not a loop — this scene hands off to the point-and-click phone-hunt
    // minigame (week0-scene-002-2). See MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week0-scene-002-2',
  },
  {
    id: 'week0-scene-002-2',
    order: 9,
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
    order: 10,
    name: '근데 이 열쇠 뭐지?',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '22:41',
    lines: week0Scene002_3Lines,
    // Reached from the phone-search minigame's GAME CLEAR redirect, not from
    // another VN scene's nextSceneId — listed here so /dev/week0 and the
    // dev asset selector can still target it directly for testing.
  },
  {
    id: 'week0-scene-frontdesk',
    order: 11,
    name: '프런트 문의 · 우편 봉투',
    location: 'Accommodation Lobby',
    introLabel: 'FRONT DESK',
    time: '22:50',
    // Merged week0-scene-frontdesk + week0-scene-mailroom (both Accommodation
    // Lobby, back to back).
    lines: mergeLines(week0SceneFrontdeskLines, week0SceneMailroomLines),
  },
  {
    id: 'week0-scene-firstnight',
    order: 12,
    name: '첫날 밤',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '23:15',
    lines: week0SceneFirstNightLines,
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
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week0Scenes.
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
    name: '전시장, K-01 · 사건 직전 사진',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '10:40',
    // Merged week1-scene-003 + 004 + 005 (all Pop-up Exhibition, back to
    // back). Hands off into the (not yet built) photo zoom-in investigation
    // minigame — see MINIGAME_ROUTES in game/index.html. Falls back to a
    // "MINIGAME START" placeholder overlay until that route exists.
    lines: mergeLines(week1Scene003Lines, week1Scene004Lines, week1Scene005Lines),
    nextSceneId: 'week1-scene-005-minigame',
  },
  {
    id: 'week1-scene-006',
    order: 4,
    name: '윤민아 · 애드리언 콜 조사',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '11:10',
    // Merged week1-scene-006 + 007 (both Pop-up Exhibition, back to back).
    lines: mergeLines(week1Scene006Lines, week1Scene007Lines),
  },
  {
    id: 'week1-scene-008',
    order: 5,
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
    order: 6,
    name: '첫 추리',
    location: 'Pop-up Exhibition',
    introLabel: 'CIRCULAR QUAY',
    time: '12:05',
    lines: week1Scene009Lines,
  },
  {
    id: 'week1-scene-010',
    order: 7,
    name: '탐정님과 조수',
    location: 'Circular Quay Harbour Walk',
    introLabel: 'CIRCULAR QUAY',
    time: '17:30',
    lines: week1Scene010Lines,
  },
  {
    id: 'week1-scene-011',
    order: 8,
    name: '첫 용의자 카드',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '21:40',
    lines: week1Scene011Lines,
  },
];

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
