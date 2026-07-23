(function () {
  const NS = window.ARAM;

  NS.BootScene = class BootScene extends Phaser.Scene {
    constructor() {
      super('Boot');
    }

    create() {
      // 리사이즈 시 캔버스가 즉시 재배치되도록. 실제 리사이즈 대응 로직은
      // Scale.FIT가 대부분 처리하고, 여기서는 훅만 남겨둔다.
      this.scale.on('resize', () => {});
      this.scene.start('Preload');
    }
  };
})();
