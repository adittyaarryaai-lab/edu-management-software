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

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-95 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Student Directory</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><User size={20}/></div>
                </div>
                
                <div className="relative mt-4 z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neon/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search personnel sequence..." 
                        className="w-full bg-slate-900/50 text-white placeholder:text-white/10 py-3.5 pl-12 pr-4 rounded-2xl border border-neon/10 outline-none backdrop-blur-md font-black text-xs uppercase italic focus:border-neon transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                <p className="text-[9px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Active Nodes ({filteredStudents.length})</p>
                
                {filteredStudents.map((s, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/5 shadow-2xl group hover:border-neon/30 transition-all italic">
                        <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-void text-neon border border-neon/20 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner group-hover:bg-neon group-hover:text-void transition-all duration-300">
                                    {s.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-sm leading-tight uppercase group-hover:text-neon transition-colors">{s.name}</h3>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Seq: {s.roll} • {s.class}</p>
                                </div>
                            </div>
                            <button className="text-neon bg-neon/10 p-2.5 rounded-xl border border-neon/20 active:scale-90 transition-all">
                                <Info size={18} />
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[8px] font-black text-white/20 uppercase mb-1 tracking-widest leading-none">Emergency Node</p>
                                <p className="text-xs font-black text-white/60 tracking-tighter">{s.parent}</p>
                            </div>
                            <div className="flex gap-2">
                                <a 
                                    href={`tel:${s.parent}`} 
                                    onClick={(e) => { e.preventDefault(); handleCall(s.parent); }}
                                    className="flex items-center justify-center w-12 h-12 bg-neon/10 text-neon border border-neon/20 rounded-2xl active:scale-90 transition-all shadow-lg cursor-pointer hover:bg-neon hover:text-void"
                                >
                                    <Phone size={20} />
                                </a>

                                <a 
                                    href={`sms:${s.parent}`}
                                    className="flex items-center justify-center w-12 h-12 bg-white/5 text-white/40 border border-white/10 rounded-2xl active:scale-90 transition-all shadow-lg cursor-pointer hover:bg-neon hover:text-void hover:border-neon"
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