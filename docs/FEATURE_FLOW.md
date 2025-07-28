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

