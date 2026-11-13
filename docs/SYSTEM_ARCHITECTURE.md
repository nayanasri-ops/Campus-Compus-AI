# Campus Compass AI — System Architecture & Design

"Learn. Collaborate. Skill-Swap. Get Career Ready."

---

## 1. High-Level Architectural Overview

Campus Compass AI is architected as an AI-powered student success platform combining:
1. **Frontend Presentation**: Single-Page Application (SPA) built with React 19, TypeScript, and Tailwind CSS v4.
2. **Interactive Node/Express API Proxy & Mock Engine**: Runs full RESTful services, manages in-memory student profiles, calculates peer matching heuristics, and connects to `@google/genai` (Gemini 3.8 Flash).
3. **Java Spring Boot Enterprise Backend**: Located in `/backend-java` with production Maven configuration, Spring Data JPA entities, Spring Security JWT authentication, and enterprise business services.
4. **Circular Peer Learning (SkillSwap)**: A bi-directional marketplace where students exchange technical knowledge peer-to-peer.

```
+-----------------------------------------------------------------------------------+
|                              CAMPUS COMPASS AI CLIENT                             |
|    React 19 + TypeScript + Tailwind CSS v4 + Motion + Plus Jakarta Sans Font      |
+-----------------------------------------------------------------------------------+
           |                                                       ^
     HTTP / REST                                            WebSocket / SSE
           v                                                       |
+-----------------------------------------------------------------------------------+
|                         FULL-STACK EXPRESS ENGINE (server.ts)                     |
|  - Auth & JWT Verification               - SkillSwap Heuristic Matcher            |
|  - Multi-Factor Career Scoring Engine    - AI Resume & Code Review Analyzer       |
|  - Mock Technical Interview Generator    - In-Memory Relational State Cache       |
+-----------------------------------------------------------------------------------+
        |                           |                              |
        v                           v                              v
+--------------------+   +---------------------+   +--------------------------------+
|  GOOGLE GENAI SDK  |   |   JAVA SPRING BOOT  |   |     RELATIONAL DATA STORE      |
|  gemini-3.8-flash  |   |   (/backend-java)   |   |   PostgreSQL / Memory Cache    |
|  User-Agent:       |   | - JPA Repositories  |   | - Students & Skills            |
|  aistudio-build    |   | - Spring Security   |   | - SkillSwap Requests & Sessions|
+--------------------+   +---------------------+   +--------------------------------+
```

---

## 2. The Circular Learning Loop

Traditional platforms only push unilateral content to students. Campus Compass AI introduces a circular learning ecosystem:

```
    [ 1. LEARN ] ---> [ 2. PRACTICE ] ---> [ 3. SKILLSWAP ]
         ^                                        |
         |                                        v
[ 6. PLACEMENT ] <--- [ 5. AUDIT RESUME ] <--- [ 4. BUILD PROJECT ]
```

1. **Learn**: AI Course & Elective Advisor recommends targeted modules based on CGPA and career goals.
2. **Practice**: Students solve challenges in the Java 21 Skills Lab (OOP, Collections, Multithreading).
3. **SkillSwap**: Students trade their strengths (e.g., teaching Java) for needed skills (e.g., learning Python ML).
4. **Build Project**: Matched peers collaborate on real-world projects (MedShield, FinHealth AI).
5. **Audit Resume**: AI Resume Analyzer optimizes ATS scores and quantifies engineering bullets.
6. **Placement**: AI Mock Interviews and placement readiness prediction unlock tier-1 recruitment drives.

---

## 3. Component Hierarchy & Monorepo Structure

```
/
├── package.json               # Full-stack dependencies & scripts
├── server.ts                  # Express server + Vite middlewares + GenAI proxy
├── tsconfig.json              # TypeScript compilation parameters
├── vite.config.ts             # Vite build & bundler configuration
├── index.html                 # HTML entry point with Plus Jakarta Sans & JetBrains Mono
│
├── /src
│   ├── main.tsx               # React client root mounting
│   ├── App.tsx                # Master workspace layout & route dispatcher
│   ├── index.css              # Tailwind base layer & custom scrollbars
│   ├── /types                 # TypeScript interfaces (User, SkillSwap, Career, etc.)
│   ├── /data                  # 20+ students, 30+ skills, 20+ courses, 10+ careers
│   ├── /services              # Frontend API client
│   └── /components
│       ├── Navbar.tsx         # 3-Zone top bar with demo switchers & notifications
│       ├── Sidebar.tsx        # Collapsible navigation rail
│       ├── FloatingCompassAI.tsx # 24/7 AI advisory chat with voice input
│       └── /views             # Feature modules (Dashboard, SkillSwap, JavaLab, etc.)
│
├── /backend-java              # Production Spring Boot 3.2.4 Java Backend
│   ├── pom.xml                # Maven configuration with Spring Boot Starters & JJWT
│   └── src/main
│       ├── resources/application.yml
│       └── java/com/campuscompass
│           ├── CampusCompassApplication.java
│           ├── /controller    # SkillSwapController, StudentController, etc.
│           ├── /service       # SkillSwapService, AIService
│           ├── /model         # Student, SkillSwapRequest, Course, Project entities
│           └── /repository    # Spring Data JPA repositories
│
└── /docs                      # System Architecture, ER Diagrams & API Reference
```
