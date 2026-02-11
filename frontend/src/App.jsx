import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard'; 
import StudentList from './pages/StudentList'; // Import the new List component

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // STEP 3 UPDATE: State to track which page we are viewing
  const [activeTab, setActiveTab] = useState('Dashboard');

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
      {/* 1. Sidebar - We pass activeTab and setActiveTab to handle clicks */}
      <Sidebar 
        user={user} 
        handleLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 ml-64 p-8">
        
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back, {user.name}</h2>
            <p className="text-slate-500 text-sm">Managing: {activeTab}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </header>

        {/* 2. DYNAMIC CONTENT AREA */}
        {/* We switch the view based on what the user clicked in the sidebar */}
        {activeTab === 'Dashboard' && <AdminDashboard />}
        {activeTab === 'Students' && <StudentList />}

        {/* Optional: Keep Recent Activity only on the main Dashboard tab */}
        {activeTab === 'Dashboard' && (
          <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="flex flex-col items-center justify-center border-dashed border-2 border-slate-200 rounded-lg py-12">
                  <p className="text-slate-400 font-medium text-center">
                      Activity feed will appear here as you manage the institute.
                  </p>
              </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;