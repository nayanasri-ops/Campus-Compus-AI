import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Check,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Internship } from '../../types';

interface InternshipsViewProps {
  internships: Internship[];
}

export const InternshipsView: React.FC<InternshipsViewProps> = ({ internships }) => {
  const [appliedList, setAppliedList] = useState<string[]>([]);

  const handleApply = (id: string) => {
    if (!appliedList.includes(id)) {
      setAppliedList(prev => [...prev, id]);
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Early Career Gateway
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Internship Finder & Matching Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Direct recruitment pipeline matching pre-final and final year computer science students with verified software engineering internships.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Applications Tracked</span>
          <span className="font-bold text-emerald-400 font-mono">
            {appliedList.length} Active Submissions
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internships.map(intern => {
          const isApplied = appliedList.includes(intern.id);
          return (
            <div
              key={intern.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm text-indigo-400 font-mono shadow-inner">
                      {intern.logoText}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {intern.company}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {intern.role}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold shrink-0 tabular-nums">
                    {intern.matchPercentage}% Match
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monthly Stipend:</span>
                    <span className="font-bold text-emerald-400">{intern.stipend}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white">{intern.location} {intern.isRemote && '(Remote)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deadline:</span>
                    <span className="text-amber-300 font-semibold">{intern.deadline}</span>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Eligibility: {intern.eligibility}
                  </div>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {intern.requiredSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleApply(intern.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/50'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Application Logged</span>
                    </>
                  ) : (
                    <span>One-Click Fast Apply</span>
                  )}
                </button>
                <a
                  href={intern.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
