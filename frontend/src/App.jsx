import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import Results from './pages/Results';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const [user,    setUser]    = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-900 flex items-center justify-center">
        <p className="font-mono text-xs text-volt/60 tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f0f1a',
            color: '#e8e8f0',
            border: '1px solid rgba(181,255,45,0.2)',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/interview/:type" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
        <Route path="/results/:id"     element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}