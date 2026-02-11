import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
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

  // If not logged in, show only the Login screen
  if (!user) return <Login />;

  // If logged in, show the Professional Dashboard Layout
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Fixed Sidebar */}
      <Sidebar user={user} handleLogout={handleLogout} />

      {/* 2. Main Viewport Area */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Top Header Bar */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back, {user.name}</h2>
            <p className="text-slate-500 text-sm">Here is what's happening at your institute today.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </header>

        {/* Dashboard Statistics Cards (Placeholders for now) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Students</h3>
            <p className="text-3xl font-extrabold text-slate-900">1,240</p>
            <span className="text-green-500 text-xs font-medium">↑ 12% from last month</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Daily Attendance</h3>
            <p className="text-3xl font-extrabold text-slate-900">94.2%</p>
            <span className="text-slate-400 text-xs">Standard average</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Fees Collected</h3>
            <p className="text-3xl font-extrabold text-blue-600">₹4.2L</p>
            <span className="text-red-400 text-xs">8 invoices pending</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Active Notices</h3>
            <p className="text-3xl font-extrabold text-slate-900">5</p>
            <span className="text-blue-400 text-xs font-medium underline">View All</span>
          </div>
        </div>

        {/* Recent Activity Section (Empty for now) */}
        <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col items-center justify-center border-dashed border-2">
            <p className="text-slate-400 font-medium">Coming Soon: Recent Activity Feed & Analytics</p>
        </div>

      </main>
    </div>
  );
}

export default App;