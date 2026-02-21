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
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 relative z-10 border border-white/10 text-neon"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black uppercase tracking-tighter relative z-10 italic">Security Uplink</h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mt-1 relative z-10 italic">Rotate Encryption Keys</p>
                <ShieldCheck className="absolute -right-10 top-10 text-neon/5 opacity-40" size={200} />
            </div>

            <div className="px-5 -mt-10 relative z-20">
                <form onSubmit={handleUpdate} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-neon/20 space-y-6">
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Current Cipher</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-neon/60" size={18} />
                            <input type="password" placeholder="••••••••" className="w-full bg-void py-4 pl-12 pr-4 rounded-2xl border border-neon/10 font-black text-white outline-none focus:border-neon transition-all"
                                onChange={(e) => setPasswords({...passwords, old: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">New Security Key</label>
                        <div className="relative">
                            <Zap className="absolute left-4 top-4 text-neon/60" size={18} />
                            <input type="password" placeholder="••••••••" className="w-full bg-void py-4 pl-12 pr-4 rounded-2xl border border-neon/10 font-black text-white outline-none focus:border-neon transition-all"
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:bg-slate-800 italic">
                        {loading ? "Transmitting..." : "Initialize Key Rotation"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;