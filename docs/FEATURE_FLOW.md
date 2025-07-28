# TenaTrack – App Feature Flow

This document outlines the core user experience of TenaTrack, from initial login to healthcare booking, enhanced by multilingual AI triage.

---

## 🌐 1. Login & Identity Verification

- User lands on the welcome page.
- Clicks "Login with Fayda" → Fayda OIDC flow initiates.
- Upon successful verification, user data securely fetched and stored.
- Redirect to Dashboard.

---

## 🏠 2. Dashboard Overview

- Personalized greeting based on user profile.
- Summary cards show:
  - Verified vaccination status.
  - Recent chatbot interactions.
  - Upcoming bookings.
- Call-to-action buttons:
  - “Start Symptom Check”
  - “Book Clinic Visit”
  - “View Records”

---

## 🧠 3. AI Chatbot (Symptom Triage)

- User enters symptom descriptions (text or voice).
- Bot responds in preferred language (Amharic, Afaan Oromo, English).
- Triage output:
  - Possible condition category.
  - Advice (e.g., rest, urgent care).
  - Recommended clinic types.
- Data logged securely for health tracking.

---

## 📅 4. Clinic Booking Flow

- Bot provides clinic suggestions with availability.
- User selects date/time and confirms.
- Appointment stored in Firestore and shown on Dashboard.
- Reminder notification (future enhancement via push or SMS).

---

## 🔐 5. Security & Privacy Notes

- All medical data linked to Fayda ID.
- No sensitive info shared without user consent.
- Firebase handles real-time updates & secure storage.

---

# project stracture

TenaTrack-Ai/
├── public/                  # Static assets
│   └── index.html
├── src/                     # Main application source
│   ├── assets/              # Images, fonts, icons
│   ├── components/          # Reusable UI components
│   │   └── Navbar.jsx
│   ├── layouts/             # Page wrappers/layouts
│   ├── pages/               # Route-based views
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Vaccination.jsx
│   │   └── Triage.jsx
│   ├── styles/              # Tailwind and custom styles
│   ├── routes/              # React Router setup
│   ├── context/             # Global state (Context API or Redux)
│   ├── config/              # Firebase & Fayda configs
│   │   └── firebase.js
│   ├── services/            # API calls, Fayda, Firestore utils
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Formatters, validators, helpers
│   ├── App.jsx              # Root component
│   └── index.js             # Entry point
├── functions/               # Firebase Cloud Functions
│   └── index.js
├── .env                     # Secrets (firebaseConfig, etc.)
├── .gitignore
├── package.json
└── README.md


