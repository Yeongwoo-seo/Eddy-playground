const state = {
    width: 0, height: 0, hasNG: true, ngCount: 1,
    autoGap: true, manualGap: 400,
    currentPart: 'ST1', calculatedGap: 0, st2Count: 0
};

const el = {
    width: document.getElementById('inputWidth'),
    height: document.getElementById('inputHeight'),
    ng: document.getElementById('toggleNG'),
    ngCount: document.getElementById('ngCount'),
    autoGap: document.getElementById('toggleAutoGap'),
    manualGap: document.getElementById('inputGap'),
    preview: document.getElementById('svgContainer'),
    modal: document.getElementById('modalOverlay'),
    partName: document.getElementById('displayPartName'),
    tableBody: document.getElementById('resultTableBody'),
    btns: document.querySelectorAll('.part-btn')
};

// --- 입력 처리 ---
const updateAll = () => { updatePreview(); };
el.width.addEventListener('input', (e) => { state.width = Number(e.target.value); updateAll(); });
el.height.addEventListener('input', (e) => { state.height = Number(e.target.value); updateAll(); });
el.ng.addEventListener('change', (e) => { 
    state.hasNG = e.target.checked; 
    document.getElementById('ngCountWrapper').classList.toggle('disabled', !state.hasNG);
    updateAll(); 
});
el.ngCount.addEventListener('input', (e) => { state.ngCount = Number(e.target.value); updateAll(); });
el.autoGap.addEventListener('change', (e) => { 
    state.autoGap = e.target.checked; 
    document.getElementById('manualGapWrapper').classList.toggle('disabled', state.autoGap);
    document.getElementById('inputGap').readOnly = state.autoGap;
    updateAll(); 
});
el.manualGap.addEventListener('input', (e) => { state.manualGap = Number(e.target.value); updateAll(); });

function calculateGap(L) {
    if (L <= 0) return 400;
    let x = 1;
    while (L / x > 450) x++;
    return L / x;
}

// --- 시각화 (직사각형 와이드) ---
function updatePreview() {
    const wVal = state.width || 0;
    const hVal = state.height || 0;
    el.preview.innerHTML = '';
    if (wVal <= 0 || hVal <= 0) return;

    const containerW = document.getElementById('visualizerArea').clientWidth - 40;
    const maxH = 160;
    const scale = Math.min(containerW / wVal, maxH / hVal, 1);
    
    const dW = wVal * scale;
    const dH = hVal * scale;
    const gap = state.autoGap ? calculateGap(wVal) : (state.manualGap || 400);
    const padding = 40;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", dW + padding);
    svg.setAttribute("height", dH + padding);
    
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("transform", `translate(${padding}, ${padding/2})`);
    svg.appendChild(g);

    // 프레임
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", dW); rect.setAttribute("height", dH);
    rect.setAttribute("fill", "white"); rect.setAttribute("stroke", "#191F28"); rect.setAttribute("stroke-width", "2");
    g.appendChild(rect);

    // 치수선
    const tT = document.createElementNS(svgNS, "text");
    tT.setAttribute("x", dW/2); tT.setAttribute("y", -10); tT.setAttribute("text-anchor", "middle");
    tT.setAttribute("class", "dim-text"); tT.textContent = `${wVal} mm`;
    g.appendChild(tT);

    const lT = document.createElementNS(svgNS, "text");
    lT.setAttribute("x", -padding + 5); lT.setAttribute("y", dH/2);
    lT.setAttribute("class", "dim-text"); lT.setAttribute("style", "writing-mode: vertical-lr; transform: rotate(180deg); transform-origin: center;");
    lT.textContent = `${hVal} mm`;
    g.appendChild(lT);

    // ST2
    const st2Cnt = Math.floor(wVal / gap);
    for (let i = 1; i < st2Cnt; i++) {
        const xPos = (gap * i / wVal) * dW;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", xPos); line.setAttribute("y1", 0); line.setAttribute("x2", xPos); line.setAttribute("y2", dH);
        line.setAttribute("stroke", "#D1D6DB"); line.setAttribute("stroke-dasharray", "4,3"); g.appendChild(line);
    }

    // NG
    if (state.hasNG) {
        for (let i = 1; i <= state.ngCount; i++) {
            const yPos = (i / (state.ngCount + 1)) * dH;
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", 0); line.setAttribute("y1", yPos); line.setAttribute("x2", dW); line.setAttribute("y2", yPos);
            line.setAttribute("stroke", "#3182F6"); line.setAttribute("stroke-width", "1.5"); g.appendChild(line);
        }
    }
    el.preview.appendChild(svg);
}

// --- 모달 로직 ---
function openModal() {
    if (!state.width || !state.height) return alert("가로, 세로를 입력해주세요.");
    state.calculatedGap = state.autoGap ? calculateGap(state.width) : (state.manualGap || 400);
    state.st2Count = Math.max(0, Math.floor(state.width / state.calculatedGap) - 1);
    renderTable();
    el.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() { el.modal.classList.remove('active'); document.body.style.overflow = ''; }

function selectPart(part) {
    state.currentPart = part;
    el.btns.forEach(btn => btn.classList.toggle('active', btn.innerText === part));
    renderTable();
}

function renderTable() {
    const type = state.currentPart;
    const len = (type.includes('ST')) ? state.height : state.width;
    const gap = state.calculatedGap;
    
    // 헤더 정보 업데이트
    document.getElementById('displayPartName').innerText = type;
    document.getElementById('displayStickLen').innerText = `${(len - 4).toLocaleString()} mm`;
    
    let makeCount = 2;
    if (type === 'ST2') makeCount = state.st2Count;
    if (type === 'NG1') makeCount = state.hasNG ? state.ngCount : 0;
    document.getElementById('displayMakeCount').innerText = `${makeCount} 개`;

    let html = '';
    const addRow = (label, v1, v2 = null) => {
        if (v2 !== null) html += `<tr><td class="data-key">${label}</td><td class="data-value">${v1}</td><td class="data-value">${v2}</td></tr>`;
        else html += `<tr><td class="data-key">${label}</td><td colspan="2" class="data-value-center">${v1}</td></tr>`;
    };

    if (type === 'ST1' || type === 'ST2') {
        addRow('Swage', '0', '41'); addRow('Dimple', '18.5');
        if (state.hasNG) {
            for (let i = 1; i <= state.ngCount; i++) {
                let pos = (len / (state.ngCount + 1)) * i;
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
            }
        }
        addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
    } else if (type === 'TP1') {
        addRow('Lip Cut', '0', '41'); addRow('Dimple', '18.5');
        let k = 1;
        while (gap * k < len - 25) {
            let pos = gap * k;
            addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
            addRow('Dimple', pos.toFixed(1));
            k++;
        }
        addRow('Lip Cut', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
    } else if (type === 'NG1') {
        if (!state.hasNG) html = '<tr><td colspan="3" style="text-align:center; padding:40px;">NG 미사용</td></tr>';
        else {
            addRow('Swage', '0', '41'); addRow('Dimple', '18.5');
            let k = 1;
            while (gap * k < len - 25) {
                let pos = gap * k;
                addRow('WebNotch', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
                k++;
            }
            addRow('Swage', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
        }
    }
    el.tableBody.innerHTML = html;
}
