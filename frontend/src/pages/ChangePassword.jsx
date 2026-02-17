import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ old: '', new: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put('/auth/change-password', { 
                oldPassword: passwords.old, 
                newPassword: passwords.new 
            });
            alert("Security Key Rotated Successfully! 🛡️");
            navigate('/settings');
        } catch (err) {
            alert(err.response?.data?.message || "Rotation Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-lg relative overflow-hidden">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4 relative z-10"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black uppercase tracking-tight relative z-10">Security Uplink</h1>
                <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.3em] mt-1 relative z-10">Rotate Access Keys</p>
                <ShieldCheck className="absolute -right-4 top-10 opacity-10" size={150} />
            </div>

            <div className="px-5 -mt-10 relative z-20">
                <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-white space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Current Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 py-4 pl-12 pr-4 rounded-2xl border border-slate-100 font-bold outline-none focus:border-blue-500"
                                onChange={(e) => setPasswords({...passwords, old: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">New Encryption Key</label>
                        <div className="relative">
                            <Zap className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 py-4 pl-12 pr-4 rounded-2xl border border-slate-100 font-bold outline-none focus:border-blue-500"
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                        {loading ? "Encrypting..." : "Update Security Protocol"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;