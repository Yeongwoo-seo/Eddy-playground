# 0주차 씬 · 미니게임 · 대사 아웃라인

> 출처: `dev/dialogueData.js`(`week0Scenes`/`week0SceneGroups`), `dev/data/sceneRoutes.js`,
> `dev/minigame-eastwood/index.html`, `dev/minigame-phone-search/index.html`.
> 전체 대사 원문은 [`week0-scene-by-scene-dialogue.md`](./week0-scene-by-scene-dialogue.md) 참고.

0주차는 등록된 씬 11개(그중 4개는 VN 대사 없이 미니게임/상점 화면으로 바로 라우팅되는
엔트리)로 구성되며, `/dev/week0`가 3+2개 그룹으로 나눠 보여준다.

## 그룹 한눈에 보기

| 그룹 | 라벨 | 포함 씬(순서) |
|---|---|---|
| #1-2 | 공항 도착 | week0-scene-flight (1) |
| #3-5 | 지하철 · 열차 | week0-scene-001-2 (2) → week0-scene-001-2-minigame (3) → week0-scene-train (4) |
| NEW | 서큘러키 · 낚시 | week0-scene-circular-quay (5) → week0-scene-circular-quay-minigame (6) |
| NEW | 옷가게 오픈 | week0-scene-shop-intro (7) → week0-scene-shop-visit (8) |
| #6-12 | 숙소 첫날 | week0-scene-002-1 (9) → week0-scene-002-2 (10) → week0-scene-002-3 (11) |

---

## #1-2 · 공항 도착

### 1. `week0-scene-flight` — 시드니 상공 · 진짜 왔네
- **위치**: In Flight(착륙 10분 전) → Sydney Airport Arrival Area(09:30)
- **구성**: `week0SceneFlightLines` + `week0Scene001Lines` 병합(중간에 미니게임 없음, `sceneTransition`으로 장소만 전환)
- **다음**: `week0-scene-001-2`
- **요약**
  - 기내에서 착륙 준비 중이던 지수가 영우와 카톡을 주고받으며 설렘/긴장을 느낀다.
  - 도착층에서 영우와 실제로 재회 — 장난스러운 티키타카(캐리어를 대신 끌어주기, "특별사면" 드립 등).
  - 후반부에 지수가 "영우가 휴대폰 화면을 자꾸 빨리 끈다"며 뭔가 숨기는 낌새를 알아챈다 — 사실은 뒤에 나올 서큘러키 낚시 서프라이즈에 대한 복선.

## #3-5 · 지하철 · 열차

### 2. `week0-scene-001-2` — 시드니 지리 파악 · 지하철 지도 튜토리얼
- **위치**: Sydney Airport Station, 09:45
- **다음**: `week0-scene-001-2-minigame` (같은 id가 `minigameId`로도 지정됨)
- **미니게임 학습 지점(`minigameStages`)**: 공항(Sydney International Airport) → 서큘러키(Circular Quay) → 숙소(Eastwood) → 영우 근무지(Marayong)
- **요약**
  - 공항 안내판 지도 앞에서 영우가 지수에게 4개 지명의 상대 위치를 가르친다("시드니 생존교육 1교시").
  - 지수가 배운 걸 스스로 복기해서 다 맞히며 마무리, `MINIGAME START`로 종료.

### 3. `week0-scene-001-2-minigame` — 시드니 지리 파악 (미니게임)
- **경로**: `/dev/minigame-eastwood/`
- **내용**: 앞 씬이 가르친 4개 지점을 3단계(라벨 배치 → 관계 연결 → 경로 확인)로 실제 지도 위에서 확인하는 미니게임(The Missing Key v1 §11.2).
- **클리어 후 자체 대사(`successLines`)**: 지수가 다 찾았다고 좋아하고, 영우가 "포인트도 벌었으니까 이따 숙소 가는 길에 한 군데 들렀다 가자"며 서프라이즈를 예고 — 이 대사가 뒤의 서큘러키 낚시 씬의 복선.
- **클리어 후**: `week0-scene-train`으로 이동.

### 4. `week0-scene-train` — 열차 — 지도에서 현실로
- **위치**: Sydney Trains, 10:05
- **다음**: `week0-scene-circular-quay`
- **요약**
  - 첫 6줄은 미니게임 클리어 직후 이어지는 지수/영우의 축하 대화.
  - 열차 안에서 지도로 배운 지명들을 실제 풍경과 맞춰보며 동네별 분위기(서큘러키=관광지, Eastwood=한인 상권, Marayong=공업지역) 대화.
  - 서로의 피로를 챙기다 지수가 창에 기대 잠든다.

## NEW · 서큘러키 · 낚시

### 5. `week0-scene-circular-quay` — 서큘러키 · 깜짝 낚시
- **위치**: Circular Quay Waterfront, 10:35
- **다음**: `week0-scene-circular-quay-minigame`
- **요약**
  - 영우가 예정에 없던 역에서 지수를 내리게 하고 워터프론트로 데려간다(오페라하우스/하버브리지 조망).
  - 낚시하는 사람들을 본 지수에게 영우가 "저번에 낚시해보고 싶다고 한 거 기억해서" 준비한 서프라이즈임을 밝힌다.
  - `[ 잠시 후 — 낚시 화면으로 이동합니다 ]`로 마무리.

### 6. `week0-scene-circular-quay-minigame` — 서큘러키 낚시
- **경로**: `/dev/minigame-fishing/play/`
- **내용**: 독립형 낚시 미니게임 재사용(캐스팅 → 대기 → 챔질 → 릴링). 클리어 조건이 없는 오픈형 미니게임이라 자동으로 다음 씬으로 넘기지 않고, 화면 자체의 뒤로가기 버튼이 `SHOP_TUTORIAL_RETURN_SCENE`(`sceneRoutes.js`) 설정에 따라 `week0-scene-shop-intro`로 되돌아간다.

## NEW · 옷가게 오픈

### 7. `week0-scene-shop-intro` — 작은 편집숍 · 옷가게 오픈
- **위치**: Eastwood Street(20:05) → Eastwood Boutique Interior(20:09)
- **다음**: `week0-scene-shop-visit`
- **요약**
  - 퇴근길에 지나치던 편집숍을 지수가 발견, 지도 미니게임 보상 500P를 여기서 써보자는 이야기가 나온다.
  - 가게 안에서 세트로 걸린 코디를 구경 — **선택지**: "일단 다 입어볼래요"(`shopIntroChoice: eager`) vs "오늘은 구경만 하고 나중에 살게요"(`shopIntroChoice: cautious`).
  - 강제 구매 없음(The Missing Key v1 §5.2) — 선택과 무관하게 상점/옷장 메뉴가 확정 해금되고 초기 재고 2벌(`outfit-w0-soft-cardigan`, `outfit-w0-city-denim`)이 열린다. 플래그 `shopUnlocked`/`wardrobeUnlocked`/`shopTutorialCompleted` 설정.

### 8. `week0-scene-shop-visit` — 옷가게 튜토리얼
- **경로**: `/dev/shop/`
- **내용**: 실제 포인트 구매 화면. 나가면 `week0-scene-002-1`(숙소 도착)로 이어진다.

## #6-12 · 숙소 첫날

### 9. `week0-scene-002-1` — 진짜 같이 있네 · 첫날 저녁 · 떨어진 충전기
- **위치**: Eastwood Accommodation(20:18) → Restaurant near Eastwood Accommodation(21:10, 저녁) → Eastwood Accommodation(22:30, 다시)
- **구성**: `week0Scene002_1Lines` + `week0SceneDinnerLines` + `week0SceneChargerLines` 병합
- **다음**: `week0-scene-002-2`
- **요약**
  - 숙소에 도착해 방을 구경하고, 장난스러운 "여행 첫날 평가"(길찾기 A, 숙소 A+, 체력 C 등)를 주고받는다.
  - 저녁을 먹으러 나가 식당에서 사진/대화, 피곤한 지수를 영우가 챙겨 일찍 들어가기로 한다.
  - 숙소로 복귀해 나갈 준비를 하다 지수가 휴대폰이 없어진 걸 발견 — 영우가 전화를 걸어 진동음으로 위치를 추적하고, 부엌 쪽에서 소리가 나는 걸 확인한 뒤 `MINIGAME START`.

### 10. `week0-scene-002-2` — 핸드폰을 찾아라
- **경로**: `/dev/minigame-phone-search/`
- **내용**: 포인트 앤 클릭 방 탐색 미니게임. 4개 구역(주방/욕실/외부/침실)에 다수의 핫스팟이 있고, 핵심 아이템 체인이 있다:
  - 손전등(꺼짐, 협탁) + AA 건전지(하부 서랍) → 작동 손전등
  - 철제 옷걸이(욕실 문 뒤) + 정원용 지지대(외부 수풀) → 긴 갈고리
  - **핸드폰**은 `kitchen-fridge-gap`(냉장고 옆 틈), **낡은 열쇠**는 `bedroom-right-vent`(우측 환기구)에서 발견(긴 갈고리로 회수하는 것으로 추정)
  - 각 핫스팟의 개별 플레이버 텍스트는 `minigame-phone-search/index.html` 자체에 있어 이 문서/전체 대사 문서에는 옮기지 않았다.
  - GAME CLEAR 시 `week0-scene-002-3`로 리다이렉트.

### 11. `week0-scene-002-3` — 근데 이 열쇠 뭐지? · 집주인과의 통화 · 첫날 밤
- **위치**: Eastwood Accommodation, 22:41 (0주차 마지막 씬 — `nextSceneId` 없음)
- **구성**: `week0Scene002_3Lines` + `week0SceneFrontdeskLines` + `week0SceneFirstNightLines` 병합
- **요약 · 핵심 스토리 비트**
  - 핸드폰을 냉장고 틈에서 찾아 안도, 동시에 환기구에서 나온 **낡은 황동 열쇠** 발견 — 뒷면에 `M.K.` 각인.
  - 이 자리에서 숙소 정식 카드키를 증거로 등록(`evidence-accommodation-keycard`, E-000).
  - **선택지**: "왠지 불길한 느낌이 드는데..." vs "그냥 순수하게 궁금한데?" → 둘 다 의문점 `question-key-hunch`를 등록하되 제목/설명이 선택에 따라 달라진다(불길함 버전 / 순수 호기심 버전).
  - 사진을 찍어 집주인에게 전화 — **증거 제시 UI**로 `evidence-unknown-key`를 골라야 통과(틀리면 집주인이 갸웃하는 리액션 텍스트). 집주인은 "M.K.요?"라며 잠깐 멈칫하지만 "객실 열쇠는 아니다"라고 답하고, 사진을 보내면 확인해보겠다며 통화 종료.
  - 지수와 영우 둘 다 집주인의 미묘한 반응(한 번 더 확인하는 듯한 뉘앙스)을 감지하지만 성급히 단정하지 않기로 한다 — **`M.K.`가 이후 4주 전체 미스터리의 씨앗**이 되는 지점(집주인 실명은 이후로도 계속 감춰짐, 관련 코멘트에 따르면 1주차 개편 이후로도 "M.K. / MK_Consult" 계정 단서 수준까지만 노출).
  - 첫날 밤 마무리 대화(보물찾기면 나눠 갖자는 드립, 애정신) 후 아이템 획득 카드 `[ ITEM ACQUIRED ] UNKNOWN KEY 각인: M.K.`.
  - 마지막 줄에서 플래그 `week0Completed = true` 설정(The Missing Key v1 §5.6 — `outfit-w0-night-walk` 해금 조건) 후 "0주차 종료."

---

## 이번 주차에서 새로 등록되는 것들

- **증거**: `evidence-accommodation-keycard`(E-000, 숙소 카드키)
- **의문점**: `question-key-hunch`(열쇠의 정체 — 선택에 따라 문구 2종)
- **아이템**: `UNKNOWN KEY`(각인 M.K.)
- **플래그**: `shopIntroChoice`(eager/cautious), `shopUnlocked`, `wardrobeUnlocked`, `shopTutorialCompleted`, `week0Completed`
- **해금**: 상점/옷장 메뉴, 초기 옷 2벌(`outfit-w0-soft-cardigan`, `outfit-w0-city-denim`)
