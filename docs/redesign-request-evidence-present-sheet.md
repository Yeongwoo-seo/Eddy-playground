# 개편 의뢰서 — 증거 제시 시트 (`dev/game/index.html`)

> 발신인: (작성자 본인)
> 대상: 대화 중 "🔍 증거 제시하기" 눌렀을 때 뜨는 증거 목록 바텀시트 (`dev/game/index.html` `#evidenceSheetOverlay` / `renderEvidenceSheet()`)
> 계기: 스크린샷 — 코드(E-MV2 등) + 제목만 나열된 카드가 스크롤로 쭉 이어져서 "보기 어렵다"
> 목적: 무엇을 어떻게 바꿀지 검토하고 권장안을 정하기 위한 의뢰서. 승인되면 그에 맞춰 `dev/game/index.html`(HTML/CSS/`renderEvidenceSheet`)을 수정한다.

---

## 1. 현재 구현

```js
// dev/game/index.html:903-920
function renderEvidenceSheet() {
  const items = CaseFileState.getEvidence();       // 전체 증거, 필터 없음
  el.evidenceSheetList.innerHTML = '';
  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'evidence-card';
    btn.innerHTML = `<div class="ec-code">${item.code}</div><div class="ec-title">${item.title}</div>`;
    ...
  });
}
```

- **필터/분류 없음.** `CaseFileState.getEvidence()`가 반환하는 순서(발견한 순서) 그대로 나열.
- **카드 정보량이 코드 + 제목 두 줄뿐.** `evidence` 아이템에는 실제로 `category`, `description`, `discoveredLocationText`, `status`(new/reviewed) 필드가 이미 있는데(`dev/caseFileState.js:68-79`) 이 시트는 그중 코드/제목만 쓴다.
- **스크롤이 유일한 탐색 수단.** `max-height:44vh; overflow-y:auto`(`dev/game/index.html:103`) 안에 전부 욱여넣는다.
- **규모**: `dialogueData.js` + `interactionDefs.js` 기준 `addEvidence` 호출이 **50건**(주차가 늘수록 계속 증가). 한 캐릭터에게 제시 가능한 증거가 아니라 **확보한 증거 전체**가 한 시트에 다 뜨므로, 게임 후반으로 갈수록 스크롤이 길어지기만 한다.

### 참고 — 이미 더 나은 패턴이 두 군데 있다

같은 저장소 안에 이미 이 문제를 어느 정도 풀어둔 화면이 두 개 있어서, 이번 개편은 그 패턴을 가져오면 된다:

1. **`dev/caseMenu.js` CASE FILE 메뉴 증거 탭** (`renderEvidenceTabBody`, `dev/caseMenu.js:239-278`) — 종류별 필터 칩(전체/물증/사진·영상/진술/기록, 각 개수 표시) + 칩을 하나 고르면 그 종류만 평평하게, "전체"면 종류별 섹션 라벨로 묶어서 보여줌. 필터 선택 상태(`ctx.evidenceFilter`)는 탭을 벗어나도 유지됨.
2. **`dev/explore/index.html` 탐색허브의 "증거 제시" 시트** (`openEvidenceSheet`, `dev/explore/index.html:767-789`, 오늘 커밋 `7ee0f26`로 개선됨) — `EVIDENCE_CATEGORY_ORDER`/`evidenceCategoryLabel`을 재사용해 종류별 섹션 라벨로 묶음.

문제는 **정작 스크린샷이 찍힌 화면(`dev/game/index.html`의 `renderEvidenceSheet`)만 이 개선을 안 받았다**는 것 — 대화 중 증거를 제시하는, 실제로 제일 자주 쓰이는 그 화면이 옛날 버전 그대로 남아 있다. 그래서 이번 개편은 **1)** 이 시트를 캐치업시키는 것과 **2)** 세 군데 UI(케이스 파일 탭 / 탐색허브 시트 / 대화 중 시트)가 다시 벌어지지 않게 로직을 하나로 합치는 것, 두 갈래로 볼 수 있다.

---

## 2. 요청 사항 (원 요청 3가지 정리)

### (1) 필터 — 종류별

- 기존 카테고리 체계를 그대로 쓴다: `EVIDENCE_CATEGORY_ORDER = ['physical', 'photo', 'testimony', 'record', 'etc']` (`dev/caseMenu.js:658`), 라벨은 `evidenceCategoryLabel` — 물증 / 사진·영상 / 진술 / 기록 / 기타.
- 결정할 것: 케이스 파일 탭처럼 **필터 칩(전체 + 종류별, 개수 배지)** 을 쓸지, 탐색허브 시트처럼 **섹션 라벨로 묶기만** 할지, 아니면 둘 다(평소엔 섹션 구분, 필요하면 칩으로 좁히기) 할지.
- 대화 중 시트는 캐릭터별로 "제시 가능한 결과가 정해진" 증거를 고르는 맥락이라, 케이스 파일 탭만큼 증거 수가 많지 않을 수도 있음 — 다만 후반 주차 기준 전체 확보량(50개 전후)을 감안하면 필터 없이는 이미 스크린샷 수준으로 못 보게 됨.

### (2) 아이템화

- "아이템화"를 두 가지로 해석할 수 있어 구분이 필요:
  - **(a) 카드에 정보량을 더 실어서 각 증거가 낱개 아이템처럼 식별되게 한다** — 이미 데이터에 있는 `category`(아이콘/색 태그), `description`(한 줄 요약), `status`(new 배지) 등을 카드에 노출. 현재는 코드+제목만 있어서 코드(E-MV2 같은 내부 식별자)가 시각적으로 제일 크게 강조돼 있는데, 정작 플레이어에게 의미 있는 건 제목/설명 쪽.
  - **(b) 그리드형 "아이템 인벤토리" 느낌으로 레이아웃 자체를 바꾼다** — 세로 리스트 대신 카드형 그리드(썸네일/아이콘 + 짧은 라벨), 탭하면 상세(설명/발견 장소)가 뜨는 2단 구조. 이 경우 `dev/inventory`류 UI(있다면) 참고 가능한지 확인 필요 — 현재 저장소에 증거용 이미지/썸네일 에셋은 없어 보이므로(각 아이템에 `image` 필드 없음), 아이콘은 카테고리 단위 심볼(예: 물증=🧾, 사진=📷, 진술=💬, 기록=📄) 정도가 현실적인 시작점.
- 결정할 것: (a)만 할지 (b)까지 갈지, (b)면 카테고리 아이콘 세트를 새로 정의해야 함(현재 저장소에 선례 없음).

### (3) 그외

원 요청에 구체 항목이 없어서, 위 조사 중 같이 눈에 띈 것들을 후보로 얹는다 — 각각 채택 여부만 결정하면 됨:

- **new 배지 미반영**: `evidence.status === 'new'`는 케이스 파일 탭(`cm-new-dot`, `dev/caseMenu.js:272`)엔 표시되는데 이 시트엔 없음. 방금 얻은 증거를 강조하면 탐색 흐름과도 자연스럽게 이어짐.
- **현재 상대에게 의미 없는 증거까지 다 나열됨**: `presentEvidenceRules`(`dev/data/interactionDefs.js`)에 해당 캐릭터·해당 phase 룰이 없으면 `defaultPresentReaction`(정형화된 "그건 여기서 할 얘기가 아닌 것 같은데" 류 반응)으로 처리되는 것으로 보임 — 즉 안 맞는 증거를 눌러도 페널티는 없지만, 애초에 그 목록이 안 맞는 항목까지 다 섞여 있어 탐색 비용만 큼. 룰이 있는 항목을 상단/강조로 올릴지, 최소한 필터에 "이 사람에게 유효" 옵션을 둘지 검토 가치 있음.
- **세 화면(케이스 파일 탭 / 탐색허브 시트 / 대화 중 시트) 로직 통합**: 지금처럼 각자 `EVIDENCE_CATEGORY_ORDER` 기반 필터/그룹핑을 따로 구현하면 다음에 또 하나만 뒤처지는 문제가 재발함. 공용 렌더 함수(예: `renderEvidenceListHtml(items, {mode})`)로 뽑아 세 곳에서 공유하는 것을 제안.
- **정렬 기준**: 지금은 발견 순서(추가된 순서) 그대로. 카테고리 필터가 생기면 카테고리 내부 정렬도 필요 — 발견 순 유지 vs 코드순 vs "new 먼저".

---

## 3. 검토 결과 — 권장안

각 결정 사항에 대해 근거를 붙여 하나를 권장한다. 표의 "권장"이 기본안이고, 나머지는 채택하지 않는 이유를 같이 적었다.

| # | 결정 사항 | 선택지 | 권장 | 이유 |
|---|---|---|---|---|
| 1 | 필터 UI | 칩 / 섹션 라벨만 / 둘 다 | **둘 다 (칩 + 섹션 그룹핑, 케이스 파일 탭 방식 그대로 이식)** | 섹션 라벨만으론 "묶여는 있지만 여전히 다 스크롤"이라 50개 규모에서 스크린샷 문제(보기 어려움)가 근본적으로 안 풀림. 칩으로 좁히는 게 실질적 해결책. 이미 `dev/caseMenu.js`에 검증된 구현이 있어 새로 설계할 필요 없이 그대로 옮기면 됨 — 리스크·비용이 제일 낮은 선택. |
| 2 | 아이템화 범위 | (a) 정보량 보강 / (b) 그리드+아이콘 | **(a)만 먼저, (b)는 보류** | (a)는 이미 데이터에 있는 `description`/`status`/`category`를 노출하기만 하면 돼서 신규 에셋·디자인 결정이 필요 없고, "코드만 크게 보이고 정작 내용은 안 보인다"는 스크린샷의 핵심 불만을 바로 해결함. (b)는 썸네일/아이콘 에셋이 저장소에 전례가 없어 디자인 결정(아이콘 세트, 그리드 열 수, 상세 2단 구조)이 먼저 필요한 별도 프로젝트에 가까움 — 지금 요청(보기 어려움 해소)엔 과함. |
| 3 | (b)용 카테고리 아이콘 세트 | — | **2번에서 (a)만 채택하므로 지금은 불필요** | (a) 안에서도 카테고리를 "물증/사진·영상/진술/기록" 텍스트 라벨(칩에 이미 존재)로 충분히 구분됨. 아이콘은 (b)를 나중에 하게 될 때 다시 논의. |
| 4 | new 배지 | 추가 / 미추가 | **추가** | 케이스 파일 탭에 이미 같은 패턴(`cm-new-dot`)이 있어 구현 비용이 거의 0. 방금 얻은 증거가 묻혀 보이지 않는 것도 "보기 어렵다"는 원 불만의 일부. |
| 5 | 상대에게 유효한 증거만 강조/필터 | 강조 / 하드 필터 / 안 함 | **안 함 (보류)** | `presentEvidenceRules`는 correct/partial뿐 아니라 wrong/blocked 결과에도 개별 반응 텍스트를 달아두는 구조라, "이 캐릭터에게 안 맞는" 증거를 걸러내면 그 반응 텍스트(작성된 콘텐츠)를 플레이어가 발견할 기회를 없애는 셈. 지금 범위(필터/아이템화)를 벗어나는 별도 결정이라 이번 개편에서는 제외하고 후속 논의로 남겨둔다. |
| 6 | 세 화면 렌더 로직 통합 | 공용 함수 / 각자 유지 | **공용 함수로 통합** | 이번에 `dev/game/index.html`만 따로 다시 만들면, 다음에 카테고리 라벨이나 필터 동작을 바꿀 때 세 곳 중 하나가 또 뒤처지는 지금과 같은 문제가 재발함. `renderEvidenceListHtml(items, { mode: 'chips-and-sections' \| 'sections-only', filter })` 같은 공용 함수 하나를 만들어 세 화면이 같이 쓰는 걸 권장 — 리팩터 비용은 있지만 이번 개편이 "손보는 김에" 하기 가장 좋은 시점. |
| 7 | 정렬 기준 | 발견순 / 코드순 / new 우선 | **카테고리 내부에서 new 우선, 그다음 발견순** | new 배지(4번)를 추가하는 것과 짝을 이룸 — 방금 얻은 증거가 배지만 있고 목록 맨 아래 묻혀 있으면 효과가 반감됨. 코드순은 플레이어에게 의미 없는 내부 식별자 기준이라 제외. |

### 요약

**우선 적용 권장 범위**: 1(칩+섹션) · 2(a) · 4(new 배지) · 6(공용 함수) · 7(new 우선 정렬) — 전부 기존 데이터 필드와 `dev/caseMenu.js`의 검증된 패턴만으로 구현 가능해 리스크가 낮다.
**보류 권장**: 2(b) 그리드/아이콘, 5(캐릭터별 유효성 강조/필터) — 둘 다 이번 "보기 어렵다"는 불만의 해결에 필수는 아니고, 각각 별도 디자인 결정(아이콘 세트 / 콘텐츠 노출 정책)이 선행돼야 해서 후속 의뢰로 분리하는 걸 제안.

---

## 4. 참고

- 스크린샷 대상 화면: `dev/game/index.html:893-920`(`renderEvidenceSheet`), CSS `dev/game/index.html:103-108`(`.evidence-sheet-list`/`.evidence-card`/`.ec-code`/`.ec-title`)
- 증거 데이터 모델: `dev/caseFileState.js:66-86`(`addEvidence`/`getEvidence`/`markEvidenceReviewed`) — 필드: `id`, `code`, `title`, `category`, `description`, `discoveredLocationText`, `status`, `relatedQuestionIds`, `tags`, `discoveredAt`
- 카테고리 체계: `dev/caseMenu.js:658-659`(`EVIDENCE_CATEGORY_ORDER`, `evidenceCategoryLabel`)
- 이미 개선된 두 참고 화면:
  - `dev/caseMenu.js:239-278`(`renderEvidenceTabBody`, `evidenceRow`) — 필터 칩 + 섹션 그룹핑
  - `dev/explore/index.html:767-789`(`openEvidenceSheet`) — 섹션 그룹핑 (커밋 `7ee0f26`)
- 증거 제시 결과 판정 룰: `dev/data/interactionDefs.js`(`presentEvidenceRules`/`defaultPresentReaction`)
