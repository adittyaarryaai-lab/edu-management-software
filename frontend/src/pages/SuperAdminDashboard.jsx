import React, { useState, useEffect } from 'react';
import { Globe, Plus, IndianRupee, ShieldAlert, TrendingUp, Briefcase, Trash2, Edit3, X, Save } from 'lucide-react';
import API from '../api';
import Loader from '../components/Loader';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // FIXED: Added state for Editing Modal
    const [editingSchool, setEditingSchool] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/superadmin/stats');
            setStats(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // FIXED: Handle Edit Logic
    const handleUpdate = async () => {
        try {
            await API.put(`/superadmin/update-school/${editingSchool._id}`, editData);
            setEditingSchool(null);
            fetchStats(); // Data refresh
        } catch (err) { alert("Update Failed"); }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f1f5f9] p-6 font-sans italic">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Executive Hub</h1>
                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Global Product Tracking</p>
                </div>
                <button onClick={() => window.location.href='/superadmin/onboard'} className="bg-blue-600 text-white px-6 py-4 rounded-3xl font-black flex items-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all">
                    <Plus size={20}/> ONBOARD NEW SCHOOL
                </button>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Active Institutions', value: stats?.activeSchools, icon: <Globe />, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Total Revenue Generated', value: `₹${stats?.totalRevenue}`, icon: <IndianRupee />, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'System Load', value: 'Optimal', icon: <TrendingUp />, color: 'text-purple-600', bg: 'bg-purple-100' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl border border-white flex items-center gap-6">
                        <div className={`${s.bg} ${s.color} p-5 rounded-3xl`}>{s.icon}</div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* School List */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white">
                <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tighter">Institution Inventory</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="pb-4">School Details</th>
                                <th className="pb-4">Admin Contact</th>
                                <th className="pb-4">Revenue (Paid)</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats?.schools.map((school, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={school.logo ? `http://localhost:5000${school.logo}` : 'https://via.placeholder.com/50'} 
                                                className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" 
                                                alt="logo"
                                            />
                                            <div>
                                                <p className="font-black text-slate-800 text-sm uppercase italic">{school.schoolName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{school.affiliationNo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <p className="text-xs font-black text-slate-700">{school.adminDetails.fullName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{school.adminDetails.email}</p>
                                    </td>
                                    <td className="py-6 font-black text-sm text-green-600 italic">₹{school.subscription.totalPaid}</td>
                                    <td className="py-6">
                                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${school.subscription.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {school.subscription.status}
                                        </span>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex gap-2">
                                            {/* FIXED: Edit Button added */}
                                            <button 
                                                onClick={() => {setEditingSchool(school); setEditData(school)}}
                                                className="p-3 bg-blue-50 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                            >
                                                <Edit3 size={16}/>
                                            </button>
                                            <button className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FIXED: Edit Modal Overlay */}
            {editingSchool && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black uppercase tracking-tighter text-slate-800">Edit Institution</h3>
                            <button onClick={() => setEditingSchool(null)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <input 
                                className="w-full p-4 bg-slate-50 rounded-2xl border font-bold text-sm outline-none focus:border-blue-500" 
                                value={editData.schoolName}
                                onChange={(e) => setEditData({...editData, schoolName: e.target.value})}
                                placeholder="School Name"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    className="p-4 bg-slate-50 rounded-2xl border font-bold text-sm outline-none" 
                                    value={editData.subscription.totalPaid}
                                    onChange={(e) => setEditData({...editData, subscription: {...editData.subscription, totalPaid: Number(e.target.value)}})}
                                    placeholder="Total Paid"
                                />
                                <select 
                                    className="p-4 bg-slate-50 rounded-2xl border font-bold text-sm outline-none"
                                    value={editData.subscription.status}
                                    onChange={(e) => setEditData({...editData, subscription: {...editData.subscription, status: e.target.value}})}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <button onClick={handleUpdate} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <Save size={18}/> Synchronize Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;