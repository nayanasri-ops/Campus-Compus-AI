import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  ArrowRightLeft,
  Calendar,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  ExternalLink,
  Award,
  Send,
  UserCheck,
  Filter,
  Check,
  Flame,
  ThumbsUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User, SkillSwapRequest, SkillSwapSession, ChatMessage } from '../../types';

interface SkillSwapViewProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const SkillSwapView: React.FC<SkillSwapViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'requests' | 'active' | 'completed' | 'skills'>('matches');
  const [matches, setMatches] = useState<any[]>([]);
  const [requests, setRequests] = useState<SkillSwapRequest[]>([]);
  const [sessions, setSessions] = useState<SkillSwapSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'All' | 'Online' | 'Offline' | 'Both'>('All');

  // Request Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestMode, setRequestMode] = useState<'Online' | 'Offline' | 'Both'>('Online');
  const [requestAvailability, setRequestAvailability] = useState('Weekday Evenings 7-9 PM');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Active Chat State
  const [activeChatRequest, setActiveChatRequest] = useState<SkillSwapRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Schedule Session Modal State
  const [scheduleModalRequest, setScheduleModalRequest] = useState<SkillSwapRequest | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Java Spring Boot ↔ Python ML Peer Session');
  const [sessionDate, setSessionDate] = useState('2026-10-08T18:30');
  const [sessionTopic, setSessionTopic] = useState('Hands-on live coding: REST controllers and data pipelines.');
  const [sessionDuration, setSessionDuration] = useState(60);

  // Rating Modal State
  const [ratingModalRequest, setRatingModalRequest] = useState<SkillSwapRequest | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('Outstanding mentor! Patient, structured, and very knowledgeable.');

  // My Skills Management
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchesRes, reqsRes, sessRes] = await Promise.all([
        api.getSkillSwapMatches(),
        api.getSkillSwapRequests(),
        api.getSkillSwapSessions(),
      ]);
      setMatches(matchesRes.matches || []);
      setRequests(reqsRes.requests || []);
      setSessions(sessRes.sessions || []);
    } catch (err) {
      console.error('Failed to load SkillSwap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequestModal = (match: any) => {
    setSelectedStudent(match.student);
    setOfferedSkill(currentUser.skillsTeaching[0] || 'Java');
    setRequestedSkill(match.student.skillsTeaching[0] || 'Python');
    setRequestMessage(
      `Hi ${match.student.name.split(' ')[0]}! I can mentor you in ${currentUser.skillsTeaching[0] || 'Java'}. Would love to learn ${match.student.skillsTeaching[0] || 'Python'} from you!`
    );
    setRequestMode(match.student.preferredMode || 'Online');
  };

  const handleSendRequest = async () => {
    if (!selectedStudent) return;
    setIsSubmittingRequest(true);
    try {
      const res = await api.sendSkillSwapRequest({
        receiverId: selectedStudent.id,
        skillOffered: offeredSkill,
        skillRequested: requestedSkill,
        message: requestMessage,
        availability: requestAvailability,
        preferredMode: requestMode,
      });
      if (res.success) {
        setRequests(prev => [res.request, ...prev]);
        setSelectedStudent(null);
        setShowSuccessToast(true);
        confetti({ particleCount: 50, spread: 60 });
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await api.updateSkillSwapRequest(id, { status });
      if (res.success) {
        setRequests(prev => prev.map(r => (r.id === id ? res.request : r)));
        if (status === 'Accepted' || status === 'Active') {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenChat = async (req: SkillSwapRequest) => {
    setActiveChatRequest(req);
    try {
      const res = await api.getChatMessages(req.id);
      setChatMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatMessage = async () => {
    if (!activeChatRequest || !chatInput.trim()) return;
    try {
      const res = await api.sendChatMessage(activeChatRequest.id, chatInput);
      if (res.success) {
        setChatMessages(prev => [...prev, res.message]);
        setChatInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleSession = async () => {
    if (!scheduleModalRequest) return;
    try {
      const res = await api.createSkillSwapSession({
        swapRequestId: scheduleModalRequest.id,
        title: sessionTitle,
        scheduledTime: sessionDate,
        durationMinutes: sessionDuration,
        topic: sessionTopic,
        mode: scheduleModalRequest.preferredMode === 'Offline' ? 'Offline' : 'Online',
      });
      if (res.success) {
        setSessions(prev => [...prev, res.session]);
        setScheduleModalRequest(null);
        confetti({ particleCount: 60, spread: 80 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitRating = async () => {
    if (!ratingModalRequest) return;
    try {
      const res = await api.updateSkillSwapRequest(ratingModalRequest.id, {
        rating: { score: ratingScore, feedback: ratingFeedback },
        status: 'Completed',
      });
      if (res.success) {
        setRequests(prev => prev.map(r => (r.id === ratingModalRequest.id ? res.request : r)));
        setRatingModalRequest(null);
        confetti({ particleCount: 100, spread: 90 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTeachSkill = () => {
    if (!newTeachSkill.trim()) return;
    const updated = [...currentUser.skillsTeaching, newTeachSkill.trim()];
    api.updateProfile({ skillsTeaching: updated }).then(res => {
      if (res.success) {
        onUpdateUser(res.profile);
        setNewTeachSkill('');
      }
    });
  };

  const handleAddLearnSkill = () => {
    if (!newLearnSkill.trim()) return;
    const updated = [...currentUser.skillsLearning, newLearnSkill.trim()];
    api.updateProfile({ skillsLearning: updated }).then(res => {
      if (res.success) {
        onUpdateUser(res.profile);
        setNewLearnSkill('');
      }
    });
  };

  // Filtered Matches
  const filteredMatches = matches.filter(m => {
    const q = searchQuery.toLowerCase();
    const nameMatch = m.student.name.toLowerCase().includes(q);
    const branchMatch = m.student.branch.toLowerCase().includes(q);
    const skillTeachMatch = m.student.skillsTeaching.some((s: string) => s.toLowerCase().includes(q));
    const skillLearnMatch = m.student.skillsLearning.some((s: string) => s.toLowerCase().includes(q));
    const matchesSearch = nameMatch || branchMatch || skillTeachMatch || skillLearnMatch;
    const matchesMode = modeFilter === 'All' || m.student.preferredMode === modeFilter || m.student.preferredMode === 'Both';
    return matchesSearch && matchesMode;
  });

  const incomingRequests = requests.filter(r => r.receiverId === currentUser.id);
  const sentRequests = requests.filter(r => r.senderId === currentUser.id);
  const activeExchanges = requests.filter(r => r.status === 'Active' || r.status === 'Accepted');
  const completedExchanges = requests.filter(r => r.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-700/80 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">SkillSwap Request Sent!</p>
            <p className="text-[11px] text-emerald-300">Your peer will receive an instant notification.</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-indigo-800/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Flagship Peer Learning Marketplace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            SkillSwap Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            "I help you with my skill, and you help me with yours." Exchange technical knowledge, book live collaborative sessions, rate peer mentors, and unlock verified skill credentials.
          </p>
        </div>

        {/* SkillSwap Quick Stats */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-extrabold text-indigo-400 tabular-nums">
              {currentUser.skillsTeaching.length}
            </div>
            <div className="text-[11px] text-slate-400">Skills I Teach</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-xl font-extrabold text-violet-400 tabular-nums">
              {currentUser.skillsLearning.length}
            </div>
            <div className="text-[11px] text-slate-400">Skills Wanted</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-xl font-extrabold text-emerald-400 tabular-nums">
              {completedExchanges.length + 6}
            </div>
            <div className="text-[11px] text-slate-400">Swaps Done</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'matches'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Matched Peers ({filteredMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Requests</span>
          {incomingRequests.filter(r => r.status === 'Pending').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {incomingRequests.filter(r => r.status === 'Pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Active Exchanges ({activeExchanges.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Completed & Ratings ({completedExchanges.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manage My Skills & Badges
        </button>
      </div>

      {/* Tab 1: AI Matched Peers */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student, branch, or skill..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-slate-400">Mode:</span>
              {(['All', 'Online', 'Offline', 'Both'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setModeFilter(mode)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    modeFilter === mode
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredMatches.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center mx-auto text-indigo-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Matched Peer Profiles Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Only authentic registered students appear in SkillSwap. As new students register and list skills they teach and want to learn, mutual matches will appear here automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map(match => {
              const student: User = match.student;
              return (
                <div
                  key={student.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 hover:border-indigo-600/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-indigo-950/40"
                >
                  <div className="space-y-3">
                    {/* Header: Photo, Name, Branch, Compatibility */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white">{student.name}</h3>
                          <p className="text-[11px] text-slate-400">
                            {student.branch} · Year {student.year}
                          </p>
                          <p className="text-[11px] text-indigo-400 font-mono">
                            CGPA {student.cgpa} · {student.preferredMode}
                          </p>
                        </div>
                      </div>

                      {/* Compatibility Badge */}
                      <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-950 to-violet-950 border border-indigo-700/60 text-right">
                        <div className="text-xs font-extrabold text-indigo-300 tabular-nums">
                          {match.compatibilityScore}%
                        </div>
                        <div className="text-[9px] uppercase tracking-wider font-semibold text-indigo-400">
                          Match
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {student.bio}
                    </p>

                    {/* Skills Teaching & Learning (No pill clutter: clean typography) */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                          Can Teach You:
                        </span>
                        <p className="text-xs text-slate-200 mt-0.5 font-medium">
                          {student.skillsTeaching.join(' · ')}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                          Wants to Learn:
                        </span>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {student.skillsLearning.join(' · ')}
                        </p>
                      </div>
                    </div>

                    {/* Suggested Exchange & AI Reasoning */}
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Suggested Exchange</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        {match.suggestedExchange}
                      </p>
                      <p className="text-[11px] text-slate-400 pt-1 leading-normal">
                        {match.matchReasons[0]}
                      </p>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => handleOpenRequestModal(match)}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send Skill Swap Request</span>
                  </button>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* Tab 2: Requests (Incoming & Sent) */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incoming Requests */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>Incoming Requests ({incomingRequests.length})</span>
            </h2>

            {incomingRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
                No incoming requests right now. Explore matched peers to initiate exchanges!
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.senderAvatar}
                          alt={req.senderName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{req.senderName}</h4>
                          <p className="text-[11px] text-slate-400">
                            {req.senderBranch} · Year {req.senderYear}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          req.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : req.status === 'Accepted' || req.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-emerald-400 font-medium">Offers to teach:</span>
                        <span className="font-semibold text-white">{req.skillOffered}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-amber-400 font-medium">Requests from you:</span>
                        <span className="font-semibold text-white">{req.skillRequested}</span>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-400 italic">
                        "{req.message}"
                      </div>
                    </div>

                    {req.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Request
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Rejected')}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Sent Requests ({sentRequests.length})
            </h2>

            {sentRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
                You haven't sent any skill swap requests yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.receiverAvatar}
                          alt={req.receiverName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-violet-500"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{req.receiverName}</h4>
                          <p className="text-[11px] text-slate-400">
                            Sent {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <div>You teach: <span className="font-semibold text-white">{req.skillOffered}</span></div>
                      <div>You learn: <span className="font-semibold text-white">{req.skillRequested}</span></div>
                      <div className="text-[11px] text-slate-400 pt-1">"{req.message}"</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Active Exchanges */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeExchanges.map(req => {
              const otherName = req.senderId === currentUser.id ? req.receiverName : req.senderName;
              const otherAvatar = req.senderId === currentUser.id ? req.receiverAvatar : req.senderAvatar;
              const relatedSessions = sessions.filter(s => s.swapRequestId === req.id);

              return (
                <div
                  key={req.id}
                  className="rounded-2xl bg-slate-900/80 border border-indigo-800/40 p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={otherAvatar}
                        alt={otherName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{otherName}</h3>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Trading: <strong className="text-indigo-300">{req.skillOffered}</strong> ↔ <strong className="text-violet-300">{req.skillRequested}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Sessions for this Exchange */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      Scheduled Sessions ({relatedSessions.length})
                    </span>
                    {relatedSessions.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No session booked yet. Click "Schedule Session" below.</p>
                    ) : (
                      relatedSessions.map(sess => (
                        <div
                          key={sess.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-slate-200">{sess.title}</p>
                            <p className="text-[11px] text-slate-400 tabular-nums">
                              {new Date(sess.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} · {sess.durationMinutes}m
                            </p>
                          </div>
                          <a
                            href={sess.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Video className="w-3 h-3" />
                            <span>Join</span>
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Action Buttons: Chat, Schedule, Complete & Rate */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenChat(req)}
                      className="py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-700/50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => setScheduleModalRequest(req)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Schedule</span>
                    </button>
                    <button
                      onClick={() => setRatingModalRequest(req)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Rate & Done</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Completed & Ratings */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Verified Completed SkillSwaps ({completedExchanges.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedExchanges.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.receiverAvatar}
                      alt={req.receiverName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {req.senderName} ↔ {req.receiverName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {req.skillOffered} for {req.skillRequested}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified
                  </span>
                </div>

                {req.rating && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(req.rating.score)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="text-xs font-semibold text-slate-300 ml-1">
                        {req.rating.score}.0 / 5.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{req.rating.feedback}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Manage Skills & Badges */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills I Can Teach */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Skills I Can Teach ({currentUser.skillsTeaching.length})</span>
              <span className="text-xs text-indigo-400 font-normal">Earn 50 XP per swap</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsTeaching.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-200 text-xs font-medium flex items-center gap-2"
                >
                  <span>{skill}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a new skill you can teach (e.g. Docker, Rust)..."
                value={newTeachSkill}
                onChange={e => setNewTeachSkill(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddTeachSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Skills I Want to Learn ({currentUser.skillsLearning.length})</span>
              <span className="text-xs text-violet-400 font-normal">AI Match Priority</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsLearning.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-violet-950/70 border border-violet-800/60 text-violet-200 text-xs font-medium flex items-center gap-2"
                >
                  <span>{skill}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a skill you want to learn (e.g. PyTorch, Kubernetes)..."
                value={newLearnSkill}
                onChange={e => setNewLearnSkill(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleAddLearnSkill}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Target
              </button>
            </div>
          </div>

          {/* SkillSwap Badges Showcase */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>SkillSwap Badges & Honors</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  ☕
                </div>
                <h4 className="text-xs font-bold text-white">Java Master</h4>
                <p className="text-[11px] text-slate-400">Completed 5+ Java tutoring sessions</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
                  🤝
                </div>
                <h4 className="text-xs font-bold text-white">SkillSwap Mentor</h4>
                <p className="text-[11px] text-slate-400">Maintained a 4.9+ peer rating score</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                  🔥
                </div>
                <h4 className="text-xs font-bold text-white">14d Learning Streak</h4>
                <p className="text-[11px] text-slate-400">Active exchanges for 2 consecutive weeks</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                  🚀
                </div>
                <h4 className="text-xs font-bold text-white">Project Builder</h4>
                <p className="text-[11px] text-slate-400">Turned a SkillSwap into an open-source repo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Send Request Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Send Request to {selectedStudent.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedStudent.branch} · Year {selectedStudent.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Skill You Offer to Teach:
                  </label>
                  <select
                    value={offeredSkill}
                    onChange={e => setOfferedSkill(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {currentUser.skillsTeaching.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Skill You Request to Learn:
                  </label>
                  <select
                    value={requestedSkill}
                    onChange={e => setRequestedSkill(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {selectedStudent.skillsTeaching.map((s: string, i: number) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Introduction & Proposed Topic:
                </label>
                <textarea
                  rows={3}
                  value={requestMessage}
                  onChange={e => setRequestMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Preferred Mode:</label>
                  <select
                    value={requestMode}
                    onChange={e => setRequestMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Online">Online (Google Meet)</option>
                    <option value="Offline">Offline (Campus Lab)</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Your Availability:</label>
                  <input
                    type="text"
                    value={requestAvailability}
                    onChange={e => setRequestAvailability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingRequest}
                onClick={handleSendRequest}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingRequest ? 'Sending...' : 'Confirm Request'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-on-1 Chat Modal */}
      {activeChatRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg h-[540px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  💬
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {activeChatRequest.senderId === currentUser.id
                      ? activeChatRequest.receiverName
                      : activeChatRequest.senderName}
                  </h4>
                  <p className="text-[10px] text-emerald-400">Active SkillSwap Channel</p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      m.senderId === currentUser.id
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.message}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 tabular-nums">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message or share code links..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSendChatMessage}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Schedule Session Modal */}
      {scheduleModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Schedule Peer Learning Session</span>
              </h3>
              <button
                onClick={() => setScheduleModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Session Title:</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duration (Mins):</label>
                  <select
                    value={sessionDuration}
                    onChange={e => setSessionDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Learning Focus & Topics:</label>
                <textarea
                  rows={2}
                  value={sessionTopic}
                  onChange={e => setSessionTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                A secure Google Meet link will be generated automatically and shared with your peer.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setScheduleModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleSession}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Rating & Review Modal */}
      {ratingModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Rate & Complete Exchange</span>
              </h3>
              <button
                onClick={() => setRatingModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-300">
                How was your peer tutoring session? Your rating rewards your mentor with verified SkillSwap points.
              </p>

              <div>
                <label className="block text-slate-400 font-medium mb-2">Rating:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-white ml-2">{ratingScore} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Feedback Testimonial:</label>
                <textarea
                  rows={3}
                  value={ratingFeedback}
                  onChange={e => setRatingFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRatingModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Submit Review (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
