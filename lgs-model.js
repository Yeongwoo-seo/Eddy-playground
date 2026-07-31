/* LGS Frame Y1 재무모델 — 슬라이더 기반 시뮬레이션 */

const MONTH_PHASE = ['Closing', 'Closing', 'Build', 'Build', 'Pilot', 'Pilot', 'Scale', 'Scale', 'Scale', 'Expand', 'Expand', 'Expand'];

const DEFAULTS = {
  salePrice: 44917,
  coilPct: 30,
  screwPct: 5,
  detailPct: 10,
  otherVarPct: 5,
  fixedProdCost: 24125,
  sgaMonthly: 58333,
  otherCostMonthly: 6917,
  equityRaise: 350000,
  stage1Amount: 40000,
  stage1Month: 1,
  stage2Amount: 40000,
  stage2Month: 5,
  houses: [0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1]
};

let state = clone(DEFAULTS);

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function fmt(n) {
  const r = Math.round(n);
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r).toLocaleString('en-US');
}

function fmtK(n) {
  const r = Math.round(n / 1000);
  return (r < 0 ? '-A$' : 'A$') + Math.abs(r) + 'k';
}

function varPctTotal() {
  return state.coilPct + state.screwPct + state.detailPct + state.otherVarPct;
}

function computeMonths() {
  const months = [];
  let cash = state.equityRaise;
  const varPct = varPctTotal() / 100;

  for (let i = 0; i < 12; i++) {
    const houses = state.houses[i];
    const revenue = houses * state.salePrice;
    const varCost = revenue * varPct;
    const cogs = varCost + state.fixedProdCost;
    const grossProfit = revenue - cogs;
    const sga = state.sgaMonthly;
    const ebitda = grossProfit - sga;
    const netIncome = ebitda - state.otherCostMonthly;

    let capex = 0;
    if (i + 1 === Number(state.stage1Month)) capex += state.stage1Amount;
    if (i + 1 === Number(state.stage2Month)) capex += state.stage2Amount;

    cash += ebitda - capex;

    months.push({
      idx: i, phase: MONTH_PHASE[i], houses, revenue, varCost, cogs,
      grossProfit, sga, ebitda, netIncome, capex, cashEnd: cash
    });
  }
  return months;
}

function q(id) { return document.getElementById(id); }

function setSliderFill(el) {
  const min = Number(el.min), max = Number(el.max), val = Number(el.value);
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  el.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--grey-200) ${pct}%, var(--grey-200) 100%)`;
}

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

function render() {
  const months = computeMonths();

  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalCOGS = months.reduce((s, m) => s + m.cogs, 0);
  const totalGP = totalRevenue - totalCOGS;
  const totalSGA = months.reduce((s, m) => s + m.sga, 0);
  const totalEBITDA = months.reduce((s, m) => s + m.ebitda, 0);
  const totalNI = months.reduce((s, m) => s + m.netIncome, 0);
  const totalHouses = months.reduce((s, m) => s + m.houses, 0);
  const endCash = months[11].cashEnd;
  const minCash = Math.min(state.equityRaise, ...months.map(m => m.cashEnd));
  const gpMargin = totalRevenue > 0 ? (totalGP / totalRevenue * 100) : 0;
  const beIdx = months.findIndex(m => m.ebitda >= 0);

  q('statRevenue').textContent = fmt(totalRevenue);
  q('statRevenueSub').textContent = totalHouses + '채 · 채당 ' + fmt(state.salePrice);
  q('statCOGS').textContent = fmt(totalCOGS);
  q('statCOGSSub').textContent = '변동비 ' + varPctTotal() + '% + 고정생산비';
  const gpEl = q('statGP');
  gpEl.textContent = fmt(totalGP);
  gpEl.className = 'stat-value ' + (totalGP >= 0 ? 'pos' : 'neg');
  q('statGPSub').textContent = '매출총이익률 ' + gpMargin.toFixed(1) + '%';
  const cashEl = q('statCash');
  cashEl.textContent = fmt(endCash);
  cashEl.className = 'stat-value ' + (endCash >= 0 ? 'pos' : 'neg');
  q('statCashSub').textContent = '최저 현금 ' + fmt(minCash);

  q('statEBITDA').textContent = fmt(totalEBITDA);
  q('statNI').textContent = fmt(totalNI);
  q('statBreakeven').textContent = beIdx >= 0 ? ('M' + (beIdx + 1)) : 'Y1 내 미달성';

  const warnBanner = q('cashWarning');
  if (minCash < 0) {
    warnBanner.style.display = 'flex';
    warnBanner.querySelector('span').textContent = '현금이 초기 투자금 아래로 내려갑니다 — 최저 ' + fmt(minCash) + '. 판매가·비용·초기 투자금을 조정해보세요.';
  } else {
    warnBanner.style.display = 'none';
  }

  q('varPctTotal').textContent = varPctTotal() + '%';
  q('houseTotal').innerHTML = 'Y1 합계 <b>' + totalHouses + '채</b> (스타터 파이프라인 기준 12채)';

  const tbody = q('tableBody');
  tbody.innerHTML = '';
  months.forEach((m, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="tcell tcell-month">M${i + 1}<span class="tphase">${m.phase}</span></td>
      <td class="tcell">${m.houses}</td>
      <td class="tcell">${fmt(m.revenue)}</td>
      <td class="tcell">${fmt(m.cogs)}</td>
      <td class="tcell ${m.grossProfit < 0 ? 'neg' : ''}">${fmt(m.grossProfit)}</td>
      <td class="tcell">${fmt(m.sga)}</td>
      <td class="tcell ${m.ebitda < 0 ? 'neg' : 'pos'}">${fmt(m.ebitda)}</td>
      <td class="tcell ${m.cashEnd < 0 ? 'neg' : ''}">${fmt(m.cashEnd)}</td>
    `;
    tbody.appendChild(tr);
  });
  const trTotal = document.createElement('tr');
  trTotal.className = 'trow-total';
  trTotal.innerHTML = `
    <td class="tcell tcell-month">Y1 합계</td>
    <td class="tcell">${totalHouses}</td>
    <td class="tcell">${fmt(totalRevenue)}</td>
    <td class="tcell">${fmt(totalCOGS)}</td>
    <td class="tcell ${totalGP < 0 ? 'neg' : ''}">${fmt(totalGP)}</td>
    <td class="tcell">${fmt(totalSGA)}</td>
    <td class="tcell ${totalEBITDA < 0 ? 'neg' : 'pos'}">${fmt(totalEBITDA)}</td>
    <td class="tcell ${endCash < 0 ? 'neg' : ''}">${fmt(endCash)}</td>
  `;
  tbody.appendChild(trTotal);

  buildMainChart(months);
  buildCashChart(months);
}

function bindSlider(id, key, isFloat) {
  const elx = q(id);
  const label = q(id + 'Val');
  const update = () => {
    const val = isFloat ? parseFloat(elx.value) : parseInt(elx.value, 10);
    state[key] = val;
    setSliderFill(elx);
    if (label) label.textContent = label.dataset.fmt === 'pct' ? (val + '%') : fmt(val);
    render();
  };
  elx.addEventListener('input', update);
  elx.value = state[key];
  setSliderFill(elx);
  if (label) label.textContent = label.dataset.fmt === 'pct' ? (state[key] + '%') : fmt(state[key]);
}

function bindSelect(id, key) {
  const elx = q(id);
  elx.value = state[key];
  elx.addEventListener('change', () => {
    state[key] = parseInt(elx.value, 10);
    render();
  });
}

function buildHouseSliders() {
  const wrap = q('houseSliders');
  wrap.innerHTML = '';
  state.houses.forEach((val, i) => {
    const row = document.createElement('div');
    row.className = 'house-row';
    row.innerHTML = `
      <div class="house-label">M${i + 1}<span class="house-phase">${MONTH_PHASE[i]}</span></div>
      <input type="range" class="slider house-slider" id="house-${i}" min="0" max="8" step="1" value="${val}">
      <div class="house-val" id="house-${i}Val">${val}채</div>
    `;
    wrap.appendChild(row);
  });
  state.houses.forEach((val, i) => {
    const elx = q('house-' + i);
    const label = q('house-' + i + 'Val');
    setSliderFill(elx);
    elx.addEventListener('input', () => {
      state.houses[i] = parseInt(elx.value, 10);
      label.textContent = state.houses[i] + '채';
      setSliderFill(elx);
      render();
    });
  });
}

function resetAll() {
  state = clone(DEFAULTS);
  initControls();
  render();
}

function initControls() {
  bindSlider('salePrice', 'salePrice');
  bindSlider('coilPct', 'coilPct');
  bindSlider('screwPct', 'screwPct');
  bindSlider('detailPct', 'detailPct');
  bindSlider('otherVarPct', 'otherVarPct');
  bindSlider('fixedProdCost', 'fixedProdCost');
  bindSlider('sgaMonthly', 'sgaMonthly');
  bindSlider('otherCostMonthly', 'otherCostMonthly');
  bindSlider('equityRaise', 'equityRaise');
  bindSlider('stage1Amount', 'stage1Amount');
  bindSlider('stage2Amount', 'stage2Amount');
  bindSelect('stage1Month', 'stage1Month');
  bindSelect('stage2Month', 'stage2Month');
  buildHouseSliders();
}

window.addEventListener('DOMContentLoaded', () => {
  initControls();
  render();
  q('resetBtn').addEventListener('click', resetAll);
});
