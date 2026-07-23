// 임시 도트 그래픽을 코드로 생성하는 팩토리. 외부 이미지 파일 없이
// Phaser.Graphics로 그린 뒤 generateTexture로 텍스처화한다. 이후
// 단계에서 영웅/미니언/포탑/본진/이펙트가 여기에 추가된다.
(function () {
  const NS = window.ARAM;

  NS.PixelArtFactory = {
    // 1단계 검증용: 8x8 체커보드. 확대했을 때 경계가 흐려지지 않고
    // 칼같이 각져 있으면 nearest-neighbor 렌더링이 정상 동작하는 것.
    createCheckerTexture(scene, key, size, colorA, colorB) {
      if (scene.textures.exists(key)) return key;
      const g = scene.add.graphics();
      const cell = size / 8;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          g.fillStyle((x + y) % 2 === 0 ? colorA : colorB, 1);
          g.fillRect(x * cell, y * cell, cell, cell);
        }
      }
      g.generateTexture(key, size, size);
      g.destroy();
      return key;
    },
  };
})();
