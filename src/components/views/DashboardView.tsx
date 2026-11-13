import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  BookOpen,
  Compass,
  GraduationCap,
  Users2,
  Code2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Camera
} from 'lucide-react';
import { User, Course, Career, Elective, SkillSwapRequest } from '../../types';

interface DashboardViewProps {
  currentUser: User;
  careers: Career[];
  courses: Course[];
  electives: Elective[];
  requests: SkillSwapRequest[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  careers,
  courses,
  electives,
  requests,
  onNavigate,
}) => {
  const topCareer = careers[0] || {
    title: 'Java Backend Developer',
    matchPercentage: 91,
    expectedSalary: '$85k - $130k',
    hiringCompanies: ['Amazon', 'Oracle', 'JPMorgan Chase'],
  };

  const topCourse = courses[0] || {
    title: 'Java Masterclass: From Fundamentals to Spring Boot Microservices',
    provider: 'Oracle',
    rating: 4.8,
    duration: '42 hours',
  };

  const topElective = electives[0] || {
    code: 'CS-401',
    name: 'Cybersecurity Fundamentals & Network Defense',
    matchScore: 94,
    whyRecommended: 'Based on your 8.65 CGPA and career goal in Java Backend Development.',
  };

  const pendingRequestsCount = requests.filter(
    r => r.receiverId === currentUser.id && r.status === 'Pending'
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good Morning, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentUser.year || '2nd Year'}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {currentUser.course || currentUser.branch} · {currentUser.college}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('community')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Users2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campus Community</span>
          </button>
          <button
            onClick={() => onNavigate('skillswap')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SkillSwap Marketplace</span>
          </button>
        </div>
      </div>

      {/* Authenticated Student Profile Card (Appears automatically on Dashboard) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-900/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wide uppercase">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Your Registered Student Profile Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('community')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View in Community Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer flex items-center gap-1"
            >
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>Edit Profile & Photo</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 pt-1">
          <div className="relative shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Active Student" />
          </div>

          <div className="space-y-2 flex-1">
            <div>
              <h2 className="text-xl font-bold text-white">Name: {currentUser.name}</h2>
              <p className="text-xs text-indigo-300 font-medium">Course: {currentUser.course || 'B.Tech / BTEC'}</p>
              <p className="text-xs text-slate-400">Year: {currentUser.year || '2nd Year'} · {currentUser.college}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Skills:</span>
              {(currentUser.skills && currentUser.skills.length > 0 ? currentUser.skills : ['Java', 'Cybersecurity', 'Python']).map((s, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/70 text-indigo-300 text-[11px] font-medium">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Interests:</span>
              {(currentUser.interests && currentUser.interests.length > 0 ? currentUser.interests : ['AI', 'Cybersecurity']).map((i, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md bg-violet-950/80 border border-violet-800/70 text-violet-300 text-[11px] font-medium">
                  {i}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-300 italic pt-0.5">
              Bio: {currentUser.bio || '2nd Year student passionate about cybersecurity and distributed systems.'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cockpit */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* CGPA */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Academic CGPA</span>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {currentUser.cgpa}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 8% of batch
          </span>
        </div>

        {/* Skill Score */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Skill Score</span>
          <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
            {currentUser.skillScore} / 100
          </div>
          <span className="text-[10px] text-slate-400">Java, Spring & SQL</span>
        </div>

        {/* Career Readiness */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Career Match</span>
          <div className="text-2xl font-extrabold text-cyan-400 tabular-nums">
            {topCareer.matchPercentage}%
          </div>
          <span className="text-[10px] text-slate-400 truncate block">
            {topCareer.title}
          </span>
        </div>

        {/* Placement Readiness */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Placement Ready</span>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {currentUser.placementReadiness}%
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Eligible for Tier-1
          </span>
        </div>

        {/* Learning Streak */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Study Streak</span>
          <div className="text-2xl font-extrabold text-amber-400 tabular-nums flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-500" />
            <span>{currentUser.streak}d</span>
          </div>
          <span className="text-[10px] text-slate-400">Consistent learner</span>
        </div>

        {/* XP Points */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Campus XP</span>
          <div className="text-2xl font-extrabold text-violet-400 tabular-nums">
            {currentUser.xp.toLocaleString()}
          </div>
          <span className="text-[10px] text-violet-400">Rank #6 Leaderboard</span>
        </div>
      </div>

      {/* Main Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. AI Career Recommendation */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-600/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> AI Career Goal
              </span>
              <span className="text-xs font-bold text-emerald-400 tabular-nums">
                {topCareer.matchPercentage}% Match
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{topCareer.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your Java OOP foundation, SQL knowledge, and 8.65 CGPA. Expected compensation: <strong className="text-slate-100">{topCareer.expectedSalary}</strong>.
            </p>
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Top Hiring: </span>
              {topCareer.hiringCompanies.slice(0, 3).join(', ')}
            </div>
          </div>
          <button
            onClick={() => onNavigate('advisor')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Career Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Recommended Course */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-violet-600/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Course Priority
              </span>
              <span className="text-xs font-mono text-slate-400">{topCourse.provider}</span>
            </div>
            <h3 className="text-base font-bold text-white">{topCourse.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fills your critical gap in containerized Spring Boot microservices while reinforcing your enterprise Java core.
            </p>
            <div className="text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">★ {topCourse.rating}</span> · {topCourse.duration}
            </div>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore Recommended Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Recommended Elective */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-600/50 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Elective Advisor
              </span>
              <span className="text-xs font-bold text-cyan-400 tabular-nums">
                {topElective.matchScore}% Match
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {topElective.code}: {topElective.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {topElective.whyRecommended}
            </p>
            <div className="text-xs text-slate-400">
              Semester 7 · 4 Credits · CSE Department
            </div>
          </div>
          <button
            onClick={() => onNavigate('electives')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Review Electives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress & Analytics Charts Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Semester CGPA & Skill Growth */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Academic & Skill Growth Trend</h3>
            <span className="text-xs text-slate-400">Semesters 1 to 6</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Core Java & Spring Boot</span>
                <span className="font-semibold text-indigo-400">92% (Advanced)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Data Structures & Algorithms</span>
                <span className="font-semibold text-cyan-400">74% (Intermediate)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Cloud & Docker</span>
                <span className="font-semibold text-amber-400">62% (Target Area)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Communication & Mock Interviews</span>
                <span className="font-semibold text-emerald-400">85% (Strong)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Circular Learning & Actionable Milestones */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">This Week's Priority Action Plan</h3>
            <span className="text-xs text-indigo-400">2 of 4 Completed</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="line-through text-slate-500">Solve 2 Java collections challenges in Java Lab</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">+100 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="line-through text-slate-500">Run resume through AI ATS Analyzer</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Score: 79</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <div className="w-4 h-4 rounded-full border border-indigo-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <span>SkillSwap session with Priya Sharma (Python ML ↔ Java)</span>
              </div>
              <button
                onClick={() => onNavigate('skillswap')}
                className="text-[11px] text-indigo-400 font-semibold hover:underline"
              >
                Join Meet
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-4 h-4 rounded-full border border-slate-700" />
                <span>Take 1 AI Mock Technical Interview for Amazon</span>
              </div>
              <button
                onClick={() => onNavigate('mockinterview')}
                className="text-[11px] text-amber-400 font-semibold hover:underline"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
