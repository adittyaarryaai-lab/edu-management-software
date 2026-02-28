import React, { useState, useEffect } from 'react';
import { Search, Filter, User, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const StudentsFees = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGrades = async () => {
            const { data } = await API.get('/users/grades/all');
            setGrades(data);
        };
        fetchGrades();
    }, []);

    const fetchLedger = async (grade) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/users/finance/students-ledger/${grade}`);
            setStudents(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24 pt-10 px-5">
            <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-neon" size={28} />
                <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Fees Ledger</h1>
            </div>

            {/* Search & Class Filter */}
            <div className="space-y-4 mb-10">
                <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 flex items-center gap-4 focus-within:border-neon/30 transition-all">
                    <Search size={18} className="text-white/20" />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME..."
                        className="bg-transparent outline-none text-xs w-full uppercase font-black"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <label className="text-[8px] font-black text-neon/40 ml-4 uppercase tracking-[0.3em]">Filter By Sector (Class)</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {grades.map((grade) => (
                            <button
                                key={grade}
                                onClick={() => { setSelectedGrade(grade); fetchLedger(grade); }}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${selectedGrade === grade ? 'bg-neon text-void border-neon shadow-[0_0_15px_rgba(61,242,224,0.3)]' : 'bg-white/5 text-white/40 border-white/5'}`}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Students List Grid */}
            <div className="space-y-3">
                {students.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((student) => (
                    <div
                        key={student._id}
                        onClick={() => navigate(`/finance/student-profile/${student._id}`)}
                        className="bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group active:scale-95 transition-all cursor-pointer hover:border-neon/20"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/20 group-hover:text-neon group-hover:border-neon/30 transition-all overflow-hidden">
                                {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover" /> : <User size={24} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase leading-none group-hover:text-white transition-colors">{student.name}</h3>
                                <p className="text-[8px] text-white/20 font-black uppercase mt-2 tracking-widest">{student.enrollmentNo} • SEC: {student.grade}</p>
                                {/* DAY 91 TESTING FIX: Database ID dikhane ke liye */}
                                <p className="text-[7px] text-cyan-400/40 font-mono mt-1 select-all">
                                    ID: {student._id}
                                </p>
                            </div>
                        </div>
                        <div className="bg-void p-3 rounded-xl border border-white/5 text-white/20 group-hover:text-neon group-hover:border-neon/30">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                ))}

                {!loading && students.length === 0 && selectedGrade && (
                    <div className="py-20 text-center opacity-20 italic uppercase font-black text-[10px] tracking-[0.5em]">
                        No Student Nodes in {selectedGrade}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsFees;