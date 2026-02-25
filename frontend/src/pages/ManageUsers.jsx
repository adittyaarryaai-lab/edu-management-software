import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserCheck, Search, Edit3, Trash2, X, Save, Filter, GraduationCap, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState(null); // 'teachers' or 'students'
    const [selectedGrade, setSelectedGrade] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [msg, setMsg] = useState('');

    // Fetch Teachers
    // ManageUsers.jsx ke andar ye function dhundo aur replace karo:
    const fetchTeachers = async () => {
        setLoading(true);
        setViewMode('teachers');
        try {
            // FIXED: Backend route /teachers hai, /all-teachers nahi
            const { data } = await API.get('/users/teachers');
            setUsersList(data);
        } catch (err) {
            console.error("Teacher fetch error:", err);
        }
        finally { setLoading(false); }
    };

    // Fetch Students by Grade
    // ManageUsers.jsx ke andar ye function dhundo aur replace karo:
    const fetchStudents = async (grade) => {
        if (!grade) return;
        setLoading(true);
        try {
            // FIXED: Backend route /students/:grade hai, /students-by-grade nahi
            const { data } = await API.get(`/users/students/${grade}`);
            setUsersList(data);
        } catch (err) {
            console.error("Student fetch error:", err);
        }
        finally { setLoading(false); }
    };

    // Delete User
    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Terminate this identity from system?")) return;
        try {
            await API.delete(`/users/delete/${id}`);
            setMsg("Identity Purged Successfully! 🗑️");
            setUsersList(usersList.filter(u => u._id !== id));
        } catch (err) { alert("Purge Failed"); }
    };

    // Update User
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/users/update/${editingUser._id}`, editingUser);
            setMsg("Neural Profile Synchronized! ⚡");
            setEditingUser(null);
            viewMode === 'teachers' ? fetchTeachers() : fetchStudents(selectedGrade);
        } catch (err) { alert("Update Failed"); }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon transition-all active:scale-90">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Personnel Manager</h1>
                </div>

                {/* Main Toggle Buttons */}
                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={fetchTeachers}
                        className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${viewMode === 'teachers' ? 'bg-neon text-void border-neon shadow-[0_0_20px_rgba(61,242,224,0.4)]' : 'bg-white/5 text-neon/40 border-white/5'}`}
                    >
                        <UserCheck size={16} className="inline mr-2" /> Teachers
                    </button>
                    <button
                        onClick={() => { setViewMode('students'); setUsersList([]); }}
                        className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${viewMode === 'students' ? 'bg-neon text-void border-neon shadow-[0_0_20px_rgba(61,242,224,0.4)]' : 'bg-white/5 text-neon/40 border-white/5'}`}
                    >
                        <GraduationCap size={16} className="inline mr-2" /> Students
                    </button>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Class Filter for Students */}
                {viewMode === 'students' && (
                    <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] border border-neon/20 flex items-center gap-4 animate-in fade-in">
                        <Filter size={18} className="text-neon/40" />
                        <input
                            type="text"
                            placeholder="ENTER GRADE (e.g. 10-A)"
                            className="bg-transparent border-none outline-none font-black text-xs text-white uppercase w-full"
                            value={selectedGrade}
                            onChange={(e) => { setSelectedGrade(e.target.value); fetchStudents(e.target.value); }}
                        />
                    </div>
                )}

                {/* Users List */}
                <div className="space-y-4">
                    {loading ? <Loader /> : usersList.map((u) => (
                        <div key={u._id} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all">
                            <div className="flex items-center gap-4">
                                <img src={u.avatar} className="w-12 h-12 rounded-2xl border border-neon/20 transition-all" alt="user" />
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase italic tracking-tight">{u.name}</h4>
                                    <p className="text-[9px] font-black text-neon/40 uppercase tracking-widest">
                                        {u.role === 'teacher' ? u.employeeId : u.enrollmentNo} • {u.role === 'teacher' ? u.subjects?.join(', ') : u.grade}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingUser(u)} className="p-3 bg-void border border-white/5 text-neon/40 rounded-xl hover:text-neon transition-all"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(u._id)} className="p-3 bg-void border border-white/5 text-red-500/40 rounded-xl hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT MODAL (THE MASTER FORM) */}
            {/* FULL 13 FIELD EDIT MODAL */}
            {/* EDIT MODAL (THE MASTER FORM) */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                    <div className="bg-slate-900 border border-neon/20 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl relative my-8 italic">
                        <button onClick={() => setEditingUser(null)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-neon/40 hover:text-neon transition-all">
                            <X size={20} />
                        </button>

                        <h3 className="font-black text-xl text-white mb-2 uppercase italic text-center underline decoration-neon/20 tracking-tighter">Re-Configuration Profile</h3>

                        {/* FIXED: PRIMARY IDENTITY BLOCK (Always shows Email at Top) */}
                        <div className="bg-void border border-white/5 p-4 rounded-2xl mb-6 flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="bg-neon/10 p-2 rounded-lg text-neon"><Mail size={16} /></div>
                                <div>
                                    <p className="text-[8px] font-black text-neon/40 uppercase tracking-widest">Network Identity</p>
                                    <p className="text-xs font-black text-white italic">{editingUser.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Sequence ID</p>
                                <p className="text-[10px] font-black text-neon uppercase italic">{editingUser.role === 'teacher' ? editingUser.employeeId : editingUser.enrollmentNo}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Full Name</label>
                                <input type="text" value={editingUser.name} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} placeholder="FULL NAME" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Mobile Signal</label>
                                <input type="text" value={editingUser.phone} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} placeholder="MOBILE SIGNAL" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Father's Name</label>
                                <input type="text" value={editingUser.fatherName} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, fatherName: e.target.value })} placeholder="FATHER'S NAME" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Mother's Name</label>
                                <input type="text" value={editingUser.motherName} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, motherName: e.target.value })} placeholder="MOTHER'S NAME" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] text-neon/40 ml-4 font-black uppercase">Birth Cycle</label>
                                <input type="date" value={editingUser.dob ? editingUser.dob.split('T')[0] : ''} className="p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, dob: e.target.value })} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Gender Node</label>
                                <select value={editingUser.gender} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none appearance-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Religion Cipher</label>
                                <input type="text" value={editingUser.religion} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, religion: e.target.value })} placeholder="RELIGION" />
                            </div>

                            {editingUser.role === 'student' ? (
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Admission No</label>
                                    <input type="text" value={editingUser.admissionNo} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                        onChange={(e) => setEditingUser({ ...editingUser, admissionNo: e.target.value })} placeholder="ADMISSION NO" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Subjects (Comma Sep)</label>
                                        <input type="text" value={editingUser.subjects?.join(', ')} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase outline-none"
                                            onChange={(e) => setEditingUser({ ...editingUser, subjects: e.target.value.split(',').map(s => s.trim()) })} placeholder="SUBJECTS" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-neon/40 ml-4 uppercase text-neon">Assign Attendance Class</label>
                                        <input type="text" value={editingUser.assignedClass || ''} className="w-full p-4 bg-void rounded-2xl border border-neon/20 text-xs text-neon focus:border-neon uppercase outline-none"
                                            onChange={(e) => setEditingUser({ ...editingUser, assignedClass: e.target.value })} placeholder="e.g. 10-A" />
                                    </div>
                                </>
                            )}

                            {/* Address Object */}
                            <div className="md:col-span-2 grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-neon/40 ml-2 uppercase">Pincode</label>
                                    <input type="text" value={editingUser.address?.pincode} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-[10px] text-white focus:border-neon outline-none"
                                        onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, pincode: e.target.value } })} placeholder="PINCODE" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-neon/40 ml-2 uppercase">District</label>
                                    <input type="text" value={editingUser.address?.district} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-[10px] text-white focus:border-neon uppercase outline-none"
                                        onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, district: e.target.value } })} placeholder="DISTRICT" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-neon/40 ml-2 uppercase">State</label>
                                    <input type="text" value={editingUser.address?.state} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-[10px] text-white focus:border-neon uppercase outline-none"
                                        onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, state: e.target.value } })} placeholder="STATE" />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[8px] font-black text-neon/40 ml-4 uppercase">Detailed Permanent Address</label>
                                <textarea value={editingUser.address?.fullAddress} className="w-full p-4 bg-void rounded-2xl border border-white/5 text-xs text-white focus:border-neon uppercase h-20 outline-none"
                                    onChange={(e) => setEditingUser({ ...editingUser, address: { ...editingUser.address, fullAddress: e.target.value } })} placeholder="DETAILED ADDRESS"></textarea>
                            </div>

                            <button type="submit" className="md:col-span-2 w-full bg-neon text-void py-5 rounded-[2rem] font-black text-xs uppercase shadow-[0_0_30px_rgba(61,242,224,0.3)] active:scale-95 transition-all mt-4 italic tracking-widest">
                                COMMIT NEURAL UPDATE
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default ManageUsers;