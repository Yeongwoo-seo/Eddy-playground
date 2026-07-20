/* OPERATION MK DEV — 낚시 미니게임 시작 전 대화 장면(dialogueScene)의 대사
   줄 목록을 정규화한다. 여러 줄(지수/영우가 번갈아 말하는 티키타카)을 지원하기
   전에는 scene.speaker/scene.text 딱 한 쌍만 있었다(#465) — 그 시절 저장된
   fishingConfig가 여전히 남아있을 수 있으므로, scene.lines가 없으면 그
   speaker/text를 한 줄짜리 lines로 합성해 예전 설정도 그대로 보여준다.
   dev/minigame-fishing/index.html(에디터)과 play/minigame-fishing/index.html
   (실제 플레이) 둘 다 이 함수 하나로 "지금 이 장면의 대사 줄"을 구한다. */
function fishingDialogueLines(scene) {
  if (!scene) return [];
  if (Array.isArray(scene.lines) && scene.lines.length) return scene.lines;
  if (scene.speaker || scene.text) {
    return [{ id: 'line-1', speaker: scene.speaker === 'youngwoo' ? 'youngwoo' : 'jisoo', text: scene.text || '' }];
  }
  return [];
}
