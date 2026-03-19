import React, { useState, useEffect } from 'react';
import { Wallet, Users, AlertCircle, Clock, IndianRupee, TrendingUp, Plus, ArrowRight, Bell, Zap, CheckCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FinanceDashboard = () => {
    const [stats, setStats] = useState({
        collectedToday: 0,
        collectedMonth: 0,
        totalPending: 0,
        pendingStudentsCount: 0,
        penaltySettings: { dailyRate: 0, isActive: false },
        recentPayments: []
    });
    
    // --- DAY 112: NEW PAYMENT ALERT STATE ---
    const [newPaymentAlert, setNewPaymentAlert] = useState(null);
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchStats = async () => {
        try {
            const [statsRes, penaltyRes] = await Promise.all([
                API.get('/users/finance/stats'),
                API.get('/fees/settings/penalty')
            ]);

            const freshData = statsRes.data;

            // --- STEP 2: NOTIFICATION TRIGGER LOGIC ---
            if (stats.recentPayments.length > 0 && freshData.recentPayments.length > 0) {
                const latestNewId = freshData.recentPayments[0]._id;
                const latestOldId = stats.recentPayments[0]._id;

                if (latestNewId !== latestOldId) {
                    setNewPaymentAlert(freshData.recentPayments[0]);
                    // 7 second baad alert hide karo
                    setTimeout(() => setNewPaymentAlert(null), 7000);
                }
            }

            setStats({
                ...freshData,
                penaltySettings: penaltyRes.data
            });
        } catch (err) {
            console.error("Stats Sync Error:", err);
        }
    };

    useEffect(() => {
        fetchStats(); // Initial Load
        
        // --- STEP 2: REAL-TIME POLLING ---
        const interval = setInterval(fetchStats, 10000); // Har 10 sec mein update
        return () => clearInterval(interval);
    }, [stats.recentPayments]); 

    const statCards = [
        { label: "Today's Collection", value: stats.collectedToday, icon: <Wallet className="text-cyan-400" />, color: "border-cyan-400/20", path: '/finance/add-payment' },
        { label: "Monthly Collection", value: stats.collectedMonth, icon: <TrendingUp className="text-neon" />, color: "border-neon/20", path: '/finance/reports' },
        { label: "Installment Tracker", value: stats.totalPending, icon: <AlertCircle className="text-rose-500" />, color: "border-rose-500/20", path: '/finance/installments' },
        { label: "Pending Student", value: stats.pendingStudentsCount, icon: <Users className="text-orange-400" />, color: "border-orange-500/20", path: '/finance/pending' },
    ];

    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24">
            
            {/* --- STEP 3: FLOATING NOTIFICATION UI --- */}
            <AnimatePresence>
                {newPaymentAlert && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md bg-slate-900/90 border-2 border-neon p-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(34,211,238,0.4)] backdrop-blur-2xl flex items-center gap-4"
                    >
                        <div className="p-3 bg-neon rounded-2xl text-black animate-pulse">
                            <Zap size={20} fill="black" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-neon mb-1">Incoming Online Payment</h4>
                            <p className="text-xs font-black uppercase text-white truncate">{newPaymentAlert.studentName}</p>
                            <p className="text-[8px] text-white/40 uppercase font-bold">{newPaymentAlert.grade} • Received Now</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-white italic">₹{newPaymentAlert.amount.toLocaleString()}</p>
                            <div className="flex items-center justify-end gap-1 text-[7px] text-emerald-400 font-black uppercase">
                                <CheckCircle size={8} /> Verified
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-neon underline decoration-neon/20 italic">Finance Node</h1>
                    <p className="text-[10px] text-white/20 uppercase font-black mt-1 tracking-widest leading-none italic">
                        Accountant: {user?.name}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/finance/add-payment')}
                    className="p-4 bg-cyan-400 text-black rounded-2xl shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-90 transition-all z-30"
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
            </div>

            <div className="px-5 mt-8 space-y-6 relative z-10">
                {/* Analytics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {statCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(card.path)}
                            className={`p-6 bg-slate-900/80 rounded-[2.5rem] border ${card.color} shadow-2xl active:scale-95 transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{card.icon}</div>
                            <h3 className="text-xl font-black tracking-tighter">₹{card.value.toLocaleString()}</h3>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">{card.label}</p>
                            <ArrowRight size={12} className="absolute bottom-6 right-6 text-white/10 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Penalty Protocol Card */}
                <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Penalty Protocol</h3>
                            <p className="text-[8px] text-white/20 italic">Automated Late Fee Calculation</p>
                        </div>
                        <button
                            onClick={async () => {
                                const newStatus = !stats.penaltySettings?.isActive;
                                await API.post('/fees/settings/penalty', {
                                    dailyRate: stats.penaltySettings?.dailyRate || 0,
                                    isActive: newStatus
                                });
                                window.location.reload(); 
                            }}
                            className={`w-12 h-6 rounded-full p-1 transition-all ${stats.penaltySettings?.isActive ? 'bg-neon' : 'bg-white/10'}`}
                        >
                            <div className={`w-4 h-4 bg-void rounded-full transition-all ${stats.penaltySettings?.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {stats.penaltySettings?.isActive && (
                        <div className="flex items-center gap-4 bg-void/40 p-4 rounded-2xl border border-white/5 animate-in fade-in zoom-in duration-300">
                            <div className="bg-neon/10 p-3 rounded-xl text-neon"><AlertCircle size={18} /></div>
                            <div className="flex-1">
                                <p className="text-[8px] font-black text-white/20 uppercase italic">Daily Fine Rate</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black italic">₹</span>
                                    <input
                                        type="number"
                                        defaultValue={stats.penaltySettings?.dailyRate}
                                        onBlur={async (e) => {
                                            const val = Number(e.target.value);
                                            await API.post('/fees/settings/penalty', {
                                                dailyRate: val,
                                                isActive: true
                                            });
                                        }}
                                        className="bg-transparent border-b border-white/10 w-20 outline-none text-lg font-black italic text-neon"
                                    />
                                    <span className="text-[8px] font-bold text-white/20 uppercase italic mt-2">/ per day</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Payments Section */}
                <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock size={16} className="text-neon animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Recent Ledger Stream</h3>
                    </div>

                    <div className="space-y-3">
                        {stats.recentPayments.length > 0 ? stats.recentPayments.map((p, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/finance/receipt/${p._id}`)}
                                className="bg-void/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-neon hover:bg-neon/5 transition-all cursor-pointer shadow-lg active:scale-95"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase text-white leading-none group-hover:text-neon transition-colors italic">{p.studentName}</p>
                                        <span className="text-[6px] bg-white/5 px-2 py-0.5 rounded-full text-white/40 font-black tracking-widest uppercase">
                                            {p.paymentMode || 'CASH'}
                                        </span>
                                    </div>
                                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest mt-1 italic group-hover:text-white/40">
                                        {p.grade} • {p.date} {p.time ? `at ${p.time}` : ''}
                                    </p>
                                </div>
                                <span className="text-xs font-black text-neon group-hover:scale-110 transition-transform italic">₹{p.amount.toLocaleString()}</span>
                            </div>
                        )) : (
                            <div className="py-8 text-center opacity-10 flex flex-col items-center">
                                <IndianRupee size={30} className="mb-2" />
                                <p className="text-[8px] font-black uppercase tracking-widest">No Recent Inflow Detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;