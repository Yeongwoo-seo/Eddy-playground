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
    { category: 'fixedProd', label: '공장·창고 임대료', note: 'Western Sydney 산업단지 창고 (~450㎡, 순임대료 ~A$160/㎡/yr 기준)', monthly: 6000 },
    { category: 'fixedProd', label: '공장 전기·수도', note: 'SP120 롤포밍기 가동 전력 + 용수/폐수', monthly: 1500 },
    { category: 'fixedProd', label: '생산직 기본급 (오퍼레이터 2명)', note: '램프업 단계 최소 유지 인력, Fair Work 금속제조업 award 기준', monthly: 9000 },
    { category: 'fixedProd', label: '소모품·공구 유지보수', note: '드릴비트·블레이드·윤활유 등 소모품 교체', monthly: 1000 },
    { category: 'fixedProd', label: '산업폐기물 처리', note: '철스크랩·자재 폐기물 수거', monthly: 400 },
    { category: 'sga', label: '대표이사 급여', note: '경영·전략·영업 총괄', monthly: 10000 },
    { category: 'sga', label: '견적·영업 담당 급여', note: '고객 상담, 견적, 계약 관리', monthly: 7500 },
    { category: 'sga', label: '관리·회계 담당 급여 (파트타임)', note: '경리, 총무, 발주 관리', monthly: 3500 },
    { category: 'sga', label: '사업 보험료', note: '배상책임(Public Liability) + icare 산재보험 (제조업 평균 요율 ~1.8~4.8%)', monthly: 2900 },
    { category: 'sga', label: 'FrameCAD Steelwise 라이선스', note: '설계·디테일링·엔지니어링 소프트웨어 구독', monthly: 1500 },
    { category: 'sga', label: '회계·법무 자문료', note: '외부 회계사 기장, 세무신고, 계약 검토', monthly: 1800 },
    { category: 'sga', label: '마케팅·영업비', note: '웹사이트, 온라인 광고, 전시 참가', monthly: 2000 },
    { category: 'sga', label: '차량 유지비', note: '배송·현장방문용 유트(Ute) 리스+연료+보험', monthly: 1600 },
    { category: 'sga', label: '사무실 임대료·유틸리티', note: '공장 내 사무 공간 또는 소규모 별도 사무실', monthly: 1200 },
    { category: 'sga', label: '통신·IT', note: '인터넷, 휴대폰, 클라우드 SaaS 구독', monthly: 600 },
    { category: 'sga', label: '인증·컴플라이언스', note: '구조 엔지니어 서명, WHS 컴플라이언스, CDC 인증 관련', monthly: 1800 },
    { category: 'sga', label: '기타 관리비', note: '사무용품, 소모품, 예비비', monthly: 1000 },
    { category: 'other', label: '설비 감가상각비', note: 'SP120 Stage1+2 총 A$80,000, 내용연수 7년 정액법', monthly: 950 },
    { category: 'other', label: '장비·공구 감가상각비', note: '포크리프트 등 초기 장비, 내용연수 5년', monthly: 90 },
    { category: 'other', label: '설비 리스·대출 이자', note: 'SP120 자산금융 가정 이자비용', monthly: 560 }
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
    { label: '포크리프트 (중고)', note: 'Facebook Marketplace Sydney', unitPrice: 4000, qty: 1 },
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
  const totals = { fixedProd: 0, sga: 0, other: 0 };
  items.forEach(it => { totals[it.category] += it.monthly; });
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
      otherCost: fc.other
    };
  });
}

function buildDefaultEquipment() {
  return DEFAULTS.equipmentItems.map(item => ({ ...item }));
}

function buildDefaultFixedCostItems() {
  return DEFAULTS.fixedCostItems.map(item => ({ ...item }));
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

let rowRefs = [];
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
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r).toLocaleString('en-US');
}

function fmtK(n) {
  const r = Math.round(n / 1000);
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r) + 'k';
}

function q(id) { return document.getElementById(id); }

function computeAll() {
  const months = [];
  let cash = state.equityRaise;
  const totalEquipmentCapex = state.equipmentItems.reduce((s, it) => s + it.unitPrice * it.qty, 0);

  state.months.forEach((m, i) => {
    const revenue = m.houses * m.salePrice;
    const varCost = m.coil + m.screw + m.detail + m.otherVar;
    const cogs = varCost + m.fixedProd;
    const grossProfit = revenue - cogs;
    const ebitda = grossProfit - m.sga;
    const netIncome = ebitda - m.otherCost;

    let capex = 0;
    if (i + 1 === Number(state.stage1Month)) capex += state.stage1Amount;
    if (i + 1 === Number(state.stage2Month)) capex += state.stage2Amount;
    if (i + 1 === Number(state.stage3Month)) capex += state.stage3Amount;
    if (i + 1 === Number(state.equipmentMonth)) capex += totalEquipmentCapex;
    cash += ebitda - capex;

    months.push({
      idx: i, phase: MONTH_PHASE[i], houses: m.houses, salePrice: m.salePrice,
      coil: m.coil, screw: m.screw, detail: m.detail, otherVar: m.otherVar,
      fixedProd: m.fixedProd, sga: m.sga, otherCost: m.otherCost,
      revenue, varCost, cogs, grossProfit, ebitda, netIncome, capex, cashEnd: cash
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
    totalOtherCost: sum(months, 'otherCost'),
    totalEBITDA: sum(months, 'ebitda'),
    totalNI: sum(months, 'netIncome'),
    totalCapex: sum(months, 'capex'),
    totalMachineCapex: state.stage1Amount + state.stage2Amount + state.stage3Amount,
    totalEquipmentCapex,
    totalHouses: sum(months, 'houses'),
    endCash: months[11].cashEnd,
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
    labelTd.innerHTML = `<span class="equip-label">${item.label}</span><span class="equip-note">${item.note}</span>`;
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
    priceTd.appendChild(priceInput);
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

function syncEquipInputsFromState() {
  equipRowRefs.forEach((row, i) => {
    const item = state.equipmentItems[i];
    row.priceInput.value = item.unitPrice;
    row.qtyInput.value = item.qty;
  });
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
      labelTd.innerHTML = `<span class="equip-label">${item.label}</span><span class="equip-note">${item.note}</span>`;
      tr.appendChild(labelTd);

      const monthlyInput = document.createElement('input');
      monthlyInput.type = 'number';
      monthlyInput.className = 'equip-input';
      monthlyInput.min = '0';
      monthlyInput.step = '1';
      monthlyInput.value = item.monthly;
      monthlyInput.dataset.i = i;
      monthlyInput.addEventListener('input', onFixedCostInput);
      const monthlyTd = document.createElement('td');
      monthlyTd.appendChild(monthlyInput);
      tr.appendChild(monthlyTd);

      tbody.appendChild(tr);
      fixedCostRowRefs.push({ i, input: monthlyInput });
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

function applyFixedCostTotals() {
  const totals = computeFixedCostTotals(state.fixedCostItems);
  applyFixedAll('fixedProd', totals.fixedProd);
  applyFixedAll('sga', totals.sga);
  applyFixedAll('otherCost', totals.other);
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

/* ---------- table (editable) ---------- */

const EDIT_KEYS = ['houses', 'salePrice', 'coil', 'screw', 'detail', 'otherVar', 'fixedProd', 'sga', 'otherCost'];

function buildTableSkeleton() {
  const tbody = q('tableBody');
  tbody.innerHTML = '';
  rowRefs = [];

  for (let i = 0; i < 12; i++) {
    const tr = document.createElement('tr');
    const m = state.months[i];

    const monthTd = document.createElement('td');
    monthTd.className = 'tcell tcell-month';
    monthTd.innerHTML = `M${i + 1}<span class="tphase">${MONTH_PHASE[i]}</span>`;
    tr.appendChild(monthTd);

    const inputs = {};
    EDIT_KEYS.forEach(key => {
      const td = document.createElement('td');
      td.className = 'tcell';
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'tinput';
      input.min = '0';
      input.step = key === 'houses' ? '1' : '1';
      input.value = m[key];
      input.dataset.i = i;
      input.dataset.key = key;
      input.addEventListener('input', onCellInput);
      td.appendChild(input);
      tr.appendChild(td);
      inputs[key] = input;

      // insert revenue as a computed cell right after salePrice
      if (key === 'salePrice') {
        const revTd = document.createElement('td');
        revTd.className = 'tcell tcell-computed';
        tr.appendChild(revTd);
        inputs._revenue = revTd;
      }
    });

    const gpTd = document.createElement('td');
    gpTd.className = 'tcell tcell-computed';
    tr.appendChild(gpTd);
    const ebitdaTd = document.createElement('td');
    ebitdaTd.className = 'tcell tcell-computed';
    tr.appendChild(ebitdaTd);
    const cashTd = document.createElement('td');
    cashTd.className = 'tcell tcell-computed';
    tr.appendChild(cashTd);

    tbody.appendChild(tr);
    rowRefs.push({ inputs, gpTd, ebitdaTd, cashTd });
  }

  const totalTr = document.createElement('tr');
  totalTr.className = 'trow-total';
  totalTr.id = 'totalRow';
  tbody.appendChild(totalTr);
}

function onCellInput(e) {
  const inp = e.target;
  const i = Number(inp.dataset.i);
  const key = inp.dataset.key;
  let val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) val = 0;
  state.months[i][key] = val;
  if (key === 'houses' || key === 'salePrice') {
    reapplyVariableCostPcts([i]);
    syncInputsFromState();
  }
  renderComputed();
  scheduleSave();
}

function syncInputsFromState() {
  rowRefs.forEach((row, i) => {
    const m = state.months[i];
    EDIT_KEYS.forEach(key => { row.inputs[key].value = m[key]; });
  });
}

function renderComputed() {
  const { months, totals } = computeAll();

  renderEquipTable();

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

  months.forEach((m, i) => {
    const row = rowRefs[i];
    row.inputs._revenue.textContent = fmt(m.revenue);
    row.gpTd.textContent = fmt(m.grossProfit);
    row.gpTd.className = 'tcell tcell-computed' + (m.grossProfit < 0 ? ' neg' : '');
    row.ebitdaTd.textContent = fmt(m.ebitda);
    row.ebitdaTd.className = 'tcell tcell-computed' + (m.ebitda < 0 ? ' neg' : ' pos');
    row.cashTd.textContent = fmt(m.cashEnd);
    row.cashTd.className = 'tcell tcell-computed' + (m.cashEnd < 0 ? ' neg' : '');
  });

  const totalTr = q('totalRow');
  totalTr.innerHTML = `
    <td class="tcell tcell-month">Y1 합계</td>
    <td class="tcell">${totals.totalHouses}</td>
    <td class="tcell">-</td>
    <td class="tcell">${fmt(totals.totalRevenue)}</td>
    <td class="tcell">${fmt(totals.totalCoil)}</td>
    <td class="tcell">${fmt(totals.totalScrew)}</td>
    <td class="tcell">${fmt(totals.totalDetail)}</td>
    <td class="tcell">${fmt(totals.totalOtherVar)}</td>
    <td class="tcell">${fmt(totals.totalFixedProd)}</td>
    <td class="tcell">${fmt(totals.totalSGA)}</td>
    <td class="tcell">${fmt(totals.totalOtherCost)}</td>
    <td class="tcell ${totals.totalGP < 0 ? 'neg' : ''}">${fmt(totals.totalGP)}</td>
    <td class="tcell ${totals.totalEBITDA < 0 ? 'neg' : 'pos'}">${fmt(totals.totalEBITDA)}</td>
    <td class="tcell ${totals.endCash < 0 ? 'neg' : ''}">${fmt(totals.endCash)}</td>
  `;

  buildMainChart(months);
  buildCashChart(months);
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
  syncInputsFromState();
  syncEquipInputsFromState();
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
  buildTableSkeleton();
  buildEquipSkeleton();
  buildHouseTypeSkeleton();
  buildFixedCostSkeleton();
  renderHouseTypeTable();
  renderFixedCostTable();
  renderComputed();
  renderBottomNav();
  goTab(0);
  renderSubTabNav('assumptions');
  goSubTab('assumptions', 0);
  renderSubTabNav('capex');
  goSubTab('capex', 0);
  const resetBtn = q('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  q('houseTypeAddBtn').addEventListener('click', onHouseTypeAdd);
});
