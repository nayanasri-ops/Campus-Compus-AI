import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Building2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User } from '../../types';

interface ProfileOptimizerViewProps {
  currentUser: User;
}

export const ProfileOptimizerView: React.FC<ProfileOptimizerViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'linkedin' | 'coverletter'>('github');

  // GitHub State
  const [ghUser, setGhUser] = useState('arjunreddy-vnr');
  const [ghData, setGhData] = useState<any | null>(null);
  const [loadingGh, setLoadingGh] = useState(false);

  // LinkedIn State
  const [liHeadline, setLiHeadline] = useState('Computer Science Student @ VNR VJIET, Hyderabad');
  const [liData, setLiData] = useState<any | null>(null);
  const [loadingLi, setLoadingLi] = useState(false);

  // Cover Letter State
  const [clCompany, setClCompany] = useState('Amazon');
  const [clRole, setClRole] = useState('Software Development Engineer Intern');
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loadingCl, setLoadingCl] = useState(false);
  const [copiedCl, setCopiedCl] = useState(false);

  const handleAnalyzeGh = async () => {
    setLoadingGh(true);
    try {
      const res = await api.analyzeGithub(ghUser);
      setGhData(res);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGh(false);
    }
  };

  const handleOptimizeLi = async () => {
    setLoadingLi(true);
    try {
      const res = await api.optimizeLinkedin({
        currentHeadline: liHeadline,
        targetRole: currentUser.careerGoal,
      });
      setLiData(res);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLi(false);
    }
  };

  const handleGenerateCl = async () => {
    setLoadingCl(true);
    try {
      const res = await api.generateCoverLetter({
        company: clCompany,
        role: clRole,
      });
      setCoverLetter(res.coverLetter);
      confetti({ particleCount: 60, spread: 70 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCl(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> Public Brand Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Profile Optimizer & AI Cover Letter
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Audit your public GitHub engineering footprint, optimize your LinkedIn recruiter discovery algorithms, and generate company-tailored cover letters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'github'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          GitHub Profile Analyzer
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'linkedin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          LinkedIn Headline & About
        </button>
        <button
          onClick={() => setActiveTab('coverletter')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'coverletter'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          AI Cover Letter Generator
        </button>
      </div>

      {/* 1. GitHub Tab */}
      {activeTab === 'github' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Analyze Public GitHub Repository
            </h3>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">GitHub Username:</label>
              <input
                type="text"
                value={ghUser}
                onChange={e => setGhUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              onClick={handleAnalyzeGh}
              disabled={loadingGh}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingGh ? 'Inspecting Commits...' : 'Audit GitHub Profile'}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {ghData ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">Score: {ghData.githubScore}/100</h4>
                  <span className="text-xs font-mono text-emerald-400">@{ghData.username}</span>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold">Language Breakdown:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ghData.languages.map((l: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <p className="font-semibold text-white">{l.name}</p>
                        <p className="text-indigo-400 font-mono tabular-nums">{l.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs text-emerald-400 font-bold">Strengths:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {ghData.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs text-amber-400 font-bold">Recommendations:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {ghData.recommendations.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/40 border border-slate-800">
                Click "Audit GitHub Profile" to evaluate repository commit history and languages.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LinkedIn Tab */}
      {activeTab === 'linkedin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Current LinkedIn Headline
            </h3>
            <textarea
              rows={3}
              value={liHeadline}
              onChange={e => setLiHeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleOptimizeLi}
              disabled={loadingLi}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingLi ? 'Optimizing keywords...' : 'Optimize for Tech Recruiters'}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {liData ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Recommended High-Conversion Headlines:
                </h4>
                <div className="space-y-2">
                  {liData.suggestedHeadlines.map((h: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                      "{h}"
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Recommended "About" Section:
                  </h4>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {liData.aboutSectionSuggestion}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/40 border border-slate-800">
                Click "Optimize for Tech Recruiters" to generate keyword-rich headlines and bio.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Cover Letter Generator */}
      {activeTab === 'coverletter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Company & Role
            </h3>
            <div className="space-y-2 text-xs">
              <label className="text-slate-400">Target Company:</label>
              <input
                type="text"
                value={clCompany}
                onChange={e => setClCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2 text-xs">
              <label className="text-slate-400">Position Role:</label>
              <input
                type="text"
                value={clRole}
                onChange={e => setClRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleGenerateCl}
              disabled={loadingCl}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingCl ? 'Drafting Cover Letter...' : 'Generate AI Cover Letter'}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {coverLetter ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Tailored Letter for {clCompany}
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter);
                      setCopiedCl(true);
                      setTimeout(() => setCopiedCl(false), 2000);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    {copiedCl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCl ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {coverLetter}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 rounded-3xl bg-slate-900/40 border border-slate-800">
                Enter company and role details on the left, then click "Generate AI Cover Letter".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
