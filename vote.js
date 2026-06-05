// ===== TOAST =====
function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

// ===== AUTH GUARD =====
function getUser() {
    try { return JSON.parse(localStorage.getItem('evs_session')); }
    catch { return null; }
}

const user = getUser();
if (!user) {
    showToast('Please login to vote.', 'error');
    setTimeout(() => window.location.href = 'login.html', 1000);
}

// ===== ALREADY VOTED GUARD =====
if (user && user.hasVoted) {
    // Redirect to results if already voted
    window.location.href = 'results.html';
}

// ===== NAVBAR =====
const navUser = document.getElementById('navUser');
if (navUser && user) {
    navUser.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${user.name}</span>
        <button class="btn-logout" onclick="logout()">Logout</button>
    `;
}

function logout() {
    localStorage.removeItem('evs_session');
    window.location.href = 'index.html';
}

// ===== PARTY DATA =====
// Logos come from PARTY_LOGOS (logos.js loaded before this script)
const partyData = {
    BJP:     { name: 'BJP', full: 'Bharatiya Janata Party'  },
    Congress:{ name: 'INC', full: 'Indian National Congress' },
    AAP:     { name: 'AAP', full: 'Aam Aadmi Party'          },
    SP:      { name: 'SP',  full: 'Samajwadi Party'           },
    NOTA:    { name: 'NOTA',full: 'None of the Above'         }
};

function getPartyLogo(key) {
    if (typeof PARTY_LOGOS !== 'undefined' && PARTY_LOGOS[key]) return PARTY_LOGOS[key];
    return ''; // fallback empty
}

// ===== STEP MANAGEMENT =====
let selectedPartyValue = null;

function showStep(step) {
    document.getElementById('selectStep').style.display  = step === 1 ? 'block' : 'none';
    document.getElementById('confirmStep').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('successStep').style.display = step === 3 ? 'block' : 'none';

    // Progress tracker
    const circles = ['pc1','pc2','pc3'];
    const steps   = ['ps1','ps2','ps3'];
    const lines   = ['pl1','pl2'];

    steps.forEach((sid, i) => {
        const el = document.getElementById(sid);
        el.classList.remove('active','done');
        if (i + 1 < step)      el.classList.add('done');
        else if (i + 1 === step) el.classList.add('active');
    });

    circles.forEach((cid, i) => {
        const el = document.getElementById(cid);
        if (i + 1 < step) el.innerHTML = '<i class="fas fa-check"></i>';
        else               el.textContent = String(i + 1);
    });

    lines.forEach((lid, i) => {
        const el = document.getElementById(lid);
        el.classList.toggle('done', i + 1 < step);
    });
}

// ===== STEP 1 → STEP 2 =====
document.getElementById('voteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const radio = document.querySelector('input[name="party"]:checked');
    const errEl = document.getElementById('selectErr');

    if (!radio) {
        errEl.style.display = 'block';
        showToast('Please select a party to proceed.', 'error');
        return;
    }

    errEl.style.display = 'none';
    selectedPartyValue = radio.value;
    const party = partyData[selectedPartyValue];

    // Build confirmation display
    const display = document.getElementById('confirmDisplay');
    display.innerHTML = `
        <img src="${getPartyLogo(selectedPartyValue)}" alt="${party.name}" style="width:64px;height:64px;object-fit:contain;border-radius:50%;border:2px solid #ddd;padding:6px;background:#fff;flex-shrink:0">
        <div class="confirm-party-info">
            <div class="name">${party.name}</div>
            <div class="full">${party.full}</div>
        </div>
    `;

    showStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== STEP 2 BACK =====
document.getElementById('backBtn').addEventListener('click', () => {
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== STEP 2 → STEP 3 (Final Submit) =====
document.getElementById('finalSubmitBtn').addEventListener('click', () => {
    if (!selectedPartyValue || !user) return;

    const btn = document.getElementById('finalSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px"></i>Submitting...';

    setTimeout(() => {
        // Mark user as voted
        const users = JSON.parse(localStorage.getItem('evs_users') || '[]');
        const idx   = users.findIndex(u => u.id === user.id);

        const receiptId = 'RCP-' + Date.now().toString(36).toUpperCase();
        const voteTime  = new Date().toLocaleString('en-IN');

        if (idx !== -1) {
            users[idx].hasVoted  = true;
            users[idx].votedFor  = selectedPartyValue;
            users[idx].receiptId = receiptId;
            users[idx].votedAt   = voteTime;
            localStorage.setItem('evs_users', JSON.stringify(users));

            // Update session too
            const updatedUser = { ...user, hasVoted: true, votedFor: selectedPartyValue, receiptId, votedAt: voteTime };
            localStorage.setItem('evs_session', JSON.stringify(updatedUser));
        }

        // Also tally votes
        const tally = JSON.parse(localStorage.getItem('evs_votes') || '{}');
        tally[selectedPartyValue] = (tally[selectedPartyValue] || 0) + 1;
        localStorage.setItem('evs_votes', JSON.stringify(tally));

        // Build receipt
        const party = partyData[selectedPartyValue];
        document.getElementById('voteReceipt').innerHTML = `
            <div class="receipt-row"><span class="rkey">Voter Name</span><span class="rval">${user.name}</span></div>
            <div class="receipt-row"><span class="rkey">Voter ID</span><span class="rval">${user.voterId}</span></div>
            <div class="receipt-row"><span class="rkey">Voted For</span><span class="rval">${party.full} (${party.name})</span></div>
            <div class="receipt-row"><span class="rkey">Date &amp; Time</span><span class="rval">${voteTime}</span></div>
            <div class="receipt-row"><span class="rkey">Receipt ID</span><span class="rval">${receiptId}</span></div>
        `;

        showStep(3);
        showToast('Your vote has been cast successfully!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, 1200); // Simulate server processing
});

// ===== INIT =====
showStep(1);
