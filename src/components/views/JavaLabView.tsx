import React, { useState } from 'react';
import {
  Code2,
  Play,
  Sparkles,
  Bug,
  Zap,
  Clock,
  FileCheck,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { CodingChallenge, User } from '../../types';

interface JavaLabViewProps {
  currentUser: User;
  challenges: CodingChallenge[];
  onUpdateUser: (user: User) => void;
}

export const JavaLabView: React.FC<JavaLabViewProps> = ({
  currentUser,
  challenges,
  onUpdateUser,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(challenges[0]);
  const [code, setCode] = useState(challenges[0]?.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<any | null>(null);
  const [aiAssistantTab, setAiAssistantTab] = useState<'explain' | 'bugs' | 'optimize' | 'complexity' | 'tests'>('explain');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSelectChallenge = (ch: CodingChallenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setRunOutput(null);
    setAiOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await api.runJavaCode(code, selectedChallenge.id);
      setRunOutput(res);
      if (res.status === 'PASSED') {
        confetti({ particleCount: 70, spread: 70 });
        if (res.xpAwarded) {
          const updatedXp = currentUser.xp + res.xpAwarded;
          api.updateProfile({ xp: updatedXp }).then(userRes => {
            if (userRes.success) onUpdateUser(userRes.profile);
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAiAction = async (action: 'explain' | 'bugs' | 'optimize' | 'complexity' | 'tests') => {
    setAiAssistantTab(action);
    setIsAiLoading(true);
    try {
      const actionMap = {
        explain: 'explain',
        bugs: 'find_bugs',
        optimize: 'optimize',
        complexity: 'time_complexity',
        tests: 'test_cases',
      };
      const res = await api.aiJavaAssistant(actionMap[action], code);
      setAiOutput(res.result);
    } catch (err) {
      setAiOutput('AI assistance temporarily offline.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" /> Technical Core Component
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Java 21 Skills Lab & JVM Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Practice enterprise Java basics, OOP, Collections, Multithreading, Streams, and Spring Boot REST APIs with automated JUnit unit test validation and real-time AI code reviews.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Runtime Environment</span>
          <span className="text-xs font-bold text-indigo-300 font-mono">
            OpenJDK 21.0.2 · Spring Boot 3.2.4
          </span>
        </div>
      </div>

      {/* Challenge Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-900/90 rounded-2xl border border-slate-800 no-scrollbar">
        {challenges.map(ch => {
          const isSelected = selectedChallenge.id === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{ch.title}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  ch.difficulty === 'Easy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : ch.difficulty === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {ch.difficulty}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Lab Workspace: Left Code Editor, Right AI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor & Runner */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-slate-400 font-mono text-[11px] ml-2">
                  Solution.java
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(selectedChallenge.starterCode)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Reset to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Compiling...' : 'Run & Test'}</span>
                </button>
              </div>
            </div>

            {/* Code Input */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={18}
              className="w-full p-4 bg-slate-950/70 font-mono text-xs text-indigo-100 leading-relaxed focus:outline-none resize-none border-0"
              spellCheck={false}
            />

            {/* Test Results Output */}
            {runOutput && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {runOutput.status === 'PASSED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {runOutput.message}
                    </span>
                  </div>
                  {runOutput.xpAwarded > 0 && (
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{runOutput.xpAwarded} XP Awarded
                    </span>
                  )}
                </div>
                <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {runOutput.output}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Java Staff Engineer Assistant */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Java Staff Engineer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Gemini 3.8 Flash</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              <button
                onClick={() => handleAiAction('explain')}
                className={`p-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  aiAssistantTab === 'explain'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Explain</span>
              </button>
              <button
                onClick={() => handleAiAction('bugs')}
                className={`p-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  aiAssistantTab === 'bugs'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Bugs</span>
              </button>
              <button
                onClick={() => handleAiAction('optimize')}
                className={`p-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  aiAssistantTab === 'optimize'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Optimize</span>
              </button>
              <button
                onClick={() => handleAiAction('complexity')}
                className={`p-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  aiAssistantTab === 'complexity'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Big-O</span>
              </button>
              <button
                onClick={() => handleAiAction('tests')}
                className={`p-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  aiAssistantTab === 'tests'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>JUnit Tests</span>
              </button>
            </div>

            {/* AI Assistant Output Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[360px] max-h-[460px] overflow-y-auto text-xs leading-relaxed text-slate-300">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-500">
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Analyzing bytecode & algorithms...</p>
                </div>
              ) : aiOutput ? (
                <div className="whitespace-pre-wrap font-sans space-y-2">{aiOutput}</div>
              ) : (
                <div className="text-center py-16 space-y-2 text-slate-500">
                  <Code2 className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click any button above to generate AI code explanations, bug diagnoses, or JUnit test suites.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
