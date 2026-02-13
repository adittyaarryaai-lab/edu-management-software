import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherAssignments = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    // Mock Assignments List
    const assignments = [
        { title: "Calculus Problem Set 1", class: "Grade 10-B", deadline: "15 Feb 2026", status: "Active" },
        { title: "Physics Lab Report", class: "Grade 10-A", deadline: "18 Feb 2026", status: "Pending" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Assignments</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-white text-blue-600 p-2 rounded-xl shadow-lg active:scale-90 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2">Manage and post class assignments.</p>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-6">
                {/* Post New Assignment Form (Toggle) */}
                {showForm && (
                    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-blue-500" /> Create Assignment
                        </h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Assignment Title" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-sm outline-none focus:border-blue-300" />
                            <textarea placeholder="Description..." rows="3" className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-sm outline-none focus:border-blue-300"></textarea>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input type="text" placeholder="DD/MM/YYYY" className="w-full bg-slate-50 border border-slate-100 py-3 pl-10 pr-4 rounded-2xl text-[10px] outline-none" />
                                </div>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input type="text" placeholder="Time" className="w-full bg-slate-50 border border-slate-100 py-3 pl-10 pr-4 rounded-2xl text-[10px] outline-none" />
                                </div>
                            </div>
                            <button className="w-full bg-blue-500 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <Send size={18} /> Post to Class
                            </button>
                        </div>
                    </div>
                )}

                {/* Assignments List */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Recent Assignments</p>
                    {assignments.map((asgn, i) => (
                        <div key={i} className="glass-card p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{asgn.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{asgn.class} • Deadline: {asgn.deadline}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${asgn.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                {asgn.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignments;