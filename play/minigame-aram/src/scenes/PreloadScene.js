(function () {
  const NS = window.ARAM;

  NS.PreloadScene = class PreloadScene extends Phaser.Scene {
    constructor() {
      super('Preload');
    }

    create() {
      const { width, height } = this.scale;
      const label = this.add.text(width / 2, height / 2, 'LOADING...', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#e8741e',
      }).setOrigin(0.5);

      // 1단계에서는 임시 텍스처만 생성. 이후 단계에서 영웅/미니언/포탑/
      // 본진/이펙트 텍스처 생성이 이 자리에 추가된다.
      NS.PixelArtFactory.createCheckerTexture(this, 'checker-16', 16, 0xe8741e, 0x191f28);

      this.time.delayedCall(150, () => {
        label.destroy();
        this.scene.start('Game');
        this.scene.launch('UI');
      });
    }
  };
})();
