import React, { useState } from 'react';
import { Users, CreditCard, Megaphone, Settings, PlusCircle, LayoutDashboard, Database, X } from 'lucide-react';
import API from '../api';
import Toast from '../components/Toast';

const AdminHome = () => {
    // Modal States
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(false);
    
    // Loading & Feedback States
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    // Form States
    const [teacherData, setTeacherData] = useState({
        name: '', email: '', password: '', employeeId: '', subjects: ''
    });
    const [studentData, setStudentData] = useState({
        name: '', email: '', password: '', enrollmentNo: '', grade: ''
    });

    const adminStats = [
        { label: 'Total Students', value: '1,240', color: 'text-blue-600' },
        { label: 'Total Teachers', value: '85', color: 'text-purple-600' },
        { label: 'Fees Collected', value: '₹12.5L', color: 'text-green-600' },
    ];

    const managementModules = [
        { id: 'add-student', title: 'Add Student', icon: <PlusCircle size={24}/>, desc: 'Enroll new students', color: 'bg-blue-50 text-blue-500' },
        { id: 'add-staff', title: 'Manage Staff', icon: <Users size={24}/>, desc: 'Assign roles & classes', color: 'bg-purple-50 text-purple-500' },
        { id: 'fees', title: 'Fee Manager', icon: <CreditCard size={24}/>, desc: 'Track pending payments', color: 'bg-green-50 text-green-500' },
        { id: 'notice', title: 'Global Notice', icon: <Megaphone size={24}/>, desc: 'Send alerts to all', color: 'bg-orange-50 text-orange-500' },
    ];

    // Handle Add Teacher
    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if(!teacherData.email || !teacherData.password) return alert("Please fill mandatory fields");
        setLoading(true);
        try {
            const processedData = {
                ...teacherData,
                subjects: teacherData.subjects ? teacherData.subjects.split(',').map(s => s.trim()) : []
            };
            await API.post('/users/add-teacher', processedData);
            setMsg("Teacher Registered Successfully!");
            setShowTeacherForm(false);
            setTeacherData({ name: '', email: '', password: '', employeeId: '', subjects: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Error adding teacher");
        } finally {
            setLoading(false);
        }
    };

    // Handle Add Student
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if(!studentData.email || !studentData.grade) return alert("Please fill mandatory fields");
        setLoading(true);
        try {
            await API.post('/users/add-student', studentData);
            setMsg("Student Enrolled Successfully!");
            setShowStudentForm(false);
            setStudentData({ name: '', email: '', password: '', enrollmentNo: '', grade: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Error adding student");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 -mt-10 space-y-6 pb-24">
            {/* Stats Banner */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 grid grid-cols-3 gap-2">
                {adminStats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-slate-100 px-1">
                        <p className="text-[18px] font-black text-slate-800 leading-none">{stat.value}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Administrative Controls</h3>
                {managementModules.map((m, i) => (
                    <div 
                        key={i} 
                        onClick={() => {
                            if (m.id === 'add-staff') setShowTeacherForm(true);
                            if (m.id === 'add-student') setShowStudentForm(true);
                        }}
                        className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${m.color} p-3 rounded-2xl`}>{m.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-none">{m.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{m.desc}</p>
                            </div>
                        </div>
                        <PlusCircle size={16} className="text-slate-300" />
                    </div>
                ))}
            </div>

            {/* TEACHER MODAL */}
            {showTeacherForm && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                        <button onClick={() => setShowTeacherForm(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                        <h3 className="font-black text-2xl text-slate-800 mb-2">Add Staff</h3>
                        <div className="space-y-4 mt-6">
                            <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={teacherData.name} onChange={(e) => setTeacherData({...teacherData, name: e.target.value})} />
                            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={teacherData.email} onChange={(e) => setTeacherData({...teacherData, email: e.target.value})} />
                            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={teacherData.password} onChange={(e) => setTeacherData({...teacherData, password: e.target.value})} />
                            <input type="text" placeholder="Employee ID" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={teacherData.employeeId} onChange={(e) => setTeacherData({...teacherData, employeeId: e.target.value})} />
                            <input type="text" placeholder="Subjects (Comma separated)" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={teacherData.subjects} onChange={(e) => setTeacherData({...teacherData, subjects: e.target.value})} />
                            <button onClick={handleAddTeacher} disabled={loading} className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase shadow-xl disabled:bg-slate-300">
                                {loading ? "Registering..." : "Register Teacher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STUDENT MODAL */}
            {showStudentForm && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                        <button onClick={() => setShowStudentForm(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                        <h3 className="font-black text-2xl text-slate-800 mb-2">Enroll Student</h3>
                        <div className="space-y-4 mt-6">
                            <input type="text" placeholder="Student Name" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={studentData.name} onChange={(e) => setStudentData({...studentData, name: e.target.value})} />
                            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={studentData.email} onChange={(e) => setStudentData({...studentData, email: e.target.value})} />
                            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={studentData.password} onChange={(e) => setStudentData({...studentData, password: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Enrollment No" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={studentData.enrollmentNo} onChange={(e) => setStudentData({...studentData, enrollmentNo: e.target.value})} />
                                <input type="text" placeholder="Grade (e.g. 10-A)" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={studentData.grade} onChange={(e) => setStudentData({...studentData, grade: e.target.value})} />
                            </div>
                            <button onClick={handleAddStudent} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase shadow-xl disabled:bg-slate-300">
                                {loading ? "Enrolling..." : "Register Student"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* System Status */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <LayoutDashboard size={18} className="text-green-400" />
                        <h3 className="font-bold text-sm">Server Status: Online</h3>
                    </div>
                    <p className="text-[10px] opacity-60 font-medium">Cloud sync active. All administrative modules operational.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 bg-white/5 w-32 h-32 rounded-full"></div>
            </div>

            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminHome;