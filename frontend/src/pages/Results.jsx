import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react';

function ScoreRing({ score, color, label }) {
  const radius  = 54;
  const circ    = 2 * Math.PI * radius;
  const offset  = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl text-white">{score}</span>
          <span className="font-mono text-xs text-white/30">/ 100</span>
        </div>
      </div>
      <p className="font-mono text-xs tracking-widest text-white/50">{label}</p>
    </div>
  );
}

export default function Results() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const answers   = location.state?.answers || [];

  // Compute averages from real answers if available, else mock
  const avg = (key) => {
    if (!answers.length) return Math.floor(Math.random() * 30 + 65);
    const vals = answers.filter((a) => a.feedback?.[key]).map((a) => a.feedback[key]);
    return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 75;
  };

  const confidence    = avg('confidence');
  const communication = avg('communication');
  const technical     = avg('technical');
  const overall       = Math.round((confidence + communication + technical) / 3);

  return (
    <div className="min-h-screen bg-obsidian-900 noise-overlay">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-volt/8 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-volt/10 border border-volt/30 rounded-full mb-5">
            <Trophy size={28} className="text-volt" />
          </div>
          <h1 className="font-display text-6xl text-white tracking-wide mb-2">SESSION COMPLETE</h1>
          <p className="text-white/40 font-body">Here's your detailed performance breakdown</p>
        </div>

        {/* Overall score */}
        <div className="card-glass border-volt/20 rounded-2xl p-10 mb-8 text-center">
          <p className="font-mono text-xs text-volt/60 tracking-widest mb-6">OVERALL SCORE</p>
          <div className="inline-flex items-end gap-2 mb-4">
            <span className="font-display text-[8rem] leading-none text-volt text-glow-volt">{overall}</span>
            <span className="font-display text-4xl text-white/30 mb-4">/ 100</span>
          </div>
          <p className="font-body text-white/50">
            {overall >= 85 ? '🔥 Excellent! You are interview-ready.' :
             overall >= 70 ? '💪 Good performance! Keep practicing.' :
             '📚 Needs improvement. Review the feedback below.'}
          </p>
        </div>

        {/* Score rings */}
        <div className="card-glass border-white/5 rounded-2xl p-8 mb-8">
          <p className="font-display text-2xl text-white tracking-wider mb-8 text-center">SCORE BREAKDOWN</p>
          <div className="flex justify-around">
            <ScoreRing score={confidence}    color="#ff3de8" label="CONFIDENCE"    />
            <ScoreRing score={communication} color="#b5ff2d" label="COMMUNICATION" />
            <ScoreRing score={technical}     color="#00f5ff" label="TECHNICAL"     />
          </div>
        </div>

        {/* Per-question breakdown */}
        {answers.length > 0 && (
          <div className="card-glass border-white/5 rounded-2xl p-8 mb-8">
            <p className="font-display text-2xl text-white tracking-wider mb-6">QUESTION REVIEW</p>
            <div className="space-y-4">
              {answers.map(({ question, answer, feedback }, i) => (
                <div key={i} className="bg-obsidian-800/60 border border-white/5 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-mono text-xs text-volt/50 mt-0.5">Q{i + 1}</span>
                    <p className="font-body text-sm text-white/70">{question}</p>
                  </div>
                  <div className="flex items-start gap-3 mb-3 pl-6">
                    <p className="font-body text-xs text-white/40 italic">"{answer.slice(0, 120)}{answer.length > 120 ? '...' : ''}"</p>
                  </div>
                  {feedback && (
                    <div className="flex items-center gap-4 pl-6">
                      {feedback.confidence >= 70
                        ? <CheckCircle size={14} className="text-volt" />
                        : <XCircle size={14} className="text-red-400" />}
                      <span className="font-mono text-xs text-white/40">
                        Conf: {feedback.confidence}% · Comm: {feedback.communication}% · Tech: {feedback.technical}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-outline-volt flex items-center gap-2 px-8 py-3 rounded-sm"
          >
            <Home size={16} /> DASHBOARD
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-volt flex items-center gap-2 px-8 py-3 rounded-sm"
          >
            <RotateCcw size={16} /> PRACTICE AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}