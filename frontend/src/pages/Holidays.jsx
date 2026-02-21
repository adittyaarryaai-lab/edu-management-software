import React from 'react';
import { ArrowLeft, Calendar, Sun, Palmtree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Holidays = () => {
    const navigate = useNavigate();

    const holidayList = [
        { date: "26 Jan 2026", day: "Monday", occasion: "Republic Day", type: "National Holiday", color: "text-orange-400", bg: "bg-orange-500/10" },
        { date: "14 Feb 2026", day: "Saturday", occasion: "Valentine's Day", type: "Restricted", color: "text-red-400", bg: "bg-red-500/10" },
        { date: "26 Feb 2026", day: "Thursday", occasion: "Maha Shivaratri", type: "Gazetted", color: "text-purple-400", bg: "bg-purple-500/10" },
        { date: "14 Mar 2026", day: "Saturday", occasion: "Holi", type: "Gazetted", color: "text-pink-400", bg: "bg-pink-500/10" },
    ];

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Holidays 2026</h1>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
                    <Sun className="text-yellow-400 animate-pulse" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase text-white/30 leading-none italic tracking-widest">Next Network Offline</p>
                        <p className="text-sm font-black text-neon mt-1 italic uppercase">Maha Shivaratri (Feb 26)</p>
                    </div>
                </div>
            </div>

            {/* Holiday List */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                {holidayList.map((h, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] flex items-center gap-5 border border-white/5 border-l-4 border-l-neon shadow-2xl">
                        <div className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl ${h.bg} ${h.color} border border-white/5`}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{h.date.split(' ')[1]}</span>
                            <span className="text-xl font-black tracking-tighter">{h.date.split(' ')[0]}</span>
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="font-black text-white text-sm leading-tight mb-1 uppercase italic">{h.occasion}</h4>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-neon/40" />
                                <span className="text-[10px] font-black text-neon/60 uppercase italic tracking-widest">{h.day}</span>
                            </div>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-void rounded-md text-[8px] font-black text-white/20 uppercase tracking-[0.3em] border border-white/5">
                                {h.type}
                            </span>
                        </div>
                        
                        <Palmtree size={20} className="text-white/5" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Holidays;