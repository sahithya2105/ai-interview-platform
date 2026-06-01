# AI Interview Preparation Platform
Stack: React + Tailwind + Node.js + Gemini AI

An AI-powered interview practice platform where students can practice mock interviews, get real-time feedback on confidence, communication & technical depth — and land their dream job.

---

## 🌐 Live Demo

| Service | Link |
|---------|------|
| 🏠 Home | https://ai-interview-platform-bi0q.onrender.com |
| 📊 Dashboard | https://ai-interview-platform-bi0q.onrender.com/dashboard |
| 🎤 HR Round | https://ai-interview-platform-bi0q.onrender.com/interview/hr |
| 💻 Coding Round | https://ai-interview-platform-bi0q.onrender.com/interview/coding |

---

## ✨ Features

### 🎤 Multiple Input Modes
Practice interviews your way:
- **Voice Input** — Speak your answers using Speech Recognition
- **Webcam** — Practice with video enabled for realistic simulation
- **Typing** — Type detailed answers at your own pace

### 🤖 AI-Powered Analysis
Every answer is instantly evaluated by **Gemini 2.5 Flash**:
- Confidence Score
- Communication Score
- Technical Score
- Detailed Feedback
- Actionable Suggestions

### 📊 Personal Dashboard
Beautiful analytics dashboard with:
- Weekly score bar chart
- Skill radar chart
- Recent session history
- Quick start buttons

### 🔐 Secure Authentication
- Firebase Email/Password Authentication
- Each user sees only their own data
- Sessions saved per user in Firestore

### 🧪 4 Interview Rounds
| Round | Description |
|-------|-------------|
| 👥 HR Round | Behavioral & personality questions |
| 🧠 Technical | Domain-specific technical questions |
| 💻 Coding Round | DSA & programming problems |
| ⚡ Aptitude | Logical reasoning & quantitative |

---

## 📊 How Scoring Works

Every answer is evaluated by Gemini AI on 3 parameters:

| Parameter | Weight | What It Measures |
|-----------|--------|-----------------|
| 💜 Confidence | 30% | Tone, assertiveness, clarity |
| 💚 Communication | 35% | Structure, articulation, flow |
| 💙 Technical | 35% | Domain knowledge, accuracy |

**Overall Score** = (Confidence × 0.30) + (Communication × 0.35) + (Technical × 0.35)

| Score Range | Badge |
|-------------|-------|
| 90 - 100 | 🔥 Elite |
| 80 - 89 | 💪 Strong |
| 70 - 79 | ✅ Competent |
| 60 - 69 | 📚 Developing |
| Below 60 | 🌱 Beginner |

---

## 🏗️ System Architecture

```
User Opens Interview Room
        ↓
Selects Round Type (HR / Technical / Coding / Aptitude)
        ↓
Answers via Voice / Webcam / Typing
        ↓
Answer Sent to Gemini 2.5 Flash API
        ↓
AI Generates Scores + Feedback
        ↓
Scores Displayed in Real-time
        ↓
Session Saved to Firebase Firestore
        ↓
Dashboard Shows Analytics & History
```

---

## 🧠 What the AI Evaluates

| Score | Examples |
|-------|---------|
| 🟢 HIGH (80-100) | Clear structure, confident tone, accurate technical knowledge |
| 🟡 MEDIUM (60-79) | Good content but lacks clarity or depth |
| 🔴 LOW (Below 60) | Vague answers, incorrect facts, poor communication |

---

## 🛠️ Tools & Technologies Used

| Category | Tools / Technologies |
|----------|---------------------|
| Frontend Framework | React 18 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Voice Input | Web Speech API |
| Video | React Webcam |
| Backend Framework | Node.js + Express |
| AI Model | Google Gemini 2.5 Flash |
| Authentication | Firebase Auth |
| Database | Cloud Firestore |
| Deployment | Render.com |
| Version Control | Git & GitHub |
| Notifications | React Hot Toast |

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend UI |
| Tailwind CSS | Styling & Dark Theme |
| Node.js | Backend Server |
| Express.js | API Routes |
| Google Gemini 2.5 Flash | AI Answer Analysis |
| Firebase Auth | User Authentication |
| Cloud Firestore | Session Database |
| Render.com | Cloud Hosting |

---

## 🚀 Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/sahithya2105/ai-interview-platform.git
cd ai-interview-platform
```

### 2️⃣ Install Backend Dependencies
```bash
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4️⃣ Add Environment Variables

Create `backend/.env`:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GEMINI_KEY=your_gemini_api_key
```

### 5️⃣ Run Backend
```bash
cd backend
npm run dev
```

### 6️⃣ Run Frontend
```bash
cd frontend
npm start
```

### 7️⃣ Open in Browser
```
http://localhost:3000
```

---

## 🔥 Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → `ai-interview-platform`
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in test mode
5. Get web config → Add to `frontend/src/utils/firebase.js`

---

## 📁 Project Structure

```
ai-interview-platform/
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   └── Results.jsx
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js
│   │   │   └── useInterview.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── firebase.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── routes/
│   │   ├── interview.js
│   │   ├── auth.js
│   │   └── results.js
│   ├── services/
│   │   ├── geminiService.js
│   │   └── scoreService.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── firebase.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ☁️ Deployment

Fully deployed on **Render.com** — runs 24/7.

| Service | Type | URL |
|---------|------|-----|
| Frontend | Static Site | https://ai-interview-platform-bi0q.onrender.com |
| Backend | Web Service | https://ai-interview-backend-rar0.onrender.com |

### Environment Variables on Render

**Frontend Static Site:**
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | your backend render URL |
| `REACT_APP_GEMINI_KEY` | your gemini api key |

**Backend Web Service:**
| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `GEMINI_API_KEY` | your gemini api key |

---

## 📌 Example AI Feedback

```
[CONFIDENCE: 78%]
You presented yourself clearly but could be more assertive.

[COMMUNICATION: 85%]
Well-structured answer with good use of examples.

[TECHNICAL: 72%]
Good understanding of concepts but missed some key details.

SUGGESTION: Use the STAR method (Situation, Task, Action, Result)
for behavioral questions to make your answers more impactful.
```

---

## ⚠️ Known Limitations

- Free plan backend sleeps after 15 mins → first request takes ~50 seconds to wake up
- Voice input works best on **Chrome** browser
- Webcam requires camera permission in browser settings

---

## 🔮 Future Improvements

- AI-generated follow-up questions
- Resume-based personalized questions
- Interview recording & playback
- Leaderboard & rankings
- Multi-language support
- Company-specific interview prep
- Mock Group Discussion feature
- AI body language analysis via webcam

---

## 🎨 Color Theme

| Color | Hex | Usage |
|-------|-----|-------|
| ⚡ Volt Green | `#b5ff2d` | Primary accent, buttons |
| 💜 Plasma Pink | `#ff3de8` | HR Round, confidence |
| 💙 Cyan Neon | `#00f5ff` | Coding Round, technical |
| 🟡 Amber | `#ffaa00` | Aptitude Round |
| ⬛ Obsidian | `#050508` | Background |

---

## ⭐ Project Goal

Help students **practice smarter**, get **AI-powered feedback**, track their **improvement over time**, and walk into every interview with **confidence**.

---

## 👩‍💻 Developer

**Sahithya**
- GitHub: [@sahithya2105](https://github.com/sahithya2105)
- Live Project: [AI Interview Platform](https://ai-interview-platform-bi0q.onrender.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
