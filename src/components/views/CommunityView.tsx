import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users2,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Camera,
  Upload,
  X,
  Check,
  Send,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, DirectMessage } from '../../types';
import { api } from '../../services/api';

interface CommunityViewProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onSwitchUser?: (user: User) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  currentUser,
  onUpdateUser,
  onSwitchUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  // Modals
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [messagingUser, setMessagingUser] = useState<User | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState<boolean>(false);

  // Chat State
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // AI Recommendation State
  const [aiRecommendations, setAiRecommendations] = useState<Array<{ userId: string; reason: string; matchPercentage?: number }>>([]);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');

  // Register Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCourse, setRegCourse] = useState<string>('B.Tech Computer Science & Engineering');
  const [regCollege, setRegCollege] = useState<string>('VNR VJIET, Hyderabad');
  const [regYear, setRegYear] = useState<string>('3rd Year');
  const [regSkillsInput, setRegSkillsInput] = useState<string>('Java, Spring Boot, SQL');
  const [regInterestsInput, setRegInterestsInput] = useState<string>('AI/ML, Microservices');
  const [regBio, setRegBio] = useState<string>('3rd Year CSE student passionate about enterprise Java, cloud systems, and real-world coding.');
  const [regAvatarUrl, setRegAvatarUrl] = useState<string>('');
  const [regSubmitting, setRegSubmitting] = useState<boolean>(false);
  const regFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState<string>(currentUser.name);
  const [editCourse, setEditCourse] = useState<string>(currentUser.course || 'B.Tech');
  const [editCollege, setEditCollege] = useState<string>(currentUser.college || 'VNR VJIET, Hyderabad');
  const [editYear, setEditYear] = useState<string>(String(currentUser.year || '3rd Year'));
  const [editBio, setEditBio] = useState<string>(currentUser.bio || '');
  const [editSkillsInput, setEditSkillsInput] = useState<string>((currentUser.skills || []).join(', '));
  const [editInterestsInput, setEditInterestsInput] = useState<string>((currentUser.interests || []).join(', '));
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>(currentUser.avatarUrl || '');
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCommunityUsers();
  }, []);

  useEffect(() => {
    setEditName(currentUser.name);
    setEditCourse(currentUser.course || 'B.Tech');
    setEditCollege(currentUser.college || 'VNR VJIET, Hyderabad');
    setEditYear(String(currentUser.year || '3rd Year'));
    setEditBio(currentUser.bio || '');
    setEditSkillsInput((currentUser.skills || []).join(', '));
    setEditInterestsInput((currentUser.interests || []).join(', '));
    setEditAvatarUrl(currentUser.avatarUrl || '');
  }, [currentUser]);

  // Load Community Users
  const loadCommunityUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunityUsers();
      if (res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn('Failed to fetch community users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger AI Collaboration Advisor Service
  const loadAiRecommendations = async () => {
    setAiLoading(true);
    try {
      const res = await api.getCommunityAIRecommendations();
      if (res.recommendations) {
        setAiRecommendations(res.recommendations);
      }
      if (res.message) {
        setAiMessage(res.message);
      }
    } catch (err) {
      console.warn('AI collaboration recommendation error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Open Chat with a Registered User
  const handleOpenChat = async (targetUser: User) => {
    setMessagingUser(targetUser);
    try {
      const res = await api.getDirectMessages(targetUser.id);
      setMessages(res.messages || []);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  // Send Direct Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !messagingUser) return;
    setSendingMessage(true);
    try {
      const res = await api.sendDirectMessage(messagingUser.id, chatInput.trim());
      if (res.success && res.message) {
        setMessages(prev => [...prev, res.message]);
        setChatInput('');
        setTimeout(() => {
          chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Toggle Connect / Follow
  const handleToggleConnect = async (targetUserId: string) => {
    try {
      const res = await api.toggleConnect(targetUserId);
      if (res.success) {
        // Update current user connections
        const updatedCurrentUser = {
          ...currentUser,
          connections: res.connections,
        };
        onUpdateUser(updatedCurrentUser);

        // Update target user connection count in local users list
        setUsers(prev =>
          prev.map(u => {
            if (u.id === currentUser.id) {
              return { ...u, connections: res.connections };
            }
            if (u.id === targetUserId) {
              const hasMe = (u.connections || []).includes(currentUser.id);
              const newConns = hasMe
                ? (u.connections || []).filter(id => id !== currentUser.id)
                : [...(u.connections || []), currentUser.id];
              return { ...u, connections: newConns };
            }
            return u;
          })
        );

        if (res.connected) {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        }
      }
    } catch (err) {
      console.error('Failed to toggle connection:', err);
    }
  };

  // Switch Active User
  const handleSwitchAccount = async (targetUser: User) => {
    try {
      const res = await api.switchUser(targetUser.id);
      if (res.success && res.user) {
        onUpdateUser(res.user);
        if (onSwitchUser) onSwitchUser(res.user);
        setIsSwitchAccountOpen(false);
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  // Handle Image Upload File Select (Reads as Base64 Data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'register' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'register') {
          setRegAvatarUrl(result);
        } else {
          setEditAvatarUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Student Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert('Please provide your name and email');
      return;
    }
    setRegSubmitting(true);
    try {
      const parsedSkills = regSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedInterests = regInterestsInput
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        course: regCourse.trim(),
        college: regCollege.trim(),
        year: regYear.trim(),
        skills: parsedSkills.length > 0 ? parsedSkills : ['Java', 'Cybersecurity', 'Python'],
        interests: parsedInterests.length > 0 ? parsedInterests : ['AI', 'Cybersecurity'],
        bio: regBio.trim(),
        avatarUrl: regAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      });

      if (res.success && res.user) {
        confetti({ particleCount: 70, spread: 70 });
        setIsRegisterModalOpen(false);
        onUpdateUser(res.user);
        if (onSwitchUser) onSwitchUser(res.user);
        await loadCommunityUsers();
        // Reset form
        setRegName('');
        setRegEmail('');
        setRegAvatarUrl('');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setRegSubmitting(false);
    }
  };

  // Submit Edit Profile
  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const parsedSkills = editSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedInterests = editInterestsInput
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      const res = await api.updateProfile({
        name: editName.trim(),
        course: editCourse.trim(),
        college: editCollege.trim(),
        year: editYear.trim(),
        skills: parsedSkills,
        interests: parsedInterests,
        bio: editBio.trim(),
        avatarUrl: editAvatarUrl || currentUser.avatarUrl,
      });

      if (res.success && res.profile) {
        onUpdateUser(res.profile);
        setIsEditProfileModalOpen(false);
        confetti({ particleCount: 50, spread: 60 });
        await loadCommunityUsers();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete User (for testing from empty or removing test profiles)
  const handleDeleteUser = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this profile from the community?')) return;
    try {
      const res = await api.deleteCommunityUser(id);
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        if (currentUser.id === id) {
          const remainingUsers = users.filter(u => u.id !== id);
          if (remainingUsers.length > 0) {
            onUpdateUser(remainingUsers[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // Unique list of all skills across registered users
  const allRegisteredSkills = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      (u.skills || []).forEach(s => set.add(s));
    });
    return Array.from(set).sort();
  }, [users]);

  // Unique list of all courses across registered users
  const allRegisteredCourses = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      if (u.course) set.add(u.course);
    });
    return Array.from(set).sort();
  }, [users]);

  // Unique list of all years across registered users
  const allRegisteredYears = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      if (u.year) set.add(String(u.year));
    });
    return Array.from(set).sort();
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        (u.course || '').toLowerCase().includes(q) ||
        (u.college || '').toLowerCase().includes(q) ||
        (u.bio || '').toLowerCase().includes(q) ||
        (u.skills || []).some(s => s.toLowerCase().includes(q)) ||
        (u.interests || []).some(i => i.toLowerCase().includes(q));

      const matchesCourse = selectedCourse === 'All' || u.course === selectedCourse;
      const matchesYear = selectedYear === 'All' || u.year === selectedYear;
      const matchesSkill =
        selectedSkill === 'All' ||
        (u.skills || []).some(s => s.toLowerCase() === selectedSkill.toLowerCase());

      return matchesSearch && matchesCourse && matchesYear && matchesSkill;
    });
  }, [users, searchQuery, selectedCourse, selectedYear, selectedSkill]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Users2 className="w-3.5 h-3.5" />
              <span>Real Registered Student Community</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">{users.length} Active {users.length === 1 ? 'Student' : 'Students'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus Student Directory & Network
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every person shown here is an authentic student who has registered their profile.
              Search by skills, filter by course and year, explore portfolios, connect, and start peer conversations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register New Student</span>
            </button>

            <button
              onClick={() => setIsSwitchAccountOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Switch Account ({users.length})</span>
            </button>

            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit My Profile & Photo</span>
            </button>
          </div>
        </div>

        {/* Current Logged-in Student Quick Glance */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-[10px]">
                  Logged In As
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {currentUser.course || 'B.Tech'} · {currentUser.year || '2nd Year'} · {currentUser.college}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAiRecommendations}
              disabled={aiLoading}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${aiLoading ? 'animate-spin' : ''}`} />
              <span>{aiLoading ? 'Analyzing...' : 'AI Connection Recommendations'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner (Operates as an advisory service for real users) */}
      {aiRecommendations.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/50 to-slate-900 border border-indigo-800/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>AI PEER MATCH ADVISOR (COLLABORATION SERVICE)</span>
            </div>
            <button
              onClick={() => setAiRecommendations([])}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Based on your skills ({currentUser.skills?.join(', ')}) and interests ({currentUser.interests?.join(', ')}), our AI recommends connecting with these fellow registered students:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {aiRecommendations.map((rec, idx) => {
              const matchedStudent = users.find(u => u.id === rec.userId);
              if (!matchedStudent) return null;
              const isConnected = (currentUser.connections || []).includes(matchedStudent.id);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-900/60 flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={matchedStudent.avatarUrl}
                      alt={matchedStudent.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-indigo-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{matchedStudent.name}</h4>
                      <p className="text-[11px] text-slate-400">{matchedStudent.course} · {matchedStudent.year}</p>
                    </div>
                  </div>
                  <p className="text-indigo-200 text-[11px] leading-relaxed bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/40">
                    💡 {rec.reason}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleToggleConnect(matchedStudent.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isConnected
                          ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isConnected ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isConnected ? 'Connected' : 'Connect'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenChat(matchedStudent)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {aiMessage && aiRecommendations.length === 0 && !aiLoading && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Search & Dynamic Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, college, skills, interests, or bio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter by Course */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Course:</span>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Courses</option>
              {allRegisteredCourses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              {!allRegisteredCourses.includes('B.Tech Computer Science & Engineering') && (
                <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
              )}
              {!allRegisteredCourses.includes('BTEC') && (
                <option value="BTEC">BTEC</option>
              )}
            </select>
          </div>

          {/* Filter by Year */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              {allRegisteredYears.filter(y => !['1st Year', '2nd Year', '3rd Year', '4th Year'].includes(y)).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter by Skills (Dynamic Tags from Registered Students) */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            Filter by Skill:
          </span>
          <button
            onClick={() => setSelectedSkill('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedSkill === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            All Skills
          </button>
          {allRegisteredSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? 'All' : skill)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-indigo-600 text-white ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {skill}
            </button>
          ))}
          {(searchQuery || selectedCourse !== 'All' || selectedYear !== 'All' || selectedSkill !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCourse('All');
                setSelectedYear('All');
                setSelectedSkill('All');
              }}
              className="ml-auto text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredUsers.length}</strong> of{' '}
          <strong className="text-white">{users.length}</strong> registered students
        </span>
        {filteredUsers.length !== users.length && (
          <span className="text-indigo-400">Filtered view active</span>
        )}
      </div>

      {/* Dynamic Community Student Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading registered students...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center mx-auto text-indigo-400">
            <Users2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Registered Students Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {users.length === 0
                ? 'No students have signed up yet. Be the first to register your profile card and start the campus community!'
                : 'No registered students match your current search or filters. Try adjusting your search query or reset filters.'}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Student Profile</span>
            </button>
            {(searchQuery || selectedCourse !== 'All' || selectedYear !== 'All' || selectedSkill !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCourse('All');
                  setSelectedYear('All');
                  setSelectedSkill('All');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const isMe = user.id === currentUser.id;
            const isConnected = (currentUser.connections || []).includes(user.id);
            const connectionCount = (user.connections || []).length;

            return (
              <div
                key={user.id}
                className={`group relative rounded-3xl bg-slate-900/90 border transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/50 flex flex-col justify-between overflow-hidden ${
                  isMe
                    ? 'border-indigo-600/60 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 hover:bg-slate-900'
                }`}
              >
                {/* Profile Card Header with Real Uploaded Photo */}
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative">
                      {/* REAL USER PROFILE PHOTO (No cartoon/bot avatars!) */}
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-violet-600 flex items-center justify-center text-white font-black text-xl ring-2 ring-indigo-500/50 shadow-md">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Registered Active Student" />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {isMe ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] tracking-wide uppercase">
                          Your Profile
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-[10px]">
                          {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'}
                        </span>
                      )}
                      {user.createdAt && (
                        <span className="text-[10px] text-slate-500">
                          Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Exact Profile Card Information Format requested:
                      Name: Nayana
                      Course: B.Tech / BTEC ...
                      Year: 2nd Year
                      Skills: Java, Cybersecurity, Python
                      Interests: AI, Cybersecurity
                      Bio: ...
                  */}
                  <div className="space-y-2.5">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{user.course || 'B.Tech'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-300">Year: {user.year || '2nd Year'}</span>
                        <span>·</span>
                        <span className="truncate">{user.college}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {user.bio || 'Student participating in campus technical learning and skill exchanges.'}
                    </p>

                    {/* Skills Tags */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400">Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(user.skills && user.skills.length > 0 ? user.skills : ['Java', 'Cybersecurity', 'Python']).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interests Tags */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400">Interests:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(user.interests && user.interests.length > 0 ? user.interests : ['AI', 'Cybersecurity']).map((i, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-violet-950/70 border border-violet-800/60 text-violet-300 text-[11px] font-medium"
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingProfileUser(user)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isMe ? (
                      <button
                        onClick={() => setIsEditProfileModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleConnect(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isConnected
                              ? 'bg-emerald-950/90 border border-emerald-700 text-emerald-300 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          }`}
                        >
                          {isConnected ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                          <span>{isConnected ? 'Connected' : 'Connect'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenChat(user)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-200 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                          title="Direct Message"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Chat</span>
                        </button>
                      </>
                    )}

                    {/* Quick switch/test button */}
                    <button
                      onClick={() => handleSwitchAccount(user)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                      title={`Switch active login to ${user.name}`}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW FULL PROFILE
         ========================================================================= */}
      {viewingProfileUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8">
            {/* Modal Header Cover */}
            <div className="h-32 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 relative">
              <button
                onClick={() => setViewingProfileUser(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 -mt-16 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  {viewingProfileUser.avatarUrl ? (
                    <img
                      src={viewingProfileUser.avatarUrl}
                      alt={viewingProfileUser.name}
                      className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-900 shadow-2xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-indigo-700 ring-4 ring-slate-900 flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                      {viewingProfileUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{viewingProfileUser.name}</h2>
                    <p className="text-sm text-indigo-400 font-medium">
                      {viewingProfileUser.course} · {viewingProfileUser.year}
                    </p>
                    <p className="text-xs text-slate-400">{viewingProfileUser.college}</p>
                  </div>
                </div>

                {viewingProfileUser.id !== currentUser.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleConnect(viewingProfileUser.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        (currentUser.connections || []).includes(viewingProfileUser.id)
                          ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {(currentUser.connections || []).includes(viewingProfileUser.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const target = viewingProfileUser;
                        setViewingProfileUser(null);
                        handleOpenChat(target);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-200 text-xs font-semibold hover:bg-cyan-900 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Message</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Bio</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  {viewingProfileUser.bio || 'Student actively exchanging technical knowledge.'}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(viewingProfileUser.skills || ['Java', 'Cybersecurity', 'Python']).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  {(viewingProfileUser.interests || ['AI', 'Cybersecurity']).map((i, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-violet-950/80 border border-violet-700/60 text-violet-200 text-xs font-medium"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Academic & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Course</span>
                  <p className="text-xs font-bold text-white truncate mt-0.5">{viewingProfileUser.course}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Year</span>
                  <p className="text-xs font-bold text-white mt-0.5">{viewingProfileUser.year}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Connections</span>
                  <p className="text-xs font-bold text-indigo-400 mt-0.5">{(viewingProfileUser.connections || []).length}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Role</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">Verified Student</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setViewingProfileUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
                {viewingProfileUser.id !== currentUser.id && (
                  <button
                    onClick={() => handleDeleteUser(viewingProfileUser.id, {} as any)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DIRECT MESSAGING CHAT
         ========================================================================= */}
      {messagingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-xl h-[600px] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={messagingUser.avatarUrl}
                  alt={messagingUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">{messagingUser.name}</h3>
                  <p className="text-[11px] text-slate-400">{messagingUser.course} · {messagingUser.year}</p>
                </div>
              </div>
              <button
                onClick={() => setMessagingUser(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Start the conversation with {messagingUser.name}!</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Discuss coursework, ask questions about their skills ({messagingUser.skills?.slice(0, 2).join(', ')}), or propose a peer learning session.
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={`Message ${messagingUser.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={sendingMessage || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REGISTER NEW STUDENT (With Real Photo Upload!)
         ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Register New Student Profile</h3>
                  <p className="text-xs text-slate-400">Add an authentic student profile to the campus community.</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Profile Photo Upload</label>
                <div className="flex items-center gap-4">
                  {regAvatarUrl ? (
                    <img
                      src={regAvatarUrl}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-400">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <input
                      type="file"
                      ref={regFileInputRef}
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'register')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => regFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs font-medium hover:bg-indigo-900 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Upload Profile Photo</span>
                    </button>
                    <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Nayana"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. nayana@university.edu"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Course & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course *</label>
                  <input
                    type="text"
                    required
                    value={regCourse}
                    onChange={e => setRegCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year of Study *</label>
                  <select
                    value={regYear}
                    onChange={e => setRegYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  value={regCollege}
                  onChange={e => setRegCollege(e.target.value)}
                  placeholder="e.g. VNR VJIET, Hyderabad"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Skills (Comma separated) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skills (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={regSkillsInput}
                  onChange={e => setRegSkillsInput(e.target.value)}
                  placeholder="e.g. Java, Cybersecurity, Python, React, SQL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Interests (Comma separated) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interests (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={regInterestsInput}
                  onChange={e => setRegInterestsInput(e.target.value)}
                  placeholder="e.g. AI, Cybersecurity, Open Source, Cloud"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio *</label>
                <textarea
                  rows={3}
                  required
                  value={regBio}
                  onChange={e => setRegBio(e.target.value)}
                  placeholder="Tell peers what you are working on and what you'd like to collaborate on..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{regSubmitting ? 'Creating Profile...' : 'Complete Sign Up'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT MY PROFILE & PHOTO UPLOAD
         ========================================================================= */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Your Profile</h3>
                  <p className="text-xs text-slate-400">Update your photo, course, skills, interests, and bio.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs">
              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Uploaded profile"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-indigo-800 flex items-center justify-center text-white font-bold text-lg">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'edit')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs font-medium hover:bg-indigo-900 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Change Profile Photo</span>
                    </button>
                    <p className="text-[11px] text-slate-400">Upload your real photo (PNG, JPG, or WEBP)</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Course & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Course</label>
                  <input
                    type="text"
                    required
                    value={editCourse}
                    onChange={e => setEditCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year of Study</label>
                  <select
                    value={editYear}
                    onChange={e => setEditYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">College</label>
                <input
                  type="text"
                  required
                  value={editCollege}
                  onChange={e => setEditCollege(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editSkillsInput}
                  onChange={e => setEditSkillsInput(e.target.value)}
                  placeholder="e.g. Java, Cybersecurity, Python"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interests (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={editInterestsInput}
                  onChange={e => setEditInterestsInput(e.target.value)}
                  placeholder="e.g. AI, Cybersecurity"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio</label>
                <textarea
                  rows={3}
                  required
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SWITCH ACCOUNT (Quick test between registered users)
         ========================================================================= */}
      {isSwitchAccountOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Switch Active Student Account</h3>
              </div>
              <button
                onClick={() => setIsSwitchAccountOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select any registered student below to switch your active session and view the community from their perspective.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {users.map(u => {
                const isActive = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchAccount(u)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-950/70 border-indigo-600 ring-1 ring-indigo-500'
                        : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/40"
                      />
                      <div>
                        <h4 className="font-bold text-white text-xs">{u.name}</h4>
                        <p className="text-[11px] text-slate-400">{u.course} · {u.year}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Switch →</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setIsSwitchAccountOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Register another student</span>
              </button>
              <button
                onClick={() => setIsSwitchAccountOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
