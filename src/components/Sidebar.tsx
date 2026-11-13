import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  BookOpen,
  GraduationCap,
  Users2,
  Map,
  FileCheck,
  Target,
  Trophy,
  Briefcase,
  Code2,
  Mic,
  TrendingUp,
  Award,
  Calendar,
  Share2,
  UserCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const navSections = [
    {
      group: 'Core Platform',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'community', label: 'Student Community', icon: Users2, badge: 'Real Peers' },
        { id: 'trustcenter', label: 'Student Trust Center', icon: ShieldCheck, badge: 'Audited' },
        { id: 'skillswap', label: 'SkillSwap Marketplace', icon: Sparkles, badge: 'Flagship' },
        { id: 'advisor', label: 'AI Advisor', icon: Compass },
        { id: 'courses', label: 'Courses & Certs', icon: BookOpen },
        { id: 'electives', label: 'Elective Advisor', icon: GraduationCap },
      ],
    },
    {
      group: 'Technical & Coding',
      items: [
        { id: 'javalab', label: 'Java Skills Lab', icon: Code2, badge: 'Java 21' },
        { id: 'projects', label: 'Project Team Matching', icon: Users2 },
        { id: 'roadmap', label: 'Career Roadmaps', icon: Map },
        { id: 'mockinterview', label: 'AI Mock Interviews', icon: Mic },
      ],
    },
    {
      group: 'Career & Placement',
      items: [
        { id: 'resume', label: 'AI Resume Analyzer', icon: FileCheck },
        { id: 'placement', label: 'Placement Readiness', icon: Target },
        { id: 'hackathons', label: 'Hackathons Finder', icon: Trophy },
        { id: 'internships', label: 'Internship Finder', icon: Briefcase },
        { id: 'trends', label: 'Industry Trends', icon: TrendingUp },
      ],
    },
    {
      group: 'Productivity & Profile',
      items: [
        { id: 'timetable', label: 'Smart Timetable', icon: Calendar },
        { id: 'optimizer', label: 'Profile Optimizer & AI Cover Letter', icon: Share2 },
        { id: 'gamification', label: 'Achievements & XP', icon: Award },
        { id: 'profile', label: 'Student Profile', icon: UserCheck },
      ],
    },
  ];

  if (currentUser.role === 'ADMIN') {
    navSections.push({
      group: 'Administration',
      items: [{ id: 'admin', label: 'Admin Analytics', icon: ShieldCheck, badge: 'Staff' }],
    });
  }

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-30 transition-all duration-300 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="overflow-y-auto px-2 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {section.group}
              </p>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-900/60 to-indigo-800/40 text-indigo-200 border border-indigo-700/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-indigo-400 scale-110' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        item.badge === 'Flagship'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-900 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-500">Live Campus Network</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
