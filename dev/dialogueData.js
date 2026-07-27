/* MISSING KEY — WEEK 1 · SCENE 01 v4 「진짜 왔네」
   Dialogue Set: dialogue-week1-scene001-v4
   Scene: week1-scene-001 (Sydney Airport Arrival Area, 09:30)
   Merged into week1-scene-flight (see that scene's header comment) — its
   first line below carries the sceneTransition into this location. */

// Every character, including the protagonist, shares one common
// CharacterTransform (see DevGameState in assetDb.js) — tune it once on any
// character and it applies to all of them, so heights stay unified.
// `expressions` lists which of the 10 dialogueExpressions below this
// character actually needs — per the "최종 감정 이미지 최소 제작표" in the
// character-art spec (44 portraits total across all 11 characters). 인물 DB's
// 감정표현 picker in /dev/upload only offers these, so NPCs can't be uploaded
// under an emotion the story never uses for them.
const dialogueCharacters = [
  // `outfits` (jisoo only, for now) lists which of the 10 dialogueOutfits
  // below this character has separate portrait sets for — see
  // DevGameState.getSelectedOutfit/setSelectedOutfit in assetDb.js. 인물 DB's
  // 옷 picker in /dev/upload only shows for characters with a non-empty
  // `outfits` list; every other character keeps the old (character,
  // expression) asset lookup untouched.
  { id: 'jisoo', name: '지수', role: 'protagonist', expressions: ['neutral', 'happy', 'annoyed', 'shocked', 'smirk', 'suspicious', 'serious'], outfits: ['outfit-01', 'outfit-02', 'outfit-03', 'outfit-04', 'outfit-05', 'outfit-06', 'outfit-07', 'outfit-08', 'outfit-09', 'outfit-10'] },
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
  // The Missing Key v4 §9 — 2주차 보조 증인 3명. 'daniel-guide'는 이미 쓰이는
  // 'daniel'(다니엘 우, 다른 인물)과 겹치지 않도록 별도 id를 쓴다. 마틴
  // 베일(§9.4)은 전화/음성으로만 등장하는 인물이라 이번 패스에서는 아직
  // 등록하지 않는다 — 해당 씬을 실제로 쓸 때 추가한다.
  { id: 'claire', name: '클레어 모건', role: 'other', expressions: ['neutral', 'annoyed', 'shocked', 'suspicious'] },
  { id: 'sophie', name: '소피 첸', role: 'other', expressions: ['neutral', 'curious', 'shocked'] },
  { id: 'daniel-guide', name: '다니엘 리드', role: 'other', expressions: ['neutral', 'curious', 'serious'] },
  // §9.4 — 마틴 베일은 전화로만 등장해 얼굴이 없다. 인물 DB에 초상이
  // 없으면 /play/game이 자동으로 실루엣 placeholder를 보여주므로
  // expressions는 'neutral' 하나만 등록해도 문제없다.
  { id: 'martin', name: '마틴 베일', role: 'other', expressions: ['neutral'] },
];

// Every dialogue line's `expression` field is one of these ids — 인물 DB
// (character upload) registers one image per (character, expression) pair,
// and /play/game looks that pair up to pick the portrait for each line.
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

// Outfit versions a character's `outfits` list (above) references by id —
// each (character, outfit) pair gets its own full set of 감정표현 portraits,
// registered the same way as the base (character, expression) pairs. Which
// outfit is currently "worn" is set per-character in /dev/upload's 인물 DB
// tab (DevGameState.getSelectedOutfit/setSelectedOutfit) and applies
// globally — /play/game just keeps asking for (characterId, expression) like
// before, and AssetDB resolves that against whichever outfit is selected.
const dialogueOutfits = [
  { id: 'outfit-01', label: '소프트 가디건 데이트룩' },
  { id: 'outfit-02', label: '시티 데님 캐주얼' },
  { id: 'outfit-03', label: '리본 니트 코디' },
  { id: 'outfit-04', label: '나이트 워크 니트' },
  { id: 'outfit-05', label: '하버 브리즈 코디' },
  { id: 'outfit-06', label: '더 록스 빈티지 원피스' },
  { id: 'outfit-07', label: '탐정 체크 재킷' },
  { id: 'outfit-08', label: '포토 퍼펙트 데이트룩' },
  { id: 'outfit-09', label: '시티 나잇 무드룩' },
  { id: 'outfit-10', label: '굿바이 시드니 코디' },
];

// 위 기본 라벨을 /dev/upload 인물 DB 탭 "이름 변경"으로 재정의한 값이 있으면
// 그걸 우선 반환한다 — AssetDB.prefetchOutfitNames()로 미리 채워 둔 동기
// 캐시(AssetDB.getOutfitNamesCached())를 읽으므로, 옷가게/옷장처럼 목록을
// 동기로 반복 렌더링하는 화면에서도 서버 왕복 없이 쓸 수 있다. prefetch를 아직
// 안 했거나 재정의가 없으면 dialogueOutfits의 기본 라벨로 조용히 폴백한다.
function getOutfitLabel(outfitId) {
  if (!outfitId) return '';
  const overrides = (typeof AssetDB !== 'undefined') ? AssetDB.getOutfitNamesCached() : {};
  if (overrides[outfitId]) return overrides[outfitId];
  const def = dialogueOutfits.find(o => o.id === outfitId);
  return def ? def.label : outfitId;
}

// 옷 부연설명 오버라이드 — /dev/upload 인물 DB 탭 "부연설명 수정"으로 재정의한
// 값이 있으면 그걸 우선 반환한다(getOutfitLabel과 같은 패턴). 재정의가 없으면
// 빈 문자열로 폴백 — 옷가게 카탈로그의 정적 description은 getShopItemDescription
// (shopItems.js)에서 이 함수를 먼저 확인한 뒤 자체 폴백으로 쓴다.
function getOutfitDescription(outfitId) {
  if (!outfitId) return '';
  const overrides = (typeof AssetDB !== 'undefined') ? AssetDB.getOutfitDescriptionsCached() : {};
  return overrides[outfitId] || '';
}

// Sentinel "expression" a minigame face photo is stored/looked up under in
// the same (character, expression) asset map 인물 DB uses — not a real mood,
// just one dedicated square close-up per character for small in-minigame
// portrait slots (e.g. minigame-eastwood's dlg-strip), which look wrong
// scaled down from a half-body 표정 crop. See "미니게임 얼굴 DB" in
// /dev/upload.
const MINIGAME_FACE_EXPRESSION = 'minigame-face';

/* MISSING KEY — WEEK 1 · SCENE 00 「시드니 상공」 v3
   Dialogue Set: dialogue-week1-scene-flight
   Scene: week1-scene-flight (In flight, 10 minutes before landing)
   No mystery here — per the brief, 1주차 opens on anticipation and reunion,
   not plot. This is purely the "지수 시점 오프닝 + 카톡" beat.
   Merged with week1Scene001Lines below (both part of the same "도착" beat,
   no minigame in between) — the location change from In Flight to Sydney
   Airport Arrival Area is carried by a `sceneTransition` marker on that
   array's first line instead of a scene-list split. See week1Scenes'
   week1-scene-flight entry (locations: [...]) for the two background slots
   this scene now needs. */
const week1SceneFlightLines = [
  { id: 'line-001', speaker: '', text: '시드니 상공.\n착륙 10분 전.', characterId: null },
  { id: 'line-002', speaker: '', text: '구름 아래로 시드니의 아침이 조금씩 보이기 시작했다.', characterId: null },
  { id: 'line-003', speaker: '', text: '창에 기댄 지수의 눈에\n낯선 나라의 낯선 아침 햇살이 비쳐 들었다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-004', speaker: '', text: '아홉 시간 반. 두 번의 기내식. 세 번쯤 깼다가 다시 잠든 시간.\n\n그리고 그보다 훨씬 긴, 영우 없이 보낸 여섯 달.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-005', speaker: '', text: '실감이 안 났다.\n그냥 어느 순간 도착해 있을 것만 같았다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-006', speaker: '', text: '기내 안내 방송이 흘러나오고,\n좌석벨트 표시등에 불이 들어왔다.', characterId: null },
  { id: 'line-007', speaker: '', text: '지수가 비행기 모드를 해제하자\n영우의 메시지가 한꺼번에 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '영우', text: '착륙했어????', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-009', speaker: '영우', text: '나 A 게이트 앞에서 기다리고 있어\n천천히 나와 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '영우', text: '어제부터 계속 도착 시간 검색하고 있었다는 건\n안 비밀 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '오.\n이번엔 위치 설명 정확한데요????', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '나 호주 살면서 성장했어.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-013', speaker: '지수', text: '아직 검증 전입니다\n서영우씨.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-014', speaker: '영우', text: '일단 착륙부터 하세요 손님 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-015', speaker: '지수', text: '가고 있잖아요오!!!!\n지금 하늘인데 어케 빨리 가!!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-016', speaker: '영우', text: '알써알써.\n조심히 와요 손님 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-017', speaker: '영우', text: '진짜 조심히 와.\n기다리고 있을게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-018', speaker: '지수', text: '...\n\n이따 봐요.', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'soft' },
  { id: 'line-019', speaker: '', text: '창밖으로 시드니 도심의 실루엣이\n구름 사이로 어렴풋이 드러났다.', characterId: null },
  { id: 'line-020', speaker: '', text: '지수는 웃으며 휴대폰을 내려놓았다.\n\n여행지가 가까워진다는 느낌보다,\n영우가 가까워진다는 느낌이 먼저 들었다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-021', speaker: '', text: '비행기가 서서히 고도를 낮추기 시작했다.', characterId: null },
];

// Pure stage-direction beats (no speaker) use characterId to say who, if
// anyone, stays on screen for that beat — keeps the portrait from flickering
// out and back in across a beat with no line of its own.
const week1Scene001Lines = [
  {
    id: 'line-001', speaker: '', text: '시드니 공항.\n오전 9시 30분.', characterId: null,
    sceneTransition: { backgroundKey: 'week1-scene-flight--arrival', introLabel: 'SYDNEY', time: '09:30' },
  },
  { id: 'line-002', speaker: '', text: '긴 입국 절차를 마친 지수가\n캐리어를 끌고 도착층으로 나왔다.', characterId: null },
  { id: 'line-003', speaker: '', text: '낯선 언어의 안내 방송, 낯선 냄새의 공기.\n지수는 잠깐 걸음을 멈추고 주위를 둘러봤다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '', text: '사람들 사이에서 영우가 손을 높이 흔들었다.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-005', speaker: '지수', text: '영크크!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '영우', text: '지수지수야!!!!', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-007', speaker: '', text: '지수가 캐리어를 놓고 뛰어가\n영우를 와락 껴안았다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '지수', text: '와...\n진짜 오랜만이다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-009', speaker: '영우', text: '웅.\n진짜 오랜만이야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '', text: '한참을 그렇게 안고 있다가\n지수가 먼저 살짝 몸을 떼고 영우를 올려다봤다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-011', speaker: '지수', text: '뭐야.\n살짝 탔어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '여기 해 진짜 세.\n적응하는 데 좀 걸렸어.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-013', speaker: '지수', text: '그래도 잘생김은 여전하네요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '오늘부터 갑자기 그런 말 하기예요????', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-015', speaker: '지수', text: '오랜만이니까 서비스로.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-015a', speaker: '영우', text: '근데 진짜\n매일 보고 싶었어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-015b', speaker: '지수', text: '아니 왜저래애애\n도착하자마자아아 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-015c', speaker: '지수', text: '바부야 👊', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-015d', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n그래도 웃었네.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-016', speaker: '영우', text: '비행 괜찮았어?\n많이 피곤해 보이는데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-017', speaker: '지수', text: '피곤하긴 한데\n얼굴 보니까 좀 괜찮아졌어요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-018', speaker: '영우', text: '가방도 줘.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '지수', text: '이건 내가 들게.\n캐리어만 부탁해요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-020', speaker: '영우', text: '웅웅.\n천천히 가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-021', speaker: '지수', text: '그래도 첫날이니까\n바로 숙소만 가면 안 돼요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-022', speaker: '영우', text: '그래서 잠깐 들를 데 있어.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-023', speaker: '지수', text: '오오.\n뭔가 준비한 냄새가 나는데요????', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-024', speaker: '영우', text: '냄새까지 맡지 마세요, 손님.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-025', speaker: '', text: '영우가 자연스럽게 캐리어를 받아 들고,\n지수는 그 옆에 붙어 공항역 표지판을 따라갔다.', characterId: null },
  { id: 'line-026', speaker: '지수', text: '근데 우리 바로 숙소 가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-027', speaker: '영우', text: '아니.\n첫날인데 시드니 봐야지.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-028', speaker: '지수', text: '헐.\n어디 가는데요????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-029', speaker: '영우', text: '서큘러키.\n오페라하우스랑 하버브리지 보러.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-030', speaker: '지수', text: '악 개쥬아아아!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-030a', speaker: '지수', text: '너무 좋쟈나 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-031', speaker: '영우', text: '대신 길 찾기는 지수가 해야 돼.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-032', speaker: '지수', text: '왜 갑자기 조건이 붙어요????', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-033', speaker: '영우', text: '김지수 시드니 생존교육 1교시.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-034', speaker: '지수', text: '오키!!!!\n선생님 따라오세요.\n제가 모시겠습니다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-035', speaker: '영우', text: '자신감은 완전 100점인데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-036', speaker: '지수', text: '실력은 이제부터 채워나가는 거죠!!!!', characterId: 'jisoo', expression: 'happy' },
];

/* MISSING KEY — WEEK 1 · SCENE 05 「낚시 수익 정산 · 진짜 같이 있네」 v08
   Dialogue Set: dialogue-week1-scene002-1
   Scene: week1-scene-002-1 (Eastwood Accommodation, 13:40)
   [v08 재편] 낚시 미니게임(week1-scene-circular-quay-minigame)의 "돌아가기"
   버튼이 곧장 이 씬으로 돌아온다(SHOP_TUTORIAL_RETURN_SCENE, sceneRoutes.js).
   낚시 정산 잡담으로 열어서 서큘러키 → 숙소 이동을 자연스럽게 이어 붙이고,
   곧바로 기존 "여기야 / 진짜 같이 있네" 방 리빌 비트로 넘어간다 — 배경은
   이 씬 고유의 기본 배경(week1-scene-002-1, 즉 숙소) 그대로라 별도
   sceneTransition이 필요 없다. */
const week1Scene002_1Lines = [
  { id: 'line-001', speaker: '', text: '숙소.\n오후 1시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '낚시를 마친 두 사람은 사진을 한 번 더 확인한 뒤 서큘러키 역으로 향했다.\n열차를 타고 숙소로 이동해 체크인을 마치고,\n짐을 풀며 오늘 하루를 되짚었다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '와.\n방금까지 진짜 낚시한 느낌이야!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '영우', text: '재밌었지?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '지수', text: '웅.\n근데 영우가 이걸 만들었다는 게 제일 웃겨.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '지수', text: '회사 다니면서 이런 것까지 언제 만들어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '영우', text: '밤에 조금씩.\n주말에 조금씩.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-008', speaker: '지수', text: '잠은 잔 거예요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '영우', text: '그건 넘어가고.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-010', speaker: '지수', text: '아니 그게 제일 중요한 부분인데요!!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-011', speaker: '영우', text: '옷 사려면\n앞으로 열심히 잡아야 합니다.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-012', speaker: '지수', text: '갑자기 압박 면접 시작.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-013', speaker: '영우', text: '오늘 수익 68P!!!!', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '첫날 공동재산 생겼네 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-015', speaker: '영우', text: '지분은 반반.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-016', speaker: '지수', text: '제가 잡았는데 왜 반반이에요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-017', speaker: '영우', text: '게임 만든 사람 지분.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-018', speaker: '지수', text: '음.\n그럼 저 7, 영우 3.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-019', speaker: '영우', text: '시작부터 불공정 계약이잖아!!!!', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-020', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎ\n이의 있으면 한 마리 더 잡아오세요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-021', speaker: '영우', text: '오늘은 이만 쉽시다 사장님.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022', speaker: '지수', text: '웅.\n이제 좀 피곤하다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-023', speaker: '영우', text: '거의 다 왔어.\n이 골목만 지나면 돼.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-024', speaker: '', text: '조용한 주택가 골목,\n작은 정원이 딸린 이층집 앞에서 영우가 걸음을 멈췄다.', characterId: null },
  { id: 'line-025', speaker: '영우', text: '여기야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-026', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-027', speaker: '지수', text: '진짜 여기 맞아요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-028', speaker: '영우', text: '웅.\n왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-029', speaker: '지수', text: '생각보다 너무 좋은데????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-030', speaker: '영우', text: '그치.\n사진보다 괜찮지?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-031', speaker: '지수', text: '흐으음.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-032', speaker: '영우', text: '그 표정 뭐야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-033', speaker: '지수', text: '영우가 고른 숙소치고\n너무 완벽해서요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-034', speaker: '영우', text: '아니 내가 평소에 뭘 어떻게 했길래!!!!', characterId: 'youngwoo', expression: 'annoyed' },
  { id: 'line-035', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎ\n칭찬이에요 칭찬.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-035a', speaker: '영우', text: '근데 숙소보다\n지수가 더 전망 좋은데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-035b', speaker: '지수', text: '샤갈\n왜저래애애!!!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-035c', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-036', speaker: '', text: '현관문을 열자\n볕이 잘 드는 거실과 작은 부엌이 한눈에 들어왔다.', characterId: null },
  { id: 'line-037', speaker: '지수', text: '와 진짜 좋다...\n너무 좋쟈나 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-038', speaker: '영우', text: '여행 내내 여기서 지낼 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-039', speaker: '지수', text: '너무 좋아서 실감이 안 나.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-040', speaker: '', text: '두 사람은 짐을 내려놓고\n잠시 방 안을 둘러봤다.', characterId: null },
  { id: 'line-041', speaker: '지수', text: '오늘 하루 진짜 알차게 놀았다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-042', speaker: '영우', text: '그러게.\n근데 지수 진짜 피곤해 보이는데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-043', speaker: '지수', text: '조금?\n근데 아직 저녁도 안 먹었잖아.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-044', speaker: '영우', text: '아 맞다.\n일단 뭐 좀 먹으러 나갔다 오자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-045', speaker: '지수', text: '웅.\n딱 가까운 데로만.', characterId: 'jisoo', expression: 'soft' },
];

/* MISSING KEY — WEEK 1 · SCENE 06 「첫날 저녁」 v09
   Dialogue Set: dialogue-week1-scene-dinner
   Scene: week1-scene-dinner (근처 식당, 14:20)
   [v09 재편] 저녁 식사 장면 자체는 들어내고, 저녁 먹으러 나갔다 온 사이
   폰을 잃어버렸다는 사실로 바로 넘어가는 짧은 전환부만 남겼다 — 뒤이은
   week1SceneChargerLines의 "폰이 없어진 걸 알아채는" 비트로 곧장 이어진다.
   sceneTransition은 여전히 필요하다(식당 배경/시간 표시가 이 전환의
   유일한 목적). Merged into week1-scene-002-1 (see that scene's header
   comment) — its first line below carries the sceneTransition into this
   location. */
const week1SceneDinnerLines = [
  {
    id: 'line-001', speaker: '', text: '숙소 근처 작은 식당.\n오후 2시 20분.', characterId: null,
    sceneTransition: { backgroundKey: 'week1-scene-002-1--dinner', introLabel: 'DINNER', time: '14:20' },
  },
  { id: 'line-002', speaker: '', text: '늦은 점심을 겸한 저녁을 간단히 먹고,\n두 사람은 숙소 쪽으로 천천히 걸어 돌아갔다.', characterId: null },
];

/* MISSING KEY — WEEK 1 · SCENE 07 「사라진 핸드폰」 v08
   Dialogue Set: dialogue-week1-scene-charger
   Scene: week1-scene-charger (Eastwood Accommodation, 20:30)
   [v08 재편] "다시 나갈 준비" 대신 밤에 충전기를 꽂으려다 폰이 없어진 걸
   알아채는 자연스러운 동기로 바꿨다. The phone is actually found in
   kitchen-fridge-gap and the key in bedroom-right-vent (both only inside the
   room-search minigame — see ROOM_SEARCH_CORE_ITEM_HOTSPOTS), so the
   call-and-listen beat below still leads toward the kitchen, matching where
   the phone actually turns up. Ends on a MINIGAME START beat — nextSceneId
   hands off to the existing point-and-click phone-hunt scene,
   week1-scene-002-2. Merged into week1-scene-002-1 (see that scene's header
   comment) — its first line below carries the sceneTransition back into the
   accommodation, reusing that scene's own default background key since it's
   the same room. */
const week1SceneChargerLines = [
  {
    id: 'line-001', speaker: '', text: '숙소.\n밤 8시 30분.', characterId: null,
    sceneTransition: { backgroundKey: 'week1-scene-002-1', introLabel: 'EASTWOOD', time: '20:30' },
  },
  { id: 'line-002', speaker: '', text: '오후 내내 낮잠과 짧은 산책으로 시간을 보낸 두 사람은\n다시 방으로 돌아와 침대에 걸터앉았다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '오늘 하루 진짜 꽉 찼다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-004', speaker: '영우', text: '그치.\n비행기에서부터 쉴 틈이 없었네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-005', speaker: '지수', text: '그래도 좋았어요 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-006', speaker: '영우', text: '나도.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-007', speaker: '', text: '창밖은 이미 어두워져 있었다.\n가로등 불빛이 커튼 틈으로 희미하게 들어왔다.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '내일도 이렇게 계속 놀 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '영우', text: '내일은 조금 여유 있게.\n오늘처럼 풀코스는 아니고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '지수', text: '다행이다.\n체력이 못 버틸 것 같았어요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '', text: '지수가 충전기를 꽂으려고\n가방을 뒤적였다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '어?', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-013', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-014', speaker: '지수', text: '내 폰 어디 갔지????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-015', speaker: '영우', text: '엉?\n아까 식당 나올 때까지는 들고 있었잖아.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-016', speaker: '지수', text: '그러니까.\n분명 있었는데.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-017', speaker: '지수', text: '가방 안에도 없고,\n주머니에도 없어요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-018', speaker: '지수', text: '방 여기저기 다 뒤져봐야겠어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-019', speaker: '영우', text: '웅웅.\n같이 찾아보자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-020', speaker: '', text: '두 사람은 침대 밑, 서랍, 가방 속까지\n한참을 뒤졌지만 폰은 보이지 않았다.', characterId: null },
  { id: 'line-021', speaker: '지수', text: '아 샤갈\n진짜 어디 갔지.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-022', speaker: '영우', text: '식당에 두고 온 건 아니겠지?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-023', speaker: '지수', text: '거기서 결제할 때도 썼던 것 같은데.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-024', speaker: '영우', text: '내 폰으로 전화해볼게.\n소리라도 들리면 찾기 쉬울 거야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-025', speaker: '', text: '영우가 지수의 번호로 전화를 걸었다.\n\n잠시 뒤,\n어디선가 희미한 진동음이 울렸다.', characterId: null },
  { id: 'line-026', speaker: '지수', text: '어?\n소리 저쪽에서 나는 것 같은데?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-027', speaker: '영우', text: '부엌 쪽 아니야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-028', speaker: '지수', text: '어.\n맞는 것 같아요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-029', speaker: '영우', text: '다행이다.\n숙소 안에는 있는 거잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-030', speaker: '지수', text: '웅.\n근데 왜 하필 부엌에 있지?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-031', speaker: '영우', text: '같이 가서 찾아보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* MISSING KEY — WEEK 1 · SCENE 08 「근데 이 열쇠 뭐지?」 v4
   Dialogue Set: dialogue-week1-scene002-3
   Scene: week1-scene-002-3 (Eastwood Accommodation, right after the phone-hunt
   minigame). Reached by minigame-phone-search/'s GAME CLEAR redirect, not by
   another scene's nextSceneId — see MINIGAME_ROUTES in game/index.html and
   the redirect at the bottom of minigame-phone-search/index.html. Narration/
   system beats use speaker:'' (no name shown), matching the convention used
   throughout week1Scene001Lines/week1Scene002_1Lines. This is the M.K.
   engraving reveal — the seed for the whole 4-week mystery — so it doesn't
   loop or dead-end; it ends deciding to call the landlord instead of going
   down to a lobby (week1-scene-frontdesk, now a phone call — see that
   scene's own header comment).
   [v4 정정] Phone was found in the kitchen fridge gap (matches
   ROOM_SEARCH_CORE_ITEM_HOTSPOTS' 'jisu-phone': 'kitchen-fridge-gap'), not
   tangled in the bed sheets — week1SceneChargerLines no longer sets up a
   charger/under-bed mishap. The key is also a fresh reveal here (found via
   the vent + long-hook combo inside the minigame itself), not something
   glimpsed earlier in the VN dialogue. */
const week1Scene002_3Lines = [
  { id: 'line-001', speaker: '지수', text: '찾았다!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-002', speaker: '영우', text: '아 다행이다.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-003', speaker: '지수', text: '냉장고 틈에 끼어 있었네.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-004', speaker: '영우', text: '거긴 대체 어떻게 들어간 거야.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '그러니까요.\n저도 신기해요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-006', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n아무튼 찾아서 다행이다', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-006a', speaker: '지수', text: '아 근데 손전등이랑 옷걸이,\n지지대까지 다 동원했잖아요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-006b', speaker: '영우', text: '휴대폰 하나 찾는 데\n장비가 이렇게 많이 필요할 줄이야.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-006c', speaker: '지수', text: '숙소 탈출 게임인 줄 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-007', speaker: '지수', text: '근데 찾다가 이것도 나왔어요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-008', speaker: '', text: '지수가 손바닥 위에 올려둔 물건을\n영우에게 보여준다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '', text: '[ 낡은 황동 열쇠 ]', characterId: null },
  { id: 'line-010', speaker: '영우', text: '열쇠네.\n이건 어디서 나온 거야?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-011', speaker: '지수', text: '환기구 안에요.\n손이 겨우 닿아서 꺼냈어요.', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'line-012', speaker: '영우', text: '여긴 카드키고.', characterId: 'youngwoo', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-accommodation-keycard', code: 'E-000', category: 'physical', title: '숙소 카드키',
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
        effects: [
          {
            type: 'addQuestion',
            question: { id: 'question-key-hunch', title: '이 열쇠, 위험한 물건일까?', description: '지수는 열쇠에서 왠지 불길한 기운을 느꼈다.' },
          },
          { type: 'addSatisfaction', amount: -1 },
        ],
      },
      {
        id: 'hunch-curious', label: '“그냥 순수하게 궁금한데?”',
        effects: [
          {
            type: 'addQuestion',
            question: { id: 'question-key-hunch', title: '이 열쇠는 대체 누구 것일까?', description: '지수는 순수한 호기심을 느꼈다.' },
          },
          { type: 'addSatisfaction', amount: 1 },
        ],
      },
    ],
  },
  { id: 'line-021', speaker: '영우', text: '웅웅.\n사진부터 찍자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-022', speaker: '영우', text: '그리고 숙소 관리자한테 물어보자.\n객실 비품이면 바로 돌려줘야 하니까.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-023', speaker: '지수', text: '오키.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-023a', speaker: '지수', text: '근데 지금 시간에 전화해도 돼요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-023b', speaker: '영우', text: '조금 늦긴 했는데,\n분실물 얘기니까 급한 거로 쳐주지 않을까.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-023c', speaker: '지수', text: '그래도 되려나.\n일단 문자로 먼저 남겨볼까요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-023d', speaker: '영우', text: '음, 사진도 같이 보내야 하니까\n그냥 전화로 짧게 여쭤보고 문자로 사진 넘기자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-024', speaker: '', text: '지수는 열쇠의 앞뒤를 촬영한 뒤,\n예약 확인서에 적힌 연락처를 찾았다.', characterId: null },
  { id: 'line-025', speaker: '지수', text: '어.\n잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-027', speaker: '', text: '통화 버튼 위에 표시된 연락처 이름이\n지수의 눈에 들어왔다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-028', speaker: '', text: '[ M. KOV... ]', characterId: null },
  { id: 'line-029', speaker: '지수', text: '영우.\n이 사람 이름도 M.K.로 시작하는데?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-030', speaker: '영우', text: '그러네.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-030a', speaker: '영우', text: '어디 보자...', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-030b', speaker: '', text: '영우가 지수의 화면을 넘겨받아\n연락처 전체 이름을 확인한다.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-030c', speaker: '영우', text: '음.\n이름 전체는 저장이 안 돼 있어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-030d', speaker: '지수', text: '예약 사이트에서 그냥 그렇게 넘어온 거겠죠?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-031', speaker: '영우', text: '근데 M이랑 K가 흔하긴 하니까\n일단 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '웅.\n나도 그 생각이야.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-032a', speaker: '지수', text: '근데 손이 왜 이렇게 떨리지.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-032b', speaker: '영우', text: '별거 아닐 수도 있어.\n그냥 편하게 물어봐.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-032c', speaker: '지수', text: '웅.\n알겠어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-033', speaker: '', text: '지수가 통화 버튼을 누른다.\n\n몇 번의 신호음 끝에\n낮고 잠긴 목소리가 들려왔다.', characterId: null },
];

/* MISSING KEY — WEEK 1 · SCENE 09 「집주인과의 통화」 v3
   Dialogue Set: dialogue-week1-scene-frontdesk
   Scene: week1-scene-frontdesk (Sydney Accommodation, continues directly
   from week1Scene002_3Lines — same call, same room, no location change).
   The landlord's hesitation on "M.K." is the seed for the whole 4-week
   mystery; per the brief it must NOT resolve into a full name here.
   [2주차 추리 개편 v2] The full name is no longer revealed anywhere in Week 2
   either (see week2-scene-007/009/011/013 in this file) — the overhaul brief
   requires Week 2 to end with only the M.K. / MK_Consult account-level clue,
   full identity deferred further out. week3-scene-012 onward still uses the
   literal name "Mika Kovac"/"미카 코바치" (written before this overhaul), which
   is now a continuity seam a future Week 3 pass should address. */
const week1SceneFrontdeskLines = [
  { id: 'line-001', speaker: '', text: '신호음이 두 번, 세 번 울렸다.\n지수는 숨을 한 번 고르고 휴대폰을 귀에 붙였다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-001a', speaker: '집주인', text: '여보세요?', characterId: null },
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
  { id: 'line-014a', speaker: '', text: '지수가 통화 중에 사진 두 장을 문자로 전송했다.\n전송 완료를 알리는 짧은 진동이 울렸다.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-014b', speaker: '집주인', text: '네, 받았습니다.\n잠시만요.', characterId: null },
  { id: 'line-014c', speaker: '', text: '수화기 너머로\n종이 넘기는 소리가 잠깐 들렸다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-015', speaker: '집주인', text: '당장은 객실 시설과 관련된 열쇠는 아닌 것 같으니\n잃어버리지 않게 보관만 부탁드립니다.', characterId: null },
  { id: 'line-016', speaker: '집주인', text: '확인되는 게 있으면\n내일 연락드리겠습니다.', characterId: null },
  { id: 'line-016a', speaker: '영우', text: '혹시 저희가 따로 여쭤볼 게 있으면\n이 번호로 다시 연락드려도 될까요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-016b', speaker: '집주인', text: '네, 편하실 때 연락 주세요.', characterId: null },
  { id: 'line-017', speaker: '지수', text: '알겠습니다.\n늦게 연락드려서 죄송해요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-018', speaker: '집주인', text: '괜찮습니다.\n편안한 밤 보내세요.', characterId: null },
  { id: 'line-019', speaker: '', text: '통화가 종료된다.', characterId: null },
  { id: 'line-020', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'blank' },
  { id: 'line-021', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '방금 들었어?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-023', speaker: '영우', text: 'M.K. 말했을 때\n잠깐 멈춘 거?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-024', speaker: '지수', text: '웅.\n모른다는 사람 반응치고는\n한 번 더 확인하는 느낌이었어.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-025', speaker: '영우', text: '나도 조금 그렇게 들리긴 했어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-025a', speaker: '지수', text: '종이 넘기는 소리도 좀 길었고.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-025b', speaker: '영우', text: '단순히 기록 찾느라 그랬을 수도 있어.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-025c', speaker: '지수', text: '그치.\n그럴 수도 있지.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-026', speaker: '지수', text: '근데 목소리만 듣고\n숨기는 게 있다고 단정하진 말자.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-027', speaker: '영우', text: '오키.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-028', speaker: '영우', text: '내일 답 오는지 보고,\n안 오면 한 번 더 물어보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-029', speaker: '지수', text: '웅.\n그게 좋겠다.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-029a', speaker: '지수', text: '아, 근데 정작 원래 찾던 폰 얘기는\n한마디도 안 했네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-029b', speaker: '영우', text: '열쇠 임팩트가 너무 셌지.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-030', speaker: '', text: '영우가 책상 위에 있던 작은 투명 봉투를 가져온다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '영우', text: '여기 넣어두자.\n그냥 두면 또 어디 갔는지 찾을 것 같아.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '아니 왜 저를 보면서 말해요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-033', speaker: '영우', text: '오늘 휴대폰 실종 사건의 전력이 있으셔서 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-034', speaker: '지수', text: '그 사건은 해결됐거든요!!!!', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-035', speaker: '영우', text: '범인도 검거됐고?', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-036', speaker: '지수', text: '웅.\n냉장고 틈이 범인이었어요 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-037', speaker: '영우', text: '끝까지 냉장고 탓이네 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  {
    id: 'line-038', speaker: '', text: '[ ITEM ACQUIRED ]\n\nUNKNOWN KEY\n각인: M.K.', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mk-key', code: 'E-001', category: 'physical', title: 'M.K. 황동 열쇠',
        description: '환기구에서 나온 낡은 황동 열쇠. 뒷면에 "M.K."라는 이니셜이 새겨져 있다. 1주차의 미해결 기념품.',
        discoveredLocationText: '숙소 환기구',
      },
    }],
  },
];

/* MISSING KEY — WEEK 1 · SCENE 10 「첫날 밤」
   Dialogue Set: dialogue-week1-scene-firstnight
   Scene: week1-scene-firstnight (Sydney Accommodation, 23:15)
   Closes out 1주차 — no nextSceneId, this is the last scene of the week. */
const week1SceneFirstNightLines = [
  { id: 'line-001', speaker: '', text: '숙소.\n밤 9시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '두 사람은 침대에 기대앉아\n다음 날 일정을 간단히 확인했다.\n\n투명 봉투에 든 열쇠는\n협탁 위에 조용히 놓여 있었다.', characterId: null },
  { id: 'line-002a', speaker: '', text: '창밖으로 이웃집 개 짖는 소리가 한 번 들리다 멎었다.\n방 안은 다시 조용해졌다.', characterId: null },
  { id: 'line-002b', speaker: '지수', text: '아 맞다.\n내일 답장 오면 저한테도 바로 알려줘요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-002c', speaker: '영우', text: '당연하지.\n혼자 확인 안 해.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '지수', text: '내일은 뭐부터 해요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '아침 먹고 시티 쪽 가자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '지수 컨디션 괜찮으면\n오페라하우스 쪽까지 걷고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '헐!!!!\n개쥬아.', characterId: 'jisoo', expression: 'happy' },
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
  { id: 'line-027a', speaker: '영우', text: '지수야\n나 강낭콩으로 삼행시 해볼게.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-027b', speaker: '지수', text: '하지마\n벌써 불안해.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-027c', speaker: '영우', text: '강\n강제로 하는 말 아니고', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-027d', speaker: '영우', text: '낭\n낭만적으로 말하는 건데', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-027e', speaker: '영우', text: '콩\n콩닥거려\n지수 때문에', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-027f', speaker: '지수', text: '......', characterId: 'jisoo', pauseBeforeMs: 250, expression: 'blank' },
  { id: 'line-027g', speaker: '지수', text: '미쳤나봐아아', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-027h', speaker: '지수', text: '으으으..\n강낭콩!!!!!', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-027i', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n반응 진짜 좋은데.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-028', speaker: '', text: '한참을 웃고 난 뒤,\n방 안은 조금씩 조용해졌다.', characterId: null },
  { id: 'line-029', speaker: '지수', text: '영우.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-030', speaker: '영우', text: '웅.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '지수', text: '오늘 진짜 좋았어.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-032', speaker: '영우', text: '나도.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-032a', speaker: '', text: '지수는 무릎을 세우고 그 위에 턱을 얹은 채\n한동안 협탁 위의 열쇠를 바라봤다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-032b', speaker: '지수', text: '근데 이상하다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-032c', speaker: '영우', text: '뭐가?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-032d', speaker: '지수', text: '분명 무섭거나 찝찝해야 하는데,\n이상하게 하나도 안 무서워요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-032e', speaker: '지수', text: '영우가 옆에 있어서 그런가.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-032f', speaker: '영우', text: '...\n그런 말은 미리 예고하고 해줘.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-032g', speaker: '지수', text: '왜요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-032h', speaker: '영우', text: '심장이 준비가 안 됐잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-032i', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎ\n뭐예요 그게.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-033', speaker: '지수', text: '아직도 좀 꿈 같긴 한데.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-034', speaker: '영우', text: '내일 일어나도 여기 있을게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-035', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-036', speaker: '지수', text: '아 진짜아.\n마지막에 또 그러네.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-036a', speaker: '영우', text: '왜.\n또 좋으면서.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-036b', speaker: '지수', text: '아니거든요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-036c', speaker: '지수', text: '...\n조금 좋아요.', characterId: 'jisoo', pauseBeforeMs: 250, expression: 'soft' },
  { id: 'line-037', speaker: '영우', text: 'ㅎㅎ\n잘 자 지수야.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-038', speaker: '지수', text: '웅.\n영우도 잘 자.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-038a', speaker: '', text: '영우가 협탁 램프를 껐다.\n방 안이 어둑해지고, 창밖 가로등 빛만 옅게 남았다.', characterId: null },
  { id: 'line-039', speaker: '', text: '얼마 지나지 않아\n두 사람의 대화도 천천히 잦아들었다.', characterId: null },
  { id: 'line-040', speaker: '', text: '협탁 위,\n작은 황동 열쇠만이 조용히 남아 있었다.', characterId: null },
  { id: 'line-041', speaker: '', text: '[ M.K. ]', characterId: null },
  {
    id: 'line-042', speaker: '', text: '1주차 종료.', characterId: null,
    // The Missing Key v1 §5.6 — outfit-w0-night-walk 해금 조건.
    effects: [{ type: 'setFlag', key: 'week1Completed', value: true }],
  },
];

/* MISSING KEY — WEEK 1 · SCENE 1-2 「시드니 지리 파악」 v4
   Dialogue Set: dialogue-week1-scene001-2
   Scene: week1-scene-001-2 (Sydney Airport arrivals concourse, map signage, 09:45)
   Setup beat before the route-map minigame — teaches 서큘러키(Circular
   Quay)/공항/숙소(Eastwood)/영우 근무지(Marayong) as four map anchors instead
   of the old 3-stop station-name drill. nextSceneId hands off to that
   minigame page directly (not another VN scene).
   [v4 지리 정정] Eastwood is the accommodation (한인 상권이 가까워 지내기
   편한 곳) and Marayong is 영우's workplace — the reverse of the v3 draft,
   which had Marayong as the stay and a since-dropped Kings Park as the
   workplace. minigameStages on this scene's week1Scenes registry entry
   below now lists the 4 locations this setup dialogue teaches.
   [써큘러키 낚시 씬 추가] 시티(Sydney CBD)라는 뭉뚱그린 명칭 대신, 항구 바로
   앞의 실제 지명인 서큘러키(Circular Quay)를 두 번째 지점으로 쓴다 — 열차로
   지나가는 실제 정류장이자, week1-scene-circular-quay(낚시 미니게임으로
   이어짐)가 벌어지는 곳이기도 하다. */
const week1Scene001_2Lines = [
  { id: 'line-001', speaker: '', text: '공항 도착층을 빠져나온 두 사람은\n열차 표지판과 시드니 광역 지도가 있는 안내판 앞에 멈춰 섰다.', characterId: null },
  { id: 'line-001a', speaker: '', text: '아침 시간대라 그런지 안내판 주변이 캐리어를 끄는 사람들로 붐볐다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-003', speaker: '지수', text: '우리 지금 시드니 어디쯤 있는 거예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '여기.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '', text: '영우가 지도 아래쪽에 있는 공항 표시를 가리킨다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-006', speaker: '영우', text: '공항은 서큘러키(Circular Quay)보다 아래쪽에 있어.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '엥.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '지수', text: '나 시드니 도착했으니까\n바로 오페라하우스 옆인 줄 알았는데????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n시드니가 그렇게 작진 않아요 손님', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-010', speaker: '지수', text: '아아.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '지수', text: '지금부터 현실 지리 수업 시작이네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-012', speaker: '영우', text: '웅.\n김지수 시드니 생존교육 1교시.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-013', speaker: '지수', text: '선생님 설명 잘하세요.\n평가 들어갑니다.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-014', speaker: '영우', text: '일단 공항이 여기.\n\n서큘러키는 그 위쪽.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-015', speaker: '영우', text: '오페라하우스랑 하버브리지는\n서큘러키 바로 옆 항구 쪽에 있고.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-016', speaker: '지수', text: '공항 아래쪽.\n서큘러키 위쪽.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '오키.\n여기까진 이해했어요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-018', speaker: '영우', text: '그리고 우리가 묵을 곳은\n서큘러키에서 조금 더 들어간 Eastwood야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-019', speaker: '지수', text: '숙소가 Eastwood예요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-020', speaker: '', text: '지수가 지도의 Eastwood 표시를 누른다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-021', speaker: '영우', text: '웅.\n한인 식당이랑 마트도 많아서 지내기 편해.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '지수', text: '헐.\n한국 음식 있어요?', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-022x', speaker: '지수', text: '완전 개쥬아잖아 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-023', speaker: '영우', text: '지리 설명보다 반응이 훨씬 빠른데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-023a', speaker: '지수', text: '아니 비행기에서 기내식만 먹었더니\n진짜 김치찌개 생각이 계속 나서요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-023b', speaker: '영우', text: '숙소 근처에 괜찮은 데 있어.\n내일이라도 가자.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-024', speaker: '지수', text: '먹는 건 중요하니까요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-025', speaker: '지수', text: '근데 생각보다 서큘러키에서 가깝네????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-026', speaker: '영우', text: '웅.\n그래서 오가기 편해.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-027', speaker: '지수', text: '공항에서 서큘러키 쪽으로 올라갔다가\n거기서 좀 더 들어가는 느낌?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-028', speaker: '영우', text: '오.\n마자마자.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-029', speaker: '지수', text: '벌써 지리 천재!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-030', speaker: '영우', text: '아직 한 군데 남았습니다.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-031', speaker: '지수', text: '뭐가 또 있어요.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-032', speaker: '영우', text: '내가 일하는 곳.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-033', speaker: '', text: '영우가 지도 서쪽 저 멀리 Marayong 지역을 가리킨다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-034', speaker: '영우', text: '여기가 Marayong.\n내가 일하는 곳은 여기야.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-035', speaker: '지수', text: '어.\n숙소보다 훨씬 멀지 않아요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-036', speaker: '영우', text: '웅.\n꽤 멀어서 출근할 때 좀 걸려.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-037', speaker: '지수', text: '헐.\n매일 그렇게 가요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-038', speaker: '영우', text: '웅웅.\n그래도 이제 적응됐어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-038a', speaker: '지수', text: '왕복으로 치면 시간 꽤 많이 뺏기겠다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-038b', speaker: '영우', text: '그 시간에 이어폰 끼고\n지수한테 보낼 사진 리스트 정리했어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-038c', speaker: '지수', text: '아 그게 그렇게 나온 거였구나.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-039', speaker: '지수', text: '오오.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-040', speaker: '지수', text: '여기가 영우 출몰 지역이구나.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-041', speaker: '영우', text: '출몰은 뭐야 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-042', speaker: '지수', text: '주로 야간에 발견됨.\n커피와 도시락을 들고 다님.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-043', speaker: '영우', text: '아 너무 정확한데 ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-044', speaker: '영우', text: '정리하면,\n\n공항은 남동쪽.\n\n서큘러키는 공항보다 위쪽.\n\n숙소 Eastwood는 서큘러키에서 좀 더 들어간 쪽.\n\n내 일터 Marayong은 숙소보다 훨씬 먼 서쪽.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-045', speaker: '지수', text: '잠만.\n내가 해볼게.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-046', speaker: '지수', text: '공항 여기.\n\n서큘러키 여기.\n\n숙소 Eastwood 여기.\n\n영우 일하는 Marayong 여기.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-047', speaker: '영우', text: '오.\n다 맞았어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-048', speaker: '지수', text: '야르!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-049', speaker: '지수', text: '이제 저 시드니 사람 다 됐죠?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-050', speaker: '영우', text: '아직 열차도 안 탔는데요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-051', speaker: '지수', text: '아놔.\n칭찬 좀 길게 해줘요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-052', speaker: '영우', text: '잘했어 지수야.\n진짜 처음 본 것치고 엄청 빨리 찾았어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-053', speaker: '지수', text: '헤헤 ㅎㅎㅎㅎㅎㅎ\n이제 됐어요!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-054', speaker: '영우', text: '그럼 이제\n지도에서 네 곳을 직접 찾아보자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-055', speaker: '', text: 'MINIGAME START', characterId: null },
];

/* MISSING KEY — WEEK 1 · SCENE 03 「열차 — 지도에서 현실로」 v08
   Dialogue Set: dialogue-week1-scene-train
   Scene: week1-scene-train (Sydney Trains, 10:05)
   minigame-eastwood's GAME CLEAR redirect hands off here (not straight to
   the shop scene) — this scene opens with a short callback to the just-
   finished map minigame, then settles into v08's actual train-ride content
   (tiredness/hunger banter). [v08 재편] nextSceneId now goes to
   week1-scene-shop-intro instead of week1-scene-circular-quay — the "one
   stop early at Circular Quay" beat that used to open the old
   circular-quay scene is folded into this scene's own closing lines below,
   since that's the geography that puts them right by 더 록스 골목 for the
   shop discovery next.

   [레이튼 퀴즈 삽입] 지수가 심심해서 퍼즐 앱을 켜보는 짧은 비트 뒤로
   week1SceneTrainLines가 끊긴다 — nextSceneId가 week1-scene-shop-intro
   대신 week1-scene-train-minigame(PZ-H02, /play/minigame-layton/)으로
   바뀌었고, 나머지 대화는 week1SceneTrainLines2로 옮겨 그 미니게임 다음
   씬(week1-scene-train-2)에 붙였다. */
const week1SceneTrainLines = [
  { id: 'line-001', speaker: '지수', text: '오오.\n이제 좀 감 잡았어요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-002', speaker: '영우', text: '그치.\n나중에 장소 이름 나와도 대충 알겠지?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '', text: 'Sydney Trains 열차 안.\n오전 10시 05분.', characterId: null },
  { id: 'line-004', speaker: '', text: '공항역에서 열차에 오른 두 사람은 나란히 앉았다.\n지수는 노선도에서 Circular Quay를 찾아 손가락으로 짚었다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '지수', text: '공항에서 시티 쪽으로 올라가서\n여기서 내리는 거죠?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-006', speaker: '영우', text: '웅웅!!!!\n완전 정확해.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-007', speaker: '지수', text: '야르~\n벌써 시드니 지리 접수 완료.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-008', speaker: '영우', text: '아직 한 정거장도 안 갔는데요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-009', speaker: '지수', text: '자신감이 중요합니다 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009a', speaker: '', text: '열차 안내 방송이 낯선 억양의 영어로 흘러나왔다.\n지수는 그 소리를 몇 초간 가만히 듣고 있었다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009b', speaker: '지수', text: '진짜 다른 나라구나.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-009c', speaker: '영우', text: '이제 알았어?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-009d', speaker: '지수', text: '머리로는 알았는데\n지금 실감이 확 나서요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-010', speaker: '', text: '열차가 지상 구간을 지나자\n낯선 건물과 도로가 창밖으로 빠르게 흘러갔다.', characterId: null },
  { id: 'line-011', speaker: '영우', text: '비행기에서 좀 잤어?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '자긴 잤는데\n목이 이렇게 꺾여서 옆사람이 쳐다봤어요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-013', speaker: '영우', text: '어떻게 잤길래 ㅋㅎㅋㅎㅋㅎㅋㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-014', speaker: '지수', text: '살기 위해 잔 거예요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015', speaker: '영우', text: '아구.\n진짜 고생했네.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-015a', speaker: '지수', text: '아 맞다, 저 심심해서 비행기에서 이상한 퍼즐 앱 깔았거든요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-015b', speaker: '영우', text: '오, 뭔데?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-015c', speaker: '지수', text: '레이튼풍 두뇌 퍼즐이래요.\n한 문제만 보여줄게요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-015d', speaker: '영우', text: '궁금한데.\n한번 보자.', characterId: 'youngwoo', expression: 'soft' },
];

// 이후 대화(원래 line-016부터)는 week1SceneTrainLines2로 분리했다 —
// 퍼즐 앱 미니게임(week1-scene-train-minigame, PZ-H02)이 스토리 씬 사이에
// 끼어드는 별도 라우팅 페이지라 여기서 한 번 끊어야 한다(week1Scenes의
// week1-scene-train.nextSceneId → week1-scene-train-minigame → 미니게임의
// mkShopReturnUrl로 여기 이어짐, week1-scene-circular-quay/-minigame 쌍과
// 같은 패턴). 정답을 몰라도 뒤로가기로 바로 여기 돌아올 수 있어 진행에는
// 영향이 없다.
const week1SceneTrainLines2 = [
  { id: 'line-016', speaker: '지수', text: '영우는 어제 몇 시에 잤어요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-017', speaker: '영우', text: '음.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-018', speaker: '지수', text: '그 음 뭐야.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-019', speaker: '영우', text: '두 시쯤?', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-020', speaker: '지수', text: '그게 일찍 잔 거예요?????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-021', speaker: '영우', text: '내 기준에는.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-021a', speaker: '지수', text: '설레서 그런 거예요,\n아니면 그냥 원래 그래요?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021b', speaker: '영우', text: '둘 다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-021c', speaker: '지수', text: '아 뭐야 그 대답 반칙이잖아요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-021d', speaker: '지수', text: '바부야 👊', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-021e', speaker: '영우', text: 'ㅎㅎㅎㅎㅎㅎ\n알겠어 알겠어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022', speaker: '지수', text: '숙소 가면 둘 다 좀 쉬어요.\n알겠죠?', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-023', speaker: '영우', text: '웅.\n근데 그 전에 데이트부터.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-024', speaker: '지수', text: '오.\n그 말은 좋다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-024a', speaker: '', text: '열차가 지하 구간으로 들어서며\n창밖 풍경이 어둠으로 바뀌었다.', characterId: null },
  { id: 'line-024b', speaker: '지수', text: '어.\n갑자기 캄캄해졌다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-024c', speaker: '영우', text: '시티 들어가는 구간이야.\n이제 거의 다 왔어.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-025', speaker: '', text: '안내방송에 Circular Quay가 들리자\n두 사람은 동시에 자리에서 일어났다.', characterId: null },
  { id: 'line-026', speaker: '지수', text: '영우 가자!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-027', speaker: '영우', text: '캐리어 두고 갈 뻔했어 지수야.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-028', speaker: '지수', text: '아.\n흥분해서 잠깐 잊음.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-029', speaker: '영우', text: '여행 시작부터 짐 잃어버리면 안 됩니다 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
];

/* MISSING KEY — WEEK 1 · SCENE 06 「서큘러키 · 사진과 낚시 제안」 v08
   Dialogue Set: dialogue-week1-scene-circular-quay
   Scene: week1-scene-circular-quay (Circular Quay Waterfront, 11:00)
   [v08 재편] 더 록스 옷가게(week1-scene-shop-intro/-visit) 다음 비트로
   옮겨서, 사진 찍고 노는 관광 파트와 "돈 벌자" 낚시 제안을 한 씬에 담았다.
   지수가 저번에 낚시 해보고 싶다고 했던 것도 함께 챙겨서, 옷값을 벌자는
   동기와 지수의 오랜 바람을 같이 풀어주는 구조로 만들었다. Hands off into
   the standalone fishing minigame (MINIGAME_ROUTES['week1-scene-circular-
   quay-minigame'] in dev/data/sceneRoutes.js) instead of another VN scene. */
const week1SceneCircularQuayLines = [
  { id: 'line-001', speaker: '', text: 'Circular Quay 워터프론트.\n오전 11시.', characterId: null },
  { id: 'line-002', speaker: '', text: '워터프론트가 한눈에 펼쳐졌다.\n한쪽에는 오페라하우스, 반대쪽에는 하버브리지,\n앞쪽으로는 페리가 천천히 움직였다.', characterId: null },
  { id: 'line-003', speaker: '지수', text: '헐....', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-004', speaker: '지수', text: '영우.\n나 진짜 시드니 왔어.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-005', speaker: '영우', text: '그러게.\n이제 좀 실감 나지?', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '웅.\n사진에서 보던 게 다 여기 있자나.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006a', speaker: '', text: '갈매기 몇 마리가 낮게 날아 지나갔다.\n바닷바람에서 짠 내가 났다.', characterId: null },
  { id: 'line-006b', speaker: '지수', text: '바람 냄새까지 다르네요.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-006c', speaker: '영우', text: '이게 진짜 바다 냄새야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-007', speaker: '영우', text: '일단 사진 찍어줄게.\n저기 서봐.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-008', speaker: '지수', text: '잠만.\n머리 괜찮아요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '영우', text: '예뻐.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-010', speaker: '지수', text: '아니 머리 물어봤자나아.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-011', speaker: '영우', text: '머리도 예뻐.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-012', speaker: '지수', text: '미쳤나봐아아.\n빨리 찍어요!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-013', speaker: '', text: '영우가 여러 장을 찍고\n지수에게 화면을 보여줬다.', characterId: null },
  { id: 'line-014', speaker: '지수', text: '오.\n이거 개쥬아.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014a', speaker: '지수', text: '너무 좋쟈나 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-015', speaker: '영우', text: '잠깐만,\n바람 덜 불 때 한 장만 더 찍자.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-016', speaker: '지수', text: '웅웅.\n이번엔 같이 찍자.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-017', speaker: '', text: '두 사람은 오페라하우스, 하버브리지, 페리 선착장을\n배경으로 사진을 남겼다.', characterId: null },
  { id: 'line-018', speaker: '지수', text: '잠만.\n표정 왜 이렇게 긴장했어요????', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-019', speaker: '영우', text: '여자친구가 찍어주니까\n잘 나오고 싶어서.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-020', speaker: '지수', text: '아 ㅋㅎㅋㅎㅋㅎㅋㅎ\n그럼 한 장 더. 이번엔 웃어요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-021', speaker: '영우', text: '지수 보면 자동으로 웃는데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '지수', text: '왜저래애애.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-022d', speaker: '지수', text: '미쳤나봐아아', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-022e', speaker: '지수', text: '바부야 👊', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-022f', speaker: '영우', text: 'ㅋㅎㅋㅎㅋㅎㅋㅎㅋㅎ\n알겠어 알겠어.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022a', speaker: '', text: '지나가던 관광객이 둘의 사진을 보고\n엄지를 슬쩍 들어 보였다.', characterId: null },
  { id: 'line-022b', speaker: '지수', text: '오오, 인정받았다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-022c', speaker: '영우', text: '봐.\n내 촬영 실력 국제적으로 검증됨.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-023', speaker: '', text: '한참 사진을 찍고 난 뒤\n두 사람은 난간에 기대 물을 바라봤다.', characterId: null },
  { id: 'line-024', speaker: '', text: '가까운 부두에서\n낚싯대를 드리운 사람들이 보였다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-025', speaker: '지수', text: '어?\n저기 낚시한다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-026', speaker: '영우', text: '그러네.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-027', speaker: '지수', text: '여기서도 잡혀요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-028', speaker: '영우', text: '조금만 더 놀 힘 있어?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-029', speaker: '지수', text: '웅.\n왜요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-030', speaker: '영우', text: '저기서 낚시할 수 있대.\n아까 옷도 사고 싶다 했으니까,\n잡은 거 팔아서 돈 좀 벌어볼까?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-031', speaker: '지수', text: '여행 와서 진짜 낚시로 옷값 버는 거예요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-032', speaker: '영우', text: '게임이니까 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-033', speaker: '영우', text: '그리고 지수 저번에\n낚시 한번 해보고 싶다고 했었잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034', speaker: '지수', text: '그걸 기억하고 있었어요??', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-035', speaker: '영우', text: '당연하지!!!!', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-036', speaker: '지수', text: '완전 감동...\n근데 저 진짜 한 번도 안 해봤는데.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-036a', speaker: '지수', text: '낚싯대도 못 잡아봤고,\n미끼도 무서워요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-036b', speaker: '영우', text: '미끼는 화면 안에서만 있는 거라\n걱정 안 해도 돼.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-036c', speaker: '지수', text: '아 그러네.\n다행이다.', characterId: 'jisoo', expression: 'soft' },
  { id: 'line-037', speaker: '영우', text: '괜찮아.\n내가 알려줄게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-038', speaker: '지수', text: '오키.\n그럼 체력 괜찮을 때 한 판만.', characterId: 'jisoo', expression: 'smirk' },
  // [circularkey-fishing-surprise-effect] 지수가 픽셀 낚시 화면을 보고
  // 놀라는 티키타카(구 line-040~line-049, "이거 뭐야?????" ~ "진짜 미쳤나봐")는
  // 이 VN 씬에서 빼서 낚시 미니게임 자체의 시작 전 대화 인트로로 옮겼다 —
  // see dev/data/fishingDialogueScene.js의 DEFAULT_DIALOGUE_LINES.
  { id: 'line-039', speaker: '', text: '영우가 화면의 낚싯대 아이콘을 눌렀다.\n갑자기 픽셀 그래픽의 낚시 화면이 열렸다.', characterId: null },
  { id: 'line-050', speaker: '', text: '[ 잠시 후 — 낚시 화면으로 이동합니다 ]', characterId: null },
];

/* MISSING KEY — WEEK 1 · SCENE 04 「더 록스 · 작은 편집숍 발견」 v08
   Dialogue Set: dialogue-week1-scene-shop-intro
   Scene: week1-scene-shop-intro (The Rocks Lane, 10:40)
   [v08 재편] 더 록스 골목, 서큘러키에서 내린 직후로 시간·장소를 옮겼다
   (예전엔 저녁 · Eastwood 숙소 근처였음) — 지도 미니게임에서 받은 500P를
   써보는 첫 시도를 낚시/관광보다 먼저 배치해 v08의 동선(옷가게 발견 →
   관광 → 낚시)을 그대로 따른다. 강제 구매는 없다(§5.2 "강제 구매 여부"):
   어느 쪽을 골라도 같은 상점 화면으로 이어지고, 튜토리얼은 구매 여부와
   무관하게 완료된다. 실제 미리보기·구매는 대사가 아니라 /play/shop/ 화면에서
   일어난다 — hand-off는 기존 미니게임 라우팅과 같은 nextSceneId 패턴
   (week1-scene-shop-visit, MINIGAME_ROUTES in game/index.html) 을 쓴다. */
const week1SceneShopIntroLines = [
  { id: 'line-001', speaker: '', text: 'The Rocks 골목.\n오전 10시 40분.', characterId: null },
  { id: 'line-002', speaker: '', text: '서큘러키 역에서 나온 두 사람은\n오페라하우스로 곧장 가지 않고 더 록스 골목 쪽으로 천천히 걸었다.', characterId: null },
  { id: 'line-003', speaker: '', text: '오래된 벽돌 건물 사이,\n작은 편집숍 쇼윈도 앞에서 지수가 갑자기 멈춰 섰다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-004', speaker: '지수', text: '잠만잠만.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-005', speaker: '영우', text: '왜?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-006', speaker: '지수', text: '저거 예쁘다.\n나 저런 거 완전 좋아하는데.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006a', speaker: '영우', text: '캐리어 끌고 벌써 쇼핑 시동 걸리는 거예요?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-006b', speaker: '지수', text: '눈은 못 참아요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-007', speaker: '영우', text: '어디?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '저 코디, 검정 가디건.\n가격만 살짝 볼까?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-009', speaker: '', text: '지수가 쇼윈도에 붙은 가격표를 확인했다.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-010', speaker: '지수', text: '음.\n생각보다 비싸다.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-011', speaker: '영우', text: '얼마인데?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '이 정도면\n지금 우리 포인트로는 못 사요.', characterId: 'jisoo', expression: 'blank' },
  { id: 'line-013', speaker: '영우', text: '아,\n그러고 보니.', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-014', speaker: '영우', text: '지수야, 아까 지도 게임 클리어했을 때\n뭐 떴는지 기억나?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-015', speaker: '지수', text: '음?\n뭐 반짝하고 지나간 것 같긴 한데.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-016', speaker: '영우', text: '포인트 500P 받았잖아.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-017', speaker: '지수', text: '오!!\n맞다.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-018', speaker: '지수', text: '근데 그거로도 부족해요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-019', speaker: '영우', text: '조금.\n근데 딱 마침 옷가게가 있으니까\n한번 들어가서 구경은 해볼까?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-020', speaker: '지수', text: '오오 콜!!!!\n사진 찍어두고 나중에 또 오면 되지.', characterId: 'jisoo', expression: 'happy' },
  {
    id: 'line-020-transition',
    speaker: '', text: '두 사람은 편집숍 안으로 들어갔다.', characterId: null,
    sceneTransition: { backgroundKey: 'week1-scene-shop-intro--interior', introLabel: 'THE ROCKS BOUTIQUE', time: '10:44' },
  },
  { id: 'line-028', speaker: '', text: '작은 가게 안,\n행거에 코디 몇 벌이 세트로 걸려 있었다.', characterId: null },
  { id: 'line-028a', speaker: '', text: '문에 달린 작은 종이 짤랑거리며\n두 사람의 입장을 알렸다.', characterId: null },
  { id: 'line-029', speaker: '지수', text: '와, 낱개로 안 팔고\n통으로 코디해서 걸어놨네.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-030', speaker: '영우', text: '고르기 편하겠다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-031', speaker: '지수', text: '진짜 그러네.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-031a', speaker: '지수', text: '너무 좋쟈나 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-032', speaker: '영우', text: '점원 말로는\n태그에 붙은 가격이 그 포인트로 살 수 있는 거래.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-033', speaker: '영우', text: '입어보고 마음에 들면 사면 되고,\n아니면 그냥 구경만 하고 나가도 되고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034', speaker: '지수', text: '오케이.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-034a', speaker: '지수', text: '근데 영우는 안 골라요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-034b', speaker: '영우', text: '난 나중에.\n오늘은 지수 보는 재미로 왔어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-034c', speaker: '지수', text: '그런 말 은근슬쩍 넣지 마요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-034d', speaker: '지수', text: '바부야 👊', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-034e', speaker: '영우', text: 'ㅎㅎㅎㅎㅎㅎ\n왜 때려.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-034f', speaker: '지수', text: '자업자득이에요.', characterId: 'jisoo', expression: 'smirk' },
  {
    id: 'line-034-choice', type: 'choice', speaker: '', text: '지수가 행거 앞에서 잠시 고민한다.', characterId: 'jisoo', expression: 'curious',
    choices: [
      {
        id: 'shop-eager', label: '“일단 다 입어볼래요.”',
        effects: [
          { type: 'setFlag', key: 'shopIntroChoice', value: 'eager' },
          { type: 'addSatisfaction', amount: 3 },
        ],
      },
      {
        id: 'shop-cautious', label: '“오늘은 구경만 하고 나중에 살게요.”',
        effects: [
          { type: 'setFlag', key: 'shopIntroChoice', value: 'cautious' },
          { type: 'addSatisfaction', amount: 1 },
          { type: 'addAffection', amount: 2 },
        ],
      },
    ],
  },
  { id: 'line-035', speaker: '영우', text: '천천히 봐.\n나 여기서 기다릴게.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-036', speaker: '', text: '[ 잠시 후 — 옷가게 화면으로 이동합니다 ]', characterId: null },
  {
    id: 'line-037', speaker: '', text: '지수는 행거를 하나씩 넘겨보기 시작했다.', characterId: null,
    // The Missing Key v1 §5.2 "강제 구매 여부" / §11.3 필수 상태 변경 —
    // 구매 여부와 무관하게 상점·옷장 메뉴는 여기서 확정 해금된다. 초기 재고
    // 2벌(§5.6)도 함께 열어, 다음 줄에서 넘어가는 실제 /play/shop/ 화면에
    // 바로 상품이 채워져 있도록 한다.
    effects: [
      { type: 'unlockShop' },
      { type: 'unlockWardrobe' },
      { type: 'unlockShopItems', itemIds: ['outfit-w0-soft-cardigan', 'outfit-w0-city-denim'] },
      { type: 'setFlag', key: 'shopUnlocked', value: true },
      { type: 'setFlag', key: 'wardrobeUnlocked', value: true },
      { type: 'setFlag', key: 'shopTutorialCompleted', value: true },
    ],
  },
];

// week1-scene-shop-intro의 마무리 대사 — 상점 화면에서 돌아온 뒤 이어지는
// 짧은 클로징. 실제 옷가게 UI(/play/shop/)는 week1-scene-shop-visit이 라우팅해
// 처리하므로, 이 배열은 그 방문 *이후* 장면으로 별도 등록하지 않고
// week1-scene-002-1(숙소 도착)이 자연스럽게 이어받는다 — 왼쪽 상단 메뉴
// 설명은 옷가게 화면 자체의 최초 진입 안내로 대체한다(§11.3의 "왼쪽 상단
// 메뉴 설명" 비트는 실제 메뉴에 옷가게/옷장 카드가 새로 뜨는 것 자체가 그
// 역할을 한다 — 별도 대사 없이도 CASE FILE 메뉴를 열면 바로 확인된다).

// MISSING KEY — Week 1 Scene 2-2 room-search minigame's area/hotspot
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

// Core item -> the default hotspot its hand-written handler grants it from,
// mirroring ITEM_HOTSPOT_ITEM_IDS's core entries in
// minigame-phone-search/index.html. /dev/upload's 아이템 tab reads this as
// the fallback when a dev hasn't repositioned the item, and both that page
// and the minigame itself derive "which hotspots are currently a core
// item's" from it (plus any saved override) instead of a separate static
// list — a dev can drag a core item's location elsewhere and the handler
// (and this reserved-ness) follows it there. working-flashlight/long-hook
// are recipe outputs, not hotspot pickups, so they're absent here on
// purpose and stay non-repositionable. unknown-key is also absent —
// kitchen-fridge-gap's handler grants it together with jisu-phone, so it
// has no independent hotspot of its own to reposition.
const ROOM_SEARCH_CORE_ITEM_HOTSPOTS = {
  'aa-batteries': 'kitchen-right-lower-drawer',
  'jisu-phone': 'kitchen-fridge-gap',
  'metal-hanger': 'bathroom-behind-door',
  'garden-stake': 'exterior-center-shrubs',
  'dead-flashlight': 'bedroom-bedside-table',
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
  'bedroom-blind', 'bedroom-left-vent', 'bedroom-right-vent',
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

// Registry of testable Week 1 scenes — /dev/week1 lists these, each linking
// to /play/game/?scene=<id>. Covers the full 1주차 ARRIVAL arc (W1-S01~S10 in
// the story doc) — 비행기 오프닝부터 첫날 밤 마무리까지, including the M.K.
// engraving reveal that seeds the entire 4-week mystery.
//
// Grouped into 3 beats (week1SceneGroups below: #1-2, #3-5, #6-12) rather
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
const week1Scenes = [
  {
    id: 'week1-scene-flight',
    order: 1,
    name: '시드니 상공 · 진짜 왔네',
    location: 'In Flight',
    introLabel: 'IN FLIGHT',
    time: '착륙 10분 전',
    // Merged week1-scene-flight + week1-scene-001 (no minigame between them) —
    // week1Scene001Lines' first line carries the sceneTransition into the
    // second location below.
    locations: [
      { key: 'week1-scene-flight', label: 'In Flight' },
      { key: 'week1-scene-flight--arrival', label: 'Sydney Airport Arrival Area' },
    ],
    lines: mergeLines(week1SceneFlightLines, week1Scene001Lines),
    // Hands off into 지하철 역 찾기 — a real playthrough (시작하기 on /play/)
    // taps straight through the whole week instead of stopping here. Note
    // this also means the "UNKNOWN SIGNAL" foreshadow beat in game/index.html
    // (gated on !nextSceneId) no longer fires at this scene's end.
    nextSceneId: 'week1-scene-001-2',
  },
  {
    id: 'week1-scene-001-2',
    order: 2,
    name: '시드니 지리 파악 · 지하철 지도 튜토리얼',
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
    // [v4 지리 정정] 4 map anchors the setup dialogue teaches, in the order it
    // introduces them — 배경 DB's 정답 영역 editor uses this to offer one
    // hotspot slot per location on the shared map image. Eastwood is the
    // accommodation and Marayong is 영우's workplace (see this scene's
    // lines' header comment for why that's the reverse of the v3 draft).
    // /play/minigame-eastwood/ implements a single 라벨 배치 stage over these
    // same 4 hotspots, in this array's order — tap each label onto its spot
    // on the map, any order, and the minigame clears.
    minigameStages: ['공항 (Sydney International Airport)', '서큘러키 (Circular Quay)', '숙소 (Eastwood)', '영우 근무지 (Marayong)'],
  },
  {
    id: 'week1-scene-001-2-minigame',
    order: 3,
    name: '시드니 지리 파악 (미니게임)',
    location: 'Sydney Airport Station',
    time: '09:50',
    route: '/play/minigame-eastwood/',
  },
  {
    id: 'week1-scene-train',
    order: 4,
    name: '열차 — 지도에서 현실로',
    location: 'Sydney Trains',
    introLabel: 'SYDNEY TRAINS',
    time: '10:05',
    lines: week1SceneTrainLines,
    // [레이튼 퀴즈 삽입] 예전엔 여기서 곧장 week1-scene-shop-intro로 넘어갔지만,
    // 이제 지수가 켜본 퍼즐 앱(PZ-H02)으로 먼저 새는 별도 라우팅 페이지를
    // 거친다 — week1-scene-circular-quay → -minigame과 같은 패턴.
    nextSceneId: 'week1-scene-train-minigame',
  },
  {
    id: 'week1-scene-train-minigame',
    order: 5,
    name: '레이튼 퀴즈 · 사진 촬영 순서 (PZ-H02)',
    location: 'Sydney Trains',
    time: '10:15',
    // No `lines` — routes straight into the puzzle-play page (same
    // MINIGAME_ROUTES/SHOP_TUTORIAL_RETURN_SCENE handoff every other
    // minigame uses, dev/data/sceneRoutes.js). Open-ended like the fishing
    // minigame — no clear condition gates progress, its own back button
    // (mkShopReturnUrl) returns straight into week1-scene-train-2.
    route: '/play/minigame-layton/?puzzle=pz-h02',
  },
  {
    id: 'week1-scene-train-2',
    order: 6,
    name: '열차 — 잠 이야기',
    location: 'Sydney Trains',
    introLabel: 'SYDNEY TRAINS',
    time: '10:20',
    lines: week1SceneTrainLines2,
    // Picks back up right after the puzzle-app beat and hands off to the
    // shop-discovery scene, same destination week1-scene-train used to go
    // to directly before the minigame was inserted.
    nextSceneId: 'week1-scene-shop-intro',
  },
  {
    id: 'week1-scene-shop-intro',
    order: 7,
    name: '더 록스 · 작은 편집숍 발견',
    location: 'The Rocks Lane',
    introLabel: 'THE ROCKS',
    time: '10:40',
    locations: [
      { key: 'week1-scene-shop-intro', label: 'The Rocks Lane' },
      { key: 'week1-scene-shop-intro--interior', label: 'The Rocks Boutique Interior' },
    ],
    lines: week1SceneShopIntroLines,
    // Hands off to the actual shop screen (a separate routed page, not a VN
    // scene — spec §5.3 "상점은 모달이 아니라 별도 씬으로 처리") via the same
    // MINIGAME_ROUTES handoff every other minigame uses. See
    // dev/data/sceneRoutes.js for the SHOP_TUTORIAL_RETURN_SCENE wiring back
    // into week1-scene-circular-quay.
    nextSceneId: 'week1-scene-shop-visit',
  },
  {
    id: 'week1-scene-shop-visit',
    order: 8,
    name: '옷가게 튜토리얼',
    location: 'The Rocks Boutique',
    time: '10:50',
    route: '/play/shop/',
  },
  {
    id: 'week1-scene-circular-quay',
    order: 9,
    name: '서큘러키 · 사진과 낚시 제안',
    location: 'Circular Quay Waterfront',
    introLabel: 'CIRCULAR QUAY',
    time: '11:00',
    lines: week1SceneCircularQuayLines,
    // Hands off to the standalone fishing minigame (a routed page, same
    // MINIGAME_ROUTES handoff every other minigame uses) — see
    // dev/data/sceneRoutes.js.
    nextSceneId: 'week1-scene-circular-quay-minigame',
  },
  {
    id: 'week1-scene-circular-quay-minigame',
    order: 10,
    name: '서큘러키 낚시',
    location: 'Circular Quay Waterfront',
    time: '11:30',
    route: '/play/minigame-fishing/',
  },
  {
    id: 'week1-scene-002-1',
    order: 11,
    name: '낚시 수익 정산 · 진짜 같이 있네 · 사라진 폰',
    location: 'Eastwood Accommodation',
    introLabel: 'EASTWOOD',
    time: '13:40',
    // Merged week1-scene-002-1 + week1-scene-dinner + week1-scene-charger —
    // dinner and the trip back are plain location changes now (see
    // sceneTransition markers on week1SceneDinnerLines/week1SceneChargerLines'
    // first lines), not minigame boundaries, so they no longer need their
    // own registry entries. Still ends on charger's own minigame handoff —
    // that has to stay the last beat of this entry. [v08 재편] Also picks up
    // the fishing minigame's own "돌아가기" return (SHOP_TUTORIAL_RETURN_SCENE
    // in sceneRoutes.js), opening on a quick profit-split banter before the
    // existing room-reveal beat.
    locations: [
      { key: 'week1-scene-002-1', label: 'Eastwood Accommodation' },
      { key: 'week1-scene-002-1--dinner', label: 'Restaurant near Eastwood Accommodation' },
    ],
    lines: mergeLines(week1Scene002_1Lines, week1SceneDinnerLines, week1SceneChargerLines),
    // Not a loop — this scene hands off to the point-and-click phone-hunt
    // minigame (week1-scene-002-2). See MINIGAME_ROUTES in game/index.html.
    nextSceneId: 'week1-scene-002-2',
  },
  {
    id: 'week1-scene-002-2',
    order: 12,
    name: '핸드폰을 찾아라',
    location: 'Eastwood Accommodation',
    time: '20:35',
    // No `lines` — this isn't a VN scene, it's the point-and-click minigame
    // itself. `route` overrides /dev/week1's default /play/game/?scene=<id>
    // link so this entry opens the minigame page directly, letting it be
    // tested standalone instead of only via week1-scene-charger's VN handoff.
    route: '/play/minigame-phone-search/',
  },
  {
    id: 'week1-scene-002-3',
    order: 13,
    name: '근데 이 열쇠 뭐지? · 집주인과의 통화 · 첫날 밤',
    location: 'Eastwood Accommodation',
    introLabel: 'EASTWOOD',
    time: '20:40',
    // Reached from the phone-search minigame's GAME CLEAR redirect (hardcoded
    // in minigame-phone-search/index.html) — keeps this id even after the
    // merge below so that redirect still resolves.
    //
    // Merged week1-scene-002-3 + week1-scene-frontdesk + week1-scene-firstnight
    // (all Sydney Accommodation, back to back, no minigame handoff between
    // them now that the old lobby/front-desk trip was reworked into a phone
    // call from the room — see week1SceneFrontdeskLines' header comment).
    lines: mergeLines(week1Scene002_3Lines, week1SceneFrontdeskLines, week1SceneFirstNightLines),
  },
];

// 1주차's 3 narrative beats — /dev/week1 groups week1Scenes under these
// headers instead of one flat list, each range naming the original (pre-
// merge) scene numbers it covers. A group's sceneIds list its member
// registry entries in play order, minigames included in sequence alongside
// the VN scenes around them — a minigame can never be folded into a single
// `lines` array (it's a separate routed page), so it stays its own entry
// even inside a group whose other members got merged.
const week1SceneGroups = [
  { range: '#1-2', label: '공항 도착', sceneIds: ['week1-scene-flight'] },
  { range: '#3-5', label: '지하철 · 열차', sceneIds: ['week1-scene-001-2', 'week1-scene-001-2-minigame', 'week1-scene-train', 'week1-scene-train-minigame', 'week1-scene-train-2'] },
  // [v08 재편] The Missing Key v1 §5.2 — 지도 미니게임에서 받은 500P를 처음
  // 써보는 옷가게 발견 비트. 열차와 서큘러키 관광 사이로 옮겨왔다(더 록스
  // 골목 = 서큘러키에서 내린 직후 걷는 길).
  { range: 'NEW', label: '옷가게 발견', sceneIds: ['week1-scene-shop-intro', 'week1-scene-shop-visit'] },
  // 서큘러키 사진 + 낚시 제안 — 옷값을 벌자는 동기와 지수의 오랜 낚시
  // 바람을 한 씬에 담았다.
  { range: 'NEW', label: '서큘러키 · 낚시', sceneIds: ['week1-scene-circular-quay', 'week1-scene-circular-quay-minigame'] },
  { range: '#6-12', label: '숙소 첫날', sceneIds: ['week1-scene-002-1', 'week1-scene-002-2', 'week1-scene-002-3'] },
];


/* MISSING KEY — WEEK 2 (v4 전면 재설계 + 탐색허브 재도입)
   Source: docs/week2-storyline-outline-v4.md / docs/week2-v4-script.md
   Voice: docs/voice-bible-v2.md (지수·영우), 그 외 인물은 스크립트 문서 §0 기준.

   [재개편] v4는 원래 22챕터 전부를 nextSceneId로 잇는 완전 선형 구조였다 —
   허브(exploration hub)를 아예 쓰지 않아서, 아웃라인 문서 자신이 "자유 탐색
   허브"라고 부른 구간(Ch4 다섯 인물 첫 만남)까지 하나의 긴 대사 배열로
   재현됐었다. 역전재판형 구조(조사 파트는 자유 순회, 심문 파트만 선형)로
   되돌리기 위해 세 구간을 다시 허브로 내보낸다 — 아래 각 구간은 여전히
   지금 이 파일에 스크립트가 있지만(라운드/선택지/가설 구조는 그대로),
   더 이상 nextSceneId로 자동 연결되지 않고 dev/data/locationDefs.js +
   interactionDefs.js가 정의한 허브 장소·상호작용을 거쳐 인라인 재생된다
   (play/explore/index.html의 playSceneInline) — MINIGAME_ROUTES의 가상
   id들(dev/data/sceneRoutes.js의 week2-hub-entry-exhibit 등 hub-entry/
   interview-return 계열)이 그 왕복을 담당한다. 심문 라운드 내부(009/010b/
   011/021)는 여전히 완전 선형 — 어느 용의자를 먼저 심문할지만 자유고,
   심문 자체의 단계 순서는 손대지 않았다.

   - Ch4~5(전시장 자유 관람, week2-scene-004/005)는 원본 그대로 남겨두되
     더 이상 재생 경로에 없다 — 그 대사는 w2ef-topic 계열(interactionDefs.js)
     허브 상호작용으로 다시 쓰였다. week2-scene-003의 nextSceneId가 곧장
     W2_EXHIBIT_FREE_LOOK 허브로 보낸다.
   - Ch9~11(용의자 탐문, week2-scene-009/010/010b/011)은 W2_SUSPECT_
     INTERVIEWS 허브(기존 인프라, sceneId만 v4 번호로 교정)에서 자유
     순서로 심문 대상을 고른다. week2-scene-010을 애드리언 단독 분량과
     레오 단독 분량(신규 010b)으로 나눠 각자의 탐문 스팟에 건다.
   - Ch14~19(2부 재검증, week2-scene-014~019)는 W2_REVERIFICATION 허브에
     여섯 곳(마틴 통화·애드리언 재심문·레오 재심문·소피·다니엘 신원 확인·
     관광객 재조사)으로 흩어져 자유 순서로 진행된다.

   미니게임은 기존 두 개(사진 속 인물 찾기/photo-zoom, 시간대 정리/timeline)를
   그대로 재사용한다 — 새 미니게임 UI(Ch19 매칭/Ch20 슬라이더/Ch21 드래그
   정렬)는 만들지 않고 전부 대사로 대체했다(사용자 확인 완료). */

const week2Scene001Lines = [
  { id: 'line-001', speaker: '', text: '아침 햇살이 들어오는 숙소.\n지수가 짐을 정리하다 어젯밤 환기구에서 찾은 황동 열쇠를 다시 꺼내 본다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '영우\n이거 봐봐.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '지수', text: '어제 그 열쇠, 아직도 여기 있네.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '아, 그 M.K. 열쇠.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '진짜 뭘까 이거.\n자물쇠도 없는데 열쇠만 있고.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-006', speaker: '지수', text: '숙소에 몰래 숨겨둔 보물 열쇠일 수도?', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-007', speaker: '영우', text: '그럼 우리 부자 되는 거야?', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-008', speaker: '지수', text: '야르~\n그럼 오늘 관광 다 때려치우고 보물 찾기 하자 ㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009', speaker: '영우', text: '웅웅\n근데 일단은 진짜 관광부터 ㅎㅎㅎㅎㅎㅎ', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-010', speaker: '지수', text: '치, 알겠어.\n가방에 걸어놔야지, 잃어버리면 안 되니까.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-011', speaker: '', text: '지수가 열쇠를 가방 고리에 건다.', characterId: null },
  { id: 'line-012', speaker: '영우', text: '오늘 서큘러키 쪽으로 걸어가면서 느긋하게 구경하자.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-013', speaker: '지수', text: '좋아!!!!\n오페라하우스 사진 백 장 찍을 거야.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '영우', text: '지수지수야, 카메라 배터리부터 확인하고.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-015', speaker: '지수', text: '헤헤 알겠어 ㅎㅎ 가자!!!!', characterId: 'jisoo', expression: 'happy' },
];

const week2Scene002Lines = [
  { id: 'line-001', speaker: '', text: '오페라하우스와 하버브리지가 보이는 서큘러키.\n지수와 영우가 사진을 찍으려 하지만 앵글이 잘 안 나온다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '아 잠만, 나 왜 자꾸 다리가 잘려.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-003', speaker: '영우', text: '어 진짜네, 이쪽으로 서봐.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '지수', text: '그래도 안 나와ㅠ\n누가 좀 찍어주면 좋겠는데.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-005', speaker: '', text: '지나가던 다니엘이 자연스럽게 다가온다. 목에 가이드 명찰을 걸고 있다.', characterId: null },
  { id: 'line-006', speaker: '다니엘', text: '저 혹시 도와드릴까요?\n이 각도에서 찍으면 다리도 다 나오고 오페라하우스도 같이 나와요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '헐, 정말요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '다니엘', text: '네, 여기 로컬이라 사진 스팟은 좀 알거든요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-009', speaker: '', text: '다니엘이 지수의 가방 위치를 살짝 조정한다. 손이 M.K. 열쇠 근처를 스치듯 지나간다 — 지금은 그저 구도를 잡아주는 손짓처럼 보인다.', characterId: null },
  { id: 'line-010', speaker: '다니엘', text: '자 이렇게 서시고, 하나, 둘, 셋.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-011', speaker: '', text: '셔터 소리. 완벽한 구도의 사진이 찍힌다.', characterId: null },
  { id: 'line-012', speaker: '영우', text: '와 미친, 이거 완전 잘 나왔는데????', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-013', speaker: '지수', text: '헐 대박!!!!\n감사합니다 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-014', speaker: '다니엘', text: '별말씀을요. 여행 오신 거예요?', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-015', speaker: '영우', text: '네, 어제 도착해서 오늘부터 좀 돌아다니려고요.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-016', speaker: '다니엘', text: '그러면 더 록스 쪽 가보셨어요?\n오늘 골목에 작은 금속 공예 팝업 전시가 열렸는데, 사람도 안 많고 되게 괜찮더라고요.', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-017', speaker: '지수', text: '오 진짜요?\n야르~ 좋다.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-018', speaker: '다니엘', text: '방향 알려드릴게요. 저도 그쪽으로 가는 길이라.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-019', speaker: '영우', text: '어 감사합니다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-020', speaker: '지수', text: '영우, 오늘 완전 럭키데이인가봐 ㅎㅎ', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021', speaker: '영우', text: '그러게, 가이드님 만난 것부터 개쥬아.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-022', speaker: '다니엘', text: '자 이쪽으로 가시죠.', characterId: 'daniel-guide', expression: 'neutral' },
  {
    id: 'line-023', speaker: '', text: '[ 기록: 서큘러키 커플 사진 ] [ 기록: 다니엘 명찰 ] 획득. 세 사람이 더 록스 방향으로 걷기 시작한다.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-circular-quay-photo', code: 'E-V04', category: 'photo', title: '서큘러키 커플 사진',
          description: '오페라하우스를 배경으로 다니엘이 찍어준 기념사진. 구도를 잡아준다며 지수의 가방 쪽으로 손을 뻗은 순간이 함께 찍혔다.',
          discoveredLocationText: 'Circular Quay',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-daniel-badge', code: 'E-V03', category: 'physical', title: '다니엘 명찰',
          description: '다니엘이 목에 걸고 있는 여행사 가이드 명찰. 로고가 선명하게 인쇄돼 있다.',
          discoveredLocationText: 'Circular Quay',
        },
      },
    ],
  },
];

const week2Scene003Lines = [
  { id: 'line-001', speaker: '', text: '더 록스의 좁은 골목. 카페 앞에서 한 관광객이 캐리어를 든 채 당황해 서 있다.', characterId: null },
  { id: 'line-002', speaker: '다니엘', text: '(관광객에게) 이 카페에 임시 보관함이 있어요, 제가 물어봐 드릴게요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-003', speaker: '', text: '다니엘이 카페 카운터에 가서 직원과 짧게 대화한 뒤 관광객을 안내한다. 번호식 임시 보관함이 벽에 붙어 있다.', characterId: null },
  { id: 'line-004', speaker: '지수', text: '오, 저런 것도 있구나.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-005', speaker: '영우', text: '행사 관계자나 배달 기사들이 쓰는 임시 보관함인가봐.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-006', speaker: '', text: '다니엘이 보관함 번호판을 필요 이상으로 오래 들여다본다 — 구조를 확인하듯.', characterId: null },
  { id: 'line-007', speaker: '지수', text: '와 완전 친절하시다, 오지랖 대박 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '다니엘', text: '하하, 그냥 익숙해서요. 이 동네 자주 다니니까.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-009', speaker: '영우', text: '아 그러시구나.', characterId: 'youngwoo', expression: 'neutral' },
  {
    id: 'line-010', speaker: '', text: '[ 기록: 카페 임시 보관함 시스템 ] 획득.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-cafe-locker-system', code: 'E-V05', category: 'physical', title: '카페 임시 보관함 시스템',
          description: '카페 안쪽 벽면에 설치된 번호식 임시 보관함. 다니엘이 구조를 필요 이상으로 오래 들여다봤다.',
          discoveredLocationText: 'Café near Circular Quay',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-itinerary', code: 'E-V02', category: 'record', title: '관광 일정표',
          description: '다니엘이 짜준 오늘 하루의 동선. 서큘러키 사진 → 더 록스 안내 → 전시장 관람 → 단체사진 → 카페 휴식 순으로 이어진다.',
          discoveredLocationText: 'The Rocks',
        },
      },
    ],
  },
  { id: 'line-011', speaker: '다니엘', text: '자, 저기 골목 끝이 전시장이에요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-012', speaker: '지수', text: '야르~ 감사합니다 진짜.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-013', speaker: '다니엘', text: '그럼 저는 여기서, 좋은 시간 보내세요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-014', speaker: '', text: '다니엘이 손을 흔들고 반대 방향으로 사라진다 — 이 시점엔 그저 자연스러운 작별로 보인다.', characterId: null },
  { id: 'line-015', speaker: '영우', text: '좋은 사람 만났다, 개쥬아.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-016', speaker: '지수', text: '그니까 ㅎㅎ 자 들어가보자!!!!', characterId: 'jisoo', expression: 'happy' },
];

const week2Scene004Lines = [
  { id: 'line-001', speaker: '', text: '전시장 입구. 접수대에 클레어가 앉아 있다.', characterId: null },
  {
    id: 'line-002', speaker: '클레어', text: '어서 오세요, 팝업 전시 K-Collection에 오신 걸 환영합니다.\n입장은 무료고, 사진 촬영은 개인 소장용만 가능해요.', characterId: 'claire', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-claire-alibi-statement', code: 'E-CL1', category: 'testimony', title: '클레어의 최초 진술 — 접수대 상주',
        description: '클레어 모건 — 자신은 근무 시간 내내 접수대에 있었고 자리를 비운 적이 없다는 진술.',
        discoveredLocationText: 'Pop-up Exhibition 접수대 · 클레어 최초 진술',
      },
    }],
  },
  { id: 'line-003', speaker: '지수', text: '아 네 감사합니다.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '안쪽에 뭐가 제일 유명해요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-005', speaker: '클레어', text: '저희 메인 전시품은 K-01이에요. 이 지역 공예가가 만든 황동 작품인데, 안쪽 진열대에 있어요.', characterId: 'claire', expression: 'neutral' },
  { id: 'line-006', speaker: '', text: '전시장 안으로 들어서면 카페 코너에 소피가 있다.', characterId: null },
  { id: 'line-007', speaker: '소피', text: '어머 안녕하세요! 커피 한 잔 하고 구경하실래요?', characterId: 'sophie', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '오 좋아요 ㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-009', speaker: '소피', text: '여기 요즘 동네에 이 전시 때문에 사람들 좀 왔다갔다해요. 저 골목 카페들도 다 요즘 붐빈다니까.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-010', speaker: '영우', text: '아 그렇구나.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-011', speaker: '소피', text: '천천히 구경하고 가세요~', characterId: 'sophie', expression: 'curious' },
  { id: 'line-012', speaker: '', text: '전시장 중앙, 윤민아가 휴대폰으로 무언가를 급히 촬영하고 있다.', characterId: null },
  { id: 'line-013', speaker: '영우', text: '어, 저분 뭔가 되게 열심히 찍으시네.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-014', speaker: '지수', text: '그러게, 근데 좀 조심스러워 보이는데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-015', speaker: '', text: '윤민아가 두 사람을 발견하고 재빨리 폰을 내린다.', characterId: null },
  { id: 'line-016', speaker: '윤민아', text: '아, 안녕하세요. 그냥 콘텐츠용으로 좀.', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-017', speaker: '지수', text: '아 네 ㅎㅎ 편하게 하세요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-018', speaker: '윤민아', text: '...네.', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-019', speaker: '', text: '[ 의문점: 윤민아가 뭔가 급히 숨기는 것 같다 ] 등록.', characterId: null },
  { id: 'line-020', speaker: '', text: 'K-01 진열대 근처를 애드리언이 서성이고 있다.', characterId: null },
  { id: 'line-021', speaker: '애드리언', text: '좋은 작품이죠, 이거. 황동 세공이 정말 섬세해요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-022', speaker: '영우', text: '이거 사실 수도 있어요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-023', speaker: '애드리언', text: '음... 그런 쪽은 제가 직접 다루는 건 아니고요, 그냥 보는 걸 좋아해서.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-024', speaker: '', text: '[ 의문점: 애드리언이 가격 얘기를 피한다 ] 등록.', characterId: null },
  { id: 'line-025', speaker: '', text: '전시장 뒤쪽에서 짐을 나르던 레오가 지수와 부딪힐 뻔한다.', characterId: null },
  { id: 'line-026', speaker: '레오', text: '아 죄송해요!!', characterId: 'leo', expression: 'shocked' },
  { id: 'line-027', speaker: '지수', text: '아니에요 제가 잘 안 보고.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-028', speaker: '', text: '그 순간 지수의 가방 고리에서 M.K. 열쇠가 떨어진다.', characterId: null },
  { id: 'line-029', speaker: '레오', text: '어 이거.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-030', speaker: '', text: '레오가 열쇠를 주워 지수에게 건넨다.', characterId: null },
  { id: 'line-031', speaker: '레오', text: '떨어뜨리신 거 같은데... 어, M.K.네요?', characterId: 'leo', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '어? 아세요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-033', speaker: '레오', text: '아 아니, 그냥 이니셜이 특이해서요 ㅎㅎ', characterId: 'leo', expression: 'neutral' },
  { id: 'line-034', speaker: '지수', text: '아 감사합니다!!!!\n큰일 날 뻔했어요.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-035', speaker: '레오', text: '별말씀을요, 전시 재밌게 보고 가세요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-036', speaker: '영우', text: '지수야, 방금 또 뭐 흘렸어.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-037', speaker: '지수', text: '아니거든?????', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-038', speaker: '영우', text: '열쇠 흘리고 다니는 거 은근 위험한데.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-039', speaker: '지수', text: '바부야 👊\n다신 안 그럴 거야.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-040', speaker: '', text: '전시장을 자유롭게 둘러볼 수 있는 상태가 된다.', characterId: null },
];

const week2Scene005Lines = [
  { id: 'line-001', speaker: '', text: '지수와 영우가 K-01 진열대 앞으로 다가간다. 정교한 황동 공예품이 조명 아래 놓여 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '와, 진짜 예쁘다.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '영우', text: '이거 세공 미쳤는데, 하단 무늬 봐봐.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-004', speaker: '', text: '근처에서 윤민아가 몸을 낮춰 K-01 하단을 확대 촬영하고 있다.', characterId: null },
  { id: 'line-005', speaker: '클레어', text: '저기요, 손님.', characterId: 'claire', expression: 'annoyed' },
  { id: 'line-006', speaker: '윤민아', text: '네?', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-007', speaker: '클레어', text: '상업적 촬영은 별도 허가가 필요해요. 지금 찍으신 거 확인 좀 할게요.', characterId: 'claire', expression: 'annoyed' },
  { id: 'line-008', speaker: '윤민아', text: '아 이거 그냥...', characterId: 'minah', expression: 'shocked' },
  { id: 'line-009', speaker: '', text: '윤민아가 서둘러 사진 몇 장을 지운다.', characterId: null },
  { id: 'line-010', speaker: '윤민아', text: '죄송해요, 그냥 개인 소장용으로 몇 장만...', characterId: 'minah', expression: 'shocked' },
  { id: 'line-011', speaker: '클레어', text: '다음부턴 주의해주세요.', characterId: 'claire', expression: 'neutral' },
  {
    id: 'line-012', speaker: '', text: '[ 증거: 윤민아의 확대 사진(무단 촬영 자료) ] 등록.', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-photo-confiscated', code: 'E-V01', category: 'photo', title: '윤민아의 확대 사진',
        description: 'K-01 하단을 몰래 확대 촬영한 사진. 클레어에게 걸려 대부분 급히 지워졌다.',
        discoveredLocationText: 'Pop-up Exhibition · K-01 진열대',
      },
    }],
  },
  { id: 'line-013', speaker: '지수', text: '(작게) 영우, 저 사람 왜 저렇게 급하게 지웠지.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-014', speaker: '영우', text: '그러게, 좀 이상하긴 하다.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-015', speaker: '', text: '애드리언이 클레어에게 다가간다.', characterId: null },
  { id: 'line-016', speaker: '애드리언', text: '클레어씨, 하나만 여쭤볼게요. 이 받침 내부 깊이가 어느 정도 되나요?', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-017', speaker: '클레어', text: '네...? 그건 왜...', characterId: 'claire', expression: 'suspicious' },
  { id: 'line-018', speaker: '애드리언', text: '아, 그냥 구조가 궁금해서요, 공예적으로.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-019', speaker: '', text: '어색한 침묵. [ 의문점: 애드리언은 왜 가격이 아니라 구조를 묻는가 ] 등록.', characterId: null },
  { id: 'line-020', speaker: '', text: '그때 다니엘이 잠깐 전시장에 들른다.', characterId: null },
  { id: 'line-021', speaker: '다니엘', text: '어, 여기 계셨네요.', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-022', speaker: '지수', text: '어! 다니엘씨!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-023', speaker: '다니엘', text: '이 진열장 처음 보는 구조인데 신기하네요.', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-024', speaker: '다니엘', text: '직원문이 저쪽으로 열리는 구조인가.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-025', speaker: '영우', text: '어 그런가봐요.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-026', speaker: '', text: '다니엘이 별생각 없다는 듯 웃으며 다시 나간다. [ 복선: 다니엘이 직원문 방향을 이미 안다 ] 등록.', characterId: null },
  { id: 'line-027', speaker: '지수', text: '저분 진짜 아는 것도 많으시네.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-028', speaker: '영우', text: '그러게, 로컬이라 그런가.', characterId: 'youngwoo', expression: 'neutral' },
];

const week2Scene006Lines = [
  { id: 'line-001', speaker: '', text: '전시장 입구. 다니엘이 몇몇 관광객들을 모아 단체사진을 준비하고 있다.', characterId: null },
  { id: 'line-002', speaker: '다니엘', text: '자 여기 서큘러키에서 만난 분들끼리 기념으로 한 장 어때요?', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-003', speaker: '지수', text: '오 좋아요!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '다니엘', text: '이렇게 서야 다 나와요. 거기 두 분은 조금만 왼쪽으로.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-005', speaker: '', text: '다니엘이 사람들의 위치를 세밀하게 조정한다. 레오가 카메라를 들고 합류한다.', characterId: null },
  { id: 'line-006', speaker: '레오', text: '제가 찍어드릴게요, 앵글 좀 봐드릴 테니까.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-007', speaker: '영우', text: '오 전문가시네요.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-008', speaker: '레오', text: '아니 그냥 사진 좋아해서요 ㅎㅎ', characterId: 'leo', expression: 'neutral' },
  { id: 'line-009', speaker: '', text: '레오가 카메라를 조정하며 지수·영우와 가볍게 잡담한다.', characterId: null },
  { id: 'line-010', speaker: '레오', text: '여행 며칠째세요?', characterId: 'leo', expression: 'neutral' },
  { id: 'line-011', speaker: '지수', text: '이제 이틀째요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-012', speaker: '레오', text: '아 그럼 시드니 완전 초반이시네, 더 록스 골목도 예쁜 데 많으니까 천천히 도세요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-013', speaker: '', text: '(작게, 옆 사람에게) "어, 저희... 처음 뵙는 거 맞죠?" "네 맞아요, 신기하게 다 여기서 만났네요" — 관광객들이 서로 어색하게 인사한다.', characterId: null },
  { id: 'line-014', speaker: '다니엘', text: '자, 다 됐습니다. 하나 둘 셋!', characterId: 'daniel-guide', expression: 'neutral' },
  {
    id: 'line-015', speaker: '', text: '셔터 소리. [ 기록: 관광팀 단체사진 ] 획득.', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-group-photo', code: 'E-V11', category: 'photo', title: '관광팀 단체사진',
        description: '다니엘이 서큘러키에서 만난 관광객들을 모아 찍은 기념사진. 다니엘이 각자의 위치를 세밀하게 조정했다.',
        discoveredLocationText: 'Pop-up Exhibition 입구',
      },
    }],
  },
  { id: 'line-016', speaker: '지수', text: '헐 완전 잘 나왔다!!!!\n다들 감사해요 ㅎㅎㅎㅎㅎㅎ', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-017', speaker: '영우', text: '오늘 진짜 사람 복 터졌네, 개쥬아.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-018', speaker: '다니엘', text: '저는 다시 일 좀 보러 가볼게요, 좋은 여행 되세요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-019', speaker: '레오', text: '저도 짐 정리하러 가야겠다, 전시 재밌게 보세요!', characterId: 'leo', expression: 'neutral' },
  { id: 'line-020', speaker: '', text: '다니엘과 레오가 각자 자리로 흩어진다.', characterId: null },
  { id: 'line-021', speaker: '지수', text: '아 배고프다, 좀 있다 카페 가자.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-022', speaker: '영우', text: '그러자, 소피씨 커피 맛있어 보이던데.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-023', speaker: '', text: '(시간 경과) — 관람을 마치고 K-01 진열대로 돌아온다.', characterId: null },
];

const week2Scene007Lines = [
  { id: 'line-001', speaker: '', text: '카페에서 커피를 마시고 돌아온 지수와 영우. K-01 진열대 앞에 사람들이 모여 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '어, 사람들 왜 저기 몰려 있어?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-003', speaker: '영우', text: '가보자.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-004', speaker: '', text: '진열대가 텅 비어 있다.', characterId: null },
  { id: 'line-005', speaker: '지수', text: '헐, K-01이 없어????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-006', speaker: '클레어', text: '(전화에 대고) 네, 지금 바로 신고할게요 — 잠시만요.', characterId: 'claire', expression: 'shocked' },
  { id: 'line-007', speaker: '클레어', text: '분명 아까까지 있었는데, 제가 눈을 뗀 사이에.', characterId: 'claire', expression: 'shocked' },
  { id: 'line-008', speaker: '소피', text: '저도 방금 봤는데 없어졌어요. 어떡해.', characterId: 'sophie', expression: 'shocked' },
  { id: 'line-009', speaker: '영우', text: '잠만, 보안 카메라 있죠? 그거 먼저 확인해봐요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-010', speaker: '클레어', text: '네 여기...', characterId: 'claire', expression: 'shocked' },
  { id: 'line-011', speaker: '', text: '클레어가 태블릿으로 CCTV 영상을 불러온다. 화면 속 진열대가 미동도 없이 그대로다.', characterId: null },
  { id: 'line-012', speaker: '영우', text: '어, 근데 이거 좀 이상한데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '잠만, 시간 안 흐르는 거 아니야?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-014', speaker: '', text: '타임스탬프만 계속 흘러가고, 화면 속 장면은 정확히 같은 자세로 11분간 반복되고 있었다.', characterId: null },
  { id: 'line-015', speaker: '영우', text: '아 미친, 이거 루프야. 11분 동안 같은 화면 돌려놓은 거야!!!!', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-016', speaker: '지수', text: '헐, 그럼 그 11분 동안 누가 진짜로 여길...', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-017', speaker: '클레어', text: '그, 그런 게 가능해요?', characterId: 'claire', expression: 'shocked' },
  { id: 'line-018', speaker: '영우', text: '가능하니까 지금 우리가 보고 있죠.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-019', speaker: '', text: '[ 증거: 카메라 11분 루프 기록 ] [ 사건 정의: K-01 도난 사건 ] 등록.', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-camera-11min-loop', code: 'E-V07', category: 'record', title: '카메라 11분 루프 기록',
        description: '보안 카메라 화면이 정확히 같은 자세로 11분간 반복되고 있었다 — 그 사이 진열대에 실제로 접근한 사람은 화면에 잡히지 않는다.',
        discoveredLocationText: 'Pop-up Exhibition · CCTV',
      },
    }],
  },
  { id: 'line-020', speaker: '지수', text: '영우, 우리가 좀 알아보자.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-021', speaker: '영우', text: '그래, 일단 그 11분 사이에 누가 어디 있었는지부터.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-022', speaker: '', text: '현장 조사가 시작된다.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-case-dust-mark', code: 'E-H05', category: 'physical', title: '진열장 먼지 자국',
          description: '진열장 유리 안쪽, K-01이 있던 자리 주변에 누군가 손을 짚은 듯한 자국이 남아 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 현장 조사',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-case-lock-mechanism', code: 'E-H10', category: 'physical', title: '진열장 잠금부 — 강제 개방 흔적 없음',
          description: '진열장 잠금부 자체에는 파손이나 강제로 딴 흔적이 없다. 정상적인 방식으로 열린 것으로 보인다.',
          discoveredLocationText: 'Pop-up Exhibition · 현장 조사',
        },
      },
    ],
  },
];

const week2Scene008Lines = [
  { id: 'line-001', speaker: '', text: '소피가 폰을 들고 다가온다.', characterId: null },
  { id: 'line-002', speaker: '소피', text: '저기, 저 아까 전시장 사진 찍고 있었거든요. 혹시 도움 될까 해서요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-003', speaker: '지수', text: '헐 진짜요? 완전 도움돼요!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-004', speaker: '소피', text: '연속 촬영으로 몇 장 찍었어요, 여기요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-005', speaker: '영우', text: '이거 하나씩 자세히 봐야겠다. 사진 순서대로 넘겨보자.', characterId: 'youngwoo', expression: 'serious' },
];

const week2Scene008ReviewLines = [
  { id: 'line-001', speaker: '', text: '사진 7장을 하나씩 확대해 살펴본 끝에, 두 사람은 결정적인 순간을 찾아낸다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '1번, 2번 사진엔 진열장 문 닫혀 있고.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '3번, 4번도 그대로네.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '어, 5번 봐봐. 문이 살짝 열려 있어.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-005', speaker: '지수', text: '헐, 진짜네!!!!', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-006', speaker: '', text: '5번째 사진 속, 진열장 문 옆으로 회색 후드를 입은 인물의 팔이 살짝 걸쳐 있다.', characterId: null },
  { id: 'line-007', speaker: '영우', text: '저 그레이 후드 누구지, 얼굴은 안 보이는데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '잠만, 6번엔 아예 사람이 없고.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-009', speaker: '영우', text: '7번, 케이스가 완전 비어 있어.', characterId: 'youngwoo', expression: 'shocked' },
  {
    id: 'line-010', speaker: '', text: '[ 증거: 사진 속 그레이 후드 남성(레오로 추정) ] [ 증거: 진열장 문 열림 순간 ] 등록.\n사진 배경 한 귀퉁이로 다니엘로 보이는 뒷모습이 스치듯 지나간다 — 지금은 아무 의미 없어 보인다.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-tourist-extra-photo', code: 'E-SEL3', category: 'photo', title: '사진 속 그레이 후드 남성(레오로 추정)',
          description: '소피가 건네준 연속 촬영 사진 중 한 장. 진열장 문 옆으로 회색 후드를 입은 인물의 팔이 걸쳐 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 사진 분석',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-case-door-open-moment', code: 'E-H06', category: 'photo', title: '진열장 문 열림 순간',
          description: '같은 사진 속, 이전 컷까지 닫혀 있던 진열장 문이 살짝 열려 있는 순간이 포착됐다.',
          discoveredLocationText: 'Pop-up Exhibition · 사진 분석',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-theft-time-range', code: 'E-TR1', category: 'record', title: '사건 발생 추정 시간대',
          description: '사진들의 촬영 순서를 분석한 결과, K-01이 사라진 시점은 11분 루프 구간 초반으로 좁혀진다. 정확한 순간까지는 아직 확정되지 않았다.',
          discoveredLocationText: 'Pop-up Exhibition · 사진 분석',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-empty-reception-photo', code: 'E-CL2', category: 'photo', title: '접수대가 비어 있는 사진',
          description: '같은 연속 촬영 사진 중 한 장에, 클레어가 자리를 비운 접수대가 잠깐 찍혀 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 사진 분석',
        },
      },
    ],
  },
  { id: 'line-011', speaker: '지수', text: '이 그레이 후드, 누구 옷이랑 비슷한지 좀 봐야겠다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-012', speaker: '영우', text: '윤민아씨, 레오씨, 크로스백이나 후드 있었던 사람들 다시 봐야지.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '일단 제일 수상했던 사람부터.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-014', speaker: '영우', text: '윤민아씨네, 아까 몰래 찍다가 지우기까지 했잖아.', characterId: 'youngwoo', expression: 'serious' },
];

const week2Scene009Lines = [
  { id: 'line-001', speaker: '', text: '전시장 한쪽, 윤민아가 불안한 표정으로 서 있다. 클레어와 다니엘도 근처에 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '저기, 아까 K-01 밑부분 찍으셨었잖아요. 그거에 대해서 좀 여쭤봐도 될까요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '윤민아', text: '...저 범인 아니에요.', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-004', speaker: '영우', text: '그렇게 말씀하시니까 더 궁금해지는데요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '[ 심문 1단계 — 클레어의 열쇠 관리 진술 ]', characterId: null },
  {
    id: 'line-006', speaker: '클레어', text: '저... 사실 진열장 열쇠는 저랑 접수대 직원, 그리고 임시로 도와주시는 분들도 접근할 수 있었어요. 관리가 허술했다는 건 인정할게요.', characterId: 'claire', expression: 'annoyed',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-staff-lock-check-time', code: 'E-SEL1', category: 'testimony', title: '진열장 잠금 확인 시각',
        description: '클레어 — 진열장 잠금은 오늘 아침 한 번 확인했다. 그 이후로는 따로 확인하지 않았고, 관리가 허술했음을 인정한다.',
        discoveredLocationText: 'Pop-up Exhibition · 클레어 심문',
      },
    }],
  },
  { id: 'line-007', speaker: '영우', text: '그럼 윤민아씨도 접근 가능했던 거예요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-008', speaker: '클레어', text: '직접 열쇠를 드린 적은 없는데, 근처에 걸려 있긴 했어요.', characterId: 'claire', expression: 'neutral' },
  { id: 'line-009', speaker: '', text: '[ 심문 2단계 — 다니엘의 회색 캡 목격 진술 ]', characterId: null },
  {
    id: 'line-010', speaker: '다니엘', text: '아, 저 그거 봤어요. 회색 캡 쓴 분이 진열대 쪽으로 가는 거.', characterId: 'daniel-guide', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-daniel-graycap-sighting', code: 'E-DN1', category: 'testimony', title: '다니엘의 목격담 — 회색 캡 목격',
        description: '다니엘 리드 — 회색 캡을 쓴 인물이 진열대 쪽으로 가는 것을 봤다는 진술.',
        discoveredLocationText: 'Pop-up Exhibition · 다니엘 진술',
      },
    }],
  },
  { id: 'line-011', speaker: '지수', text: '회색 캡이요?', characterId: 'jisoo', expression: 'shocked' },
  {
    id: 'line-012', speaker: '다니엘', text: '네, 확실친 않은데 그, 몰래 찍으시던 분 쪽이었던 것 같아요.', characterId: 'daniel-guide', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-daniel-silhouette-report', code: 'E-DN2', category: 'testimony', title: '다니엘의 목격담 — 윤민아 쪽 실루엣',
        description: '다니엘 리드 — 확신은 없지만, 그 인물이 몰래 사진을 찍던 윤민아 쪽에 있었던 것 같다는 진술.',
        discoveredLocationText: 'Pop-up Exhibition · 다니엘 진술',
      },
    }],
  },
  { id: 'line-013', speaker: '윤민아', text: '저 캡 안 썼는데요?!', characterId: 'minah', expression: 'shocked' },
  { id: 'line-014', speaker: '', text: '[ 심문 3단계 — 윤민아의 삭제 사진 진술 ]', characterId: null },
  { id: 'line-015', speaker: '지수', text: '그럼 아까 왜 사진을 급하게 지우셨어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-016', speaker: '윤민아', text: '...하.', characterId: 'minah', expression: 'annoyed' },
  {
    id: 'line-017', speaker: '윤민아', text: '저 사실 콘텐츠 크리에이터거든요. 협찬 없이 몰래 찍은 거라, 클레어씨한테 걸리면 문제될까봐 지운 거예요.', characterId: 'minah', expression: 'annoyed',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-illegal-photo', code: 'E-M01', category: 'testimony', title: '윤민아의 비공식 촬영 자백',
        description: '전시품을 촬영 금지 규정을 어기고 몰래 찍었다고 시인했다. 이유는 콘텐츠 제작용.',
        discoveredLocationText: 'Pop-up Exhibition · 윤민아 심문',
      },
    }],
  },
  { id: 'line-018', speaker: '영우', text: '그럼 촬영 목적이 도난이랑은 상관없다는 거네요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-019', speaker: '윤민아', text: '당연하죠, 저는 그냥 K-01 클립 하나 뽑아서 업로드하려던 거였어요.', characterId: 'minah', expression: 'annoyed' },
  { id: 'line-020', speaker: '', text: '[ 심문 4단계 — 윤민아의 알리바이 성립 ]', characterId: null },
  {
    id: 'line-021', speaker: '윤민아', text: '그리고 저 11분 루프 시작될 때쯤, 클레어씨한테 걸려서 계속 접수대 앞에서 사과하고 있었어요. 클레어씨가 증인이에요.', characterId: 'minah', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-photo-timestamps', code: 'E-M03', category: 'record', title: '윤민아 촬영 시각 기록',
        description: '윤민아가 촬영한 사진들의 타임스탬프. 11분 루프가 시작될 무렵부터는 접수대 앞에서 클레어에게 붙잡혀 있었다는 알리바이와 일치한다.',
        discoveredLocationText: 'Pop-up Exhibition · 윤민아 심문',
      },
    }],
  },
  { id: 'line-022', speaker: '클레어', text: '...맞아요, 그 시간엔 저랑 같이 있었어요.', characterId: 'claire', expression: 'neutral' },
  { id: 'line-023', speaker: '', text: '[ 심문 5단계 — 카메라 영상이 빈 화면이 아니라 반복 화면임을 확인 ]', characterId: null },
  { id: 'line-024', speaker: '영우', text: '그리고 결정적으로, 카메라 영상 자체가 그냥 끊긴 게 아니라 11분 동안 똑같은 화면을 반복 재생하게 조작된 거였어요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-025', speaker: '지수', text: '그건 미리 준비하지 않으면 못 하는 거잖아요. 윤민아씨가 그 정도로 사전에 계획했다고 보긴 어려워요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-026', speaker: '윤민아', text: '...그니까요, 저 진짜 그런 거 할 줄도 몰라요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-027', speaker: '', text: '[ 심문 6단계 — 레오가 직원문에 접근했다는 새 의문점 발생 ]', characterId: null },
  { id: 'line-028', speaker: '클레어', text: '그러고 보니, 직원문 출입 기록에 레오씨 이름이 그 시간대에 있어요.', characterId: 'claire', expression: 'shocked' },
  { id: 'line-029', speaker: '지수', text: '레오씨가요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-030', speaker: '영우', text: '아, 잠만. 그 그레이 후드, 레오씨 아니야?', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-031', speaker: '', text: '[ 증거 갱신: 윤민아의 확대 사진 → 사건 전 K-01 상태를 증명하는 자료 ] [ 의문점: 카메라가 빈 화면이 아니라 반복 화면이었다 ] [ 의문점: 레오가 직원문에 접근한 기록 ] 등록.', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-mina-photo-confiscated',
      summary: '단순한 무단 촬영 자료가 아니라, 사건 전 K-01 하단이 정상적으로 결합돼 있던 상태를 증명하는 기준 자료.',
    }],
  },
  { id: 'line-032', speaker: '윤민아', text: '아 다행이다 진짜, 저 완전 범인 취급받는 줄 알았어요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-033', speaker: '지수', text: '죄송해요, 의심해서.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-034', speaker: '윤민아', text: '아니에요, 상황이 그랬으니까. 근데 저 그 사진들 필요하시면 원본 다 드릴게요. 정리하는 데 도움 될 것 같아서.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-035', speaker: '영우', text: '감사합니다. 그럼 이제 레오씨한테 가봐야겠다.', characterId: 'youngwoo', expression: 'serious' },
];

const week2Scene010Lines = [
  { id: 'line-001', speaker: '', text: '전시장 직원문 앞. 애드리언이 근처에서 서성이고 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '애드리언씨, 잠깐 여쭤볼 게 있는데요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '애드리언', text: '네, 말씀하세요.', characterId: 'adrian', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '아까 받침 내부 깊이 물어보셨잖아요. 그게 왜 궁금하셨어요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '애드리언', text: '아, 그냥... 공예품 보는 게 취미라 구조가 궁금했을 뿐이에요.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-006', speaker: '지수', text: '근데 가격은 한 번도 안 물으셨잖아요. 보통 그런 거 먼저 물어보지 않아요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '애드리언', text: '음... 그건, 제가 원래 가격보다 물건 자체를 보는 편이라.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-008', speaker: '영우', text: '(작게, 지수에게) 뭔가 더 있는 것 같은데 아직은 말 안 하겠다.', characterId: 'youngwoo', expression: 'serious' },
];

// [분리] week2Scene010Lines의 후반부(구 line-010~028) — 레오를 다시 붙잡아
// 물증을 들이대는 장면. 탐문 허브에서 레오 스팟(w2-suspect-leo-spot)의
// 독립된 인터랙션으로 쓰기 위해 별도 씬으로 나눴다. 대사·증거 이펙트
// 내용은 origin/main에 병합된 버전 그대로, id만 새로 매겼다.
const week2Scene010bLines = [
  { id: 'line-001', speaker: '', text: '전시장 직원문 앞. 두 사람은 근처에서 잘린 완충재와 레오의 크로스백 형태 변화를 발견한다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '어, 저기 완충재 잘린 조각 있다.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '이거 K-01 포장할 때 쓰는 거 아니야?', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'line-004', speaker: '', text: '[ 증거: 잘린 완충재 ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-packing-foam', code: 'E-V06', category: 'physical', title: '잘린 완충재',
          description: '직원문 근처에 떨어진 스티로폼 조각. K-01 크기에 맞춰 깔끔하게 잘린 단면이 남아 있다.',
          discoveredLocationText: 'Pop-up Exhibition 직원문 앞',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-staffdoor-ajar', code: 'E-H06b', category: 'physical', title: '직원 전용문 반쯤 열림',
          description: '자유 관람 때는 닫혀 있던 직원 전용문이, 지금은 반쯤 열려 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 직원 전용문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-shelf-arrangement', code: 'E-H11', category: 'physical', title: '직원 구역 선반 — 흐트러진 정리',
          description: '직원문 안쪽 선반의 물건 배치가 평소와 다르게 흐트러져 있다. 누군가 최근에 무언가를 찾거나 옮긴 것 같다.',
          discoveredLocationText: 'Pop-up Exhibition 직원 구역',
        },
      },
    ],
  },
  { id: 'line-005', speaker: '', text: '레오가 직원문 쪽에서 걸어 나온다. 크로스백이 아까보다 훨씬 부풀어 있다가, 지수와 눈이 마주치자 슬쩍 각도를 튼다.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '어, 레오씨 가방이 아까보다 커진 것 같은데.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-007', speaker: '레오', text: '어? 아 이거, 그냥 짐이 좀 많아서요 ㅎㅎ', characterId: 'leo', expression: 'shocked' },
  {
    id: 'line-008', speaker: '', text: '[ 증거: 레오의 크로스백(형태 변화) ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-bag-strap-shape', code: 'E-DN3', category: 'physical', title: '레오의 크로스백',
          description: '레오가 매고 있던 크로스백의 형태와 매는 방식을 정리한 자료. 아까보다 눈에 띄게 부풀어 있다.',
          discoveredLocationText: 'Pop-up Exhibition 직원문 앞',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-bag-volume-change', code: 'E-TL3', category: 'photo', title: '레오 가방 부피 변화',
          description: '전시장 안에서 찍힌 사진과 지금을 비교하면, 레오의 가방이 눈에 띄게 더 두꺼워져 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 사진 대조',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-case-edge-fiber', code: 'E-H12', category: 'physical', title: '진열장 모서리 검은 섬유',
          description: '진열장 모서리에 걸린 검은 섬유 조각. 레오의 옷 소매와 같은 색이다.',
          discoveredLocationText: 'Pop-up Exhibition · K-01 진열대',
        },
      },
    ],
  },
  { id: 'line-009', speaker: '영우', text: '레오씨, 잠깐 얘기 좀 할 수 있을까요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-010', speaker: '레오', text: '...네, 왜요.', characterId: 'leo', expression: 'shocked' },
  { id: 'line-011', speaker: '', text: '그 순간 레오의 폰이 짧게 진동한다. 화면을 흘긋 보고 흠칫한다.', characterId: null },
  { id: 'line-012', speaker: '영우', text: '직원문 출입 기록에 레오씨 이름이 있던데, 그 시간에 뭐 하셨어요?', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-013', speaker: '레오', text: '어... 저 그냥 창고에 물건 가지러 간 거예요. 진열장 근처는 안 갔어요.', characterId: 'leo', expression: 'shocked',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-leo-first-statement', code: 'E-TL0', category: 'testimony', title: '레오 박의 최초 진술',
        description: '"창고에 물건 가지러 간 거고, 진열장 근처는 안 갔다"는 레오 본인의 최초 진술.',
        discoveredLocationText: 'Pop-up Exhibition · 레오 조사',
      },
    }],
  },
  { id: 'line-014', speaker: '지수', text: '정말요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-015', speaker: '레오', text: '네, 진짜예요.', characterId: 'leo', expression: 'shocked' },
  {
    id: 'line-016', speaker: '', text: '레오가 시선을 피한다. [ 증거 갱신: 레오의 크로스백 = "평범한 소지품" → "K-01 반출 도구(의심)" ]', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-leo-bag-strap-shape',
      summary: '단순한 소지품이 아니라 K-01 반출에 쓰였을 가능성이 있는 도구로 의심된다.',
    }],
  },
  { id: 'line-017', speaker: '영우', text: '(작게, 지수에게) 좀 더 물증 모아서 다시 오자.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-018', speaker: '지수', text: '그래, 이대로는 안 밀리겠다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-019', speaker: '', text: '자리를 떠나기 전, 영우가 흩어진 시간대를 정리해보기로 한다.', characterId: null },
];

const week2Scene011Lines = [
  { id: 'line-001', speaker: '', text: '시간대를 정리하고 나니 그림이 확실해졌다. 지수와 영우가 직원문 근처에서 레오를 다시 붙잡는다. 이번엔 물증을 들고 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '레오씨, 저희 지금까지 모은 거 좀 보여드릴게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '', text: '[ 심문 1단계 — "직원문엔 들어갔지만 진열장 근처엔 안 갔다" ]', characterId: null },
  { id: 'line-004', speaker: '레오', text: '저 진짜 직원문만 들어갔다 나온 거예요. 진열장 쪽엔 안 갔어요.', characterId: 'leo', expression: 'shocked' },
  { id: 'line-005', speaker: '영우', text: '근데 이 사진 보시면요, 5번째 사진, 진열장 문 옆에 그레이 후드. 이거 레오씨 후드 아니에요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-006', speaker: '레오', text: '...', characterId: 'leo', expression: 'blank' },
  { id: 'line-007', speaker: '', text: '[ 심문 2단계 — "진열장엔 갔지만 열지 않았다" ]', characterId: null },
  { id: 'line-008', speaker: '레오', text: '...진열장 쪽엔 갔었어요. 근데 열진 않았어요, 그냥 지나간 거예요.', characterId: 'leo', expression: 'shocked' },
  { id: 'line-009', speaker: '지수', text: '그럼 이 잘린 완충재는요? 직원문 바로 앞에 떨어져 있던 건데.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '레오', text: '그건...', characterId: 'leo', expression: 'blank' },
  { id: 'line-011', speaker: '', text: '[ 심문 3단계 — "각인 사진만 찍고 물건은 돌려놓았다" ]', characterId: null },
  { id: 'line-012', speaker: '레오', text: '...하, 좋아요, 열긴 열었어요. 근데 저 그냥 사진만 찍고 바로 다시 넣었어요, 훔친 게 아니라.', characterId: 'leo', expression: 'blank' },
  { id: 'line-013', speaker: '영우', text: '사진 찍으려고 왜 진열장을 열어요? 찍기만 할 거면 유리 너머로도 찍을 수 있잖아요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-014', speaker: '레오', text: '그건, 각인이 유리에 반사가 심해서요...', characterId: 'leo', expression: 'shocked' },
  { id: 'line-015', speaker: '', text: '[ 심문 4단계 — "추가 의뢰는 거절했다" ]', characterId: null },
  { id: 'line-016', speaker: '지수', text: '레오씨, 저희 레오씨 폰 알림에 좀 흠칫하시는 거 봤어요. 누구 연락이었어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-017', speaker: '레오', text: '...그, 사진 의뢰가 좀 있었어요, 익명으로. 각인 사진만 찍어달라고.', characterId: 'leo', expression: 'blank' },
  { id: 'line-018', speaker: '영우', text: '그럼 추가로 더 해달라는 요청은요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-019', speaker: '레오', text: '그건... 거절했어요.', characterId: 'leo', expression: 'shocked' },
  { id: 'line-020', speaker: '', text: '[ 심문 5단계 — "K-01을 잠시 옮겼지만 훔칠 생각은 없었다" ]', characterId: null },
  { id: 'line-021', speaker: '지수', text: '레오씨 크로스백, 아까 갑자기 부풀어 있었잖아요. 그 안에 뭐였어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-022', speaker: '레오', text: '...', characterId: 'leo', expression: 'blank' },
  { id: 'line-023', speaker: '레오', text: '...옮겼어요. 근데 진짜 훔칠 생각은 아니었어요, 그냥 잠깐 옮기기만 하면 된다고 해서.', characterId: 'leo', expression: 'blank' },
  { id: 'line-024', speaker: '', text: '[ 심문 6단계 — "익명 지시에 따라 보관함에 넣었다" ]', characterId: null },
  { id: 'line-025', speaker: '영우', text: '어디로 옮기셨어요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-026', speaker: '레오', text: '...카페 골목에 있는 임시 보관함이요. 넣고 사진만 찍어서 보내면 된다고 했어요.', characterId: 'leo', expression: 'blank' },
  {
    id: 'line-027', speaker: '', text: '[ 증거: MK_Consult 메시지(익명 촬영 의뢰) ] [ 증거: 카페 보관함 기록 ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-mk-consult-account', code: 'E-C04', category: 'record', title: '중개 계정 — MK_Consult',
          description: '레오가 익명 의뢰를 받은 중개 계정명. 애드리언이 받은 문의 계정 "M.K."와 같은 계열로 보인다.',
          discoveredLocationText: 'Pop-up Exhibition · 레오 심문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-commission-message', code: 'E-C01', category: 'record', title: '레오가 받은 의뢰 메시지',
          description: 'K-01 하단 각인을 최대한 선명하게 확대해서 찍어달라는 매우 구체적인 촬영 요청 목록.',
          discoveredLocationText: 'Pop-up Exhibition · 레오 심문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-k01-inscription-request', code: 'E-C03', category: 'record', title: '각인 확대 촬영 요청',
          description: '의뢰 메시지에는 K-01 하단 각인을 최대한 선명하게 확대해서 찍어달라는 조건이 포함되어 있었다.',
          discoveredLocationText: 'Pop-up Exhibition · 레오 심문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-reference-image', code: 'E-C02', category: 'photo', title: '레오가 받은 참고 이미지',
          description: '레오가 의뢰받을 때 함께 전달받은 참고 이미지. 구도·조명·각도가 상당히 구체적으로 지정돼 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 레오 심문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-cafe-storage-log', code: 'E-V08', category: 'record', title: '카페 보관함 기록',
          description: '레오가 K-01을 넣은 임시 보관함의 번호와 시각. 인증 사진을 찍어 MK_Consult 계정으로 보냈다는 기록이 남아 있다.',
          discoveredLocationText: 'Café near Circular Quay · 보관함',
        },
      },
    ],
  },
  { id: 'line-028', speaker: '레오', text: '저는 그냥... 사진 몇 장 부탁받은 줄 알았어요. 근데 어느샌가 이렇게 돼 있더라고요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-029', speaker: '지수', text: '레오씨... 좋은 사람인 줄 알았는데.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-030', speaker: '레오', text: '...죄송해요, 정말로요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-031', speaker: '영우', text: '일단 그 보관함부터 가봐요, K-01부터 찾아야죠.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-032', speaker: '', text: '[ 증거 갱신: MK_Consult 메시지 = "익명 촬영 의뢰" → "레오를 움직인 배후" ]', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-mk-consult-account',
      summary: '단순한 익명 촬영 의뢰가 아니라, 레오를 단계적으로 움직인 배후의 지시 채널.',
    }],
  },
];

const week2Scene012Lines = [
  { id: 'line-001', speaker: '', text: '카페 골목의 임시 보관함. 레오가 알려준 번호로 열자 포장된 K-01이 그대로 들어 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '헐, 있다!!!!', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-003', speaker: '영우', text: '다행이다 진짜, K-01 무사하네.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-004', speaker: '', text: '윤민아가 소식을 듣고 달려온다.', characterId: null },
  {
    id: 'line-005', speaker: '윤민아', text: '저 사진 원본 가져왔어요, 회수된 거랑 비교해볼게요.', characterId: 'minah', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mina-recovered-photo-fragment', code: 'E-M02', category: 'photo', title: '복구된 원본 사진',
        description: '클레어에게 지적받고도 완전히 지우지 못한 원본. K-01 뒷면·하단 각인 부분을 확대 촬영한 흔적이 남아 있다.',
        discoveredLocationText: 'Café near Circular Quay · 보관함',
      },
    }],
  },
  { id: 'line-006', speaker: '', text: '윤민아가 사건 전 촬영한 확대 사진과 회수된 K-01을 나란히 놓는다.', characterId: null },
  { id: 'line-007', speaker: '윤민아', text: '어... 잠깐만요.', characterId: 'minah', expression: 'shocked' },
  { id: 'line-008', speaker: '지수', text: '왜요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '윤민아', text: '이 나사 방향, 제 사진이랑 다른데요?', characterId: 'minah', expression: 'shocked' },
  { id: 'line-010', speaker: '영우', text: '어 진짜네, 그리고 이 결합선도 위치가 미묘하게 어긋나 있어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-011', speaker: '', text: '지수가 K-01을 들어본다.', characterId: null },
  { id: 'line-012', speaker: '지수', text: '이거... 생각보다 가벼운데?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-013', speaker: '윤민아', text: '클레어씨 등록 무게 기록이랑 대조해봐야 할 것 같아요.', characterId: 'minah', expression: 'neutral' },
  { id: 'line-014', speaker: '영우', text: '잠만, 그럼 이거... 레오씨가 훔친 게 K-01 전체가 아니라...?', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-015', speaker: '지수', text: '안에 뭐가 있었는데, 그게 없어졌다는 거야???', characterId: 'jisoo', expression: 'shocked' },
  {
    id: 'line-016', speaker: '', text: '[ 증거: K-01(내부 분해 흔적 발견) ] [ 사건 정의 갱신: 레오에 의한 K-01 무단 반출 사건 ] 등록.', characterId: null,
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-k01', code: 'E-V09', category: 'physical', title: 'K-01',
        description: '회수된 황동 공예품 K-01. 원래 있던 자리보다 가볍고, 나사 방향과 결합선 위치가 사건 전 사진과 미묘하게 다르다.',
        discoveredLocationText: 'Café near Circular Quay · 보관함',
      },
    }],
  },
  { id: 'line-017', speaker: '영우', text: '(작게) 나 지금까지 물리 증거로 다 맞다고 생각했는데, 이거... 뭔가 더 있는 거 아니야.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-018', speaker: '지수', text: '돌아온 건 K-01이 맞아. 그런데...... 안에 있던 게 없어.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-019', speaker: '', text: '세 사람이 서로를 바라본다. — 1부 종료, 2부로 이어짐.', characterId: null },
];

const week2Scene013Lines = [
  { id: 'line-001', speaker: '', text: '전시장. 지수와 영우가 클레어와 함께 K-01을 정밀하게 살펴보고 있다.', characterId: null },
  {
    id: 'line-002', speaker: '클레어', text: '저희 등록 대장에 K-01 무게가 정확히 적혀 있어요, 확인해볼게요.', characterId: 'claire', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-k01-weight', code: 'E-V13', category: 'record', title: 'K-01 등록 무게',
        description: '전시 등록 대장에 적힌 K-01의 원래 무게. 회수된 K-01과 대조할 기준값이다.',
        discoveredLocationText: 'Pop-up Exhibition · 등록 대장',
      },
    }],
  },
  { id: 'line-003', speaker: '', text: '클레어가 저울에 K-01을 올린다.', characterId: null },
  { id: 'line-004', speaker: '클레어', text: '...어.', characterId: 'claire', expression: 'shocked' },
  { id: 'line-005', speaker: '클레어', text: '등록 무게보다 확실히 가벼워요. 이 정도 차이면 절대 오차 범위가 아니에요.', characterId: 'claire', expression: 'shocked' },
  { id: 'line-006', speaker: '영우', text: '그럼 진짜 안에 뭔가 있었다는 거네요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '하단 좀 열어봐도 될까요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '클레어', text: '...네, 지금은 그래야 할 것 같아요.', characterId: 'claire', expression: 'neutral' },
  { id: 'line-009', speaker: '', text: '하단을 열자 안쪽 공간이 텅 비어 있다. 원래 뭔가 고정돼 있던 흔적만 남아 있다.', characterId: null },
  { id: 'line-010', speaker: '영우', text: '와, 진짜 비어 있다.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-011', speaker: '지수', text: '그럼 레오씨가 훔친 건 K-01이 아니라, 이 안에 있던 뭔가를 훔치기 위한 통로였던 거야?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-012', speaker: '클레어', text: '제가... 등록할 때 무게까지 정확히 확인했어야 했는데, 그냥 정상이라고만 생각했어요.', characterId: 'claire', expression: 'annoyed' },
  { id: 'line-013', speaker: '영우', text: '클레어씨 잘못은 아니에요, 누구도 안에 뭐가 있는지 몰랐잖아요.', characterId: 'youngwoo', expression: 'soft' },
  {
    id: 'line-014', speaker: '', text: '[ 증거 갱신: K-01 → 내부가 비어 있는 껍데기 ] [ 증거 갱신: K-01 등록 무게 = "일상적인 관리 대장" → "내부 부품 소실의 물증" ]', characterId: null,
    effects: [
      { type: 'updateEvidence', id: 'evidence-k01', summary: '내부 인덱스가 제거된, 텅 빈 껍데기 상태의 K-01.' },
      { type: 'updateEvidence', id: 'evidence-k01-weight', summary: '일상적인 관리 대장이 아니라, 내부 부품 소실을 증명하는 물증.' },
    ],
  },
  { id: 'line-015', speaker: '지수', text: '이거 만든 사람한테 물어봐야겠다, 안에 원래 뭐가 있었는지.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-016', speaker: '클레어', text: '제작자분 연락처 있어요, 마틴 베일씨라고.', characterId: 'claire', expression: 'neutral' },
];

const week2Scene014Lines = [
  { id: 'line-001', speaker: '', text: '카페 골목을 걸으며 지수가 마틴에게 전화를 건다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '여보세요, 마틴 베일씨 되시나요? 저희 K-01 관련해서 좀 여쭤볼 게 있어서요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '마틴', text: '...아, K-01이요. 무슨 일이시죠.', characterId: 'martin', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '사실 오늘 K-01에서 도난 사건이 있었어요. 회수는 됐는데, 내부가 비어 있더라고요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '전화 너머로 긴 침묵이 흐른다.', characterId: null },
  { id: 'line-006', speaker: '마틴', text: '...그럴 리가 없는데.', characterId: 'martin', expression: 'neutral' },
  {
    id: 'line-007', speaker: '마틴', text: '제가 클레어씨한테도 몇 번이나 말했어요, 그 작품 하단은 절대 열지 말라고.', characterId: 'martin', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-martin-not-for-sale-testimony', code: 'E-MV1', category: 'testimony', title: '마틴의 진술 — 판매 목적 아님',
        description: '마틴 베일 — K-01은 판매용이 아니라 전시 목적으로만 빌려준 것이며, 하단은 절대 열지 말라고 여러 번 당부했다는 진술.',
        discoveredLocationText: '전화 통화 · 마틴 베일',
      },
    }],
  },
  { id: 'line-008', speaker: '지수', text: '왜요? 안에 뭐가 있는데요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-009', speaker: '', text: '다시 침묵.', characterId: null },
  { id: 'line-010', speaker: '마틴', text: '...말씀드려야겠네요.', characterId: 'martin', expression: 'neutral' },
  { id: 'line-011', speaker: '마틴', text: '그 안에는 작은 황동 인덱스가 들어 있었어요, 식별판 같은 거예요.', characterId: 'martin', expression: 'neutral' },
  { id: 'line-012', speaker: '영우', text: '인덱스요? 그게 뭐하는 물건인데요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-013', speaker: '마틴', text: '저도 정확힌 몰라요, 그냥 의뢰받은 대로 만들어 끼워넣었을 뿐이라서.', characterId: 'martin', expression: 'neutral' },
  {
    id: 'line-014', speaker: '마틴', text: '그... M.K. 계열 표식이라고만 들었어요.', characterId: 'martin', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-mk-inscription-focused-inquiries', code: 'E-MV5', category: 'record', title: 'M.K.의 문의 — 각인에만 집중',
        description: 'M.K. 계열 계정이 마틴에게 보냈던 과거 문의들. 물건 전체가 아니라 매번 하단 각인 부분만 반복해서 물었다.',
        discoveredLocationText: '전화 통화 · 마틴 베일',
      },
    }],
  },
  { id: 'line-015', speaker: '지수', text: '...M.K.요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-016', speaker: '', text: '지수가 무의식적으로 가방에 걸린 M.K. 열쇠를 만진다.', characterId: null },
  { id: 'line-017', speaker: '마틴', text: '아, 제가 말이 좀 많았네요. 아무튼 그거 없어졌으면 큰일이에요, 빨리 찾으시는 게 좋을 거예요.', characterId: 'martin', expression: 'neutral' },
  {
    id: 'line-018', speaker: '', text: '전화가 끊긴다. [ 증거: 내부 황동 인덱스의 존재 ] [ 의문점: 이 인덱스는 왜 있었는가 ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-internal-index', code: 'E-V12', category: 'record', title: '내부 황동 인덱스의 존재',
          description: '마틴이 K-01 하단에 끼워 넣었다는 작은 황동 인덱스(식별판). M.K. 계열 표식이라는 것 외에는 마틴도 정확히 모른다.',
          discoveredLocationText: '전화 통화 · 마틴 베일',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-k01-submission-photo', code: 'E-MV2', category: 'photo', title: 'K-01 출품 당시 사진',
          description: '마틴이 K-01을 전시에 내놓을 때 찍어둔 사진. 지금과 비교할 수 있는 유일한 "출품 당시" 기록이다.',
          discoveredLocationText: '전화 통화 · 마틴 베일',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-k01-catalog-year-mismatch', code: 'E-MV3', category: 'record', title: '카탈로그 제작 연도 — 출품 기록과 불일치',
          description: '마틴이 알고 있는 K-01의 제작 연도가, 전시 카탈로그에 적힌 연도와 다르다. 둘 중 하나는 틀렸다.',
          discoveredLocationText: '전화 통화 · 마틴 베일',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-k01-inscription-sharper', code: 'E-MV4', category: 'testimony', title: '하단 각인 — 선명도 변화',
          description: '마틴이 기억하는 K-01의 하단 각인은 흐릿했는데, 회수된 K-01 사진 속 각인은 눈에 띄게 선명하다.',
          discoveredLocationText: '전화 통화 · 마틴 베일',
        },
      },
    ],
  },
  { id: 'line-019', speaker: '영우', text: '지수야, 진짜 도난품은 K-01이 아니었어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-020', speaker: '지수', text: '그 안에 있던 인덱스였어. 그럼 누가 그걸 원했을까.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-021', speaker: '영우', text: '애드리언씨, 그 사람 다시 만나야겠다.', characterId: 'youngwoo', expression: 'serious' },
];

const week2Scene015Lines = [
  { id: 'line-001', speaker: '', text: '전시장. 애드리언이 여전히 K-01 근처를 서성이고 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '애드리언씨, 저희 이제 좀 정확하게 여쭤볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '애드리언', text: '...네.', characterId: 'adrian', expression: 'suspicious' },
  { id: 'line-004', speaker: '영우', text: 'K-01 안에 인덱스가 있었는데 사라졌어요. 아까 받침 내부 깊이 물어보신 거, 이거랑 관련 있는 거 아니에요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '애드리언이 한숨을 쉰다.', characterId: null },
  { id: 'line-006', speaker: '애드리언', text: '...사실대로 말씀드릴게요.', characterId: 'adrian', expression: 'serious' },
  {
    id: 'line-007', speaker: '애드리언', text: '저 비공식 매입 의뢰를 받고 있었어요. 근데 그 의뢰인이 요구한 게 좀 이상했어요.', characterId: 'adrian', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-inquiry', code: 'E-B01', category: 'record', title: 'K-01 외부 문의 기록',
        description: '최근 K-01과 비슷한 황동 물건에 대한 외부 문의가 있었다. 제작 시기, 재질, 세부 각인까지 비정상적으로 구체적이었다.',
        discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
      },
    }],
  },
  { id: 'line-008', speaker: '지수', text: '어떻게 이상했는데요?', characterId: 'jisoo', expression: 'serious' },
  {
    id: 'line-009', speaker: '애드리언', text: '가격 얘기는 한 번도 없었어요. 대신 하단 각인의 정확한 형태, 받침 내부 깊이, 분해 가능한 구조인지만 계속 물었어요.', characterId: 'adrian', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-client-email', code: 'E-V10', category: 'record', title: '애드리언의 의뢰인 메일',
        description: '가격 얘기는 한 번도 없이, 하단 각인의 정확한 형태·받침 내부 깊이·분해 가능한 구조인지만 반복해서 묻는 의뢰 메일.',
        discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
      },
    }],
  },
  { id: 'line-010', speaker: '', text: '애드리언이 폰을 꺼내 메일 일부를 보여준다.', characterId: null },
  {
    id: 'line-011', speaker: '영우', text: '이거... 소유 이력 물어본 것도 있네요.', characterId: 'youngwoo', expression: 'serious',
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-adrian-sender', code: 'E-B02', category: 'record', title: '문의 발신 계정 — M.K.',
          description: '문의 메일의 발신 계정명은 "M.K."뿐이었다. 회신 주소나 소속 표기가 전혀 없었다.',
          discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-adrian-email-re-prefix', code: 'E-B02B', category: 'record', title: '메일 제목의 "Re:"',
          description: '문의 메일 제목이 "Re: 문의드립니다"로 시작한다. Re:는 보통 답장에 붙는 접두사다 — 애초에 누군가 먼저 답장을 보낸 적 있다는 뜻일 수 있다.',
          discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
        },
      },
    ],
  },
  {
    id: 'line-012', speaker: '애드리언', text: '네, 저도 이상해서 몇 번 되물었는데 답이 항상 짧고 사무적이었어요.', characterId: 'adrian', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-sent-mail-cache', code: 'E-B08', category: 'record', title: '애드리언 보낸메일 캐시',
        description: '애드리언이 M.K. 계정에 보낸 답장 캐시. 짧고 사무적인 회신들만 남아 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
      },
    }],
  },
  { id: 'line-013', speaker: '', text: '[ 증거: 애드리언의 의뢰인 메일(구조·각인 집착) ] 등록. 메일 문체가 어딘가 낯익다 — 아직 명확히 짚이진 않는다.', characterId: null },
  {
    id: 'line-014', speaker: '애드리언', text: '저도 이제 와서 보니, 이게 그냥 매입이 아니라 뭔가 다른 걸 노린 거였구나 싶네요.', characterId: 'adrian', expression: 'serious',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-once-only-claim', code: 'E-B09', category: 'testimony', title: '애드리언의 재진술 — 단 한 번뿐인 연락',
        description: '애드리언 콜 — "M.K. 계정과는 이번이 처음이자 마지막 연락"이라는 진술.',
        discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
      },
    }],
  },
  { id: 'line-015', speaker: '지수', text: '애드리언씨도 이용당하신 거네요.', characterId: 'jisoo', expression: 'neutral' },
  {
    id: 'line-016', speaker: '애드리언', text: '...그런 것 같습니다, 제가 아는 건 여기까지예요.', characterId: 'adrian', expression: 'neutral',
    effects: [{
      type: 'addEvidence',
      evidence: {
        id: 'evidence-adrian-tablet-history', code: 'E-B10', category: 'record', title: '애드리언 태블릿 — 과거 문의 기록',
        description: '애드리언의 태블릿 브라우저 기록. 몇 달 전에도 비슷한 이니셜의 계정에서 K-01 관련 문의가 몇 차례 왔었지만, 스팸으로 보고 무시한 흔적이 남아 있다.',
        discoveredLocationText: 'Pop-up Exhibition · 애드리언 심문',
      },
    }],
  },
  { id: 'line-017', speaker: '영우', text: '감사합니다, 레오씨한테 다시 가서 보관함 이후를 물어봐야겠다.', characterId: 'youngwoo', expression: 'serious' },
];

const week2Scene016Lines = [
  { id: 'line-001', speaker: '', text: '레오가 전시장 뒤편 계단에 힘없이 앉아 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '레오씨.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '레오', text: '...또 오셨네요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-004', speaker: '영우', text: '하나만 더 여쭤볼게요, 보관함에 K-01 넣으신 다음엔 어떻게 하셨어요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '레오', text: '넣고 나서 인증 사진 찍어서 그 계정으로 보냈어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '그다음엔요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '레오', text: '그냥 다시 현장으로 돌아왔죠, 지시받은 건 딱 거기까지였어요.', characterId: 'leo', expression: 'neutral' },
  { id: 'line-008', speaker: '영우', text: '그럼 그 이후에 누가 보관함에 다시 갔는지는 모르시는 거예요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-009', speaker: '레오', text: '...몰라요, 저는 정말 그 뒤론 아무것도 몰라요.', characterId: 'leo', expression: 'blank' },
  { id: 'line-010', speaker: '', text: '레오가 잠시 말을 멈춘다.', characterId: null },
  { id: 'line-011', speaker: '레오', text: '근데 생각해보니까 이상하긴 해요, 저한테 온 지시는 항상 짧고 사무적이었거든요. 꼭 필요한 말만, "넣어라" "사진 보내라" 이런 식으로.', characterId: 'leo', expression: 'blank' },
  {
    id: 'line-012', speaker: '', text: '[ 의문점: 레오가 떠난 뒤 보관함에 접근한 사람은 누구인가 ] 등록. [ 증거 갱신: 카페 보관함 기록 = "K-01 회수 장소" → "레오 이후 누군가 다시 접근할 수 있었던 지점" ]', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-cafe-storage-log',
      summary: '단순한 K-01 회수 장소가 아니라, 레오 이후 누군가 다시 접근할 수 있었던 지점.',
    }],
  },
  { id: 'line-013', speaker: '레오', text: '...저 혹시, 저도 이용당한 거예요?', characterId: 'leo', expression: 'shocked' },
  { id: 'line-014', speaker: '지수', text: '아직 확실친 않아요, 근데 그럴 가능성이 있어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-015', speaker: '레오', text: '...하.', characterId: 'leo', expression: 'blank' },
  { id: 'line-016', speaker: '영우', text: '알려주셔서 감사해요, 저희가 좀 더 알아볼게요.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-017', speaker: '지수', text: '소피씨한테 가보자, 그날 그 근처에 계속 계셨으니까.', characterId: 'jisoo', expression: 'serious' },
];

const week2Scene017Lines = [
  { id: 'line-001', speaker: '', text: '카페 카운터. 소피가 컵을 정리하고 있다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '소피씨, 잠깐 여쭤볼 게 있는데요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '소피', text: '네, 뭔데요?', characterId: 'sophie', expression: 'curious' },
  { id: 'line-004', speaker: '영우', text: '그 골목 보관함 근처에서 뭔가 특별한 거 기억나는 거 있으세요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '소피', text: '음... 딱히 특별한 건 없었는데.', characterId: 'sophie', expression: 'curious' },
  {
    id: 'line-006', speaker: '', text: '소피가 잠시 생각에 잠긴다.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-sophie-initial-sighting', code: 'E-SP1', category: 'testimony', title: '소피의 목격담 — 창가 자리의 회색 후드',
          description: '소피 첸(카페 직원) — 회색 후드 남성이 카페에 들어와 바로 창가 자리에 앉았다는 목격담.',
          discoveredLocationText: 'Café near Circular Quay · 소피 진술',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-cafe-staff-tip', code: 'E-SEL2', category: 'testimony', title: '카페 직원 증언',
          description: '소피 첸 — 그레이 후드 남성은 주문 후 바로 앉지 않았고, 가방을 의자 아래 뒀으며, 누군가와 통화를 했다.',
          discoveredLocationText: 'Café near Circular Quay · 소피 진술',
        },
      },
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-leo-mobile-preorder', code: 'E-SP2', category: 'record', title: '레오의 모바일 선주문 기록',
          description: '레오는 카페 도착 전 모바일 앱으로 미리 주문을 넣어뒀다 — 직접 줄을 서거나 자리를 잡을 필요가 없었다.',
          discoveredLocationText: 'Café near Circular Quay · 주문 앱 기록',
        },
      },
    ],
  },
  { id: 'line-007', speaker: '소피', text: '아, 맞다. 그 친절한 가이드분 있잖아요, 다니엘씨.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-008', speaker: '지수', text: '네?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-009', speaker: '소피', text: '그분이 아까 낮에 관광객 분실물 맡긴다고 보관함 사용법을 저한테 물어봤었어요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-010', speaker: '영우', text: '아, 저희도 그거 봤어요.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-011', speaker: '소피', text: '근데 생각해보니 그거 말고도, 그분이 주문도 안 하고 카페 안쪽에 두 번이나 들어왔었어요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-012', speaker: '지수', text: '안쪽이요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-013', speaker: '소피', text: '네, 처음엔 화장실 찾는 줄 알았는데, 두 번째는 그냥... 뭘 확인하는 것처럼 보이더라고요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-014', speaker: '', text: '소피가 조금 더 신중하게 기억을 더듬는다.', characterId: null },
  { id: 'line-015', speaker: '소피', text: '그리고 레오씨가 보관함 쓰고 나서 얼마 안 있다가 다니엘씨가 그 구역에 있었던 것도 기억나요.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-016', speaker: '영우', text: '같은 구역에요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-017', speaker: '소피', text: '네... 그때는 그냥 친절한 분인 줄 알았는데.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-018', speaker: '', text: '[ 의문점: 다니엘이 왜 보관함 구역에 반복해서 있었는가 ] 등록.', characterId: null },
  { id: 'line-019', speaker: '소피', text: '아, 근데 저 확신은 없어요, 그냥 우연이었을 수도 있고.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-020', speaker: '지수', text: '아니에요, 도움 많이 됐어요.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-021', speaker: '', text: '소피가 무심코 다니엘의 말투를 흉내 낸다.', characterId: null },
  { id: 'line-022', speaker: '소피', text: '그분이 그때 그러셨거든요, "괜찮아요, 제가 확인해드릴게요" 이런 식으로, 되게... 정돈된 말투로.', characterId: 'sophie', expression: 'curious' },
  { id: 'line-023', speaker: '영우', text: '(작게, 지수에게) 지수야, 이거 우연이 너무 많이 겹치는데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-024', speaker: '지수', text: '확인해보자, 다니엘씨가 정말 가이드가 맞는지.', characterId: 'jisoo', expression: 'serious' },
];

const week2Scene018Lines = [
  { id: 'line-001', speaker: '', text: '전시장 밖. 영우가 다니엘의 명찰에 적힌 여행사로 전화를 건다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '안녕하세요, 혹시 다니엘 리드라는 가이드분 소속이신가요?', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-003', speaker: '', text: '전화 너머로 잠시 검색하는 소리가 들린다.', characterId: null },
  { id: 'line-004', speaker: '', text: '"죄송한데, 저희 쪽엔 그 이름으로 등록된 가이드가 없습니다."', characterId: null },
  { id: 'line-005', speaker: '영우', text: '어... 정말요? 명찰까지 있었는데.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-006', speaker: '', text: '"저희 로고를 쓰신 것 같긴 한데, 정식 등록 명단엔 없어요." 전화가 끊긴다.', characterId: null },
  { id: 'line-007', speaker: '지수', text: '헐, 없대?????', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-008', speaker: '영우', text: '어, 분명히 없다고 하는데.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-009', speaker: '', text: '마침 다니엘이 전시장 쪽에서 걸어온다.', characterId: null },
  { id: 'line-010', speaker: '지수', text: '다니엘씨, 잠깐 여쭤볼 게 있는데요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '다니엘', text: '네, 뭔가요?', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-012', speaker: '영우', text: '저희가 그 여행사에 전화해봤는데, 다니엘씨 등록이 안 되어 있다고 하더라고요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-013', speaker: '', text: '다니엘의 표정이 아주 잠깐 굳는다.', characterId: null },
  { id: 'line-014', speaker: '다니엘', text: '아... 그거요. 제가 프리랜서라서요, 등록이 좀 누락됐나 보네요, 종종 있는 일이에요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-015', speaker: '지수', text: '그래도 명찰까지 회사 로고인데, 좀 이상하지 않아요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-016', speaker: '다니엘', text: '음, 임시로 빌려 쓴 거예요. 바쁜 시즌엔 그렇게들 해요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-017', speaker: '', text: '다니엘이 웃으며 화제를 넘기려 한다 — 그러나 문장이 조금씩 짧아지고 있다.', characterId: null },
  { id: 'line-018', speaker: '영우', text: '(작게, 지수에게) 저 사람 지금 되게 급하게 넘어가려는 것 같은데.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-019', speaker: '지수', text: '그러게, 뭔가 숨기고 있어.', characterId: 'jisoo', expression: 'suspicious' },
  {
    id: 'line-020', speaker: '', text: '[ 증거: 다니엘 소속 여행사 미등록 확인 ] [ 증거 갱신: 다니엘 명찰 = "가이드 신분 증명" → "여행사 소속 확인 자료(그러나 등록 안 됨)" ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-daniel-travel-agency-unregistered', code: 'E-V10b', category: 'record', title: '다니엘 소속 여행사 미등록 확인',
          description: '다니엘이 명찰에 적은 여행사에 직접 확인한 결과, 그 이름으로 등록된 가이드가 없다는 답변을 받았다.',
          discoveredLocationText: '전화 통화 · 여행사',
        },
      },
      {
        type: 'updateEvidence',
        id: 'evidence-daniel-badge',
        summary: '단순한 가이드 신분 증명이 아니라, 여행사 소속 확인 자료(그러나 정식 등록은 안 되어 있음).',
      },
    ],
  },
  { id: 'line-021', speaker: '다니엘', text: '아무튼 저는 바빠서 이만, 좋은 하루 보내세요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-022', speaker: '', text: '다니엘이 자리를 뜬다. 명찰을 자세히 보면 이름 부분만 스티커처럼 새것으로 보인다.', characterId: null },
  { id: 'line-023', speaker: '지수', text: '아까 단체사진 찍었던 사람들한테 다니엘씨에 대해 물어보자.', characterId: 'jisoo', expression: 'serious' },
];

const week2Scene019Lines = [
  { id: 'line-001', speaker: '', text: '서큘러키. 단체사진에 있던 관광객들을 찾아 다시 말을 건다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '저, 아까 단체사진 같이 찍으신 분이시죠?', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-003', speaker: '', text: '"아 네, 맞아요."', characterId: null },
  { id: 'line-004', speaker: '영우', text: '혹시 다니엘씨랑 어떻게 아시는 사이세요? 투어 신청하신 거예요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '', text: '"아뇨, 그냥 여기서 사진 찍고 있었는데 그분이 먼저 와서 무료로 안내해주신다고 하셔서요."', characterId: null },
  { id: 'line-006', speaker: '영우', text: '아 그러셨구나.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-007', speaker: '', text: '다른 관광객에게도 다가간다.', characterId: null },
  { id: 'line-008', speaker: '', text: '"저도요, 사실 아까 그 단체사진 찍을 때 다들 처음 뵙는 분들이었어요."', characterId: null },
  { id: 'line-009', speaker: '지수', text: '서로 모르는 사이셨어요?', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-010', speaker: '', text: '"네, 다 우연히 그 자리에 있던 사람들이었죠. 근데 그분이 워낙 자연스럽게 이끄셔서 몰랐어요." "저도 마찬가지예요, 정식 투어인 줄 알았는데 지금 생각해보니 정식 명찰이나 그런 것도 없었던 것 같고."', characterId: null },
  {
    id: 'line-011', speaker: '', text: '[ 증거: 관광팀 단체사진 재해석 근거 ] [ 증거 갱신: 관광팀 단체사진 = "다니엘의 투어 진행 증명" → "정식 관광팀이 아니며 군중 위치가 의도적으로 배치됐다는 증거" ] 등록.', characterId: null,
    effects: [
      {
        type: 'addEvidence',
        evidence: {
          id: 'evidence-group-photo-reinterpretation', code: 'E-V11b', category: 'testimony', title: '관광팀 단체사진 재해석 근거',
          description: '단체사진 속 관광객들이 서로 처음 만난 사이였고, 정식 명찰이나 투어 표시가 없었다는 증언.',
          discoveredLocationText: 'Circular Quay · 관광객 재조사',
        },
      },
      {
        type: 'updateEvidence',
        id: 'evidence-group-photo',
        summary: '다니엘의 투어 진행 증명이 아니라, 정식 관광팀이 아니며 군중 위치가 의도적으로 배치됐다는 증거.',
      },
    ],
  },
  { id: 'line-012', speaker: '영우', text: '지수야, 그 단체사진, 사람들 위치 다니엘씨가 다 정해줬잖아.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '그게... 그냥 사진 잘 나오게 하려던 게 아니라.', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-014', speaker: '영우', text: '입구 시야를 가리려던 거였을 수도 있어.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-015', speaker: '지수', text: '일정표 다시 봐야겠다, 처음부터 끝까지.', characterId: 'jisoo', expression: 'serious' },
];

const week2Scene020Lines = [
  { id: 'line-001', speaker: '', text: '카페 골목. 지수와 영우가 지금까지 모은 기록들을 테이블에 펼쳐놓는다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '자, 처음부터 순서대로 정리해보자.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '서큘러키에서 사진 찍어준 거.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '영우', text: '그때 내 가방 쪽 열쇠를 계속 보고 있었잖아, 지수야, 그거 기억나?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '어... 그러고보니, 구도 잡아준다면서 열쇠 위치 만졌었어.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-006', speaker: '', text: '표면상 일정과 실제 기능을 하나씩 연결해본다.', characterId: null },
  { id: 'line-007', speaker: '영우', text: '서큘러키 기념사진 → 지수 가방의 M.K. 열쇠 확인이었던 거야.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '더 록스 골목 설명 → 직원문이랑 카페 보관함 위치 미리 봐둔 거고.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-009', speaker: '영우', text: '전시장 자유 관람 → 그동안 레오씨랑 클레어씨 업무 습관 다 파악한 거네.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-010', speaker: '지수', text: '단체사진... → 입구에 사람들 세워서 시야 가린 거였어.', characterId: 'jisoo', expression: 'shocked' },
  { id: 'line-011', speaker: '영우', text: '카페 휴식 → 그 사이에 K-01 보관하고 내부 부품 회수한 거고.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-012', speaker: '', text: '표가 완성된다. 지수가 조용히 종이를 내려다본다.', characterId: null },
  { id: 'line-013', speaker: '지수', text: '처음부터... 이 하루 전체가 다 설계된 거였어.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-014', speaker: '영우', text: '사진 찍어준 것도, 보관함 알려준 것도, 단체사진 찍자고 한 것도.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-015', speaker: '영우', text: '전부 다 계산된 거였다는 거잖아.', characterId: 'youngwoo', expression: 'shocked' },
  {
    id: 'line-016', speaker: '', text: '[ 증거 갱신: 관광 일정표 = "다니엘의 이동 기록" → "군중 배치·직원문 확인·보관함 회수를 정리한 작전표" ]', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-itinerary',
      summary: '단순한 이동 기록이 아니라, 군중 배치·직원문 확인·보관함 회수를 정리한 작전표.',
    }],
  },
  { id: 'line-017', speaker: '지수', text: '근데 왜 하필 우리야, 왜 하필 이 열쇠였을까.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-018', speaker: '영우', text: '그건 직접 물어봐야 할 것 같아, 이제 진짜 마지막이야.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-019', speaker: '지수', text: '가자, 다니엘씨한테.', characterId: 'jisoo', expression: 'serious' },
];

const week2Scene021Lines = [
  { id: 'line-001', speaker: '', text: '전시장. 다니엘이 짐을 정리하는 척 서 있다. 지수와 영우가 그 앞에 선다.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '다니엘씨, 드릴 말씀이 있어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '다니엘', text: '네, 무슨 일이시죠.', characterId: 'daniel-guide', expression: 'curious' },
  { id: 'line-004', speaker: '', text: '[ 심문 1단계 — 신분: "정식 가이드였다" ]', characterId: null },
  { id: 'line-005', speaker: '영우', text: '저희가 여행사에 확인해봤는데, 등록된 가이드가 아니시더라고요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-006', speaker: '다니엘', text: '말씀드렸잖아요, 프리랜서라 등록이 누락됐다고.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-007', speaker: '지수', text: '그럼 왜 다른 관광객분들은 다 처음 뵙는 사이였다고 하시던데요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '', text: '[ 심문 2단계 — "등록 누락이지만 투어는 진짜였다" ]', characterId: null },
  { id: 'line-009', speaker: '다니엘', text: '...그건, 그날그날 모인 분들끼리 편하게 안내해드리는 방식이라서요. 정식 투어가 아니라도 투어는 투어예요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-010', speaker: '영우', text: '그럼 명찰 로고는요? 회사에 문의해보니 이 명찰 자체가 발급된 적이 없대요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-011', speaker: '', text: '다니엘이 잠깐 침묵한다. 이내 여유 있게 웃는다.', characterId: null },
  { id: 'line-012', speaker: '다니엘', text: '명찰이 가짜라고 해서 제가 범행을 저질렀다는 증거는 안 되잖아요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-013', speaker: '지수', text: '...맞아요, 그것만으로는 안 되죠. 그래서 하나씩 더 여쭤볼게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-014', speaker: '', text: '[ 심문 3단계 — "전시장을 추천했을 뿐 내부 관계자는 몰랐다" ]', characterId: null },
  { id: 'line-015', speaker: '영우', text: '근데 아까 K-01 진열장 보시면서 직원문 방향까지 먼저 아셨잖아요, 처음 보는 구조라면서요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-016', speaker: '다니엘', text: '...그냥 그 정도야 눈치로 알 수 있죠, 문이 어느 쪽으로 열리는지 정도는.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-017', speaker: '지수', text: '그리고 카페 보관함 구조도 처음부터 유난히 자세히 보셨어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-018', speaker: '', text: '[ 심문 4단계 — "레오와 연락했지만 사진 의뢰 소개뿐이었다" ]', characterId: null },
  { id: 'line-019', speaker: '영우', text: '저희가 레오씨한테 받은 메시지 기록이요, MK_Consult라는 계정에서 왔던데, 이거 다니엘씨랑 관련 있는 거 아니에요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-020', speaker: '다니엘', text: '저는 그냥 레오씨한테 사진 의뢰 하나 소개해줬을 뿐이에요, 그 이상은 몰라요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-021', speaker: '지수', text: '소개만 한 사람이 그 이후 지시까지 다 알고 있어요? "넣어라" "사진 보내라" 문장 습관까지 레오씨가 다 기억하던데요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-022', speaker: '', text: '[ 심문 5단계 — "보관함 근처는 분실물 때문이었다" ]', characterId: null },
  { id: 'line-023', speaker: '다니엘', text: '그건... 아까 말씀드렸잖아요, 관광객 가방 맡겨드리느라.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-024', speaker: '영우', text: '소피씨가 그러던데요, 다니엘씨가 커피도 안 시키고 카페 안쪽에 두 번이나 들어왔다고요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-025', speaker: '다니엘', text: '...', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-026', speaker: '', text: '[ 심문 6단계 — "K-01을 만진 건 훼손 확인 때문이었다" ]', characterId: null },
  { id: 'line-027', speaker: '지수', text: '레오씨가 보관함에 넣은 뒤로 아무도 안 왔어야 하는데, K-01 하단만 정확히 분해돼 있었어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-028', speaker: '다니엘', text: '...그건, 제가 우연히 발견하고 혹시 훼손된 게 아닌가 확인만 한 거예요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-029', speaker: '영우', text: '확인만 한 사람이 안에 있던 걸 왜 다시 안 넣어놨을까요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-030', speaker: '', text: '[ 심문 7단계 — "내부 인덱스는 처음부터 없었다" ]', characterId: null },
  { id: 'line-031', speaker: '다니엘', text: '그런 게 있었다는 증거가 어디 있어요.', characterId: 'daniel-guide', expression: 'neutral' },
  { id: 'line-032', speaker: '지수', text: '제작자 마틴 베일씨한테 직접 확인했어요, 안에 황동 인덱스가 있었다고요. "하단은 절대 열지 말라"고 몇 번이나 당부했었다고 하시던데요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-033', speaker: '', text: '다니엘의 표정에서 처음으로 여유가 완전히 사라진다.', characterId: null },
  { id: 'line-034', speaker: '', text: '[ 심문 8단계 — "M.K. 열쇠는 사건과 무관하다" ]', characterId: null },
  { id: 'line-035', speaker: '영우', text: '그리고 마지막으로, 서큘러키에서 찍은 사진 다시 봤어요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-036', speaker: '', text: '지수가 사진을 확대해 보여준다. 다니엘의 시선이 카메라가 아니라 지수의 가방에 달린 M.K. 열쇠를 향해 있다. 사진 찍기 직전, 열쇠 위치를 조정하던 손동작도 그대로 남아 있다.', characterId: null },
  { id: 'line-037', speaker: '지수', text: '다니엘씨, 이때 카메라 안 보고 있었어요. 제 가방에 달린 이 열쇠 보고 있었어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-038', speaker: '지수', text: '전시장을 추천하기도 전에, 이미 이 열쇠를 알고 계셨던 거잖아요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-039', speaker: '', text: '긴 침묵. 다니엘의 태도가 완전히 바뀐다 — 더 이상 웃지 않는다.', characterId: null },
  { id: 'line-040', speaker: '다니엘', text: '...네, 맞아요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-041', speaker: '다니엘', text: '그 열쇠를 서큘러키에서 처음 봤을 때부터 알아봤어요.', characterId: 'daniel-guide', expression: 'serious' },
  {
    id: 'line-042', speaker: '', text: '[ 증거 갱신 일괄: 서큘러키 커플 사진 → 다니엘의 사전 인지 증명 / 회색 캡 목격담 → 의도적 유도 / 다니엘 명찰 → 위장 출입증 / 레오의 크로스백 → 희생양 구조의 증거 ]', characterId: null,
    effects: [
      { type: 'updateEvidence', id: 'evidence-circular-quay-photo', summary: '단순한 기념사진이 아니라, 다니엘이 사건 전부터 M.K. 열쇠를 알아봤다는 사전 인지의 증명.' },
      { type: 'updateEvidence', id: 'evidence-daniel-graycap-sighting', summary: '단순한 목격 정보가 아니라, 레오에게 혐의를 집중시키기 위한 다니엘의 의도적 유도.' },
      { type: 'updateEvidence', id: 'evidence-daniel-badge', summary: '여행사 소속 확인 자료가 아니라, 행사 임시 패스를 개조한 위장 출입증.' },
      { type: 'updateEvidence', id: 'evidence-leo-bag-strap-shape', summary: '의심 단계를 넘어, 다니엘이 선택한 희생양 구조와 부분 의뢰를 보여주는 증거.' },
    ],
  },
  { id: 'line-043', speaker: '다니엘', text: 'K-01은 제 목표가 아니었어요, 그 안에 있던 인덱스가 필요했을 뿐이에요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-044', speaker: '다니엘', text: '그래서 전체는 다시 돌려놨어요, 전 훔친 게 아니라 필요한 것만 회수한 거예요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-045', speaker: '지수', text: '그게 무슨 차이가 있어요, 레오씨한테 훔치게 시킨 건 똑같잖아요.', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-046', speaker: '다니엘', text: '그 인덱스는 원래 있어야 할 곳으로 돌아가는 것뿐이에요, 정당한 소유자한테요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-047', speaker: '영우', text: '그 "정당한 소유자"가 누군지도 안 밝히면서요?', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-048', speaker: '다니엘', text: '레오씨도 돈을 받고 스스로 선택한 거예요, 저는 강요하지 않았어요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-049', speaker: '지수', text: '선택하게 만든 거잖아요, 필요한 정보는 다 숨기고 어디까지 하면 되는지도 다니엘씨가 다 정해놓고.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-050', speaker: '다니엘', text: '관광객들도 저 때문에 직접적인 피해는 없었잖아요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-051', speaker: '영우', text: '그 사람들을 몰라도 되게 이용한 거잖아요, 입구 시야 가리려고 세워놓은 거고.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-052', speaker: '지수', text: '윤민아씨도, 클레어씨도, 다니엘씨가 흘린 정보 때문에 한동안 의심받았어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-053', speaker: '다니엘', text: '...', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-054', speaker: '지수', text: '저희한테 친절했던 것도 전부 다 이 열쇠 때문이었어요?', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-055', speaker: '', text: '다니엘이 처음으로 시선을 피한다.', characterId: null },
  { id: 'line-056', speaker: '다니엘', text: '...전부는 아니에요.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-057', speaker: '다니엘', text: '그건 제가 대답 못 하는 게 아니라 안 하는 겁니다.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-058', speaker: '지수', text: '...', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-059', speaker: '영우', text: '어쨌든 작품을 돌려놨다고 해서 부품을 훔치고 현장을 다 조작한 책임이 없어지는 건 아니에요.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-060', speaker: '다니엘', text: '...그 말은 맞습니다.', characterId: 'daniel-guide', expression: 'serious' },
  { id: 'line-061', speaker: '', text: '다니엘이 조용히 고개를 숙인다. — 다음 장면(최종 사건 재구성)으로 이어짐.', characterId: null },
];

const week2Scene022Lines = [
  { id: 'line-001', speaker: '', text: '카페 골목. 심문이 끝난 뒤, 지수와 영우가 마지막으로 사건 전체를 정리한다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '하... 이제 진짜 다 끝났나보다.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-003', speaker: '지수', text: '정리해보자, 처음부터 끝까지.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '', text: '두 사람이 지금까지 모은 12개의 사건 조각을 순서대로 늘어놓기 시작한다.', characterId: null },
  { id: 'line-005', speaker: '영우', text: '1. 다니엘이 서큘러키에서 M.K. 열쇠를 발견한다 — 목적: 지수와 영우를 관찰 대상으로 정하기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-006', speaker: '지수', text: '2. 다니엘이 지수와 영우를 K-01 전시장으로 유도한다 — 목적: 표적을 인덱스 근처로 데려가기 위해.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '영우', text: '3. 관광 일정과 단체사진으로 전시장 앞 군중을 배치한다 — 목적: 입구 시야를 가리기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '4. 클레어의 관리 관행과 카메라 동기화 정보를 파악한다 — 목적: 11분 루프를 만들 방법을 확보하기 위해.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-009', speaker: '영우', text: '5. 익명 계정으로 레오에게 하단 촬영을 의뢰한다 — 목적: 레오를 자연스럽게 진열장에 접근시키기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-010', speaker: '지수', text: '6. 추가 금액으로 레오가 K-01을 옮기도록 만든다 — 목적: 실제 반출을 레오 손으로 실행시키기 위해.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-011', speaker: '영우', text: '7. 레오는 K-01을 포장해 임시 보관함에 넣는다 — 목적: 물건을 안전하게 격리해두기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-012', speaker: '지수', text: '8. 다니엘은 미리 확인한 방식으로 보관함에 접근한다 — 목적: 레오 모르게 다시 접근하기 위해.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '영우', text: '9. K-01 하단을 열어 내부 황동 인덱스를 제거한다 — 목적: 진짜 목표만 회수하기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '10. K-01 전체는 다시 남겨 레오가 모든 혐의를 받게 한다 — 목적: "해결된 사건"처럼 보이게 하기 위해.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '영우', text: '11. 다니엘은 회색 캡 목격담과 수사 협조로 방향을 통제한다 — 목적: 의심이 자신에게 오지 않게 하기 위해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-016', speaker: '지수', text: '12. 서큘러키 사진이 다니엘의 사전 인지를 증명하며 최종 진실이 완성된다.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-017', speaker: '', text: '12개 조각이 모두 맞춰지며 전체 그림이 완성된다.', characterId: null },
  { id: 'line-018', speaker: '영우', text: '와, 이렇게 늘어놓고 보니까 진짜 처음부터 끝까지 다 계산이었네.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-019', speaker: '지수', text: '근데 하나는 아직도 모르겠어.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-020', speaker: '지수', text: '왜 하필 이 열쇠였을까, M.K.가 대체 뭔데.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-021', speaker: '영우', text: '그건... 다니엘도 말 안 해줬잖아.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '지수', text: '그러게, 끝까지 그것만은 안 알려주더라.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-023', speaker: '', text: '사건 정리가 마무리된다.', characterId: null },
];

const week2Scene023Lines = [
  { id: 'line-001', speaker: '', text: '저녁, 숙소. 지수와 영우가 짐을 정리하며 오늘 하루를 되짚는다.', characterId: null },
  { id: 'line-002', speaker: '영우', text: '다니엘씨는 인계됐고, 레오씨는... 따로 처리된다고 하더라.', characterId: 'youngwoo', expression: 'neutral' },
  { id: 'line-003', speaker: '지수', text: '응, 들었어.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-004', speaker: '', text: '지수가 창밖을 바라본다.', characterId: null },
  { id: 'line-005', speaker: '지수', text: '다니엘씨가 마지막에 그랬잖아.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '"그 열쇠, 계속 가지고 있으면 다음엔 오늘처럼 우연처럼 끝나지 않을 거예요."', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-007', speaker: '영우', text: '...그 말 나도 계속 생각나.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-008', speaker: '', text: '지수가 가방에서 M.K. 열쇠를 꺼내 본다.', characterId: null },
  { id: 'line-009', speaker: '지수', text: '이게 그냥 기념품이 아니었어, 처음부터.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '영우', text: '다니엘씨가 우리한테 접근한 이유가 이거 하나였다는 거잖아.', characterId: 'youngwoo', expression: 'serious' },
  {
    id: 'line-011', speaker: '', text: '[ 기존 증거 설명 갱신: M.K. 황동 열쇠 = "1주차의 미해결 기념품" → "다니엘이 지수에게 접근한 이유이자 사건 전 인지의 증거" ] [ 장기 미스터리: MK_Consult는 M.K. 표식이 있는 물건을 추적한다 ] [ 장기 미스터리: 우리가 우연히 여기 온 게 아닐 수도 있다 ] 등록.', characterId: null,
    effects: [{
      type: 'updateEvidence',
      id: 'evidence-mk-key',
      summary: '1주차의 미해결 기념품이 아니라, 다니엘이 지수에게 접근한 이유이자 사건 전 인지의 증거.',
    }],
  },
  { id: 'line-012', speaker: '지수', text: '영우, 우리가 여기 온 것도... 진짜 우연이었을까?', characterId: 'jisoo', expression: 'annoyed' },
  { id: 'line-013', speaker: '영우', text: '...모르겠어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-014', speaker: '', text: '잠시 침묵이 흐른다.', characterId: null },
  { id: 'line-015', speaker: '영우', text: '근데 하나는 확실해.', characterId: 'youngwoo', expression: 'serious' },
  { id: 'line-016', speaker: '영우', text: '누가 뭘 노리든, 나는 지수 옆에 있을 거야.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-017', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'neutral' },
  { id: 'line-018', speaker: '지수', text: '헤헤, 그거면 됐어.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-019', speaker: '', text: '지수가 열쇠를 다시 가방에 건다.', characterId: null },
  { id: 'line-020', speaker: '지수', text: '사람 함부로 안 믿기로 했잖아, 근데 영우는 믿어.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-021', speaker: '영우', text: '나도, 지수는 믿어.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-022', speaker: '', text: '두 사람이 서로를 마주 보며 옅게 웃는다. 창밖으로 시드니의 밤이 저물어간다.', characterId: null },
  { id: 'line-023', speaker: '지수', text: '내일은 또 무슨 일이 기다리고 있을까.', characterId: 'jisoo', expression: 'neutral' },
  { id: 'line-024', speaker: '영우', text: '글쎄, 근데 뭐가 됐든 같이 있으면 괜찮을 것 같아.', characterId: 'youngwoo', expression: 'happy' },
  { id: 'line-025', speaker: '', text: '암전. — 2주차 종료, 3주차로 이어짐.', characterId: null },
];

// Registry of Week 2 scenes (v4, 전면 재설계 + 탐색허브 재도입) — /dev/week2
// lists these, each linking to /play/game/?scene=<id>. 대부분은 여전히
// nextSceneId로 다음 콘텐츠까지 자동으로 이어지지만(1주차와 같은 관례),
// 세 지점(003 끝/008-review 끝/013 끝)은 파일 헤더 주석대로 허브로 나가고,
// 허브에서 인라인 재생되는 심문 씬들(009/010/010b/014~019)은 각자
// week2-*-interview-return 가상 id로 허브에 되돌아온다. 미니게임 핸드오프
// 두 곳(008 -> 008-minigame -> 008-review, 010b -> 010-minigame -> 011)도
// MINIGAME_ROUTES(dev/data/sceneRoutes.js)를 거친다.
const week2Scenes = [
  {
    id: 'week2-scene-001', order: 1, name: '짧은 아침, 풀리지 않은 열쇠',
    location: 'Sydney Accommodation', introLabel: 'ACCOMMODATION', time: '08:50',
    lines: week2Scene001Lines,
    nextSceneId: 'week2-scene-002',
  },
  {
    id: 'week2-scene-002', order: 2, name: '서큘러키, 우연한 가이드',
    location: 'Circular Quay', introLabel: 'CIRCULAR QUAY', time: '09:20',
    lines: week2Scene002Lines,
    nextSceneId: 'week2-scene-003',
  },
  {
    id: 'week2-scene-003', order: 3, name: '더 록스, 보관함을 익히다',
    location: 'The Rocks 골목, 카페 앞', introLabel: 'CIRCULAR QUAY', time: '09:50',
    lines: week2Scene003Lines,
    // [탐색허브 재도입] W2_EXHIBIT_FREE_LOOK 허브(w2-exhibit-floor)로 나간다 —
    // 다섯 인물을 자유 순서로 만난 뒤 단체사진(006)으로 넘어간다.
    nextSceneId: 'week2-hub-entry-exhibit',
  },
  // [탐색허브 재도입] week2-scene-004/005는 더 이상 재생 경로에 없다 — 이
  // 대사는 W2_EXHIBIT_FREE_LOOK 허브의 w2ef-topic-*(dev/data/interactionDefs.js)
  // 상호작용으로 다시 쓰였다. 원본은 참고용으로 그대로 남겨둔다(v3 orphan
  // 씬과 같은 관례 — 위 파일 헤더 주석 참고).
  {
    id: 'week2-scene-004', order: 4, name: '사람들과의 첫 만남',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:10',
    lines: week2Scene004Lines,
    nextSceneId: 'week2-scene-005',
  },
  {
    id: 'week2-scene-005', order: 5, name: '전시장 자유 관람 — 작은 균열들',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:25',
    lines: week2Scene005Lines,
    nextSceneId: 'week2-scene-006',
  },
  {
    id: 'week2-scene-006', order: 6, name: '단체사진, 평범한 배경',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:35',
    lines: week2Scene006Lines,
    nextSceneId: 'week2-scene-007',
  },
  {
    id: 'week2-scene-007', order: 7, name: 'K-01 도난 발생',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:47',
    lines: week2Scene007Lines,
    nextSceneId: 'week2-scene-008',
  },
  {
    id: 'week2-scene-008', order: 8, name: '사진 속 인물 찾기 (도입)',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:52',
    lines: week2Scene008Lines,
    // 기존 사진 분석 미니게임(photo-zoom)을 그대로 재사용 — MINIGAME_ROUTES 참고.
    nextSceneId: 'week2-scene-008-minigame',
  },
  {
    id: 'week2-scene-008-minigame', order: 9, name: '사진 속 인물 찾기 (미니게임)',
    location: 'Pop-up Exhibition', time: '10:53',
    route: '/play/minigame-photo-zoom/',
    // v3 week2-scene-004-minigame과 동일한 7장 구성을 그대로 재사용한다
    // (내용이 동일한 사건 장면이라 사진/핫스팟을 새로 만들 필요가 없음).
    photoSlots: [
      {
        key: 'week2-scene-008-minigame-photo-1', label: '① 10:41 · 한산한 전시장',
        hotspots: [
          { id: 'fig-minah', label: '베이지 코트 여성' },
          { id: 'nameplate', label: 'K-01 명찰 사진' },
        ],
      },
      {
        key: 'week2-scene-008-minigame-photo-2', label: '② 10:43 · 두 사람이 멈춰 선다',
        hotspots: [
          { id: 'fig-adrian', label: '네이비 수트 남성' },
          { id: 'fig-leo', label: '그레이 후드 남성' },
        ],
      },
      {
        key: 'week2-scene-008-minigame-photo-3', label: '③ 10:45 · 사진 찍는 손님',
        hotspots: [
          { id: 'fig-minah', label: '베이지 코트 여성' },
          { id: 'lens-reflection', label: '카메라 렌즈 반사' },
        ],
      },
      {
        key: 'week2-scene-008-minigame-photo-4', label: '④ 10:47 · 단체 관광객 밀려듦',
        hotspots: [
          { id: 'fig-leo', label: '그레이 후드 남성' },
          { id: 'fig-unknown', label: '얼굴이 안 보이는 인물' },
        ],
      },
      {
        key: 'week2-scene-008-minigame-photo-5', label: '⑤ 10:48 · 진열장 문이 열려 있다',
        hotspots: [{ id: 'door-ajar', label: '진열장 문 열림' }],
      },
      {
        key: 'week2-scene-008-minigame-photo-6', label: '⑥ 10:50 · 인파 절정',
        hotspots: [
          { id: 'fig-adrian', label: '네이비 수트 남성' },
          { id: 'fig-minah', label: '베이지 코트 여성' },
        ],
      },
      {
        key: 'week2-scene-008-minigame-photo-7', label: '⑦ 10:53 · 케이스가 비어 있다',
        hotspots: [{ id: 'empty-case', label: 'K-01 상태 변화 (빈 받침대)' }],
      },
    ],
  },
  {
    id: 'week2-scene-008-review', order: 10, name: '사진 분석 마무리',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '10:58',
    lines: week2Scene008ReviewLines,
    // [탐색허브 재도입] 다음 씬으로 직행하지 않고 W2_SUSPECT_INTERVIEWS
    // 허브(w2-hub-plaza)로 나간다 — 윤민아/애드리언/레오를 자유 순서로 탐문.
    nextSceneId: 'week2-hub-entry-suspects',
  },
  {
    id: 'week2-scene-009', order: 11, name: '윤민아 1차 심문 — 반전 1',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '11:10',
    lines: week2Scene009Lines,
    // 탐문 허브(w2-suspect-mina-spot)에서 인라인 재생 — 완료 후 허브로 복귀.
    nextSceneId: 'week2-suspect-interview-return',
  },
  {
    id: 'week2-scene-010', order: 12, name: '애드리언의 애매한 답변',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '11:40',
    // [분리] 원래 애드리언(evasive)+레오(물증 발견) 한 씬이었던 것을 허브
    // 자유 순서(용의자별 독립 방문)를 위해 둘로 나눴다 — 레오 쪽은 아래
    // week2-scene-010b. 대사 내용 자체는 그대로, 자르는 위치만 바뀌었다.
    lines: week2Scene010Lines,
    nextSceneId: 'week2-suspect-interview-return',
  },
  {
    id: 'week2-scene-010b', order: 12.5, name: '레오를 다시 붙잡다 — 물증 포착',
    location: '전시장 직원문 앞', introLabel: 'CIRCULAR QUAY', time: '11:40',
    lines: week2Scene010bLines,
    // 기존 시간대 정리 미니게임(timeline)을 그대로 재사용 — MINIGAME_ROUTES 참고.
    // 레오의 자백(011)까지는 허브로 돌아오지 않고 그대로 이어진다(레오의
    // 방문 순서와 무관하게 안전 — 다른 두 용의자 완료 여부에 의존하지 않음).
    nextSceneId: 'week2-scene-010-minigame',
  },
  {
    id: 'week2-scene-010-minigame', order: 13, name: '시간대 정리 (미니게임)',
    location: 'Café near Circular Quay', time: '11:55',
    route: '/play/minigame-timeline/',
  },
  {
    id: 'week2-scene-011', order: 14, name: '레오, 무너지다 — 반전 2',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '12:05',
    lines: week2Scene011Lines,
    nextSceneId: 'week2-scene-012',
  },
  {
    id: 'week2-scene-012', order: 15, name: 'K-01 회수 — 반전 3',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '12:20',
    lines: week2Scene012Lines,
    nextSceneId: 'week2-scene-013',
  },
  {
    id: 'week2-scene-013', order: 16, name: '사건의 이름을 다시 붙이다',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '13:00',
    lines: week2Scene013Lines,
    // [탐색허브 재도입] W2_REVERIFICATION 허브(w2-hub-plaza)로 나간다 —
    // 마틴 통화/애드리언 재심문/레오 재심문/소피/다니엘 신원 확인/관광객
    // 재조사를 자유 순서로 진행.
    nextSceneId: 'week2-hub-entry-reverify',
  },
  {
    id: 'week2-scene-014', order: 17, name: '마틴 베일과의 통화 — 내부 인덱스',
    location: 'Circular Quay 이동 중 (전화)', introLabel: 'CIRCULAR QUAY', time: '13:20',
    lines: week2Scene014Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-015', order: 18, name: '애드리언의 메일함 — 진짜 의뢰 목적',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '13:40',
    lines: week2Scene015Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-016', order: 19, name: '레오 재심문 — 보관함과 익명 지시',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '14:00',
    lines: week2Scene016Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-017', order: 20, name: '소피의 생활 기억 — 조력자의 균열',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '14:30',
    lines: week2Scene017Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-018', order: 21, name: '신원 조회 — 등록되지 않은 가이드',
    location: 'Pop-up Exhibition / 전화', introLabel: 'CIRCULAR QUAY', time: '15:00',
    lines: week2Scene018Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-019', order: 22, name: '관광팀의 증언 — 서로 모르는 사람들',
    location: 'Circular Quay', introLabel: 'CIRCULAR QUAY', time: '15:30',
    lines: week2Scene019Lines,
    nextSceneId: 'week2-reverify-interview-return',
  },
  {
    id: 'week2-scene-020', order: 23, name: '일정표와 단체사진 재해석 — 작전표',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '16:00',
    lines: week2Scene020Lines,
    nextSceneId: 'week2-scene-021',
  },
  {
    id: 'week2-scene-021', order: 24, name: '다니엘 최종 심문',
    location: 'Pop-up Exhibition', introLabel: 'CIRCULAR QUAY', time: '16:30',
    lines: week2Scene021Lines,
    nextSceneId: 'week2-scene-022',
  },
  {
    id: 'week2-scene-022', order: 25, name: '최종 사건 재구성',
    location: 'Café near Circular Quay', introLabel: 'CIRCULAR QUAY', time: '17:30',
    lines: week2Scene022Lines,
    nextSceneId: 'week2-scene-023',
  },
  {
    id: 'week2-scene-023', order: 26, name: '엔딩 — M.K.라는 불안',
    location: 'Sydney Accommodation', introLabel: 'ACCOMMODATION', time: '21:40',
    lines: week2Scene023Lines,
    // 마지막 씬 — nextSceneId 없음 (playEndingSequence 트리거, 1주차 마지막
    // 씬과 동일한 관례).
  },
];

// week1SceneGroups와 같은 형태 — v4 재설계 22챕터(23콘텐츠 씬 + 미니게임
// 데이터 홀더 2개 = 26개)를 3막 구조로 묶는다.
const week2SceneGroups = [
  {
    range: 'PART 1', label: '보이는 도난 (Ch1~11)',
    sceneIds: [
      'week2-scene-001', 'week2-scene-002', 'week2-scene-003', 'week2-scene-004',
      'week2-scene-005', 'week2-scene-006', 'week2-scene-007', 'week2-scene-008',
      'week2-scene-008-minigame', 'week2-scene-008-review', 'week2-scene-009',
      'week2-scene-010', 'week2-scene-010b', 'week2-scene-010-minigame', 'week2-scene-011', 'week2-scene-012',
    ],
  },
  {
    range: 'PART 2', label: '안내자가 만든 사건 (Ch12~22)',
    sceneIds: [
      'week2-scene-013', 'week2-scene-014', 'week2-scene-015', 'week2-scene-016',
      'week2-scene-017', 'week2-scene-018', 'week2-scene-019', 'week2-scene-020',
      'week2-scene-021', 'week2-scene-022', 'week2-scene-023',
    ],
  },
];



// [2주차 추리 개편 v2 — 연속성 이음매 주의] Week 2 was reworked so no scene
// reveals the full name "Mika Kovac"/"미카 코바치" — it now ends knowing only
// the M.K. / MK_Consult account. Everything below (Week 3 onward) was written
// before that overhaul and already uses the full name from early on (e.g.
// week3-scene-012's "미카 코바치" mentions, its suspect-card-with-percentage
// beat). That mismatch is a known seam for a future Week 3+ overhaul pass —
// not fixed here since this pass was scoped to Week 2 only.

/* MISSING KEY — WEEK 3 · SCENE 01 「아침 출발」
   Dialogue Set: dialogue-week3-scene001
   Scene: week3-scene-001 (Featherdale 이동 중, 08:20) */
const week3Scene001Lines = [
  { id: 'line-001', speaker: '', text: '3주차 첫째 날 아침.\n숙소를 나와 페더데일로 향하는 길.', characterId: null },
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

/* MISSING KEY — WEEK 3 · SCENE 02 「Featherdale 데이트」
   Dialogue Set: dialogue-week3-scene002
   Scene: week3-scene-002 (Featherdale Wildlife Park, 10:00) */
const week3Scene002Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 03 「고양잇과 동물 앞 농담」
   Dialogue Set: dialogue-week3-scene003
   Scene: week3-scene-003 (Featherdale Wildlife Park, 10:20)
   무깽이 리마인드 #3 — 매우 짧게, 단서 처리 없이 지나가는 농담. */
const week3Scene003Lines = [
  { id: 'line-001', speaker: '', text: '작은 우리 앞 표지판.\n"Spotted-tail Quoll (Native Cat)"', characterId: null },
  { id: 'line-002', speaker: '지수', text: '어? 얘 고양이과래요.', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-003', speaker: '영우', text: '이름만 그런 거야.\n사실 유대류라던데.', characterId: 'youngwoo', expression: 'soft' },
  { id: 'line-004', speaker: '지수', text: '몰라요, 그런 거.\n생긴 건 딱 고양이야.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-005', speaker: '지수', text: '무깽이도 지가 저런 줄 알 듯.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-006', speaker: '영우', text: '쟤는 자기가 사자라고 생각하지.', characterId: 'youngwoo', expression: 'smirk' },
  { id: 'line-007', speaker: '지수', text: 'ㅋㅎㅋㅎㅋㅎ\n맞네.', characterId: 'jisoo', expression: 'happy' },
  { id: 'line-008', speaker: '', text: '둘은 잠깐 웃고는 다음 구역으로 걸음을 옮겼다.', characterId: null },
];

/* MISSING KEY — WEEK 3 · SCENE 04 「투어 그룹 사람들」
   Dialogue Set: dialogue-week3-scene004
   Scene: week3-scene-004 (Featherdale Wildlife Park, 10:40)
   여기서 자연스럽게 스친 소규모 단체 관광객 넷이 다음 씬의 목격자가 된다. */
const week3Scene004Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 05 「분실된 메모리카드」
   Dialogue Set: dialogue-week3-scene005
   Scene: week3-scene-005 (Featherdale Wildlife Park, 11:15) */
const week3Scene005Lines = [
  { id: 'line-001', speaker: '', text: '캥거루 방목장 근처.\n오전 11시 15분.', characterId: null },
  { id: 'line-002', speaker: '', text: '아까 그 투어 그룹 쪽에서 다급한 목소리가 들렸다.', characterId: null },
  { id: 'line-003', speaker: '카메라 주인', text: '어, 어...\n제 카메라 메모리카드가 없어졌어요.', characterId: null },
  { id: 'line-004', speaker: '영우', text: '무슨 일이세요?', characterId: 'youngwoo', expression: 'curious' },
  { id: 'line-005', speaker: '카메라 주인', text: '가방 안에 카드 케이스가 있었는데,\n지금 열어보니까 카드만 딱 없어요.', characterId: null },
  { id: 'line-006', speaker: '지수', text: '카메라 본체는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '카메라 주인', text: '그건 있어요.\n카드만요.', characterId: null },
  { id: 'line-008', speaker: '지수', text: '...', characterId: 'jisoo', pauseBeforeMs: 300, expression: 'suspicious' },
  { id: 'line-009', speaker: '영우', text: '지수야, 그 표정.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-010', speaker: '지수', text: '아뇨, 그냥.\n2주차 생각나서요.', characterId: 'jisoo', expression: 'blank' },
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

/* MISSING KEY — WEEK 3 · SCENE 06 「네 명의 같은 증언」
   Dialogue Set: dialogue-week3-scene006
   Scene: week3-scene-006 (Featherdale Wildlife Park, 11:30)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   증언 문장 겹치기 minigame, week3-scene-006-minigame. Result(표현이 비정상적으로
   유사함을 확인)은 week3-scene-007이 열릴 때 이미 찾은 것으로 취급한다. */
const week3Scene006Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 07 「CCTV에 없는 여자」
   Dialogue Set: dialogue-week3-scene007
   Scene: week3-scene-007 (Featherdale 방문자센터, 13:00) */
const week3Scene007Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 08 「이든 브룩스 조사」
   Dialogue Set: dialogue-week3-scene008
   Scene: week3-scene-008 (Featherdale Wildlife Park, 13:20) */
const week3Scene008Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 09 「다니엘 우 조사」
   Dialogue Set: dialogue-week3-scene009
   Scene: week3-scene-009 (Featherdale Wildlife Park, 13:40) */
const week3Scene009Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 10 「한소라 — 기억을 심은 사람」
   Dialogue Set: dialogue-week3-scene010
   Scene: week3-scene-010 (Featherdale Wildlife Park, 14:00)
   Ends on a MINIGAME START beat — nextSceneId hands off to a not-yet-built
   대화 순서 재구성 minigame, week3-scene-010-minigame. 미니게임 결과(한소라가
   사건 전 각 목격자에게 서로 다른 특징을 심어 하나의 가짜 여성을 완성했다는 것)는
   week3-scene-011이 열릴 때 이미 밝혀진 것으로 취급한다. */
const week3Scene010Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 11 「두 번째 추리」
   Dialogue Set: dialogue-week3-scene011
   Scene: week3-scene-011 (Featherdale Wildlife Park, 14:30) */
const week3Scene011Lines = [
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

/* MISSING KEY — WEEK 3 · SCENE 12 「미카의 두 번째 흔적」
   Dialogue Set: dialogue-week3-scene012
   Scene: week3-scene-012 (Sydney Accommodation, 21:00)
   Closes out Week 3's main weekend arc — 3주차 평일 미니씬(W3-D1~D5)은 별도로
   추가될 예정. No nextSceneId; ends on narration like week2-scene-011. */
const week3Scene012Lines = [
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
  { id: 'line-011', speaker: '영우', text: '2주차 그 문의 메일이랑 똑같은 이름이잖아.', characterId: 'youngwoo', expression: 'shocked' },
  { id: 'line-012', speaker: '지수', text: '웅.\n이번엔 도난이랑 상관도 없는데 또 나왔어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-013', speaker: '지수', text: '소라 님 사건은 소라 님 혼자 벌인 거고,\nM.K.는 그냥 사진을 사려고 한 것뿐이에요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-014', speaker: '지수', text: '근데 그 사진 문의가 하필 이 동네, 이 시기에 왔어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-015', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 400, expression: 'blank' },
  { id: 'line-016', speaker: '지수', text: '이제 우연이라고 하지 마.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-017', speaker: '영우', text: '...', characterId: 'youngwoo', pauseBeforeMs: 500, expression: 'blank' },
  { id: 'line-018', speaker: '', text: '영우는 대답하지 못했다.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-019', speaker: '지수', text: '용의자 카드 업데이트할게요.', characterId: 'jisoo', expression: 'smirk' },
  { id: 'line-020', speaker: '', text: '[ 용의자 카드 갱신 ]\n미카 코바치 — M.K. 가능성 65%', characterId: null },
  { id: 'line-021', speaker: '', text: '지수의 3주차는,\n또 하나의 M.K.를 남기고 저물었다.', characterId: null },
];

// Registry of testable Week 3 scenes — /dev/week3 lists these, each linking
// to /play/game/?scene=<id>. Covers only the 3주차 main weekend arc
// (W3-S01~S12, "존재하지 않는 여자") — 3주차 평일 미니씬(W3-D1~D5)은 아직 미구현.
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week1Scenes.
const week3Scenes = [
  {
    id: 'week3-scene-001',
    order: 1,
    name: '아침 출발',
    location: 'Featherdale 이동 중',
    introLabel: 'FEATHERDALE',
    time: '08:20',
    lines: week3Scene001Lines,
  },
  {
    id: 'week3-scene-002',
    order: 2,
    name: 'Featherdale 데이트 · 분실된 메모리카드',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '10:00',
    // Merged week3-scene-002~006 (all Featherdale Wildlife Park, back to
    // back). Hands off into the (not yet built) 증언 문장 겹치기 minigame —
    // see MINIGAME_ROUTES in game/index.html. Falls back to a "MINIGAME
    // START" placeholder overlay until that route exists.
    lines: mergeLines(week3Scene002Lines, week3Scene003Lines, week3Scene004Lines, week3Scene005Lines, week3Scene006Lines),
    nextSceneId: 'week3-scene-006-minigame',
  },
  {
    id: 'week3-scene-007',
    order: 3,
    name: 'CCTV에 없는 여자',
    location: 'Featherdale 방문자센터',
    introLabel: 'FEATHERDALE',
    time: '13:00',
    lines: week3Scene007Lines,
  },
  {
    id: 'week3-scene-008',
    order: 4,
    name: '이든 · 다니엘 · 한소라 조사',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '13:20',
    // Merged week3-scene-008~010 (all Featherdale Wildlife Park, back to
    // back). Hands off into the (not yet built) 대화 순서 재구성 minigame
    // that surfaces 한소라's coached testimony — same placeholder fallback
    // as above.
    lines: mergeLines(week3Scene008Lines, week3Scene009Lines, week3Scene010Lines),
    nextSceneId: 'week3-scene-010-minigame',
  },
  {
    id: 'week3-scene-011',
    order: 5,
    name: '두 번째 추리',
    location: 'Featherdale Wildlife Park',
    introLabel: 'FEATHERDALE',
    time: '14:30',
    lines: week3Scene011Lines,
  },
  {
    id: 'week3-scene-012',
    order: 6,
    name: '미카의 두 번째 흔적',
    location: 'Sydney Accommodation',
    introLabel: 'ACCOMMODATION',
    time: '21:00',
    lines: week3Scene012Lines,
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
    route: '/play/minigame-eastwood/',
    setupUrl: '/dev/upload/?scene=week1-scene-001-2&kind=minigame&minigame=week1-scene-001-2-minigame',
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
    route: '/play/minigame-fishing/',
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
    // 7 burst-shot photos, each its own direct-upload photoSlot on the
    // week2-scene-008-minigame entry itself (see its photoSlots comment in
    // week2Scenes above) — setupUrl deep-links straight into /dev/upload's
    // background tab with that scene already selected, same plain ?scene=
    // pattern a non-minigame scene's own 설정 button uses.
    id: 'week2-scene-008-minigame',
    name: '사진 속 인물 찾기',
    location: 'Pop-up Exhibition',
    route: '/play/minigame-photo-zoom/',
    setupUrl: '/dev/upload/?scene=week2-scene-008-minigame',
  },
  {
    // Standalone tap-to-order timeline puzzle — same no-setup-screen
    // reasoning as above.
    id: 'week2-scene-010-minigame',
    name: '시간대 정리',
    location: 'Café near Circular Quay',
    route: '/play/minigame-timeline/',
    setupUrl: '/play/minigame-timeline/',
  },
  {
    // Standalone logic-puzzle collection (레이튼풍 고난도 퀴즈 20종) — no
    // photo/hotspot setup either, so setupUrl === route just like
    // photo-zoom/timeline above. route lands on the puzzle picker itself
    // (dev/minigame-layton/) rather than a single play page, since picking
    // which of the 20 puzzles to play IS the entry point; all 20 are
    // developed and link onward to dev/minigame-layton/play/.
    id: 'layton-minigame',
    name: '레이튼 퀴즈',
    location: '독립형 미니게임 (스토리 미연동)',
    route: '/dev/minigame-layton/',
    setupUrl: '/dev/minigame-layton/',
  },
  // 증거 수집(item/inventory-driven investigation) 3종 — 예전엔 별도
  // `evidenceCollections`/`/dev/evidence`로 분리돼 있었으나, 탐색허브 Phase
  // 개념과 나란히 두기 위해 이 레지스트리 하나로 합쳤다. `isEvidence: true`만
  // 남기고 배열/페이지 구분은 없앰 — /dev/upload의 focusMinigame이 이 플래그로
  // 아이템/상호작용 탭(§ applyFocusModeChrome)을 보여줄지 판단한다.
  {
    id: 'week1-scene-002-2',
    name: '핸드폰을 찾아라',
    location: 'Sydney Accommodation',
    route: '/play/minigame-phone-search/',
    setupUrl: `/dev/upload/?scene=${roomSearchAreaSceneId(roomSearchAreas[0].id)}&minigame=week1-scene-002-2`,
    isEvidence: true,
  },
  {
    // Standalone/self-contained like fishing-minigame — the player's own
    // uploaded photo IS the background, so there's no dev-marked
    // background/hotspot pair to set up in /dev/upload first. Not
    // `isEvidence` — setupUrl === route, so it never even goes through
    // /dev/upload's focusMinigame.
    id: 'special-ability-test',
    name: '특수 능력 테스트',
    location: '독립형 테스트 (스토리 미연동)',
    route: '/dev/minigame-item-scan/',
    setupUrl: '/dev/minigame-item-scan/',
  },
];

/* MISSING KEY — WEEK 4 · SCENE 01 「마지막 주 아침」
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

/* MISSING KEY — WEEK 4 · SCENE 02 「The Rocks 이동」
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

/* MISSING KEY — WEEK 4 · SCENE 03 「첫 보관함」
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

/* MISSING KEY — WEEK 4 · SCENE 04 「포렌식 작업실 흔적」
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

/* MISSING KEY — WEEK 4 · SCENE 05 「미카 코바치 등장」
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

/* MISSING KEY — WEEK 4 · SCENE 06 「지수의 추리 제시」
   Dialogue Set: dialogue-week4-scene006
   Scene: week4-scene-006 (폐업한 공유 작업실, 11:45)
   플레이어 확신 100% — 하지만 미카가 그대로 인정한다는 것 자체가
   최종 반전을 값싸지 않게 만드는 장치.
   TODO(주차 재번호화, 구 3주차 삭제): line-006의 "3주차, 제 열쇠는 맞춤
   제작이었고..."는 삭제된 구 3주차(황동 열쇠 실종/발신 흔적 추적) 내용을
   가리키는 채로 남아있고, 바로 다음 line-007의 "발신 경로 추적" 전개도 그
   단서에 의존한다 — 이 리캡 대사 자체를 다시 써야 함. 참고로 line-005도
   (한소라 사진 문의, 새 3주차 = 구 2주차의 실제 콘텐츠) 이제 똑같이
   "3주차"라고 말하므로, line-005/006이 서로 다른 걸 가리키면서 같은
   번호를 말하는 모순이 생겼다 — line-003("2주차")/005("3주차")는 번호
   통일 스크립트로 정상적으로 이동된 것이고, 문제는 line-006 하나뿐. */
const week4Scene006Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n오전 11시 45분.', characterId: null },
  { id: 'line-002', speaker: '지수', text: '처음부터 순서대로 말씀드릴게요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-003', speaker: '지수', text: '2주차, 황동 물건을 찾는 문의가 애드리언 콜한테 갔어요.\n발신인 Mika Kovac.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-004', speaker: '지수', text: '레오 박이 그 일감을 받았고, 중개 계정은 MK_Consult였고요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-005', speaker: '지수', text: '3주차, 한소라한테 사진 구매 문의가 갔어요.\n발신 M. Kovac, 메타데이터 작성자 MKOVAC.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-006', speaker: '지수', text: '3주차, 제 열쇠는 맞춤 제작이었고\n주문 담당은 M. KOVAC이었어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-007', speaker: '지수', text: '발신 경로 추적하니까 당신이 예전에 쓰던 보안 릴레이가 나왔고,\n그게 이 동네로 좁혀졌어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-008', speaker: '지수', text: '그리고 방금, 이 자리에서 MK 폴더를 찾았어요.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-009', speaker: '지수', text: 'M.K.는 당신이야.\n미카 코바치.', characterId: 'jisoo', expression: 'serious' },
  { id: 'line-010', speaker: '', text: '잠깐 정적이 흘렀다.', characterId: null },
  { id: 'line-011', speaker: '미카 코바치', text: '맞아요.', characterId: 'mika', expression: 'neutral' },
];

/* MISSING KEY — WEEK 4 · SCENE 07 「가짜 진범 고백」
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

/* MISSING KEY — WEEK 4 · SCENE 08 「한 문장으로 붕괴」
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

/* MISSING KEY — WEEK 4 · SCENE 09 「미카의 진실」
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

/* MISSING KEY — WEEK 4 · SCENE 10 「플레이어 추리의 재평가」
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

/* MISSING KEY — WEEK 4 · SCENE 11 「질문 전환」
   Dialogue Set: dialogue-week4-scene011
   Scene: week4-scene-011 (폐업한 공유 작업실, 12:20)
   TODO(주차 재번호화, 구 3주차 삭제): line-002의 "3주차에 받았던 종이"는
   삭제된 구 3주차 소품을 가리킴 — 후속 수정 필요. */
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

/* MISSING KEY — WEEK 4 · SCENE 12 「세 사건 재해석」
   Dialogue Set: dialogue-week4-scene012
   Scene: week4-scene-012 (폐업한 공유 작업실, 12:30) */
const week4Scene012Lines = [
  { id: 'line-001', speaker: '', text: '같은 작업실.\n낮 12시 30분.', characterId: null },
  { id: 'line-002', speaker: '미카 코바치', text: '2주차 K-01, 그건 도난을 원한 게 아니었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-003', speaker: '미카 코바치', text: '비슷한 황동 물건이 맞는지 확인하고, 사진만 확보하면 되는 일이었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-004', speaker: '영우', text: '근데 레오 씨가 욕심을 냈고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-005', speaker: '미카 코바치', text: '맞아요.\n그쪽 사정으로 일이 커진 거예요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-006', speaker: '지수', text: '3주차 메모리카드는요?', characterId: 'jisoo', expression: 'curious' },
  { id: 'line-007', speaker: '미카 코바치', text: '기억 조작 같은 건 필요 없었어요.\n그냥 특정 시간대 원본 사진이 필요했을 뿐이에요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-008', speaker: '영우', text: '한소라 씨가 자기 사정 때문에 범죄를 만든 거고.', characterId: 'youngwoo', expression: 'blank' },
  { id: 'line-009', speaker: '미카 코바치', text: '네.\n그것도 제 의도랑은 상관없는 일이었어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-010', speaker: '지수', text: '제 열쇠는요?', characterId: 'jisoo', expression: 'suspicious' },
  { id: 'line-011', speaker: '미카 코바치', text: '촬영, 확인, 반환.\n그게 전부였어요.', characterId: 'mika', expression: 'neutral' },
  { id: 'line-012', speaker: '미카 코바치', text: '그래서 다른 귀중품은 손도 안 댄 거고요.', characterId: 'mika', expression: 'neutral' },
];

/* MISSING KEY — WEEK 4 · SCENE 13 「M.K.의 목적어」
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

/* MISSING KEY — WEEK 4 · SCENE 14 「무깽이 연결」
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

/* MISSING KEY — WEEK 4 · SCENE 15 「최종 정체」
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

/* MISSING KEY — WEEK 4 · SCENE 16 「감정 반전」
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

/* MISSING KEY — WEEK 4 · SCENE 17 「마지막 영상」
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

/* MISSING KEY — WEEK 4 · SCENE 18 「다음 날 체크아웃」
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

/* MISSING KEY — WEEK 4 · SCENE 19 「12초」
   Dialogue Set: dialogue-week4-scene019
   Scene: week4-scene-019 (Sydney Accommodation, 빈 방)
   엔딩 컷 — 1주차부터 있던 녹슨 나사가 떨어지며 K-02가 등장한다.
   No nextSceneId; ends 4주차 and the whole 시즌. */
const week4Scene019Lines = [
  { id: 'line-001', speaker: '', text: '숙소, 빈 방.', characterId: null },
  { id: 'line-002', speaker: '', text: '문이 닫힌다.', characterId: null },
  { id: 'line-003', speaker: '', text: '정적.', characterId: null },
  { id: 'line-004', speaker: '', text: '환풍기가 멈춘다.', characterId: null },
  { id: 'line-005', speaker: '', text: '1주차부터 있던 녹슨 나사가 떨어진다.', characterId: null },
  { id: 'line-006', speaker: '', text: '작은 금속음.', characterId: null },
  { id: 'line-007', speaker: '', text: '환풍구 안쪽에서, 작은 황동 열쇠 하나가 굴러떨어진다.', characterId: null },
  { id: 'line-008', speaker: '', text: '태그.', characterId: null },
  { id: 'line-009', speaker: '', text: '[ K-02 ]', characterId: null },
  { id: 'line-010', speaker: '', text: '컷.', characterId: null },
];

// Registry of testable Week 4 scenes — /dev/week4 lists these, each linking
// to /play/game/?scene=<id>. Covers only the 4주차 main arc (W4-S01~S19,
// "M.K.는 미카 코바치인가" + NOT WHO, WHY 최종부) — 4주차 평일 미니씬
// (W4-D1~D5)은 아직 미구현.
//
// Grouped by location rather than by time slice — see the mergeLines note
// above week1Scenes. The Former Shared Workspace confrontation (원래
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
// and mark its hotspots — /dev/week1's list reads week1Scenes directly, not
// weeks, so these stay invisible there and don't clutter the scene list.
const week1UploadScenes = week1Scenes.concat(roomSearchAreas.map(area => ({
  id: roomSearchAreaSceneId(area.id),
  name: `핸드폰찾기 · ${area.label}`,
  roomHotspots: area.hotspots,
})));
const weeks = [
  { id: 'week1', label: '1주차', scenes: week1UploadScenes },
  { id: 'week2', label: '2주차', scenes: week2Scenes },
  { id: 'week3', label: '3주차', scenes: week3Scenes },
  { id: 'week4', label: '4주차', scenes: week4Scenes },
];

// Combined lookup across every week's scenes — /play/game resolves a
// requested ?scene= id against this instead of a single week's array, since
// a scene can belong to any week. Per-week test pages (/dev/week1 ~
// /dev/week4) still read their own week*Scenes array directly so their
// listing stays scoped to just that week.
const allScenes = week1Scenes.concat(week2Scenes).concat(week3Scenes).concat(week4Scenes);
