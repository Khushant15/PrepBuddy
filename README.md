# 🚀 PrepBuddy

<p align="center">
  <b>Advanced AI-Powered Interview Preparation Platform</b><br/>
  Practice smarter. Track progress. Crack interviews 🚀
</p>

<p align="center">
  <a href="https://prepbuddy-sooty.vercel.app/"><b>🌐 Live Demo</b></a> •
  <a href="https://github.com/Khushant15/PrepBuddy"><b>📂 Repository</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Groq_AI-1E3A8A?style=for-the-badge&logo=artificial-intelligence&logoColor=white"/>
  <img src="https://img.shields.io/badge/Gemini_1.5-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel"/>
</p>

---

## ✨ About PrepBuddy

**PrepBuddy** is an enterprise-grade full-stack platform designed to help developers master technical and behavioral interviews. It combines live AI simulations, intelligent job matchings, dynamic quizzes, and structured roadmaps into a single ecosystem.

> 💡 Built with a focus on **AI-driven personalization, real-time analytics, and practical learning.**

---

## ⚡ Next-Generation Features

### 🤖 Dual-LLM AI Interviewer
* **Affinda Resume Parsing**: Upload your resume and let AI automatically tailor the interview experience to your exact skill set.
* **Smart LLM Routing**: Groq handles ultra-low latency technical questions, while Gemini Pro drives nuanced behavioral and HR conversations.
* **Real-time Feedback**: Get instant scoring, syntax evaluation, and conversational advice.

### 📊 Real-Time Telemetry Dashboard
* **Live Firestore Sync**: Every quiz taken or roadmap completed instantly visually updates via WebSockets without refreshing.
* **Skill Radar Maps**: Real-time evaluation of your proficiencies across JavaScript, Java, React, Python, SQL, and Cloud databases.
* **Velocity Charts**: Daily streak tracking and Area Charts plotting your exact growth trajectory.

### 🧩 Dynamic Timed Quizzes
* **QuizAPI.io Integration**: Fetches an unlimited supply of categorized, difficulty-assessed multiple-choice questions.
* **Fail-Safe Mechanism**: Automatically falls back to a massive categorized local database if external API limits are hit, guaranteeing 100% platform uptime.
* **Proctored Execution**: 25-minute smart timers ensure you are practicing under true assessment conditions.

### 💼 Intelligent Job Matcher
* **TheirStack Integration**: Dynamically scrapes tech-stack specific active roles across geographic regions (e.g. Frontend Jobs in Mumbai).
* Instantly compares your platform Skill Radar to real job requirements to highlight perfect fits.

### 🏢 Corporate & Behavioral DBs
* Question banks tailored to specific corporate behaviors, including FAANG, TCS, Deloitte, Accenture, and Wipro methodologies.

---

## 🏗️ Architecture Stack

| Layer   | Technologies                                   |
| ---------- | ---------------------------------------------- |
| **Frontend**   | Next.js App Router, TypeScript, Tailwind CSS, Recharts |
| **Motion**      | Framer Motion, Radix UI                                |
| **Backend API**| Next.js Edge / Serverless API Routes           |
| **Database**   | Firebase Firestore (Real-time NoSQL config)    |
| **AI Stack**    | Groq Cloud API, Google Gemini Pro 1.5          |
| **Integrations**| Affinda (Resume AI), QuizAPI.io, TheirStack API|
| **Providers**   | Firebase Auth, Vercel Edge                     |

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Khushant15/PrepBuddy.git
cd PrepBuddy
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create `.env.local` in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI & Data APIs
GROQ_API_KEY=your_groq_llama_key
GEMINI_API_KEY=your_google_gemini_key
AFFINDA_API_KEY=your_affinda_resume_key
AFFINDA_WORKSPACE_ID=your_workspace_id
QUIZ_API_KEY=your_quizapi_io_key
THEIRSTACK_API_KEY=your_theirstack_key
```

### 4️⃣ Launch the Engine

```bash
npm run dev
```

---

## 🤝 Contributing

Contributions are heavily encouraged! Have an idea for a new Roadmap or AI model implementation? 

```bash
# Fork → Clone → Create Branch → Commit → Push → PR
```

---

## 👨‍💻 Author

**Khushant Sharma**

* GitHub: https://github.com/Khushant15
* Portfolio: *Insert Portfolio Link*

---

<p align="center">
  <b>Built with 💙 by Khushant Sharma</b>
</p>
