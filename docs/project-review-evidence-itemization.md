# 프로젝트 검토서 — 증거 전체 아이템화 (그리드 + 아이콘)

> 발신인: (작성자 본인)
> 대상: 모든 증거(현재 확보 가능한 전체, 계속 늘어남)를 그리드 + 아이콘 방식으로 아이템화
> 전제: 이전 의뢰서(`redesign-request-evidence-present-sheet.md`)에서 그리드+아이콘(2-b안)으로 방향 확정
> 목적: "증거를 다 뜯어고쳐야 하나 / 아이템을 DB에 업로드해야 하나"는 질문에 대해, 실제로 뭘 얼마나 건드려야 하는지 코드 기준으로 검토하고 진행 계획을 제안한다.

---

## 1. 결론부터

**증거를 정의하는 코드(50곳 인라인 `addEvidence` 호출)는 손댈 필요 없다.** 아이콘/이미지는 원래 코드에 인라인으로 넣을 수 있는 데이터가 아니라(이미지 바이너리) 무조건 "id → 이미지"를 잇는 별도 테이블이 필요한데, 이 프로젝트엔 이미 그 패턴(Storage에 JSON blob 하나 + `AssetDB.addAsset`)이 배경/인물 초상화/사운드/장소에 4~5번 반복해서 쓰이고 있다. 증거도 그 목록에 하나 더 얹으면 된다 — 즉 "뜯어고치는" 작업이 아니라 "새 카탈로그 + 새 업로드 탭 + 기존 3개 화면 렌더 교체" 작업이다.

DB 업로드도 이미 하고 있는 일이다. `dev/assetDb.js`가 이미 Supabase Storage(`dev-assets` 버킷) + Postgres(`dev_assets` 테이블)로 배경/인물 이미지를 다 그렇게 관리하고 있어서(§4 참고), 새 Supabase 프로젝트나 새 테이블이 필요 없다 — 같은 버킷에 `evidence/` 경로 하나, 같은 admin 페이지(`dev/upload`)에 탭 하나 추가하는 수준.

아래는 왜 그렇게 판단했는지와, 실제로 뭘 몇 단계로 하면 되는지다.

---

## 2. 지금 증거가 어떻게 정의돼 있는지

```js
// dev/caseFileState.js:31 주석 — 이미 문서화된 설계 원칙
// "addEvidence/addQuestion take their full content inline rather than
//  pointing at a second static catalog"
```

- `addEvidence({ id, code, category, title, description, discoveredLocationText, ... })` 호출이 **`dialogueData.js`에 49건 + `interactionDefs.js`에 1건, 총 50건**, 전부 각 씬/상호작용 안에 내용이 그대로 박혀 있음. 그 외에 `minigame-item-scan`, `minigame-exhibition-search`, `minigame-photo-zoom`, `minigame-timeline` 4개 미니게임도 자체적으로 `CaseFileState.addEvidence(...)`를 호출.
- 즉 "증거 전체 목록"을 한 파일에서 조회할 방법이 지금은 없다 — 코드 전체를 훑어야 나옴.
- 카테고리(물증/사진·영상/진술/기록/기타)는 이미 각 항목에 박혀 있고(`category: 'photo'` 등), 카탈로그 라벨/순서 정의는 `dev/caseMenu.js:658-659`(`EVIDENCE_CATEGORY_ORDER`/`evidenceCategoryLabel`) 한 곳에 이미 모여 있음. 아이콘도 이 파일에 카테고리 단위로는 쉽게 얹을 수 있음.
- **이미지/아이콘 필드는 없음.** `evidence` 아이템 스키마(`dev/caseFileState.js:68-79`)에 `image`/`icon` 필드 자체가 없다.

---

## 3. "다 뜯어고쳐야 하나?" — 두 가지 길, 그리고 왜 (B)를 추천하는가

### (A) 50곳을 전부 손대서 이미지 필드를 인라인으로 추가
`addEvidence({ ..., imageAssetId: '...' })`처럼 호출부마다 채워 넣는 방식. 문제:
- 50곳(계속 늘어남 — 주차가 추가될 때마다 증가)을 다 찾아 고쳐야 해서 실수/누락 위험이 큼.
- 이미지 자체는 여전히 Storage에 올려야 하니, 결국 "이미지를 올리고 그 id를 코드에 손으로 붙여넣는" 2단계 작업이 되어 제일 번거로운 방식.
- 아이콘을 하나 바꾸려 해도 코드 배포가 필요함(지금 배경/인물/사운드는 전부 코드 배포 없이 `/dev/upload`에서 바로 바뀜 — 이 프로젝트의 기존 원칙과 어긋남).

### (B) 증거 id → 아이콘/이미지 매핑을 별도 카탈로그(Storage JSON blob)로 관리 — 추천
이 저장소에 이미 4번 반복된 패턴 그대로:

| 이미 있는 카탈로그 | 파일/경로 | 구조 |
|---|---|---|
| 장소(배경) | `AssetDB.getLocations/setLocation`, `locations/catalog.json` | `{ [locationId]: {...} }` |
| 사운드 | `AssetDB.getSounds/setSound`, `sounds/catalog.json` | `{ [soundId]: {...} }` |
| 지도 핀 | `AssetDB.getMapPins/setMapPin`, `map-pins/positions.json` | `{ [locationId]: {x,y} }` |
| 룸서치 미니게임 아이템 | `AssetDB.getItems/setItem`, `items/<evidenceId>.json` | `{ [itemId]: {name, icon, imageAssetId, ...} }` |

증거 아이콘도 여기 하나 추가하면 됨: `AssetDB.getEvidenceIcons/setEvidenceIcon`, `evidence-icons/catalog.json` → `{ [evidenceId]: { imageAssetId, icon } }` (`icon`은 이미지 없을 때 쓰는 이모지 폴백, 룸서치 아이템 카탈로그의 `icon` 필드와 동일한 관례).

이러면:
- **기존 50곳 코드는 그대로.** 런타임에 증거를 그릴 때 `evidenceIcons[item.id]`로 조회해서 이미지/아이콘을 붙이기만 하면 됨.
- **이미지 교체가 코드 배포 없이 `/dev/upload`에서 바로 됨** — 지금 배경/인물/사운드 바꾸는 것과 똑같은 워크플로.
- 새 주차가 추가돼서 증거가 늘어나도 카탈로그에 새 id 하나 얹으면 그만, 기존 항목은 안 건드림.

**따라서 "증거를 다 뜯어고쳐야 하나"의 답은 "아니요"** — 뜯어고쳐야 하는 건 증거 *정의* 코드가 아니라, 그 위에 얹을 아이콘 *데이터*(→ 이건 코드가 아니라 콘텐츠 작업)와, 그걸 그려주는 화면 3곳(§5)이다.

---

## 4. DB 업로드는 실제로 어떻게 되나

`dev/assetDb.js`(§415-459 `getItems`/`setItem` 참고 구조 그대로 복제)가 이미 하는 일:
1. `AssetDB.addAsset({ type: 'evidence', name, blob, ... })` → Supabase Storage `dev-assets` 버킷의 `evidence/<id>.<ext>` 경로에 이미지 업로드, `dev_assets` 테이블에 메타(행 하나) insert. (`dev/assetDb.js:129-168` `addAsset`을 그대로 재사용, `type`만 새 값)
2. 업로드된 이미지의 `id`를 `evidence-icons/catalog.json`의 해당 증거 항목 `imageAssetId`에 저장 (`setEvidenceIcon`, `setItem`과 동일 패턴 — `dev/assetDb.js:439-459` 복제).
3. 화면에서는 `AssetDB.getAssetsByIds([...])`(이미 배치 조회 지원, `dev/assetDb.js:200-213`)로 여러 증거의 이미지를 한 번에 불러와 그리드에 뿌림 — 이것도 이미 있는 함수라 새로 안 만들어도 됨.

**새 Supabase 프로젝트/테이블/버킷이 필요 없다.** 기존 `dev-assets` 버킷·`dev_assets` 테이블에 `type: 'evidence'`인 행이 추가되는 것뿐 — 배경(`type:'background'`)/인물(`type:'character'`)과 나란히.

---

## 5. 그럼 실제로 뭘 만들어야 하나 — 단계별

1. **증거 id 전수 목록 확보 (1회성)** — 지금은 코드 전체를 훑어야 목록이 나오므로, `dialogueData.js`/`interactionDefs.js`를 파싱해 `addEvidence`의 `id`/`code`/`title`/`category`만 뽑아내는 짧은 스크립트를 한 번 돌려 정적 리스트를 만든다. 이 저장소에 이미 같은 성격의 선례가 있음 — 룸서치 미니게임의 `ROOM_SEARCH_CORE_ITEMS`(`dialogueData.js`, `dev/upload/index.html:3457-3459`에서 참조)가 "코드에 흩어진 진짜 정의는 그대로 두고, 업로드 패널이 쓸 목록만 별도로 상수화"한 정확히 같은 해법. 새 주차가 생겨 증거가 늘면 이 리스트만 재생성.
2. **`AssetDB`에 `getEvidenceIcons`/`setEvidenceIcon` 추가** — §3 표의 기존 함수(`getLocations`/`setLocation` 등)와 완전히 같은 모양이라 복붙 후 경로/키 이름만 바꾸는 수준.
3. **`dev/upload`에 "증거 아이콘" 탭 추가** — 이미 있는 "아이템" 탭(`renderItemsTab`, `dev/upload/index.html:3517`)과 UI 골격이 거의 동일(목록에서 하나 고르면 이미지 업로드/미리보기 폼) — 그 탭을 참고해 새로 하나 더 만들면 됨.
4. **카테고리 기본 아이콘 확정** — 개별 이미지가 아직 없는 증거는 카테고리 단위 폴백(물증/사진·영상/진술/기록/기타 5종)으로 보여야 그리드가 빈 칸 없이 나옴. 이 5개 심볼만 먼저 정하면 나머지 50개는 나중에 하나씩 채워도 화면은 바로 동작.
5. **그리드+아이콘 렌더를 공용 함수로 구현, 3개 화면에 적용** — 이전 의뢰서(§3-6)에서 이미 "케이스 파일 탭/탐색허브 시트/대화 중 시트 로직을 공용 함수로 합치자"고 제안했던 것과 합류. 이번에 그리드로 갈아엎는 김에 세 화면을 진짜로 하나의 함수로 통합하는 게 가장 효율적인 타이밍.
6. **폴백 상태로 먼저 배포 → 아이콘은 이후 하나씩 업로드** — 개발(그리드 UI, 카탈로그 배선)과 콘텐츠(개별 아이콘 50장 제작)를 분리해서, 아이콘이 다 안 채워져도 기능은 먼저 굴러가게 한다.

---

## 6. 결정이 필요한 사항

| # | 항목 | 권장 | 이유 |
|---|---|---|---|
| 1 | 증거 정의 코드(50곳) 리팩터 여부 | **안 함** | §3 참고 — 이미지 카탈로그를 옆에 두면 기존 코드를 안 건드리고도 아이템화 가능 |
| 2 | 새 Supabase 리소스 필요 여부 | **불필요, 기존 `dev-assets` 재사용** | §4 참고 — `type:'evidence'` 행만 추가되는 구조 |
| 3 | 아이콘 없는 증거의 표시 | **카테고리 기본 아이콘 폴백** | 50개(계속 증가) 이미지를 다 준비할 때까지 기능 출시를 막지 않기 위함 |
| 4 | 개별 이미지 vs 카테고리 아이콘만 | (미정 — 콘텐츠 리소스에 달림) | 50개+ 각각 다른 그림을 그릴지, 카테고리 5종 + 코드/이니셜 정도로 갈지는 디자인/제작 리소스 문제라 이 문서 범위 밖. 다만 위 폴백 구조 덕분에 나중에 개별 이미지로 하나씩 업그레이드하는 것도 가능하니, 지금 전부 결정하지 않고 카테고리 아이콘으로 먼저 가는 것을 권장. |
| 5 | 세 화면(케이스 파일 탭/탐색허브 시트/대화 시트) 통합 시점 | **이번 그리드 개편과 동시에** | 어차피 세 곳 다 새로 그려야 하므로 지금이 공용 함수로 합칠 최적 타이밍 |

---

## 7. 참고

- 증거 정의 인라인 호출: `dev/dialogueData.js`(49건), `dev/data/interactionDefs.js`(1건), `dev/minigame-item-scan`/`minigame-exhibition-search`/`minigame-photo-zoom`/`minigame-timeline` (자체 `addEvidence` 호출)
- 증거 데이터 모델: `dev/caseFileState.js:68-86`
- 카테고리 체계: `dev/caseMenu.js:658-659`
- 기존 카탈로그 패턴(그대로 복제할 대상): `dev/assetDb.js:640-683`(`getLocations`/`setLocation`), `:565-634`(`getSounds`/`setSound`), `:415-459`(`getItems`/`setItem` — 룸서치 미니게임용, 구조상 제일 가까운 선례)
- 이미지 업로드/조회: `dev/assetDb.js:129-168`(`addAsset`), `:200-213`(`getAssetsByIds`, 배치 조회)
- "정의는 코드에 두고 목록만 상수화" 선례: `ROOM_SEARCH_CORE_ITEMS`(`dialogueData.js`), 사용처 `dev/upload/index.html:3457-3468`(`evidenceCoreCatalog`/`evidenceItemCatalog`)
- 업로드 어드민 탭 골격 참고: `dev/upload/index.html:3517-3580`(`renderItemsTab`/`openItemEditor`) — "아이템" 탭, 구조가 거의 그대로 재사용 가능
- 이전 의뢰서(그리드+아이콘 방향 확정, 3화면 통합 제안 포함): `docs/redesign-request-evidence-present-sheet.md`
