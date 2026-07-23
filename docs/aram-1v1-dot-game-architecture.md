# 칼바람 1v1 도트게임 — 아키텍처 설계 (MVP 이전 설계 문서)

> 이 문서는 코드 작성 이전 단계의 설계 문서다. 실제 구현은 이 문서를 기준으로
> `구현 우선순위` 순서에 따라 단계별로 진행하며, 각 단계마다 별도 커밋으로
> 코드가 추가된다.

## 0. 배치 위치와 스택 결정

- 신규 폴더: `play/minigame-aram/`
  - 기존 `play/minigame-*` 미니게임들은 전부 순수 DOM/CSS/JS 단일
    `index.html`로 작성되어 있음 (Phaser 미사용). 이번 게임은 실시간 다개체
    시뮬레이션(유닛 다수, 충돌, 카메라, 스킬 이펙트)이라 요구사항대로
    **Phaser 3**를 사용하고, 나머지 사이트 스택과는 독립적인 서브 프로젝트로
    분리한다. `play/index.html`의 미니게임 목록에서 링크만 연결한다.
  - Phaser 3는 **로컬 vendor 파일**로 포함한다 (`play/minigame-aram/vendor/phaser.min.js`).
    "외부 서버 없이 로컬 실행"이라는 요구사항을 CDN 의존 없이 만족시키기 위함.
  - 빌드 스텝 없음(레포 전체 컨벤션과 동일). 모듈은 ES module이 아니라
    **plain `<script>` 태그 + 전역 네임스페이스 객체**로 구성한다. 이유: 이
    게임을 `file://`로 더블클릭 실행했을 때 최신 브라우저(Chrome/Firefox)는
    `type="module"` 스크립트의 로컬 파일 간 import를 CORS로 차단한다. 로컬
    정적 서버(`python -m http.server` 등)로 열면 문제없지만, 레포의 다른
    페이지들도 빌드 도구 없는 단순 script 태그 방식이므로 동일한 패턴을
    유지한다. 즉 전역 네임스페이스 `window.ARAM = window.ARAM || {}` 아래에
    각 모듈이 자신의 클래스/함수를 등록하고, `index.html`이 의존성 순서대로
    `<script src>`를 나열한다.

## 1. 전체 아키텍처

Phaser의 Scene 단위로 관심사를 분리하고, Scene 내부는 데이터 기반(config)
+ 매니저(시스템) 조합으로 구성한다.

### 1.1 Scene 구성

```
BootScene      → 디바이스/해상도 확인, PreloadScene으로 전환
PreloadScene   → 임시 도트 텍스처를 코드로 생성(PixelArtFactory), 로딩 UI
GameScene      → 맵, 유닛, 전투, 카메라 — 실제 게임 월드 (스크롤/줌 적용됨)
UIScene        → HUD, 조이스틱, 스킬 버튼, 결과 화면 — 화면 고정 오버레이
                 (GameScene과 병렬 실행: this.scene.launch('UIScene'))
```

`UIScene`을 분리하는 이유: Phaser 카메라 스크롤/줌은 Scene 단위로 적용되므로,
같은 Scene 안에 HUD를 두면 카메라가 움직일 때 화면 고정 UI를 위해 매 프레임
`setScrollFactor(0)`을 일일이 걸어줘야 한다. UI 전용 Scene을 두면 그 Scene
자체의 카메라가 스크롤되지 않으므로 자연스럽게 고정된다. 단, 유닛/미니언
머리 위 미니 체력바처럼 "월드를 따라다녀야 하는" UI는 GameScene 쪽에서
일반 게임 오브젝트로 다룬다 (아래 6장 참고).

### 1.2 로직 계층 (Entity / System)

무거운 ECS 프레임워크는 MVP 스코프에 과함. 대신 가벼운 클래스 계층 +
이벤트 버스로 결합도를 낮춘다.

```
Entity (base)                 위치, 팀, 체력, 상태(alive/dead 등)
 ├─ Unit (extends Entity)     이동, 바라보는 방향(facing), 이동/공격 상태
 │   ├─ Hero                  플레이어 or CPU 제어, 스킬 보유
 │   └─ Minion                MeleeMinion / RangedMinion
 └─ Structure (extends Entity) 정적 개체
     ├─ Turret
     └─ Nexus (본진)
```

시스템(매니저, Scene당 1개씩 생성되는 싱글턴 성격의 객체):

| 시스템 | 책임 |
|---|---|
| `MapSystem` | 레인 경로 정의, 좌표 변환, 충돌(경계) 판정 |
| `CameraController` | 카메라 목표 지점 계산 및 부드러운 추적 |
| `TouchInputManager` | 조이스틱/스킬 버튼 터치 입력 → 의도(intent) 이벤트 |
| `CombatSystem` | 타깃 우선순위 계산, 사거리 판정, 데미지 적용 |
| `SkillSystem` | 스킬 쿨타임 관리, 시전 타입(즉시/방향/범위)별 처리 |
| `MinionSpawnSystem` | 웨이브 타이머, 미니언 생성 |
| `AIController` | CPU 영웅 상태 머신 |
| `GameStateManager` | 경기 시간, 킬 카운트, 승패 판정, 부활 타이머 |
| `HUDController` (UIScene 소속) | 이벤트 구독 → 체력바/쿨타임/타이머 UI 갱신 |

시스템 간 통신은 `EventBus`(간단한 pub/sub)를 통해 이루어진다. 예:
`CombatSystem`이 데미지를 적용하면 `entity:damaged` 이벤트를 emit하고,
`HUDController`와 월드 체력바 컴포넌트가 이를 구독해 갱신한다. 이렇게 하면
전투 로직이 UI를 직접 참조하지 않아도 되고, 나중에 이펙트/사운드 시스템을
추가할 때도 기존 로직을 건드릴 필요가 없다.

### 1.3 확장성 원칙 (신규 영웅/스킬 추가 용이성)

- 영웅 스탯, 스킬 정의는 전부 **데이터**(`HeroDefs.js`, `SkillDefs.js`)로
  분리하고, 로직(`SkillSystem`)은 스킬의 `castType`(즉시/방향/범위)에 따른
  범용 처리기만 가진다. 새 영웅 추가 = 새 데이터 항목 추가 + (필요시) 새
  이펙트 함수 등록. 기존 `Hero`/`SkillSystem` 클래스는 수정하지 않는 것을
  목표로 한다.
- 미니언 종류 추가도 `MinionDefs`에 스탯/사거리/공격속도만 추가하면 되도록
  설계.

## 2. 좌표계 설계

두 좌표계를 병행한다.

### 2.1 월드 좌표 (World Space)

Phaser 기본 좌표계 그대로 사용 (X: 오른쪽, Y: 아래쪽, 단위: px). **카메라나
월드 자체를 회전시키지 않는다.** 카메라 회전은 터치 입력 벡터 변환, UI
정렬, 텍스트 가독성 등에서 부작용이 크기 때문. 대신 맵 아트/경로 자체를
좌하단→우상단으로 대각선으로 배치한다.

- 월드 크기(예): `2400 x 2400` px — 대각선 회랑의 바운딩 박스 + 여유 마진.
- 아군 본진 앵커: 월드 좌표 `(300, 2100)` 부근 (좌측 하단)
- 적 본진 앵커: 월드 좌표 `(2100, 300)` 부근 (우측 상단)

### 2.2 레인 좌표 (Lane Space) — 핵심 추상화

칼바람의 "하나의 좁은 라인"이라는 개념과, "라인 안에서 자유롭게 다방향
이동 가능"이라는 요구사항을 동시에 만족시키기 위해 레인 좌표계를 둔다.

- **레인 경로(waypoints)**: 아군 본진 → 적 본진을 잇는 폴리라인. MVP는
  거의 직선 대각선 + 중앙에서 살짝 굴곡(칼바람 다리 형태 느낌)을 주는 2~4개
  제어점.
- **t (진행도, 0~1)**: 엔티티 위치를 레인 경로에 투영했을 때의 진행률.
  `t=0`은 아군 본진, `t=1`은 적 본진. 미니언 AI의 "누가 더 전진했는가",
  포탑 사거리 판정, CPU의 "무리하게 들어가지 않기/후퇴" 판단, 카메라의
  전방 바이어스 계산에 전부 이 값을 사용한다.
- **s (측면 오프셋)**: 레인 중심선 기준 수직 방향 부호 있는 거리. 좌/우
  이동, 캐릭터 간 자리 다툼에 사용. `s`는 `±(레인폭/2 - 유닛 반경)`으로
  clamp되어 "이동할 수 없는 맵 경계" 요구사항을 물리 충돌체 없이 구현한다.
- **변환 함수**: `LaneCoordinate.worldToLane(x, y) -> {t, s}`,
  `LaneCoordinate.laneToWorld(t, s) -> {x, y}`. 내부적으로는 각 레인 세그먼트에
  대한 최근접점 투영으로 계산.

이동 처리 흐름:

```
1. 조이스틱/키보드 입력 → 정규화된 방향 벡터(dx, dy) (월드 스페이스 그대로,
   변환 없음 — 카메라를 회전하지 않으므로 화면 방향 = 월드 방향)
2. 목표 위치(px, py) = 현재 위치 + (dx, dy) * speed * dt
3. (px, py)를 레인 좌표로 변환 → {t, s}
4. t를 [0,1] 범위로, s를 [-halfWidth+r, halfWidth-r] 범위로 clamp
5. clamp된 {t, s}를 다시 월드 좌표로 변환해 최종 위치로 확정
```

이 방식은 "자유로운 2D 이동 감각"은 그대로 유지하면서 별도 물리 충돌체 없이
경계를 절대 넘지 못하게 만든다(투영 기반 clamp라 고속 이동에서도 터널링이
발생하지 않음). 모바일에서 물리 엔진(Matter.js) 없이도 가볍게 동작하는 것이
장점이며, MVP에서는 **Arcade Physics는 사거리/충돌 판정(원-원 overlap)에만
사용**하고 맵 경계 충돌에는 사용하지 않는다.

### 2.3 바라보는 방향

마지막 이동 벡터 또는 마지막 공격/스킬 시전 방향의 각도를 4방향
(좌상/우상/좌하/우하)으로 버킷 분류해 스프라이트를 선택한다. 예:
`angle ∈ [-135°, -45°)` → 우상, 등. 대각선 이동 라인 특성상 좌상/우하가
"전진/후퇴"에 가깝고 우상/좌하가 "레인 가로지르기"에 가깝게 나온다.

## 3. 대각선 맵 구현 방식

- **타일/아트**: 레인 경로의 각 세그먼트마다 폭 `laneWidth`짜리 직사각형
  스트립을 세그먼트 각도로 회전시켜 이어붙이는 "리본 메시" 방식으로 맵
  베이스를 구성한다. 스트립 텍스처는 `PixelArtFactory`가 생성하는 눈/얼음
  타일 패턴을 `TileSprite`로 반복시켜 채운다. Tiled 등 별도 툴 없이
  코드로 절차적 생성 → MVP 단계에 적합하고, 나중에 정식 타일맵으로
  교체하기도 쉬움(리본 생성 로직만 타일맵 로더로 바꾸면 됨).
- **경계 처리**: 위 2.2절의 lane clamp만으로 처리한다. 별도의 정적 물리
  바디(Matter 폴리곤 등)를 두지 않아 모바일 성능 부담을 줄인다.
- **본진/포탑 구역**: `t≈0` / `t≈1` 부근에 레인폭보다 넓은 원형 광장을
  별도로 얹어 "본진다운" 개방감을 준다(리본 폭을 본진 근처에서 넓히는
  방식).
- **월드 바운드 밖 여백 문제**: 대각선 회랑의 바운딩 박스에는 좌상단/우하단
  쪽에 아무것도 없는 빈 삼각형 영역이 생긴다. 이는 카메라 클램프(4장)로
  해결하지, 맵 자체를 정사각형으로 채우지 않는다.

## 4. 카메라 구조

Phaser의 기본 `startFollow` + 사각형 `setBounds`만으로는 대각선 맵의 빈
모서리가 보이는 문제를 막을 수 없다(축 정렬 사각형 클램프이기 때문). 따라서
`CameraController`가 매 프레임 직접 카메라 중심을 계산한다.

```
목표 지점 계산 (매 프레임, 플레이어 위치 갱신 후):

1. baseTarget = player.position
2. forwardBias = player.facingVector(4방향 버킷 아님, 실제 이동벡터) * lookAheadDistance
   → "전방을 더 보여주기" 요구사항. 정지 중엔 마지막 이동 방향을 유지.
3. downBias = 화면상 플레이어를 정중앙보다 아래에 두기 위해, 카메라 중심을
   플레이어보다 "위쪽"으로 밀어주는 오프셋 (다운 바이어스는 화면 좌표 기준
   위 방향 벡터 하나로 고정 — 맵 자체를 회전시키지 않으므로 화면 위 = 월드
   -y 로 고정해도 무방)
4. rawTarget = baseTarget + forwardBias + downBias
5. {t, s} = LaneCoordinate.worldToLane(rawTarget)
6. t = clamp(t, tMin, tMax)   // 맵 시작/끝단에서 바깥이 안 보이게
   s = clamp(s, sMinCam, sMaxCam) // 레인 중심에서 카메라가 너무 안 벗어나게
      (플레이어 이동 clamp보다 좁은 범위 — 빈 모서리 방지가 목적)
7. clampedTarget = LaneCoordinate.laneToWorld(t, s)
8. camera.centerX/Y를 clampedTarget으로 lerp (factor 약 0.08~0.12/frame)
   → 급격한 화면 흔들림 방지, "전투 중 화면이 과도하게 흔들리지 않기" 충족
```

- `camera.setBounds()`는 여전히 걸어 안전망으로 사용(월드 바운딩 박스),
  주 방어선은 위 lane 기반 clamp.
- 기본 줌은 고정값(예: 1.0, 720x1280 기준 시야 확보량으로 튜닝). 카메라
  셰이크(화면 흔들림 이펙트)는 MVP 범위에서 아예 사용하지 않거나, 사용해도
  진폭을 매우 작게 제한해 "미리 적/포탑을 확인 가능"이라는 시야 확보
  요구사항을 해치지 않게 한다.
- UIScene은 별도 카메라를 쓰므로 위 로직의 영향을 받지 않는다.

## 5. 모바일 입력 구조

`UIScene`이 화면 최상단에서 입력을 받는다(카메라 스크롤과 무관하게 화면
좌표 = 입력 좌표라 계산이 단순함).

### 5.1 가상 조이스틱

- **고정형(fixed-position)**을 채택. 와일드 리프트 등 모바일 MOBA의
  일반적인 방식이며, 매 터치마다 위치가 바뀌는 동적 생성형보다 근육 기억
  형성이 쉽고 구현/충돌 처리도 단순하다(요구사항의 "더 좋은 방식을
  선택"에 대한 결론).
- 화면 좌하단에 반투명 베이스 원 + 썸(thumb) 원. `pointerdown`이 베이스
  영역 안이면 해당 포인터 ID를 조이스틱에 바인딩, `pointermove`에서
  중심 대비 오프셋을 베이스 반경으로 clamp해 썸 위치 갱신, 매 프레임
  정규화된 벡터를 `InputState.moveVector`로 공개. `pointerup`/`pointercancel`
  시 즉시 벡터를 0으로 리셋 + 썸 스냅 복귀 ("손을 떼면 즉시 정지" 충족).

### 5.2 스킬 버튼

- 화면 우하단에 기본 공격(가장 큰 버튼) + Q/W/E를 부채꼴로, R은 별도
  강조 테두리로 배치(와일드 리프트 배치 참고).
- 공통 컴포넌트 `SkillButtonUI`: 아이콘(임시 도형), 쿨타임 숫자 텍스트,
  쿨타임 진행을 나타내는 반투명 원형 마스크 오버레이(방사형으로
  줄어듦), 쿨타임 중 tint 어둡게 + 살짝 불투명도 감소, 준비 완료 시
  테두리 밝게/미세 펄스 애니메이션. R은 동일 메커니즘에 더해 버튼 크기
  ↑ 및 금색 테두리로 "궁극기"임을 구분.
- 시전 타입별 입력 처리 (스킬 데이터의 `castType` 필드로 분기,
  `SkillSystem` + `TouchInputManager`가 공용 로직으로 처리):
  - `instant` (예: Q를 즉발로 설계할 경우, 또는 기본형): `pointerdown` 즉시
    발동, 자동 타깃 또는 현재 바라보는 방향 사용.
  - `directional` (Q 직선 베기, E 돌진): `pointerdown`으로 조준 모드
    시작 → 버튼 중심 대비 드래그 벡터로 플레이어 위치에서 뻗어나가는
    조준선을 월드에 표시 → `pointerup` 시 그 방향으로 발동. 버튼 안쪽
    (취소 반경 이내)으로 되돌아와 `pointerup`하면 취소. 드래그는 버튼
    히트영역을 벗어나도 추적해야 하므로, 조준 모드 동안은 Scene 전역
    `pointermove`를 구독(다른 위젯의 입력과 충돌하지 않도록 포인터 ID로
    구분).
  - `targeted-area` (R 내려찍기): `pointerdown` 드래그 시 사거리 원 +
    지면 조준 마커를 표시(플레이어 기준 최대 사거리로 clamp된 위치를
    따라감), `pointerup` 시 해당 위치에 시전.
- 조이스틱과 스킬 버튼은 서로 다른 화면 영역을 소유하고 포인터 ID 단위로
  추적하므로 양손 동시 조작(왼손 이동 + 오른손 스킬 조준)이 문제없이
  동작한다.
- **키보드 폴백(PC 테스트용)**: WASD/방향키 → 조이스틱과 동일한
  `moveVector`; A(또는 클릭) → 기본 공격; Q/W/E/R 키 → 각 스킬. 방향형/범위형
  스킬은 마우스 커서의 월드 좌표(카메라 스크롤 보정)를 방향/목표점으로 사용.

## 6. 파일 구성

```
play/minigame-aram/
  index.html                  # 캔버스 컨테이너, viewport 메타, 스크립트 로드 순서
  vendor/
    phaser.min.js              # Phaser 3 로컬 사본 (오프라인 실행 보장)
  src/
    config/
      GameConfig.js            # 캔버스 크기(720x1280), Scale.FIT, pixelArt:true 등
      MapDefs.js                # 레인 waypoint, 레인폭, 본진/포탑 좌표
      HeroDefs.js               # 영웅 스탯 (근접 전사 1종으로 시작)
      SkillDefs.js              # Q/W/E/R 정의: castType, damage, cooldown, range 등
      MinionDefs.js             # 근접/원거리 미니언 스탯
    core/
      Namespace.js              # window.ARAM 초기화
      EventBus.js                # 간단한 pub/sub
      LaneCoordinate.js          # world <-> lane 변환, clamp 유틸
    entities/
      Entity.js
      Unit.js
      Hero.js
      Minion.js
      Structure.js               # Turret, Nexus
    systems/
      CameraController.js
      CombatSystem.js             # 타깃 우선순위, 데미지 적용
      SkillSystem.js               # 쿨타임, castType별 처리기
      MinionSpawnSystem.js
      AIController.js               # CPU 상태 머신
      GameStateManager.js            # 타이머, 킬 카운트, 승패, 부활
      input/
        TouchInputManager.js
        VirtualJoystick.js
        SkillButtonUI.js
        KeyboardInput.js
    scenes/
      BootScene.js
      PreloadScene.js
      GameScene.js
      UIScene.js
    ui/
      HUDController.js             # 상단 정보, 일시정지, 결과 화면
      HealthBar.js                  # 재사용 가능한 체력바 (HUD용 + 월드 미니 체력바 공용)
    gfx/
      PixelArtFactory.js            # Graphics로 임시 도트 텍스처 절차 생성 (영웅/미니언/포탑/
                                     # 본진/검기/투사체/이펙트/설원 타일), nearest-neighbor 강제
  assets/                          # 비어있음 (MVP는 전부 코드 생성 텍스처, 추후 정식 아트 교체용)
```

- 스크립트 로드 순서(`index.html`): `vendor/phaser.min.js` →
  `core/*` → `config/*` → `gfx/PixelArtFactory.js` → `entities/*` →
  `systems/*`(input 하위 포함) → `ui/*` → `scenes/*`(Boot → Preload → Game
  → UI 순서 자체는 상관없음, Phaser가 key로 관리) → 마지막에
  `new Phaser.Game(GameConfig)` 부트스트랩 코드.
- 월드-스페이스 미니 체력바(영웅/미니언 머리 위)는 `GameScene` 소속
  일반 게임 오브젝트로 생성해 카메라 스크롤에 자연히 따라가게 하고,
  화면 고정 HUD(상단 정보, 스킬 버튼, 조이스틱)만 `UIScene` 소속으로 둔다.
- 신규 영웅/스킬 추가 시 손대는 파일은 원칙적으로
  `config/HeroDefs.js` + `config/SkillDefs.js`(+ 필요시 `SkillSystem.js`에
  새 이펙트 처리기 함수 등록)뿐이도록 설계한다.

## 7. 다음 단계

이 설계를 기준으로 `구현 우선순위` 1번(세로형 9:16 화면 설정)부터 순서대로
진행한다. 각 단계는 별도로:

- 이번 단계 구현 기능
- 변경/추가 파일 목록
- 변경된 파일 전체 코드
- 테스트 방법 / 정상 작동 기준
- 예상 가능한 오류
- 다음 단계 예고

를 제공하며 진행한다. 이견이나 조정하고 싶은 부분이 있으면 1단계 코드
작성 전에 알려달라.
