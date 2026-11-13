import React, { useState } from 'react';
import {
  Compass,
  Bell,
  Sparkles,
  Flame,
  Award,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
  Users2
} from 'lucide-react';
import { User, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  onSwitchUser: (role: 'STUDENT' | 'ADMIN') => void;
  onOpenCompassAI: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  onSwitchUser,
  onOpenCompassAI,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Element */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Campus Compass AI
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Users2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Community</span>
          </button>
          <button
            onClick={() => setActiveTab('skillswap')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'skillswap'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            SkillSwap
          </button>
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'advisor'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            AI Advisor
          </button>
          <button
            onClick={() => setActiveTab('javalab')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'javalab'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Java Lab
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'resume'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Resume ATS
          </button>
          <button
            onClick={() => setActiveTab('placement')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'placement'
                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Readiness
          </button>
          <button
            onClick={() => setActiveTab('trustcenter')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'trustcenter'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trust Center</span>
          </button>
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-sm'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions, XP, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Streak & XP Metrics */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold tabular-nums">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{currentUser.streak}d streak</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold tabular-nums">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentUser.xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Ask Compass AI CTA */}
          <button
            onClick={onOpenCompassAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span> Compass AI
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Notifications ({notifications.length})
                  </h4>
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto mt-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.actionUrl) setActiveTab(n.actionUrl.replace('/', ''));
                        setShowNotifications(false);
                      }}
                      className="py-2.5 px-1 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-500 shrink-0 tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/40"
              />
              <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1 text-[11px] text-indigo-400 font-mono">
                    {currentUser.role} · CGPA {currentUser.cgpa}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    My Student Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('gamification');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Badges & Leaderboard
                  </button>
                </div>

                {/* Instant Demo Switcher */}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Demo Mode Switcher
                  </p>
                  <button
                    onClick={() => {
                      onSwitchUser('STUDENT');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      currentUser.role === 'STUDENT'
                        ? 'bg-indigo-950/60 text-indigo-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>Arjun Reddy (Student)</span>
                    {currentUser.role === 'STUDENT' && <span className="text-[10px] text-emerald-400">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser('ADMIN');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-purple-950/60 text-purple-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>Prof. Raman Murthy (Dean)</span>
                    {currentUser.role === 'ADMIN' && <span className="text-[10px] text-purple-400">Active</span>}
                  </button>
                </div>

                {/* Sign Out Action */}
                {onLogout && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
