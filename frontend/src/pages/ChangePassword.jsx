import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleUpdate = async (e) => {
        e.preventDefault();

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

            setToast({ show: true, message: "Password changed successfully! 🛡️", type: 'success' });

            setTimeout(() => {
                navigate('/settings', { replace: true });
            }, 2000);

        } catch (err) {
            setToast({
                show: true,
                message: err.response?.data?.message || "Rotation failed",
                type: 'error'
            });
            setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            {/* Top Header Section */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-lg relative overflow-hidden">

                <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

                {/* 👇 YAHI MAIN CHANGE HAI */}
                <div className="flex items-start gap-4 relative z-10">

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 p-2.5 rounded-xl border border-white/30 text-white active:scale-90 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-black italic tracking-tight capitalize">
                            Security
                        </h1>
                        <p className="text-[15px] font-bold text-white/80 tracking-widest mt-1 capitalize">
                            Change security password
                        </p>
                    </div>

                </div>

                <ShieldCheck className="absolute -right-10 top-10 text-white/10" size={200} />
            </div>

            <div className="px-5 -mt-12 relative z-20">
                <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[3rem] shadow-xl border border-[#DDE3EA] space-y-6">

                    {/* CURRENT PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Current password</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-5 text-slate-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showOld ? "text" : "password"}
                                placeholder="Enter current password"
                                className="w-full bg-slate-50 py-5 pl-14 pr-14 rounded-3xl border border-slate-100 font-bold text-[15px] text-slate-700 outline-none focus:border-[#42A5F5] focus:bg-white transition-all italic"
                                value={passwords.old}
                                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-5 top-5 text-black/40 hover:text-[#42A5F5] transition-colors"
                            >
                                {showOld ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* NEW PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">New password</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-5 text-slate-400">
                                <Zap size={20} />
                            </div>
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                className="w-full bg-slate-50 py-5 pl-14 pr-14 rounded-3xl border border-slate-100 font-bold text-[15px] text-slate-700 outline-none focus:border-[#42A5F5] focus:bg-white transition-all italic"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-5 top-5 text-black/40 hover:text-[#42A5F5] transition-colors"
                            >
                                {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM NEW PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Confirm new password</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-5 text-slate-400">
                                <ShieldCheck size={22} />
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="w-full bg-slate-50 py-5 pl-14 pr-14 rounded-3xl border border-slate-100 font-bold text-[15px] text-slate-700 outline-none focus:border-[#42A5F5] focus:bg-white transition-all italic"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-5 top-5 text-black/40 hover:text-[#42A5F5] transition-colors"
                            >
                                {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#42A5F5] text-white py-6 rounded-[2rem] font-black text-[18px] shadow-lg shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:bg-slate-200 italic capitalize">
                        {loading ? "Transmitting..." : "Update password"}
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
                        className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl font-black text-[13px] shadow-2xl flex items-center gap-3 italic ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                    >
                        {toast.type === 'success' ? <ShieldCheck size={18} /> : <Zap size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChangePassword;