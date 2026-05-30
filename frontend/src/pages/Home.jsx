import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Brain, Mic, Video, Code2, Users } from 'lucide-react';

const MODES = [
  {
    id: 'hr',
    label: 'HR Round',
    icon: Users,
    color: 'plasma',
    desc: 'Behavioral & personality questions with confidence scoring',
    gradient: 'from-plasma/20 to-transparent',
    border: 'border-plasma/30',
    glow: 'glow-plasma',
  },
  {
    id: 'technical',
    label: 'Technical',
    icon: Brain,
    color: 'volt',
    desc: 'Domain-specific questions evaluated by Gemini AI',
    gradient: 'from-volt/20 to-transparent',
    border: 'border-volt/30',
    glow: 'glow-volt',
  },
  {
    id: 'coding',
    label: 'Coding Round',
    icon: Code2,
    color: 'cyan-neon',
    desc: 'DSA problems with real-time code analysis',
    gradient: 'from-[#00f5ff]/20 to-transparent',
    border: 'border-[#00f5ff]/30',
    glow: 'glow-cyan',
  },
  {
    id: 'aptitude',
    label: 'Aptitude',
    icon: Zap,
    color: 'amber-neon',
    desc: 'Logical reasoning, quant & verbal ability tests',
    gradient: 'from-[#ffaa00]/20 to-transparent',
    border: 'border-[#ffaa00]/30',
    glow: '',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian-900 noise-overlay relative overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Radial glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-volt/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed top-1/2 right-0 w-[400px] h-[600px] bg-plasma/8 blur-[100px] pointer-events-none rounded-full" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-volt/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-volt rounded-sm flex items-center justify-center">
            <Zap size={18} className="text-obsidian-900" fill="currentColor" />
          </div>
          <span className="font-display text-2xl text-volt tracking-widest">INTERVIEWAI</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-outline-volt px-5 py-2 rounded-sm"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-volt px-5 py-2 rounded-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center pt-24 pb-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-volt/30 bg-volt/5 mb-8">
          <span className="w-2 h-2 bg-volt rounded-full animate-pulse" />
          <span className="font-mono text-xs text-volt tracking-widest uppercase">
            AI-Powered Interview Coach
          </span>
        </div>

        <h1 className="font-display text-[7rem] leading-none text-white mb-2 tracking-tight">
          ACE EVERY
        </h1>
        <h1 className="font-display text-[7rem] leading-none text-volt text-glow-volt tracking-tight mb-6">
          INTERVIEW
        </h1>
        <p className="text-xl text-white/50 max-w-lg font-body font-light leading-relaxed mb-12">
          Practice with AI. Get scored on confidence, communication & technical
          depth. Land the job.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/interview/hr')}
            className="btn-volt px-10 py-4 rounded-sm flex items-center gap-3 text-lg"
          >
            Start Practice <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-outline-volt px-10 py-4 rounded-sm text-lg"
          >
            View Progress
          </button>
        </div>

        {/* Input modes */}
        <div className="flex items-center gap-8 mt-14">
          {[
            { icon: Mic, label: 'Voice' },
            { icon: Video, label: 'Webcam' },
            { icon: Code2, label: 'Typing' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/40">
              <Icon size={16} />
              <span className="font-mono text-xs tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mode cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <p className="font-display text-3xl text-white/30 tracking-widest text-center mb-10">
          CHOOSE YOUR ROUND
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => navigate(`/interview/${mode.id}`)}
                className={`card-glass ${mode.border} rounded-lg p-6 text-left group hover:scale-[1.02] transition-all duration-300 ${mode.glow ? `hover:${mode.glow}` : ''}`}
              >
                <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${mode.gradient} border ${mode.border} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="font-display text-xl text-white tracking-wider mb-1">{mode.label}</p>
                <p className="font-body text-xs text-white/40 leading-relaxed">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 border-t border-volt/10 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: '50K+', label: 'Interviews Practiced' },
            { num: '94%', label: 'Success Rate' },
            { num: '200+', label: 'Question Bank' },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="font-display text-5xl text-volt text-glow-volt">{num}</p>
              <p className="font-body text-sm text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}