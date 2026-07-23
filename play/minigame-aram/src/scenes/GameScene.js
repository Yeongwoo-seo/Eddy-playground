(function () {
  const NS = window.ARAM;

  // 1단계 범위: 세로형 9:16 화면 설정 검증만. 맵/유닛/카메라는 다음
  // 단계에서 이 Scene 안에 추가된다.
  NS.GameScene = class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }

    create() {
      const w = NS.GAME_WIDTH;
      const h = NS.GAME_HEIGHT;

      // 캔버스 정확한 경계를 눈으로 확인하기 위한 테두리 — Scale.FIT가
      // 잘림/여백 없이 9:16 전체를 보여주는지 검증용.
      const border = this.add.graphics();
      border.lineStyle(4, 0xe8741e, 1);
      border.strokeRect(2, 2, w - 4, h - 4);

      this.add.text(w / 2, h / 2 - 20, 'GAME SCENE', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#edf1f4',
      }).setOrigin(0.5);

      this.add.text(w / 2, h / 2 + 16, `${w} x ${h} (9:16)`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#8b95a1',
      }).setOrigin(0.5);

      // nearest-neighbor 렌더링 확인용: 16px 체커 텍스처를 8배 확대해서
      // 경계가 흐려지지 않고 각져 보이는지 확인한다.
      this.add.image(80, 80, 'checker-16').setScale(8).setOrigin(0, 0);

      // 좌측 하단 / 우측 상단 모서리 표시 — 2단계에서 이 자리에 아군/
      // 적 본진이 들어선다는 것을 미리 확인할 수 있는 자리 표시자.
      this.add.text(16, h - 32, 'ALLY BASE ↘', {
        fontFamily: 'monospace', fontSize: '13px', color: '#3182f6',
      }).setOrigin(0, 1);
      this.add.text(w - 16, 32, '↙ ENEMY BASE', {
        fontFamily: 'monospace', fontSize: '13px', color: '#d94141',
      }).setOrigin(1, 0);
    }
  };
})();
