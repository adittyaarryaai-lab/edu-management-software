import React from 'react';
import { ArrowLeft, Calendar, Sun, Palmtree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Holidays = () => {
    const navigate = useNavigate();

    const holidayList = [
        { date: "26 Jan 2026", day: "Monday", occasion: "Republic Day", type: "National Holiday", color: "text-orange-500", bg: "bg-orange-50" },
        { date: "14 Feb 2026", day: "Saturday", occasion: "Valentine's Day", type: "Restricted", color: "text-red-500", bg: "bg-red-50" },
        { date: "26 Feb 2026", day: "Thursday", occasion: "Maha Shivaratri", type: "Gazetted", color: "text-purple-500", bg: "bg-purple-50" },
        { date: "14 Mar 2026", day: "Saturday", occasion: "Holi", type: "Gazetted", color: "text-pink-500", bg: "bg-pink-50" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Holidays 2026</h1>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <Sun className="text-yellow-300" size={24} />
                    <div>
                        <p className="text-[10px] font-bold uppercase opacity-70 leading-none">Next Holiday</p>
                        <p className="text-sm font-bold mt-1">Maha Shivaratri (Feb 26)</p>
                    </div>
                </div>
            </div>

            {/* Holiday List */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                {holidayList.map((h, i) => (
                    <div key={i} className="glass-card p-5 flex items-center gap-5 border-l-4 border-l-blue-500">
                        <div className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl ${h.bg} ${h.color}`}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{h.date.split(' ')[1]}</span>
                            <span className="text-xl font-black">{h.date.split(' ')[0]}</span>
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="font-extrabold text-slate-800 text-sm leading-tight mb-1">{h.occasion}</h4>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{h.day}</span>
                            </div>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {h.type}
                            </span>
                        </div>
                        
                        <Palmtree size={20} className="text-slate-200" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Holidays;