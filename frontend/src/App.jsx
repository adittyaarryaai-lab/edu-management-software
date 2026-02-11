import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard'; // Import the dynamic component

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

        {/* DYNAMIC DASHBOARD SECTION 
            We replaced the manual 4 cards with this single component 
            that calls our /admin-stats API.
        */}
        <AdminDashboard />

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="flex flex-col items-center justify-center border-dashed border-2 border-slate-200 rounded-lg py-12">
                <p className="text-slate-400 font-medium text-center">
                    Feed is currently quiet. <br /> 
                    Once you start admitting students and marking attendance, <br /> 
                    activities will appear here.
                </p>
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;