import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Elective } from '../../types';

interface ElectivesViewProps {
  electives: Elective[];
}

export const ElectivesView: React.FC<ElectivesViewProps> = ({ electives }) => {
  const [enrolledElectives, setEnrolledElectives] = useState<string[]>([]);

  const handleEnroll = (code: string) => {
    if (!enrolledElectives.includes(code)) {
      setEnrolledElectives(prev => [...prev, code]);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> University Curricular Advisor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Semester Electives Recommendation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            AI-driven elective selection matching your 8.65 CGPA, upcoming Semester 7 course allocations, and target Java Backend & Cloud engineering profiles.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs shrink-0 text-right">
          <span className="text-[11px] text-slate-400 block">Registration Status</span>
          <span className="font-bold text-emerald-400">
            {enrolledElectives.length} Electives Shortlisted
          </span>
        </div>
      </div>

      {/* Electives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {electives.map(el => {
          const isEnrolled = enrolledElectives.includes(el.code);
          return (
            <div
              key={el.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-indigo-600/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {el.code} · {el.credits} Credits · Sem {el.semester}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 leading-snug">
                      {el.name}
                    </h3>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-950 to-cyan-950 border border-indigo-700/60 text-right shrink-0">
                    <span className="text-xs font-extrabold text-cyan-300 tabular-nums">
                      {el.matchScore}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-cyan-400 block">
                      AI Match
                    </span>
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/40 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Why AI Recommends It
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {el.whyRecommended}
                  </p>
                </div>

                {/* Syllabus Highlights */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Syllabus Modules:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {el.syllabusHighlights.map((mod, i) => (
                      <li key={i}>{mod}</li>
                    ))}
                  </ul>
                </div>

                {/* Aligned Careers */}
                <div className="pt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Aligned Careers: </span>
                  {el.alignedCareers.join(' · ')}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleEnroll(el.code)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isEnrolled
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/50'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                {isEnrolled ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Shortlisted Course Plan</span>
                  </>
                ) : (
                  <span>Shortlist for Semester 7 Enrollment</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
