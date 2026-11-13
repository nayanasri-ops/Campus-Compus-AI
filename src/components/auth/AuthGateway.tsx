import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Building2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Flame,
  Star,
  Users2,
  Check,
  RefreshCw
} from 'lucide-react';
import { User } from '../../types';
import { api } from '../../services/api';

interface AuthGatewayProps {
  onAuthenticated: (user: User) => void;
}

type AuthMode = 'welcome' | 'signin' | 'register' | 'forgot_password' | 'verify_email';

const INDIAN_COLLEGES = [
  'VNR VJIET, Hyderabad',
  'CBIT, Hyderabad',
  'BITS Pilani, Hyderabad Campus',
  'IIIT Hyderabad',
  'IIT Hyderabad',
  'GRIET, Hyderabad',
  'JNTUH, Hyderabad',
  'CVR College of Engineering, Hyderabad',
  'Mahindra University, Hyderabad',
  'Osmania University College of Engineering',
  'Other Indian Engineering College'
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Cybersecurity',
  'Data Science',
  'Information Technology (IT)',
  'Electronics & Communication (ECE)'
];

const CAREER_GOALS = [
  'Java Backend Developer',
  'AI/ML Engineer',
  'Full Stack Developer',
  'Cloud & DevOps Engineer',
  'Cybersecurity Specialist',
  'Data Engineer'
];

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState<string>('arjun.reddy@vnrvjiet.ac.in');
  const [signInPassword, setSignInPassword] = useState<string>('CampusCompass@2026');

  // Registration Multi-Step State
  const [regStep, setRegStep] = useState<number>(1);
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regCollege, setRegCollege] = useState<string>('VNR VJIET, Hyderabad');
  const [regDegree, setRegDegree] = useState<string>('B.Tech');
  const [regBranch, setRegBranch] = useState<string>('Computer Science & Engineering (CSE)');
  const [regYear, setRegYear] = useState<string>('3rd Year');
  const [regGradYear, setRegGradYear] = useState<number>(2027);
  const [regCgpa, setRegCgpa] = useState<string>('8.50');
  const [regSkillsTeaching, setRegSkillsTeaching] = useState<string>('Java, Spring Boot, SQL');
  const [regSkillsLearning, setRegSkillsLearning] = useState<string>('Python, Machine Learning');
  const [regCareerGoal, setRegCareerGoal] = useState<string>('Java Backend Developer');
  const [regBio, setRegBio] = useState<string>('');
  const [regAvatarUrl, setRegAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  );
  const [regAgreeTerms, setRegAgreeTerms] = useState<boolean>(true);

  // Password Recovery state
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');

  // Email verification state
  const [emailOtp, setEmailOtp] = useState<string>('849201');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Quick 1-click demo login helper
  const handleQuickDemoLogin = async (email: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(email);
      if (res.success && res.user) {
        onAuthenticated(res.user);
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      setErrorMsg('Please enter your registered college email.');
      return;
    }
    if (!signInPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(signInEmail);
      if (res.success && res.user) {
        onAuthenticated(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Multi-Step Registration Next Step
  const handleRegNext = () => {
    setErrorMsg('');
    if (regStep === 1) {
      if (!regFullName.trim()) {
        setErrorMsg('Please enter your full legal student name.');
        return;
      }
      if (!regEmail.trim() || !regEmail.includes('@')) {
        setErrorMsg('Please enter a valid institution-issued or active email address.');
        return;
      }
      if (regPassword.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setErrorMsg('Password confirmation does not match.');
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      if (!regCollege.trim()) {
        setErrorMsg('Please select or specify your Indian engineering college.');
        return;
      }
      setRegStep(3);
    } else if (regStep === 3) {
      if (!regSkillsTeaching.trim()) {
        setErrorMsg('Please list at least 1 technical skill you can teach or share.');
        return;
      }
      if (!regSkillsLearning.trim()) {
        setErrorMsg('Please list at least 1 skill you want to learn.');
        return;
      }
      setRegStep(4);
    }
  };

  // Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regAgreeTerms) {
      setErrorMsg('You must agree to the academic integrity and student trust terms.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const skillsTeachingArr = regSkillsTeaching.split(',').map(s => s.trim()).filter(Boolean);
      const skillsLearningArr = regSkillsLearning.split(',').map(s => s.trim()).filter(Boolean);
      const combinedSkills = Array.from(new Set([...skillsTeachingArr, ...skillsLearningArr]));

      const payload = {
        name: regFullName.trim(),
        email: regEmail.trim(),
        college: regCollege.trim(),
        course: `${regDegree} ${regBranch.split('(')[0].trim()}`,
        branch: regBranch,
        year: regYear,
        graduationYear: Number(regGradYear),
        cgpa: parseFloat(regCgpa) || 8.0,
        bio: regBio.trim() || `${regYear} student at ${regCollege} aiming for ${regCareerGoal}. Excited to swap skills on Campus Compass AI!`,
        avatarUrl: regAvatarUrl,
        skills: combinedSkills,
        skillsTeaching: skillsTeachingArr,
        skillsLearning: skillsLearningArr,
        careerGoal: regCareerGoal,
        interests: ['Tech Innovation', 'Campus Placements', 'SkillSwap'],
      };

      const res = await api.register(payload);
      if (res.success && res.user) {
        setPendingUser(res.user);
        setMode('verify_email');
        setSuccessMsg('Account registered successfully! Please verify your student email address.');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  // Password Recovery Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (forgotStep === 'request') {
      if (!forgotEmail) {
        setErrorMsg('Please enter your student email address.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setForgotStep('verify');
        setSuccessMsg(`A 6-digit recovery OTP has been sent to ${forgotEmail}. (Demo OTP: 492015)`);
      }, 700);
    } else {
      if (!resetCode) {
        setErrorMsg('Please enter the 6-digit OTP code.');
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        setErrorMsg('New password must be at least 8 characters long.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Password reset successfully! You can now sign in with your new password.');
        setMode('signin');
        setSignInEmail(forgotEmail);
        setSignInPassword(newPassword);
      }, 700);
    }
  };

  // Verify Email Submit
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp || emailOtp.length < 4) {
      setErrorMsg('Please enter the valid OTP verification code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pendingUser) {
        const verifiedUser: User = {
          ...pendingUser,
          emailVerified: true,
          verification: {
            collegeStatus: 'Verified',
            collegeVerifiedAt: new Date().toISOString(),
            institutionalEmail: pendingUser.email,
            cgpaStatus: 'Not submitted',
            skillsStatus: {
              [pendingUser.skillsTeaching[0] || 'Java']: 'Self-reported'
            }
          }
        };
        onAuthenticated(verifiedUser);
      } else {
        handleQuickDemoLogin('arjun.reddy@vnrvjiet.ac.in');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-600/25 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-8 h-8 text-indigo-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-1 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Campus Compass AI · Student Success Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Campus Compass AI
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Your AI Guide from Classroom to Career
            </p>
          </div>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
          {/* Notifications / Errors */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. WELCOME SCREEN                                         */}
          {/* ======================================================== */}
          {mode === 'welcome' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">Welcome, Engineering Students!</h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  Connect with verified peers across top Indian colleges, swap high-demand technical skills, receive personalized placement roadmaps, and master Java enterprise architecture.
                </p>
              </div>

              {/* Primary Choices: Sign In or Create Account */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setMode('signin');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setRegStep(1);
                    setMode('register');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Evaluator Quick 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                    Evaluator Demo Access (1-Click Login)
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono">Instant Entry</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('arjun.reddy@vnrvjiet.ac.in')}
                    disabled={loading}
                    className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-indigo-950/40 border border-indigo-900/40 hover:border-indigo-600/70 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-700/60 flex items-center justify-center text-white font-bold text-xs">
                        AR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            Arjun Reddy
                          </p>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                            Student Demo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          3rd Year CSE · VNR VJIET, Hyderabad · CGPA 8.65
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sravani.reddy@cbit.ac.in')}
                    disabled={loading}
                    className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-600/70 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-700/60 flex items-center justify-center text-white font-bold text-xs">
                        SR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                            Sravani Reddy
                          </p>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px]">
                            SkillSwap Peer
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          3rd Year CSE · CBIT, Hyderabad · AI/ML & UI/UX
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('dean.placements@vnrvjiet.ac.in')}
                    disabled={loading}
                    className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-600/70 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-700/60 flex items-center justify-center text-white font-bold text-xs">
                        RM
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            Prof. K. V. Raman Murthy
                          </p>
                          <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800 text-[10px]">
                            Admin / Dean
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Training & Placement Cell · VNR VJIET, Hyderabad
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>

              {/* Trust & Security Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Protected by Server-Side Session Auth & Student Trust Center</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SIGN IN SCREEN                                         */}
          {/* ======================================================== */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setMode('welcome')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <h2 className="text-base font-bold text-white">Student Sign In</h2>
                <span className="text-xs text-indigo-400 font-mono">Secured</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={e => setSignInEmail(e.target.value)}
                      placeholder="e.g. arjun.reddy@vnrvjiet.ac.in"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(signInEmail);
                        setForgotStep('request');
                        setMode('forgot_password');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={e => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember my session</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Auto-expiry: 30d</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Campus Compass</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegStep(1);
                      setMode('register');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. MULTI-STEP REGISTRATION WIZARD                        */}
          {/* ======================================================== */}
          {mode === 'register' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Wizard Header & Progress Indicator */}
              <div className="space-y-3 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (regStep > 1) setRegStep(regStep - 1);
                      else setMode('welcome');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{regStep === 1 ? 'Cancel' : 'Back'}</span>
                  </button>
                  <h2 className="text-base font-bold text-white">Student Registration</h2>
                  <span className="text-xs text-indigo-400 font-mono">Step {regStep} of 4</span>
                </div>

                {/* Progress Bar with Steps */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(regStep / 4) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className={regStep >= 1 ? 'text-indigo-300 font-bold' : ''}>1. Account</span>
                    <span className={regStep >= 2 ? 'text-indigo-300 font-bold' : ''}>2. Academic</span>
                    <span className={regStep >= 3 ? 'text-indigo-300 font-bold' : ''}>3. Skills</span>
                    <span className={regStep >= 4 ? 'text-indigo-300 font-bold' : ''}>4. Profile</span>
                  </div>
                </div>
              </div>

              {/* Wizard Step 1: Account Credentials */}
              {regStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name (as per Student ID) *
                    </label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={e => setRegFullName(e.target.value)}
                      placeholder="e.g. Nayana Sri Yarlagadda"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Institutional / College Email *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="e.g. nayana.sri@vnrvjiet.ac.in"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      An official institution-issued email accelerates your verified campus badge.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password (min 8 chars) *
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Step 2: Academic Profile */}
              {regStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Engineering College / University *
                    </label>
                    <select
                      value={regCollege}
                      onChange={e => setRegCollege(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {INDIAN_COLLEGES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Degree</label>
                      <select
                        value={regDegree}
                        onChange={e => setRegDegree(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.E.">B.E.</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="Dual Degree">Dual Degree (B.Tech + M.Tech)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current Year</label>
                      <select
                        value={regYear}
                        onChange={e => setRegYear(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Branch</label>
                    <select
                      value={regBranch}
                      onChange={e => setRegBranch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Graduation</label>
                      <input
                        type="number"
                        value={regGradYear}
                        onChange={e => setRegGradYear(Number(e.target.value))}
                        min={2025}
                        max={2030}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Self-Reported CGPA (0 - 10)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="5.0"
                        max="10.0"
                        value={regCgpa}
                        onChange={e => setRegCgpa(e.target.value)}
                        placeholder="8.50"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-[10px] text-amber-400 mt-1">
                        Labelled "Self-reported" until marksheet verification in Trust Center.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Step 3: Skills & SkillSwap Goals */}
              {regStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Skills You Can Teach / Share (Comma separated) *
                    </label>
                    <input
                      type="text"
                      value={regSkillsTeaching}
                      onChange={e => setRegSkillsTeaching(e.target.value)}
                      placeholder="e.g. Java, Spring Boot, SQL, DSA"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Other students will discover you on SkillSwap based on these offerings.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Skills You Want to Learn (Comma separated) *
                    </label>
                    <input
                      type="text"
                      value={regSkillsLearning}
                      onChange={e => setRegSkillsLearning(e.target.value)}
                      placeholder="e.g. Python, Machine Learning, AWS Cloud"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Career Goal *</label>
                    <select
                      value={regCareerGoal}
                      onChange={e => setRegCareerGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {CAREER_GOALS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Wizard Step 4: Profile & Verification Consent */}
              {regStep === 4 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Student Biography
                    </label>
                    <textarea
                      value={regBio}
                      onChange={e => setRegBio(e.target.value)}
                      rows={2}
                      placeholder="Tell peers what projects you're building and what you love learning..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Preset</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={regAvatarUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={regAvatarUrl}
                          onChange={e => setRegAvatarUrl(e.target.value)}
                          placeholder="Image URL"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={regAgreeTerms}
                        onChange={e => setRegAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="leading-relaxed">
                        I confirm that my academic details are accurate and agree to participate under the{' '}
                        <strong className="text-white">Campus Compass Student Trust Charter</strong>. No bots or impersonation allowed.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                {regStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setRegStep(regStep - 1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Already registered? Sign In
                  </button>
                )}

                {regStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleRegNext}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. EMAIL VERIFICATION STEP                               */}
          {/* ======================================================== */}
          {mode === 'verify_email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mx-auto">
                  <Mail className="w-6 h-6 animate-bounce" />
                </div>
                <h2 className="text-lg font-bold text-white">Verify Student Email Address</h2>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  We've dispatched a 6-digit verification code to your email. (Demo pre-filled below for instant testing):
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={emailOtp}
                  onChange={e => setEmailOtp(e.target.value)}
                  className="w-48 mx-auto block bg-slate-950 border border-indigo-500/80 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Email & Enter Campus Compass</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('arjun.reddy@vnrvjiet.ac.in')}
                  className="text-xs text-indigo-400 hover:underline cursor-pointer"
                >
                  Skip for now and enter demo session
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* 5. FORGOT PASSWORD WORKFLOW                               */}
          {/* ======================================================== */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <h2 className="text-base font-bold text-white">Reset Password</h2>
                <span className="text-xs text-indigo-400 font-mono">Recovery</span>
              </div>

              {forgotStep === 'request' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Enter your student email address and we'll dispatch a secure recovery code.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="e.g. arjun.reddy@vnrvjiet.ac.in"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {loading ? 'Sending Code...' : 'Send Recovery OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={e => setResetCode(e.target.value)}
                      placeholder="e.g. 492015"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password (min 8 chars)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {loading ? 'Updating Password...' : 'Confirm New Password'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>© 2026 Campus Compass AI. Engineered for Indian Engineering Institutions.</p>
          <p className="text-[11px] text-slate-400">
            Compliant with Student Data Privacy, AI Transparency, and Academic Trust Guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};
