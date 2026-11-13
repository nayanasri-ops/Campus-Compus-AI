# Campus Compass AI — Database Entity-Relationship (ER) Model

This document outlines the relational database architecture supporting Campus Compass AI, modeled in PostgreSQL with Spring Data JPA.

---

## 1. Entity Relationship Diagram (ASCII)

```
+--------------------+        1:N        +-------------------------+
|     STUDENTS       |-------------------|   STUDENT_SKILLS_TEACH  |
|--------------------|                   +-------------------------+
| id (PK)            |
| name               |        1:N        +-------------------------+
| email (Unique)     |-------------------|   STUDENT_SKILLS_LEARN  |
| branch             |                   +-------------------------+
| college            |
| year               |        1:N (Sender)+-------------------------+
| semester           |-------------------|   SKILL_SWAP_REQUESTS   |
| cgpa               |                   |-------------------------|
| bio                |        1:N (Recv) | id (PK)                 |
| career_goal        |-------------------| sender_id (FK)          |
| xp                 |                   | receiver_id (FK)        |
| streak             |                   | skill_offered           |
| placement_score    |                   | skill_requested         |
+--------------------+                   | status (ENUM)           |
          |                              | compatibility_score     |
          |                              | rating_score            |
          |                              | rating_feedback         |
          |                              +-------------------------+
          |                                          |
          | 1:N                                      | 1:N
          v                                          v
+--------------------+                   +-------------------------+
|      PROJECTS      |                   |   SKILL_SWAP_SESSIONS   |
|--------------------|                   |-------------------------|
| id (PK)            |                   | id (PK)                 |
| title              |                   | swap_request_id (FK)    |
| creator_id (FK)    |                   | title                   |
| problem_statement  |                   | scheduled_time          |
| tech_stack         |                   | meeting_link            |
| team_size          |                   | mode (Online/Offline)   |
| difficulty         |                   | status                  |
+--------------------+                   +-------------------------+
```

---

## 2. Relational Schemas & Foreign Keys

### Table: `students`
- `id` (BIGINT, PRIMARY KEY AUTO_INCREMENT)
- `name` (VARCHAR(150), NOT NULL)
- `email` (VARCHAR(150), UNIQUE, NOT NULL)
- `branch` (VARCHAR(100), NOT NULL)
- `college` (VARCHAR(150), NOT NULL)
- `year` (INTEGER, CHECK (year BETWEEN 1 AND 5))
- `semester` (INTEGER, CHECK (semester BETWEEN 1 AND 10))
- `cgpa` (NUMERIC(3, 2), CHECK (cgpa BETWEEN 0.00 AND 10.00))
- `bio` (TEXT)
- `career_goal` (VARCHAR(150))
- `preferred_mode` (VARCHAR(20) DEFAULT 'Both')
- `xp` (INTEGER DEFAULT 1000)
- `streak` (INTEGER DEFAULT 1)
- `placement_readiness` (NUMERIC(4, 1) DEFAULT 75.0)

### Table: `skill_swap_requests`
- `id` (BIGINT, PRIMARY KEY AUTO_INCREMENT)
- `sender_id` (BIGINT, REFERENCES students(id) ON DELETE CASCADE)
- `receiver_id` (BIGINT, REFERENCES students(id) ON DELETE CASCADE)
- `skill_offered` (VARCHAR(100), NOT NULL)
- `skill_requested` (VARCHAR(100), NOT NULL)
- `message` (TEXT)
- `availability` (VARCHAR(150))
- `preferred_mode` (VARCHAR(20))
- `compatibility_score` (INTEGER)
- `status` (VARCHAR(30) CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'ACTIVE', 'COMPLETED')))
- `rating_score` (INTEGER CHECK (rating_score BETWEEN 1 AND 5))
- `rating_feedback` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `completed_at` (TIMESTAMP)

### Table: `skill_swap_sessions`
- `id` (BIGINT, PRIMARY KEY AUTO_INCREMENT)
- `swap_request_id` (BIGINT, REFERENCES skill_swap_requests(id) ON DELETE CASCADE)
- `title` (VARCHAR(200), NOT NULL)
- `scheduled_time` (TIMESTAMP NOT NULL)
- `duration_minutes` (INTEGER DEFAULT 60)
- `meeting_link` (VARCHAR(255))
- `mode` (VARCHAR(20))
- `status` (VARCHAR(30) DEFAULT 'SCHEDULED')
