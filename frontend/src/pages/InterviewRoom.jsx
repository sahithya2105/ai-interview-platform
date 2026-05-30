import { auth, db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
  Mic, MicOff, Video, VideoOff, Send, ChevronRight,
  Loader2, Zap, Clock, SkipForward,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeAnswer } from '../utils/api';

const QUESTIONS = {
  hr: [
    'Tell me about yourself and your background.',
    'What is your greatest professional strength?',
    'Describe a time you handled a conflict at work.',
    'Where do you see yourself in 5 years?',
    'Why do you want to work at our company?',
  ],
  technical: [
    'Explain the difference between REST and GraphQL APIs.',
    'What are the SOLID principles in software design?',
    'How does garbage collection work in JavaScript?',
    'Explain the CAP theorem in distributed systems.',
    'What is the difference between SQL and NoSQL databases?',
  ],
  coding: [
    'Write a function to reverse a string without using built-in methods.',
    'Implement a binary search algorithm.',
    'Find the longest substring without repeating characters.',
    'Write a function to check if a number is prime.',
    'Implement a stack using two queues.',
  ],
  aptitude: [
    'A train travels 120 km in 2 hours. What is its speed in m/s?',
    'If 15 workers finish a job in 8 days, how many days for 10 workers?',
    'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    'A shopkeeper sells an item at 20% profit. If cost is ₹500, what is the selling price?',
    'What is the probability of getting a head when a fair coin is tossed?',
  ],
};

const TYPE_CONFIG = {
  hr:        { label: 'HR Round',     color: 'plasma', borderClass: 'border-plasma/30'      },
  technical: { label: 'Technical',    color: 'volt',   borderClass: 'border-volt/30'        },
  coding:    { label: 'Coding Round', color: 'cyan',   borderClass: 'border-[#00f5ff]/30'   },
  aptitude:  { label: 'Aptitude',     color: 'amber',  borderClass: 'border-[#ffaa00]/30'   },
};

export default function InterviewRoom() {
  const { type } = useParams();
  const navigate  = useNavigate();
  const config    = TYPE_CONFIG[type] || TYPE_CONFIG.hr;
  const questions = QUESTIONS[type]   || QUESTIONS.hr;

  const [qIdx,        setQIdx]        = useState(0);
  const [answer,      setAnswer]      = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCam,     setShowCam]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [feedback,    setFeedback]    = useState(null);
  const [timeLeft,    setTimeLeft]    = useState(120);
  const [answers,     setAnswers]     = useState([]);

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIdx]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(120);
  };

  // Voice recording
  const toggleRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = 'en-US';
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setAnswer(transcript);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Microphone error. Please check permissions.');
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.success('Listening...');
  }, [isRecording]);

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Please provide an answer.'); return; }
    setLoading(true);
    setFeedback(null);
    try {
      const result = await analyzeAnswer({
        question: questions[qIdx],
        answer,
        type,
      });
      setFeedback(result);
      setAnswers((prev) => [...prev, { question: questions[qIdx], answer, feedback: result }]);
    } catch {
      toast.error('Analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED nextQuestion — saves session to Firebase
  const nextQuestion = async () => {
    if (qIdx + 1 >= questions.length) {
      // Save session to Firestore
      const user = auth.currentUser;
      if (user && answers.length > 0) {
        const avg = (key) => Math.round(
          answers.filter(a => a.feedback?.[key])
                 .reduce((s, a) => s + a.feedback[key], 0) / answers.length
        );
        try {
          await addDoc(collection(db, 'sessions'), {
            userId:         user.uid,
            type,
            confidence:     avg('confidence'),
            communication:  avg('communication'),
            technical:      avg('technical'),
            overallScore:   Math.round(
              (avg('confidence') + avg('communication') + avg('technical')) / 3
            ),
            totalQuestions: questions.length,
            createdAt:      serverTimestamp(),
          });
          toast.success('Session saved!');
        } catch (err) {
          console.error('Failed to save session:', err);
        }
      }
      navigate('/results/session-1', { state: { answers } });
      return;
    }
    setQIdx(qIdx + 1);
    setAnswer('');
    setFeedback(null);
    resetTimer();
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const accentColor = {
    plasma: 'text-plasma border-plasma',
    volt:   'text-volt border-volt',
    cyan:   'text-[#00f5ff] border-[#00f5ff]',
    amber:  'text-[#ffaa00] border-[#ffaa00]',
  }[config.color];

  return (
    <div className="min-h-screen bg-obsidian-900 noise-overlay">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Top bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-volt/10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-volt rounded-sm flex items-center justify-center">
            <Zap size={14} className="text-obsidian-900" fill="currentColor" />
          </div>
          <span className="font-display text-xl text-volt tracking-widest">INTERVIEWAI</span>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-sm ${timeLeft < 30 ? 'text-red-400' : 'text-white/50'}`}>
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>
          <span className="font-mono text-xs text-white/30">
            {qIdx + 1} / {questions.length}
          </span>
          <span className={`font-display text-sm tracking-wider px-3 py-1 rounded border ${accentColor}`}>
            {config.label}
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5 bg-obsidian-700">
        <div
          className="h-full bg-volt transition-all duration-500"
          style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="col-span-2 space-y-5">
          {/* Question */}
          <div className={`card-glass ${config.borderClass} rounded-xl p-7 animate-slide-up`}>
            <p className="font-mono text-xs text-white/30 tracking-widest mb-3">
              QUESTION {qIdx + 1}
            </p>
            <p className="font-body text-xl text-white leading-relaxed font-light">
              {questions[qIdx]}
            </p>
          </div>

          {/* Answer */}
          <div className="card-glass border-volt/10 rounded-xl p-5">
            <p className="font-mono text-xs text-volt/60 tracking-widest mb-3">YOUR ANSWER</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Type your answer or use voice input..."
              className="w-full bg-transparent text-white/80 font-body text-sm leading-relaxed resize-none focus:outline-none placeholder-white/20"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md border font-mono text-xs tracking-widest transition-all ${
                isRecording
                  ? 'border-plasma text-plasma bg-plasma/10 recording-pulse'
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
              {isRecording ? 'STOP' : 'VOICE'}
            </button>

            <button
              onClick={() => setShowCam(!showCam)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md border font-mono text-xs tracking-widest transition-all ${
                showCam
                  ? 'border-[#00f5ff] text-[#00f5ff] bg-[#00f5ff]/10'
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              {showCam ? <VideoOff size={15} /> : <Video size={15} />}
              WEBCAM
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="btn-volt flex-1 py-2.5 rounded-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'ANALYZING...' : 'ANALYZE'}
            </button>

            {feedback && (
              <button
                onClick={nextQuestion}
                className="btn-outline-volt flex items-center gap-2 px-5 py-2.5 rounded-md"
              >
                {qIdx + 1 < questions.length ? (
                  <><ChevronRight size={16} /> NEXT</>
                ) : (
                  <><SkipForward size={16} /> FINISH</>
                )}
              </button>
            )}
          </div>

          {/* Webcam */}
          {showCam && (
            <div className="card-glass border-[#00f5ff]/20 rounded-xl overflow-hidden">
              <Webcam
                audio={false}
                mirrored
                className="w-full rounded-xl"
                style={{ maxHeight: '220px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {/* Feedback panel */}
        <div className="space-y-4">
          {loading && (
            <div className="card-glass border-volt/20 rounded-xl p-6 flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-volt animate-spin" />
              <p className="font-mono text-xs text-volt/60 tracking-widest text-center">
                AI ANALYZING...
              </p>
            </div>
          )}

          {feedback && !loading && (
            <div className="card-glass border-volt/20 rounded-xl p-6 animate-slide-up space-y-5">
              <p className="font-display text-xl text-white tracking-wider">AI FEEDBACK</p>

              {[
                { label: 'Confidence',    val: feedback.confidence,    color: '#ff3de8' },
                { label: 'Communication', val: feedback.communication, color: '#b5ff2d' },
                { label: 'Technical',     val: feedback.technical,     color: '#00f5ff' },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-mono text-xs text-white/50 tracking-widest">
                      {label.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-bold" style={{ color }}>
                      {val}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${val}%`, background: color }}
                    />
                  </div>
                </div>
              ))}

              <div className="border-t border-white/5 pt-4">
                <p className="font-mono text-xs text-volt/60 tracking-widest mb-2">FEEDBACK</p>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>

              {feedback.suggestion && (
                <div className="bg-volt/5 border border-volt/20 rounded-lg p-3">
                  <p className="font-mono text-xs text-volt/60 tracking-widest mb-1">SUGGESTION</p>
                  <p className="font-body text-xs text-white/60 leading-relaxed">
                    {feedback.suggestion}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          {!feedback && !loading && (
            <div className="card-glass border-white/5 rounded-xl p-5">
              <p className="font-mono text-xs text-white/30 tracking-widest mb-3">TIPS</p>
              <ul className="space-y-2">
                {[
                  'Speak clearly and confidently',
                  'Use the STAR method for HR',
                  'Include examples from experience',
                  'Keep answers under 2 minutes',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-white/40 font-body">
                    <span className="text-volt mt-0.5">▸</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}