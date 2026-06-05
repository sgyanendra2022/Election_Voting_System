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

const $ = id => document.getElementById(id);

let resetCode = '';
let targetEmail = '';

// ===== PASSWORD TOGGLES =====
function setupToggle(btnId, inputId) {
    const btn = $(btnId);
    const inp = $(inputId);
    if (!btn || !inp) return;
    btn.addEventListener('click', () => {
        const isText = inp.type === 'text';
        inp.type = isText ? 'password' : 'text';
        btn.classList.toggle('fa-eye', isText);
        btn.classList.toggle('fa-eye-slash', !isText);
    });
}

setupToggle('toggleNewPwd', 'newPassword');
setupToggle('toggleConfirmNewPwd', 'confirmNewPassword');

// ===== STEP 1: Send code =====
$('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = $('resetEmail').value.trim();
    $('resetEmailErr').textContent = '';

    if (!email) {
        $('resetEmailErr').textContent = 'Email is required.';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('resetEmailErr').textContent = 'Enter a valid email address.';
        return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('evs_users') || '[]');
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        $('resetEmailErr').textContent = 'No account found with this email address.';
        return;
    }

    // Generate and "send" code
    resetCode  = String(Math.floor(100000 + Math.random() * 900000));
    targetEmail = email;

    // Demo: show in alert (real app: send via email API)
    alert(`[Demo] Your password reset code is: ${resetCode}`);

    $('sentToEmail').textContent = email;
    $('step1').classList.add('hidden');
    $('step2').classList.remove('hidden');
    showToast('Reset code sent to your email.', 'info');
});

// ===== STEP 2: Verify code + set new password =====
$('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();

    $('resetCodeErr').textContent        = '';
    $('newPasswordErr').textContent      = '';
    $('confirmNewPasswordErr').textContent = '';

    const code    = $('resetCode').value.trim();
    const newPass = $('newPassword').value;
    const confPass = $('confirmNewPassword').value;

    let valid = true;

    if (!code) {
        $('resetCodeErr').textContent = 'Please enter the reset code.';
        valid = false;
    } else if (code !== resetCode) {
        $('resetCodeErr').textContent = 'Invalid reset code. Please check and try again.';
        valid = false;
    }

    if (!newPass) {
        $('newPasswordErr').textContent = 'New password is required.';
        valid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPass)) {
        $('newPasswordErr').textContent = 'Password must be at least 8 characters with uppercase, number and special character.';
        valid = false;
    }

    if (newPass !== confPass) {
        $('confirmNewPasswordErr').textContent = 'Passwords do not match.';
        valid = false;
    }

    if (!valid) return;

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('evs_users') || '[]');
    const idx   = users.findIndex(u => u.email.toLowerCase() === targetEmail.toLowerCase());

    if (idx === -1) {
        showToast('User not found. Please try again.', 'error');
        return;
    }

    users[idx].password = newPass;
    localStorage.setItem('evs_users', JSON.stringify(users));

    // Clear any active session
    localStorage.removeItem('evs_session');

    $('step2').classList.add('hidden');
    $('step3').classList.remove('hidden');
    showToast('Password reset successful!', 'success');
});

// ===== Try again =====
$('tryAgainBtn').addEventListener('click', () => {
    $('step2').classList.add('hidden');
    $('step1').classList.remove('hidden');
    $('resetEmail').value = '';
    $('resetEmailErr').textContent = '';
});
