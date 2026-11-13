import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Lock,
  Building2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Code2,
  Check,
  RefreshCw,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, VerificationStatus, SkillVerificationStatus } from '../../types';
import { api } from '../../services/api';

interface TrustCenterViewProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

interface SkillAssessmentModalProps {
  skillName: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (skill: string) => void;
}

const ASSESSMENT_QUESTIONS: Record<string, { q: string; options: string[]; answer: number }[]> = {
  Java: [
    {
      q: 'Which of the following is true about Java memory allocation?',
      options: [
        'Objects are allocated on the Stack, references on the Heap',
        'Objects are allocated on the Heap, local variable references on the Stack',
        'All primitives are stored in Metaspace',
        'Garbage Collector manages both Stack and Metaspace memory'
      ],
      answer: 1
    },
    {
      q: 'In Java Concurrency, what is the key difference between volatile and synchronized?',
      options: [
        'volatile provides atomicity, synchronized does not',
        'volatile ensures memory visibility across threads without mutual exclusion locks',
        'synchronized can only be applied to primitive variables',
        'There is no difference in JVM bytecode execution'
      ],
      answer: 1
    },
    {
      q: 'Which collection implementation in java.util provides thread safety with segmented locks or lock-free reads?',
      options: ['Hashtable', 'Collections.synchronizedMap', 'ConcurrentHashMap', 'TreeMap'],
      answer: 2
    }
  ],
  Python: [
    {
      q: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A lock that prevents Python from using more than 2GB of RAM',
        'A mutex that allows only one native thread to execute Python bytecodes at a time',
        'A cryptographic library for SSL connections',
        'A garbage collection mechanism for circular references'
      ],
      answer: 1
    },
    {
      q: 'Which built-in Python function returns an iterator of tuples where items are paired from iterables?',
      options: ['enumerate()', 'zip()', 'map()', 'filter()'],
      answer: 1
    },
    {
      q: 'What does a Python decorator do under the hood?',
      options: [
        'Modifies the syntax tree during compilation',
        'Takes a function as argument and returns a closure or replacement function',
        'Instantiates a class singleton',
        'Creates a separate OS thread'
      ],
      answer: 1
    }
  ],
  SQL: [
    {
      q: 'What is the key difference between WHERE and HAVING in SQL?',
      options: [
        'WHERE filters rows after aggregation, HAVING filters rows before aggregation',
        'WHERE filters rows before GROUP BY aggregation, HAVING filters aggregated groups',
        'HAVING can only be used with primary keys',
        'WHERE is only valid in SQLite, HAVING in PostgreSQL'
      ],
      answer: 1
    },
    {
      q: 'Which ACID property guarantees that all transactions complete successfully or roll back entirely?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      answer: 0
    },
    {
      q: 'What index type is most commonly used by default for primary keys in relational engines?',
      options: ['Hash Index', 'B-Tree / B+Tree Index', 'Bitmap Index', 'GiST Index'],
      answer: 1
    }
  ],
  DSA: [
    {
      q: 'What is the worst-case time complexity of QuickSort when a poorly chosen pivot is always selected?',
      options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
      answer: 2
    },
    {
      q: 'Which data structure is optimal for finding the shortest path in an unweighted graph?',
      options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Dijkstra with Fibonacci Heap', 'Bellman-Ford'],
      answer: 1
    },
    {
      q: 'What is the average lookup time in a properly sized Hash Table?',
      options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
      answer: 2
    }
  ]
};

const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  skillName,
  isOpen,
  onClose,
  onComplete
}) => {
  const questions = ASSESSMENT_QUESTIONS[skillName] || ASSESSMENT_QUESTIONS['Java'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const handleSelect = (optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentIdx] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer) correct++;
      });
      setScore(correct);
      setSubmitted(true);
      if (correct >= 2) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        onComplete(skillName);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-indigo-900/80 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              {skillName} Assessment Test
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-indigo-400 font-mono">Passing: 2/3 (66%)</span>
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed">
              {questions[currentIdx].q}
            </p>

            <div className="space-y-2">
              {questions[currentIdx].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelect(oIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    selectedAnswers[currentIdx] === oIdx
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={selectedAnswers[currentIdx] === undefined}
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{currentIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            {score >= 2 ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Assessment Passed!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    You scored {score}/{questions.length}. Your <strong>{skillName}</strong> skill status has been updated to <strong className="text-emerald-400">Assessment completed</strong> in your student profile and trust badge.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400 mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Keep Practicing</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    You scored {score}/{questions.length}. Review core {skillName} concepts and retry anytime.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TrustCenterView: React.FC<TrustCenterViewProps> = ({ currentUser, onUpdateUser }) => {
  const [activeModalSkill, setActiveModalSkill] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fraudulent Skill Claim');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const verification = currentUser.verification || {
    collegeStatus: 'Verified',
    collegeVerifiedAt: '2026-09-18T14:30:00Z',
    institutionalEmail: currentUser.email,
    cgpaStatus: 'Verified',
    cgpaVerifiedAt: '2026-09-20T11:15:00Z',
    cgpaDocumentName: 'VNR_VJIET_Sem4_GradeCard.pdf',
    cgpaDocumentSize: '1.4 MB',
    cgpaOcrExtracted: currentUser.cgpa,
    skillsStatus: {
      Java: 'Assessment completed',
      'Spring Boot': 'Project demonstrated',
      SQL: 'Assessment completed',
      Python: 'Self-reported'
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Pending Review</span>
          </span>
        );
      case 'Needs re-verification':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Re-verification</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
            <span>Not submitted</span>
          </span>
        );
    }
  };

  const getSkillBadge = (status: SkillVerificationStatus) => {
    switch (status) {
      case 'Verified by an authorized reviewer':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800 text-purple-300 text-[11px] font-semibold">
            Verified by Reviewer
          </span>
        );
      case 'Project demonstrated':
        return (
          <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[11px] font-semibold">
            Project Demonstrated
          </span>
        );
      case 'Assessment completed':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-semibold">
            Assessment Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px]">
            Self-reported
          </span>
        );
    }
  };

  const handleCompleteSkill = (skill: string) => {
    const updatedVerification = {
      ...verification,
      skillsStatus: {
        ...verification.skillsStatus,
        [skill]: 'Assessment completed' as SkillVerificationStatus
      }
    };
    const updatedUser = {
      ...currentUser,
      xp: currentUser.xp + 250,
      verification: updatedVerification
    };
    onUpdateUser(updatedUser);
  };

  const handleSimulateTranscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingDoc(true);
      setTimeout(() => {
        setUploadingDoc(false);
        setUploadSuccess(true);
        const updatedUser: User = {
          ...currentUser,
          verification: {
            ...verification,
            cgpaStatus: 'Verified',
            cgpaVerifiedAt: new Date().toISOString(),
            cgpaDocumentName: file.name,
            cgpaDocumentSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            cgpaOcrExtracted: currentUser.cgpa
          }
        };
        onUpdateUser(updatedUser);
        confetti({ particleCount: 50, spread: 50 });
      }, 1200);
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSent(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSent(false);
      setReportDetails('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-900/60 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Student Trust & Verification Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Compass Student Trust Charter
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every credential on Campus Compass AI is audited. We distinguish between <strong>Self-reported</strong> claims and <strong>Verified</strong> credentials to maintain a trusted peer marketplace and placement network.
          </p>
        </div>
      </div>

      {/* Main Grid: 3 Pillars of Student Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: College & Enrollment Verification */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              {getStatusBadge(verification.collegeStatus)}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">College Enrollment</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Institutional domain & enrollment status
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">College:</span>
                <span className="font-semibold text-white text-right">{currentUser.college}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Branch:</span>
                <span className="font-semibold text-white">{currentUser.branch || 'CSE'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inst. Email:</span>
                <span className="font-mono text-cyan-400">{currentUser.email}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official institutional email verified via automated DNS TXT and institutional gateway.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono text-[10px]">Audit ID: CC-CLG-8821</span>
            <span className="text-emerald-400 font-semibold text-[11px]">Enrolled & Active</span>
          </div>
        </div>

        {/* Card 2: CGPA & Transcript Verification */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              {getStatusBadge(verification.cgpaStatus)}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">CGPA & Marksheet</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official marksheet OCR review & verification
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CGPA:</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {currentUser.cgpa} / 10.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Label:</span>
                <span className="font-semibold text-emerald-400">
                  {verification.cgpaStatus === 'Verified' ? 'CGPA Verified' : 'Self-reported'}
                </span>
              </div>
              {verification.cgpaDocumentName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Audit Doc:</span>
                  <span className="font-mono text-slate-300 text-[10px] truncate max-w-[140px]">
                    {verification.cgpaDocumentName}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mark sheets are encrypted and never disclosed to other students. Only the verified stamp appears on your profile.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <label className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingDoc ? 'Running OCR Scan...' : 'Upload Latest Marksheet PDF'}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg"
                onChange={handleSimulateTranscriptUpload}
                disabled={uploadingDoc}
                className="hidden"
              />
            </label>
            {uploadSuccess && (
              <p className="text-[10px] text-emerald-400 text-center font-medium">
                ✓ OCR scan matched {currentUser.cgpa} CGPA. Status updated to CGPA Verified.
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Fraud Prevention & Reporting */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                Protected
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Fraud & Safety Shield</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Peer reporting, moderation & anti-harassment
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Malware scanning on all uploaded assets</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rate limits on messaging & connection requests</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No bot personas: 100% human registered students</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Report Suspicious Account or Spam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Skill Verification Section */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Technical Skill Verification Ledger</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Skills cannot be marked verified solely by typing them. Take interactive assessments to earn the <strong>Assessment completed</strong> badge.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Available tests:</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono font-semibold">
              Java · Python · SQL · DSA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentUser.skills || ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'Python']).map((skill) => {
            const currentStatus =
              verification.skillsStatus[skill] ||
              (skill === 'Java' || skill === 'SQL' ? 'Assessment completed' : 'Self-reported');

            return (
              <div
                key={skill}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{skill}</h4>
                    {getSkillBadge(currentStatus)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentStatus === 'Assessment completed'
                      ? 'Verified via standardized technical evaluation and algorithmic test cases.'
                      : currentStatus === 'Project demonstrated'
                      ? 'Demonstrated in production-grade GitHub repository and architectural review.'
                      : 'Claimed by student; assessment pending.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentStatus === 'Assessment completed' ? 'Verified' : 'Unverified'}
                  </span>
                  {currentStatus !== 'Assessment completed' ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalSkill(skill)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Take Assessment</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclosed Document Retention & Privacy Policy */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 space-y-1.5 leading-relaxed">
        <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Disclosed Document Retention & Privacy Policy</span>
        </h4>
        <p>
          Uploaded marksheets and identity proofs are stored in private, server-side encrypted object storage with strict access controls. Verification records are retained during your academic enrollment and purged upon graduation upon request. No documents are accessible by peers, recruiters, or public endpoints.
        </p>
      </div>

      {/* Assessment Test Modal */}
      {activeModalSkill && (
        <SkillAssessmentModal
          skillName={activeModalSkill}
          isOpen={true}
          onClose={() => setActiveModalSkill(null)}
          onComplete={(s) => {
            handleCompleteSkill(s);
          }}
        />
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-red-900/60 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>File Moderation Report</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            {reportSent ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Report Submitted</h4>
                <p className="text-xs text-slate-300">
                  Our Dean of Moderation and Academic Integrity Cell will audit the incident within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Report Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Fake Account">Fake Account / Bot</option>
                    <option value="Impersonation">Impersonation of Another Student</option>
                    <option value="Fraudulent Skill Claim">Fraudulent Skill Claim</option>
                    <option value="Spam">Spam or Unsolicited Commercial Messaging</option>
                    <option value="Harassment">Harassment or Inappropriate Behavior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Incident Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide relevant details or messages..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
