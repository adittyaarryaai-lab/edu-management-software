import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Animation ke liye
import { Bot, Cpu, Zap, ShieldCheck, X } from 'lucide-react'; // Robot icons
import API from './api';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import StudentHome from './pages/StudentHome';
import AttendanceDetails from './pages/AttendanceDetails';
import Timetable from './pages/Timetable';
// import Fees from './pages/Fees';
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
// import AdminFees from './pages/AdminFees';
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
import AdminEditTimetable from './pages/AdminEditTimetable';
import StudentDetail from './pages/StudentDetail'; // Day 87: New Deep Analytics Page

import FinanceDashboard from './pages/finance/FinanceDashboard';
import StudentsFees from './pages/finance/StudentsFees';
import AddPayment from './pages/finance/AddPayment';

// Day 64: SuperAdmin Module Imports
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminOnboard from './pages/SuperAdminOnboard';
import SuperAdminAccount from './pages/SuperAdminAccount';

// DAY 76: Theme Integration
import { useTheme } from './context/ThemeContext';
// --- NEURAL VISUAL MATRIX COMPONENT ---
const VisualMatrix = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-neon font-mono text-[10px] whitespace-nowrap animate-matrix italic"
          style={{
            left: `${i * 5}%`,
            '--duration': `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          {Array(20).fill('01NEURAL_DATA_FLOW_').join('')}
        </div>
      ))}
    </div>
  );
};;

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); // Password visibility toggle ke liye
  const [showBypass, setShowBypass] = useState(false);
  const [bypassStep, setBypassStep] = useState(1); // 1: Email Input, 2: OTP & New Password
  const [bypassData, setBypassData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, isMatrixActive } = useTheme();

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
      } else if (data.role === 'finance') {
        navigate("/finance/dashboard"); // <--- DAY 88: Accountant Redirect
      } else {
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login Failed! Check your credentials.");
    }
  };
  const handleSendOTP = async () => {
    try {
      await API.post('/auth/send-otp', { email: bypassData.email });
      setBypassStep(2);
      alert("OTP Transmitted to your registered signal! 📡");
    } catch (err) { alert(err.response?.data?.message || "Transmission Failed"); }
  };

  const handleResetFinal = async () => {
    if (bypassData.newPassword !== bypassData.confirmPassword) return alert("Ciphers do not match!");
    try {
      await API.post('/auth/reset-password', bypassData);
      alert("Protocol Resynchronized! Login with your new cipher.");
      setShowBypass(false);
      setBypassStep(1);
      setBypassData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) { alert(err.response?.data?.message || "Reset Failed"); }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-[#0B0F14]">
        {isMatrixActive && <VisualMatrix />}
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
            {/* Invisible inputs to trap browser auto-fill */}
            <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex="-1" />
            <input type="password" name="prevent_autofill_pass" style={{ display: 'none' }} tabIndex="-1" />

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
                  type={showPass ? "text" : "password"} // Dynamic type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS ENCRYPTION CIPHER"
                  className="w-full bg-[#0B0F14]/80 border border-white/5 py-5 px-8 rounded-[2rem] outline-none text-white placeholder:text-white/20 focus:border-[#3DF2E0] transition-all font-black text-xs tracking-widest italic pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#3DF2E0]/40 hover:text-[#3DF2E0]"
                >
                  {showPass ? <Zap size={18} /> : <Bot size={18} />} {/* Yahan tu Eye icon bhi use kar sakta hai */}
                </button>
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-[#3DF2E0]/40">
                  <ShieldCheck size={14} className="animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Quantum Secured Node</span>
                </div>
                <button type="button" onClick={() => setShowBypass(true)} className="text-[8px] font-black text-[#3DF2E0]/40 uppercase tracking-[0.2em] hover:text-[#3DF2E0] transition-colors italic underline decoration-[#3DF2E0]/20">Bypass Protocol?</button>
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
        {/* --- BYPASS MODAL --- */}
        <AnimatePresence>
          {showBypass && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0B0F14]/95 flex items-center justify-center p-6 backdrop-blur-md italic"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white/5 border border-[#3DF2E0]/20 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button onClick={() => { setShowBypass(false); setBypassStep(1) }} className="absolute top-6 right-6 text-[#3DF2E0]/40 hover:text-[#3DF2E0] transition-all">
                  <X size={20} />
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-[#3DF2E0]" size={20} />
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Neural Bypass</h3>
                </div>

                {bypassStep === 1 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-4">Enter linked email to receive signal</p>
                    <input type="email" placeholder="IDENTITY EMAIL" className="w-full bg-[#0B0F14] p-5 rounded-2xl border border-white/5 text-xs text-white outline-none focus:border-[#3DF2E0] italic font-black"
                      onChange={(e) => setBypassData({ ...bypassData, email: e.target.value })} />
                    <button onClick={handleSendOTP} className="w-full bg-[#3DF2E0] text-[#0B0F14] py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(61,242,224,0.4)] transition-all">Request OTP</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] text-[#3DF2E0] uppercase font-black tracking-widest mb-4">OTP Transmitted • Verify Identity</p>
                    <input type="text" name="otp_code" autoComplete="one-time-code" placeholder="6-DIGIT OTP" className="w-full bg-[#0B0F14] p-5 rounded-2xl border border-white/5 text-xs text-white outline-none focus:border-[#3DF2E0] font-black"
                      value={bypassData.otp} onChange={(e) => setBypassData({ ...bypassData, otp: e.target.value })} />
                    <input type={showPass ? "text" : "password"} placeholder="NEW ACCESS CIPHER" className="w-full bg-[#0B0F14] p-5 rounded-2xl border border-white/5 text-xs text-white outline-none focus:border-[#3DF2E0] font-black pr-14"
                      value={bypassData.newPassword} onChange={(e) => setBypassData({ ...bypassData, newPassword: e.target.value })} />
                    <input type="password" placeholder="CONFIRM CIPHER" className="w-full bg-[#0B0F14] p-5 rounded-2xl border border-white/5 text-xs text-white outline-none focus:border-[#3DF2E0] font-black"
                      onChange={(e) => setBypassData({ ...bypassData, confirmPassword: e.target.value })} />
                    <button onClick={handleResetFinal} className="w-full bg-[#3DF2E0] text-[#0B0F14] py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(61,242,224,0.4)] transition-all">Re-Sync Identity</button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Neural Network Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#3DF2E0] rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000 opacity-20"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${isDarkMode ? 'bg-[#0B0F14]' : 'bg-void'}`}>
      {isDarkMode && isMatrixActive && <VisualMatrix />}
      <Navbar user={user} />
      <main className="relative z-0 pb-32 pt-28">
        <Routes>
          {/* Main Dashboard Logic based on Role */}
          <Route path="/" element={
            user.role === 'superadmin' ? <SuperAdminDashboard /> :
              user.role === 'admin' ? <AdminHome /> :
                user.role === 'finance' ? <FinanceDashboard /> :
                  user.role === 'teacher' ? <TeacherHome user={user} /> :
                    <StudentHome user={user} />
          } />
          <Route path="/dashboard" element={
            user.role === 'superadmin' ? <SuperAdminDashboard /> :
              user.role === 'admin' ? <AdminHome /> :
                user.role === 'finance' ? <FinanceDashboard /> :
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
          <Route path="/admin/student-report/:studentId" element={<StudentDetail />} /> {/* DAY 87: Deep Profile Route */}
          <Route path="/admin/edit-timetable" element={<AdminEditTimetable />} /> {/* Naya Module */}
          {/* <Route path="/admin/fees" element={<AdminFees />} /> */}
          <Route path="/admin/attendance-report" element={<AdminAttendance />} />
          <Route path="/admin/global-notice" element={<AdminGlobalNotice />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />

          {/* Academic & Feature Routes */}
          <Route path="/assignments" element={<StudentAssignments user={user} />} />
          <Route path="/attendance" element={user.role === 'student' ? <StudentAttendance /> : <AttendanceDetails />} />
          {/* <Route path="/fees" element={<Fees user={user} />} /> */}
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

          <Route path="/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/finance/fees" element={<StudentsFees />} />
          <Route path="/finance/add-payment" element={<AddPayment />} />

          {/* User Profile & Security */}
          <Route path="/my-account" element={user.role === 'superadmin' ? <SuperAdminAccount user={user} /> : <MyAccount user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/* SuperAdmin, Admin aur Finance ke liye BottomNav nahi dikhega */}
      {(user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'finance') && <BottomNav />}
    </div>
  );
}

export default App;