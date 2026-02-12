import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import StudentList from './pages/StudentList';
import Attendance from './pages/Attendance'; // NEW: Imported from Day 26
import Finance from './pages/Finance';
import Notices from './pages/Notices';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR: Controls the URL navigation via NavLinks */}
      <Sidebar user={user} handleLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8">

        {/* GLOBAL HEADER */}
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

        {/* PROFESSIONAL ROUTING AREA */}
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />

          {/* Student Management */}
          <Route path="/students" element={<StudentList />} />

          {/* Attendance Management (Day 26) */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/finance" element={<Finance />} />
          {/* Finance & Fees (Day 27 Placeholder) */}
          {/* <Route path="/finance" element={<Finance />} /> */}
          <Route path="/notices" element={<Notices user={user} />} />

          {/* Academic Placeholder */}
          <Route path="/academic" element={<div className="p-10 bg-white rounded-xl shadow-sm">Academic Assignments Module Coming Soon...</div>} />
          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;