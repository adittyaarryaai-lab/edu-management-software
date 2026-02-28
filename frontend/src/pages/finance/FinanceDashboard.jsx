import React, { useState, useEffect } from 'react';
import { Wallet, Users, AlertCircle, Clock, IndianRupee, Activity, TrendingUp, Plus, ArrowRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FinanceDashboard = () => {
    const [stats, setStats] = useState({
        collectedToday: 0,
        collectedMonth: 0,
        totalPending: 0,
        pendingStudentsCount: 0,
        recentPayments: []
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/users/finance/stats');
                setStats(data);
            } catch (err) { console.error("Stats Error"); }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Today's Collection", value: stats.collectedToday, icon: <Wallet className="text-neon" />, color: "border-neon/20" },
        { label: "Monthly Collection", value: stats.collectedMonth, icon: <TrendingUp className="text-cyan-400" />, color: "border-cyan-500/20" },
        { label: "Total Pending", value: stats.totalPending, icon: <AlertCircle className="text-rose-500" />, color: "border-rose-500/20" },
        { label: "Pending Students", value: stats.pendingStudentsCount, icon: <Users className="text-orange-400" />, color: "border-orange-500/20" },
    ];

    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24">
            <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                <h1 className="text-2xl font-black uppercase tracking-tighter text-neon underline decoration-neon/20">Finance Node</h1>
                <p className="text-[10px] text-white/20 uppercase font-black mt-1 tracking-widest leading-none italic">
                    Accountant: {user?.name}
                </p>
            </div>
            <button
                onClick={() => navigate('/finance/add-payment')}
                className="p-4 bg-cyan-400 text-black rounded-2xl shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-90 transition-all"
            >
                <Plus size={20} strokeWidth={3} />
            </button>
            <div className="px-5 mt-8 space-y-6 relative z-10">
                {/* Analytics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {statCards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => navigate('/finance/fees')}
                            className={`p-6 bg-slate-900/80 rounded-[2.5rem] border ${card.color} shadow-2xl active:scale-95 transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            <div className="mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{card.icon}</div>
                            <h3 className="text-xl font-black tracking-tighter">₹{card.value.toLocaleString()}</h3>
                            <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">{card.label}</p>
                            <ArrowRight size={12} className="absolute bottom-6 right-6 text-white/10 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Recent Payments Section */}
                <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock size={16} className="text-neon animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Recent Ledger Stream</h3>
                    </div>

                    <div className="space-y-3">
                        {stats.recentPayments.length > 0 ? stats.recentPayments.map((p, i) => (
                            <div key={i} className="bg-void/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-neon/20 transition-all">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white leading-none">{p.studentName}</p>
                                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest mt-1 italic">{p.grade} • {p.date}</p>
                                </div>
                                <span className="text-xs font-black text-neon">₹{p.amount}</span>
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