import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const AdminTimetable = () => {
    const navigate = useNavigate();
    const [grade, setGrade] = useState('');
    const [day, setDay] = useState('Monday');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);

    const [periods, setPeriods] = useState([
        { startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }
    ]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await API.get('/timetable/teachers-list');
            setTeachers(data);
        } catch (err) { console.error("Faculty Fetch Failed"); }
    };

    const addPeriod = () => {
        setPeriods([...periods, { startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
    };

    const removePeriod = (index) => {
        setPeriods(periods.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!grade) return alert("Please enter Grade (e.g. 10-A)!");
        
        const isIncomplete = periods.some(p => !p.teacherEmpId || !p.startTime || !p.subject);
        if (isIncomplete) return alert("All Neural Blocks (Start Time, Subject, Teacher) must be filled!");

        setLoading(true);
        try {
            const payload = {
                grade: grade.trim().toUpperCase(),
                schedule: [{
                    day: day,
                    periods: periods.map(p => ({
                        ...p,
                        subject: p.subject.toUpperCase(),
                        room: p.room || "N/A"
                    }))
                }]
            };

            await API.post('/timetable/upload', payload);
            setMsg(`Matrix Synchronized for ${grade} (${day})! ⚡`);

            // Creation mode reset:
            setGrade('');
            setPeriods([{ startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
        } catch (err) {
            alert("Sync Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Timetable Creator</h1>
                </div>

                <div className="grid grid-cols-1 gap-4 relative z-10">
                    <input
                        type="text" placeholder="ENTER GRADE (e.g. 10-A)"
                        className="bg-slate-900/50 border border-neon/20 p-4 rounded-2xl outline-none placeholder:text-neon/30 font-black text-xs text-white uppercase italic focus:border-neon"
                        value={grade} onChange={(e) => setGrade(e.target.value)}
                    />

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                            <button
                                key={d}
                                onClick={() => setDay(d)}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${day === d ? 'bg-neon text-void' : 'bg-white/5 text-white/40 border border-white/5'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                {periods.map((p, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 relative group">
                        <button onClick={() => removePeriod(index)} className="absolute top-4 right-4 text-red-500/30 hover:text-red-500 transition-all"><Trash2 size={16} /></button>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <input type="text" placeholder="START (09:00 AM)" className="bg-void p-3 rounded-xl border border-neon/10 text-[10px] font-black text-white outline-none" value={p.startTime} onChange={(e) => { const n = [...periods]; n[index].startTime = e.target.value; setPeriods(n); }} />
                            <input type="text" placeholder="END (10:00 AM)" className="bg-void p-3 rounded-xl border border-neon/10 text-[10px] font-black text-white outline-none" value={p.endTime} onChange={(e) => { const n = [...periods]; n[index].endTime = e.target.value; setPeriods(n); }} />
                        </div>

                        <div className="space-y-3">
                            <input type="text" placeholder="SUBJECT NAME" className="w-full bg-void p-3 rounded-xl border border-neon/10 text-xs font-black text-white uppercase outline-none focus:border-neon" value={p.subject} onChange={(e) => { const n = [...periods]; n[index].subject = e.target.value; setPeriods(n); }} />
                            <input type="text" placeholder="ROOM NO" className="w-full bg-void p-3 rounded-xl border border-neon/10 text-xs font-black text-neon outline-none" value={p.room} onChange={(e) => { const n = [...periods]; n[index].room = e.target.value; setPeriods(n); }} />

                            <select
                                className="w-full bg-void p-3 rounded-xl border border-neon/10 text-xs font-black text-white outline-none"
                                value={p.teacherEmpId} onChange={(e) => { const n = [...periods]; n[index].teacherEmpId = e.target.value; setPeriods(n); }}
                            >
                                <option value="">SELECT FACULTY (EMP ID)</option>
                                {teachers.map(t => (
                                    <option key={t.employeeId} value={t.employeeId}>
                                        {t.employeeId} - {t.name} ({t.subjects.join(', ')})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4 pt-4">
                    <button onClick={addPeriod} className="flex-1 bg-void text-neon border border-neon/20 py-4 rounded-[2rem] font-black uppercase text-[10px] flex items-center justify-center gap-2"><Plus size={18} /> Add Slot</button>
                    <button onClick={handleSave} disabled={loading} className="flex-1 bg-neon text-void py-4 rounded-[2rem] font-black uppercase text-[10px] shadow-[0_0_20px_rgba(61,242,224,0.3)] flex items-center justify-center gap-2">
                        <Save size={18} /> {loading ? "SAVING..." : "EXECUTE"}
                    </button>
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminTimetable;