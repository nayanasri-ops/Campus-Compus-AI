import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Compass,
  FileCheck,
  Target,
  GraduationCap,
  Users2,
  Trophy,
  CheckCircle2,
  Star,
  Zap,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreSkillSwap: () => void;
  onMeetCompassAI: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreSkillSwap,
  onMeetCompassAI,
}) => {
  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-radial from-indigo-500/15 via-transparent to-transparent -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Campus Compass AI · The Student Career Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Learn. Collaborate. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Skill-Swap. Get Career Ready.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Your AI-powered path from classroom to career. Discover high-demand careers, exchange technical skills peer-to-peer, analyze your resume, and master Java enterprise engineering.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreSkillSwap}
              className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore SkillSwap</span>
            </button>
            <button
              onClick={onMeetCompassAI}
              className="px-5 py-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 text-indigo-300 border border-indigo-900/60 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Meet Compass AI</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Preview */}
        <div className="mt-12 md:mt-16 relative rounded-2xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-950 shadow-2xl overflow-hidden">
          <div className="rounded-xl overflow-hidden relative group">
            <img
              src="/src/assets/images/hero_campus_compass_1791109599985.jpg"
              alt="Campus Compass AI Innovation Lab"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-96 md:h-[480px] object-cover filter brightness-95 contrast-105 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-10">
              <div className="max-w-xl space-y-2">
                <span className="text-xs uppercase tracking-wider font-mono text-cyan-300 font-semibold">
                  Live Circular Peer Learning
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  "I help you learn Java, and you teach me Machine Learning."
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Over 1,200 verified skill swaps conducted this semester across Indian engineering campuses including VNR VJIET, CBIT, and IIIT Hyderabad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Statistics */}
      <section className="border-y border-slate-900 bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">94.8%</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Placement Callback Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tabular-nums">1,420+</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Active SkillSwaps Completed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums">₹18.4 LPA</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Average SDE Package Placed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tabular-nums">24 / 7</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Compass AI Guidance</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Circular Engineering Growth
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            How Campus Compass AI Works
          </h2>
          <p className="text-sm text-slate-400">
            A continuous loop from academic classroom to premier technology recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white">Profile & Academics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your CGPA, coursework, weak subjects, and career dreams. AI builds your personalized diagnostic baseline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white">SkillSwap Exchanges</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              List skills you teach and skills you want. AI calculates compatibility, generates meeting links, and awards XP.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white">Practice in Java Lab</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve LeetCode-style challenges, multithreading puzzles, and Spring Boot REST APIs with automated unit testing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-white">Placement Readiness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your resume for real-time ATS optimization, simulate AI mock technical interviews, and apply for matched internships.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            All-In-One Enterprise Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Designed for Modern Tech Careers
          </h2>
          <p className="text-sm text-slate-400">
            Every feature connects back to your career readiness score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">SkillSwap Marketplace</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reciprocal peer-to-peer skill learning. Trade Java OOP for Python ML, schedule 1-on-1 sessions, and earn badges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">AI Academic & Career Advisor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze CGPA, electives, and skill gaps against real hiring benchmarks at Amazon, Oracle, and Google.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Java Skills Lab (Java 21)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive code editor, live test suite runner, bug finder, and AI code optimization for enterprise Java and Spring Boot.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">AI Resume ATS Analyzer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant ATS score, missing skills detection, section-by-section audit, and before/after bullet point upgrades.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Placement Readiness Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Holistic prediction combining CGPA, DSA problem counts, system design, mock interviews, and GitHub activity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Project Teammate Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find compatible partners for hackathons and capstone projects based on complementary technical roles.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Student Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 bg-slate-950/40">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Campus Community Proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            What Our Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Through SkillSwap, I swapped Java Spring Boot tutoring for Sravani's machine learning mentorship. Two weeks later, I passed my technical security screening at Oracle India!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="/src/assets/images/avatar_student_alex_1791109613298.jpg"
                alt="Arjun Reddy"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500"
              />
              <div>
                <p className="text-xs font-bold text-white">Arjun Reddy</p>
                <p className="text-[11px] text-slate-400">CSE 3rd Year · VNR VJIET, Hyderabad</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The AI Resume Analyzer caught 4 missing enterprise keywords and completely restructured my project descriptions. My interview call rate increased from 15% to 65%."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="/src/assets/images/avatar_student_priya_1791109625531.jpg"
                alt="Priya Sharma"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-violet-500"
              />
              <div>
                <p className="text-xs font-bold text-white">Priya Sharma</p>
                <p className="text-[11px] text-slate-500">AI & DS 3rd Year · NVIDIA Intern</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The Java Skills Lab combined with Compass AI feedback gave me the exact concurrency questions JPMorgan asked in my final round. Can't recommend this platform enough!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="/src/assets/images/avatar_student_marcus_1791109637950.jpg"
                alt="Marcus Chen"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500"
              />
              <div>
                <p className="text-xs font-bold text-white">Marcus Chen</p>
                <p className="text-[11px] text-slate-500">Cybersecurity 4th Year · CrowdStrike</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950/80 border border-indigo-800/60 shadow-2xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Build your career with your campus community.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of ambitious engineering students trading skills, building portfolio projects, and getting placed at tier-1 technology leaders.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Launch Student Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
