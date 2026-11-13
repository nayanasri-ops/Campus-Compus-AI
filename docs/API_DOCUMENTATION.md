# Campus Compass AI — REST API Documentation

Base URI: `/api`

---

## 1. Authentication & Profiles

### `POST /api/auth/login`
- **Body**: `{ "email": "demo.student@campuscompass.ai" }`
- **Response**: `{ "success": true, "user": User, "token": "cc-jwt-..." }`

### `POST /api/auth/register`
- **Body**: `{ "name": "...", "email": "...", "branch": "...", "cgpa": 8.5 }`
- **Response**: `{ "success": true, "user": User, "token": "..." }`

### `GET /api/students/profile`
- **Response**: `{ "profile": User }`

### `PUT /api/students/profile`
- **Body**: `{ "cgpa": 8.75, "skillsTeaching": [...], "bio": "..." }`
- **Response**: `{ "success": true, "profile": User }`

---

## 2. SkillSwap Marketplace

### `GET /api/skillswap/matches`
Calculates AI compatibility based on reciprocal skill overlap, branch, academic year, and interests.
- **Response**: `{ "matches": [ { "student": User, "compatibilityScore": 94, "matchReasons": [...], "suggestedExchange": "..." } ] }`

### `POST /api/skillswap/request`
- **Body**:
  ```json
  {
    "receiverId": "student-priya-02",
    "skillOffered": "Java & Spring Boot",
    "skillRequested": "Python & Machine Learning",
    "message": "Hey Priya, let's swap skills!",
    "availability": "Weekday evenings",
    "preferredMode": "Online"
  }
  ```
- **Response**: `{ "success": true, "request": SkillSwapRequest }`

### `PUT /api/skillswap/request/:id`
Accept, reject, counter-offer, or complete a swap with rating.
- **Body**: `{ "status": "Accepted" }` or `{ "rating": { "score": 5, "feedback": "Great session!" } }`
- **Response**: `{ "success": true, "request": SkillSwapRequest }`

### `POST /api/skillswap/session`
Schedule peer Google Meet session.
- **Body**: `{ "swapRequestId": "...", "title": "...", "scheduledTime": "...", "durationMinutes": 60 }`
- **Response**: `{ "success": true, "session": SkillSwapSession }`

---

## 3. Java Skills Lab & AI Assistant

### `GET /api/java-lab/challenges`
Returns coding exercises (OOP, Collections, Multithreading, Streams, Spring Boot).

### `POST /api/java-lab/run`
Validates and executes Java code against unit test assertions.
- **Body**: `{ "code": "...", "challengeId": "chal-1" }`
- **Response**: `{ "status": "PASSED", "message": "...", "xpAwarded": 100, "output": "..." }`

### `POST /api/java-lab/ai-assistant`
Triggers AI explanation, bug analysis, optimization, or JUnit test suite generation.
- **Body**: `{ "action": "explain" | "find_bugs" | "optimize" | "time_complexity" | "test_cases", "code": "..." }`
- **Response**: `{ "result": "..." }`

---

## 4. AI Resume & Mock Interview

### `POST /api/resume/analyze`
Extracts ATS score, missing keywords, and provides before/after rewrites.
- **Body**: `{ "resumeText": "...", "targetRole": "Java Backend Developer" }`
- **Response**: `{ "analysis": ResumeAnalysisResult }`

### `POST /api/mock-interview/generate`
- **Body**: `{ "role": "Java Backend Developer", "company": "Amazon" }`
- **Response**: `{ "questions": [ ... ] }`

### `POST /api/mock-interview/evaluate`
- **Body**: `{ "question": "...", "answer": "...", "role": "..." }`
- **Response**: `{ "evaluation": { "technicalScore": 84, "communicationScore": 88, "feedback": "..." } }`

---

## 5. Floating Compass AI

### `POST /api/ai/chat`
Answers student questions using Gemini 3.8 Flash model.
- **Body**: `{ "message": "What should I learn today?" }`
- **Response**: `{ "reply": "..." }`
