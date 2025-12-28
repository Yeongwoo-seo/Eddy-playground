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
    preview: document.getElementById('framePreview'),
    modal: document.getElementById('modalOverlay'),
    partName: document.getElementById('displayPartName'),
    partDesc: document.getElementById('displayPartDesc'),
    tableBody: document.getElementById('resultTableBody'),
    btns: document.querySelectorAll('.part-btn')
};

// 입력 리스너
el.width.addEventListener('input', (e) => { state.width = Number(e.target.value); updatePreview(); });
el.height.addEventListener('input', (e) => { state.height = Number(e.target.value); updatePreview(); });
el.ng.addEventListener('change', (e) => { 
    state.hasNG = e.target.checked; 
    document.getElementById('ngCountWrapper').classList.toggle('disabled', !state.hasNG);
    updatePreview(); 
});
el.ngCount.addEventListener('input', (e) => { state.ngCount = Number(e.target.value); updatePreview(); });
el.autoGap.addEventListener('change', (e) => { 
    state.autoGap = e.target.checked; 
    document.getElementById('manualGapWrapper').classList.toggle('disabled', state.autoGap);
    document.getElementById('inputGap').readOnly = state.autoGap;
    updatePreview(); 
});
el.manualGap.addEventListener('input', (e) => { state.manualGap = Number(e.target.value); updatePreview(); });

function calculateGap(L) {
    if (L <= 0) return 400;
    let x = 1;
    while (L / x > 450) x++;
    return L / x;
}

function updatePreview() {
    if (!state.width || !state.height) return;
    const ratio = state.width / state.height;
    let w = ratio >= 1 ? 140 : 140 * ratio;
    let h = ratio >= 1 ? 140 / ratio : 140;
    el.preview.style.width = `${w}px`;
    el.preview.style.height = `${h}px`;
    el.preview.innerHTML = '';

    const gap = state.autoGap ? calculateGap(state.width) : state.manualGap;
    const st2Count = Math.floor(state.width / gap);

    // ST2 (세로 점선)
    for (let i = 1; i < st2Count; i++) {
        const line = document.createElement('div');
        line.className = 'st2-line';
        line.style.left = `${(100 / state.width) * (gap * i)}%`;
        el.preview.appendChild(line);
    }

    // NG (가로 파란선)
    if (state.hasNG) {
        for (let i = 1; i <= state.ngCount; i++) {
            const line = document.createElement('div');
            line.className = 'ng-line';
            line.style.top = `${(100 / (state.ngCount + 1)) * i}%`;
            el.preview.appendChild(line);
        }
    }
}

function openModal() {
    if (!state.width || !state.height) return alert("가로, 세로를 입력해주세요.");
    state.calculatedGap = state.autoGap ? calculateGap(state.width) : state.manualGap;
    state.st2Count = Math.max(0, Math.floor(state.width / state.calculatedGap) - 1);
    renderTable();
    el.modal.classList.add('active');
}

function closeModal() { el.modal.classList.remove('active'); }

function selectPart(part) {
    state.currentPart = part;
    el.btns.forEach(btn => btn.classList.toggle('active', btn.innerText === part));
    el.partName.innerText = `${part} 데이터`;
    renderTable();
}

function renderTable() {
    const type = state.currentPart;
    const len = type.includes('ST') ? state.height : state.width;
    const gap = state.calculatedGap;
    let html = '';

    const addRow = (label, v1, v2 = null) => {
        if (v2 !== null) html += `<tr><td class="data-key">${label}</td><td class="data-value">${v1}</td><td class="data-value">${v2}</td></tr>`;
        else html += `<tr><td class="data-key">${label}</td><td colspan="2" class="data-value-center">${v1}</td></tr>`;
    };

    if (type === 'ST1' || type === 'ST2') {
        el.partDesc.innerText = type === 'ST1' ? '양 끝 기둥 (2개)' : `중간 기둥 (${state.st2Count}개)`;
        addRow('Lip Cut', '0', '41'); addRow('Dimple', '18.5');
        if (state.hasNG) {
            for (let i = 1; i <= state.ngCount; i++) {
                let pos = (len / (state.ngCount + 1)) * i;
                addRow('Lip Cut', (pos - 20.5).toFixed(1), (pos + 20.5).toFixed(1));
                addRow('Dimple', pos.toFixed(1));
            }
        }
        addRow('Lip Cut', (len - 41).toFixed(1), (len - 4).toFixed(1)); addRow('Dimple', (len - 18.5).toFixed(1));
    } else if (type === 'TP1') {
        el.partDesc.innerText = '상/하부 트랙 (2개)';
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
        el.partDesc.innerText = state.hasNG ? `중간 지지대 (${state.ngCount}개)` : '미사용';
        if (!state.hasNG) html = '<tr><td colspan="3" style="text-align:center; padding:40px; color:#B0B8C1;">NG 미사용</td></tr>';
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
