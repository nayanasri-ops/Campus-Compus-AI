import React from 'react';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockIndustryTrends } from '../../data/mockData';

export const IndustryTrendsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Market Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Industry Trends & Salary Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time tech recruitment market analysis tracking YoY skill demand growth, compensation trajectories, and hiring sector distributions.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Analyzed Postings</span>
          <span className="font-bold text-cyan-300 font-mono">140,000+ SDE Jobs</span>
        </div>
      </div>

      {/* Top Trending Skills Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Top In-Demand Technical Skills (2026-2027)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockIndustryTrends.trendingSkills.map((sk, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-indigo-600/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {sk.demandGrowth}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Open Postings: <strong className="text-slate-200">{sk.openJobs}</strong></span>
                <span>Avg: <strong className="text-white">{sk.avgSalary}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Trajectories & Hiring Sectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Salary Benchmarks */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Experience-Adjusted Salary Progression</span>
            </h3>
            <span className="text-[11px] text-slate-500">Tier-1 & Tier-2 Median</span>
          </div>

          <div className="space-y-4">
            {mockIndustryTrends.salaryBenchmarks.map((bench, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{bench.role}</h4>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{bench.senior} (Senior)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <div>Entry: <span className="font-semibold text-slate-200">{bench.entry}</span></div>
                  <div>Mid: <span className="font-semibold text-slate-200">{bench.mid}</span></div>
                  <div>Lead: <span className="font-semibold text-emerald-300">{bench.senior}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Sectors Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Campus Hiring Sectors</span>
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {mockIndustryTrends.hiringSectors.map((sector, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{sector.sector}</span>
                  <span className="font-mono font-bold text-cyan-400">{sector.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${sector.percentage * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
