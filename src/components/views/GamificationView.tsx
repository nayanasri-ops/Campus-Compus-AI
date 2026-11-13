import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Trophy,
  CheckCircle2,
  Sparkles,
  Zap,
  Star,
  Users2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User } from '../../types';

interface GamificationViewProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(res => setLeaderboard(res.leaderboard || []));
  }, []);

  const allBadges = [
    { name: 'Java Master', icon: '☕', desc: 'Completed 5+ Java coding challenges and tutored a peer in OOP', earned: currentUser.badges.includes('Java Master') },
    { name: 'SkillSwap Mentor', icon: '🤝', desc: 'Maintained 4.9+ rating across verified peer learning exchanges', earned: currentUser.badges.includes('SkillSwap Mentor') },
    { name: 'Learning Streak', icon: '🔥', desc: 'Active platform learning and code check-ins for 14 straight days', earned: currentUser.badges.includes('Learning Streak') },
    { name: 'Project Builder', icon: '🚀', desc: 'Created an open source capstone project and formed a student team', earned: currentUser.badges.includes('Project Builder') },
    { name: 'Cyber Defender', icon: '🛡️', desc: 'Completed the Cisco Network Security and Cryptography modules', earned: false },
    { name: 'AI Explorer', icon: '🧠', desc: 'Executed 10+ prompt engineering and model inference tasks', earned: false },
    { name: 'Hackathon Hero', icon: '🏆', desc: 'Registered for an inter-collegiate innovation sprint', earned: false },
    { name: 'Placement Ready', icon: '🎯', desc: 'Exceeded 85% on the holistic Placement Readiness Engine', earned: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Campus Achievements & Honors
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gamification & Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Earn verifiable SkillSwap credentials, unlock badges, maintain daily learning streaks, and climb the campus engineering leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <span className="text-[11px] text-slate-400 block">Total XP</span>
            <span className="text-xl font-extrabold text-indigo-400 font-mono tabular-nums">
              {currentUser.xp.toLocaleString()}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-[11px] text-slate-400 block">Streak</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums flex items-center gap-1 justify-center">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{currentUser.streak}d</span>
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Badges & Milestones ({allBadges.filter(b => b.earned).length} of {allBadges.length} Unlocked)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {allBadges.map((badge, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                badge.earned
                  ? 'bg-slate-900/90 border-indigo-600/50 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="text-3xl mx-auto">{badge.icon}</div>
              <h4 className="text-xs font-bold text-white">{badge.name}</h4>
              <p className="text-[11px] text-slate-400 leading-snug">{badge.desc}</p>
              <span
                className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  badge.earned
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {badge.earned ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Campus Engineering Leaderboard</span>
          </h3>
          <span className="text-[11px] text-slate-500">Updated hourly from peer exchanges</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {leaderboard.map(entry => {
            const isMe = entry.name.includes('(You)');
            return (
              <div
                key={entry.rank}
                className={`py-3 px-3 flex items-center justify-between text-xs rounded-xl transition-colors ${
                  isMe ? 'bg-indigo-950/60 border border-indigo-700/60' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg font-bold font-mono text-center flex items-center justify-center shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : entry.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {entry.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span>{entry.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({entry.branch})
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {entry.swapsCompleted} SkillSwaps completed · {entry.streak}d streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-indigo-300 font-mono tabular-nums block">
                    {entry.xp.toLocaleString()} XP
                  </span>
                  <span className="text-[10px] text-slate-500">{entry.badgesCount} Badges</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
