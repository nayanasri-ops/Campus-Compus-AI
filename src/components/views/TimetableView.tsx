import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Layers,
  BookOpen,
  Code2,
  Users2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User } from '../../types';

interface TimetableViewProps {
  currentUser: User;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ currentUser }) => {
  const [availableHours, setAvailableHours] = useState(4);
  const [timetable, setTimetable] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.generateTimetable({
        availableHours,
        careerGoal: currentUser.careerGoal,
      });
      setTimetable(res.timetable);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Study Automation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Timetable & Weekly Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            AI balances your university lectures, DSA problem quotas, enterprise Java projects, and peer SkillSwap exchanges into a realistic high-retention schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-slate-400">Daily Free Hours:</span>
            <select
              value={availableHours}
              onChange={e => setAvailableHours(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
            >
              <option value={3}>3 Hours</option>
              <option value={4}>4 Hours</option>
              <option value={5}>5 Hours</option>
              <option value={6}>6 Hours</option>
            </select>
          </div>

          <button
            onClick={() => {
              generatePlan();
              confetti({ particleCount: 40, spread: 50 });
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {timetable && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Schedule */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Optimized Daily Routine</span>
            </h3>

            <div className="space-y-3">
              {timetable.dailySchedule.map((slot: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
                >
                  <span className="text-[11px] font-mono text-cyan-400 shrink-0 mt-0.5 font-semibold">
                    {slot.time}
                  </span>
                  <div>
                    <h4 className="font-bold text-white">{slot.activity}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{slot.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Day-by-Day Agenda */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>7-Day Academic & Tech Plan</span>
            </h3>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {days.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedDay === d
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {timetable.weeklyPlan[selectedDay] && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{selectedDay} Focus</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {timetable.weeklyPlan[selectedDay].targetHours} hrs target
                  </span>
                </div>
                <p className="text-sm font-semibold text-indigo-300">
                  {timetable.weeklyPlan[selectedDay].focus}
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400">
                  💡 Tip: Pair this day's focus with your active SkillSwap partner to review mutual progress before midnight.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
