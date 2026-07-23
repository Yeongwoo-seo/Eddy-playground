(function () {
  const NS = window.ARAM;

  // GameScene과 병렬로 실행되는 화면 고정 오버레이. 이 Scene의 카메라는
  // GameScene의 카메라 스크롤/줌과 무관하므로 HUD/조이스틱/스킬 버튼이
  // 항상 화면에 고정된다. 1단계에서는 자리만 확인한다.
  NS.UIScene = class UIScene extends Phaser.Scene {
    constructor() {
      super('UI');
    }

    create() {
      const w = NS.GAME_WIDTH;
      const h = NS.GAME_HEIGHT;

      const topBar = this.add.rectangle(w / 2, 40, w, 80, 0x101419, 0.55).setOrigin(0.5, 0.5);
      this.add.text(12, 12, 'UI SCENE (HUD)', {
        fontFamily: 'monospace', fontSize: '12px', color: '#e8741e',
      });

      const back = this.add.text(w - 12, 12, '← /play/', {
        fontFamily: 'monospace', fontSize: '12px', color: '#8b95a1',
      }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
      back.on('pointerup', () => { window.location.href = '/play/'; });

      void topBar;
    }
  };
})();
