import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import API from './api'; 
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
import AdminHome from './pages/AdminHome';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login Failed! Check your credentials.");
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="bg-blue-600/10 w-fit px-6 py-2 rounded-2xl mb-6 mx-auto">
            <h1 className="text-2xl font-black text-blue-600 tracking-tighter uppercase">EduFlowAI</h1>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Welcome Back</h2>
          <p className="text-slate-400 mb-8 font-bold uppercase text-[9px] tracking-[0.2em] text-center">Login to your specialized portal</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email Id....." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password...." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-100 active:scale-95 transition-all uppercase text-xs tracking-widest mt-4 disabled:bg-slate-300"
            >
              {loading ? "Verifying..." : "ACCESS PORTAL"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              Secured by JWT • EduFlowAI Enterprise
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <Navbar user={user} />
      
      <main className="relative z-0 pb-32">
        <Routes>
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

          {/* FIX: Pass user prop to Timetable */}
          <Route 
            path="/timetable" 
            element={user.role === 'teacher' ? <TeacherSchedule user={user} /> : <Timetable user={user} />} 
          />

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
          
          <Route path="/teacher/attendance" element={<TeacherAttendance user={user} />} />
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />

          <Route path="/my-account" element={<MyAccount user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {user.role !== 'admin' && <BottomNav />}
    </div>
  );
}

export default App;