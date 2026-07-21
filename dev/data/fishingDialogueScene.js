// [circularkey-fishing-surprise-effect] 서큘러키 VN 씬(week1-scene-circular-
// quay)에 있던, 지수가 픽셀 그래픽 낚시 화면을 보고 놀라는 티키타카를 그대로
// 옮겨왔다 — 낚시 미니게임 자체에 아직 대사 줄이 하나도 저장돼 있지 않을 때
// (dev/minigame-fishing "대화" 탭에서 대사를 아직 입력하지 않은 상태) 보여줄
// 기본값이다. 에디터에서 "+ 대사 줄 추가"로 실제 줄을 넣으면 그 즉시
// scene.lines가 채워지므로 이 기본값은 더 이상 쓰이지 않는다.
const DEFAULT_DIALOGUE_LINES = [
  { id: 'default-1', speaker: 'jisoo', text: '잠만.\n이거 뭐야?????' },
  { id: 'default-2', speaker: 'youngwoo', text: '낚시게임.' },
  { id: 'default-3', speaker: 'jisoo', text: '아니 그건 보이는데\n왜 갑자기 게임이 나와요????' },
  { id: 'default-4', speaker: 'youngwoo', text: '내가 낚시하자고 했잖아.\n그래서 이거 만듦.' },
  { id: 'default-5', speaker: 'jisoo', text: '에에 미쳤나봐!!!' },
  { id: 'default-6', speaker: 'jisoo', text: '진짜 이걸 만들었다고????' },
  { id: 'default-7', speaker: 'youngwoo', text: '웅.\n스타듀밸리처럼 물고기 따라가면 돼.' },
  { id: 'default-8', speaker: 'jisoo', text: '아 진짜 영크크 미쳤어.' },
  { id: 'default-9', speaker: 'youngwoo', text: '칭찬으로 듣겠습니다.' },
  { id: 'default-10', speaker: 'jisoo', text: '칭찬 맞아요!!!!\n아니 근데 진짜 미쳤나봐.' },
];

/* MISSING KEY DEV — 낚시 미니게임 시작 전 대화 장면(dialogueScene)의 대사
   줄 목록을 정규화한다. 여러 줄(지수/영우가 번갈아 말하는 티키타카)을 지원하기
   전에는 scene.speaker/scene.text 딱 한 쌍만 있었다(#465) — 그 시절 저장된
   fishingConfig가 여전히 남아있을 수 있으므로, scene.lines가 없으면 그
   speaker/text를 한 줄짜리 lines로 합성해 예전 설정도 그대로 보여준다.
   scene.lines도 speaker/text도 전혀 없으면(대사 탭을 아직 아무도 건드리지
   않은 상태) DEFAULT_DIALOGUE_LINES로 대체한다.
   dev/minigame-fishing/index.html(에디터)과 play/minigame-fishing/index.html
   (실제 플레이) 둘 다 이 함수 하나로 "지금 이 장면의 대사 줄"을 구한다. */
function fishingDialogueLines(scene) {
  if (!scene) return [];
  if (Array.isArray(scene.lines) && scene.lines.length) return scene.lines;
  if (scene.speaker || scene.text) {
    return [{ id: 'line-1', speaker: scene.speaker === 'youngwoo' ? 'youngwoo' : 'jisoo', text: scene.text || '' }];
  }
  return DEFAULT_DIALOGUE_LINES;
}
