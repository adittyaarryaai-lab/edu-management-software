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
import Transport from './pages/Transport';
import IDCard from './pages/IDCard';
import Library from './pages/Library';
import LiveClass from './pages/LiveClass';
import Feedback from './pages/Feedback';
import Requests from './pages/Requests';
import Mentorship from './pages/Mentorship';
import Syllabus from './pages/Syllabus';
import AdminHome from './pages/AdminHome'; // Day 28: Import Admin Page

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-blue-600/10 p-4 rounded-3xl mb-4">
           <h1 className="text-3xl font-black text-blue-600 font-sans tracking-tighter uppercase">EduFlowAI</h1>
        </div>
        <p className="text-slate-500 mb-8 font-bold uppercase text-[10px] tracking-[0.2em]">Select Portal Access</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => {
              const mock = { name: "Vipin Tanwar", role: "student" };
              setUser(mock);
              localStorage.setItem('user', JSON.stringify(mock));
            }}
            className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            STUDENT PORTAL
          </button>

          <button 
            onClick={() => {
              const mock = { name: "Math Teacher Anita", role: "teacher" };
              setUser(mock);
              localStorage.setItem('user', JSON.stringify(mock));
            }}
            className="bg-slate-800 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-slate-200 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            TEACHER PORTAL
          </button>

          {/* Day 28: Admin Access Button */}
          <button 
            onClick={() => {
              const mock = { name: "System Admin", role: "admin" };
              setUser(mock);
              localStorage.setItem('user', JSON.stringify(mock));
            }}
            className="bg-purple-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-purple-100 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            ADMIN PORTAL
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
          {/* Day 28: Dynamic Dashboard Redirect based on Role */}
          <Route 
            path="/" 
            element={
              user.role === 'admin' ? <AdminHome /> : 
              user.role === 'teacher' ? <TeacherHome user={user} /> : 
              <StudentHome user={user} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user.role === 'admin' ? <AdminHome /> : 
              user.role === 'teacher' ? <TeacherHome user={user} /> : 
              <StudentHome user={user} />
            } 
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
          <Route path="/transport" element={<Transport />} />
          <Route path="/id-card" element={<IDCard user={user} />} />
          <Route path="/library" element={<Library />} />
          <Route path="/live-class" element={<LiveClass />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/mentors" element={<Mentorship />} />
          <Route path="/syllabus" element={<Syllabus />} />
          
          {/* Teacher Specific Routes */}
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />

          {/* Identity & Settings */}
          <Route path="/my-account" element={<MyAccount user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Hide BottomNav for Admin if needed, or keep it for easy switching */}
      {user.role !== 'admin' && <BottomNav />}
    </div>
  );
}

export default App;