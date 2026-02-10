import React, { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {
  // We store the user object here (name, role, etc.)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user is already logged in when the app starts
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear the token and user data from browser storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {!user ? (
        // If no user, show the Login component
        <Login />
      ) : (
        // If user is logged in, show the Dashboard
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1 style={{ color: '#007bff' }}>EduFlowAI Dashboard</h1>
          <div style={{ 
            background: '#f4f4f4', 
            display: 'inline-block', 
            padding: '20px', 
            borderRadius: '10px',
            border: '1px solid #ddd' 
          }}>
            <p>Welcome back, <strong>{user.name}</strong>!</p>
            <p>Role: <span style={{ textTransform: 'uppercase', color: '#555' }}>{user.role}</span></p>
            
            <button 
              onClick={handleLogout} 
              style={{ 
                marginTop: '20px', 
                padding: '10px 25px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;