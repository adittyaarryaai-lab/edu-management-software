import React from 'react';
import { ArrowLeft, Bus, Phone, MapPin, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transport = () => {
    const navigate = useNavigate();

    const stops = [
        { location: "Panipat Toll Plaza", time: "07:10 AM", status: "Passed" },
        { location: "Sukhdev Dhaba", time: "07:45 AM", status: "Passed" },
        { location: "College Main Gate", time: "08:30 AM", status: "Next" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight text-center">Bus Tracking</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Bus size={20}/></div>
                </div>
                
                {/* Bus Badge Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Assigned Bus</p>
                        <h2 className="text-2xl font-black">HR-06-AS-2024</h2>
                        <p className="text-[10px] font-bold mt-1 bg-green-500/30 inline-block px-2 py-0.5 rounded text-green-200">ON ROUTE</p>
                    </div>
                    <div className="bg-white text-blue-600 p-4 rounded-3xl shadow-xl">
                        <Bus size={32} />
                    </div>
                </div>
            </div>

            {/* Transport Details */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                {/* Driver Info Card */}
                <div className="bg-white rounded-[2.5rem] p-5 shadow-xl border border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-blue-600">
                            RS
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm">Ram Singh (Driver)</h3>
                            <div className="flex items-center gap-1 text-green-500">
                                <ShieldCheck size={12} />
                                <span className="text-[10px] font-bold uppercase">Verified Professional</span>
                            </div>
                        </div>
                    </div>
                    <a href="tel:+919999999999" className="bg-green-50 text-green-600 p-3 rounded-2xl active:scale-90 transition-all">
                        <Phone size={20} />
                    </a>
                </div>

                {/* Route Timeline */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Route Timeline</h3>
                    <div className="space-y-8 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                        {stops.map((stop, i) => (
                            <div key={i} className="flex items-center gap-6 relative">
                                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md z-10 ${
                                    stop.status === 'Passed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                                }`}></div>
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-800 leading-none">{stop.location}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{stop.status}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Clock size={12} />
                                            <span className="text-[11px] font-black text-slate-600">{stop.time}</span>
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