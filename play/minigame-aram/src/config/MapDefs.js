(function () {
  const NS = window.ARAM;

  // 월드 크기: 대각선 회랑의 바운딩 박스(약 1800x1800)보다 넉넉하게 잡아,
  // 카메라가 어디를 비추든 맵 바깥의 완전한 여백만 보이는 일이 없게 한다.
  const WORLD_WIDTH = 2400;
  const WORLD_HEIGHT = 2400;

  // 아군 본진(좌측 하단) → 적 본진(우측 상단). 가운데 두 지점에서 살짝
  // 반대 방향으로 굽혀 완전한 직선이 아닌, 칼바람 다리 특유의 완만한
  // S자 곡선 느낌을 준다.
  const WAYPOINTS = [
    { x: 300, y: 2100 },
    { x: 900, y: 1650 },
    { x: 1200, y: 1200 },
    { x: 1500, y: 750 },
    { x: 2100, y: 300 },
  ];

  NS.MapDefs = {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    WAYPOINTS,

    // 레인 절반 폭(중심선 기준 좌우 이동 가능 범위).
    LANE_HALF_WIDTH: 170,

    // 본진 근처에서 레인 폭이 넓어지는 구간(진행도 t 기준, 양 끝에서
    // 이 비율만큼) 및 그 최대 폭.
    BASE_ZONE_T: 0.09,
    BASE_PLATEAU_HALF_WIDTH: 320,

    // 주요 지점의 진행도(t). 포탑/본진 위치, 미니언 스폰 등 이후
    // 단계에서 전부 이 값들을 기준으로 배치한다(픽셀 좌표를 따로
    // 하드코딩하지 않음).
    ALLY_BASE_T: 0.02,
    ALLY_TURRET_T: 0.24,
    ENEMY_TURRET_T: 0.76,
    ENEMY_BASE_T: 0.98,
  };
})();
