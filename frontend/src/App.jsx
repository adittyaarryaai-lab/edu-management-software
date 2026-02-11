import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routing components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user on mount
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 1. Loading State
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // 2. Authentication Gate: If no user, only show Login
  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 3. Sidebar - Now clean, routing logic is inside the Sidebar component using NavLink */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8">
        
        {/* Global Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back, {user.name}</h2>
            <p className="text-slate-500 text-sm italic uppercase tracking-widest">{user.role} Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </header>

        {/* 4. PROFESSIONAL ROUTING AREA */}
        {/* We use Routes to decide which component to show based on the URL bar */}
        <Routes>
          {/* Dashboard Route */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          
          {/* Student Module Route */}
          <Route path="/students" element={<StudentList />} />

          {/* Academic Route (Placeholder for Day 25+) */}
          <Route path="/academic" element={<div className="p-10 bg-white rounded-xl shadow-sm">Academic Module Coming Soon...</div>} />

          {/* Fallback: If URL doesn't match, redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Note: Recent Activity logic should eventually move inside AdminDashboard.jsx 
            to keep this main file clean, but for now, it's handled by the routes above */}
      </main>
    </div>
  );
}

export default App;