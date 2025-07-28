# Project Title: TenaTrack – Fayda-Verified Health Passport & AI Triage

## Contributors
- Etheal Sintayehu  
- Yisehak Wondwosen  
- Amlaku Yalew  

## Project Synopsis

### Problem Statement
Access to reliable healthcare services in Ethiopia is limited by fragmented health records, long clinic wait times, and poor rural connectivity. Most vaccination data is stored on paper, and patients often lack trusted tools to assess symptoms, leading to delayed or missed care.

### Planned Solution
TenaTrack is a mobile-friendly web application that enables users to log in securely using Fayda digital ID, store verified vaccination records, book clinic appointments, and interact with a multilingual AI chatbot for symptom triage. It connects users with health services while enhancing medical data accuracy and care coordination.

### Expected Outcome
We aim to improve early symptom detection, streamline appointment booking, and securely digitize vaccine records for overburdened communities. Users can receive trusted health advice in their native language and ensure continuity of care through verified records.

### Fayda's Role
Fayda is the core authentication provider using VeriFayda 2.0 and OpenID Connect. It enables secure, fraud-proof identity verification and ties health records to real individuals, reducing duplicate entries and protecting privacy.

## Tech Stack

| Component       | Technology                      |
|----------------|----------------------------------|
| Frontend        | React (MVP) / TailwindCSS        |
| Authentication  | Fayda OpenID Connect (PKCE Flow) |
| Backend         | Firebase Functions / Firestore   |
| AI Triage       | Python (Stubbed NLP) / Dialogflow |
| Speech Input    | Whisper (for future version)     |
| Hosting         | Firebase Hosting                 |
