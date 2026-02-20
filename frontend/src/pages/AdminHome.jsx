import React, { useState } from 'react';
import { Users, CreditCard, Megaphone, PlusCircle, LayoutDashboard, Database, X, Bot, Activity, BarChart3, Bell, ClipboardList } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import API from '../api';
import Toast from '../components/Toast';
import { motion } from 'framer-motion';

const AdminHome = () => {
    const navigate = useNavigate(); 
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // Day 71: employeeId aur enrollmentNo state se hta diye (Auto-generated)
    const [teacherData, setTeacherData] = useState({ name: '', email: '', password: '', subjects: '' });
    const [studentData, setStudentData] = useState({ name: '', email: '', password: '', grade: '' });

    const adminStats = [
        { label: 'Total Students', value: '1,240', icon: <Users size={14}/> },
        { label: 'Total Teachers', value: '85', icon: <Bot size={14}/> },
        { label: 'Fees Collected', value: '₹12.5L', icon: <Activity size={14}/> },
    ];

    const managementModules = [
        { id: 'add-student', title: 'Add Student', icon: <PlusCircle size={24}/>, desc: 'Enroll new students', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { id: 'add-staff', title: 'Manage Staff', icon: <Users size={24}/>, desc: 'Assign roles & classes', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { id: 'attendance-report', title: 'Attendance Insights', icon: <BarChart3 size={24}/>, desc: 'Class-wise tracking', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { id: 'fees', title: 'Fee Manager', icon: <CreditCard size={24}/>, desc: 'Track pending payments', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
        { id: 'notice', title: 'Global Notice', icon: <Megaphone size={24}/>, desc: 'Send alerts to all', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
        { id: 'notice-feed', title: 'Notice Archive', icon: <ClipboardList size={24}/>, desc: 'Manage & Delete Notices', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
        { id: 'timetable', title: 'Timetable Master', icon: <Database size={24}/>, desc: 'Schedule all classes', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    ];

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if(!teacherData.email || !teacherData.password) return alert("Please fill mandatory fields");
        setLoading(true);
        try {
            const processedData = { ...teacherData, subjects: teacherData.subjects ? teacherData.subjects.split(',').map(s => s.trim()) : [] };
            const { data } = await API.post('/users/add-teacher', processedData);
            setMsg(data.message || "Teacher Registered Successfully!");
            setShowTeacherForm(false);
            setTeacherData({ name: '', email: '', password: '', subjects: '' });
        } catch (err) { alert(err.response?.data?.message || "Error adding teacher"); } finally { setLoading(false); }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if(!studentData.email || !studentData.grade) return alert("Please fill mandatory fields");
        setLoading(true);
        try {
            const { data } = await API.post('/users/add-student', studentData);
            setMsg(data.message || "Student Enrolled Successfully!");
            setShowStudentForm(false);
            setStudentData({ name: '', email: '', password: '', grade: '' });
        } catch (err) { alert(err.response?.data?.message || "Error adding student"); } finally { setLoading(false); }
    };

    return (
        <div className="px-5 -mt-10 space-y-6 pb-24 relative z-10">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl grid grid-cols-3 gap-2">
                {adminStats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-white/5 px-1">
                        <div className="flex justify-center text-blue-400 mb-1">{stat.icon}</div>
                        <p className="text-[18px] font-black text-white leading-none">{stat.value}</p>
                        <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Administrative Core</h3>
                {managementModules.map((m, i) => (
                    <div key={i} 
                        onClick={() => {
                            if (m.id === 'add-staff') setShowTeacherForm(true);
                            if (m.id === 'add-student') setShowStudentForm(true);
                            if (m.id === 'timetable') navigate('/admin/timetable');
                            if (m.id === 'fees') navigate('/admin/fees');
                            if (m.id === 'attendance-report') navigate('/admin/attendance-report');
                            if (m.id === 'notice') navigate('/admin/global-notice');
                            if (m.id === 'notice-feed') navigate('/notice-feed');
                        }}
                        className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.2rem] border border-white/10 flex items-center justify-between active:scale-95 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${m.color} p-3 rounded-2xl border`}>{m.icon}</div>
                            <div>
                                <h4 className="font-bold text-gray-500 text-sm leading-none">{m.title}</h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-medium italic">{m.desc}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-full"><PlusCircle size={14} className="text-slate-500 group-hover:text-blue-400" /></div>
                    </div>
                ))}
            </div>

            {(showTeacherForm || showStudentForm) && (
                <div className="fixed inset-0 bg-slate-950/80 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-slate-900 border border-white/20 w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                        <button onClick={() => {setShowTeacherForm(false); setShowStudentForm(false)}} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white/50"><X size={20} /></button>
                        <h3 className="font-black text-2xl text-white mb-2">{showTeacherForm ? 'Add Staff' : 'Enroll Student'}</h3>
                        <div className="space-y-4 mt-6">
                            {showTeacherForm ? (
                                <>
                                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-purple-500" value={teacherData.name} onChange={(e) => setTeacherData({...teacherData, name: e.target.value})} />
                                    <input type="email" placeholder="Email" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-purple-500" value={teacherData.email} onChange={(e) => setTeacherData({...teacherData, email: e.target.value})} />
                                    <input type="password" placeholder="Password" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-purple-500" value={teacherData.password} onChange={(e) => setTeacherData({...teacherData, password: e.target.value})} />
                                    {/* employeeId input removed - Backend will auto-generate */}
                                    <input type="text" placeholder="Subjects (Comma separated)" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-purple-500" value={teacherData.subjects} onChange={(e) => setTeacherData({...teacherData, subjects: e.target.value})} />
                                    <button onClick={handleAddTeacher} disabled={loading} className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase shadow-xl disabled:bg-slate-800">
                                        {loading ? "Initializing..." : "Register System User"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="Student Name" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-blue-500" value={studentData.name} onChange={(e) => setStudentData({...studentData, name: e.target.value})} />
                                    <input type="email" placeholder="Email" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-blue-500" value={studentData.email} onChange={(e) => setStudentData({...studentData, email: e.target.value})} />
                                    <input type="password" placeholder="Password" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-blue-500" value={studentData.password} onChange={(e) => setStudentData({...studentData, password: e.target.value})} />
                                    {/* enrollmentNo input removed - Backend will auto-generate */}
                                    <input type="text" placeholder="Grade (10-A)" className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-sm text-white focus:border-blue-500" value={studentData.grade} onChange={(e) => setStudentData({...studentData, grade: e.target.value})} />
                                    <button onClick={handleAddStudent} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase shadow-xl disabled:bg-slate-800">
                                        {loading ? "Processing..." : "Enroll To Network"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-blue-500/20 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Bot size={18} className="text-blue-400" />
                            <h3 className="font-bold text-sm">System: Operational</h3>
                        </div>
                        <p className="text-[10px] opacity-60 font-medium tracking-widest">ENCRYPTED ADMIN SESSION ACTIVE</p>
                    </div>
                    <Activity className="text-blue-500/50 animate-pulse" size={40} />
                </div>
            </div>

            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminHome;