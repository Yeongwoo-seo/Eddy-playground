/* LGS Frame Y1 재무모델 — 슬라이더(일괄 적용) + 엑셀식 월별 셀 편집 + 구성요소 브레이크다운 */

const MONTH_PHASE = ['Closing', 'Closing', 'Build', 'Build', 'Pilot', 'Pilot', 'Scale', 'Scale', 'Scale', 'Expand', 'Expand', 'Expand'];
const PHASE_ORDER = ['Closing', 'Build', 'Pilot', 'Scale', 'Expand'];
const PHASE_RANGE = { Closing: 'M1-M2', Build: 'M3-M4', Pilot: 'M5-M6', Scale: 'M7-M9', Expand: 'M10-M12' };

const TABS = [
  { id: 'summary', icon: '📊', label: '요약' },
  { id: 'assumptions', icon: '⚙️', label: '가정' },
  { id: 'capex', icon: '🏗️', label: '설비투자' },
  { id: 'table', icon: '🧮', label: '월별표' }
];
let curTab = 0;

const SUB_TAB_GROUPS = {
  assumptions: {
    barId: 'subTabBar',
    cur: 0,
    tabs: [
      { id: 'revenue', label: '매출' },
      { id: 'fixed', label: '고정비' },
      { id: 'variable', label: '변동비' }
    ]
  },
  capex: {
    barId: 'subTabBarCapex',
    cur: 0,
    tabs: [
      { id: 'capex-funding', label: '자금조달' },
      { id: 'capex-equipment', label: '장비·공구' }
    ]
  },
  table: {
    barId: 'subTabBarTable',
    cur: 0,
    tabs: [
      { id: 'is', label: '손익계산서' },
      { id: 'cf', label: '현금흐름표' },
      { id: 'bs', label: '대차대조표' }
    ]
  }
};

const DEFAULTS = {
  pricePerSqm: 200,
  houseTypes: [
    { label: '그래니플랫', sqm: 55, targetQty: 8 },
    { label: '듀플렉스', sqm: 150, targetQty: 2 },
    { label: '타운하우스', sqm: 130, targetQty: 2 }
  ],
  coilPct: 30,
  screwPct: 5,
  detailPct: 10,
  otherVarPct: 5,
  coilLmPerSqm: 16,
  fixedCostItems: [
    { category: 'fixedProd', label: '공장·창고 임대료', note: 'Western Sydney 산업단지 창고 (~450㎡, 순임대료 ~$160/㎡/yr 기준)', monthly: 6000 },
    { category: 'fixedProd', label: '공장 전기·수도', note: 'SP120 롤포밍기 가동 전력 + 용수/폐수', monthly: 1500 },
    { category: 'fixedProd', label: '생산직 기본급 (오퍼레이터 2명)', note: '램프업 단계 최소 유지 인력, Fair Work 금속제조업 award 기준', monthly: 9000, calc: { qty: 2, unitPrice: 4500 } },
    { category: 'fixedProd', label: '소모품·공구 유지보수', note: '드릴비트·블레이드·윤활유 등 소모품 교체', monthly: 1000, calc: { qty: 1, unitPrice: 1000 } },
    { category: 'fixedProd', label: '산업폐기물 처리', note: '철스크랩·자재 폐기물 수거', monthly: 400 },
    { category: 'fixedProd', label: '포크리프트 렌탈', note: '중고 구매 대신 월 렌탈로 전환 — 렌탈업체 시세 조사 전 추정치, 확인되면 직접 입력하세요', monthly: 650 },
    { category: 'sga', label: '대표이사 급여', note: '경영·전략·영업 총괄', monthly: 10000, calc: { qty: 1, unitPrice: 10000 } },
    { category: 'sga', label: '견적·영업 담당 급여', note: '고객 상담, 견적, 계약 관리', monthly: 7500, calc: { qty: 1, unitPrice: 7500 } },
    { category: 'sga', label: '관리·회계 담당 급여 (파트타임)', note: '경리, 총무, 발주 관리', monthly: 3500, calc: { qty: 1, unitPrice: 3500 } },
    { category: 'sga', label: '사업 보험료', note: '배상책임(Public Liability) + icare 산재보험 (제조업 평균 요율 ~1.8~4.8%)', monthly: 2900 },
    { category: 'sga', label: 'FrameCAD Steelwise 라이선스', note: '설계·디테일링·엔지니어링 소프트웨어 구독', monthly: 1500 },
    { category: 'sga', label: '회계·법무 자문료', note: '외부 회계사 기장, 세무신고, 계약 검토', monthly: 1800 },
    { category: 'sga', label: '마케팅·영업비', note: '웹사이트, 온라인 광고, 전시 참가', monthly: 2000 },
    { category: 'sga', label: '차량 유지비', note: '배송·현장방문용 유트(Ute) 리스+연료+보험', monthly: 1600 },
    { category: 'sga', label: '사무실 임대료·유틸리티', note: '공장 내 사무 공간 또는 소규모 별도 사무실', monthly: 1200 },
    { category: 'sga', label: '통신·IT', note: '인터넷, 휴대폰, 클라우드 SaaS 구독', monthly: 600 },
    { category: 'sga', label: '인증·컴플라이언스', note: '구조 엔지니어 서명, WHS 컴플라이언스, CDC 인증 관련', monthly: 1800 },
    { category: 'sga', label: '기타 관리비', note: '사무용품, 소모품, 예비비', monthly: 1000 },
    { category: 'other', type: 'depreciation', label: '설비 감가상각비', note: 'SP120 Stage1+2 총 $80,000, 내용연수 7년 정액법', monthly: 950 },
    { category: 'other', type: 'depreciation', label: '장비·공구 감가상각비', note: '소모성 공구·장비 (포크리프트 제외, 렌탈 전환), 내용연수 5년', monthly: 19 },
    { category: 'other', type: 'interest', label: '설비 리스·대출 이자', note: 'SP120 자산금융 가정 이자비용', monthly: 560 }
  ],
  equityRaise: 350000,
  stage1Amount: 40000,
  stage1Month: 1,
  stage2Amount: 40000,
  stage2Month: 5,
  stage3Amount: 0,
  stage3Month: 9,
  houses: [0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1],
  equipmentMonth: 1,
  equipmentItems: [
    { label: '임팩 드라이버', note: 'Bunnings', unitPrice: 99, qty: 1 },
    { label: '임팩 렌치', note: 'Bunnings', unitPrice: 299, qty: 1 },
    { label: '스크류 (경량철골용, 1000팩)', note: 'Bunnings', unitPrice: 84.5, qty: 1 },
    { label: '그라인더 (125mm)', note: 'Bunnings', unitPrice: 104, qty: 1 },
    { label: '커팅 소 (금속절단)', note: 'Bunnings', unitPrice: 169, qty: 1 },
    { label: '스트랩 (밴딩 툴)', note: 'Total Tools', unitPrice: 238, qty: 1 },
    { label: '망치', note: 'Bunnings', unitPrice: 10.48, qty: 1 },
    { label: '빠루 (크로바)', note: 'Bunnings', unitPrice: 14.98, qty: 1 },
    { label: '가위 (항공가위/틴스니퍼)', note: 'Bunnings', unitPrice: 18.98, qty: 1 },
    { label: '가구용 드릴', note: 'Bunnings', unitPrice: 89.98, qty: 1 },
    { label: '가구용 스크류 (칩보드)', note: 'Bunnings · 단가 확인 필요', unitPrice: 0, qty: 1 }
  ]
};

function computeHouseTypeTotals(houseTypes, pricePerSqm) {
  let totalQty = 0, totalRevenue = 0, totalSqm = 0;
  const rows = houseTypes.map(t => {
    const unitPrice = t.sqm * pricePerSqm;
    const subtotal = unitPrice * t.targetQty;
    totalQty += t.targetQty;
    totalRevenue += subtotal;
    totalSqm += t.sqm * t.targetQty;
    return { label: t.label, sqm: t.sqm, targetQty: t.targetQty, unitPrice, subtotal };
  });
  const blendedPrice = totalQty > 0 ? totalRevenue / totalQty : 0;
  const avgSqm = totalQty > 0 ? totalSqm / totalQty : 0;
  return { rows, totalQty, totalRevenue, totalSqm, blendedPrice, avgSqm };
}

/* coil usage: physical coil consumed per sqm of frame produced (linear metres, "L")
   default sourced from FRAMECAD's published steel-weight estimate for single-storey
   residential (~18kg/sqm) divided by a blended profile weight (~1.1kg/lm across the
   stud/track/nogging mix a FrameCAD roll-former typically runs) — see table-hint below.
   this is the production-volume metric the future per-L incentive scheme will pay against. */
function computeCoilUsage(houseTypeTotals, coilLmPerSqm) {
  const totalCoilLm = houseTypeTotals.totalSqm * coilLmPerSqm;
  const avgLmPerHouse = houseTypeTotals.totalQty > 0 ? totalCoilLm / houseTypeTotals.totalQty : 0;
  return { totalSqm: houseTypeTotals.totalSqm, totalCoilLm, avgLmPerHouse };
}

function computeFixedCostTotals(items) {
  const totals = { fixedProd: 0, sga: 0, other: 0, depreciation: 0, interest: 0 };
  items.forEach(it => {
    totals[it.category] += it.monthly;
    if (it.category === 'other') {
      if (it.type === 'interest') totals.interest += it.monthly;
      else totals.depreciation += it.monthly;
    }
  });
  totals.grandTotal = totals.fixedProd + totals.sga + totals.other;
  return totals;
}

function buildDefaultMonths() {
  const blendedPrice = Math.round(computeHouseTypeTotals(DEFAULTS.houseTypes, DEFAULTS.pricePerSqm).blendedPrice);
  const fc = computeFixedCostTotals(DEFAULTS.fixedCostItems);
  return DEFAULTS.houses.map(houses => {
    const revenue = houses * blendedPrice;
    return {
      houses,
      salePrice: blendedPrice,
      coil: revenue * DEFAULTS.coilPct / 100,
      screw: revenue * DEFAULTS.screwPct / 100,
      detail: revenue * DEFAULTS.detailPct / 100,
      otherVar: revenue * DEFAULTS.otherVarPct / 100,
      fixedProd: fc.fixedProd,
      sga: fc.sga,
      depreciation: fc.depreciation,
      interest: fc.interest
    };
  });
}

function buildDefaultEquipment() {
  return DEFAULTS.equipmentItems.map(item => ({ ...item }));
}

function buildDefaultFixedCostItems() {
  return DEFAULTS.fixedCostItems.map(item => {
    const copy = { ...item };
    if (item.calc) copy.calc = { ...item.calc };
    return copy;
  });
}

function buildDefaultState() {
  return {
    pricePerSqm: DEFAULTS.pricePerSqm,
    houseTypes: DEFAULTS.houseTypes.map(t => ({ ...t })),
    coilPct: DEFAULTS.coilPct,
    screwPct: DEFAULTS.screwPct,
    detailPct: DEFAULTS.detailPct,
    otherVarPct: DEFAULTS.otherVarPct,
    coilLmPerSqm: DEFAULTS.coilLmPerSqm,
    fixedCostItems: buildDefaultFixedCostItems(),
    equityRaise: DEFAULTS.equityRaise,
    stage1Amount: DEFAULTS.stage1Amount,
    stage1Month: DEFAULTS.stage1Month,
    stage2Amount: DEFAULTS.stage2Amount,
    stage2Month: DEFAULTS.stage2Month,
    stage3Amount: DEFAULTS.stage3Amount,
    stage3Month: DEFAULTS.stage3Month,
    equipmentMonth: DEFAULTS.equipmentMonth,
    equipmentItems: buildDefaultEquipment(),
    months: buildDefaultMonths()
  };
}

let state = buildDefaultState();

let isRowRefs = {};
let cfRowRefs = {};
let bsRowRefs = {};
let equipRowRefs = [];
let houseTypeRowRefs = [];
let fixedCostRowRefs = [];

/* ---------- auto-save to server ---------- */
// Fill in after `npx wrangler deploy` in worker/ (see worker/README.md) —
// blank means auto-save/load is a no-op and the page behaves as before.
const API_URL = '';

let saveTimer = null;
function scheduleSave() {
  if (!API_URL) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fetch(API_URL + '/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app: 'lgs-model', data: state })
    }).catch(() => {});
  }, 800);
}

async function loadStateFromServer() {
  if (!API_URL) return;
  try {
    const res = await fetch(API_URL + '/state?app=lgs-model');
    if (!res.ok) return;
    const payload = await res.json();
    if (payload && payload.data && Object.keys(payload.data).length) {
      state = Object.assign(buildDefaultState(), payload.data);
    }
  } catch (e) {
    // offline or Worker unreachable — keep local defaults
  }
}

function fmt(n) {
  const r = Math.round(n);
  return (r < 0 ? '-$' : '$') + Math.abs(r).toLocaleString('en-US');
}

function fmtK(n) {
  const r = Math.round(n / 1000);
  return (r < 0 ? '-$' : '$') + Math.abs(r) + 'k';
}

/* wrap a money input with a "$" prefix shown inside the box (variant matches the input's own class: money-n/money-t/money-e) */
function wrapMoneyInput(input, variant) {
  const wrap = document.createElement('span');
  wrap.className = 'money-field ' + variant;
  wrap.appendChild(input);
  return wrap;
}

function q(id) { return document.getElementById(id); }

function computeAll() {
  const months = [];
  let cash = state.equityRaise;
  let cumCapex = 0, cumDep = 0, cumInterest = 0, cumNetIncome = 0;
  const totalEquipmentCapex = state.equipmentItems.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  state.months.forEach((m, i) => {
    const revenue = m.houses * m.salePrice;
    const varCost = m.coil + m.screw + m.detail + m.otherVar;
    const cogs = varCost + m.fixedProd;
    const grossProfit = revenue - cogs;
    const ebitda = grossProfit - m.sga;
    const netIncome = ebitda - m.depreciation - m.interest;

    let capex = 0;
    if (i + 1 === Number(state.stage1Month)) capex += state.stage1Amount;
    if (i + 1 === Number(state.stage2Month)) capex += state.stage2Amount;
    if (i + 1 === Number(state.stage3Month)) capex += state.stage3Amount;
    if (i + 1 === Number(state.equipmentMonth)) capex += totalEquipmentCapex;

    // CF: 감가상각비는 비현금이라 EBITDA에 이미 반영 안 됨. 이자비용은 이 모델에서
    // 발생주의로 비용 인식만 하고 현금 지급 없이 미지급이자(BS 부채)로 누적된다고 가정.
    const cashBegin = cash;
    const operatingCF = ebitda;
    const investingCF = -capex;
    const financingCF = 0;
    const netCF = operatingCF + investingCF + financingCF;
    cash += netCF;
    const cashEnd = cash;

    cumCapex += capex;
    cumDep += m.depreciation;
    cumInterest += m.interest;
    cumNetIncome += netIncome;

    const ppe = cumCapex - cumDep;
    const accruedInterest = cumInterest;
    const totalAssets = cashEnd + ppe;
    const totalLiabilities = accruedInterest;
    const retainedEarnings = cumNetIncome;
    const equity = state.equityRaise + retainedEarnings;

    months.push({
      idx: i, phase: MONTH_PHASE[i], houses: m.houses, salePrice: m.salePrice,
      coil: m.coil, screw: m.screw, detail: m.detail, otherVar: m.otherVar,
      fixedProd: m.fixedProd, sga: m.sga, depreciation: m.depreciation, interest: m.interest,
      revenue, varCost, cogs, grossProfit, ebitda, netIncome, capex,
      cashBegin, operatingCF, investingCF, financingCF, netCF, cashEnd,
      ppe, accruedInterest, totalAssets, totalLiabilities, equityRaise: state.equityRaise,
      retainedEarnings, equity
    });
  });

  const totals = {
    totalRevenue: sum(months, 'revenue'),
    totalCOGS: sum(months, 'cogs'),
    totalCoil: sum(months, 'coil'),
    totalScrew: sum(months, 'screw'),
    totalDetail: sum(months, 'detail'),
    totalOtherVar: sum(months, 'otherVar'),
    totalFixedProd: sum(months, 'fixedProd'),
    totalSGA: sum(months, 'sga'),
    totalDepreciation: sum(months, 'depreciation'),
    totalInterest: sum(months, 'interest'),
    totalEBITDA: sum(months, 'ebitda'),
    totalNI: sum(months, 'netIncome'),
    totalCapex: sum(months, 'capex'),
    totalOperatingCF: sum(months, 'operatingCF'),
    totalInvestingCF: sum(months, 'investingCF'),
    totalFinancingCF: sum(months, 'financingCF'),
    totalNetCF: sum(months, 'netCF'),
    totalMachineCapex: state.stage1Amount + state.stage2Amount + state.stage3Amount,
    totalEquipmentCapex,
    totalHouses: sum(months, 'houses'),
    endCash: months[11].cashEnd,
    endPPE: months[11].ppe,
    endAccruedInterest: months[11].accruedInterest,
    endTotalAssets: months[11].totalAssets,
    endTotalLiabilities: months[11].totalLiabilities,
    endRetainedEarnings: months[11].retainedEarnings,
    endEquity: months[11].equity,
    minCash: Math.min(state.equityRaise, ...months.map(m => m.cashEnd))
  };
  totals.totalGP = totals.totalRevenue - totals.totalCOGS;

  return { months, totals };
}

function sum(months, key) { return months.reduce((s, m) => s + m[key], 0); }

function setSliderFill(el) {
  const min = Number(el.min), max = Number(el.max), val = Number(el.value);
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  el.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--grey-200) ${pct}%, var(--grey-200) 100%)`;
}

/* ---------- charts ---------- */

const SVGNS = 'http://www.w3.org/2000/svg';
function el(tag, attrs) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function buildMainChart(months) {
  const svg = q('mainChart');
  svg.innerHTML = '';
  const W = 460, H = 210, padL = 46, padR = 8, padT = 10, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const revs = months.map(m => m.revenue);
  const cogsArr = months.map(m => m.cogs);
  const ebitdaArr = months.map(m => m.ebitda);
  let maxVal = Math.max(...revs, ...cogsArr, 0, 1000);
  let minVal = Math.min(...ebitdaArr, 0);
  const range = (maxVal - minVal) || 1;
  const y = v => padT + (maxVal - v) / range * plotH;
  const zeroY = y(0);
  const slotW = plotW / 12;
  const barW = Math.max(slotW * 0.3, 4);

  svg.appendChild(el('line', { x1: padL, y1: zeroY, x2: W - padR, y2: zeroY, stroke: 'var(--grey-300)', 'stroke-width': 1 }));

  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    const xRev = xCenter - barW - 1.5;
    const xCogs = xCenter + 1.5;
    const revY = Math.min(y(m.revenue), zeroY);
    const cogsY = Math.min(y(m.cogs), zeroY);
    svg.appendChild(el('rect', { x: xRev, y: revY, width: barW, height: Math.max(Math.abs(y(m.revenue) - zeroY), 0.5), rx: 2, fill: 'var(--primary)' }));
    svg.appendChild(el('rect', { x: xCogs, y: cogsY, width: barW, height: Math.max(Math.abs(y(m.cogs) - zeroY), 0.5), rx: 2, fill: 'var(--grey-300)' }));
  });

  const pts = months.map((m, i) => `${padL + slotW * i + slotW / 2},${y(m.ebitda)}`).join(' ');
  svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: 'var(--info-blue)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    svg.appendChild(el('circle', { cx: xCenter, cy: y(m.ebitda), r: 2.6, fill: 'var(--info-blue)' }));
  });

  months.forEach((m, i) => {
    const xCenter = padL + slotW * i + slotW / 2;
    const t = el('text', { x: xCenter, y: H - 6, 'text-anchor': 'middle', 'font-size': 8.5, fill: 'var(--grey-500)', 'font-weight': 600 });
    t.textContent = 'M' + (i + 1);
    svg.appendChild(t);
  });

  const tMax = el('text', { x: padL - 6, y: y(maxVal) + 8, 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
  tMax.textContent = fmtK(maxVal);
  svg.appendChild(tMax);
  const tZero = el('text', { x: padL - 6, y: zeroY + 3, 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
  tZero.textContent = '0';
  svg.appendChild(tZero);
  if (minVal < 0) {
    const tMin = el('text', { x: padL - 6, y: y(minVal), 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
    tMin.textContent = fmtK(minVal);
    svg.appendChild(tMin);
  }
}

function buildCashChart(months) {
  const svg = q('cashChart');
  svg.innerHTML = '';
  const W = 460, H = 160, padL = 52, padR = 8, padT = 10, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const series = [state.equityRaise, ...months.map(m => m.cashEnd)];
  let maxVal = Math.max(...series, 1000);
  let minVal = Math.min(...series, 0);
  const range = (maxVal - minVal) || 1;
  const y = v => padT + (maxVal - v) / range * plotH;
  const zeroY = y(0);
  const slotW = plotW / (series.length - 1);

  if (minVal < 0) {
    svg.appendChild(el('line', { x1: padL, y1: zeroY, x2: W - padR, y2: zeroY, stroke: 'var(--grey-300)', 'stroke-width': 1, 'stroke-dasharray': '3,3' }));
  }

  const pts = series.map((v, i) => `${padL + slotW * i},${y(v)}`).join(' ');
  const areaPts = `${padL},${zeroY} ${pts} ${padL + slotW * (series.length - 1)},${zeroY}`;
  svg.appendChild(el('polygon', { points: areaPts, fill: 'var(--primary-light)', opacity: 0.7 }));
  svg.appendChild(el('polyline', { points: pts, fill: 'none', stroke: 'var(--primary)', 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));

  series.forEach((v, i) => {
    if (i === 0 || i % 2 === 1) {
      const label = i === 0 ? '초기' : 'M' + i;
      const t = el('text', { x: padL + slotW * i, y: H - 6, 'text-anchor': 'middle', 'font-size': 8.5, fill: 'var(--grey-500)', 'font-weight': 600 });
      t.textContent = label;
      svg.appendChild(t);
    }
  });

  [maxVal, minVal < 0 ? minVal : null].forEach(v => {
    if (v === null) return;
    const t = el('text', { x: padL - 6, y: y(v) + (v === maxVal ? 8 : -2), 'text-anchor': 'end', 'font-size': 9, fill: 'var(--grey-500)', 'font-weight': 600 });
    t.textContent = fmtK(v);
    svg.appendChild(t);
  });
}

/* ---------- equipment/tools table (editable) ---------- */

function buildEquipSkeleton() {
  const tbody = q('equipBody');
  tbody.innerHTML = '';
  equipRowRefs = [];

  state.equipmentItems.forEach((item, i) => {
    const tr = document.createElement('tr');

    const labelTd = document.createElement('td');
    labelTd.className = 'equip-label-cell';
    const labelBtn = document.createElement('button');
    labelBtn.type = 'button';
    labelBtn.className = 'equip-label-btn';
    labelBtn.innerHTML = `<span class="equip-label">${item.label}</span>`;
    labelBtn.addEventListener('click', () => openItemModal('equip', i));
    labelTd.appendChild(labelBtn);
    tr.appendChild(labelTd);

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.className = 'equip-input';
    priceInput.min = '0';
    priceInput.step = '0.01';
    priceInput.value = item.unitPrice;
    priceInput.dataset.i = i;
    priceInput.dataset.key = 'unitPrice';
    priceInput.addEventListener('input', onEquipInput);
    const priceTd = document.createElement('td');
    priceTd.appendChild(wrapMoneyInput(priceInput, 'money-e'));
    tr.appendChild(priceTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = item.qty;
    qtyInput.dataset.i = i;
    qtyInput.dataset.key = 'qty';
    qtyInput.addEventListener('input', onEquipInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const subtotalTd = document.createElement('td');
    subtotalTd.className = 'equip-subtotal';
    tr.appendChild(subtotalTd);

    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ht-remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.dataset.i = i;
    removeBtn.addEventListener('click', onEquipRemove);
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    tbody.appendChild(tr);
    equipRowRefs.push({ priceInput, qtyInput, subtotalTd });
  });
}

function onEquipInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.equipmentItems[i][key] = val;
  renderComputed();
  scheduleSave();
}

function onEquipRemove(e) {
  const i = Number(e.currentTarget.dataset.i);
  state.equipmentItems.splice(i, 1);
  buildEquipSkeleton();
  renderComputed();
  scheduleSave();
}

function renderEquipTable() {
  let total = 0;
  equipRowRefs.forEach((row, i) => {
    const item = state.equipmentItems[i];
    const subtotal = item.unitPrice * item.qty;
    total += subtotal;
    row.subtotalTd.textContent = fmt(subtotal);
  });
  q('equipTotal').textContent = fmt(total);
}

/* ---------- fixed cost items (editable, grouped by category) ---------- */

const FIXED_COST_CATEGORIES = [
  { id: 'fixedProd', bodyId: 'fixedProdBody', subtotalId: 'fixedProdSubtotal' },
  { id: 'sga', bodyId: 'sgaBody', subtotalId: 'sgaSubtotal' },
  { id: 'other', bodyId: 'otherCostBody', subtotalId: 'otherCostSubtotal' }
];

function buildFixedCostSkeleton() {
  fixedCostRowRefs = [];
  FIXED_COST_CATEGORIES.forEach(cat => {
    const tbody = q(cat.bodyId);
    tbody.innerHTML = '';
    state.fixedCostItems.forEach((item, i) => {
      if (item.category !== cat.id) return;
      const tr = document.createElement('tr');

      const labelTd = document.createElement('td');
      labelTd.className = 'equip-label-cell';
      const labelBtn = document.createElement('button');
      labelBtn.type = 'button';
      labelBtn.className = 'equip-label-btn';
      labelBtn.innerHTML = `<span class="equip-label">${item.label}</span>`;
      labelBtn.addEventListener('click', () => openItemModal('fixed', i));
      labelTd.appendChild(labelBtn);
      tr.appendChild(labelTd);

      const monthlyTd = document.createElement('td');
      if (item.calc) {
        const monthlySpan = document.createElement('span');
        monthlySpan.className = 'equip-subtotal';
        monthlySpan.textContent = fmt(item.monthly);
        monthlyTd.appendChild(monthlySpan);
        tr.appendChild(monthlyTd);
        fixedCostRowRefs.push({ i, span: monthlySpan });
      } else {
        const monthlyInput = document.createElement('input');
        monthlyInput.type = 'number';
        monthlyInput.className = 'equip-input';
        monthlyInput.min = '0';
        monthlyInput.step = '1';
        monthlyInput.value = item.monthly;
        monthlyInput.dataset.i = i;
        monthlyInput.addEventListener('input', onFixedCostInput);
        monthlyTd.appendChild(wrapMoneyInput(monthlyInput, 'money-e'));
        tr.appendChild(monthlyTd);
        fixedCostRowRefs.push({ i, input: monthlyInput });
      }

      const removeTd = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'ht-remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.dataset.i = i;
      removeBtn.addEventListener('click', onFixedCostRemove);
      removeTd.appendChild(removeBtn);
      tr.appendChild(removeTd);

      tbody.appendChild(tr);
    });
  });
}

function onFixedCostInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.fixedCostItems[i].monthly = val;
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  renderComputed();
  scheduleSave();
}

function onFixedCostRemove(e) {
  const i = Number(e.currentTarget.dataset.i);
  state.fixedCostItems.splice(i, 1);
  buildFixedCostSkeleton();
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  renderComputed();
  scheduleSave();
}

function applyFixedCostTotals() {
  const totals = computeFixedCostTotals(state.fixedCostItems);
  applyFixedAll('fixedProd', totals.fixedProd);
  applyFixedAll('sga', totals.sga);
  applyFixedAll('depreciation', totals.depreciation);
  applyFixedAll('interest', totals.interest);
}

/* items with a `calc` block derive their monthly amount from 수량 × 단가
   instead of a manually-typed flat number (e.g. 급여 = 인원수 × 1인당 급여) */
function recomputeFixedCostCalcItem(i) {
  const item = state.fixedCostItems[i];
  if (!item.calc) return;
  let qty = parseFloat(item.calc.qty);
  let unitPrice = parseFloat(item.calc.unitPrice);
  if (isNaN(qty) || qty < 0) qty = 0;
  if (isNaN(unitPrice) || unitPrice < 0) unitPrice = 0;
  item.calc.qty = qty;
  item.calc.unitPrice = unitPrice;
  item.monthly = qty * unitPrice;
}

function updateFixedCostRowDisplay(i) {
  const row = fixedCostRowRefs.find(r => r.i === i);
  if (!row) return;
  const item = state.fixedCostItems[i];
  if (row.input) row.input.value = item.monthly;
  if (row.span) row.span.textContent = fmt(item.monthly);
}

function refreshFixedCostItem(i) {
  applyFixedCostTotals();
  syncInputsFromState();
  renderFixedCostTable();
  updateFixedCostRowDisplay(i);
  renderComputed();
  scheduleSave();
}

function syncFixedCostInputsFromState() {
  fixedCostRowRefs.forEach(row => { row.input.value = state.fixedCostItems[row.i].monthly; });
}

function renderFixedCostTable() {
  const totals = computeFixedCostTotals(state.fixedCostItems);
  q('fixedProdSubtotal').textContent = fmt(totals.fixedProd);
  q('sgaSubtotal').textContent = fmt(totals.sga);
  q('otherCostSubtotal').textContent = fmt(totals.other);
  q('fixedCostGrandTotal').textContent = fmt(totals.grandTotal);
}

/* ---------- item detail/settings modal (equipment & fixed cost items) ---------- */

function buildModalNumberField(labelText, value, step, onChange, isMoney) {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  wrap.appendChild(label);
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'num-input';
  input.min = '0';
  input.step = step;
  input.value = value;
  input.addEventListener('input', () => {
    let val = parseFloat(input.value);
    if (isNaN(val) || val < 0) val = 0;
    onChange(val);
  });
  wrap.appendChild(isMoney ? wrapMoneyInput(input, 'money-n') : input);
  return wrap;
}

function openItemModal(type, i) {
  const title = q('itemModalTitle');
  const settings = q('itemModalSettings');
  const detail = q('itemModalDetail');
  settings.innerHTML = '';

  if (type === 'equip') {
    const item = state.equipmentItems[i];
    const row = equipRowRefs[i];
    title.textContent = item.label;
    settings.appendChild(buildModalNumberField('단가', item.unitPrice, '0.01', val => {
      row.priceInput.value = val;
      row.priceInput.dispatchEvent(new Event('input', { bubbles: true }));
    }, true));
    settings.appendChild(buildModalNumberField('수량', item.qty, '1', val => {
      row.qtyInput.value = val;
      row.qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    detail.innerHTML = item.note ? `<span class="modal-detail-label">상세 정보</span>${item.note}` : '';
    detail.style.display = item.note ? '' : 'none';
  } else if (type === 'fixed') {
    const item = state.fixedCostItems[i];
    title.textContent = item.label;

    const toggleRow = document.createElement('label');
    toggleRow.className = 'calc-toggle-row';
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.checked = !!item.calc;
    toggleRow.appendChild(toggleCheckbox);
    const toggleText = document.createElement('span');
    toggleText.textContent = '계산식 사용 (수량 × 단가)';
    toggleRow.appendChild(toggleText);
    settings.appendChild(toggleRow);

    const fieldsWrap = document.createElement('div');
    fieldsWrap.className = 'calc-fields';
    settings.appendChild(fieldsWrap);

    let computedEl = null;
    function renderFields() {
      fieldsWrap.innerHTML = '';
      computedEl = null;
      if (item.calc) {
        fieldsWrap.appendChild(buildModalNumberField('수량 (인원수 등)', item.calc.qty, '1', val => {
          item.calc.qty = val;
          recomputeFixedCostCalcItem(i);
          if (computedEl) computedEl.textContent = '= 월 ' + fmt(item.monthly);
          refreshFixedCostItem(i);
        }));
        fieldsWrap.appendChild(buildModalNumberField('단가', item.calc.unitPrice, '1', val => {
          item.calc.unitPrice = val;
          recomputeFixedCostCalcItem(i);
          if (computedEl) computedEl.textContent = '= 월 ' + fmt(item.monthly);
          refreshFixedCostItem(i);
        }, true));
        computedEl = document.createElement('div');
        computedEl.className = 'calc-computed';
        computedEl.textContent = '= 월 ' + fmt(item.monthly);
        fieldsWrap.appendChild(computedEl);
      } else {
        fieldsWrap.appendChild(buildModalNumberField('월 금액', item.monthly, '1', val => {
          item.monthly = val;
          refreshFixedCostItem(i);
        }, true));
      }
    }
    renderFields();

    toggleCheckbox.addEventListener('change', () => {
      if (toggleCheckbox.checked) {
        item.calc = { qty: 1, unitPrice: item.monthly };
      } else {
        delete item.calc;
      }
      buildFixedCostSkeleton();
      renderFields();
      refreshFixedCostItem(i);
    });

    detail.innerHTML = '';
    const noteLabel = document.createElement('span');
    noteLabel.className = 'modal-detail-label';
    noteLabel.textContent = '설명';
    detail.appendChild(noteLabel);
    const noteTextarea = document.createElement('textarea');
    noteTextarea.className = 'note-textarea';
    noteTextarea.placeholder = '이 항목에 대한 설명을 입력하세요';
    noteTextarea.value = item.note || '';
    noteTextarea.addEventListener('input', () => {
      item.note = noteTextarea.value;
      scheduleSave();
    });
    detail.appendChild(noteTextarea);
    detail.style.display = '';
  }

  q('itemModalOverlay').classList.add('on');
}

function closeItemModal() {
  q('itemModalOverlay').classList.remove('on');
}

/* ---------- house type pricing & targets (editable) ---------- */

function applyBlendedPriceToMonths() {
  const blendedPrice = Math.round(computeHouseTypeTotals(state.houseTypes, state.pricePerSqm).blendedPrice);
  state.months.forEach(m => { m.salePrice = blendedPrice; });
  reapplyVariableCostPcts();
  return blendedPrice;
}

/* production-related variable costs (coil/screw/detail/otherVar) are set as
   a % of revenue — whenever a sales assumption changes the revenue for a
   month, recompute those costs so they stay in sync instead of going stale */
function reapplyVariableCostPcts(indices) {
  const idxs = indices || state.months.map((_, i) => i);
  idxs.forEach(i => {
    const m = state.months[i];
    const revenue = m.houses * m.salePrice;
    m.coil = revenue * state.coilPct / 100;
    m.screw = revenue * state.screwPct / 100;
    m.detail = revenue * state.detailPct / 100;
    m.otherVar = revenue * state.otherVarPct / 100;
  });
}

function buildHouseTypeSkeleton() {
  const tbody = q('houseTypeBody');
  tbody.innerHTML = '';
  houseTypeRowRefs = [];

  state.houseTypes.forEach((t, i) => {
    const tr = document.createElement('tr');

    const labelTd = document.createElement('td');
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'equip-input ht-label-input';
    labelInput.value = t.label;
    labelInput.dataset.i = i;
    labelInput.dataset.key = 'label';
    labelInput.addEventListener('input', onHouseTypeInput);
    labelTd.appendChild(labelInput);
    tr.appendChild(labelTd);

    const sqmInput = document.createElement('input');
    sqmInput.type = 'number';
    sqmInput.className = 'equip-input';
    sqmInput.min = '0';
    sqmInput.step = '1';
    sqmInput.value = t.sqm;
    sqmInput.dataset.i = i;
    sqmInput.dataset.key = 'sqm';
    sqmInput.addEventListener('input', onHouseTypeInput);
    const sqmTd = document.createElement('td');
    sqmTd.appendChild(sqmInput);
    tr.appendChild(sqmTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = t.targetQty;
    qtyInput.dataset.i = i;
    qtyInput.dataset.key = 'targetQty';
    qtyInput.addEventListener('input', onHouseTypeInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const unitPriceTd = document.createElement('td');
    unitPriceTd.className = 'equip-subtotal';
    tr.appendChild(unitPriceTd);

    const subtotalTd = document.createElement('td');
    subtotalTd.className = 'equip-subtotal';
    tr.appendChild(subtotalTd);

    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ht-remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.dataset.i = i;
    removeBtn.addEventListener('click', onHouseTypeRemove);
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    tbody.appendChild(tr);
    houseTypeRowRefs.push({ labelInput, sqmInput, qtyInput, unitPriceTd, subtotalTd });
  });
}

function onHouseTypeInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  if (key === 'label') {
    state.houseTypes[i].label = inp.value;
  } else {
    let val = parseFloat(inp.value);
    if (isNaN(val) || val < 0) val = 0;
    state.houseTypes[i][key] = val;
  }
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function onHouseTypeRemove(e) {
  if (state.houseTypes.length <= 1) return;
  const i = Number(e.currentTarget.dataset.i);
  state.houseTypes.splice(i, 1);
  buildHouseTypeSkeleton();
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function onHouseTypeAdd() {
  state.houseTypes.push({ label: '신규 구분', sqm: 60, targetQty: 1 });
  buildHouseTypeSkeleton();
  applyBlendedPriceToMonths();
  syncInputsFromState();
  renderHouseTypeTable();
  renderComputed();
  scheduleSave();
}

function renderHouseTypeTable() {
  const totals = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm);
  houseTypeRowRefs.forEach((row, i) => {
    const r = totals.rows[i];
    row.unitPriceTd.textContent = fmt(r.unitPrice);
    row.subtotalTd.textContent = fmt(r.subtotal);
  });
  q('houseTypeTotalQty').textContent = totals.totalQty + '채';
  q('houseTypeBlendedPrice').textContent = fmt(totals.blendedPrice) + '/채';
  q('houseTypeTotalRevenue').textContent = fmt(totals.totalRevenue);
}

/* ---------- monthly sales ramp (drives monthly revenue directly) ---------- */

let monthlyRampRowRefs = [];

function buildMonthlyRampSkeleton() {
  const tbody = q('monthlyRampBody');
  tbody.innerHTML = '';
  monthlyRampRowRefs = [];

  for (let i = 0; i < 12; i++) {
    const tr = document.createElement('tr');

    const monthTd = document.createElement('td');
    monthTd.className = 'equip-label-cell';
    monthTd.innerHTML = `<span class="equip-label">M${i + 1}<span class="tphase">${MONTH_PHASE[i]}</span></span>`;
    tr.appendChild(monthTd);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'equip-input';
    qtyInput.min = '0';
    qtyInput.step = '1';
    qtyInput.value = state.months[i].houses;
    qtyInput.dataset.i = i;
    qtyInput.addEventListener('input', onMonthlyRampInput);
    const qtyTd = document.createElement('td');
    qtyTd.appendChild(qtyInput);
    tr.appendChild(qtyTd);

    const revTd = document.createElement('td');
    revTd.className = 'equip-subtotal';
    tr.appendChild(revTd);

    tbody.appendChild(tr);
    monthlyRampRowRefs.push({ qtyInput, revTd });
  }
}

function onMonthlyRampInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i].houses = val;
  reapplyVariableCostPcts([i]);
  syncInputsFromState();
  renderComputed();
  scheduleSave();
}

function renderMonthlyRampTable() {
  let totalQty = 0;
  monthlyRampRowRefs.forEach((row, i) => {
    const m = state.months[i];
    totalQty += m.houses;
    row.revTd.textContent = fmt(m.houses * m.salePrice);
  });
  const totalQtyEl = q('monthlyRampTotalQty');
  if (totalQtyEl) totalQtyEl.textContent = totalQty + '채';
}

/* ---------- table (big categories, months as columns; split into IS/CF/BS) ---------- */

function signClass(val, rowDef) {
  if (rowDef.posNeg) return val < 0 ? ' neg' : ' pos';
  if (rowDef.negOnly) return val < 0 ? ' neg' : '';
  return '';
}

const IS_TABLE_ROWS = [
  { key: 'houses', label: '주택수', editable: true, money: false },
  { key: 'revenue', label: '매출', editable: false, money: true },
  { key: 'cogs', label: '매출원가', editable: false, money: true },
  { key: 'grossProfit', label: '매출총이익', editable: false, money: true, negOnly: true },
  { key: 'sga', label: 'SG&A', editable: false, money: true },
  { key: 'ebitda', label: 'EBITDA', editable: false, money: true, posNeg: true },
  { key: 'depreciation', label: '감가상각비', editable: false, money: true },
  { key: 'interest', label: '이자비용', editable: false, money: true },
  { key: 'netIncome', label: '당기순이익', editable: false, money: true, posNeg: true }
];

const CF_TABLE_ROWS = [
  { key: 'cashBegin', label: '기초현금', editable: false, money: true },
  { key: 'operatingCF', label: '영업활동 현금흐름', editable: false, money: true, posNeg: true },
  { key: 'investingCF', label: '투자활동 현금흐름', editable: false, money: true, negOnly: true },
  { key: 'financingCF', label: '재무활동 현금흐름', editable: false, money: true },
  { key: 'netCF', label: '순현금흐름', editable: false, money: true, posNeg: true },
  { key: 'cashEnd', label: '기말현금', editable: false, money: true, negOnly: true }
];

const BS_TABLE_ROWS = [
  { key: 'cashEnd', label: '현금', editable: false, money: true, negOnly: true },
  { key: 'ppe', label: '순유형자산', editable: false, money: true },
  { key: 'totalAssets', label: '자산총계', editable: false, money: true },
  { key: 'accruedInterest', label: '미지급이자', editable: false, money: true },
  { key: 'totalLiabilities', label: '부채총계', editable: false, money: true },
  { key: 'equityRaise', label: '자본금', editable: false, money: true },
  { key: 'retainedEarnings', label: '이익잉여금', editable: false, money: true, negOnly: true },
  { key: 'equity', label: '자본총계', editable: false, money: true }
];

function buildStatementTableSkeleton(headRowId, bodyId, rowsDef, totalLabel) {
  const headRow = q(headRowId);
  headRow.innerHTML = '<th>항목</th>' +
    MONTH_PHASE.map((phase, i) => `<th>M${i + 1}<span class="tphase">${phase}</span></th>`).join('') +
    `<th class="tcol-total">${totalLabel}</th>`;

  const tbody = q(bodyId);
  tbody.innerHTML = '';
  const refs = {};

  rowsDef.forEach(rowDef => {
    const tr = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.className = 'tcell tcell-month';
    labelTd.textContent = rowDef.label;
    tr.appendChild(labelTd);

    const cells = [];
    for (let i = 0; i < 12; i++) {
      const td = document.createElement('td');
      td.className = 'tcell';
      if (rowDef.editable) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'tinput';
        input.min = '0';
        input.step = '1';
        input.value = state.months[i][rowDef.key];
        input.dataset.i = i;
        input.dataset.key = rowDef.key;
        input.addEventListener('input', onCellInput);
        td.appendChild(input);
        cells.push(input);
      } else {
        td.classList.add('tcell-computed');
        cells.push(td);
      }
      tr.appendChild(td);
    }

    const totalTd = document.createElement('td');
    totalTd.className = 'tcell tcol-total';
    tr.appendChild(totalTd);

    tbody.appendChild(tr);
    refs[rowDef.key] = { cells, totalTd };
  });

  return refs;
}

function buildTableSkeleton() {
  isRowRefs = buildStatementTableSkeleton('isHeadRow', 'isTableBody', IS_TABLE_ROWS, 'Y1 합계');
  cfRowRefs = buildStatementTableSkeleton('cfHeadRow', 'cfTableBody', CF_TABLE_ROWS, 'Y1 합계');
  bsRowRefs = buildStatementTableSkeleton('bsHeadRow', 'bsTableBody', BS_TABLE_ROWS, 'Y1 말');
}

function onCellInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i].houses = val;
  reapplyVariableCostPcts([i]);
  syncInputsFromState();
  renderComputed();
  scheduleSave();
}

function syncInputsFromState() {
  const row = isRowRefs.houses;
  if (row) row.cells.forEach((input, i) => { input.value = state.months[i].houses; });
  monthlyRampRowRefs.forEach((row, i) => { row.qtyInput.value = state.months[i].houses; });
}

function renderComputed() {
  const { months, totals } = computeAll();

  renderEquipTable();
  renderMonthlyRampTable();

  const varTotal = totals.totalCoil + totals.totalScrew + totals.totalDetail + totals.totalOtherVar;

  q('mainQuickStats').innerHTML = `
    <div><div class="quick-stat-label">Y1 매출</div><div class="quick-stat-value">${fmt(totals.totalRevenue)}</div></div>
    <div><div class="quick-stat-label">Y1 매출원가</div><div class="quick-stat-value">${fmt(totals.totalCOGS)}</div></div>
    <div><div class="quick-stat-label">Y1 EBITDA</div><div class="quick-stat-value ${totals.totalEBITDA >= 0 ? 'pos' : 'neg'}">${fmt(totals.totalEBITDA)}</div></div>
  `;
  q('cashQuickStats').innerHTML = `
    <div><div class="quick-stat-label">Y1 말 현금</div><div class="quick-stat-value ${totals.endCash >= 0 ? 'pos' : 'neg'}">${fmt(totals.endCash)}</div></div>
    <div><div class="quick-stat-label">최저 현금</div><div class="quick-stat-value ${totals.minCash >= 0 ? 'pos' : 'neg'}">${fmt(totals.minCash)}</div></div>
  `;

  const totalVarPct = totals.totalRevenue > 0 ? (varTotal / totals.totalRevenue * 100) : 0;
  const varPctEl = q('varPctTotal');
  if (varPctEl) varPctEl.textContent = totalVarPct.toFixed(1) + '%';

  const htTotals = computeHouseTypeTotals(state.houseTypes, state.pricePerSqm);
  const coilUsage = computeCoilUsage(htTotals, state.coilLmPerSqm);
  const coilUsageSqmEl = q('coilUsageTotalSqm');
  if (coilUsageSqmEl) coilUsageSqmEl.textContent = coilUsage.totalSqm.toLocaleString('en-US') + ' sqm';
  const coilUsageLmEl = q('coilUsageTotalLm');
  if (coilUsageLmEl) coilUsageLmEl.textContent = Math.round(coilUsage.totalCoilLm).toLocaleString('en-US') + ' L';
  const coilUsagePerHouseEl = q('coilUsagePerHouse');
  if (coilUsagePerHouseEl) coilUsagePerHouseEl.textContent = Math.round(coilUsage.avgLmPerHouse).toLocaleString('en-US') + ' L/채';

  const isRowTotals = {
    houses: totals.totalHouses,
    revenue: totals.totalRevenue,
    cogs: totals.totalCOGS,
    grossProfit: totals.totalGP,
    sga: totals.totalSGA,
    ebitda: totals.totalEBITDA,
    depreciation: totals.totalDepreciation,
    interest: totals.totalInterest,
    netIncome: totals.totalNI
  };
  renderStatementTable(IS_TABLE_ROWS, isRowRefs, months, isRowTotals);

  const cfRowTotals = {
    cashBegin: state.equityRaise,
    operatingCF: totals.totalOperatingCF,
    investingCF: totals.totalInvestingCF,
    financingCF: totals.totalFinancingCF,
    netCF: totals.totalNetCF,
    cashEnd: totals.endCash
  };
  renderStatementTable(CF_TABLE_ROWS, cfRowRefs, months, cfRowTotals);

  const bsRowTotals = {
    cashEnd: totals.endCash,
    ppe: totals.endPPE,
    totalAssets: totals.endTotalAssets,
    accruedInterest: totals.endAccruedInterest,
    totalLiabilities: totals.endTotalLiabilities,
    equityRaise: state.equityRaise,
    retainedEarnings: totals.endRetainedEarnings,
    equity: totals.endEquity
  };
  renderStatementTable(BS_TABLE_ROWS, bsRowRefs, months, bsRowTotals);

  buildMainChart(months);
  buildCashChart(months);
  syncAllCollapsibleAmounts();
}

/* ---------- collapsible cards ---------- */

function initCollapsibleCards() {
  document.querySelectorAll('.card[data-collapsible]').forEach(card => {
    card.classList.add('collapsed');
    const label = card.querySelector('.section-label');
    if (!label) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-collapse-toggle';
    toggle.innerHTML = '<span class="section-collapse-chevron"></span>';
    toggle.addEventListener('click', () => card.classList.toggle('collapsed'));
    label.appendChild(toggle);
    const badge = document.createElement('span');
    badge.className = 'section-collapse-badge';
    label.insertAdjacentElement('afterend', badge);
  });
  syncAllCollapsibleAmounts();
}

function syncAllCollapsibleAmounts() {
  document.querySelectorAll('.card[data-collapsible]').forEach(card => {
    const totalEl = q(card.dataset.totalId);
    const badgeEl = card.querySelector('.section-collapse-badge');
    if (totalEl && badgeEl) badgeEl.textContent = totalEl.textContent;
  });
}

function renderStatementTable(rowsDef, refs, months, rowTotals) {
  rowsDef.forEach(rowDef => {
    if (!rowDef.editable) {
      const row = refs[rowDef.key];
      months.forEach((m, i) => {
        const val = m[rowDef.key];
        const cell = row.cells[i];
        cell.textContent = fmt(val);
        cell.className = 'tcell tcell-computed' + signClass(val, rowDef);
      });
    }
    const val = rowTotals[rowDef.key];
    const totalTd = refs[rowDef.key].totalTd;
    totalTd.textContent = rowDef.money ? fmt(val) : val;
    totalTd.className = 'tcell tcol-total' + signClass(val, rowDef);
  });
}

/* ---------- bulk-apply sliders ---------- */

function applyPctAll(field, pct) {
  state[field + 'Pct'] = pct;
  state.months.forEach(m => {
    const revenue = m.houses * m.salePrice;
    m[field] = revenue * pct / 100;
  });
}
function applyFixedAll(field, v) { state.months.forEach(m => { m[field] = v; }); }

function bindBulkSlider(id, isPct, applyFn) {
  const elx = q(id);
  const label = q(id + 'Val');
  const val0 = state[id];
  elx.value = val0;
  setSliderFill(elx);
  if (label) label.textContent = isPct ? val0 + '%' : fmt(val0);
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state[id] = val;
    setSliderFill(elx);
    if (label) label.textContent = isPct ? val + '%' : fmt(val);
    applyFn(val);
    syncInputsFromState();
    renderComputed();
    scheduleSave();
  });
}

function bindPricePerSqmSlider() {
  const elx = q('pricePerSqm');
  const label = q('pricePerSqmVal');
  elx.value = state.pricePerSqm;
  setSliderFill(elx);
  label.textContent = fmt(state.pricePerSqm) + '/sqm';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.pricePerSqm = val;
    setSliderFill(elx);
    label.textContent = fmt(val) + '/sqm';
    applyBlendedPriceToMonths();
    syncInputsFromState();
    renderHouseTypeTable();
    renderComputed();
    scheduleSave();
  });
}

function bindCoilLmPerSqmSlider() {
  const elx = q('coilLmPerSqm');
  const label = q('coilLmPerSqmVal');
  elx.value = state.coilLmPerSqm;
  setSliderFill(elx);
  label.textContent = state.coilLmPerSqm.toFixed(1) + ' L/sqm';
  elx.addEventListener('input', () => {
    const val = parseFloat(elx.value);
    state.coilLmPerSqm = val;
    setSliderFill(elx);
    label.textContent = val.toFixed(1) + ' L/sqm';
    renderComputed();
    scheduleSave();
  });
}

function bindScalarInput(id, key) {
  const elx = q(id);
  elx.value = state[key];
  elx.addEventListener('input', () => {
    let val = parseFloat(elx.value);
    if (isNaN(val) || val < 0) val = 0;
    state[key] = val;
    renderComputed();
    scheduleSave();
  });
}

function bindSelect(id, key) {
  const elx = q(id);
  elx.value = state[key];
  elx.addEventListener('change', () => {
    state[key] = parseInt(elx.value, 10);
    renderComputed();
    scheduleSave();
  });
}

function resetAll() {
  state = buildDefaultState();

  ['coilPct', 'screwPct', 'detailPct', 'otherVarPct'].forEach(id => {
    const elx = q(id);
    elx.value = DEFAULTS[id];
    setSliderFill(elx);
    const label = q(id + 'Val');
    if (label) label.textContent = label.dataset.fmt === 'pct' ? (DEFAULTS[id] + '%') : fmt(DEFAULTS[id]);
  });
  ['equityRaise', 'stage1Amount', 'stage2Amount', 'stage3Amount'].forEach(id => {
    q(id).value = DEFAULTS[id];
  });
  const coilLmElx = q('coilLmPerSqm');
  coilLmElx.value = DEFAULTS.coilLmPerSqm;
  setSliderFill(coilLmElx);
  q('coilLmPerSqmVal').textContent = DEFAULTS.coilLmPerSqm.toFixed(1) + ' L/sqm';
  const ppsElx = q('pricePerSqm');
  ppsElx.value = DEFAULTS.pricePerSqm;
  setSliderFill(ppsElx);
  q('pricePerSqmVal').textContent = fmt(DEFAULTS.pricePerSqm) + '/sqm';

  q('stage1Month').value = DEFAULTS.stage1Month;
  q('stage2Month').value = DEFAULTS.stage2Month;
  q('stage3Month').value = DEFAULTS.stage3Month;
  q('equipmentMonth').value = DEFAULTS.equipmentMonth;

  buildHouseTypeSkeleton();
  buildFixedCostSkeleton();
  buildEquipSkeleton();
  buildMonthlyRampSkeleton();
  syncInputsFromState();
  renderHouseTypeTable();
  renderFixedCostTable();
  renderComputed();
  scheduleSave();
}

function initControls() {
  bindPricePerSqmSlider();
  bindBulkSlider('coilPct', true, v => applyPctAll('coil', v));
  bindBulkSlider('screwPct', true, v => applyPctAll('screw', v));
  bindBulkSlider('detailPct', true, v => applyPctAll('detail', v));
  bindBulkSlider('otherVarPct', true, v => applyPctAll('otherVar', v));
  bindCoilLmPerSqmSlider();
  bindScalarInput('equityRaise', 'equityRaise');
  bindScalarInput('stage1Amount', 'stage1Amount');
  bindScalarInput('stage2Amount', 'stage2Amount');
  bindScalarInput('stage3Amount', 'stage3Amount');
  bindSelect('stage1Month', 'stage1Month');
  bindSelect('stage2Month', 'stage2Month');
  bindSelect('stage3Month', 'stage3Month');
  bindSelect('equipmentMonth', 'equipmentMonth');
}

/* ---------- tabs (floating bottom nav) ---------- */

function renderBottomNav() {
  const el = q('bottomNav');
  el.innerHTML = `<div class="bn-thumb" id="bnThumb" style="width:calc((100% - 16px) / ${TABS.length})"></div>` +
    TABS.map((t, i) => `
      <button class="nav-item" data-tab-index="${i}">
        <div class="n-ic">${t.icon}</div>
        <div class="n-lb-row"><span class="n-num">${i + 1}</span><span class="n-lb">${t.label}</span></div>
      </button>
    `).join('');
  el.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => goTab(Number(btn.dataset.tabIndex)));
  });
  updateBottomNavActive();
}

function updateBottomNavActive() {
  document.querySelectorAll('#bottomNav .nav-item').forEach((el, i) => el.classList.toggle('on', i === curTab));
  const thumb = q('bnThumb');
  if (thumb) thumb.style.transform = `translateX(${curTab * 100}%)`;
}

function goTab(i) {
  curTab = i;
  TABS.forEach((t, idx) => {
    q('tab-' + t.id).classList.toggle('on', idx === i);
  });
  updateBottomNavActive();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- sub-tabs (segmented, sliding thumb) ---------- */

function renderSubTabNav(groupKey) {
  const group = SUB_TAB_GROUPS[groupKey];
  const bar = q(group.barId);
  bar.innerHTML = `<div class="sub-tab-thumb" style="width:calc((100% - 8px) / ${group.tabs.length})"></div>` +
    group.tabs.map((t, i) => `<button class="sub-tab-item" data-subtab-index="${i}">${t.label}</button>`).join('');
  bar.querySelectorAll('.sub-tab-item').forEach(btn => {
    btn.addEventListener('click', () => goSubTab(groupKey, Number(btn.dataset.subtabIndex)));
  });
  updateSubTabActive(groupKey);
}

function updateSubTabActive(groupKey) {
  const group = SUB_TAB_GROUPS[groupKey];
  const bar = q(group.barId);
  bar.querySelectorAll('.sub-tab-item').forEach((el, i) => el.classList.toggle('on', i === group.cur));
  const thumb = bar.querySelector('.sub-tab-thumb');
  if (thumb) thumb.style.transform = `translateX(${group.cur * 100}%)`;
}

function goSubTab(groupKey, i) {
  const group = SUB_TAB_GROUPS[groupKey];
  group.cur = i;
  group.tabs.forEach((t, idx) => {
    q('subtab-' + t.id).classList.toggle('on', idx === i);
  });
  updateSubTabActive(groupKey);
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadStateFromServer();
  initControls();
  initCollapsibleCards();
  buildTableSkeleton();
  buildEquipSkeleton();
  buildHouseTypeSkeleton();
  buildFixedCostSkeleton();
  buildMonthlyRampSkeleton();
  renderHouseTypeTable();
  renderFixedCostTable();
  renderComputed();
  renderBottomNav();
  goTab(0);
  renderSubTabNav('assumptions');
  goSubTab('assumptions', 0);
  renderSubTabNav('capex');
  goSubTab('capex', 0);
  renderSubTabNav('table');
  goSubTab('table', 0);
  const resetBtn = q('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  q('houseTypeAddBtn').addEventListener('click', onHouseTypeAdd);

  q('itemModalClose').addEventListener('click', closeItemModal);
  q('itemModalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeItemModal();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeItemModal();
  });
});
