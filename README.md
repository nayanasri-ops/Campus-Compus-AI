# CAMPUS COMPASS AI 🧭

> **Tagline:** Learn. Collaborate. Skill-Swap. Get Career Ready.  
> An AI-Powered College Student Success & Peer-to-Peer Learning Platform.

---

## 🌟 Overview

Campus Compass AI is a production-quality, responsive web application that turns college education into a continuous career-building flywheel. It combines academic intelligence, peer-to-peer reciprocal skill exchange (**SkillSwap**), interactive Java 21 engineering labs, AI resume ATS auditing, and placement readiness prediction.

### Key Features
1. **SkillSwap Marketplace (Flagship)**: Reciprocal peer-to-peer skill exchange ("I help you with my skill, and you help me with yours"). Heuristic AI compatibility matching, counter-offers, live 1-on-1 chat, Google Meet session scheduling, and verified 5-star peer reviews.
2. **AI Academic & Career Advisor**: Heuristic matching across 10+ tech careers (Java Backend, Full Stack, SRE, AI/ML, Cyber). Calculates skill match, existing skills, missing skills, expected salaries, hiring firms, and 12-month roadmaps.
3. **Java 21 Skills Lab**: Built-in coding challenge runner (Basics, OOP, Collections, Multithreading, Streams, Spring Boot), automated unit test evaluation, and an AI Java Staff Engineer assistant ("Explain Code", "Find Bugs", "Optimize", "Big-O Analysis", "Generate JUnit Tests").
4. **AI Resume ATS Analyzer**: Upload/paste resumes to extract ATS scores, formatting critiques, missing enterprise keywords, and before/after bullet upgrades.
5. **AI Placement Readiness Engine**: Holistic scoring combining CGPA, DSA problem volume, system design, mock interviews, and GitHub activity with an actionable step-by-step roadmap.
6. **AI Mock Interviews**: Simulates technical & behavioral interview rounds for Amazon, Oracle, and Google with voice or text input and instant scored feedback.
7. **Project Teammate Matching**: Match with classmates for capstone projects and hackathons by complementary roles (Frontend, Backend, AI/ML, UI/UX).
8. **Smart Timetable & Weekly Study Planner**: Balances university lectures, coding time, and SkillSwap sessions into an optimized daily routine.
9. **Gamification & Badges**: Earn XP, maintain learning streaks, collect badges ("Java Master", "SkillSwap Mentor"), and climb the campus leaderboard.
10. **24/7 Floating Compass AI Assistant**: Always accessible from any screen with quick prompt chips and voice input.
11. **Institutional Admin Dashboard**: Configure multi-factor recommendation weights and view campus-wide analytics.
12. **Full Java Spring Boot Backend**: Included in `/backend-java` with Maven `pom.xml`, JPA entities, Spring Security JWT, and REST controllers.

---

## 🚀 Quickstart & Demonstration

### 1. Instant 1-Click Demo Accounts
Use the top-right profile avatar menu to toggle instantly between:
- **Demo Student (Alex Rivera)**: `demo.student@campuscompass.ai` (CGPA: 8.65, CSE 3rd Year, Java specialist seeking Python ML and UI/UX).
- **Demo Admin (Dr. Evelyn Vance)**: `admin@campuscompass.ai` (Faculty Dean with analytics & scoring weights governance).

### 2. Running Locally

```bash
# Install dependencies
npm install

# Start development full-stack server (runs on port 3000)
npm run dev

# Run TypeScript lint check
npm run lint

# Build for production
npm run build
```

---

## 🛠️ Tech Stack & Monorepo Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Server / AI Proxy**: Node.js, Express, `@google/genai` (Gemini 3.8 Flash model).
- **Enterprise Java Backend**: Java 21, Spring Boot 3.2.4, Spring Data JPA, Spring Security, JJWT, Maven (`/backend-java`).
- **Database Architecture**: PostgreSQL schema with normalized relationships (`/docs/DATABASE_ER_DIAGRAM.md`).

---

## 📚 Complete Demonstration Flow
1. Open the landing page to preview the circular peer learning vision.
2. Enter the **Student Dashboard** to inspect Alex's CGPA (8.65), Skill Score (84), and Placement Readiness (78%).
3. Open **SkillSwap** to find Priya Sharma (94% compatibility). Send a request: *"I teach Java & Spring Boot ↔ You teach Python & Machine Learning"*.
4. Open the **Active Exchanges** tab to test the 1-on-1 peer chat channel and book a Google Meet session.
5. Go to the **Java Skills Lab** to run the Two Sum HashMap or Multithreading challenges; click "Explain Code" or "Generate JUnit Tests".
6. Navigate to the **AI Resume Analyzer** to audit your resume for ATS score improvements and missing keywords.
7. Launch the **AI Mock Interview Simulator** for Amazon and answer via speech or text.
8. Switch to **Admin Mode** in the profile dropdown to tune the AI recommendation weights!
