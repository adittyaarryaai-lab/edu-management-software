import React from 'react';
import { ArrowLeft, TrendingUp, Award, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Performance = () => {
    const navigate = useNavigate();

    // Mock Academic Data
    const academicStats = [
        { subject: "Engineering Physics", marks: "85/100", grade: "A", status: "Pass", color: "text-blue-500" },
        { subject: "Calculus & Algebra", marks: "92/100", grade: "O", status: "Pass", color: "text-green-500" },
        { subject: "Web Development II", marks: "78/100", grade: "B+", status: "Pass", color: "text-purple-500" },
        { subject: "Maker Lab", marks: "45/50", grade: "A+", status: "Pass", color: "text-orange-500" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Blue Header Section */}
            <div className="nav-gradient text-white px-6 pt-12 pb-28 rounded-b-[3.5rem] shadow-lg relative z-10 text-center">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Academic Results</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><TrendingUp size={20}/></div>
                </div>

                {/* Circular Score Highlight */}
                <div className="inline-flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-32 h-32 border-4 border-white/20 shadow-inner">
                    <span className="text-3xl font-black">8.42</span>
                    <span className="text-[10px] font-bold uppercase opacity-70">Current CGPA</span>
                </div>
                <p className="mt-4 text-sm font-medium opacity-90">Semester 2 • Session 2025-26</p>
            </div>

            {/* Performance Details */}
            <div className="px-5 -mt-16 relative z-20 space-y-4">
                {/* Summary Card */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 flex justify-around items-center border border-white">
                    <div className="text-center border-r border-slate-50 pr-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Marks</p>
                        <p className="text-lg font-black text-slate-800">300/350</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rank in Class</p>
                        <p className="text-lg font-black text-blue-600">#04</p>
                    </div>
                </div>

                {/* Subject List */}
                <h3 className="text-sm font-bold text-slate-800 mt-8 mb-2 ml-2 flex items-center gap-2">
                    <Award size={18} className="text-orange-400" /> Subject-wise Breakdown
                </h3>

                {academicStats.map((item, i) => (
                    <div key={i} className="glass-card p-5 flex items-center justify-between group active:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-50 p-3 rounded-2xl group-active:bg-white transition-colors">
                                <BookOpen size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight mb-1">{item.subject}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Grade: {item.grade} • {item.status}</p>
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className={`font-black text-sm ${item.color}`}>{item.marks}</span>
                                <span className="text-[8px] font-bold text-slate-300 uppercase">Obtained</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </div>
                ))}

                {/* View Full Report Card Button */}
                <button className="w-full mt-4 bg-slate-900 text-white py-4 rounded-[2rem] font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                    Download Marksheet (PDF)
                </button>
            </div>
        </div>
    );
};

export default Performance;