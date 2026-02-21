import React, { useState, useEffect } from 'react';
import { Globe, Plus, IndianRupee, TrendingUp, Trash2, Edit3, X, Save, RotateCcw, Users, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [editingSchool, setEditingSchool] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const backupUser = JSON.parse(localStorage.getItem('superadmin_backup'));

        if (currentUser?.role !== 'superadmin' && backupUser) {
            localStorage.setItem('user', JSON.stringify(backupUser));
            window.location.reload(); 
        } else {
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/superadmin/stats');
            setStats(data);
        } catch (err) { 
            console.error(err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }
        finally { setLoading(false); }
    };

    const handleUpdate = async () => {
        try {
            await API.put(`/superadmin/update-school/${editingSchool._id}`, editData);
            setEditingSchool(null);
            fetchStats();
        } catch (err) { alert("Update Failed"); }
    };

    const handleGhostLogin = async (schoolId) => {
        try {
            if (!schoolId) return alert("Invalid School Reference");
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('superadmin_backup', JSON.stringify(currentUser));
            const { data } = await API.get(`/superadmin/login-as-school/${schoolId}`);
            if(data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '/dashboard';
            }
        } catch (err) {
            alert(err.response?.data?.message || "Ghost Login Failed!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("CAUTION: Deactivate node? Revenue preserved. Proceed?")) {
            try {
                await API.delete(`/superadmin/delete-school/${id}`);
                fetchStats();
            } catch (err) { alert("Deletion Failed"); }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void p-6 font-sans italic text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Executive Hub</h1>
                    <p className="text-[10px] font-black text-neon/40 tracking-[0.3em] uppercase italic">Global Asset Monitoring</p>
                </div>
                <button onClick={() => navigate('/superadmin/onboard')} className="bg-neon text-void px-6 py-4 rounded-3xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 transition-all uppercase text-[10px] tracking-widest italic">
                    <Plus size={20}/> Onboard New Node
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Active Nodes', value: stats?.activeSchools, icon: <Globe />, color: 'text-neon', bg: 'bg-neon/10' },
                    { label: 'Total Revenue', value: `₹${stats?.totalRevenue}`, icon: <IndianRupee />, color: 'text-neon', bg: 'bg-neon/10' },
                    { label: 'Network Load', value: 'OPTIMAL', icon: <TrendingUp />, color: 'text-neon', bg: 'bg-neon/10' }
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-[3rem] shadow-2xl border border-white/10 flex items-center gap-6 group hover:border-neon/30 transition-all">
                        <div className={`${s.bg} ${s.color} p-5 rounded-3xl border border-neon/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(61,242,224,0.2)] transition-all`}>{s.icon}</div>
                        <div>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">{s.label}</p>
                            <h3 className="text-2xl font-black text-white tracking-tighter italic">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-2xl border border-white/5">
                <h2 className="text-xl font-black text-neon/60 mb-8 uppercase tracking-tighter italic flex items-center gap-3">
                    <Bot size={20} className="animate-pulse" /> Institution Node Inventory
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] border-b border-white/5">
                                <th className="pb-4">Sector Details</th>
                                <th className="pb-4">Admin Node</th>
                                <th className="pb-4">Strength (S/F)</th>
                                <th className="pb-4">Revenue Log</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.schools.map((school, i) => (
                                <tr key={i} className="group hover:bg-neon/5 transition-all cursor-pointer">
                                    <td className="py-6" onClick={() => handleGhostLogin(school._id)}>
                                        <div className="flex items-center gap-4">
                                            <img src={school.logo ? `http://localhost:5000${school.logo}` : 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-2xl object-cover border border-neon/20 shadow-inner grayscale group-hover:grayscale-0 transition-all" alt="logo" />
                                            <div>
                                                <p className="font-black text-white/80 text-sm uppercase italic group-hover:text-neon transition-colors">{school.schoolName}</p>
                                                <p className="text-[9px] text-white/20 font-black tracking-widest uppercase">{school.affiliationNo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6" onClick={() => handleGhostLogin(school._id)}>
                                        <p className="text-xs font-black text-white/70 italic uppercase">{school.adminDetails.fullName}</p>
                                        <p className="text-[9px] text-white/20 font-black italic">{school.adminDetails.email}</p>
                                    </td>
                                    <td className="py-6" onClick={() => handleGhostLogin(school._id)}>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-black text-neon uppercase italic tracking-widest">{school.studentCount || 0} Nodes</span>
                                            <span className="text-[8px] font-black text-white/20 uppercase italic">{school.teacherCount || 0} Faculty</span>
                                        </div>
                                    </td>
                                    <td className="py-6 font-black text-sm text-neon/80 italic tracking-tighter">₹{school.subscription.totalPaid}</td>
                                    <td className="py-6">
                                        <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic ${school.subscription.status === 'Active' ? 'bg-neon/10 text-neon border border-neon/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                                            {school.subscription.status}
                                        </span>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); setEditingSchool(school); setEditData(school); }} className="p-3 bg-void border border-white/5 text-neon/40 rounded-xl hover:text-neon hover:border-neon/30 transition-all shadow-lg"><Edit3 size={16}/></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(school._id); }} className="p-3 bg-void border border-white/5 text-red-500/40 rounded-xl hover:text-red-500 hover:border-red-500/30 transition-all shadow-lg"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingSchool && (
                <div className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-neon/20 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black italic uppercase tracking-tighter text-neon/60">Node Re-Configuration</h3>
                            <button onClick={() => setEditingSchool(null)} className="p-2 bg-void rounded-full text-white/20 hover:text-white transition-colors"><X size={20}/></button>
                        </div>
                        <div className="space-y-6">
                            <input className="w-full p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm outline-none focus:border-neon text-white uppercase" value={editData.schoolName} onChange={(e) => setEditData({...editData, schoolName: e.target.value})} placeholder="School Name" />
                            <div className="grid grid-cols-2 gap-3">
                                <input className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm outline-none focus:border-neon text-white" value={editData.subscription.totalPaid} onChange={(e) => setEditData({...editData, subscription: {...editData.subscription, totalPaid: Number(e.target.value)}})} placeholder="Total Paid" />
                                <select className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm outline-none focus:border-neon text-neon/60 appearance-none uppercase" value={editData.subscription.status} onChange={(e) => setEditData({...editData, subscription: {...editData.subscription, status: e.target.value}})}>
                                    <option value="Active">Active</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <button onClick={handleUpdate} className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.3)] flex items-center justify-center gap-2 italic">
                                <Save size={18}/> Commit Protocol Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;