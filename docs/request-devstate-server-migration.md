# 의뢰서 — DevGameState 로컬 전용 설정을 전부 서버(Supabase)로 이전

> 발신인: (작성자 본인)
> 대상: `dev/assetDb.js`의 `DevGameState` 객체가 관리하는 6개 배정 맵
> 목적: `/dev/` 도구에서 지정한 캐릭터 초상화·의상·위치/스케일·BGM·배경 배정이 **지정한 기기에서만 보이는 문제**를 없앤다. 이 문서는 조사 결과와 변경 계획을 정리한 것이며, 승인되면 그대로 구현한다.
> 계기: `/play/game`에서 캐릭터 초상화가 빈 실루엣(placeholder)으로 뜨는 스크린샷 제보 → 원인 추적 결과 예상보다 훨씬 넓은 범위의 구조적 문제로 확인됨.

---

## 1. 문제

`/dev/` 하위 도구(`dev/upload`, `dev/start` 등)는 "이 캐릭터·이 표정엔 이 사진", "이 장소엔 이 사진", "이 캐릭터는 화면에서 이 위치·배율" 같은 배정을 만든다. 이 배정이 실제로 어디 저장되는지 확인한 결과:

| 저장되는 값 | 실제 저장 위치 | 기기 간 동일하게 보이는가 |
|---|---|---|
| 업로드한 이미지 파일 자체 (blob) | Supabase Storage | ✅ 됨 |
| 시작화면 배경(`startScreen.bgAssetId`) | Supabase (`AssetDB.getGameSettings/setGameSettings`) | ✅ 됨 |
| 씬 → 장소 연결 (`getSceneLocationMap`) | Supabase (`scene-locations/map.json`) | ✅ 됨 |
| **장소 → 사진 배정** (`getLocationAssetId`) | **localStorage만** (`mkDevLocationBackgrounds`) | ❌ 안 됨 |
| **캐릭터 초상화 배정** (`getCharacterAssetId`) | **localStorage만** (`mkDevSelectedCharacters`) | ❌ 안 됨 |
| **선택된 의상** (`getSelectedOutfit`) | **localStorage만** (`mkDevSelectedOutfits`) | ❌ 안 됨 |
| **캐릭터 위치/스케일 튜닝** (`getCharacterTransform`) | **localStorage만** (`mkDevCharacterTransforms`) | ❌ 안 됨 |
| **씬별 BGM** (`getSceneBgmId`) | **localStorage만** (`mkDevSceneBgm`) | ❌ 안 됨 |
| **레거시 씬 직배정 배경**(미니게임/방탈출용) (`getLegacyBackgroundId`) | **localStorage만** (`mkDevSelectedBackgrounds`) | ❌ 안 됨 |

즉 사진 파일 자체와 "씬이 어느 장소인지"는 서버에 있지만, **"그 장소/캐릭터에 실제로 어떤 사진을 쓸지"를 정하는 배정 정보 대부분이 로컬에만 있다.** `/dev/upload`에서 배정한 기기가 아닌 다른 기기(제보 스크린샷)에서는 이 배정이 아예 없으므로 placeholder가 뜬다. 이미지 업로드 도구에 배경 제거 버튼을 붙이는 작업(선행 PR #539, #544) 중 이 문제를 발견했다.

---

## 2. 기존에 이미 있는 재사용 가능한 인프라

`dev/assetDb.js`에는 "단일 JSON blob을 Supabase Storage에 올려두고 캐시로 감싸 읽고 쓰는" 패턴이 이미 여러 번 구현되어 있다 (`getSceneLocationMap`/`setSceneLocation`, `getMapPins`/`setMapPin`, `getLocations`/`setLocation`, `getSounds`/`setSound` 등). 새로 만들 6개 항목도 이 패턴을 그대로 재사용하면 된다.

```js
// 읽기 (관대함 — 실패 시 빈 값)
async function getXxxMap() {
  if (xxxCache.has('key')) return xxxCache.get('key');
  const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${XXX_PATH}?t=${Date.now()}`;
  try {
    const map = (await fetchJsonBlob(url)) || {};
    xxxCache.set('key', map);
    return map;
  } catch (e) {
    return xxxCache.get('key') || {};
  }
}

// 쓰기 (엄격함 — 실패 시 throw, 기존 값 보존)
async function setXxxEntry(entryKey, value) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/${DEV_ASSETS_BUCKET}/${XXX_PATH}?t=${Date.now()}`;
  const current = await readCurrentForWrite(xxxCache, 'key', url, {});
  const map = Object.assign({}, current);
  if (value) map[entryKey] = value; else delete map[entryKey];
  const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DEV_ASSETS_BUCKET}/${XXX_PATH}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', 'x-upsert': 'true' },
    body: blob,
  });
  if (!res.ok) throw new Error(`저장 실패 (${res.status}): ${await res.text()}`);
  xxxCache.set('key', map);
  return map;
}
```

`fetchJsonBlob`/`readCurrentForWrite` 헬퍼는 이미 존재(1387번째 줄 이전, `assetDb.js` 287·303줄)하므로 그대로 가져다 쓴다.

---

## 3. 새로 만들 6개 서버 blob

| DevGameState 키 | 새 Storage 경로(제안) | 데이터 모양 |
|---|---|---|
| `characters` | `character-assets/map.json` | `{ "jisoo::neutral": assetId, "jisoo::soft_cardigan::neutral": assetId, ... }` (기존 `_assetKey` 그대로) |
| `outfits` | `character-outfits/selection.json` | `{ "jisoo": "soft_cardigan", ... }` |
| `transforms` | `character-transforms/map.json` | `{ "jisoo": {x,y,scale}, "__other__": {x,y,scale} }` (기존 `_transformKeyFor` 그대로) |
| `sceneBgm` | `scene-bgm/map.json` | `{ "week1-scene-004": soundId, ... }` |
| `locationBackgrounds` | `location-backgrounds/map.json` | `{ "eastwood-accommodation::default": assetId, ... }` (기존 `_locationSlotKey` 그대로) |
| `background` (레거시 직배정) | `scene-backgrounds/map.json` | `{ "week0-minigame-fishing": assetId, ... }` |

키 포맷은 지금 localStorage에 쓰던 것과 완전히 동일하게 유지 — 그래야 `_assetKey`/`_transformKeyFor`/`_locationSlotKey` 같은 기존 헬퍼 함수를 손대지 않고 재사용할 수 있다.

---

## 4. DevGameState 쪽 변경

현재 `getBackgroundId`/`setBackgroundId`가 이미 `async`이고 호출부가 전부 `await`하고 있다 (씬→장소 조회 부분만 서버라서). 나머지 6개도 **같은 방식으로 `async`로 바꾸고, 호출부에 `await`를 추가**하는 것이 기존 코드베이스 관례와 일치한다.

각 getter는:
1. `AssetDB.getXxxMap()`을 `await` 해서 서버 값을 읽는다.
2. 성공하면 그 값을 localStorage에도 즉시 반영(오프라인 폴백/다음 로드 시 즉시 페인트용 캐시)한다.
3. 네트워크 실패 시 localStorage 캐시 값으로 폴백한다(기존 `dev/start`의 "로컬은 즉시 표시용 캐시, 서버가 진짜 저장소" 패턴과 동일).

각 setter는:
1. localStorage에 먼저 쓴다(즉시 반영, 현재 세션 내 다른 동기 호출부가 있다면 그쪽도 곧바로 최신값을 봄).
2. `AssetDB.setXxxEntry(...)`를 `await`해서 서버에도 반영한다. 실패하면 에러를 호출부로 전파(기존 `dev/upload`의 저장 실패 처리 방식과 동일하게 알림 배너로 노출).

### ⚠️ 기존 데이터 이전(마이그레이션) 문제

이 부분이 새로 고려해야 할 지점이다. 지금 이미 `/dev/upload`를 써온 기기(주 작업 기기)의 localStorage에는 실제로 배정해둔 값들이 들어있다. 배포 즉시 "서버가 원본"으로 바뀌면:
- 새 서버 blob은 비어있으므로, **주 작업 기기에서도** 지금까지 배정해둔 캐릭터 초상화/배경 등이 순간적으로 다 사라진 것처럼 보인다.
- 즉 단순히 읽기 경로만 서버로 바꾸면 기존 작업 내용을 잃는 것처럼 보이는 회귀가 생긴다.

**제안하는 1회성 마이그레이션**: 앱 초기화 시(예: `dev/upload/index.html` 로드 시 1회) 다음 로직을 추가한다.
```
서버 blob이 비어있고 && localStorage에 값이 있으면
  → localStorage 값을 그대로 서버로 1회 업로드(push)
```
이렇게 하면 실제로 배정 작업을 해온 기기가 서버의 "원본"을 채워주는 역할을 하고, 이후부터는 모든 기기가 그 서버 값을 공유한다. `CaseFileState.setSetting`이 "캐시/로컬 저장 기록이 아예 없는 새 기기에서만 서버 값으로 부팅"하는 것과 반대 방향(로컬→서버 최초 1회 push)이라 기존 코드에 참고할 완전히 같은 사례는 없다 — 새로 작성해야 한다.

---

## 5. 영향받는 호출부 (16개 파일, 40곳 이상)

`getCharacterAssetId` / `getCharacterAssetIdForOutfit` / `setCharacterAssetId` / `getSelectedOutfit` / `setSelectedOutfit` / `getCharacterTransform` / `setCharacterTransform` / `getSceneBgmId` / `setSceneBgmId` / `getLocationAssetId` / `setLocationAssetId` / `getLegacyBackgroundId` / `setLegacyBackgroundId` / `removeAllCharacterAssetRefs` / `removeAllSceneBgmRefs` / `removeAllBackgroundAssetRefs` 를 호출하는 곳 전부에 `await`를 추가해야 한다:

- `dev/upload/index.html` — 관리자 도구 본체, **약 20곳** (배정 저장/미리보기/필터 전부)
- `dev/weekPreloader.js` — 프리로드 시 캐릭터 자산 미리 받기 (2곳)
- `dev/minigame-item-scan/index.html` (1곳)
- `dev/state/wardrobeState.js` (의상 장착 시 `setSelectedOutfit` 호출, 1곳)
- `dev/data/shopItems.js` / `dev/dialogueData.js` — 주석에서만 언급, 실제 호출 없음(확인 필요)
- `play/game/index.html` — 메인 대사 엔진, 캐릭터 초상화·위치·BGM 렌더링 (약 7곳, `applyCharacterForLine`/`preloadCharacterAssetsForLines`/BGM 재생부)
- `play/explore/index.html` — 탐색 허브 (약 10곳)
- `play/shop/index.html` (약 5곳)
- `play/wardrobe/index.html` (2곳)
- `play/minigame-eastwood/index.html`, `play/minigame-phone-search/index.html`, `play/minigame-photo-zoom/index.html`, `play/minigame-timeline/index.html` — 미니게임 4종, 각각 캐릭터 얼굴/위치 + 레거시 배경 조회 (각 2~4곳)

`play/game/index.html`의 `applyCharacterForLine`은 이미 `async function`이고 `charRequestToken`으로 "느린 네트워크 응답이 최신 대사를 덮어쓰는" 경쟁 상태를 이미 막아두고 있다 — `getCharacterAssetId`가 동기에서 비동기로 바뀌어도 이 방어 로직 패턴은 그대로 활용 가능하나, **await 지점이 하나 늘어나므로 race condition 커버리지를 다시 한번 점검**해야 한다.

---

## 6. 이 환경에서 테스트 못 하는 것

이 세션(샌드박스)은 프록시 정책상 Supabase 실 네트워크에 접근할 수 없다 (`ERR_TUNNEL_CONNECTION_FAILED` 확인됨). 즉:
- 새 blob 경로에 실제로 읽기/쓰기가 되는지
- 마이그레이션(로컬→서버 1회 push)이 실제로 기존 배정을 보존하는지
- `/play/game`에서 캐릭터가 실제로 다른 기기에서도 뜨는지

**이 세 가지를 라이브로 확인할 수 없다.** 코드 리뷰(기존 패턴과의 일관성)로만 검증하고, 실제 동작 확인은 배포 후 사용자가 직접 해야 한다.

---

## 7. 결정이 필요한 사항

- [ ] 6개 항목 전부 한 번에 진행 vs 캐릭터(+의상)만 먼저 vs 6개 각각 별도 PR — **범위/순서 확정**
- [ ] 마이그레이션(로컬→서버 1회 push) 로직 위치 — `dev/upload/index.html` 로드 시 vs `assetDb.js` 초기화 시 vs 수동 버튼("서버로 업로드") 중 어느 방식으로 할지
- [ ] 서버 blob이 비어있고 로컬도 비어있는 완전히 새 기기(마이그레이션 대상 없음)는 그냥 placeholder로 두는 현재 동작 유지로 충분한지
- [ ] 이 문서 승인 후 실제 코드 변경을 이 세션에서 계속할지, 별도로 진행할지

---

## 8. 참고

- 관련 파일: `dev/assetDb.js`(`DevGameState`, 1387~1650줄 / 기존 서버 blob 패턴, 585~1362줄), `play/game/index.html`(`setCharacterAsset`/`applyCharacterForLine`, 443~604줄)
- 관련 커밋: `06c6beb` (시작화면 배경 Supabase 이전), `d4b03b3` (진행저장/설정/개발계획 메모 서버 백업 — 새 기기 부팅 방향의 참고 사례)
- 계기가 된 스크린샷: `/play/game` 대사 화면에서 캐릭터 초상화가 빈 실루엣(placeholder)으로 표시됨
