import React, { useState } from 'react';
import { Users, CreditCard, Megaphone, Settings, PlusCircle, LayoutDashboard, Database, X } from 'lucide-react';
import API from '../api';
import Toast from '../components/Toast';

const AdminHome = () => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', employeeId: '', subjects: ''
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

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if(!formData.email || !formData.password) return alert("Please fill mandatory fields");
        
        setLoading(true);
        try {
            const processedData = {
                ...formData,
                subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : []
            };

            const response = await API.post('/users/add-teacher', processedData);
            
            if(response.data) {
                setMsg("Teacher Added Successfully!");
                setShowForm(false);
                setFormData({ name: '', email: '', password: '', employeeId: '', subjects: '' });
            }
        } catch (err) {
            console.error("Full Error:", err.response);
            const errorMsg = err.response?.data?.message || "Server connection failed";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 -mt-10 space-y-6 pb-20">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 grid grid-cols-3 gap-2">
                {adminStats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-slate-100 px-1">
                        <p className="text-[18px] font-black text-slate-800 leading-none">{stat.value}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Administrative Controls</h3>
                {managementModules.map((m, i) => (
                    <div 
                        key={i} 
                        onClick={() => m.id === 'add-staff' && setShowForm(true)}
                        className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${m.color} p-3 rounded-2xl`}>{m.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-none">{m.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{m.desc}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-full text-slate-300">
                             <PlusCircle size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                        <h3 className="font-black text-2xl text-slate-800 mb-2">Add Staff</h3>
                        <div className="space-y-4 mt-6">
                            <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            <input type="text" placeholder="Employee ID" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} />
                            <input type="text" placeholder="Subjects (Comma separated)" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm" value={formData.subjects} onChange={(e) => setFormData({...formData, subjects: e.target.value})} />
                            <button onClick={handleAddTeacher} disabled={loading} className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase shadow-xl disabled:bg-slate-300">
                                {loading ? "Registering..." : "Register Teacher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminHome;