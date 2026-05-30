import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup]   = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        // Create account
        const userCred = await createUserWithEmailAndPassword(
          auth, form.email, form.password
        );
        // Save name to profile
        await updateProfile(userCred.user, { displayName: form.name });
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name: form.name,
          email: form.email,
          createdAt: serverTimestamp(),
          totalSessions: 0,
          avgScore: 0,
        });
        toast.success('Account created!');
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, form.email, form.password);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 grid-bg flex items-center justify-center px-4">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-volt/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-volt rounded-sm flex items-center justify-center">
            <Zap size={22} className="text-obsidian-900" fill="currentColor" />
          </div>
          <span className="font-display text-3xl text-volt tracking-widest">INTERVIEWAI</span>
        </div>

        <div className="card-glass rounded-xl p-8">
          <h2 className="font-display text-4xl text-white tracking-wider mb-1">
            {isSignup ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p className="text-white/40 font-body text-sm mb-8">
            {isSignup ? 'Start your interview prep journey' : 'Continue where you left off'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="font-mono text-xs text-volt/70 tracking-widest block mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-obsidian-800 border border-volt/20 rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-volt/60 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="font-mono text-xs text-volt/70 tracking-widest block mb-1.5">
                EMAIL
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-obsidian-800 border border-volt/20 rounded-md pl-10 pr-4 py-3 text-white font-body focus:outline-none focus:border-volt/60 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-volt/70 tracking-widest block mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-obsidian-800 border border-volt/20 rounded-md pl-10 pr-12 py-3 text-white font-body focus:outline-none focus:border-volt/60 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-volt w-full py-3.5 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOADING...' : isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-volt hover:underline font-medium"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}