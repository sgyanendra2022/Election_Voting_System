// ===== TOAST =====
function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4500);
}

// ===== HELPERS =====
const $ = id => document.getElementById(id);

function setErr(id, msg) {
    const el = $(id);
    if (!el) return;
    el.textContent = msg;
    // Scroll first error into view
    if (msg) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function clearErr(id) { const el = $(id); if (el) el.textContent = ''; }

// ===== VALIDATORS =====
function validateEmail(e)   { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()); }
function validateMobile(m)  { return /^\d{10}$/.test(m.trim()); }          // any 10-digit number
function validateVoterId(v) { return /^[A-Z0-9]{10}$/i.test(v.trim()); }
function validateAadhar(a)  { return /^\d{12}$/.test(a.trim()); }
function validatePassword(p){
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(p);
}
function validateAge(dob) {
    if (!dob) return false;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18;
}

// ===== PASSWORD TOGGLES =====
function setupToggle(iconId, inputId) {
    const icon = $(iconId);
    const inp  = $(inputId);
    if (!icon || !inp) return;
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        icon.classList.toggle('fa-eye',       show);
        icon.classList.toggle('fa-eye-slash', !show);
    });
}
setupToggle('togglePwd',     'password');
setupToggle('toggleConfirm', 'confirmPassword');

// ===== PASSWORD STRENGTH BAR =====
const pwdInput = $('password');
if (pwdInput) {
    pwdInput.addEventListener('input', function () {
        const v    = this.value;
        const fill = $('strengthFill');
        if (!fill) return;
        let score = 0;
        if (v.length >= 8)           score++;
        if (/[A-Z]/.test(v))         score++;
        if (/[0-9]/.test(v))         score++;
        if (/[@$!%*?&#]/.test(v))    score++;
        const colors = ['#e53935', '#ff9800', '#fdd835', '#4caf50'];
        fill.style.width      = (score * 25) + '%';
        fill.style.background = colors[score - 1] || '#eee';
    });
}

// ===== OTP (demo — optional verification) =====
let generatedOtp   = '';
let mobileVerified = false;

const sendOtpBtn   = $('sendOtpBtn');
const verifyOtpBtn = $('verifyOtpBtn');
const otpGroup     = $('otpGroup');

if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
        const mob = $('mobile').value.trim();
        clearErr('mobileErr');
        $('mobile').classList.remove('error');

        if (!validateMobile(mob)) {
            setErr('mobileErr', 'Please enter a valid 10-digit mobile number.');
            $('mobile').classList.add('error');
            return;
        }

        generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        otpGroup.style.display = 'block';
        sendOtpBtn.textContent = 'Resend OTP';
        $('mobile').disabled   = true;

        alert(`[Demo] Your OTP is: ${generatedOtp}`);
        showToast('OTP sent! Check the alert for your demo code.', 'info');
    });
}

if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
        const entered = $('otp').value.trim();
        clearErr('otpErr');
        $('otpOk').classList.add('hidden');

        if (!entered) { setErr('otpErr', 'Please enter the OTP.'); return; }

        if (entered !== generatedOtp) {
            setErr('otpErr', 'Incorrect OTP. Please try again.');
            return;
        }

        mobileVerified = true;
        $('otpOk').classList.remove('hidden');
        $('otp').disabled        = true;
        verifyOtpBtn.disabled    = true;
        sendOtpBtn.disabled      = true;
        showToast('Mobile verified!', 'success');
    });
}

// ===== FORM SUBMIT =====
const signupForm = $('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear all errors first
        ['fullNameErr','mobileErr','otpErr','emailErr','voterIdErr',
         'aadharErr','dobErr','passwordErr','confirmErr','termsErr']
            .forEach(id => clearErr(id));

        // Remove any leftover input error borders
        document.querySelectorAll('#signupForm input').forEach(el => el.classList.remove('error'));

        let valid      = true;
        let firstError = null;

        const name    = $('fullName').value.trim();
        const mobile  = $('mobile').value.trim();
        const email   = $('email').value.trim();
        const voterId = $('voterId').value.trim().toUpperCase();
        const aadhar  = $('aadhar').value.trim();
        const dob     = $('dob').value;
        const pass    = $('password').value;
        const confirm = $('confirmPassword').value;

        function fail(inputId, errId, msg) {
            setErr(errId, msg);
            const inp = $(inputId);
            if (inp) inp.classList.add('error');
            if (!firstError) firstError = $(errId);
            valid = false;
        }

        // Validate each field
        if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
            fail('fullName', 'fullNameErr', 'Enter a valid full name (letters only, min 3 characters).');
        }

        if (!validateMobile(mobile)) {
            fail('mobile', 'mobileErr', 'Enter a valid 10-digit mobile number.');
        }
        // NOTE: OTP verification is optional in demo mode — we just encourage it
        // but don't block registration if user skips it

        if (!validateEmail(email)) {
            fail('email', 'emailErr', 'Enter a valid email address (e.g. name@example.com).');
        }

        if (!voterId || !validateVoterId(voterId)) {
            fail('voterId', 'voterIdErr', 'Voter ID must be exactly 10 letters/numbers (e.g. ABC1234567).');
        }

        if (!validateAadhar(aadhar)) {
            fail('aadhar', 'aadharErr', 'Aadhaar must be exactly 12 digits.');
        }

        if (!dob) {
            fail('dob', 'dobErr', 'Please enter your date of birth.');
        } else if (!validateAge(dob)) {
            fail('dob', 'dobErr', 'You must be at least 18 years old to register.');
        }

        if (!pass) {
            fail('password', 'passwordErr', 'Please create a password.');
        } else if (!validatePassword(pass)) {
            fail('password', 'passwordErr',
                'Password needs: 8+ chars, 1 uppercase, 1 number, 1 special character (@$!%*?&#).');
        }

        if (!confirm) {
            fail('confirmPassword', 'confirmErr', 'Please confirm your password.');
        } else if (pass !== confirm) {
            fail('confirmPassword', 'confirmErr', 'Passwords do not match.');
        }

        if (!$('terms').checked) {
            setErr('termsErr', 'You must agree to the Terms & Conditions.');
            if (!firstError) firstError = $('termsErr');
            valid = false;
        }

        // Scroll to the first error so user sees it
        if (!valid) {
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showToast('Please fix the errors highlighted in red.', 'error');
            return;
        }

        // Check for duplicate email or Voter ID
        const users = JSON.parse(localStorage.getItem('evs_users') || '[]');

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            fail('email', 'emailErr', 'An account with this email already exists.');
            showToast('This email is already registered.', 'error');
            return;
        }

        if (users.find(u => u.voterId.toUpperCase() === voterId)) {
            fail('voterId', 'voterIdErr', 'This Voter ID is already registered.');
            showToast('This Voter ID is already registered.', 'error');
            return;
        }

        // All good — save the user
        const newUser = {
            id:           Date.now(),
            name,
            mobile,
            email,
            voterId,
            aadhar,
            dob,
            password:     pass,
            hasVoted:     false,
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('evs_users', JSON.stringify(users));

        // Visual feedback on button
        const btn = signupForm.querySelector('button[type="submit"]');
        btn.disabled     = true;
        btn.innerHTML    = '<i class="fas fa-spinner fa-spin" style="margin-right:6px"></i>Creating account...';

        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
}

// ===== BLUR VALIDATIONS (real-time feedback) =====
const blurRules = [
    {
        id: 'fullName', errId: 'fullNameErr',
        check: v => v.length >= 3 && /^[a-zA-Z\s]+$/.test(v),
        msg: 'Enter a valid full name (letters only, min 3 characters).'
    },
    {
        id: 'mobile', errId: 'mobileErr',
        check: v => validateMobile(v),
        msg: 'Enter a valid 10-digit mobile number.'
    },
    {
        id: 'email', errId: 'emailErr',
        check: v => validateEmail(v),
        msg: 'Enter a valid email address.'
    },
    {
        id: 'voterId', errId: 'voterIdErr',
        check: v => validateVoterId(v),
        msg: 'Voter ID must be exactly 10 letters/numbers.',
        transform: v => v.toUpperCase()
    },
    {
        id: 'aadhar', errId: 'aadharErr',
        check: v => validateAadhar(v),
        msg: 'Aadhaar must be exactly 12 digits.'
    },
    {
        id: 'confirmPassword', errId: 'confirmErr',
        check: v => v === ($('password') ? $('password').value : ''),
        msg: 'Passwords do not match.'
    }
];

blurRules.forEach(rule => {
    const el = $(rule.id);
    if (!el) return;
    el.addEventListener('blur', function () {
        const v = rule.transform ? rule.transform(this.value.trim()) : this.value.trim();
        if (rule.transform) this.value = v;
        if (!v) { clearErr(rule.errId); this.classList.remove('error'); return; }
        if (!rule.check(v)) {
            setErr(rule.errId, rule.msg);
            this.classList.add('error');
        } else {
            clearErr(rule.errId);
            this.classList.remove('error');
        }
    });
});

// DOB blur
const dobEl = $('dob');
if (dobEl) {
    dobEl.addEventListener('change', function () {
        if (!this.value) return;
        if (!validateAge(this.value)) {
            setErr('dobErr', 'You must be at least 18 years old.');
            this.classList.add('error');
        } else {
            clearErr('dobErr');
            this.classList.remove('error');
        }
    });
}
