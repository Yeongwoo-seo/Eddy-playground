# DevGameState async 호출 감사 결과 (작업 06)

> **업데이트**: 최초 작성 시점엔 `dev/assetDb.js`가 아직 동기(localStorage) 구현이었으나, 이후
> 작업 01~05 커밋(`c76dd7f`, `28772cd`, `425d9fc`, `4636cbe` 등)이 병합되며 실제로 서버 비동기
> API로 전환되었다. 아래는 병합 후 재실행한 감사 결과다 — "완료 조건"의 마지막 항목("최종 병합 후
> 감사 명령 재실행")을 이 업데이트로 처리한다.

## 현재 상태

`dev/assetDb.js`의 `DevGameState.getCharacterAssetId` / `getCharacterAssetIdForOutfit` /
`setCharacterAssetId` / `getSelectedOutfit` / `setSelectedOutfit` / `getCharacterTransform` /
`setCharacterTransform` / `getSceneBgmId` / `setSceneBgmId` / `getLocationAssetId` /
`setLocationAssetId` / `getLegacyBackgroundId` / `setLegacyBackgroundId` /
`removeAllCharacterAssetRefs` / `removeAllSceneBgmRefs` / `removeAllBackgroundAssetRefs`는 이제
전부 실제 `async` 함수(서버 Storage blob 기반)다.

## 요약 (병합 후 재감사)

```bash
rg -n --glob '!node_modules/**' --glob '!dist/**' \
  "DevGameState\.(getCharacterAssetId|getCharacterAssetIdForOutfit|setCharacterAssetId|getSelectedOutfit|setSelectedOutfit|getCharacterTransform|setCharacterTransform|getSceneBgmId|setSceneBgmId|getLocationAssetId|setLocationAssetId|getLegacyBackgroundId|setLegacyBackgroundId|removeAllCharacterAssetRefs|removeAllSceneBgmRefs|removeAllBackgroundAssetRefs)" .
```

- 정상 처리(await/`Promise.all`/`Promise.allSettled`/`safeCall` 래퍼 등): **38**
- 수정 필요(동기 값처럼 사용 — 즉시 실사용 버그): **22** — 전부 `dev/upload/index.html`
- 주석/문서/비호출: **14**
- 총 검색 결과: **75** (`rg` 명령 기준, 저장소 전체 — 이 중 1건은 이 보고서 자체에 적힌 예시 문구라
  실제 코드 호출부는 74건. 최초 감사 시점의 71건에서 병합된 다른 작업 커밋들로 호출부가 늘어남)

작업 06 시작 시점에 "수정 필요"로 보고했던 `play/explore/index.html`(9), `play/game/index.html`(6),
`play/shop/index.html`(4), `play/wardrobe/index.html`(2), `dev/weekPreloader.js`(2),
`dev/state/wardrobeState.js`(1), `dev/minigame-item-scan/index.html`(1) = 25건은 병합된 다른 작업의
커밋에서 모두 해결됨을 확인했다. 이들은 `Promise.resolve(...).catch()`, 자체 정의한
`safeCall(fn)` 래퍼(`play/shop/index.html:180`, `play/wardrobe/index.html:96`,
`dev/minigame-item-scan/index.html:324`에 각각 중복 정의), `Promise.all`/`Promise.allSettled` 등
서로 다른 관용구를 쓰지만 전부 올바르게 await되어 있다.

## 목표 A — 4개 미니게임 비동기화 (완료, 실제 async API로 재검증됨)

작업 06 소유 파일 4개에서 아래 지점을 수정했다 — `dev/assetDb.js`가 실제 `async`로 바뀐 지금 시점
기준으로도 그대로 유효함을 재확인했다(`getCharacterAssetId`/`getCharacterAssetIdForOutfit`은
1951/1970행, `getCharacterTransform`은 2045행, `getLegacyBackgroundId`는 1759행에서 각각 `async`로
선언되어 있음).

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

참고: `photo-zoom`의 `loadPhotoBackground`/`loadPhotoHotspots`(`getBackgroundId`/`getRoomHotspots`
사용)는 이미 `await` + `activePhotoIdx` 재확인으로 stale-response를 올바르게 방어하고 있어 수정하지
않았다. 4개 파일 모두 병합 후 다시 인라인 `<script>`를 추출해 `node --check`로 구문 검증했다(통과).

`MINIGAME_FACE_EXPRESSION`은 버그가 아니라 `dev/dialogueData.js:88`에 정의된 실제 전역 상수(미니게임
전용 얼굴 컷 sentinel)다. `initMap`/보트 시퀀스는 4개 파일 모두 페이지 로드당 1회만 실행되고, 페이지
내 "재시작" 버튼이 없다(재시작은 `location.reload()` 경로).

## 목표 B — 저장소 전역 호출 감사: 남은 수정 필요 (22건, 전부 `dev/upload/index.html`)

`dev/upload/index.html`은 작업 06의 "수정 금지 파일"이라 이 세션에서는 코드를 건드리지 않았다. 이
파일은 다른 병합된 작업들의 손도 아직 타지 않아, 22개 호출 전부 여전히 동기 값처럼 쓰이고 있다.

| 줄 | 호출 | 문제 |
|---:|---|---|
| 1665 | `getLocationAssetId` | await 없음 — 미리보기 렌더 |
| 2146 | `getSelectedOutfit` | await 없음 — 인물 DB 탭 |
| 2164 | `setSelectedOutfit` | await/에러 처리 없음 — 인물 DB 탭 |
| 2283 | `setLocationAssetId` | await 없음 — 업로드 완료 콜백 |
| 2298, 2317, 3547 | `setLegacyBackgroundId` | await 없음 (3곳) — 배경 배정 |
| 2454, 2638, 2822, 3559 | `setCharacterAssetId` | await 없음 (4곳) — 캐릭터 업로드 확정 |
| 3094, 3515 | `getLegacyBackgroundId` | await 없음 (2곳) — 배경 조회 |
| 3513 | `getLocationAssetId` | await 없음, `===` 동기 비교 — async 전환된 지금 항상 `false`가 되어 "현재 적용된 이미지" 하이라이트가 사라지는 실사용 버그 |
| 3516 | `getCharacterAssetIdForOutfit` | 위와 동일한 `===` 비교 버그 |
| 3554 | `setLocationAssetId` | await 없음 — 장소 사진 확정 |
| 3566 | `removeAllBackgroundAssetRefs` | await 없음 (이미 `async function removeAsset` 안) — 삭제/정리 helper |
| 3567 | `removeAllCharacterAssetRefs` | 위와 동일 함수, await 없음 |
| 3941 | `getSceneBgmId` | await 없음, `===` 동기 비교 — BGM 활성 여부 판정이 항상 실패 |
| 3981, 3985 | `setSceneBgmId` | await 없음 (2곳) — BGM 배정/해제 |
| 3993 | `removeAllSceneBgmRefs` | await 없음 (이미 async `deleteSoundEntry` 안) |

이 파일은 `dev/assetDb.js`가 실제 async로 전환된 지금 시점 기준 **가장 우선순위 높은 잔여 작업**이다
— 특히 3513/3515/3516/3941행의 `===` 동기 비교는 단순 await 누락보다 심각해서, "지금 적용된 이미지가
어떤 것인지" 판정이 항상 거짓이 되어 편집 화면의 하이라이트/활성 표시가 전부 사라지는 회귀로 이어진다.

## 목표 C — 전체 통합 리스크 점검 (재확인)

### Promise 미처리

- 위 22곳 전부 — async 전환된 지금, `.catch()` 없는 fire-and-forget setter는 저장 실패가 조용히
  사라지고 UI는 성공한 것처럼 보일 수 있음(라이브 체크리스트 4번과 직결).

### 경쟁 상태

- 병합된 다른 작업들이 `play/game/index.html`(`charRequestToken`), `play/explore/index.html`
  (`Promise.resolve().catch()`), `play/shop`·`play/wardrobe`·`dev/minigame-item-scan`
  (`safeCall`) 각각에 stale-response 방어를 적용해 둔 것을 확인했다. `dev/upload/index.html`만 아직
  이 패턴이 없다 — 특히 캐릭터/장소/씬 선택을 빠르게 전환하며 업로드 화면을 조작하는 경우, 위
  "활성 여부 판정" 버그와 결합해 잘못된 항목이 활성으로 표시될 수 있다.
- 작업 06 소유 4개 미니게임: `play/minigame-phone-search`의 장소 이동(`switchArea`)에 새로 추가한
  `areaLoadToken` 외에는 페이지 내 재실행 경로가 없어(전부 `location.reload()` 또는 1회성 boot) 추가
  경쟁 상태는 발견되지 않았다.

### 마이그레이션 시나리오 / 참조 제거

`dev/upload/index.html`을 건드릴 수 없어 직접 검증하지 못했다. 서버-로컬 병합 규칙(§120-127)과 참조
제거(삭제 후 서버 맵/localStorage 양쪽에서 사라지는지)는 해당 파일을 소유한 작업이 위 표를 반영한
뒤 재검증이 필요하다.

## 라이브 검증 체크리스트

**여전히 미실행.** 샌드박스 환경이라 Supabase 실접속이 불가능하다. `dev/assetDb.js`는 이제 실제
서버 비동기 구현이므로, 이 체크리스트는 배포 가능한 테스트 환경에서 바로 유의미하게 실행할 수 있는
상태다 — 다음 실행자가 그대로 쓸 수 있도록 원본을 남긴다.

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
- [ ] `/dev/upload`에서 캐릭터/장소/BGM 탭을 빠르게 전환해도 활성 항목 하이라이트가 엉키지 않음
      (위 목표 B 표의 `===` 동기 비교 버그가 남아 있는 동안은 실패 예상).

## 완료 조건

- [x] 4개 미니게임 관련 호출 전수 조사
- [x] getter await 적용 및 초기화 전파
- [x] 캐릭터·배경 stale response 방어 (요청 토큰 재확인 강화 + `areaLoadToken` 신설)
- [x] 저장소 전역 호출 감사 실행
- [x] 타 작업 소유 파일의 누락은 보고서로 전달 — 대부분 병합된 다른 작업에서 이미 해결됨을 확인,
      `dev/upload/index.html` 22건만 잔여
- [x] 주석뿐인 파일 확인 (`dev/dialogueData.js`, `dev/data/shopItems.js`)
- [x] 라이브 검증표 작성 (실행은 샌드박스 제약으로 보류, 절차만 남김)
- [x] 최종 병합 후 감사 명령 재실행 — 위 "업데이트" 섹션 및 현재 요약 참고. 단, `dev/upload/index.html`
      자체가 아직 병합되지 않아 그 파일만은 재검증하지 못했다 — 해당 작업 병합 후 한 번 더 재실행 필요.
