import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const ChangePassword = () => {
    const navigate = useNavigate();
    // STEP 1: Passwords state mein 'confirm' add kiya
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    
    // STEP 2: Har field ke liye alag visibility state
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleUpdate = async (e) => {
        e.preventDefault();

        // STEP 3: Strict Validation Logic
        if (passwords.new !== passwords.confirm) {
            setToast({ show: true, message: "Passwords do not match! 🛡️", type: 'error' });
            setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
            return;
        }

        setLoading(true);
        try {
            await API.put('/auth/change-password', {
                oldPassword: passwords.old,
                newPassword: passwords.new
            });

            // SUCCESS TOAST
            setToast({ show: true, message: "Password Changed Successfully! 🛡️", type: 'success' });

            // 2 sec delay taaki user message dekh sake
            setTimeout(() => {
                navigate('/settings');
            }, 2000);

        } catch (err) {
            // ERROR TOAST
            setToast({
                show: true,
                message: err.response?.data?.message || "Rotation Failed",
                type: 'error'
            });
            setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Top Header Section */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 relative z-10 border border-white/10 text-neon active:scale-90 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-black uppercase tracking-tighter relative z-10 italic">Security</h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mt-1 relative z-10 italic">Change Security Password</p>
                <ShieldCheck className="absolute -right-10 top-10 text-neon/5 opacity-40" size={200} />
            </div>

            <div className="px-5 -mt-10 relative z-20">
                <form onSubmit={handleUpdate} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neon/20 space-y-6">
                    
                    {/* CURRENT PASSWORD */}
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Current Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-4 text-neon/60" size={18} />
                            <input 
                                type={showOld ? "text" : "password"} 
                                placeholder="type...." 
                                className="w-full bg-void py-4 pl-12 pr-12 rounded-2xl border border-neon/10 font-black text-white outline-none focus:border-neon transition-all"
                                value={passwords.old}
                                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowOld(!showOld)} 
                                className="absolute right-4 top-4 text-neon/40 hover:text-neon transition-colors"
                            >
                                {showOld ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    {/* NEW PASSWORD */}
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">New Password</label>
                        <div className="relative group">
                            <Zap className="absolute left-4 top-4 text-neon/60" size={18} />
                            <input 
                                type={showNew ? "text" : "password"} 
                                placeholder="type...." 
                                className="w-full bg-void py-4 pl-12 pr-12 rounded-2xl border border-neon/10 font-black text-white outline-none focus:border-neon transition-all"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowNew(!showNew)} 
                                className="absolute right-4 top-4 text-neon/40 hover:text-neon transition-colors"
                            >
                                {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM NEW PASSWORD */}
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Confirm New Password</label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-4 text-neon/60" size={18} />
                            <input 
                                type={showConfirm ? "text" : "password"} 
                                placeholder="type...." 
                                className="w-full bg-void py-4 pl-12 pr-12 rounded-2xl border border-neon/10 font-black text-white outline-none focus:border-neon transition-all"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirm(!showConfirm)} 
                                className="absolute right-4 top-4 text-neon/40 hover:text-neon transition-colors"
                            >
                                {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:bg-slate-800 italic">
                        {loading ? "Transmitting..." : "Update Security Cipher..."}
                    </button>
                </form>
            </div>

            {/* --- NEURAL TOAST OVERLAY --- */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 40, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 italic ${toast.type === 'success' ? 'bg-neon text-void' : 'bg-red-500 text-white'}`}
                    >
                        {toast.type === 'success' ? <ShieldCheck size={16} /> : <Zap size={16} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChangePassword;