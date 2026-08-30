# 🛡️ FraudLens

### *"See the red flags before you take the risk."*

FraudLens is an explainable AI-powered scam detection platform. Paste a suspicious SMS, WhatsApp message, email, or UPI/payment request — FraudLens analyzes it and returns a risk score, scam type classification, specific red flags, a plain-English explanation of *why* it's risky, and clear safety guidance — all in seconds.

Unlike typical "scam or not" checkers, FraudLens is built around **explainability**: every verdict comes with the reasoning behind it, so users learn to spot the next scam themselves, not just this one.

---

## 🔗 Live Demo

| Service | URL |
|---|---|
| **Frontend** | [https://safeverify.vercel.app](https://safeverify.vercel.app) |
| **Backend API** | [https://fraudlens-backend-uynu.onrender.com](https://fraudlens-backend-uynu.onrender.com) |

> ⚠️ The backend runs on Render's free tier — if it hasn't been used in the last 15 minutes, the first request may take 30–60 seconds to wake up.

---

## ✨ Features

- **Explainable Risk Score (0–100)** with a clear risk level: `LOW` / `MODERATE` / `HIGH` / `CRITICAL`
- **Scam Type Classification** — Banking Phishing, UPI/Payment Scam, Job Scam, Fake KYC, Prize/Lottery Scam, Investment Scam, Delivery Scam, and more
- **Detected Red Flags** — specific, message-level signals (urgency language, credential requests, suspicious URLs, impersonation, etc.), not generic boilerplate
- **"Why This Matters"** — a plain-English explanation grounded in the actual message content
- **Recommended Safety Actions** — clear DO / DO-NOT guidance tailored to the specific scam type
- **Scan History & Dashboard** — track total scans, high-risk counts, and top scam categories over time
- **Resilient by design** — if the AI engine is ever unavailable, a rule-based fallback engine keeps the app working without ever showing a broken result

---

### Architecture Overview

```
┌─────────────┐      REST API       ┌──────────────┐      ┌──────────────┐
│   React     │ ──────────────────► │    Flask     │ ───► │  Google      │
│  (Vite)     │ ◄────────────────── │   Backend    │      │  Gemini API  │
└─────────────┘     JSON responses  └──────┬───────┘      └──────────────┘
                                            │
                                            │  (fallback if Gemini fails)
                                            ▼
                                     ┌──────────────┐      ┌──────────────┐
                                     │  Rule-based  │      │   MongoDB    │
                                     │   Engine     │      │  (scans DB)  │
                                     └──────────────┘      └──────────────┘
```


**Flow:** User pastes a message → frontend sends it to the Flask API → the backend prompts Gemini for a structured risk analysis → the result is validated, saved to MongoDB, and returned to the frontend for display. If the Gemini call fails for any reason, a lightweight rule-based engine steps in automatically so the user never sees a broken experience.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite) + JavaScript + CSS |
| **Backend** | Python, Flask, Flask-CORS, Gunicorn |
| **AI Engine** | Google Gemini (`gemini-3.5-flash`) via `google-genai` SDK |
| **Fallback Engine** | Regex/keyword-based rule engine (Python) |
| **Database** | MongoDB Atlas |
| **Hosting** | Vercel (frontend) · Render (backend) |

---

## 📁 Project Structure

```
safeverify/
├── backend/
│   ├── app.py              # Flask app, routes, CORS, MongoDB wiring
│   ├── engine.py            # Gemini integration + rule-based fallback
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── components/          # ScoreGauge, RedFlagList, SafetyActions, etc.
│   ├── pages/                # Landing, Analyze, Results, Dashboard
│   ├── api.js                 # API layer (real fetch + mock fallback)
│   └── App.jsx
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## 👥 Team

Built for a hackathon submission by [Shravani348](https://github.com/Shravani348) and [Anupriya Kundu](https://github.com/Amazing-Anu16).

---

## ⚙️ Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free)
- A [MongoDB Atlas](https://mongodb.com) connection string (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/Shravani348/safeverify.git
cd safeverify
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
GEMINI_API_KEY=your_gemini_key_here
MONGO_URI=your_mongodb_connection_string_here
FRONTEND_ORIGIN=http://localhost:5173
PORT=5000
```

Run the backend:
```bash
python app.py
```

### 3. Frontend setup
From the project root:
```bash
npm install
```

Create a `.env` file at the project root:
```env
VITE_API_URL=http://127.0.0.1:5000
```

Run the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` (or whichever port Vite assigns).

---

## 📡 API Reference

### `POST /api/analyze`
Analyzes a message and returns a structured risk report.

**Request**
```json
{ "text": "URGENT: Your bank account is suspended. Click here: http://bit.ly/fake-kyc" }
```

**Response**
```json
{
  "risk_score": 98,
  "risk_level": "CRITICAL",
  "scam_type": "Fake KYC",
  "red_flags": [
    "Urgent threat of account suspension",
    "Suspicious shortened URL",
    "Unsolicited request for sensitive verification"
  ],
  "explanation": "This message pressures the user with a false deadline and directs them to an unverified link to steal credentials.",
  "safety_actions": {
    "do_not": ["Click the link", "Share OTP/PIN/passwords"],
    "do": ["Verify through official channels", "Report to your bank"]
  },
  "source": "llm"
}
```

### `GET /api/history?limit=20`
Returns the most recent scans, newest first.

### `GET /api/stats`
Returns aggregate stats: total scans, high-risk count, and top scam category.

---

## 🔒 Security Notes

- API keys and database credentials are never committed to the repository — all secrets are managed via environment variables on Render and Vercel.
- CORS is restricted to the deployed frontend origin in production.
- The Gemini engine's output is validated and clamped server-side before being returned, so malformed AI responses never reach the client.

---

## 🚧 Known Limitations

- Free-tier hosting means the backend may take up to a minute to "wake up" after inactivity.
- Detection is based on message content only — it does not verify URLs against live threat-intelligence databases.
- Currently supports English-language messages.

---

## 🔮 Future Scope

- Browser extension for real-time inline scanning
- WhatsApp bot integration
- Community-reported scam pattern database
- Multi-language support

---

## 👥 Team

Built for a hackathon submission by [Shravani348](https://github.com/Shravani348) and team.

---

## 📄 License

This project was built for educational/competition purposes.
