import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Zap, Brain, Users, Code2, Trophy, TrendingUp, Clock, ArrowRight, LogOut } from 'lucide-react';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection, query, where, orderBy,
  limit, onSnapshot, doc, getDoc,
} from 'firebase/firestore';

const radarData = [
  { skill: 'Confidence',      A: 0 },
  { skill: 'Communication',   A: 0 },
  { skill: 'Technical',       A: 0 },
  { skill: 'Problem Solving', A: 0 },
  { skill: 'Clarity',         A: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user,       setUser]       = useState(null);
  const [userData,   setUserData]   = useState(null);
  const [sessions,   setSessions]   = useState([]);
  const [weekData,   setWeekData]   = useState([]);
  const [radarSkills,setRadarSkills]= useState(radarData);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/login'); return; }
      setUser(u);

      // Fetch user document
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      if (userDoc.exists()) setUserData(userDoc.data());

      // Fetch last 10 sessions
      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', u.uid),
        limit(10)
    );

      onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSessions(docs);

        // Build week data from sessions
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const dayMap = {};
        docs.forEach((s) => {
          if (s.createdAt) {
            const d = new Date(s.createdAt.toDate());
            const day = days[d.getDay()];
            if (!dayMap[day]) dayMap[day] = { scores: [], day };
            dayMap[day].scores.push(s.overallScore || 0);
          }
        });
        const built = days.map((day) => ({
          day,
          score: dayMap[day]
            ? Math.round(dayMap[day].scores.reduce((a,b)=>a+b,0)/dayMap[day].scores.length)
            : 0,
        }));
        setWeekData(built);

        // Build radar from averages
        if (docs.length > 0) {
          const avg = (key) => Math.round(
            docs.filter(d=>d[key]).reduce((a,b)=>a+(b[key]||0),0) / docs.length
          );
          setRadarSkills([
            { skill: 'Confidence',      A: avg('confidence')    },
            { skill: 'Communication',   A: avg('communication') },
            { skill: 'Technical',       A: avg('technical')     },
            { skill: 'Problem Solving', A: avg('technical')     },
            { skill: 'Clarity',         A: avg('communication') },
          ]);
        }

        setLoading(false);
      });
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((a,b) => a + (b.overallScore||0), 0) / totalSessions)
    : 0;

  const typeIcon = { hr: Users, technical: Brain, coding: Code2, aptitude: Zap };
  const typeColor = {
    hr: 'text-plasma', technical: 'text-volt',
    coding: 'text-[#00f5ff]', aptitude: 'text-[#ffaa00]',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <div className="text-volt font-mono text-sm tracking-widest animate-pulse">
          LOADING DASHBOARD...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 noise-overlay">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-volt/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-volt rounded-sm flex items-center justify-center">
            <Zap size={18} className="text-obsidian-900" fill="currentColor" />
          </div>
          <span className="font-display text-2xl text-volt tracking-widest">INTERVIEWAI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/40">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 btn-outline-volt px-4 py-2 rounded-sm text-sm"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-volt/60 tracking-widest mb-1">WELCOME BACK</p>
          <h1 className="font-display text-5xl text-white tracking-wide">
            {userData?.name?.toUpperCase() || 'YOUR DASHBOARD'}
          </h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', val: totalSessions || '0',  icon: Clock,      color: 'text-volt',        border: 'border-volt/20'         },
            { label: 'Avg Score',      val: `${avgScore}%`,        icon: TrendingUp, color: 'text-plasma',      border: 'border-plasma/20'       },
            { label: 'Best Streak',    val: `${Math.min(totalSessions, 7)}d`, icon: Trophy, color: 'text-[#00f5ff]', border: 'border-[#00f5ff]/20' },
            { label: 'Sessions Done',  val: `#${totalSessions}`,   icon: Zap,        color: 'text-[#ffaa00]',   border: 'border-[#ffaa00]/20'    },
          ].map(({ label, val, icon: Icon, color, border }) => (
            <div key={label} className={`card-glass ${border} rounded-lg p-5`}>
              <Icon size={20} className={`${color} mb-3`} />
              <p className="font-display text-4xl text-white">{val}</p>
              <p className="font-body text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="card-glass border-volt/10 rounded-xl p-6">
            <p className="font-display text-xl text-white tracking-wider mb-6">WEEKLY SCORES</p>
            {weekData.every(d => d.score === 0) ? (
              <div className="h-[180px] flex items-center justify-center text-white/20 font-mono text-xs tracking-widest">
                NO DATA YET — COMPLETE AN INTERVIEW
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weekData} barSize={24}>
                  <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.3)', fontFamily:'JetBrains Mono', fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0,100]} />
                  <Tooltip contentStyle={{ background:'#0f0f1a', border:'1px solid rgba(181,255,45,0.2)', borderRadius:'8px' }} labelStyle={{ color:'#b5ff2d' }} itemStyle={{ color:'#fff' }} />
                  <Bar dataKey="score" fill="#b5ff2d" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card-glass border-plasma/10 rounded-xl p-6">
            <p className="font-display text-xl text-white tracking-wider mb-4">SKILL RADAR</p>
            {sessions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-white/20 font-mono text-xs tracking-widest">
                NO DATA YET
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarSkills}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill:'rgba(255,255,255,0.4)', fontFamily:'DM Sans', fontSize:11 }} />
                  <Radar name="Skills" dataKey="A" stroke="#ff3de8" fill="#ff3de8" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 card-glass border-volt/10 rounded-xl p-6">
            <p className="font-display text-xl text-white tracking-wider mb-5">RECENT SESSIONS</p>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/20 font-mono text-xs tracking-widest mb-4">
                  NO SESSIONS YET
                </p>
                <button
                  onClick={() => navigate('/interview/hr')}
                  className="btn-volt px-6 py-2.5 rounded-sm text-sm"
                >
                  START YOUR FIRST INTERVIEW
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => {
                  const Icon  = typeIcon[s.type]  || Zap;
                  const color = typeColor[s.type] || 'text-volt';
                  return (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-obsidian-800/60 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={color} />
                        <div>
                          <p className="font-body font-medium text-white text-sm capitalize">{s.type} Round</p>
                          <p className="font-mono text-xs text-white/30">
                            {s.createdAt ? new Date(s.createdAt.toDate()).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
                          <div className="h-full bg-volt rounded-full" style={{ width:`${s.overallScore||0}%` }} />
                        </div>
                        <span className="font-mono text-sm text-volt font-bold">{s.overallScore||0}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick start */}
          <div className="card-glass border-volt/10 rounded-xl p-6 flex flex-col justify-between">
            <p className="font-display text-xl text-white tracking-wider mb-4">QUICK START</p>
            <div className="space-y-3 flex-1">
              {[
                { label:'HR Round',  id:'hr',        color:'border-plasma/30 text-plasma'     },
                { label:'Technical', id:'technical', color:'border-volt/30 text-volt'         },
                { label:'Coding',    id:'coding',    color:'border-[#00f5ff]/30 text-[#00f5ff]'},
                { label:'Aptitude',  id:'aptitude',  color:'border-[#ffaa00]/30 text-[#ffaa00]'},
              ].map(({ label, id, color }) => (
                <button
                  key={id}
                  onClick={() => navigate(`/interview/${id}`)}
                  className={`w-full text-left px-4 py-3 rounded-md border ${color} bg-obsidian-800/40 hover:bg-obsidian-700/60 transition-all flex items-center justify-between group`}
                >
                  <span className="font-body text-sm font-medium">{label}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}