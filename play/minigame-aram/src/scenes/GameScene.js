(function () {
  const NS = window.ARAM;

  // 2단계 범위: 좌하단→우상단 대각선 전장 구성. 유닛/이동/카메라 추적은
  // 다음 단계들에서 이 위에 얹힌다.
  NS.GameScene = class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }

    create() {
      const mapDefs = NS.MapDefs;

      this.lane = new NS.LaneCoordinate(mapDefs.WAYPOINTS, mapDefs.LANE_HALF_WIDTH, {
        baseZoneT: mapDefs.BASE_ZONE_T,
        basePlateauHalfWidth: mapDefs.BASE_PLATEAU_HALF_WIDTH,
      });
      // 3단계(이동 충돌)부터 다른 Scene/시스템에서도 같은 레인 좌표계를
      // 써야 하므로 네임스페이스에 공개해둔다.
      NS.activeLane = this.lane;

      this.worldWidth = mapDefs.WORLD_WIDTH;
      this.worldHeight = mapDefs.WORLD_HEIGHT;
      this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
      this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

      this.drawBattlefield();
      this.drawDebugOverlay();

      // 임시 뷰: 4단계에서 플레이어를 따라가는 실제 CameraController로
      // 교체되기 전까지는, 대각선 전장 전체가 한 화면에 들어오도록
      // 축소해서 보여준다(좌표계/모양 검증용).
      const fitZoom = Math.min(
        NS.GAME_WIDTH / this.worldWidth,
        NS.GAME_HEIGHT / this.worldHeight,
      ) * 0.94;
      this.cameras.main.setZoom(fitZoom);
      this.cameras.main.centerOn(this.worldWidth / 2, this.worldHeight / 2);
    }

    drawBattlefield() {
      const mapDefs = NS.MapDefs;
      NS.PixelArtFactory.createSnowTileTexture(this, 'snow-tile', 16);

      const samples = 64;
      const outerPolygon = this.buildLanePolygon(samples, 0);
      const innerPolygon = this.buildLanePolygon(samples, 6);

      // 바깥 테두리 — 절벽/얼음 가장자리 느낌의 어두운 폴리곤을 먼저
      // 깔고, 그 위에 살짝 좁힌 안쪽 폴리곤으로 눈밭을 덮어 테두리
      // 라인처럼 보이게 한다.
      const outline = this.add.graphics();
      outline.fillStyle(0x1c2b3a, 1);
      outline.fillPoints(outerPolygon, true);

      const maskShape = this.make.graphics({ x: 0, y: 0, add: false });
      maskShape.fillStyle(0xffffff, 1);
      maskShape.fillPoints(innerPolygon, true);

      const tileSprite = this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'snow-tile').setOrigin(0, 0);
      tileSprite.setMask(maskShape.createGeometryMask());

      this.drawBaseZone(mapDefs.ALLY_BASE_T, 0x3182f6, '아군 본진');
      this.drawBaseZone(mapDefs.ENEMY_BASE_T, 0xd94141, '적 본진');
      this.drawTurretMarker(mapDefs.ALLY_TURRET_T, 0x3182f6);
      this.drawTurretMarker(mapDefs.ENEMY_TURRET_T, 0xd94141);
    }

    // t=0..1을 따라 좌/우 가장자리 좌표를 샘플링해 닫힌 폴리곤을 만든다.
    // shrink만큼 폭을 안쪽으로 줄여서 테두리선용 안쪽 폴리곤도 같은
    // 함수로 만들 수 있게 한다.
    buildLanePolygon(samples, shrink) {
      const left = [];
      const right = [];
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const hw = Math.max(this.lane.halfWidthAt(t) - shrink, 4);
        left.push(this.lane.laneToWorld(t, -hw));
        right.push(this.lane.laneToWorld(t, hw));
      }
      return left.concat(right.reverse());
    }

    drawBaseZone(t, color, label) {
      const center = this.lane.laneToWorld(t, 0);
      const radius = NS.MapDefs.BASE_PLATEAU_HALF_WIDTH * 0.9;
      const g = this.add.graphics();
      g.fillStyle(color, 0.14);
      g.fillCircle(center.x, center.y, radius);
      g.lineStyle(3, color, 0.65);
      g.strokeCircle(center.x, center.y, radius);
      this.add.text(center.x, center.y, label, {
        fontFamily: 'monospace', fontSize: '14px', color: '#edf1f4',
      }).setOrigin(0.5);
    }

    drawTurretMarker(t, color) {
      const center = this.lane.laneToWorld(t, 0);
      const g = this.add.graphics();
      g.fillStyle(color, 0.9);
      g.fillCircle(center.x, center.y, 10);
      g.lineStyle(2, 0x05070a, 1);
      g.strokeCircle(center.x, center.y, 10);
    }

    // 레인 중심선 + 진행도(t) 눈금 — 좌표 변환이 의도대로 동작하는지
    // 확인하기 위한 개발용 오버레이. 가벼워서 이후 단계에서도 유지 가능.
    drawDebugOverlay() {
      const g = this.add.graphics();
      g.lineStyle(2, 0xe8741e, 0.35);
      const centerPoints = [];
      for (let i = 0; i <= 64; i++) {
        centerPoints.push(this.lane.laneToWorld(i / 64, 0));
      }
      g.strokePoints(centerPoints, false);

      [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
        const p = this.lane.laneToWorld(t, 0);
        this.add.circle(p.x, p.y, 5, 0xe8741e, 0.8);
        this.add.text(p.x, p.y - 20, `t=${t}`, {
          fontFamily: 'monospace', fontSize: '12px', color: '#e8741e',
        }).setOrigin(0.5);
      });

      const worldBorder = this.add.graphics();
      worldBorder.lineStyle(2, 0x4e5968, 0.5);
      worldBorder.strokeRect(1, 1, this.worldWidth - 2, this.worldHeight - 2);
    }
  };
})();
