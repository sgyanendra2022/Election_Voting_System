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

// ===== AUTH HELPERS =====
function getUser() {
    try { return JSON.parse(localStorage.getItem('evs_session')); } catch { return null; }
}

function logout() {
    localStorage.removeItem('evs_session');
    showToast('You have been logged out.', 'info');
    setTimeout(() => window.location.href = 'index.html', 900);
}

// ===== AUTH GUARD =====
// main.html requires login
const user = getUser();
if (!user) {
    window.location.href = 'login.html';
}

// ===== NAVBAR =====
function buildNav() {
    const actions = document.getElementById('navActions');
    if (!actions) return;
    if (user) {
        actions.innerHTML = `
            <div class="user-pill"><i class="fas fa-user"></i> ${user.name.split(' ')[0]}</div>
            <button class="btn-nav-outline" onclick="logout()">
                <i class="fas fa-sign-out-alt" style="margin-right:4px"></i>Logout
            </button>
        `;
    }
}

// ===== HERO =====
function buildHero() {
    if (!user) return;
    const greeting = document.getElementById('heroGreeting');
    const sub      = document.getElementById('heroSub');
    const actions  = document.getElementById('heroActions');

    greeting.innerHTML = `Welcome, <span>${user.name.split(' ')[0]}</span>!`;

    if (user.hasVoted) {
        sub.textContent = 'You have already cast your vote. Thank you for participating!';
        actions.innerHTML = `
            <a href="results.html" class="btn-hero-primary">
                <i class="fas fa-chart-bar"></i> View Results
            </a>
            <a href="#how" class="btn-hero-secondary">How It Works</a>
        `;
    } else {
        sub.textContent = 'Election 2025 is live. Cast your vote now — every vote matters!';
        actions.innerHTML = `
            <a href="vote.html" class="btn-hero-primary">
                <i class="fas fa-check-circle"></i> Vote Now
            </a>
            <a href="#parties" class="btn-hero-secondary">Learn About Parties</a>
        `;
    }
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('open');
    });
}

// ===== ABOUT MODAL =====
const aboutBtn   = document.getElementById('aboutNavBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAbout = document.getElementById('closeAboutModal');

if (aboutBtn) {
    aboutBtn.addEventListener('click', e => {
        e.preventDefault();
        aboutModal.classList.add('open');
    });
}
if (closeAbout) {
    closeAbout.addEventListener('click', () => aboutModal.classList.remove('open'));
}
if (aboutModal) {
    aboutModal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
    });
}

// ===== TICKER =====
const tickers = [
    'Elections 2025 — Cast your vote before June 10!',
    'Secure, transparent and tamper-proof digital voting.',
    'Over 2.4 crore votes cast so far. Keep going, India!',
    'Every vote shapes the future. Make yours count!',
    'Voting is your right — exercise it responsibly.'
];
let ti = 0;
const tickerEl = document.getElementById('tickerText');
if (tickerEl) {
    setInterval(() => {
        ti = (ti + 1) % tickers.length;
        tickerEl.style.opacity = 0;
        setTimeout(() => {
            tickerEl.textContent = tickers[ti];
            tickerEl.style.opacity = 1;
        }, 400);
    }, 4000);
}

// ===== COUNTDOWN =====
const cdEl = document.getElementById('countdown');
if (cdEl) {
    const elEnd = new Date('2026-06-10');
    const days  = Math.max(0, Math.ceil((elEnd - new Date()) / (1000 * 60 * 60 * 24)));
    cdEl.textContent = days;
}

// ===== INIT =====
buildNav();
buildHero();

// ===== INJECT PARTY CARDS =====
const partyCardData = [
    { key:'BJP', name:'BJP', full:'Bharatiya Janata Party',   desc:'Right-wing party promoting nationalism and economic reforms.' },
    { key:'INC', name:'INC', full:'Indian National Congress',  desc:'Centrist party focused on democracy, secularism and social justice.' },
    { key:'AAP', name:'AAP', full:'Aam Aadmi Party',            desc:'Anti-corruption party focused on governance transparency.' },
    { key:'SP',  name:'SP',  full:'Samajwadi Party',             desc:'Socialist party advocating for equality and welfare programs.' }
];

const mainGrid = document.getElementById('mainPartyGrid');
if (mainGrid && typeof PARTY_LOGOS !== 'undefined') {
    mainGrid.innerHTML = partyCardData.map(p => `
        <div class="party-card">
            <img src="${PARTY_LOGOS[p.key]}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.full} — ${p.desc}</p>
        </div>
    `).join('');
}
