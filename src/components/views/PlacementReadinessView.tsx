import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Code2,
  Mic,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

interface PlacementReadinessViewProps {
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export const PlacementReadinessView: React.FC<PlacementReadinessViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [readinessData, setReadinessData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPlacementReadiness().then(res => {
      setReadinessData(res.readiness);
      setLoading(false);
    });
  }, []);

  if (loading || !readinessData) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Calculating placement readiness parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Placement Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Placement Readiness Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-dimensional evaluation synthesizing your 8.65 CGPA, Java coding challenges, system design depth, mock interviews, and active SkillSwaps.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Overall Readiness
          </span>
          <div className="text-4xl font-black text-emerald-400 tabular-nums">
            {readinessData.overallReadiness}%
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Eligible for Tier-1 Drives</span>
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readinessData.categories.map((cat: any, i: number) => {
          const isStrong = cat.status === 'Strong';
          const isGood = cat.status === 'Good' || cat.status === 'Moderate';
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                <span
                  className={`text-xs font-extrabold tabular-nums ${
                    cat.score >= 80
                      ? 'text-emerald-400'
                      : cat.score >= 70
                      ? 'text-indigo-400'
                      : 'text-amber-400'
                  }`}
                >
                  {cat.score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cat.score >= 80
                      ? 'bg-emerald-500'
                      : cat.score >= 70
                      ? 'bg-indigo-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recommended Placement Action Plan */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span>Action Plan to Reach 90%+ Placement Readiness</span>
        </h3>

        <div className="space-y-3">
          {readinessData.actionPlan.map((item: any, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.action}</p>
                  <p className="text-[11px] text-slate-400">Estimated duration: {item.timeEstimate}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (item.step === 1) onNavigate('javalab');
                  else if (item.step === 2) onNavigate('projects');
                  else if (item.step === 3) onNavigate('courses');
                  else onNavigate('mockinterview');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700 font-semibold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Start Action Step
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
