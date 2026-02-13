import React from 'react';
import { ArrowLeft, FileDown, Book, FileText, Search, Download } from 'lucide-react';
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
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header Area */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight text-center">Resources</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Book size={20}/></div>
                </div>
                
                <div className="relative mt-4">
                    <Search className="absolute left-4 top-3.5 text-blue-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search notes, papers..." 
                        className="w-full bg-white/20 text-white placeholder:text-blue-100 py-3.5 pl-12 pr-4 rounded-2xl border border-white/10 outline-none backdrop-blur-md"
                    />
                </div>
            </div>

            {/* Resources List */}
            <div className="px-5 -mt-8 relative z-20 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Available Downloads ({resources.length})</p>
                
                {resources.map((res, i) => (
                    <div key={i} className="glass-card p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-[13px] leading-tight mb-1">{res.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">{res.type}</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{res.subject} • {res.size}</p>
                                </div>
                            </div>
                        </div>
                        
                        <button className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-200 active:scale-90 transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Tip */}
            <div className="mt-8 px-10 text-center">
                <div className="bg-blue-50 p-4 rounded-[2rem] border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Tip</p>
                    <p className="text-[11px] text-slate-600 font-medium mt-1">Make sure you have a PDF viewer installed to open study materials.</p>
                </div>
            </div>
        </div>
    );
};

export default Academic;