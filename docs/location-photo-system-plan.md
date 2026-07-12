# 장소(Location) 기반 배경 사진 시스템 — 설계안

> 작성일: 2026-07-12
> 상태: **설계 확정, 미구현** — 실제 코드 변경은 아직 반영되지 않았음.
> 이 문서는 구현 착수 시 그대로 작업 지시서로 쓸 수 있도록 작성됨.

---

## 배경 (문제 정의)

현재는 **사진이 씬(scene)에 종속**되어 있음:

- `dev/dialogueData.js`의 각 씬은 `locations: [{ key, label }]` 형태로 자기만의 배경 슬롯을 소유.
- 사진은 Supabase Storage 경로 `background/<sceneId 또는 slot key>/<id>.ext`로, **씬 슬롯 단위**로 업로드·배정됨 (`dev/assetDb.js` `addAsset`/`parsePathMeta`).
- 예: `week0-scene-002-1`(숙소 도착)과 `week0-scene-002-3`(첫날 밤)은 둘 다 라벨상 "Eastwood Accommodation"이지만, 실제로는 서로 다른 슬롯이라 **같은 물리적 장소인데도 사진을 두 번 따로 올려야 함**. 라벨만 같고 실제 사진이 다르면 미스매치 위험도 있음.

## 목표

사진 배정을 **씬 단위 → 장소(Location) 단위**로 바꾼다.

- 장소를 씬과 독립된 전역 엔티티로 관리.
- 씬은 "이 슬롯이 어느 장소를 쓰는지"만 지정(참조)하고, 사진은 장소에 배정.
- 같은 장소를 여러 씬이 공유하면 사진도 자동으로 공유됨(한 번만 올리면 됨).

## 확정된 결정 사항

| 질문 | 결정 |
|---|---|
| 전역 장소 목록 저장 위치 | **Supabase(DB) 관리** — 코드 파일이 아니라 Storage에 JSON blob으로, `/dev/upload` UI에서 코드 수정 없이 추가/수정 |
| 장소당 사진 변형(variant) | **지원함** — 예: 낮/밤 등 한 장소가 여러 사진 버전을 가질 수 있음 |
| 기존 씬에 이미 올라간 배경 사진 마이그레이션 | **장소 목록을 새로 만들고 사진도 다시 배정** (라벨 문자열 기준 자동 병합은 하지 않음 — 실제로 다른 사진인데 라벨만 같은 경우 오매칭 위험이 있어 안전하게 수작업으로) |
| 적용 범위 | **일반 씬 배경만.** 미니게임 배경(방탈출류 room-search, 지도형 minigame)은 이번 변경 대상 아님 — 지금처럼 씬/미니게임에 종속 유지 |

---

## 스키마 설계

### 1. 전역 장소 카탈로그 (신규)

기존 `AssetDB`의 `sounds/catalog.json` 패턴(단일 JSON blob, Storage에 저장)과 동일한 방식으로 `locations/catalog.json` 신설:

```js
{
  "loc-eastwood-accommodation": {
    id: "loc-eastwood-accommodation",
    label: "Eastwood Accommodation",
    variants: [
      { id: "default", label: "기본" },
      { id: "night", label: "밤" }
    ]
  },
  "loc-in-flight": {
    id: "loc-in-flight",
    label: "In Flight",
    variants: [{ id: "default", label: "기본" }]
  }
  // ...
}
```

`dev/assetDb.js`에 다음 함수 추가 (기존 `getSounds`/`setSound` 짝과 동일한 형태로):
- `getLocations()` — 카탈로그 전체 조회
- `setLocation(locationId, def)` — 장소 생성/수정 (def === null이면 삭제)

### 2. 사진 저장 경로 변경

- 기존: `background/<sceneId 또는 slot key>/<id>.ext`
- 변경: `background/<locationId>/<variantId>/<id>.ext`

`dev/assetDb.js`의 `parsePathMeta`(현재 `background` 타입에 대해 `{ sceneId: parts[1] }` 반환, L79-87 부근)를 `{ locationId: parts[1], variantId: parts[2] }` 반환하도록 수정. `addAsset`(L98)의 `sceneId` 파라미터도 `locationId`/`variantId`로 교체.

### 3. 사진 배정 저장소 — 씬 단위 → 장소 단위

현재 `DevGameState`(`dev/assetDb.js` L590+)는 `sceneId(=씬 배경 슬롯 key) → assetId` 맵을 localStorage에 저장(`_loadBackgroundMap`/`getBackgroundId`/`setBackgroundId`).

변경 후: `locationId::variantId → assetId` 맵으로 교체. 즉 "사진 배정" 행위 자체가 장소+변형 단위가 됨 — 같은 장소를 쓰는 씬이 몇 개든 배정은 한 번만 하면 전부 반영.

씬이 실제로 어떤 사진을 보여줄지는 **2단계 해석**을 거침:
1. 씬의 배경 슬롯 key → (씬이 참조하는) `locationId` (+ 필요시 `variant`)
2. `locationId::variant` → 배정된 assetId

### 4. 씬 → 장소 참조 (`dev/dialogueData.js`)

각 씬의 `locations` 배열 항목에 `locationId` 필드 추가:

```js
locations: [
  { key: 'week0-scene-flight', label: 'In Flight', locationId: 'loc-in-flight' },
  { key: 'week0-scene-flight--arrival', label: 'Sydney Airport Arrival Area', locationId: 'loc-sydney-airport-arrival' },
],
```

`locations` 배열이 없는 단일 위치 씬(`location` 문자열만 있는 경우)도 동일하게 `locationId` 필드를 갖도록 정규화 필요 — 예를 들어 씬 객체에 최상위 `locationId` 필드를 추가하거나, 내부적으로 `locations: [{ key: scene.id, label: scene.location, locationId: null }]`로 정규화하는 헬퍼를 둘 것.

마이그레이션 직후에는 전부 `locationId: null`(미배정) 상태로 시작 — `/dev/upload`에서 "장소 미지정" 슬롯을 시각적으로 표시하고 하나씩 배정.

### 5. 런타임 해석 (`dev/game/index.html`)

호출부(`applyBackground`, `playSceneTransition` 등, L340-500 부근)는 그대로 두고, `DevGameState.getBackgroundId(key)` / `setBackgroundId` 내부 구현만 교체:

```
getBackgroundId(key):
  locationId = resolveLocationId(key)   // dialogueData.js 전체 씬을 훑어 key -> locationId 맵 구성(1회 캐시)
  if (!locationId) return null
  variantId = 활성 variant 결정 (씬이 명시한 variant 있으면 그것, 없으면 'default')
  return locationBackgroundMap[`${locationId}::${variantId}`] || null
```

`removeAllBackgroundAssetRefs`(사진 삭제 시 참조 정리)도 location 맵 기준으로 재작성.

### 6. UI (`dev/upload/index.html`)

- **신규 탭 "장소 DB"**: 장소 생성/이름변경/삭제, 장소별 variant 추가/삭제, variant별 사진 업로드 및 배정(활성 사진 선택). 지금 "인물 DB" 탭과 비슷한 구조로 만들면 됨.
- **기존 "배경 DB" 탭** (주차→씬→배경슬롯 선택, `backgroundKinds()` L728-742 부근): 슬롯을 고른 다음이 "사진 업로드"가 아니라 **"이 슬롯이 어느 장소인지 선택"**(카탈로그 검색/선택, 또는 "새 장소 만들기")으로 바뀜. 실제 사진 업로드/배정은 장소 DB 탭에서 하고, 배경 DB 탭에서는 이미 배정된 사진을 미리보기만 하는 정도로 축소.
- 룸서치 핫스팟(`getRoomHotspots`/`setRoomHotspot`)과 미니게임 핫스팟(`getMinigameHotspot`/`setMinigameHotspot`) 관련 UI는 변경 없음 — 이번 범위 밖.

---

## 구현 순서 제안

1. `dev/assetDb.js` — 장소 카탈로그 CRUD(`getLocations`/`setLocation`) + 사진 경로/`parsePathMeta` 변경 + `DevGameState`의 배경 맵을 location 단위로 교체
2. `dev/dialogueData.js` — 모든 씬(0주차, 1주차 등)의 `locations`/`location`에 `locationId` 필드 추가(전부 `null`로 시작 가능)
3. `dev/game/index.html` — `DevGameState.getBackgroundId`가 key→locationId→assetId 2단계로 해석하도록 내부 로직 교체 (호출부는 무변경)
4. `dev/upload/index.html` — "장소 DB" 탭 신설, "배경 DB" 탭을 장소 선택/배정 방식으로 개편
5. 마이그레이션 — 장소 카탈로그를 빈 상태로 시작한 뒤, `/dev/upload`에서 기존 각 씬 슬롯을 하나씩 훑으며 장소를 만들고(또는 기존 장소에 연결) 사진을 재배정. 스토리지에 있던 기존 사진 파일 자체는 삭제되지 않으므로 필요하면 재활용 가능(경로만 새로 옮겨 올리면 됨).

## 영향받지 않는 부분 (확인용)

- 인물(캐릭터) 사진 시스템 (`character/<characterKey>/...`) — 변경 없음
- 대사 오버라이드, 아이템/조합법, 사운드 카탈로그 — 변경 없음
- 룸서치·미니게임 배경/핫스팟 — 변경 없음 (합의된 적용 범위 밖)
