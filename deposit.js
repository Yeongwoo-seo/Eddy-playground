const STORAGE_KEY = 'lunchDepositState_v1';
// same shared Supabase project as planner.html/boarding-pass.html — deposit
// screenshots go to this bucket as real files instead of base64 strings
// stuffed into localStorage, so a thumb doesn't just vanish if this device's
// storage gets cleared or evicted.
const SUPABASE_URL = 'https://dhtstqnksjoyyshnhksv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHN0cW5rc2pveXlzaG5oa3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjIyNzQsImV4cCI6MjA5ODUzODI3NH0.FMZdCXntYJKxQeYNwfrsy1liJcHIkD2inJ4NzbwLzd4';
const SUPABASE_PHOTO_BUCKET = 'dev-assets';

let state = { depositors: [], applicants: [], history: [] };

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) state = JSON.parse(raw);
    } catch (e) {
        console.warn('failed to load saved state', e);
    }
    state.depositors = state.depositors || [];
    state.applicants = state.applicants || [];
    state.history = state.history || [];
    // reset thumbnails uploaded before this switched to Storage — those are
    // base64 strings saved straight into localStorage, so there's nothing to
    // migrate; just clear them (the depositor/history entry itself stays).
    state.depositors.forEach(d => { if (d.thumb && d.thumb.startsWith('data:')) d.thumb = ''; });
    state.history.forEach(h => { if (h.thumb && h.thumb.startsWith('data:')) h.thumb = ''; });
    saveState();
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('failed to save state (storage full?)', e);
    }
}

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function normalizeName(name) {
    return (name || '').replace(/\s+/g, '').toLowerCase();
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}

// --- 토스트 & 오버레이 ---
let toastTimer = null;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function showOcrOverlay(show, text) {
    document.getElementById('ocrOverlay').classList.toggle('active', show);
    if (text) document.getElementById('ocrText').innerHTML = text;
}

// --- 이미지 리사이즈 (Blob — 서버 업로드용) ---
function resizeImageToBlob(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    const scale = maxDim / Math.max(width, height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('canvas toBlob failed')), 'image/jpeg', quality || 0.75);
            };
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- 서버 업로드 (Supabase Storage) ---
async function uploadDepositPhoto(blob) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const path = `deposit-photos/${id}.jpg`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_PHOTO_BUCKET}/${path}`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'image/jpeg',
        },
        body: blob,
    });
    if (!res.ok) throw new Error(`이미지 업로드 실패 (${res.status})`);
    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_PHOTO_BUCKET}/${path}`;
}

// --- OCR 결과에서 이름/금액 추측 ---
function findKoreanName(lines) {
    const stopWords = ['입금', '출금', '계좌', '조회', '잔액', '거래', '내역', '확인', '이체', '은행',
        '통장', '국민', '신한', '우리', '하나', '농협', '카카오', '토스', '뱅크', '송금', '적요'];
    const nameRegex = /[가-힣]{2,4}/g;
    for (const line of lines) {
        const matches = line.match(nameRegex) || [];
        for (const m of matches) {
            if (!stopWords.some(w => m.includes(w))) return m;
        }
    }
    return '';
}

function findEnglishName(lines) {
    const stopWords = ['BANK', 'DEPOSIT', 'WITHDRAW', 'WITHDRAWAL', 'ACCOUNT', 'BALANCE', 'TRANSFER',
        'TOTAL', 'INQUIRY', 'HISTORY', 'TRANSACTION', 'STATEMENT', 'AMOUNT', 'DATE', 'TIME',
        'FROM', 'TO', 'SENDER', 'RECEIVER', 'PAYER', 'PAYEE', 'NAME', 'MEMO', 'NOTE', 'REF', 'KRW', 'WON'];
    const nameRegex = /[A-Za-z]{2,}(?:[ '\-][A-Za-z]{2,}){0,2}/g;
    let singleWordFallback = '';
    for (const line of lines) {
        const matches = line.match(nameRegex) || [];
        for (const m of matches) {
            const tokens = m.split(/\s+/);
            if (tokens.some(t => stopWords.includes(t.toUpperCase()))) continue;
            if (m.includes(' ')) return m; // 두 단어 이상이면 사람 이름일 가능성이 높음
            if (!singleWordFallback) singleWordFallback = m;
        }
    }
    return singleWordFallback;
}

function guessNameFromText(text) {
    const clean = text || '';
    const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
    const hangulCount = (clean.match(/[가-힣]/g) || []).length;
    const latinCount = (clean.match(/[A-Za-z]/g) || []).length;

    // 캡쳐본이 영문 위주면 OCR이 만들어낸 엉뚱한 한글 조각보다 영문 이름을 우선한다
    if (latinCount > hangulCount) {
        return findEnglishName(lines) || findKoreanName(lines);
    }
    return findKoreanName(lines) || findEnglishName(lines);
}

function guessAmountFromText(text) {
    const m = (text || '').match(/([\d][\d,]{2,})\s*원/);
    return m ? m[1].replace(/,/g, '') : '';
}

// --- 자동 매칭 ---
function checkAutoMatch(newData, type) {
    const name = normalizeName(newData.name);
    if (!name) return false;
    const oppositeList = type === 'depositor' ? state.applicants : state.depositors;
    const match = oppositeList.find(o => normalizeName(o.name) === name);
    if (match) {
        if (type === 'depositor') confirmMatch(newData, match, true);
        else confirmMatch(match, newData, true);
        return true;
    }
    return false;
}

function confirmMatch(depositor, applicant, auto) {
    state.depositors = state.depositors.filter(d => d.id !== depositor.id);
    state.applicants = state.applicants.filter(a => a.id !== applicant.id);
    state.history.unshift({
        id: genId(),
        depositorName: depositor.name,
        applicantName: applicant.name,
        amount: depositor.amount || '',
        thumb: depositor.thumb || '',
        timestamp: Date.now(),
        auto: !!auto
    });
    saveState();
    renderAll();
    showToast(auto ? `자동 매칭됨: ${applicant.name}` : `입금 확인 완료: ${applicant.name}`);
}

// --- 드래그 앤 드롭 (Pointer Events, 터치/마우스 공용) ---
let dragCtx = null;

function rectOverlapArea(a, b) {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return x * y;
}

function attachDrag(blockEl, handleEl, data, type) {
    handleEl.addEventListener('pointerdown', (e) => {
        startDrag(e, blockEl, data, type);
    });
}

function startDrag(e, blockEl, data, type) {
    e.preventDefault();
    const rect = blockEl.getBoundingClientRect();
    const clone = blockEl.cloneNode(true);
    clone.classList.add('drag-clone');
    clone.style.width = rect.width + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    document.body.appendChild(clone);
    blockEl.classList.add('drag-source-hidden');

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const oppositeType = type === 'depositor' ? 'applicant' : 'depositor';

    dragCtx = { data, type, clone, blockEl, oppositeType, target: null };

    const onMove = (ev) => {
        clone.style.left = (ev.clientX - offsetX) + 'px';
        clone.style.top = (ev.clientY - offsetY) + 'px';
        updateDropTarget();
    };
    const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        finishDrag();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
}

function updateDropTarget() {
    const cloneRect = dragCtx.clone.getBoundingClientRect();
    const selector = dragCtx.oppositeType === 'applicant' ? '.applicant-block' : '.depositor-block';
    const candidates = document.querySelectorAll(selector);
    let best = null, bestArea = 0;
    candidates.forEach(el => {
        el.classList.remove('drop-target');
        const r = el.getBoundingClientRect();
        const overlapArea = rectOverlapArea(cloneRect, r);
        const minArea = Math.min(cloneRect.width * cloneRect.height, r.width * r.height);
        if (overlapArea > 0 && minArea > 0 && overlapArea / minArea > 0.3 && overlapArea > bestArea) {
            bestArea = overlapArea;
            best = el;
        }
    });
    if (best) best.classList.add('drop-target');
    dragCtx.target = best;
}

function finishDrag() {
    const { clone, blockEl, target, data, type, oppositeType } = dragCtx;
    clone.remove();
    blockEl.classList.remove('drag-source-hidden');
    if (target) {
        target.classList.remove('drop-target');
        const targetId = target.dataset.id;
        const targetData = (oppositeType === 'applicant' ? state.applicants : state.depositors).find(d => d.id === targetId);
        if (targetData) {
            if (type === 'depositor') confirmMatch(data, targetData, false);
            else confirmMatch(targetData, data, false);
        }
    }
    dragCtx = null;
}

// --- 렌더링 ---
function renderDepositors() {
    const list = document.getElementById('depositorList');
    list.innerHTML = '';
    if (!state.depositors.length) {
        list.innerHTML = '<div class="empty-hint">등록된 입금자가 없어요</div>';
    }
    state.depositors.forEach(d => {
        const el = document.createElement('div');
        el.className = 'block depositor-block';
        el.dataset.id = d.id;
        el.innerHTML = `
            <div class="drag-handle" aria-label="드래그하여 매칭">⠿</div>
            <img class="block-thumb" src="${d.thumb}" alt="">
            <div class="block-body">
                <input class="block-name-input" type="text" value="${escapeHtml(d.name)}" placeholder="이름 확인 필요">
                <div class="block-amount-wrap">
                    <span class="block-amount-prefix">$</span>
                    <input class="block-amount-input" type="text" inputmode="decimal" value="${escapeHtml(d.amount)}" placeholder="금액 (선택)">
                </div>
            </div>
            <button class="block-remove" aria-label="삭제">&times;</button>
        `;
        const nameInput = el.querySelector('.block-name-input');
        nameInput.addEventListener('input', () => { d.name = nameInput.value; saveState(); });
        nameInput.addEventListener('change', () => { checkAutoMatch(d, 'depositor'); });
        const amtInput = el.querySelector('.block-amount-input');
        amtInput.addEventListener('input', () => { d.amount = amtInput.value; saveState(); });
        el.querySelector('.block-remove').addEventListener('click', () => {
            state.depositors = state.depositors.filter(x => x.id !== d.id);
            saveState();
            renderAll();
        });
        attachDrag(el, el.querySelector('.drag-handle'), d, 'depositor');
        list.appendChild(el);
    });
    document.getElementById('depositorCount').textContent = state.depositors.length;
}

function renderApplicants() {
    const list = document.getElementById('applicantList');
    list.innerHTML = '';
    if (!state.applicants.length) {
        list.innerHTML = '<div class="empty-hint">등록된 신청자가 없어요</div>';
    }
    state.applicants.forEach(a => {
        const el = document.createElement('div');
        el.className = 'block applicant-block';
        el.dataset.id = a.id;
        el.innerHTML = `
            <div class="drag-handle" aria-label="드래그하여 매칭">⠿</div>
            <div class="block-avatar">🙋</div>
            <div class="block-body">
                <input class="block-name-input" type="text" value="${escapeHtml(a.name)}" placeholder="이름 입력">
            </div>
            <button class="block-remove" aria-label="삭제">&times;</button>
        `;
        const nameInput = el.querySelector('.block-name-input');
        nameInput.addEventListener('input', () => { a.name = nameInput.value; saveState(); });
        nameInput.addEventListener('change', () => { checkAutoMatch(a, 'applicant'); });
        el.querySelector('.block-remove').addEventListener('click', () => {
            state.applicants = state.applicants.filter(x => x.id !== a.id);
            saveState();
            renderAll();
        });
        attachDrag(el, el.querySelector('.drag-handle'), a, 'applicant');
        list.appendChild(el);
    });
    document.getElementById('applicantCount').textContent = state.applicants.length;
}

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    if (!state.history.length) {
        list.innerHTML = '<div class="empty-hint">아직 확인된 입금이 없어요</div>';
    } else {
        state.history.forEach(h => {
            const el = document.createElement('div');
            el.className = 'history-item';
            el.innerHTML = `
                ${h.thumb ? `<img class="history-thumb" src="${h.thumb}" alt="">` : '<div class="history-thumb-placeholder">🧾</div>'}
                <div class="history-body">
                    <div class="history-names"><b>${escapeHtml(h.applicantName)}</b> &harr; ${escapeHtml(h.depositorName)}</div>
                    <div class="history-meta">${h.amount ? '$' + escapeHtml(h.amount) + ' · ' : ''}${formatTime(h.timestamp)}${h.auto ? ' · 자동매칭' : ''}</div>
                </div>
                <button class="block-remove" aria-label="삭제">&times;</button>
            `;
            el.querySelector('.block-remove').addEventListener('click', () => {
                state.history = state.history.filter(x => x.id !== h.id);
                saveState();
                renderAll();
            });
            list.appendChild(el);
        });
    }
    document.getElementById('historyCount').textContent = state.history.length;
}

function renderAll() {
    renderDepositors();
    renderApplicants();
    renderHistory();
}

// --- 입금자 등록 (이미지 업로드 + OCR, 여러 장 동시 선택 가능) ---
async function processDepositFile(file) {
    let thumb = '';
    try {
        const thumbBlob = await resizeImageToBlob(file, 480, 0.75);
        thumb = await uploadDepositPhoto(thumbBlob);
        const ocrBlob = await resizeImageToBlob(file, 900, 0.85);
        const result = await Tesseract.recognize(ocrBlob, 'kor+eng');
        const text = result && result.data ? result.data.text : '';
        const name = guessNameFromText(text);
        const amount = guessAmountFromText(text);

        const depositor = { id: genId(), name, amount, thumb, matched: false };
        state.depositors.unshift(depositor);
        saveState();
        renderAll();

        if (!checkAutoMatch(depositor, 'depositor')) {
            showToast(name ? `인식됨: ${name}` : '이름 인식 실패 - 직접 입력해주세요');
        }
    } catch (err) {
        console.error('OCR failed', err);
        if (!thumb) {
            try { thumb = await uploadDepositPhoto(await resizeImageToBlob(file, 480, 0.75)); } catch (e2) { thumb = ''; }
        }
        const depositor = { id: genId(), name: '', amount: '', thumb, matched: false };
        state.depositors.unshift(depositor);
        saveState();
        renderAll();
        showToast('자동 인식에 실패했어요 - 이름을 입력해주세요');
    }
}

document.getElementById('depositFile').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;

    showOcrOverlay(true, files.length > 1
        ? `이름 인식 중이에요... (1/${files.length})`
        : '이름 인식 중이에요...<br>처음 실행 시 조금 걸릴 수 있어요');

    for (let i = 0; i < files.length; i++) {
        if (files.length > 1) {
            showOcrOverlay(true, `이름 인식 중이에요... (${i + 1}/${files.length})`);
        }
        await processDepositFile(files[i]);
    }

    showOcrOverlay(false);
    if (files.length > 1) showToast(`캡쳐본 ${files.length}장 등록 완료`);
});

// --- 신청자 등록 ---
function addApplicant() {
    const input = document.getElementById('applicantNameInput');
    const name = input.value.trim();
    if (!name) return;
    input.value = '';
    const applicant = { id: genId(), name, matched: false };
    state.applicants.unshift(applicant);
    saveState();
    renderAll();
    checkAutoMatch(applicant, 'applicant');
}
document.getElementById('addApplicantBtn').addEventListener('click', addApplicant);
document.getElementById('applicantNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addApplicant();
});

// --- 히스토리 초기화 ---
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (!state.history.length) return;
    if (!confirm('확인 내역을 모두 삭제할까요?')) return;
    state.history = [];
    saveState();
    renderAll();
});

// --- 초기화 ---
loadState();
renderAll();
