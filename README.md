# 🗳️ Election Voting System

A client-side digital voting portal built with HTML, CSS, and JavaScript. Users can register, log in, cast a vote, and view live results — all stored in the browser's `localStorage`.

---

## �️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Page structure and markup |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript (ES6+) | Logic, validation, DOM manipulation |
| localStorage API | Persistent data storage |
| Font Awesome 6 | Icons throughout the UI |
| Google Fonts (Poppins) | Typography |

---

## ✨ Features

- User registration with full validation (Voter ID, Aadhaar, age check, OTP)
- Login / Logout with session management
- Double-vote prevention
- 3-step voting flow: Select → Confirm → Receipt
- Live results with tie detection
- Forgot password with reset code flow
- Fully responsive (mobile, tablet, desktop)

---

## 📄 Pages

| File | Description |
|------|-------------|
| `index.html` | Public landing page |
| `login.html` | Voter login |
| `signup.html` | New voter registration |
| `main.html` | Protected dashboard (requires login) |
| `vote.html` | Cast vote (requires login) |
| `results.html` | Live results |
| `forgot-password.html` | Password reset |

---

## 🗂️ Project Structure

```
Election_Voting_System/
│
├── index.html
├── login.html
├── signup.html
├── main.html
├── vote.html
├── results.html
├── forgot-password.html
│
├── styles.css              # Auth pages (login, signup, forgot)
├── main.css                # Dashboard & landing page
├── vote.css                # Voting & results pages
│
├── script.js               # Login logic
├── signup.js               # Registration & OTP
├── main.js                 # Dashboard & auth guard
├── vote.js                 # Voting flow
├── forgot-script.js        # Password reset
├── logos.js                # Party logo paths (shared)
│
├── BJP.png
├── INC.png
├── AAP.png
├── SP.png
└── Nota.jpg
```

---

## 🚀 Getting Started

No installation needed. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/your-username/Election_Voting_System.git
cd Election_Voting_System
# Open index.html in your browser
```

### Quick demo

1. Click **Sign Up** and fill the form
   - Voter ID: any 10 characters e.g. `ABC1234567`
   - Aadhaar: any 12 digits e.g. `123456789012`
   - OTP is optional — click Send OTP, copy the code from the alert, verify or skip
2. **Login** with your email and password
3. Click **Vote Now** → select a party → confirm → get receipt
4. Click **View Live Results**

---

## 💾 Data Storage

All data lives in `localStorage`:

| Key | Contents |
|-----|----------|
| `evs_users` | All registered users |
| `evs_session` | Currently logged-in user |
| `evs_votes` | Vote tally `{ BJP: 3, AAP: 2, ... }` |

> ⚠️ This is a frontend-only demo. Data is not shared across devices and passwords are stored in plain text. A production system would need a backend, hashed passwords, and a real database.

---

## 🏛️ Participating Parties

| Party | Full Name |
|-------|-----------|
| BJP | Bharatiya Janata Party |
| INC | Indian National Congress |
| AAP | Aam Aadmi Party |
| SP | Samajwadi Party |
| NOTA | None of the Above |

---

## 📄 License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Gyanendra Singh**  
Built as a frontend demo project for learning and portfolio purposes.  
GitHub: [sgyanendra2022](https://github.com/sgyanendra2022)
