/* OPERATION MK DEV — 낚시 미니게임 물고기 종류 카탈로그.
   Static catalog, same idiom as shopItems.js: a plain object keyed by id,
   read by /dev/minigame-fishing (설정 화면의 '물고기 종류' 탭)와 play/index.html
   (낚시 성공 시 어떤 물고기가 잡혔는지 고르는 로직).

   slot은 물고기 아이콘 스프라이트시트에서의 위치(1-based, 왼쪽 위부터 가로로
   센다) — 시트는 10열x7행, 슬롯 = (row-1)*10 + column. 시트를 업로드하면 이
   slot 순서 그대로 아이콘이 배정된다 (마지막 3슬롯 68~70은 빈 칸). */

const fishDefs = {
  '1': { id: 1, name: '브림', grade: '일반', value: 8, catchRate: 0.0, difficulty: 1, row: 1, column: 1, slot: 1 },
  '2': { id: 2, name: '플랫헤드', grade: '일반', value: 12, catchRate: 0.0, difficulty: 2, row: 1, column: 2, slot: 2 },
  '3': { id: 3, name: '휘팅', grade: '일반', value: 8, catchRate: 0.0, difficulty: 1, row: 1, column: 3, slot: 3 },
  '4': { id: 4, name: '숭어', grade: '일반', value: 6, catchRate: 0.0, difficulty: 1, row: 1, column: 4, slot: 4 },
  '5': { id: 5, name: '전갱이', grade: '일반', value: 5, catchRate: 0.0, difficulty: 1, row: 1, column: 5, slot: 5 },
  '6': { id: 6, name: '고등어', grade: '일반', value: 8, catchRate: 0.0, difficulty: 2, row: 1, column: 6, slot: 6 },
  '7': { id: 7, name: '정어리', grade: '일반', value: 3, catchRate: 0.0, difficulty: 1, row: 1, column: 7, slot: 7 },
  '8': { id: 8, name: '청어', grade: '일반', value: 5, catchRate: 0.0, difficulty: 1, row: 1, column: 8, slot: 8 },
  '9': { id: 9, name: '테일러', grade: '일반', value: 20, catchRate: 0.0, difficulty: 2, row: 1, column: 9, slot: 9 },
  '10': { id: 10, name: '호주연어', grade: '일반', value: 18, catchRate: 0.0, difficulty: 2, row: 1, column: 10, slot: 10 },
  '11': { id: 11, name: '레더재킷', grade: '일반', value: 11, catchRate: 0.0, difficulty: 2, row: 2, column: 1, slot: 11 },
  '12': { id: 12, name: '가피시', grade: '일반', value: 6, catchRate: 0.0, difficulty: 2, row: 2, column: 2, slot: 12 },
  '13': { id: 13, name: '놀래기', grade: '일반', value: 12, catchRate: 0.0, difficulty: 2, row: 2, column: 3, slot: 13 },
  '14': { id: 14, name: '복어', grade: '일반', value: 18, catchRate: 0.0, difficulty: 3, row: 2, column: 4, slot: 14 },
  '15': { id: 15, name: '볼락', grade: '일반', value: 18, catchRate: 0.0, difficulty: 3, row: 2, column: 5, slot: 15 },
  '16': { id: 16, name: '쥐치', grade: '일반', value: 10, catchRate: 0.0, difficulty: 2, row: 2, column: 6, slot: 16 },
  '17': { id: 17, name: '농어', grade: '레어', value: 25, catchRate: 0.0, difficulty: 3, row: 2, column: 7, slot: 17 },
  '18': { id: 18, name: '참돔', grade: '레어', value: 35, catchRate: 0.0, difficulty: 4, row: 2, column: 8, slot: 18 },
  '19': { id: 19, name: '감성돔', grade: '레어', value: 28, catchRate: 0.0, difficulty: 3, row: 2, column: 9, slot: 19 },
  '20': { id: 20, name: '광어', grade: '레어', value: 28, catchRate: 0.0, difficulty: 3, row: 2, column: 10, slot: 20 },
  '21': { id: 21, name: '도다리', grade: '레어', value: 18, catchRate: 0.0, difficulty: 2, row: 3, column: 1, slot: 21 },
  '22': { id: 22, name: '가자미', grade: '레어', value: 16, catchRate: 0.0, difficulty: 2, row: 3, column: 2, slot: 22 },
  '23': { id: 23, name: '우럭', grade: '레어', value: 25, catchRate: 0.0, difficulty: 3, row: 3, column: 3, slot: 23 },
  '24': { id: 24, name: '가오리', grade: '레어', value: 30, catchRate: 0.0, difficulty: 4, row: 3, column: 4, slot: 24 },
  '25': { id: 25, name: '장어', grade: '레어', value: 22, catchRate: 0.0, difficulty: 3, row: 3, column: 5, slot: 25 },
  '26': { id: 26, name: '붕장어', grade: '레어', value: 25, catchRate: 0.0, difficulty: 4, row: 3, column: 6, slot: 26 },
  '27': { id: 27, name: '오징어', grade: '레어', value: 18, catchRate: 0.0, difficulty: 2, row: 3, column: 7, slot: 27 },
  '28': { id: 28, name: '갑오징어', grade: '레어', value: 22, catchRate: 0.0, difficulty: 3, row: 3, column: 8, slot: 28 },
  '29': { id: 29, name: '한치', grade: '레어', value: 20, catchRate: 0.0, difficulty: 3, row: 3, column: 9, slot: 29 },
  '30': { id: 30, name: '주꾸미', grade: '레어', value: 18, catchRate: 0.0, difficulty: 2, row: 3, column: 10, slot: 30 },
  '31': { id: 31, name: '낙지', grade: '레어', value: 20, catchRate: 0.0, difficulty: 3, row: 4, column: 1, slot: 31 },
  '32': { id: 32, name: '배스', grade: '레어', value: 25, catchRate: 0.0, difficulty: 3, row: 4, column: 2, slot: 32 },
  '33': { id: 33, name: '무지개송어', grade: '레어', value: 24, catchRate: 0.0, difficulty: 3, row: 4, column: 3, slot: 33 },
  '34': { id: 34, name: '브라운송어', grade: '레어', value: 28, catchRate: 0.0, difficulty: 3, row: 4, column: 4, slot: 34 },
  '35': { id: 35, name: '골든퍼치', grade: '레어', value: 30, catchRate: 0.0, difficulty: 3, row: 4, column: 5, slot: 35 },
  '36': { id: 36, name: '실버퍼치', grade: '레어', value: 28, catchRate: 0.0, difficulty: 3, row: 4, column: 6, slot: 36 },
  '37': { id: 37, name: '머레이대구', grade: '레어', value: 48, catchRate: 0.0, difficulty: 5, row: 4, column: 7, slot: 37 },
  '38': { id: 38, name: '바라문디', grade: '레어', value: 50, catchRate: 0.0, difficulty: 5, row: 4, column: 8, slot: 38 },
  '39': { id: 39, name: '실버트레발리', grade: '레어', value: 30, catchRate: 0.0, difficulty: 4, row: 4, column: 9, slot: 39 },
  '40': { id: 40, name: '퀸피시', grade: '레어', value: 38, catchRate: 0.0, difficulty: 4, row: 4, column: 10, slot: 40 },
  '41': { id: 41, name: '킹피시', grade: '희귀', value: 58, catchRate: 0.0, difficulty: 6, row: 5, column: 1, slot: 41 },
  '42': { id: 42, name: '부시리', grade: '희귀', value: 55, catchRate: 0.0, difficulty: 5, row: 5, column: 2, slot: 42 },
  '43': { id: 43, name: '방어', grade: '희귀', value: 52, catchRate: 0.0, difficulty: 5, row: 5, column: 3, slot: 43 },
  '44': { id: 44, name: 'GT', grade: '희귀', value: 75, catchRate: 0.0, difficulty: 7, row: 5, column: 4, slot: 44 },
  '45': { id: 45, name: '맹그로브잭', grade: '희귀', value: 55, catchRate: 0.0, difficulty: 5, row: 5, column: 5, slot: 45 },
  '46': { id: 46, name: '산호송어', grade: '희귀', value: 65, catchRate: 0.0, difficulty: 6, row: 5, column: 6, slot: 46 },
  '47': { id: 47, name: '레드엠퍼러', grade: '희귀', value: 70, catchRate: 0.0, difficulty: 6, row: 5, column: 7, slot: 47 },
  '48': { id: 48, name: '코비아', grade: '희귀', value: 68, catchRate: 0.0, difficulty: 6, row: 5, column: 8, slot: 48 },
  '49': { id: 49, name: '스페니시고등어', grade: '희귀', value: 70, catchRate: 0.0, difficulty: 6, row: 5, column: 9, slot: 49 },
  '50': { id: 50, name: '점박이고등어', grade: '희귀', value: 58, catchRate: 0.0, difficulty: 5, row: 5, column: 10, slot: 50 },
  '51': { id: 51, name: '황다랑어', grade: '희귀', value: 78, catchRate: 0.0, difficulty: 7, row: 6, column: 1, slot: 51 },
  '52': { id: 52, name: '가다랑어', grade: '희귀', value: 55, catchRate: 0.0, difficulty: 5, row: 6, column: 2, slot: 52 },
  '53': { id: 53, name: '마히마히', grade: '희귀', value: 65, catchRate: 0.0, difficulty: 6, row: 6, column: 3, slot: 53 },
  '54': { id: 54, name: '와후', grade: '희귀', value: 72, catchRate: 0.0, difficulty: 7, row: 6, column: 4, slot: 54 },
  '55': { id: 55, name: '블루그로퍼', grade: '희귀', value: 68, catchRate: 0.0, difficulty: 6, row: 6, column: 5, slot: 55 },
  '56': { id: 56, name: '웜뱃상어', grade: '희귀', value: 60, catchRate: 0.0, difficulty: 5, row: 6, column: 6, slot: 56 },
  '57': { id: 57, name: '포트잭슨상어', grade: '희귀', value: 55, catchRate: 0.0, difficulty: 5, row: 6, column: 7, slot: 57 },
  '58': { id: 58, name: '참다랑어', grade: '전설', value: 90, catchRate: 0.0, difficulty: 8, row: 6, column: 8, slot: 58 },
  '59': { id: 59, name: '눈다랑어', grade: '전설', value: 88, catchRate: 0.0, difficulty: 8, row: 6, column: 9, slot: 59 },
  '60': { id: 60, name: '청새치', grade: '전설', value: 96, catchRate: 0.0, difficulty: 9, row: 6, column: 10, slot: 60 },
  '61': { id: 61, name: '블루마린', grade: '전설', value: 98, catchRate: 0.0, difficulty: 10, row: 7, column: 1, slot: 61 },
  '62': { id: 62, name: '줄무늬청새치', grade: '전설', value: 94, catchRate: 0.0, difficulty: 9, row: 7, column: 2, slot: 62 },
  '63': { id: 63, name: '돛새치', grade: '전설', value: 90, catchRate: 0.0, difficulty: 9, row: 7, column: 3, slot: 63 },
  '64': { id: 64, name: '황새치', grade: '전설', value: 100, catchRate: 0.0, difficulty: 10, row: 7, column: 4, slot: 64 },
  '65': { id: 65, name: '귀상어', grade: '전설', value: 92, catchRate: 0.0, difficulty: 9, row: 7, column: 5, slot: 65 },
  '66': { id: 66, name: '호랑이상어', grade: '전설', value: 96, catchRate: 0.0, difficulty: 10, row: 7, column: 6, slot: 66 },
  '67': { id: 67, name: '백상아리', grade: '전설', value: 100, catchRate: 0.0, difficulty: 10, row: 7, column: 7, slot: 67 },
};

const FISH_GRADE_ORDER = ['일반', '레어', '희귀', '전설'];

/* 아이콘 스프라이트시트 규격 (§업로드 규격) — 196x136px 투명 PNG, 10열x7행,
   슬롯당 16x16px, 슬롯 간격 4px, 바깥 여백 없음. AssetDB.getFishingConfig().
   fishSheetAssetId가 이 규격의 이미지를 가리킨다. */
const FISH_SHEET_LAYOUT = { columns: 10, rows: 7, cellSize: 16, gap: 4 };

function getFishDef(id) { return fishDefs[String(id)] || null; }

// scale은 아이콘을 16x16 원본보다 크게 표시할 때 쓴다(설정 화면 미리보기 등) —
// background-size를 시트 전체 크기*scale로 키우고 position도 같은 비율로
// 맞춰야 잘림 없이 정확히 확대된다.
function getFishSlotStyle(slot, scale) {
  scale = scale || 1;
  const { columns, rows, cellSize, gap } = FISH_SHEET_LAYOUT;
  const row = Math.ceil(slot / columns);
  const col = ((slot - 1) % columns) + 1;
  const x = (col - 1) * (cellSize + gap) * scale;
  const y = (row - 1) * (cellSize + gap) * scale;
  const sheetW = (columns * cellSize + (columns - 1) * gap) * scale;
  const sheetH = (rows * cellSize + (rows - 1) * gap) * scale;
  return {
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${sheetW}px ${sheetH}px`,
  };
}

/* ===== 세밀영역조절 — 물고기별 아이콘 위치 보정 =====
   실제 업로드된 시트가 FISH_SHEET_LAYOUT 규격(196x136, 10x7, 칸 16px, 간격
   4px)에 정확히 맞아떨어진다는 보장이 없다 — AI로 생성한 스프라이트시트는
   칸이 미묘하게 어긋나는 일이 흔해서, getFishSlotStyle의 이론적 그리드
   계산만으로는 아이콘이 잘못 잘려 보일 수 있다. 그래서 물고기 하나하나를
   개별적으로 다시 지정할 수 있게 하는 보정값이 fishIconOverrides
   (AssetDB.getFishingConfig()의 필드, { [fishId]: { cx, cy, size } }) —
   dev/minigame-fishing/index.html의 크롭 조정 모달과 같은 정규화 좌표계
   (0~1, 중심 cx/cy + 짧은 변 기준 비율 size)를 그대로 쓴다. 이 좌표는
   시트의 실제 로드된 해상도 기준이라, getFishSlotStyle과 달리 실제
   naturalWidth/naturalHeight를 알아야 픽셀 위치로 환산할 수 있다. */
function getFishDefaultCropRect(slot) {
  const { columns, rows, cellSize, gap } = FISH_SHEET_LAYOUT;
  const col = ((slot - 1) % columns) + 1;
  const row = Math.ceil(slot / columns);
  const sheetW = columns * cellSize + (columns - 1) * gap;
  const sheetH = rows * cellSize + (rows - 1) * gap;
  const cxPx = (col - 1) * (cellSize + gap) + cellSize / 2;
  const cyPx = (row - 1) * (cellSize + gap) + cellSize / 2;
  return { cx: cxPx / sheetW, cy: cyPx / sheetH, size: cellSize / Math.min(sheetW, sheetH) };
}

// rect: { cx, cy, size } normalized over the sheet's *actual* loaded pixel
// dimensions (sheetNaturalWidth/Height) — not the theoretical spec size, see
// above. displaySize: the square icon box (px) this should exactly fill.
function getFishCropStyle(rect, sheetNaturalWidth, sheetNaturalHeight, displaySize) {
  const shortSide = Math.min(sheetNaturalWidth, sheetNaturalHeight);
  const cropSize = rect.size * shortSide;
  const renderScale = displaySize / cropSize;
  const x = (rect.cx * sheetNaturalWidth - cropSize / 2) * renderScale;
  const y = (rect.cy * sheetNaturalHeight - cropSize / 2) * renderScale;
  return {
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${sheetNaturalWidth * renderScale}px ${sheetNaturalHeight * renderScale}px`,
  };
}

