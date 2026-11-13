import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users2,
  Sparkles,
  BarChart3,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Save,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { AdminScoringWeights, User } from '../../types';

interface AdminDashboardViewProps {
  currentUser: User;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [weights, setWeights] = useState<AdminScoringWeights | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavingWeights, setIsSavingWeights] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    Promise.all([api.getAdminAnalytics(), api.getAdminWeights()]).then(([aRes, wRes]) => {
      setAnalytics(aRes);
      setWeights(wRes.weights);
      setLoading(false);
    });
  }, []);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weights) return;
    setIsSavingWeights(true);
    try {
      const res = await api.updateAdminWeights(weights);
      if (res.success) {
        setSavedSuccess(true);
        confetti({ particleCount: 50, spread: 60 });
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingWeights(false);
    }
  };

  if (loading || !analytics || !weights) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading institutional administration dashboard...
      </div>
    );
  }

  const weightSum =
    Number(weights.skillMatch) +
    Number(weights.interestMatch) +
    Number(weights.careerGoal) +
    Number(weights.academicPerformance) +
    Number(weights.industryDemand) +
    Number(weights.experience);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Dean & Placement Cell Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Platform Analytics & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Institutional overview of active student cohorts, SkillSwap transactions, average placement readiness indices, and recommendation pipeline weight configuration.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Administrator</span>
          <span className="font-bold text-purple-300">{currentUser.name}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Enrolled Scholars</span>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {analytics.totalStudents}
          </div>
          <span className="text-[11px] text-emerald-400">18 active today</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">SkillSwap Requests</span>
          <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
            {analytics.totalSkillSwaps}
          </div>
          <span className="text-[11px] text-slate-400">{analytics.completedSkillSwaps} completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Average Campus CGPA</span>
          <div className="text-2xl font-extrabold text-cyan-400 tabular-nums">
            {analytics.averageCgpa}
          </div>
          <span className="text-[11px] text-emerald-400">+0.18 YoY Improvement</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Avg Placement Index</span>
          <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
            {analytics.averagePlacementReadiness}%
          </div>
          <span className="text-[11px] text-emerald-400">Tier-1 Qualified</span>
        </div>
      </div>

      {/* Analytics Breakdown & AI Scoring Weights Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Popular Skills & Careers */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white pb-2 border-b border-slate-800">
            Campus Skill Exchange Marketplace Distribution
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-emerald-400 block mb-1.5">
                Most Taught Skills by Mentors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.topTaughtSkills.map((sk: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-amber-400 block mb-1.5">
                Most Requested Skills by Learners:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.topRequestedSkills.map((sk: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/40 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-indigo-400 block mb-1.5">
                Most Popular Student Target Careers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.popularCareers.map((car: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 font-medium"
                  >
                    {car}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Configurable Scoring Weights (Section 29) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>AI Recommendation Scoring Weights</span>
            </h3>
            <span
              className={`text-xs font-mono font-bold ${
                weightSum === 100 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              Sum: {weightSum}%
            </span>
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Skill Match (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.skillMatch}
                  onChange={e => setWeights({ ...weights, skillMatch: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Interest Match (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.interestMatch}
                  onChange={e => setWeights({ ...weights, interestMatch: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Career Goal Alignment (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.careerGoal}
                  onChange={e => setWeights({ ...weights, careerGoal: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Academic Performance / CGPA (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.academicPerformance}
                  onChange={e =>
                    setWeights({ ...weights, academicPerformance: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Industry Hiring Demand (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.industryDemand}
                  onChange={e =>
                    setWeights({ ...weights, industryDemand: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Practical Experience / Projects (%):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weights.experience}
                  onChange={e => setWeights({ ...weights, experience: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Changes directly update career match percentages across all student dashboards in real time.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={isSavingWeights}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingWeights ? 'Updating...' : 'Save Scoring Weights'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
