# DevGameState async 호출 감사 결과 (작업 06)

## 전제 조건 — 중요

이 저장소의 `dev/assetDb.js`(현재 `origin/main` 기준, 수정 금지 파일)를 확인한 결과, `DevGameState`의
`getCharacterAssetId` / `getCharacterAssetIdForOutfit` / `setCharacterAssetId` / `getSelectedOutfit` /
`setSelectedOutfit` / `getCharacterTransform` / `setCharacterTransform` / `getSceneBgmId` / `setSceneBgmId` /
`getLocationAssetId` / `setLocationAssetId` / `getLegacyBackgroundId` / `setLegacyBackgroundId` /
`removeAllCharacterAssetRefs` / `removeAllSceneBgmRefs` / `removeAllBackgroundAssetRefs`는 **아직 전부
동기 함수(localStorage 직접 읽기/쓰기)**다. `getBackgroundId` / `setBackgroundId` / `getRoomHotspots` /
`getMinigameHotspot` 등 위치 기반 배경 API만 이미 `async`로 되어 있다.

즉 작업 01(공개 API 계약)이 정의한 "서버 비동기화"가 **이 저장소에는 아직 반영되지 않은 상태**다. 그래서
아래 목표 A 작업은 (1) 지금 당장 레이스를 고치는 것이 아니라 **API가 언제 async로 바뀌어도 깨지지 않게
호출부를 미리 `await`-안전하게 만들어 둔 것**이고, 목표 B/C 감사 표의 "수정 필요" 행은 **API가 async로
바뀌는 순간 조용히 깨지는(Promise 객체를 캐시 키/동기 값으로 오용하게 되는) 지점**을 미리 표시해 둔
것이다. 병합 시점에 assetDb.js가 실제로 async 전환되어 있다면, 아래 "수정 필요" 표는 즉시 실사용 버그
목록이 된다.

## 요약

- 정상 처리(await/then/명시적 처리): **13**
- 수정 필요(동기 값처럼 사용 — 향후 API가 async로 바뀌면 즉시 깨짐): **47**
- 주석/문서/비호출: **11**
- 총 검색 결과: **71** (`rg` 명령 기준, 저장소 전체)

## 목표 A — 4개 미니게임 비동기화 (완료)

소유 파일 4개 모두에서 8개 호출 지점(경쟁 상태 방어 포함)을 수정했다.

| 파일 | 줄 | 변경 |
|---|---:|---|
| `play/minigame-eastwood/index.html` | 341 | `getLegacyBackgroundId` await 추가 (`initMap`은 이미 async, 호출부는 `.then()`으로 정상 처리 중) |
| `play/minigame-eastwood/index.html` | 482 | `getCharacterAssetId` await 추가 + await 직후 `portraitRequestToken` 재확인 추가 |
| `play/minigame-eastwood/index.html` | 505, 518 | `getCharacterAssetId`/`getCharacterTransform` await 추가, 두 await 사이·이후 각각 `successAvatarRequestToken` 재확인 추가 (기존엔 첫 await 뒤에만 확인해 두 번째 갭이 무방비였음) |
| `play/minigame-phone-search/index.html` | 603 | `getCharacterAssetId` await 추가 + `msgPortraitRequestToken` 재확인 추가 |
| `play/minigame-phone-search/index.html` | 1191, 1234 | `getLegacyBackgroundId` await 추가 (`loadArea`/`preloadAllAreas`) |
| `play/minigame-phone-search/index.html` | 1180-1259 | `loadArea`/`switchArea`가 공유하는 `areaLoadToken` 카운터 신설 — 장소를 빠르게 연속 이동하면 먼저 시작된 `switchArea` 호출이 늦게 끝나며 최신 장소의 캔버스/핫스팟/페이드 상태를 덮어쓸 수 있던 지점을 방어 |
| `play/minigame-photo-zoom/index.html` | 813 | `getCharacterAssetId` await 추가 + `portraitRequestToken` 재확인 추가 |
| `play/minigame-photo-zoom/index.html` | 1169, 1182 | eastwood와 동일한 이중 await + 이중 토큰 재확인 패턴 적용 |
| `play/minigame-timeline/index.html` | 274 | `getCharacterAssetId` await 추가 + `portraitRequestToken` 재확인 추가 |
| `play/minigame-timeline/index.html` | 418, 431 | eastwood와 동일한 이중 await + 이중 토큰 재확인 패턴 적용 |

참고: `photo-zoom`의 `loadPhotoBackground`/`loadPhotoHotspots`(`getBackgroundId`/`getRoomHotspots` 사용,
458/602/663/671행)는 이미 `await` + `activePhotoIdx` 재확인으로 stale-response를 올바르게 방어하고
있어 수정하지 않았다. 4개 파일 모두 인라인 `<script>`를 추출해 `node --check`로 구문 검증했다(통과).

`MINIGAME_FACE_EXPRESSION`은 버그가 아니라 `dev/dialogueData.js:88`에 정의된 실제 전역 상수(미니게임
전용 얼굴 컷 sentinel)다 — 4개 파일 모두 정상적으로 참조하고 있었다.

`initMap`/보트 시퀀스는 4개 파일 모두 페이지 로드당 1회만 실행되고, 페이지 내 "재시작" 버튼이 없다
(재시작은 `location.reload()`로 전체 리로드 — 상태가 자동 초기화되므로 별도 토큰이 불필요). `RESET GAME`/
`CLEAR STATE`(phone-search 개발자 시트)도 `location.reload()` 경로.

## 목표 B — 저장소 전역 호출 감사

```bash
rg -n --glob '!node_modules/**' --glob '!dist/**' \
  "DevGameState\.(getCharacterAssetId|getCharacterAssetIdForOutfit|setCharacterAssetId|getSelectedOutfit|setSelectedOutfit|getCharacterTransform|setCharacterTransform|getSceneBgmId|setSceneBgmId|getLocationAssetId|setLocationAssetId|getLegacyBackgroundId|setLegacyBackgroundId|removeAllCharacterAssetRefs|removeAllSceneBgmRefs|removeAllBackgroundAssetRefs)" .
```

### 수정 필요 (동기 값처럼 사용 — 47건, 전부 타 소유 파일)

| 파일 | 줄 | 호출 | 문제 | 비고 |
|---|---:|---|---|---|
| `dev/upload/index.html` | 1665 | `getLocationAssetId` | await 없음 | 미리보기 렌더 |
| `dev/upload/index.html` | 2146 | `getSelectedOutfit` | await 없음 | 인물 DB 탭 |
| `dev/upload/index.html` | 2164 | `setSelectedOutfit` | await/에러 처리 없음 | 인물 DB 탭 |
| `dev/upload/index.html` | 2283 | `setLocationAssetId` | await 없음 | 업로드 완료 콜백 |
| `dev/upload/index.html` | 2298, 2317, 3547 | `setLegacyBackgroundId` | await 없음 (3곳) | 배경 배정 |
| `dev/upload/index.html` | 2454, 2638, 2822, 3559 | `setCharacterAssetId` | await 없음 (4곳) | 캐릭터 업로드 확정 |
| `dev/upload/index.html` | 3094, 3515 | `getLegacyBackgroundId` | await 없음 (2곳) | 배경 조회 |
| `dev/upload/index.html` | 3513 | `getLocationAssetId` | await 없음, `===` 동기 비교 | asset 활성 여부 판정 — async 전환 시 항상 false |
| `dev/upload/index.html` | 3516 | `getCharacterAssetIdForOutfit` | await 없음, `===` 동기 비교 | 위와 동일 문제 |
| `dev/upload/index.html` | 3554 | `setLocationAssetId` | await 없음 | 장소 사진 확정 |
| `dev/upload/index.html` | 3566 | `removeAllBackgroundAssetRefs` | await 없음 (이미 `async function removeAsset` 안) | 삭제/정리 helper |
| `dev/upload/index.html` | 3567 | `removeAllCharacterAssetRefs` | await 없음 (위와 동일 함수) | 삭제/정리 helper |
| `dev/upload/index.html` | 3941 | `getSceneBgmId` | await 없음, `===` 동기 비교 | BGM 활성 여부 판정 |
| `dev/upload/index.html` | 3981, 3985 | `setSceneBgmId` | await 없음 (2곳) | BGM 배정/해제 |
| `dev/upload/index.html` | 3993 | `removeAllSceneBgmRefs` | await 없음 (이미 async `deleteSoundEntry` 안) | 삭제/정리 helper |
| `play/explore/index.html` | 888, 960, 1290, 1436, 2015, 2017, 2034, 2042, 2051 | `getCharacterAssetId` | await 없음 (9곳) | 캐릭터 적용 helper |
| `play/game/index.html` | 490 | `getSceneBgmId` | await 없음 — `if (!soundId) return`이 Promise를 항상 truthy로 오판, `sounds[soundId]`도 Promise를 키로 사용해 항상 실패 | BGM 적용 helper (`applyBgm`) |
| `play/game/index.html` | 542, 544 | `getCharacterAssetId` | await 없음 (`preloadCharacterAssetsForLines`, 이미 async 함수) | 프리로드 |
| `play/game/index.html` | 593, 596 | `getCharacterAssetId` | await 없음 — `applyCharacterForLine`은 `charRequestToken` 가드가 이미 있으나 이 두 호출 자체가 await되지 않음 | 캐릭터 적용 helper |
| `play/game/index.html` | 605 | `getCharacterTransform` | await 없음, 599행 토큰 재확인 이후 추가 await 갭이 생기므로 재확인 필요 | 캐릭터 적용 helper (transform) |
| `play/shop/index.html` | 191, 205, 208 | `getCharacterAssetId` | await 없음 (3곳) | 캐릭터 적용 helper |
| `play/shop/index.html` | 195 | `getCharacterAssetIdForOutfit` | await 없음 | 캐릭터 적용 helper |
| `play/wardrobe/index.html` | 98, 101 | `getCharacterAssetId` | await 없음 (2곳) | 캐릭터 적용 helper |
| `dev/weekPreloader.js` | 140, 142 | `getCharacterAssetId` | await 없음, 이를 감싸는 `collectCharacterAssetIds()`가 동기 함수라 async 전환 시 함수 자체를 `async`로 바꾸고 호출부(177행 `ensureWeekLoaded` 내부)까지 `await` 전파 필요 | 초기화 함수 전파 필요 |
| `dev/state/wardrobeState.js` | 70 | `setSelectedOutfit` | await/에러 처리 없음. 이를 감싸는 `WardrobeState.equipOutfit()`이 동기 함수(불리언 반환)라, async 전환 시 아래 4개 호출부까지 async 전파 필요: `play/wardrobe/index.html:129`, `play/shop/index.html:256,341`, `play/game/index.html:833` | 옷장 장착 helper — wrapper async 전파 필요 |
| `dev/minigame-item-scan/index.html` | 328 | `getCharacterAssetId` | await 없음 | 작업 06 소유 목록(4개 미니게임)에 없는 5번째 미니게임 페이지. 담당 작업자 미상 — 이 파일을 소유한 작업이 있다면 반영 필요, 없다면 별도 티켓 필요 |

*22건(`dev/upload/index.html`) + 9건(`play/explore/index.html`) + 6건(`play/game/index.html`) +
4건(`play/shop/index.html`) + 2건(`play/wardrobe/index.html`) + 2건(`dev/weekPreloader.js`) +
1건(`dev/state/wardrobeState.js`) + 1건(`dev/minigame-item-scan/index.html`) = 47건.*

담당 작업 번호(02~05)는 이 세션에 파일별 작업 배정표가 없어 특정할 수 없었다. 위 표의 파일 경로로
해당 파일을 소유한 작업자가 직접 반영해야 한다. `dev/upload/index.html`, `play/game/index.html`,
`play/explore/index.html`, `play/shop/index.html`, `play/wardrobe/index.html`,
`dev/state/wardrobeState.js`는 작업 06의 "수정 금지 파일"에 명시되어 있어 이 세션에서는 코드를
건드리지 않았다. `dev/weekPreloader.js`, `dev/minigame-item-scan/index.html`은 금지 목록에도 소유
목록에도 없어 마찬가지로 보고만 한다.

### 정상 처리 (13건 — 작업 06 소유 파일, 이번에 수정 완료)

목표 A 표 참고. 4개 미니게임 파일의 `getCharacterAssetId`/`getCharacterTransform`/`getLegacyBackgroundId`
호출 13곳 모두 `await` + 요청 토큰 재확인으로 정리됨.

### 주석/비호출 (11건)

| 파일 | 줄 | 비고 |
|---|---:|---|
| `dev/upload/index.html` | 743, 3575 | 주석 |
| `play/game/index.html` | 479 | 주석 |
| `play/shop/index.html` | 201 | 주석 |
| `dev/state/wardrobeState.js` | 63 | 주석 |
| `dev/dialogueData.js` | 18, 66 | 주석 |
| `dev/data/shopItems.js` | 10, 15, 16 | 주석 — 실제 호출 없음을 확인함(요청된 확인 항목) |
| `dev/assetDb.js` | 642 | 주석 |

`dev/dialogueData.js`, `dev/data/shopItems.js` 모두 문서 요청대로 실제 호출이 없는지 재확인했고,
정말로 주석뿐이었다.

## 목표 C — 전체 통합 리스크 점검

### Promise 미처리 (unhandled rejection 가능 지점)

- `dev/upload/index.html`의 setter 22곳(위 표) 전부 — async 전환 시 `.catch()` 없이 fire-and-forget이
  되면 저장 실패가 조용히 사라지고 UI는 성공한 것처럼 보일 수 있음(라이브 체크리스트 4번 "실패한
  setter가 성공 토스트를 만들지 않음"과 직결).
- `dev/state/wardrobeState.js:70`의 `setSelectedOutfit` — 동기 wrapper(`equipOutfit`) 안에서
  호출되므로 async 전환 시 반드시 `.catch()`로 감싸거나 wrapper 자체를 async화해야 함. 현재는 실패해도
  `equipOutfit`이 `true`를 반환해 호출부(옷장/상점 UI)가 성공으로 오인함.
- `play/game/index.html:490`의 `applyBgm()` — 최상위에서 `applyBgm();`으로 fire-and-forget 호출됨
  (1558행). 지금은 함수가 자체적으로 try/catch 없이 `AssetDB.getSounds()`만 try 블록에 있고
  `getSceneBgmId`는 밖에 있음 — async 전환 시 이 한 줄만 reject해도 미처리 rejection이 됨.

### 경쟁 상태

- **캐릭터 요청**: `play/game/index.html`의 `applyCharacterForLine`은 `charRequestToken` 가드가 이미
  존재하지만, 위에 적었듯 542/544/593/596/605행의 await 자체가 빠져 있어 지금 그대로 async 전환하면
  토큰 가드가 무력화된다(가드 로직은 살아있지만 값이 Promise가 되어버림). 이 패턴은 작업 06이 4개
  미니게임에 적용한 패턴과 동일하므로, 해당 파일 담당 작업이 그대로 참고할 수 있다.
- **장소 배경 요청**: `dev/upload/index.html`의 미리보기/활성 판정(1665, 3513, 3515, 3516, 3941행)은
  전부 `===` 동기 비교로 되어 있어, async 전환 시 항상 `false`가 되어 "현재 적용된 이미지" 하이라이트가
  전부 사라지는 회귀가 예상됨 — 단순 await 누락보다 우선순위가 높은 버그.
- **BGM 요청**: `play/game/index.html`은 씬 전환이 전체 페이지 네비게이션(`location.href`)이라 페이지
  내 재실행 경쟁은 없음 — `applyBgm()`은 `init()` IIFE에서 1회만 호출됨. 다만 await 누락 자체는 여전히
  버그(위 참고).
- **미니게임 재시작 요청**: 작업 06 소유 4개 파일은 전부 `location.reload()` 경로만 존재해 페이지 내
  경쟁은 실질적으로 없음. `play/minigame-phone-search`의 장소 이동(`switchArea`)만 페이지 내 비동기
  전환이라 이번에 `areaLoadToken` 가드를 추가함.
- **의상 미리보기 요청**: `play/shop/index.html`(191/195/205/208행)이 담당 — await 누락 확인, 자체
  토큰 가드 존재 여부는 파일 소유 작업이 확인 필요(이 세션은 파일을 읽기만 함).

### 마이그레이션 시나리오 점검

`dev/assetDb.js`가 현재 전부 localStorage 동기 구현이라(전제 조건 참고) 서버-로컬 병합/충돌
시나리오(§120-127) 자체가 아직 이 저장소에 해당하지 않는다. 작업 01의 서버 이전 코드가 병합되면 이
섹션을 다시 채워야 한다.

### 참조 제거

`dev/upload/index.html:3566-3567`(`removeAllBackgroundAssetRefs`/`removeAllCharacterAssetRefs`)과
`3993`(`removeAllSceneBgmRefs`)는 로컬 `localStorage` 맵에서는 즉시 참조를 지운다(현재 동기 구현
기준). 서버 맵 쪽 제거는 assetDb.js가 아직 로컬 전용이라 검증 대상이 아니다 — async 전환 후 재검증
필요.

## 라이브 검증 체크리스트

**미실행.** 이 세션은 샌드박스 환경이라 Supabase 실접속이 불가능하고(작업 지시서에 명시된 제약과
동일), 무엇보다 서버 비동기 마이그레이션(작업 01~05)이 이 저장소의 `main`에 아직 반영되지 않아
`/dev/upload` 진입 시 "마이그레이션 완료 배너"조차 존재하지 않는다. 배포 가능한 테스트 환경에서, 그리고
작업 01~05가 병합된 이후 이 체크리스트를 재실행해야 한다.

- 환경: 미실행 (샌드박스, Supabase 접속 불가 + 서버 마이그레이션 코드 미병합)
- 성공: N/A
- 실패: N/A
- 재현 절차: N/A — 아래 원본 체크리스트를 그대로 남겨 다음 실행자가 사용하도록 한다.

### 1. 최초 마이그레이션
- [ ] 기기 A에서 `/dev/upload` 진입.
- [ ] 마이그레이션 완료 배너 확인.
- [ ] 6개 blob 중 로컬 값이 있던 맵이 생성됨.
- [ ] 기존 배정이 기기 A에서 사라지지 않음.
- [ ] 페이지 재로드 시 중복/덮어쓰기 없음.

### 2. 새 기기 동기화
- [ ] 기기 B에서 `/play/game` 진입.
- [ ] 캐릭터 초상화가 placeholder가 아닌 서버 배정으로 표시됨.
- [ ] 의상과 transform이 일치함.
- [ ] 장소 배경과 BGM이 서버 배정으로 적용됨.
- [ ] 4개 미니게임의 레거시 배경/캐릭터가 표시됨.

### 3. 양방향 변경
- [ ] 기기 B에서 `/dev/upload`로 배정을 변경.
- [ ] 기기 A 새로고침 후 변경이 보임.
- [ ] unrelated 엔트리가 사라지지 않음.

### 4. 실패 처리
- [ ] 네트워크를 차단한 상태에서 기존 localStorage 캐시가 표시됨.
- [ ] 저장 실패 시 오류 배너가 표시됨.
- [ ] 실패한 setter가 성공 토스트를 만들지 않음.
- [ ] UI 버튼이 영구 잠기지 않음.

### 5. 경쟁 상태
- [ ] 대사를 빠르게 넘겨도 최신 캐릭터 유지.
- [ ] 장소를 빠르게 이동해도 최신 배경 유지. — `minigame-phone-search`의 `switchArea`는 이번에
      `areaLoadToken`으로 방어했으므로 실제 배포 환경에서 우선 검증 권장.
- [ ] 씬을 빠르게 전환해도 최신 BGM 유지.
- [ ] 미니게임 재시작 시 이전 세션 응답이 덮지 않음.

## 완료 조건

- [x] 4개 미니게임 관련 호출 전수 조사
- [x] getter await 적용 및 초기화 전파 (초기화 함수 자체는 이미 async/`.then()` 처리 중이라 추가
      전파는 불필요했음)
- [x] 캐릭터·배경 stale response 방어 (요청 토큰 재확인 강화 + `minigame-phone-search`
      `areaLoadToken` 신설)
- [x] 저장소 전역 호출 감사 실행
- [x] 타 작업 소유 파일의 누락은 보고서로 전달 (위 "수정 필요" 표)
- [x] 주석뿐인 파일 확인 (`dev/dialogueData.js`, `dev/data/shopItems.js`)
- [x] 라이브 검증표 작성 (실행은 샌드박스 제약으로 보류, 절차만 남김)
- [ ] 최종 병합 후 감사 명령 재실행 — 작업 01~05 병합 후 이 문서의 목표 B 표 명령을 재실행하고,
      전제 조건 섹션(현재 assetDb.js가 동기라는 사실)이 여전히 유효한지부터 다시 확인할 것.
