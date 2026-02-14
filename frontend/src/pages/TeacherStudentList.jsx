import React, { useState } from 'react';
import { ArrowLeft, Search, User, Phone, MessageSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherStudentList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const students = [
        { name: "Rahul Kumar", roll: "10", class: "GRADE 10", parent: "9876543210" },
        { name: "New Test Student", roll: "105", class: "GRADE 10", parent: "0000000000" },
        { name: "Ravi sharma", roll: "55", class: "GRADE 10", parent: "9817167474" },
    ];

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.includes(searchTerm)
    );

    // ✅ Dialer function for forced opening if <a> fails
    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Student Directory</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><User size={20}/></div>
                </div>
                
                <div className="relative mt-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or roll..." 
                        className="w-full bg-white/20 text-white placeholder:text-blue-100 py-3.5 pl-12 pr-4 rounded-2xl border border-white/10 outline-none backdrop-blur-md font-medium"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Active Students ({filteredStudents.length})</p>
                
                {filteredStudents.map((s, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-5 border border-white shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-start border-b border-slate-50 pb-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner">
                                    {s.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{s.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Roll: {s.roll} • {s.class}</p>
                                </div>
                            </div>
                            <button className="text-blue-500 bg-blue-50 p-2.5 rounded-xl active:scale-90 transition-all border border-blue-100">
                                <Info size={18} />
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest leading-none">Parent Contact</p>
                                <p className="text-xs font-bold text-slate-700">{s.parent}</p>
                            </div>
                            <div className="flex gap-2">
                                {/* ✅ FIXED: Using <a> with inline-block and direct child styling */}
                                <a 
                                    href={`tel:${s.parent}`} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCall(s.parent);
                                    }}
                                    className="flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-2xl active:scale-90 transition-all border border-green-100 shadow-sm cursor-pointer"
                                >
                                    <Phone size={20} />
                                </a>

                                <a 
                                    href={`sms:${s.parent}`}
                                    className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl active:scale-90 transition-all border border-blue-100 shadow-sm cursor-pointer"
                                >
                                    <MessageSquare size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherStudentList;