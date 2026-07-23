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

    // 2단계 검증용: 눈/얼음 전장 바닥 타일. 완전한 흰색 대신 옅은 청백색
    // 바탕에 결정적 의사난수로 스페클과 균열 픽셀을 흩뿌려 단조롭지
    // 않게 한다. 시드가 고정돼 있어 새로고침해도 같은 패턴이 나오므로
    // 단계 간 스크린샷 비교가 쉽다.
    createSnowTileTexture(scene, key, tile) {
      if (scene.textures.exists(key)) return key;
      tile = tile || 16;
      const BASE = 0xdceff7;
      const SPECKLE = 0xb9dceb;
      const CRACK = 0x8fb9ce;

      let seed = 1337;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };

      const g = scene.add.graphics();
      g.fillStyle(BASE, 1);
      g.fillRect(0, 0, tile, tile);

      g.fillStyle(SPECKLE, 1);
      const speckleCount = Math.floor((tile * tile) / 6);
      for (let i = 0; i < speckleCount; i++) {
        g.fillRect(Math.floor(rand() * tile), Math.floor(rand() * tile), 1, 1);
      }

      g.fillStyle(CRACK, 1);
      const crackStart = Math.floor(rand() * tile);
      const crackLen = Math.floor(tile * 0.4);
      for (let i = 0; i < crackLen; i++) {
        const x = (crackStart + i) % tile;
        const y = Math.floor(i * 0.6) % tile;
        g.fillRect(x, y, 1, 1);
      }

      g.generateTexture(key, tile, tile);
      g.destroy();
      return key;
    },
  };
})();
