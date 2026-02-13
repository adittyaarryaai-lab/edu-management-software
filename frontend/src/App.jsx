import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import StudentHome from './pages/StudentHome';
import AttendanceDetails from './pages/AttendanceDetails';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">EduFlowAI Reborn</h1>
        <p className="text-slate-500 mb-8">Premium School Management System</p>
        <button 
          onClick={() => {
            const mock = { name: "Vipin Tanwar", role: "student" };
            setUser(mock);
            localStorage.setItem('user', JSON.stringify(mock));
          }}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 active:scale-95 transition-all"
        >
          START TESTING
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      {/* Navbar ko top par fix rakha hai */}
      <Navbar user={user} />
      
      {/* Main content ko padding di hai taaki navbar ke niche se shuru ho */}
      <main className="relative z-0 pb-32">
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/dashboard" element={<StudentHome />} />
          <Route path="/attendance" element={<AttendanceDetails />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/fees" element={<Fees user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;