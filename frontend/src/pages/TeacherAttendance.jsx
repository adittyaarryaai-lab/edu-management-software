import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Calendar, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const TeacherAttendance = ({ user }) => {
    const navigate = useNavigate();
    // Day 85: assignedClass hi primary class hogi, dropdown ki ab zarurat nahi
    const [assignedClass, setAssignedClass] = useState(user?.assignedClass || null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showToast, setShowToast] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Agar admin ne koi class nahi di, toh aage mat badho
            if (!assignedClass) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // My-students route se wahi bache ayenge jo teacher ki assigned class mein hain
                const { data: resp } = await API.get(`/attendance/my-students`);
                const { data: existing } = await API.get(`/attendance/view?grade=${assignedClass}&date=${selectedDate}`);

                const stdList = resp.students;

                if (existing && existing.records.length > 0) {
                    const formattedData = stdList.map(s => {
                        const record = existing.records.find(r => r.studentId === s._id || r.student === s._id);
                        return {
                            id: s._id,
                            name: s.name,
                            roll: s.enrollmentNo,
                            status: record ? record.status : 'Present'
                        };
                    });
                    setStudents(formattedData);
                    setIsUpdateMode(true);
                } else {
                    const formattedData = stdList.map(s => ({
                        id: s._id,
                        name: s.name,
                        roll: s.enrollmentNo,
                        status: 'Present'
                    }));
                    setStudents(formattedData);
                    setIsUpdateMode(false);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDate]); // Dependency mein se selectedClass hat gaya kyunki wo ab fixed hai

    const toggleStatus = (id) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
        ));
    };

    const handleSubmit = async () => {
        if (students.length === 0) return;
        setIsSaving(true);
        try {
            const records = students.map(s => ({
                studentId: s.id,
                name: s.name,
                status: s.status
            }));
            const payload = {
                grade: assignedClass,
                date: selectedDate,
                records: records
            };
            await API.post('/attendance/mark', payload);
            setShowToast(true);
            setTimeout(() => setIsSaving(false), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed!");
            setIsSaving(false);
        }
    };

    if (loading) return <Loader />;
    if (!assignedClass) return (
        <div className="min-h-screen bg-void flex items-center justify-center text-center p-10 italic">
            <p className="text-white/20 font-black text-sm uppercase italic tracking-[0.3em] leading-relaxed">
                No class assigned to you! <br />
                <span className="text-neon/40 text-[10px]">Contact Admin to initialize your Neural Node.</span>
            </p>
        </div>
    );
    return (
        <div className="min-h-screen bg-void pb-10 font-sans italic text-white">
            {showToast && (
                <Toast
                    message={isUpdateMode ? "Records Updated Successfully!" : "Attendance Saved!"}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}

            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Register v2.0</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><Calendar size={20} /></div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-[2.5rem] border border-neon/20 space-y-4 shadow-2xl italic relative z-10">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <p className="text-[8px] font-black uppercase text-neon/40 tracking-widest italic">Target Sector</p>
                            <h2 className="font-black text-lg text-white italic uppercase tracking-tighter">
                                {assignedClass}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black uppercase text-neon/40 tracking-widest italic">Academic Cycle</p>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent font-black text-sm outline-none cursor-pointer text-neon italic"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* List Area */}
            <div className="px-5 -mt-10 space-y-4 relative z-20">
                <div className="flex justify-between items-center px-4 mb-2">
                    <span className="text-[9px] font-black text-neon/30 uppercase tracking-[0.3em] italic">
                        {isUpdateMode ? '📍 Updating Archive' : '📝 New Neural Entry'}
                    </span>
                    <span className="text-[9px] font-black text-neon uppercase tracking-widest bg-neon/10 px-4 py-1.5 rounded-full border border-neon/20 italic shadow-inner">
                        Present: {students.filter(s => s.status === 'Present').length} / {students.length}
                    </span>
                </div>

                {students.map((student) => (
                    <div key={student.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] flex justify-between items-center shadow-2xl border border-white/5 group hover:border-neon/30 transition-all italic">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-void text-neon border border-neon/20 rounded-3xl flex items-center justify-center font-black text-xs shadow-inner group-hover:bg-neon group-hover:text-void transition-all duration-300">
                                {student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm uppercase italic tracking-tighter group-hover:text-neon transition-colors">{student.name}</h3>
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] italic">Signal ID: {student.roll}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleStatus(student.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[9px] uppercase transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${student.status === 'Present'
                                ? 'bg-neon/10 text-neon border border-neon/30 shadow-[0_0_10px_rgba(61,242,224,0.1)]'
                                : 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                }`}
                        >
                            {student.status === 'Present' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {student.status}
                        </button>
                    </div>
                ))}

                <div className="pt-10 pb-20 w-full px-4 z-30 italic">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving || students.length === 0}
                        className={`w-full py-5 rounded-[2rem] font-black shadow-[0_0_30px_rgba(61,242,224,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-[11px] tracking-[0.3em] ${isSaving ? 'bg-slate-800 text-white/20' : 'bg-neon text-void shadow-[0_0_20px_rgba(61,242,224,0.4)]'
                            }`}
                    >
                        {isSaving ? "Synchronizing Matrix..." : (isUpdateMode ? "Update Neural Records" : "Finalize Attendance Link")}
                        {isUpdateMode ? <RefreshCcw size={18} /> : <Save size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendance;