import React, { useState, useEffect } from 'react';
import { Wallet, Users, AlertCircle, Clock, IndianRupee, Activity, TrendingUp, Plus, ArrowRight } from 'lucide-react';
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
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Dono requests ko ek saath bhej rahe hain
                const [statsRes, penaltyRes] = await Promise.all([
                    API.get('/users/finance/stats'),
                    API.get('/fees/settings/penalty')
                ]);

                // Dono ka data merge karke ek hi baar state set kar rahe hain
                setStats({
                    ...statsRes.data,
                    penaltySettings: penaltyRes.data
                });
            } catch (err) {
                console.error("Stats Error:", err);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Today's Collection", value: stats.collectedToday, icon: <Wallet className="text-cyan-400" />, color: "border-cyan-400/20", path: '/finance/add-payment' },
        { label: "Monthly Collection", value: stats.collectedMonth, icon: <TrendingUp className="text-neon" />, color: "border-neon/20", path: '/finance/fees' },
        { label: "Installment Tracker", value: stats.totalPending, icon: <AlertCircle className="text-rose-500" />, color: "border-rose-500/20", path: '/finance/installments' }, // <--- DAY 93: Yahan Tracker ka rasta hai
        { label: "Pending Student", value: stats.pendingStudentsCount, icon: <Users className="text-orange-400" />, color: "border-orange-500/20", path: '/finance/pending' }, // <--- Path badal kar /pending kar diya
    ];


    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24">
            <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-neon underline decoration-neon/20">Finance Node</h1>
                    <p className="text-[10px] text-white/20 uppercase font-black mt-1 tracking-widest leading-none italic">
                        Accountant: {user?.name}
                    </p>
                </div>
                {/* Plus button ab header mein right side mein rahega */}
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
                            onClick={() => navigate(card.path)} // <--- Ab ye card ke hisab se sahi page par bhejega
                            className={`p-6 bg-slate-900/80 rounded-[2.5rem] border ${card.color} shadow-2xl active:scale-95 transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{card.icon}</div>
                            <h3 className="text-xl font-black tracking-tighter">₹{card.value.toLocaleString()}</h3>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">{card.label}</p>
                            <ArrowRight size={12} className="absolute bottom-6 right-6 text-white/10 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    ))}
                </div>
                {/* --- DAY 95: PENALTY CONTROL PANEL --- */}
                <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Penalty Protocol</h3>
                            <p className="text-[8px] text-white/20 italic">Automated Late Fee Calculation</p>
                        </div>
                        {/* Toggle Switch */}
                        <button
                            onClick={async () => {
                                const newStatus = !stats.penaltySettings?.isActive;
                                await API.post('/fees/settings/penalty', {
                                    dailyRate: stats.penaltySettings?.dailyRate || 0,
                                    isActive: newStatus
                                });
                                window.location.reload(); // Refresh to sync
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
                                            const val = Number(e.target.value); // Number mein convert karo
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
                        {/* DAY 92: Clickable list items to view receipt */}
                        {stats.recentPayments.length > 0 ? stats.recentPayments.map((p, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/finance/receipt/${p._id}`)} // Receipt page par bhejne ke liye
                                className="bg-void/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all cursor-pointer shadow-lg active:scale-95"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase text-white leading-none group-hover:text-cyan-400 transition-colors">{p.studentName}</p>
                                        <span className="text-[7px] bg-white/5 px-2 py-0.5 rounded-full text-white/40 font-black">VIEW RECEIPT</span>
                                    </div>
                                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest mt-1 italic group-hover:text-white/40">{p.grade} • {p.date}</p>
                                </div>
                                <span className="text-xs font-black text-neon group-hover:scale-110 transition-transform">₹{p.amount}</span>
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