import React from 'react';
import { ArrowLeft, Book, FileText, Search, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Academic = () => {
    const navigate = useNavigate();

    const resources = [
        { title: "Unit 1: Quantum Mechanics", subject: "Physics", type: "PDF", size: "2.4 MB", date: "10 Feb 2026" },
        { title: "Previous Year Paper 2025", subject: "Calculus", type: "PDF", size: "1.1 MB", date: "05 Feb 2026" },
        { title: "Lab Manual: Web Dev II", subject: "Full Stack", type: "DOCX", size: "4.5 MB", date: "01 Feb 2026" },
        { title: "Syllabus Copy 2026", subject: "General", type: "PDF", size: "0.8 MB", date: "20 Jan 2026" },
    ];

    return (
        <div className="min-h-screen bg-void dark:bg-void pb-24 font-sans italic">
            {/* Header Area */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/60 to-transparent animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 hover:bg-neon/20 transition-all">
                        <ArrowLeft size={20} className="text-neon" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-center italic">Resources</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><Book size={20}/></div>
                </div>
                
                <div className="relative mt-4 z-10">
                    <Search className="absolute left-4 top-3.5 text-neon/60" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search notes, papers..." 
                        className="w-full bg-slate-900/50 text-white placeholder:text-neon/30 py-3.5 pl-12 pr-4 rounded-2xl border border-neon/20 outline-none backdrop-blur-md focus:border-neon transition-all font-bold text-xs"
                    />
                </div>
            </div>

            {/* Resources List */}
            <div className="px-5 -mt-8 relative z-20 space-y-4">
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.3em] ml-2">Available Downloads ({resources.length})</p>
                
                {resources.map((res, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] flex items-center justify-between group active:bg-neon/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neon/10 text-neon rounded-2xl flex items-center justify-center border border-neon/20 shadow-[0_0_15px_rgba(61,242,224,0.1)]">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-[13px] leading-tight mb-1 uppercase italic">{res.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black bg-neon text-void px-1.5 py-0.5 rounded uppercase tracking-tighter">{res.type}</span>
                                    <p className="text-[10px] font-bold text-neon/40 uppercase tracking-tighter">{res.subject} • {res.size}</p>
                                </div>
                            </div>
                        </div>
                        
                        <button className="bg-neon text-void p-3 rounded-2xl shadow-[0_0_20px_rgba(61,242,224,0.4)] active:scale-90 transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Tip */}
            <div className="mt-8 px-10 text-center">
                <div className="bg-neon/5 p-4 rounded-[2rem] border border-neon/20">
                    <p className="text-[10px] font-black text-neon uppercase tracking-widest italic">Neural Tip</p>
                    <p className="text-[11px] text-white/60 font-medium mt-1">Ensure a compatible PDF engine is synchronized for decryption.</p>
                </div>
            </div>
        </div>
    );
};

export default Academic;