import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../../types';

interface CareerRoadmapViewProps {
  currentUser: User;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ currentUser }) => {
  const [completedItems, setCompletedItems] = useState<number[]>([1, 2, 3]);

  const roadmapMilestones = [
    {
      id: 1,
      month: 'Month 1',
      title: 'Java Fundamentals, Memory Model & Collections Framework',
      topics: ['JVM internal architecture (Heap, Stack, Metaspace, GC)', 'OOP: Polymorphism, Abstract classes vs Interfaces', 'Collections: List, Set, Map, ConcurrentHashMap mechanics', 'Java 21 Virtual Threads & Record classes'],
      resources: 'Java SE 21 Documentation & Oracle Learning Pathway',
    },
    {
      id: 2,
      month: 'Month 2',
      title: 'Data Structures, Algorithms & SQL Database Modeling',
      topics: ['Arrays, HashMaps, Trees & Graph Traversals (BFS/DFS)', 'Solving 50 LeetCode Medium challenges', 'SQL DDL/DML, Foreign Keys, Indexing, and Query Execution Plans', 'Git collaborative branching and semantic PRs'],
      resources: 'LeetCode 75 Blind + PostgreSQL Official Documentation',
    },
    {
      id: 3,
      month: 'Month 3',
      title: 'Enterprise Spring Boot & RESTful Microservices',
      topics: ['Spring Inversion of Control (IoC) & Dependency Injection', 'Spring Data JPA, Hibernate ORM, and Connection Pooling', 'Designing idempotent REST API endpoints', 'Spring Security with JWT authentication tokens'],
      resources: 'Spring Framework Specialization on Coursera',
    },
    {
      id: 4,
      month: 'Month 4',
      title: 'Capstone Backend Microservices Development',
      topics: ['Building event-driven architecture using Apache Kafka', 'Implementing Redis distributed caching', 'Writing automated JUnit 5 and Mockito test suites', 'Peer review on SkillSwap with senior student mentors'],
      resources: 'Campus Compass AI Project Hub (MedShield / FinHealth)',
    },
    {
      id: 5,
      month: 'Month 5',
      title: 'Docker Containerization & AWS Cloud Deployment',
      topics: ['Writing multi-stage Dockerfiles for Spring Boot', 'Docker Compose with PostgreSQL & Redis containers', 'AWS ECS / EC2 deployment & IAM security policies', 'Setting up GitHub Actions CI/CD pipelines'],
      resources: 'AWS Solutions Architect Associate Tutorial',
    },
    {
      id: 6,
      month: 'Month 6',
      title: 'AI Resume Audit, DSA Grills & Mock Interviews',
      topics: ['Optimizing resume via Campus Compass AI ATS Analyzer', 'Taking 4 AI Mock Technical Interviews for Amazon & Oracle', 'STAR behavioral responses for leadership principles', 'Submitting pre-placement internship applications'],
      resources: 'Campus Compass AI Mock Interview Room',
    },
    {
      id: 7,
      month: 'Months 7 – 12',
      title: 'Advanced System Design, Internships & Final Placement Offers',
      topics: ['High-level system design: Distributed caching, rate limiters, sharding', 'Completing a summer SDE internship at a tier-1 product firm', 'Campus placement recruitment drive clearance', 'Mentoring juniors on SkillSwap as an Alumni Mentor'],
      resources: 'Designing Data-Intensive Applications (Martin Kleppmann)',
    }
  ];

  const toggleItem = (id: number) => {
    if (completedItems.includes(id)) {
      setCompletedItems(prev => prev.filter(i => i !== id));
    } else {
      setCompletedItems(prev => [...prev, id]);
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  const progressPercent = Math.round((completedItems.length / roadmapMilestones.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1">
              <Map className="w-3.5 h-3.5" /> 12-Month Milestone Journey
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personalized Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Target Goal: <strong className="text-white">{currentUser.careerGoal}</strong>. Track your month-by-month technical milestones from core syntax to distributed cloud microservices.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-right shrink-0">
          <span className="text-[11px] text-slate-400 block">Overall Journey Progress</span>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {progressPercent}% Complete
          </div>
          <span className="text-[11px] text-slate-500">
            {completedItems.length} of {roadmapMilestones.length} Phases Cleared
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {roadmapMilestones.map(m => {
          const isDone = completedItems.includes(m.id);
          return (
            <div
              key={m.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-900/40 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleItem(m.id)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {m.month}
                    </span>
                    <h3 className={`text-sm font-bold ${isDone ? 'text-slate-300 line-through' : 'text-white'}`}>
                      {m.title}
                    </h3>
                  </div>

                  {/* Topics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                    {m.topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 pl-7 pt-1">
                    Recommended Resource: <strong className="text-slate-300">{m.resources}</strong>
                  </p>
                </div>

                <button
                  onClick={() => toggleItem(m.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-center cursor-pointer transition-colors ${
                    isDone
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isDone ? 'Mark Incomplete' : 'Complete Phase'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
