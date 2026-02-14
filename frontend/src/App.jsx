import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import StudentHome from './pages/StudentHome';
import AttendanceDetails from './pages/AttendanceDetails';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import Notifications from './pages/Notifications';
import TeacherHome from './pages/TeacherHome';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherStudentList from './pages/TeacherStudentList';
import TeacherAssignments from './pages/TeacherAssignments';
import Performance from './pages/Performance';
import TeacherSchedule from './pages/TeacherSchedule';
import Holidays from './pages/Holidays';
import Academic from './pages/Academic';
import Support from './pages/Support';
import NoticeFeed from './pages/NoticeFeed';
import Settings from './pages/Settings';
import MyAccount from './pages/MyAccount';
import Exams from './pages/Exams';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2 font-sans">EduFlowAI Reborn</h1>
        <p className="text-slate-500 mb-8 font-medium">Select a role to test the Premium UI</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => {
              const mock = { name: "Vipin Tanwar", role: "student" };
              setUser(mock);
              localStorage.setItem('user', JSON.stringify(mock));
            }}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            LOGIN AS STUDENT
          </button>

          <button 
            onClick={() => {
              const mock = { name: "Math Teacher Anita", role: "teacher" };
              setUser(mock);
              localStorage.setItem('user', JSON.stringify(mock));
            }}
            className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all"
          >
            LOGIN AS TEACHER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <Navbar user={user} />
      
      <main className="relative z-0 pb-32">
        <Routes>
          {/* Dashboard Routes */}
          <Route 
            path="/" 
            element={user.role === 'teacher' ? <TeacherHome user={user} /> : <StudentHome user={user} />} 
          />
          <Route 
            path="/dashboard" 
            element={user.role === 'teacher' ? <TeacherHome user={user} /> : <StudentHome user={user} />} 
          />

          {/* Timetable Switching */}
          <Route 
            path="/timetable" 
            element={user.role === 'teacher' ? <TeacherSchedule /> : <Timetable />} 
          />

          {/* Student Specific Routes */}
          <Route path="/attendance" element={<AttendanceDetails />} />
          <Route path="/fees" element={<Fees user={user} />} />
          <Route path="/notices" element={<Notifications />} />
          <Route path="/analytics" element={<Performance />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notice-feed" element={<NoticeFeed />} />
          <Route path="/exams" element={<Exams />} />
          
          {/* Teacher Specific Routes */}
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />

          {/* Identity & Settings (Day 18 Split) */}
          <Route path="/my-account" element={<MyAccount user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;