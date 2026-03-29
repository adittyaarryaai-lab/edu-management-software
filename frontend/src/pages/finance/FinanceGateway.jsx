import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Save, Eye, CheckCircle, Smartphone, User, Hash, Edit3, X, Zap, Activity, Database, Layers, Phone, UserCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FinanceGateway = () => {
    const [settings, setSettings] = useState({ upiId: '', merchantName: '' });
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState(""); // Toast text ke liye
    const [resolvedSignals, setResolvedSignals] = useState([]);
    const [selectedSignal, setSelectedSignal] = useState(null); // Selected screenshot detail



    const formRef = useRef(null);

    const loadTerminal = async () => {
        try {
            setLoading(true);
            const { data: config } = await API.get('/fees/settings/penalty');
            if (config.paymentSettings) {
                setSettings({
                    upiId: config.paymentSettings.upiId || '',
                    merchantName: config.paymentSettings.merchantName || ''
                });
            }

            // Data separation handle karo
            const { data } = await API.get('/fees/audit/pending-verifications');
            setPendingVerifications(data.pending || []);
            setResolvedSignals(data.resolved || []);
        } catch (err) { console.error("Sync Error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadTerminal(); }, []);

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await API.post('/fees/settings/gateway', settings);
            setShowToast(true);
            setIsEditing(false);
            setTimeout(() => setShowToast(false), 3000);
            loadTerminal();
        } catch (err) { console.error("Update Failed"); }
    };

    // --- DAY 131: HANDLE AUDIT ACTIONS (APPROVE/REJECT) ---
    const handleAuditAction = async (feeId, action) => {
        try {
            const route = action === 'verify' ? '/fees/audit/verify-payment' : '/fees/audit/reject-payment';
            const { data } = await API.post(route, { feeId });

            if (data.success) {
                // Dynamic message based on action
                setToastMsg(action === 'verify' ? "Payment Verified: Fees Updated" : "Payment Rejected: Fees Still Pending");
                setShowToast(true);
                setSelectedSignal(null);

                // Fix: 5 second baad toast hatana
                setTimeout(() => setShowToast(false), 5000);
                loadTerminal(); // Refresh list to show status change
            }
        } catch (err) {
            alert("Action Failed: Check Neural Link");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-void flex flex-col items-center justify-center gap-4 italic font-black uppercase tracking-widest text-[10px] text-neon animate-pulse">
            <div className="w-12 h-12 border-4 border-neon/20 border-t-neon rounded-full animate-spin"></div>
            Loading Finance Gateway...
        </div>
    );

    return (
        <div className="min-h-screen bg-void p-4 md:p-8 italic text-white pb-32 relative overflow-hidden font-sans">

            {/* --- MODAL: SCREENSHOT PREVIEW --- */}
            <AnimatePresence>
                {selectedSignal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/80"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                        >
                            <button onClick={() => setSelectedSignal(null)} className="absolute top-6 right-6 z-[11] p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>

                            {/* Image Section */}
                            <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 overflow-auto">
                                <img
                                    src={`http://localhost:5000${selectedSignal.paymentScreenshot}`}
                                    className="max-w-full max-h-full object-contain rounded-2xl"
                                    alt="Payment Evidence"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/3 p-8 border-t md:border-t-0 md:border-l border-white/5 space-y-6 overflow-y-auto">
                                <h3 className="text-sm font-black text-neon uppercase tracking-[0.2em] border-b border-neon/20 pb-4">Payment <br /> Verification</h3>

                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-2xl">
                                        <p className="text-[8px] text-white/20 uppercase font-black mb-1 italic">Student Identity</p>
                                        <p className="text-xs font-black uppercase text-white truncate">{selectedSignal.student?.name}</p>
                                        <p className="text-[9px] font-bold text-white/40 mt-1 uppercase tracking-widest">{selectedSignal.student?.grade} • {selectedSignal.student?.enrollmentNo}</p>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-2xl border border-neon/10">
                                        <p className="text-[8px] text-neon/40 uppercase font-black mb-1 italic">Parent Details</p>
                                        <p className="text-xs font-black text-white uppercase flex items-center gap-2"><UserCheck size={14} className="text-neon" /> {selectedSignal.student?.fatherName || 'NOT_FOUND'}</p>
                                        <p className="text-xs font-black text-white mt-2 flex items-center gap-2 tracking-widest"><Phone size={12} className="text-neon" /> {selectedSignal.student?.phone || 'NO_SIGNAL'}</p>
                                    </div>

                                    <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 text-center">
                                        <p className="text-[8px] text-rose-500 uppercase font-black mb-1 italic tracking-widest">Paid Amount</p>
                                        <p className="text-3xl font-black italic tracking-tighter">₹{selectedSignal.amountPaid?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    {/* Approve Button */}
                                    <button
                                        onClick={() => handleAuditAction(selectedSignal._id, 'verify')}
                                        className="w-full bg-emerald-500 text-void py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Approve Payment
                                    </button>

                                    {/* Reject Button */}
                                    <button
                                        onClick={() => handleAuditAction(selectedSignal._id, 'reject')}
                                        className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Reject Payment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- NEURAL TOAST --- */}
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-[999] bg-slate-900 border-2 border-neon px-8 py-4 rounded-[2rem] shadow-[0_0_50px_rgba(61,242,224,0.4)] flex items-center gap-4 w-fit"
                    >
                        <div className="p-2 bg-neon rounded-full"><CheckCircle size={14} className="text-void" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white tracking-[0.2em]">
                            {toastMsg || "Protocol Synchronized"}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4 relative z-10">
    <div className="flex items-center gap-5">
        {/* --- BACK NAVIGATION BUTTON --- */}
        <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all active:scale-90 group shadow-lg"
        >
            <ArrowLeft className="text-white/40 group-hover:text-neon transition-colors" size={20} />
        </button>

        <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
                <ShieldCheck className="text-neon animate-pulse" size={32} />
                Finance <span className="text-neon">Terminal</span>
            </h1>
            <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.4em] mt-1 ml-1 italic">EduFlowAi Gateway Controller v1.3.0</p>
        </div>
    </div>

    <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-full border border-white/10 backdrop-blur-sm w-fit">
        <Activity size={14} className="text-neon animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-widest">Protocol 130 Secure</span>
    </div>
</div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 relative z-10">

                {/* --- CREDENTIALS HUB (LEFT) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden backdrop-blur-xl group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12"><Database size={80} /></div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-neon rounded-full animate-ping"></div>
                                <h2 className="text-[10px] font-black text-neon uppercase tracking-[0.3em]">Active UPI Details</h2>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-3 rounded-2xl border transition-all active:scale-90 ${isEditing ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-neon/10 border-neon/20 text-neon shadow-[0_0_20px_rgba(61,242,224,0.2)]'}`}
                            >
                                {isEditing ? <X size={20} /> : <Edit3 size={20} />}
                            </button>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div className="p-5 rounded-[1.5rem] bg-void/60 border border-white/5">
                                <p className="text-[8px] uppercase text-white/20 font-black mb-1 tracking-widest italic">UPI ID</p>
                                <p className="text-xs font-black text-white tracking-widest uppercase break-all italic">{settings.upiId || 'NOT_CONFIGURED'}</p>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-void/60 border border-white/5">
                                <p className="text-[8px] uppercase text-white/20 font-black mb-1 tracking-widest italic">Receiver Name</p>
                                <p className="text-xs font-black text-white uppercase truncate italic">{settings.merchantName || 'NOT_CONFIGURED'}</p>
                            </div>
                        </div>
                    </div>

                    {/* --- DYNAMIC PROTOCOL EDITOR --- */}
                    <AnimatePresence>
                        {isEditing && (
                            <motion.form
                                ref={formRef} initial={{ height: 0, opacity: 0, scale: 0.95 }} animate={{ height: 'auto', opacity: 1, scale: 1 }} exit={{ height: 0, opacity: 0, scale: 0.95 }}
                                onSubmit={handleUpdateSettings} className="bg-slate-900 border-2 border-neon/30 p-8 rounded-[3rem] space-y-6 overflow-hidden shadow-2xl backdrop-blur-2xl"
                            >
                                <h2 className="text-[11px] font-black text-neon uppercase tracking-[0.3em] mb-2 flex items-center gap-2 italic"><Zap size={14} className="fill-neon" /> Modify UPI Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-white/30 uppercase ml-2 italic tracking-widest">New UPI ID</label>
                                        <input className="w-full bg-void p-5 rounded-2xl border border-white/10 mt-1 font-black text-neon outline-none focus:border-neon transition-all text-xs"
                                            value={settings.upiId} onChange={e => setSettings({ ...settings, upiId: e.target.value })} placeholder="school@upi" required />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-white/30 uppercase ml-2 italic tracking-widest">New Receiver Name</label>
                                        <input className="w-full bg-void p-5 rounded-2xl border border-white/10 mt-1 font-black text-white outline-none focus:border-neon transition-all text-xs"
                                            value={settings.merchantName} onChange={e => setSettings({ ...settings, merchantName: e.target.value })} placeholder="Institution Name" required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-neon text-void py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all italic">
                                    Change Details
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- AUDIT FEED (RIGHT) --- */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 p-8 md:p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-md min-h-[500px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-lg font-black text-rose-500 uppercase tracking-[0.2em] italic underline decoration-rose-500/20">Activity Log</h2>
                                <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.4em] mt-1 italic">Payment Screenshots</p>
                            </div>
                            <div className="bg-rose-500/10 px-6 py-2.5 rounded-full border border-rose-500/20 flex items-center gap-3">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{pendingVerifications.length} Pending Payment</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {pendingVerifications.length > 0 ? pendingVerifications.map((item, i) => (
                                <motion.div
                                    initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                                    key={i} onClick={() => setSelectedSignal(item)}
                                    className="bg-void/40 p-6 rounded-[2.5rem] border border-white/5 flex justify-between items-center group hover:border-neon hover:bg-neon/5 transition-all shadow-xl cursor-pointer"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-neon group-hover:text-void transition-all duration-500">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase text-white leading-none tracking-tighter group-hover:text-neon transition-colors italic">{item.student?.name}</p>
                                            <div className="flex items-center gap-4 mt-2 text-[8px] text-white/30 uppercase font-black tracking-widest italic">
                                                <span className="flex items-center gap-1"><Layers size={10} /> {item.student?.grade}</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                                <span className="flex items-center gap-1 text-neon/40"><UserCheck size={10} /> {item.student?.fatherName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform">
                                                ₹{item.amountPaid?.toLocaleString()}
                                            </p>

                                            {/* Status Badge - Dynamic Colors */}
                                            <div className={`mt-1 text-[7px] font-black uppercase px-2 py-0.5 rounded-full w-fit ml-auto italic ${item.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-amber-500/20 text-amber-500'
                                                }`}>
                                                {item.status || 'Pending'}
                                            </div>

                                            <p className="text-[7px] text-white/20 uppercase font-black tracking-widest mt-1 italic group-hover:text-neon transition-all flex items-center justify-end gap-1">
                                                <Phone size={8} /> {item.student?.phone}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-neon/10 text-neon rounded-2xl border border-neon/20 group-hover:bg-neon group-hover:text-void transition-all shadow-lg active:scale-90">
                                            <Eye size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-32 opacity-10 italic">
                                    <Zap size={60} className="mb-6 animate-bounce" />
                                    <p className="text-xs font-black uppercase tracking-[0.8em]">Payments</p>
                                </div>
                            )}
                        </div>
                    </div>
                {/* --- AUDIT HISTORY BOX (UPDATED LOCATION & SIZE) --- */}
                <div className="lg:col-span-2 mt-8 bg-slate-900/40 p-8 md:p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Database size={18} className="text-neon opacity-50" />
                            <h2 className="text-lg font-black text-white/40 uppercase tracking-[0.2em] italic">Online Payment History</h2>
                        </div>
                        <span className="text-[7px] bg-white/5 px-4 py-1.5 rounded-full text-white/30 uppercase font-black tracking-widest border border-white/5">v1.3.0</span>
                    </div>

                    <div className="space-y-3">
                        {resolvedSignals.length > 0 ? resolvedSignals.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                key={i} onClick={() => setSelectedSignal(item)}
                                className="bg-void/30 p-5 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-neon/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl shadow-inner ${item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.status === 'Verified' ? <CheckCircle size={20} /> : <X size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase text-white leading-none tracking-tight group-hover:text-neon transition-colors">{item.student?.name}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[7px] text-white/20 uppercase font-bold tracking-tighter italic">Ref: {item._id.slice(-8).toUpperCase()}</span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                            <span className="text-[7px] text-white/20 uppercase font-bold tracking-tighter italic">{item.student?.grade}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white/60 italic tracking-tighter">₹{item.amountPaid?.toLocaleString()}</p>
                                        <p className={`text-[6px] font-black uppercase mt-0.5 tracking-widest ${item.status === 'Verified' ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {item.status === 'Verified' ? 'Signal Confirmed' : 'Signal Rejected'}
                                        </p>
                                    </div>
                                    <div className="p-3.5 bg-white/5 text-white/10 rounded-2xl group-hover:text-neon group-hover:bg-neon/10 group-hover:border-neon/20 border border-transparent transition-all">
                                        <Edit3 size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-16 opacity-10">
                                <Zap size={30} className="mb-3" />
                                <p className="text-[9px] uppercase font-black tracking-[0.4em]">None</p>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceGateway;