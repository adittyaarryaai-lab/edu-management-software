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
import TeacherNotices from './pages/TeacherNotices'; 
import TeacherSupport from './pages/TeacherSupport'; 
import ChangePassword from './pages/ChangePassword'; 
import TeacherUploadSyllabus from './pages/TeacherUploadSyllabus'; 
import DigitalMaterial from './pages/DigitalMaterial';
import TeacherLiveClass from './pages/TeacherLiveClass'; 
import StudentAttendance from './pages/StudentAttendance';
import AdminAttendance from './pages/AdminAttendance'; 
import AdminGlobalNotice from './pages/AdminGlobalNotice';
import ManageUsers from './pages/ManageUsers';

// Day 64: SuperAdmin Module Imports
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminOnboard from './pages/SuperAdminOnboard';
import SuperAdminAccount from './pages/SuperAdminAccount';

// DAY 76: Theme Integration
import { useTheme } from './context/ThemeContext';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme(); // FIXED: Theme context consume kiya

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
      // Redirect logic for SuperAdmin
      if (data.role === 'superadmin') {
          navigate("/superadmin/dashboard");
      } else {
          navigate("/"); 
      }
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login Failed! Check your credentials.");
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-[#0B0F14]">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0 text-center flex items-center justify-center">
          <img 
            src="/image.png.jpeg" 
            alt="AI Background" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F14] via-[#0B0F14]/80 to-[#3DF2E0]/10 backdrop-blur-[1px]"></div>
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
          <div className="bg-gradient-to-r from-[#3DF2E0] to-cyan-600 p-4 rounded-r-full shadow-[0_0_50px_rgba(61,242,224,0.4)] border-y-4 border-r-4 border-white/10">
            <Bot size={80} className="text-[#0B0F14] animate-pulse" />
          </div>
          {/* Mechanical Arm holding the card */}
          <div className="w-20 h-2 bg-slate-700 shadow-lg border-y border-white/10"></div>
        </motion.div>

        {/* --- LOGIN CARD WITH DRAG ANIMATION --- */}
        <motion.div 
          initial={{ x: "-120%", opacity: 0, rotate: -10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.5, type: "spring", stiffness: 50 }}
          className="relative z-10 w-full max-w-lg px-6"
        >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden group italic">
            
            {/* Animated scanning line effect */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3DF2E0] to-transparent opacity-40 z-0"
            />

            <div className="text-center mb-10 relative z-10">
              <div className="flex justify-center gap-4 mb-4">
                <Cpu className="text-[#3DF2E0] animate-spin-slow" size={30} />
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">EduFlowAi</h2>
                <Zap className="text-[#3DF2E0] animate-bounce" size={30} />
              </div>
              <div className="h-0.5 w-24 bg-[#3DF2E0] mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(61,242,224,1)]"></div>
              <p className="text-[#3DF2E0]/40 font-black uppercase text-[9px] tracking-[0.5em] italic">Neural Biometric Authentication Required</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="PERSONNEL ID / UPLINK EMAIL"
                  className="w-full bg-[#0B0F14]/80 border border-white/5 py-5 px-8 rounded-[2rem] outline-none text-white placeholder:text-white/20 focus:border-[#3DF2E0] focus:bg-[#0B0F14] transition-all font-black text-xs tracking-widest italic"
                  required
                />
              </div>
              
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS ENCRYPTION CIPHER"
                  className="w-full bg-[#0B0F14]/80 border border-white/5 py-5 px-8 rounded-[2rem] outline-none text-white placeholder:text-white/20 focus:border-[#3DF2E0] focus:bg-[#0B0F14] transition-all font-black text-xs tracking-widest italic"
                  required
                />
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-[#3DF2E0]/40">
                  <ShieldCheck size={14} className="animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Quantum Secured Node</span>
                </div>
                <button type="button" className="text-[8px] font-black text-[#3DF2E0]/40 uppercase tracking-[0.2em] hover:text-[#3DF2E0] transition-colors italic underline decoration-[#3DF2E0]/20">Bypass Protocol?</button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#3DF2E0] hover:bg-cyan-400 text-[#0B0F14] py-6 rounded-[2rem] font-black shadow-[0_0_40px_rgba(61,242,224,0.3)] active:scale-95 transition-all uppercase text-sm tracking-[0.3em] mt-6 flex items-center justify-center gap-4 group italic"
              >
                {loading ? (
                   <span className="w-6 h-6 border-3 border-[#0B0F14]/30 border-t-[#0B0F14] rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Execute Session</span>
                    <Zap size={18} className="fill-[#0B0F14]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center opacity-20">
              <p className="text-[7px] font-black text-white uppercase tracking-[0.6em] italic">
                PROTOCOL v4.0.5 • VERIFIED BY EDUFLOW INTELLIGENCE
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ambient Neural Network Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#3DF2E0] rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000 opacity-20"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${isDarkMode ? 'bg-[#0B0F14]' : 'bg-void'}`}>
      <Navbar user={user} />
      <main className="relative z-0 pb-32 pt-28"> 
        <Routes>
          {/* Main Dashboard Logic based on Role */}
          <Route path="/" element={
            user.role === 'superadmin' ? <SuperAdminDashboard /> : 
            user.role === 'admin' ? <AdminHome /> : 
            user.role === 'teacher' ? <TeacherHome user={user} /> : 
            <StudentHome user={user} />
          } />
          <Route path="/dashboard" element={
            user.role === 'superadmin' ? <SuperAdminDashboard /> : 
            user.role === 'admin' ? <AdminHome /> : 
            user.role === 'teacher' ? <TeacherHome user={user} /> : 
            <StudentHome user={user} />
          } />

          {/* SuperAdmin Specific Routes - Day 64 */}
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/onboard" element={<SuperAdminOnboard />} />
          <Route path="/superadmin/account" element={<SuperAdminAccount user={user} />} />

          {/* Timetable & Admin Management */}
          <Route path="/timetable" element={user.role === 'teacher' ? <TeacherSchedule user={user} /> : <Timetable user={user} />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/fees" element={<AdminFees />} />
          <Route path="/admin/attendance-report" element={<AdminAttendance />} /> 
          <Route path="/admin/global-notice" element={<AdminGlobalNotice />} /> 
          <Route path="/admin/manage-users" element={<ManageUsers />} /> 

          {/* Academic & Feature Routes */}
          <Route path="/assignments" element={<StudentAssignments user={user} />} />
          <Route path="/attendance" element={user.role === 'student' ? <StudentAttendance /> : <AttendanceDetails />} />
          <Route path="/fees" element={<Fees user={user} />} />
          <Route path="/notices" element={<Notifications />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notice-feed" element={<NoticeFeed />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/id-card" element={<IDCard user={user} />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/digital" element={<DigitalMaterial />} /> 
          <Route path="/live-class" element={<LiveClass user={user} />} />
          
          <Route path="/feedback" element={<Feedback />} />
          
          <Route path="/requests" element={<Requests />} />
          <Route path="/mentors" element={<Mentorship />} />
          <Route path="/syllabus" element={<Syllabus user={user} />} /> 

          {/* Teacher Specific Routes */}
          <Route path="/teacher/attendance" element={<TeacherAttendance user={user} />} />
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/grade/:assignmentId" element={<TeacherGrading />} />
          <Route path="/teacher/notices" element={<TeacherNotices />} /> 
          <Route path="/teacher/support" element={<TeacherSupport />} />
          <Route path="/teacher/upload-syllabus" element={<TeacherUploadSyllabus />} />
          <Route path="/teacher/live-class" element={<TeacherLiveClass />} />

          {/* User Profile & Security */}
          <Route path="/my-account" element={user.role === 'superadmin' ? <SuperAdminAccount user={user} /> : <MyAccount user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/change-password" element={<ChangePassword />} /> 

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/* SuperAdmin aur Admin ke liye BottomNav aksar nahi hota, logic check */}
      {(user.role !== 'admin' && user.role !== 'superadmin') && <BottomNav />}
    </div>
  );
}

export default App;