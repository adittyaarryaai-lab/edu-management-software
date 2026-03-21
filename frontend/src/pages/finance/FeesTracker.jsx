import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Users, GraduationCap, ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FeesTracker = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await API.get('/fees/tracker/classes');
            setClasses(data);
        };
        fetchClasses();
    }, []);

    const handleClassSelect = async (grade) => {
        setSelectedClass(grade);
        const { data } = await API.get(`/fees/tracker/students/${grade}`);
        setStudents(data);
    };

    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic">
            <div className="flex items-center gap-4 mb-10 border-l-4 border-orange-500 pl-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl"><ArrowLeft size={20} /></button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Fees Tracker Node</h1>
            </div>

            {/* Class Selector Dropdown */}
            <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 mb-8">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Select Target Class</p>
                <select
                    value={selectedClass}
                    onChange={(e) => handleClassSelect(e.target.value)}
                    className="w-full bg-void border border-orange-500/20 p-5 rounded-3xl text-sm font-black text-orange-400 uppercase outline-none appearance-none cursor-pointer"
                >
                    <option value="">-- CHOOSE ACTIVE CLASS --</option>
                    {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
            </div>

            {selectedClass && (
                <>
                    <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 flex items-center gap-4 mb-8">
                        <Search size={18} className="text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME OR ENROLLMENT..."
                            className="bg-transparent outline-none text-xs w-full uppercase font-black"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {students
                            .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.enrollmentNo.includes(search))
                            .map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(`/finance/student-ledger/${s._id}`)}
                                    className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-orange-500/40 transition-all cursor-pointer shadow-xl active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-all">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase text-white group-hover:text-orange-400 transition-colors">
                                                {s.name}
                                            </h3>
                                            <p className="text-[8px] font-bold text-white/20 uppercase mt-1 tracking-widest flex items-center gap-2">
                                                <span className="text-orange-500/50">ADMISSION NO:</span> {s.admissionNo || 'N/A'}
                                                <span className="text-white/10">•</span>
                                                <span className="text-orange-500/50">ENROLLMENT:</span> {s.enrollmentNo}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-white/10 group-hover:text-orange-400" />
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeesTracker;