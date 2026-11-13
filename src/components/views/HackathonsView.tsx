import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Users2,
  ExternalLink,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hackathon } from '../../types';

interface HackathonsViewProps {
  hackathons: Hackathon[];
}

export const HackathonsView: React.FC<HackathonsViewProps> = ({ hackathons }) => {
  const [registeredList, setRegisteredList] = useState<string[]>([]);

  const handleRegister = (title: string) => {
    if (!registeredList.includes(title)) {
      setRegisteredList(prev => [...prev, title]);
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Innovation Sprints
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hackathon Recommendation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Match with hackathons by programming language, prize tracks, and campus eligibility. Register or find teammates via Campus Compass AI.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Registered Events</span>
          <span className="font-bold text-amber-400 font-mono">
            {registeredList.length} Competitions
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map(h => {
          const isRegistered = registeredList.includes(h.title);
          return (
            <div
              key={h.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      {h.organizer} · {h.mode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                      {h.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold shrink-0 tabular-nums">
                    {h.matchPercentage}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Theme: </strong>{h.theme}
                </p>

                {/* Tech & Dates */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-semibold text-white">{h.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Registration Deadline:</span>
                    <span className="font-semibold text-amber-300">{h.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Prizes:</span>
                    <span className="font-bold text-emerald-400">{h.prizePool}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Team Size:</span>
                    <span className="text-white">{h.teamSize}</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {h.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleRegister(h.title)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isRegistered
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-600/50'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Registration Confirmed</span>
                    </>
                  ) : (
                    <span>Register Team (+100 XP)</span>
                  )}
                </button>
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Official hackathon portal"
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
