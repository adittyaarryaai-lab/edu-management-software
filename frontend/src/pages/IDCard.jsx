import React from 'react';
import { ArrowLeft, Share2, Download, ShieldCheck, QrCode, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IDCard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Digital Identity</h1>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><Share2 size={20}/></div>
                </div>
            </div>

            {/* ID Card Container */}
            <div className="px-6 -mt-16 relative z-20">
                <div className="bg-slate-900 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden border border-neon/20 flex flex-col italic">
                    {/* Top Strip */}
                    <div className="bg-neon h-2 w-full shadow-[0_0_15px_rgba(61,242,224,0.4)]"></div>
                    
                    <div className="p-8 flex flex-col items-center">
                        <div className="text-center mb-6">
                            <h2 className="text-lg font-black text-neon leading-tight uppercase tracking-tighter">EduFlow Intelligence</h2>
                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mt-1 italic">Authorized Personnel Matrix</p>
                        </div>

                        {/* Student Photo */}
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-void rounded-3xl border-4 border-white/5 shadow-inner flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://via.placeholder.com/150" 
                                    alt="Identity" 
                                    className="w-full h-full object-cover grayscale"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-neon text-void p-1.5 rounded-full border-4 border-void shadow-[0_0_10px_rgba(61,242,224,0.5)]">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="text-center space-y-1 mb-8">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{user?.name}</h3>
                            <p className="text-neon font-black text-xs uppercase tracking-widest italic">Node Access: B.Tech Node (Full Stack)</p>
                            <p className="text-white/30 font-black text-[9px] mt-1 uppercase tracking-[0.4em]">Roll Sequence: 2501350071</p>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-void p-6 rounded-[2rem] border border-white/5 flex flex-col items-center relative overflow-hidden group">
                            <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-3 relative z-10">
                                <QrCode size={100} className="text-void" />
                            </div>
                            <div className="absolute inset-0 bg-neon/5 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[8px] font-black text-neon/40 uppercase tracking-[0.4em] italic relative z-10 animate-pulse">Scan For Gate Uplink</p>
                        </div>
                    </div>

                    {/* Bottom Info Strip */}
                    <div className="bg-void px-8 py-4 flex justify-between items-center border-t border-white/5">
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Validity Range</p>
                            <p className="text-[10px] font-black text-neon/80 uppercase">2025 - 2029</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest text-right">Blood Core</p>
                            <p className="text-[10px] font-black text-red-500 text-right uppercase">O+ Positive</p>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button className="w-full mt-8 bg-neon text-void py-4 rounded-3xl font-black shadow-[0_0_30px_rgba(61,242,224,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[11px] tracking-widest italic">
                    <Download size={20} />
                    <span>Download Offline Protocol</span>
                </button>
            </div>
        </div>
    );
};

export default IDCard;