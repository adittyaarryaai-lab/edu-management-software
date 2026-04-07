import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Users, GraduationCap, ArrowLeft, Layers, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FeesTracker = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await API.get('/fees/tracker/classes');
            setClasses(data);
        };
        fetchClasses();
    }, []);

    const handleClassSelect = async (grade) => {
        setSelectedClass(grade);
        setIsDropdownOpen(false);
        const { data } = await API.get(`/fees/tracker/students/${grade}`);
        setStudents(data);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans italic pb-24 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            {/* HEADER SECTION */}
            <div className="flex items-center gap-5 mb-10 border-l-4 border-[#42A5F5] pl-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white rounded-2xl border border-[#DDE3EA] shadow-md hover:bg-blue-50 transition-all active:scale-90 group"
                >
                    <ArrowLeft className="text-[#42A5F5]" size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight capitalize">Fees tracker</h1>
                    <p className="text-[14px] text-slate-400 font-bold uppercase tracking-widest mt-1">Student Payment Records</p>
                </div>
            </div>

            {/* CUSTOM CLASS SELECTOR */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-[#DDE3EA] mb-8 shadow-sm">
                <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4 italic">Select class</p>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-[16px] font-bold text-slate-700 flex justify-between items-center transition-all italic"
                    >
                        <span>{selectedClass || "Choose active class"}</span>
                        <ChevronDown size={20} className={`text-[#42A5F5] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-[#DDE3EA] rounded-3xl shadow-2xl max-h-60 overflow-y-auto p-2">
                            {classes.map(cls => (
                                <div
                                    key={cls}
                                    onClick={() => handleClassSelect(cls)}
                                    className="p-4 hover:bg-blue-50 rounded-2xl cursor-pointer text-slate-700 font-bold transition-colors border-b border-slate-50 last:border-none"
                                >
                                    Class {cls}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedClass && (
                <>
                    {/* SEARCH INTERFACE */}
                    <div className="bg-white p-5 rounded-3xl border border-[#DDE3EA] flex items-center gap-4 mb-8 shadow-sm">
                        <Search size={22} className="text-[#42A5F5] ml-2" />
                        <input
                            type="text"
                            placeholder="Search by name or enrollment..."
                            className="bg-transparent outline-none text-[15px] w-full italic font-bold text-slate-700 placeholder:text-slate-300"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* STUDENT LISTING */}
                    <div className="space-y-5">
                        {students
                            .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.enrollmentNo.includes(search))
                            .map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(`/finance/student-ledger/${s._id}`)}
                                    className="bg-white p-6 rounded-[2.5rem] border border-[#DDE3EA] flex items-center justify-between group hover:border-[#42A5F5] transition-all cursor-pointer shadow-md active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="bg-blue-50 p-4 rounded-2xl text-[#42A5F5] group-hover:bg-[#42A5F5] group-hover:text-white transition-all">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-[17px] font-black text-slate-700 group-hover:text-[#42A5F5] transition-colors truncate capitalize italic">
                                                {s.name}
                                            </h3>
                                            <p className="text-[12px] font-bold text-slate-400 uppercase mt-1 tracking-widest flex flex-wrap items-center gap-2">
                                                <span className="text-[#42A5F5]">Admission no:</span> {s.admissionNo || 'N/A'}
                                                <span className="text-slate-200">•</span>
                                                <span className="text-[#42A5F5]">Enrollment:</span> {s.enrollmentNo}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={22} className="text-slate-200 group-hover:text-[#42A5F5] shrink-0" />
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeesTracker;