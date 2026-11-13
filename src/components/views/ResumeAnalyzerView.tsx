import React, { useState } from 'react';
import {
  FileCheck,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { ResumeAnalysisResult, User } from '../../types';

interface ResumeAnalyzerViewProps {
  currentUser: User;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ currentUser }) => {
  const [resumeText, setResumeText] = useState(
`ARJUN REDDY
arjun.reddy@vnrvjiet.ac.in | github.com/arjunreddy-vnr | Hyderabad, India
Education: B.Tech Computer Science & Engineering, VNR VJIET, Hyderabad, CGPA 8.65 (Expected 2027)

TECHNICAL SKILLS:
Languages: Java (Core, Collections, Concurrency), SQL, Python (Basics), HTML/CSS
Frameworks & Tools: Spring Boot, Spring Data JPA, Maven, Git, PostgreSQL, REST APIs

PROJECTS:
1. Distributed Task Queue in Java
- Built a multi-threaded task distribution engine using Java ExecutorService and blocking queues.
- Handled concurrent worker threads and prevented race conditions via synchronized blocks.

2. Student Placement Management Portal
- Developed full backend using Spring Boot and Spring Data JPA with PostgreSQL.
- Implemented role-based authentication and student application tracking endpoints.`
  );

  const [targetRole, setTargetRole] = useState(currentUser.careerGoal || 'Java Backend Developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeResume(resumeText, targetRole);
      setAnalysis(res.analysis);
      confetti({ particleCount: 70, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Placement Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Resume Analyzer & ATS Auditor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Extract skills, benchmark your ATS match against tier-1 recruiting systems, detect missing keywords, and get before-and-after bullet point rewrites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="Java Backend Developer">Java Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
            <option value="AI / ML Engineer">AI / ML Engineer</option>
            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
          </select>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Resume Content / Paste Area
              </h3>
              <span className="text-[11px] text-indigo-400">Targeting: {targetRole}</span>
            </div>

            <textarea
              rows={16}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAnalyzing ? 'Auditing Resume against ATS filters...' : 'Run Deep AI ATS Audit'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-7 space-y-6">
          {!analysis ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <FileCheck className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-sm font-bold text-slate-300">No Resume Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Paste your resume on the left and click "Run Deep AI ATS Audit" to receive instant scores, missing keywords, and before/after improvements.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-400">ATS Pass Likelihood</span>
                  <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
                    {analysis.atsScore} / 100
                  </div>
                  <span className="text-[11px] text-slate-500">Tier-1 Automated Scanner Pass</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Engineering Impact Score</span>
                  <div className="text-3xl font-extrabold text-indigo-400 tabular-nums">
                    {analysis.overallScore} / 100
                  </div>
                  <span className="text-[11px] text-slate-500">Recruiter Screening Evaluation</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Top Strengths
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {analysis.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Critical Weaknesses
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Missing Keywords for {targetRole}
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysis.missingSkillsForTargetRole.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-200 border border-amber-800/40 text-xs font-medium"
                    >
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Before & After Improvement Suggestions */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Before & After Bullet Point Upgrades
                </span>

                <div className="space-y-3">
                  {analysis.beforeAfterSuggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs"
                    >
                      <div className="text-slate-400 line-through">
                        <strong className="text-rose-400">Before: </strong>
                        {sug.before}
                      </div>
                      <div className="text-slate-100 font-medium">
                        <strong className="text-emerald-400">After: </strong>
                        {sug.after}
                      </div>
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-900">
                        {sug.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
