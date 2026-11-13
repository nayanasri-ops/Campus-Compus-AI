import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  DollarSign,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  Sliders
} from 'lucide-react';
import { Career, AdminScoringWeights, User } from '../../types';

interface AIAdvisorViewProps {
  currentUser: User;
  careers: Career[];
  weights: AdminScoringWeights;
  onNavigate: (tab: string) => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  currentUser,
  careers,
  weights,
  onNavigate,
}) => {
  const [selectedCareer, setSelectedCareer] = useState<Career>(careers[0]);
  const [activeTab, setActiveTab] = useState<'career' | 'academic'>('career');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> AI Guidance Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Academic & Career Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-factor weighted analysis comparing your 8.65 CGPA, Java proficiencies, and career goals with verified hiring patterns at top-tier software companies.
          </p>
        </div>

        {/* Scoring Weights Pill Indicator */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Scoring Model Weights</span>
          </div>
          <div className="text-[11px] text-slate-300 space-x-2">
            <span>Skill: <strong>{weights.skillMatch}%</strong></span> ·
            <span>Goal: <strong>{weights.careerGoal}%</strong></span> ·
            <span>CGPA: <strong>{weights.academicPerformance}%</strong></span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('career')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'career'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Career Pathways & Skill Gaps
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Academic Electives & CGPA Strategy
        </button>
      </div>

      {activeTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career List Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Matched Career Profiles ({careers.length})
            </h2>

            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {careers.map(career => {
                const isSelected = selectedCareer.id === career.id;
                return (
                  <button
                    key={career.id}
                    onClick={() => setSelectedCareer(career)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-600 shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{career.title}</h4>
                      <span className="text-xs font-extrabold text-emerald-400 tabular-nums">
                        {career.matchPercentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {career.expectedSalary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Career Detailed Diagnosis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white">
                      {selectedCareer.title}
                    </h2>
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 tabular-nums">
                      {selectedCareer.matchPercentage}% AI Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{selectedCareer.matchReason}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Median Compensation
                  </span>
                  <span className="text-xs font-bold text-white tabular-nums">
                    {selectedCareer.expectedSalary}
                  </span>
                </div>
              </div>

              {/* Skills Analysis: Existing vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Existing Skills */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Existing Skills ({selectedCareer.studentSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCareer.studentSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-900/30 text-emerald-200 border border-emerald-800/40 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Missing Skills for Target Role ({selectedCareer.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCareer.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-900/30 text-rose-200 border border-rose-800/40 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hiring Companies */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Top Hiring Companies</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.hiringCompanies.map((comp, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-950 text-slate-200 text-xs font-semibold border border-slate-800"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Roadmap Milestones */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Strategic Skill Acquisition Roadmap</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCareer.roadmapOverview.map((step, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-bold font-mono flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-medium text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Topics to Master */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Technical Interview Focus Areas
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  {selectedCareer.interviewTopics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  View Recommended Courses
                </button>
                <button
                  onClick={() => onNavigate('mockinterview')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
                >
                  Launch Mock Interview for This Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              Academic Transcript & Elective Optimization
            </h3>
            <p className="text-xs text-slate-300">
              Analysis based on your current 8.65 CGPA in Semester 6 of Computer Science & Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Current Standing
              </span>
              <div className="text-2xl font-extrabold text-white">8.65 / 10.0</div>
              <p className="text-xs text-emerald-400">Above 8.0 placement filter for all tier-1 tech recruiters</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Weak Subject Diagnostics
              </span>
              <div className="text-xs text-slate-200 font-medium space-y-1">
                <div>· Computer Networks (Grade: B+)</div>
                <div>· Formal Automata (Grade: B)</div>
              </div>
              <p className="text-[11px] text-amber-400">Compensate with practical lab credits</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Semester 7 Elective Target
              </span>
              <div className="text-xs font-bold text-indigo-300">
                CS-401: Cybersecurity Fundamentals
              </div>
              <p className="text-[11px] text-slate-400">
                Bridges your weak networking grade with hands-on secure socket engineering.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
