import React from 'react';
import { ArrowLeft, BookOpen, Download, Hash, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Syllabus = () => {
    const navigate = useNavigate();

    const subjects = [
        { name: "Web Development II", code: "CSW201", credits: 4, type: "Core", syllabusLink: "#" },
        { name: "Cloud Computing", code: "CSL305", credits: 3, type: "Elective", syllabusLink: "#" },
        { name: "Engineering Physics", code: "BS102", credits: 4, type: "Basic Science", syllabusLink: "#" },
        { name: "Applied Calculus", code: "MA101", credits: 4, type: "Foundation", syllabusLink: "#" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">My Syllabus</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><BookOpen size={20}/></div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Credits</p>
                        <h2 className="text-2xl font-black">15 Credits</h2>
                    </div>
                    <div className="bg-blue-500 text-white p-3 rounded-2xl shadow-lg">
                        <Award size={24} />
                    </div>
                </div>
            </div>

            {/* Subjects List */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Semester 2 Subjects</p>
                
                {subjects.map((sub, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-5 shadow-xl border border-slate-50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                                    {sub.code.substring(0,2)}
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{sub.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{sub.code} • {sub.type}</p>
                                </div>
                            </div>
                            <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-[9px] font-black border border-slate-100">
                                {sub.credits} CR
                            </span>
                        </div>

                        <button className="w-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 py-3 rounded-2xl border border-dashed border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-2 group">
                            <Download size={16} className="group-hover:animate-bounce" />
                            <span className="text-[10px] font-black uppercase">Download Syllabus PDF</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Syllabus;