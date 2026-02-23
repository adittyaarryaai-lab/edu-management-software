import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const AdminEditTimetable = () => {
    const navigate = useNavigate();
    const [grade, setGrade] = useState('');
    const [day, setDay] = useState('Monday');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [existingGrades, setExistingGrades] = useState([]);

    const [periods, setPeriods] = useState([]);

    useEffect(() => {
        fetchTeachers();
        fetchGrades();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await API.get('/timetable/teachers-list');
            setTeachers(data);
        } catch (err) { console.error("Faculty Sync Error"); }
    };

    const fetchGrades = async () => {
        try {
            const { data } = await API.get('/timetable/grades/list');
            setExistingGrades(data);
        } catch (err) { console.error("Grade Sync Error"); }
    };

    const loadTimetable = async (selectedGrade, selectedDay) => {
        if (!selectedGrade) return;
        try {
            const { data } = await API.get(`/timetable/${selectedGrade}`);
            const dayData = data.schedule.find(s => s.day === selectedDay);
            if (dayData && dayData.periods.length > 0) {
                setPeriods(dayData.periods);
            } else {
                setPeriods([{ startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
                setMsg(`No records found for ${selectedDay}. Starting fresh block.`);
            }
        } catch (err) { 
            setPeriods([{ startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
        }
    };

    const addPeriod = () => {
        setPeriods([...periods, { startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
    };

    const removePeriod = (index) => {
        setPeriods(periods.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
        if (!grade) return alert("Select a Neural Node (Class) first!");
        setLoading(true);
        try {
            const payload = {
                grade: grade,
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
            setMsg(`Matrix Updated for ${grade} (${day})! ⚡`);
        } catch (err) {
            alert("Update Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header with Dropdowns */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-rose-400"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Timetable Editor</h1>
                </div>

                <div className="space-y-4 relative z-10">
                    <select
                        className="w-full bg-slate-900/50 border border-rose-500/20 p-4 rounded-2xl outline-none font-black text-xs text-white italic"
                        value={grade} 
                        onChange={(e) => { 
                            setGrade(e.target.value); 
                            loadTimetable(e.target.value, day); 
                        }}
                    >
                        <option value="">SELECT CLASS TO MODIFY</option>
                        {existingGrades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                            <button
                                key={d}
                                onClick={() => { setDay(d); loadTimetable(grade, d); }}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${day === d ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-white/5 text-white/40 border border-white/5'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Editable Periods */}
            <div className="px-5 -mt-8 space-y-4 relative z-20">
                {periods.length > 0 ? periods.map((p, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 relative">
                        <button onClick={() => removePeriod(index)} className="absolute top-4 right-4 text-rose-500/30 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <input type="text" placeholder="START" className="bg-void p-3 rounded-xl border border-white/5 text-[10px] font-black text-white outline-none focus:border-rose-500/40" value={p.startTime} onChange={(e) => { const n = [...periods]; n[index].startTime = e.target.value; setPeriods(n); }} />
                            <input type="text" placeholder="END" className="bg-void p-3 rounded-xl border border-white/5 text-[10px] font-black text-white outline-none focus:border-rose-500/40" value={p.endTime} onChange={(e) => { const n = [...periods]; n[index].endTime = e.target.value; setPeriods(n); }} />
                        </div>

                        <div className="space-y-3">
                            <input type="text" placeholder="SUBJECT" className="w-full bg-void p-3 rounded-xl border border-white/5 text-xs font-black text-white uppercase outline-none focus:border-rose-500/40" value={p.subject} onChange={(e) => { const n = [...periods]; n[index].subject = e.target.value; setPeriods(n); }} />
                            <input type="text" placeholder="ROOM" className="w-full bg-void p-3 rounded-xl border border-white/5 text-xs font-black text-rose-400 outline-none focus:border-rose-500/40" value={p.room} onChange={(e) => { const n = [...periods]; n[index].room = e.target.value; setPeriods(n); }} />

                            <select
                                className="w-full bg-void p-3 rounded-xl border border-white/5 text-xs font-black text-white outline-none"
                                value={p.teacherEmpId} onChange={(e) => { const n = [...periods]; n[index].teacherEmpId = e.target.value; setPeriods(n); }}
                            >
                                <option value="">CHANGE FACULTY (EMP ID)</option>
                                {teachers.map(t => (
                                    <option key={t.employeeId} value={t.employeeId}>
                                        {t.employeeId} - {t.name} ({t.subjects.join(', ')})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 opacity-20 font-black uppercase tracking-[0.3em] text-xs">
                        Select a Node to begin Modification
                    </div>
                )}

                {grade && (
                    <div className="flex gap-4 pt-4">
                        <button onClick={addPeriod} className="flex-1 bg-void text-rose-400 border border-rose-500/20 py-4 rounded-[2rem] font-black uppercase text-[10px] flex items-center justify-center gap-2"><Plus size={18} /> Add Block</button>
                        <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-rose-500 text-white py-4 rounded-[2rem] font-black uppercase text-[10px] shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2">
                            <Save size={18} /> {loading ? "UPDATING..." : "SAVE CHANGES"}
                        </button>
                    </div>
                )}
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminEditTimetable;