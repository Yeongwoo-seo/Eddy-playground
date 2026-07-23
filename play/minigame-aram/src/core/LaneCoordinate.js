// 월드 좌표(px, Y-down)와 레인 좌표(t: 아군 본진~적 본진 진행도 0~1,
// s: 레인 중심선 기준 좌우 부호 있는 거리)를 상호 변환한다.
//
// 맵 자체나 카메라를 회전시키지 않고, 좌하단→우상단으로 이어지는
// 웨이포인트 목록만으로 대각선 전장을 표현한다. 이동 경계 판정(3단계),
// 미니언/포탑 사거리 판정, 카메라 추적(4단계)이 전부 이 클래스를
// 공유해서 쓴다.
(function () {
  const NS = window.ARAM;

  class LaneCoordinate {
    constructor(waypoints, laneHalfWidth, opts) {
      opts = opts || {};
      this.laneHalfWidth = laneHalfWidth;
      this.baseZoneT = opts.baseZoneT != null ? opts.baseZoneT : 0;
      this.basePlateauHalfWidth = opts.basePlateauHalfWidth != null
        ? opts.basePlateauHalfWidth
        : laneHalfWidth;

      this.segments = [];
      let cum = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        const p0 = waypoints[i];
        const p1 = waypoints[i + 1];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        // 왼쪽 법선(진행 방향 기준 시계 방향 90도). 구간(bend)이 완만하다는
        // 전제 하에 이 부호를 전 구간에서 그대로 "s>0 = 같은 쪽"으로 쓴다.
        const nx = -uy;
        const ny = ux;
        this.segments.push({ p0, p1, dx, dy, len, ux, uy, nx, ny, cumStart: cum, cumEnd: cum + len });
        cum += len;
      }
      this.totalLength = cum;
    }

    halfWidthAt(t) {
      t = clamp01(t);
      const z = this.baseZoneT;
      if (z <= 0) return this.laneHalfWidth;
      if (t <= z) {
        const factor = 1 - t / z; // 0(본진 경계)~1(본진 중심)
        return lerp(this.laneHalfWidth, this.basePlateauHalfWidth, factor);
      }
      if (t >= 1 - z) {
        const factor = (t - (1 - z)) / z;
        return lerp(this.laneHalfWidth, this.basePlateauHalfWidth, factor);
      }
      return this.laneHalfWidth;
    }

    // 월드 좌표 → 가장 가까운 레인 위치의 {t, s}.
    worldToLane(x, y) {
      let best = null;
      for (const seg of this.segments) {
        const px = x - seg.p0.x;
        const py = y - seg.p0.y;
        const proj = clamp(px * seg.ux + py * seg.uy, 0, seg.len);
        const cx = seg.p0.x + seg.ux * proj;
        const cy = seg.p0.y + seg.uy * proj;
        const dist2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        if (!best || dist2 < best.dist2) {
          best = { seg, proj, cx, cy, dist2 };
        }
      }
      const lateral = (x - best.cx) * best.seg.nx + (y - best.cy) * best.seg.ny;
      const t = this.totalLength > 0 ? (best.seg.cumStart + best.proj) / this.totalLength : 0;
      return { t, s: lateral };
    }

    // 레인 좌표 {t, s} → 월드 좌표.
    laneToWorld(t, s) {
      t = clamp01(t);
      const targetLen = t * this.totalLength;
      let seg = this.segments[this.segments.length - 1];
      for (const candidate of this.segments) {
        if (targetLen <= candidate.cumEnd || candidate === seg) {
          seg = candidate;
          break;
        }
      }
      const localLen = clamp(targetLen - seg.cumStart, 0, seg.len);
      const baseX = seg.p0.x + seg.ux * localLen;
      const baseY = seg.p0.y + seg.uy * localLen;
      return { x: baseX + seg.nx * s, y: baseY + seg.ny * s };
    }

    // 임의의 월드 좌표를 레인 안쪽(경계 + 본진 광장)으로 밀어넣는다.
    // unitRadius만큼 벽에서 여유를 둔다. 3단계 이동 충돌에서 그대로 재사용.
    clampToLane(x, y, unitRadius) {
      unitRadius = unitRadius || 0;
      const { t, s } = this.worldToLane(x, y);
      const tc = clamp01(t);
      const hw = Math.max(this.halfWidthAt(tc) - unitRadius, 2);
      const sc = clamp(s, -hw, hw);
      return this.laneToWorld(tc, sc);
    }
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function clamp01(v) { return clamp(v, 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  NS.LaneCoordinate = LaneCoordinate;
})();
