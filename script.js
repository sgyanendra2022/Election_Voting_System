// ===== TOAST =====
function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// ===== PASSWORD TOGGLE =====
const togglePwd = document.getElementById('togglePwd');
const passwordInput = document.getElementById('password');

if (togglePwd && passwordInput) {
    togglePwd.addEventListener('click', () => {
        const isText = passwordInput.type === 'text';
        passwordInput.type = isText ? 'password' : 'text';
        togglePwd.classList.toggle('fa-eye', isText);
        togglePwd.classList.toggle('fa-eye-slash', !isText);
    });
}

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    // If already logged in, redirect to main
    const session = (() => {
        try { return JSON.parse(localStorage.getItem('evs_session')); } catch { return null; }
    })();
    if (session) window.location.href = 'main.html';

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailEl    = document.getElementById('email');
        const emailErr   = document.getElementById('emailErr');
        const passErr    = document.getElementById('passwordErr');
        const email      = emailEl.value.trim();
        const pass       = passwordInput.value;

        // Reset
        emailErr.textContent = '';
        passErr.textContent  = '';
        emailEl.classList.remove('error');
        passwordInput.classList.remove('error');

        let valid = true;

        if (!email) {
            emailErr.textContent = 'Email is required.';
            emailEl.classList.add('error');
            valid = false;
        } else if (!validateEmail(email)) {
            emailErr.textContent = 'Please enter a valid email address.';
            emailEl.classList.add('error');
            valid = false;
        }

        if (!pass) {
            passErr.textContent = 'Password is required.';
            passwordInput.classList.add('error');
            valid = false;
        }

        if (!valid) return;

        // Look up in localStorage
        const users = JSON.parse(localStorage.getItem('evs_users') || '[]');
        const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

        if (!user) {
            passErr.textContent = 'Invalid email or password. Please try again.';
            passwordInput.classList.add('error');
            showToast('Login failed. Check your credentials.', 'error');
            return;
        }

        // Save session
        localStorage.setItem('evs_session', JSON.stringify(user));
        showToast('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'main.html';
        }, 900);
    });
}
