import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface FloatingCompassAIProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const quickPrompts = [
  'What should I learn today?',
  'Give me Java interview questions for Amazon',
  'Which elective should I choose next?',
  'How can I improve my CGPA to 9.0?',
  'Which certification should I pursue first?',
  'Suggest a high-impact cybersecurity capstone project'
];

export const FloatingCompassAI: React.FC<FloatingCompassAIProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${currentUser.name.split(' ')[0]}! I am **Compass AI**, your 24/7 academic advisor and career mentor. How can I guide your learning or placement preparation today?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askCompassAI(query);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.reply || 'I am ready to assist with your academic and career goals.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to reach the advisory server right now. Try again in a moment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulated voice prompt
      setTimeout(() => {
        setIsListening(false);
        setInput('What are the most crucial Java 21 interview questions?');
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh] bg-slate-950/95 border border-indigo-900/60 rounded-2xl shadow-2xl shadow-indigo-950/80 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Compass AI
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Advisory Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual to your CSE degree & career goal</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/40 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/70 hover:bg-indigo-900/50 hover:text-indigo-200 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-all shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400/80">
                <span className="tabular-nums">{m.time}</span>
                {m.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(m.text, idx)}
                    className="p-1 hover:text-slate-200 transition-colors ml-2"
                    title="Copy message"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-slate-400">Synthesizing personalized advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Alert if Active */}
      {isListening && (
        <div className="px-4 py-1.5 bg-rose-950/80 border-t border-rose-900/60 text-rose-300 text-[11px] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Listening to your voice input... (Speak now)
          </div>
          <button onClick={() => setIsListening(false)} className="underline">
            Cancel
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title={isListening ? 'Stop recording' : 'Speak to Compass AI'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about Java, electives, placement, or projects..."
            className="flex-1 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          AI guidance is personalized for academic growth. Verify university course codes before registration.
        </p>
      </div>
    </div>
  );
};
