import React, { useState } from 'react';
import { ArrowLeft, Calendar, Search, Eye, User, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('14/01/2026');
    const [toDate, setToDate] = useState('13/02/2026');

    const notificationList = [
        {
            from: "SHANAWAZ ALAM (9310)",
            to: "Vipin Tanwar (25KRMUCS001M21826330)",
            title: "Sitting Plan for 14-Feb-2026 Makeup exam",
            date: "13/02/2026",
            medium: "ERP Encryption",
            status: "Sent"
        },
        {
            from: "SHANAWAZ ALAM (9310)",
            to: "Vipin Tanwar (25KRMUCS001M21826330)",
            title: "Official Notification - Release of Makeup Examination Date Sheet 2026",
            date: "12/02/2026",
            medium: "ERP Encryption",
            status: "Sent"
        }
    ];

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header Section */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Central Inbox</h1>
                </div>
                <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.2em] ml-2 leading-relaxed italic max-w-[280px]">
                    Access communication logs by selecting time interval sequence.
                </p>
            </div>

            {/* Date Selection Card */}
            <div className="px-5 -mt-14 relative z-20">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10 space-y-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <input 
                                type="text" value={fromDate} readOnly
                                className="w-full bg-void border border-neon/20 py-3.5 px-4 rounded-2xl text-xs font-black text-white italic outline-none focus:border-neon"
                            />
                            <Calendar className="absolute right-4 top-3 text-neon/40" size={18} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="relative">
                            <input 
                                type="text" value={toDate} readOnly
                                className="w-full bg-void border border-neon/20 py-3.5 px-4 rounded-2xl text-xs font-black text-white italic outline-none focus:border-neon"
                            />
                            <Calendar className="absolute right-4 top-3 text-neon/40" size={18} />
                        </div>
                    </div>
                    <button className="w-full bg-neon text-void py-4 rounded-full font-black shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest italic">
                        <Search size={18} /> Fetch Logs
                    </button>
                </div>

                {/* List Section */}
                <h3 className="text-[10px] font-black text-neon/30 mt-10 mb-4 ml-2 uppercase tracking-[0.4em] italic">Intelligence List</h3>
                
                <div className="space-y-4 pb-10">
                    {notificationList.map((n, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/5 group hover:border-neon/30 transition-all duration-500 italic">
                            <div className="grid grid-cols-2 gap-y-4 text-[9px]">
                                <div>
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Source Node</p>
                                    <p className="font-black text-white/80 uppercase italic tracking-tight">{n.from}</p>
                                </div>
                                <div>
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Target Recipient</p>
                                    <p className="font-black text-white/80 break-words uppercase italic tracking-tight">{n.to}</p>
                                </div>
                                <div className="col-span-2 py-3 border-y border-white/5 my-1">
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Log Title</p>
                                    <p className="font-black text-neon text-[11px] leading-tight uppercase tracking-tighter group-hover:text-white transition-all">{n.title}</p>
                                </div>
                                <div>
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Encryption Medium</p>
                                    <p className="font-black text-white/60 uppercase italic">{n.medium}</p>
                                </div>
                                <div>
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Timestamp</p>
                                    <p className="font-black text-white/60 italic">{n.date}</p>
                                </div>
                                <div>
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Decode Log</p>
                                    <button className="bg-white/5 border border-neon/20 text-neon px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-90 hover:bg-neon hover:text-void transition-all mt-1">
                                        <Eye size={14} /> <span className="font-black text-[9px] uppercase tracking-widest">Read</span>
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-neon/40 uppercase mb-1 tracking-widest leading-none">Signal Status</p>
                                    <p className="font-black text-neon flex items-center justify-end gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-neon rounded-full animate-ping"></span> {n.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;