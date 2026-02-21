import React from 'react';
import { ArrowLeft, Bus, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transport = () => {
    const navigate = useNavigate();

    const stops = [
        { location: "Panipat Toll Plaza", time: "07:10 AM", status: "Passed" },
        { location: "Sukhdev Dhaba", time: "07:45 AM", status: "Passed" },
        { location: "College Main Gate", time: "08:30 AM", status: "Next" },
    ];

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic text-center">Bus Tracking</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon animate-pulse"><Bus size={20}/></div>
                </div>
                
                {/* Bus Badge Card */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-neon/20 rounded-[2.5rem] p-6 flex items-center justify-between relative z-10 shadow-2xl group italic">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-neon/40 mb-1 italic">Assigned Transponder</p>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">HR-06-AS-2024</h2>
                        <p className="text-[8px] font-black mt-2 bg-neon text-void inline-block px-3 py-1 rounded-full shadow-[0_0_10px_rgba(61,242,224,0.4)] tracking-[0.2em] uppercase">Status: On Route</p>
                    </div>
                    <div className="bg-neon text-void p-5 rounded-[2rem] shadow-[0_0_20px_rgba(61,242,224,0.4)] transition-all group-hover:scale-110">
                        <Bus size={32} />
                    </div>
                </div>
            </div>

            {/* Transport Details */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                {/* Driver Info Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-5 shadow-2xl border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all italic">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-void text-neon border border-neon/20 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner italic">
                            RS
                        </div>
                        <div>
                            <h3 className="font-black text-white text-sm uppercase italic group-hover:text-neon transition-all">Ram Singh (Operator)</h3>
                            <div className="flex items-center gap-1.5 text-neon/60">
                                <ShieldCheck size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Neural Verified</span>
                            </div>
                        </div>
                    </div>
                    <a href="tel:+919999999999" className="bg-neon/10 text-neon border border-neon/20 p-3 rounded-2xl active:scale-90 transition-all shadow-lg hover:bg-neon hover:text-void">
                        <Phone size={20} />
                    </a>
                </div>

                {/* Route Timeline */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/5 italic">
                    <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] mb-8 ml-2 italic">Neural Route Progression</h3>
                    <div className="space-y-10 relative px-2">
                        <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-white/5 border-l border-neon/20"></div>

                        {stops.map((stop, i) => (
                            <div key={i} className="flex items-center gap-8 relative">
                                <div className={`w-7 h-7 rounded-full border-4 bg-void shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 transition-all ${
                                    stop.status === 'Passed' ? 'border-neon/40 shadow-neon/10' : 'border-neon animate-pulse shadow-neon/40 scale-110'
                                }`}></div>
                                <div className="flex-1 flex justify-between items-center group">
                                    <div>
                                        <p className={`text-sm font-black italic uppercase leading-none transition-all ${stop.status === 'Next' ? 'text-neon' : 'text-white/60 group-hover:text-white'}`}>{stop.location}</p>
                                        <p className="text-[9px] font-black text-white/20 mt-1.5 uppercase tracking-widest italic">{stop.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-neon/40">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-black italic">{stop.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transport;