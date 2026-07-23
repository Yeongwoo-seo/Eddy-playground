(function () {
  const NS = window.ARAM;

  // 기준 해상도 720x1280 (9:16). Scale.FIT + autoCenter로 어떤 화면
  // 크기에서도 이 비율을 유지한 채 중앙 정렬되고, 남는 영역은 레터박스로
  // 비워둔다(잘리거나 늘어나지 않음).
  NS.GAME_WIDTH = 720;
  NS.GAME_HEIGHT = 1280;

  NS.GameConfig = {
    type: Phaser.AUTO,
    parent: 'aram-root',
    backgroundColor: '#05070a',
    // 도트 그래픽이 스케일링 시 흐려지지 않도록 nearest-neighbor 강제.
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: NS.GAME_WIDTH,
      height: NS.GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [],
  };
})();
