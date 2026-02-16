import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Animation ke liye
import { Bot, Cpu, Zap, ShieldCheck } from 'lucide-react'; // Robot icons
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
import AdminTimetable from './pages/AdminTimetable';
import AdminFees from './pages/AdminFees'; 
import StudentAssignments from './pages/StudentAssignments';
import TeacherGrading from './pages/TeacherGrading';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      navigate("/"); 
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login Failed! Check your credentials.");
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-slate-950">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/image.png.jpeg" 
            alt="AI Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-blue-900/20 backdrop-blur-[2px]"></div>
        </div>

        {/* --- ROBOT ANIMATION SECTION --- */}
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "0%", "-100%"] }}
          transition={{ 
            duration: 4, 
            times: [0, 0.5, 1], 
            ease: "easeInOut" 
          }}
          className="absolute left-0 z-30 flex items-center pointer-events-none"
        >
          {/* Robot Body */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 rounded-r-full shadow-[0_0_50px_rgba(59,130,246,0.5)] border-y-4 border-r-4 border-white/20">
            <Bot size={80} className="text-white animate-pulse" />
          </div>
          {/* Mechanical Arm holding the card */}
          <div className="w-20 h-2 bg-slate-400 shadow-lg"></div>
        </motion.div>

        {/* --- LOGIN CARD WITH DRAG ANIMATION --- */}
        <motion.div 
          initial={{ x: "-120%", opacity: 0, rotate: -10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.5, type: "spring", stiffness: 50 }}
          className="relative z-10 w-full max-w-lg px-6"
        >
          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] p-10 md:p-14 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            
            {/* Animated scanning line effect */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 z-0"
            />

            <div className="text-center mb-10 relative z-10">
              <div className="flex justify-center gap-4 mb-4">
                <Cpu className="text-blue-400 animate-spin-slow" size={30} />
                <h2 className="text-4xl font-black text-white tracking-tight">EduFlowAi</h2>
                <Zap className="text-yellow-400 animate-bounce" size={30} />
              </div>
              <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full mb-4 shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
              <p className="text-blue-100/70 font-bold uppercase text-[10px] tracking-[0.4em]">Biometric Auth Required</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Personnel ID / Email"
                  className="w-full bg-slate-900/50 border border-white/10 py-5 px-8 rounded-[2rem] outline-none text-white placeholder:text-white/20 focus:border-blue-500 focus:bg-slate-900/80 transition-all font-medium"
                  required
                />
              </div>
              
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access Encryption Key"
                  className="w-full bg-slate-900/50 border border-white/10 py-5 px-8 rounded-[2rem] outline-none text-white placeholder:text-white/20 focus:border-blue-500 focus:bg-slate-900/80 transition-all font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-blue-400/60">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Quantum Secured</span>
                </div>
                <button type="button" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Bypass Key?</button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black shadow-[0_15px_40px_rgba(59,130,246,0.4)] active:scale-95 transition-all uppercase text-sm tracking-[0.2em] mt-6 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                   <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Execute Login</span>
                    <Zap size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center opacity-30">
              <p className="text-[8px] font-black text-white uppercase tracking-[0.5em]">
                Protocol v4.0.2 • Verified by EduFlowAI
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ambient Neural Network Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <Navbar user={user} />
      {/* FIX: pt-32 add kiya taaki content blue header ke piche na chhup jaye */}
      <main className="relative z-0 pb-32 pt-28"> 
        <Routes>
          <Route path="/" element={user.role === 'admin' ? <AdminHome /> : user.role === 'teacher' ? <TeacherHome user={user} /> : <StudentHome user={user} />} />
          <Route path="/dashboard" element={user.role === 'admin' ? <AdminHome /> : user.role === 'teacher' ? <TeacherHome user={user} /> : <StudentHome user={user} />} />
          <Route path="/timetable" element={user.role === 'teacher' ? <TeacherSchedule user={user} /> : <Timetable user={user} />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/fees" element={<AdminFees />} />
          <Route path="/assignments" element={<StudentAssignments user={user} />} />
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
          <Route path="/teacher/grade/:assignmentId" element={<TeacherGrading />} />
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