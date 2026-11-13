import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  Building2,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { User, MockInterviewResult } from '../../types';

interface MockInterviewViewProps {
  currentUser: User;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ currentUser }) => {
  const [role, setRole] = useState(currentUser.careerGoal || 'Java Backend Developer');
  const [company, setCompany] = useState('Amazon');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<MockInterviewResult | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [role, company]);

  const loadQuestions = async () => {
    try {
      const res = await api.generateMockQuestions(role, company);
      setQuestions(res.questions || []);
      setCurrentQIndex(0);
      setAnswer('');
      setEvaluation(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Voice simulation
      setTimeout(() => {
        setIsRecording(false);
        setAnswer(
          'In Java, HashMap uses an array of Node buckets with separate chaining. When hash collisions occur, items were historically stored in a LinkedList. In Java 8, when a bucket exceeds 8 entries, it converts to a balanced Red-Black Tree, improving worst-case search complexity from O(n) to O(log n).'
        );
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!answer.trim() || !questions[currentQIndex]) return;
    setIsEvaluating(true);
    try {
      const res = await api.evaluateInterviewAnswer(questions[currentQIndex].question, answer, role);
      setEvaluation(res.evaluation);
      if (res.evaluation.overallScore >= 80) {
        confetti({ particleCount: 60, spread: 70 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" /> Technical Interview Room
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Mock Interview Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Practice company-specific technical rounds with dynamic AI question generation and rubric-based evaluations on technical accuracy, clarity, and confidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="Java Backend Developer">Java Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
            <option value="AI / ML Engineer">AI / ML Engineer</option>
          </select>

          <select
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="Amazon">Amazon</option>
            <option value="Oracle">Oracle</option>
            <option value="Google">Google</option>
            <option value="JPMorgan Chase">JPMorgan Chase</option>
            <option value="Cisco">Cisco</option>
          </select>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question & Answer Input */}
        <div className="lg:col-span-7 space-y-4">
          {currentQ ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-semibold text-indigo-400">
                  Question {currentQIndex + 1} of {questions.length} · {currentQ.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Target: {company}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-relaxed">
                  "{currentQ.question}"
                </h3>
                {currentQ.hint && (
                  <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    💡 <strong>Hint: </strong>{currentQ.hint}
                  </p>
                )}
              </div>

              {/* Answer Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Your Verbal or Written Response:</span>
                  {isRecording && (
                    <span className="text-rose-400 flex items-center gap-1.5 animate-pulse font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Listening to speech...
                    </span>
                  )}
                </div>

                <textarea
                  rows={6}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Click the microphone to speak your answer, or type your structured response..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
                  <span>{isRecording ? 'Stop Recording' : 'Voice Input (Mic)'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentQIndex < questions.length - 1) {
                        setCurrentQIndex(currentQIndex + 1);
                        setAnswer('');
                        setEvaluation(null);
                      }
                    }}
                    disabled={currentQIndex >= questions.length - 1}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold"
                  >
                    Skip
                  </button>

                  <button
                    onClick={handleEvaluate}
                    disabled={!answer.trim() || isEvaluating}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Answer'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Generating interview questions...
            </div>
          )}
        </div>

        {/* Right: AI Evaluator Feedback */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
              AI Panel Evaluation & Feedback
            </h3>

            {!evaluation ? (
              <div className="text-center py-16 space-y-2 text-slate-500 text-xs">
                <Mic className="w-8 h-8 mx-auto text-slate-600" />
                <p>Provide your answer and click "Evaluate Answer" to receive instant scored feedback.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400">Technical</span>
                    <div className="text-lg font-extrabold text-emerald-400 tabular-nums">
                      {evaluation.technicalScore}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400">Clarity</span>
                    <div className="text-lg font-extrabold text-indigo-400 tabular-nums">
                      {evaluation.communicationScore}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400">Confidence</span>
                    <div className="text-lg font-extrabold text-amber-400 tabular-nums">
                      {evaluation.confidenceScore}%
                    </div>
                  </div>
                </div>

                {/* Overall Feedback */}
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed">
                  {evaluation.feedback}
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Next Steps to Elevate
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {evaluation.improvementSuggestions.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
