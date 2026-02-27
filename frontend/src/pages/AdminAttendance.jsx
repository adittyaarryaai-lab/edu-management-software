import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, GraduationCap, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AdminAttendance = () => {
    const navigate = useNavigate();
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                // FIXED: Now fetching from Student Grade List instead of Timetable
                const { data } = await API.get('/users/grades/all');
                setGrades(data);
            } catch (err) { console.error("Grade Fetch Error"); }
        };
        fetchGrades();
    }, []);

    const fetchStudents = async (grade) => {
        if (!grade) return;
        setLoading(true);
        try {
            const { data } = await API.get(`/users/students/${grade}`);
            setStudents(data);
        } catch (err) { console.error("Fetch Error"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 z-[100] bg-white/5 p-2 rounded-xl border border-white/10 text-neon transition-all active:scale-90 hover:bg-white/10"
                >
                    <ArrowLeft size={20} />
                </button>

                <h1 className="text-xl font-black uppercase tracking-tighter italic mb-8">Personnel Information</h1>

                {/* Styled Dropdown in Center */}
                <div className="relative max-w-xs mx-auto z-10">
                    <select
                        value={selectedGrade}
                        onChange={(e) => { setSelectedGrade(e.target.value); fetchStudents(e.target.value); }}
                        className="w-full bg-slate-900/80 border border-neon/30 p-4 rounded-2xl outline-none font-black text-xs text-white uppercase italic appearance-none cursor-pointer text-center"
                    >
                        <option value="">SELECT CLASS SECTOR</option>
                        {grades.map(g => <option key={g} value={g} className="bg-void">{g}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon"><Filter size={14} /></div>
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                {loading ? <Loader /> : (
                    students.length > 0 ? (
                        students.map((stu) => (
                            <div
                                key={stu._id}
                                onClick={() => navigate(`/admin/student-report/${stu._id}`)}
                                className="bg-white/5 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all active:scale-95 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-void text-neon border border-neon/20 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner group-hover:bg-neon group-hover:text-void transition-all duration-300">
                                        {stu.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase tracking-tighter italic">{stu.name}</h4>
                                        <p className="text-[9px] font-black text-neon/40 uppercase tracking-widest italic">{stu.enrollmentNo}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl text-white/20 group-hover:text-neon transition-all">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-20 italic font-black text-[10px] uppercase tracking-[0.4em]">
                            Initialize Sector Selection
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminAttendance;