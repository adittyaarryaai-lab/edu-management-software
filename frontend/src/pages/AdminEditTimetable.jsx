import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminEditTimetable = () => {
    const navigate = useNavigate();
    const [grade, setGrade] = useState('');
    const [day, setDay] = useState('Monday');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [existingGrades, setExistingGrades] = useState([]);

    const [periods, setPeriods] = useState([]);

    const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
    const [activeTeacherDropdown, setActiveTeacherDropdown] = useState(null);
    const [activeSubjectDropdown, setActiveSubjectDropdown] = useState(null);

    useEffect(() => {
        fetchTeachers();
        fetchGrades();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await API.get('/timetable/teachers-list');
            setTeachers(data);
        } catch (err) { console.error("Faculty sync error"); }
    };

    const fetchGrades = async () => {
        try {
            const { data } = await API.get('/timetable/grades/list');
            setExistingGrades(data);
        } catch (err) { console.error("Grade sync error"); }
    };

    const loadTimetable = async (selectedGrade, selectedDay) => {
        if (!selectedGrade) return;
        try {
            const { data } = await API.get(`/timetable/${selectedGrade}`);
            const dayData = data.schedule.find(s => s.day === selectedDay);
            if (dayData && dayData.periods.length > 0) {
                setPeriods(dayData.periods);
            } else {
                setPeriods([{ startTime: '09:00 AM', endTime: '10:00 AM', subject: '', room: '', teacherEmpId: '' }]);
                setMsg(`No records found for ${selectedDay}. Starting fresh block.`);
            }
        } catch (err) { 
            setPeriods([{ startTime: '09:00 AM', endTime: '10:00 AM', subject: '', room: '', teacherEmpId: '' }]);
        }
    };

    const updateTime = (index, field, type, value) => {
        const newPeriods = JSON.parse(JSON.stringify(periods));
        const currentStr = newPeriods[index][field] || "09:00 AM";
        let [time, modifier] = currentStr.split(' ');
        let [hour, minute] = time.split(':');

        let val = value.slice(0, 2);
        if (type === 'hour') hour = val;
        if (type === 'minute') minute = val;

        newPeriods[index][field] = `${hour}:${minute} ${modifier}`;
        setPeriods(newPeriods);
    };

    const validateTimeOnBlur = (index, field, type) => {
        const newPeriods = JSON.parse(JSON.stringify(periods));
        let [time, modifier] = newPeriods[index][field].split(' ');
        let [hour, minute] = time.split(':');

        if (type === 'hour') {
            let hr = parseInt(hour);
            if (isNaN(hr) || hr < 1) hour = "01";
            else if (hr > 12) hour = "12";
            else hour = hr.toString().padStart(2, '0');
        }

        if (type === 'minute') {
            let min = parseInt(minute);
            if (isNaN(min) || min < 0) minute = "00";
            else if (min > 59) minute = "59";
            else minute = min.toString().padStart(2, '0');
        }

        newPeriods[index][field] = `${hour}:${minute} ${modifier}`;
        setPeriods(newPeriods);
    };

    const addPeriod = () => {
        setPeriods([...periods, { startTime: '09:00 AM', endTime: '10:00 AM', subject: '', room: '', teacherEmpId: '' }]);
    };

    const removePeriod = (index) => {
        setPeriods(periods.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
        if (!grade) {
            setMsg("Select a neural node (Class) first! ⚠️");
            return;
        }
        
        const isIncomplete = periods.some(p => !p.teacherEmpId || !p.startTime || !p.subject);
        if (isIncomplete) {
            setMsg("All neural blocks (Time, Teacher, Subject) must be filled! ⚠️");
            return;
        }

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
            setMsg(`Matrix updated for ${grade} (${day})! ⚡`);
        } catch (err) {
            setMsg(err.response?.data?.message || "Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 overscroll-none fixed inset-0 overflow-y-auto">
            {/* Header Area */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-xl relative overflow-visible text-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-12 left-6 bg-white/20 p-3 rounded-2xl border border-white/30 text-white transition-all active:scale-90"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-4xl font-black uppercase tracking-tighter italic px-16">
                    Schedule 
                </h1>
                <p className="text-[14px] font-black text-blue-100 uppercase tracking-[0.2em] mt-2 italic">Edit Timetable </p>

                {/* Top Controls Container */}
                <div className="mt-8 space-y-4 px-2">
                    <div className="relative z-[120]">
                        <div 
                            onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                            className="w-full bg-white border border-blue-100 p-5 rounded-3xl shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <span className="font-black text-[18px] text-[#42A5F5] uppercase italic">
                                {grade || "Select class to modify"}
                            </span>
                            <Plus size={22} className={`text-[#42A5F5] transition-transform duration-300 ${isGradeDropdownOpen ? 'rotate-45' : 'rotate-0'}`} />
                        </div>

                        <AnimatePresence>
                            {isGradeDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsGradeDropdownOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 right-0 mt-3 bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden z-20 ring-1 ring-slate-100"
                                    >
                                        <div className="max-h-60 overflow-y-auto">
                                            {existingGrades.map((g) => (
                                                <div
                                                    key={g}
                                                    onClick={() => {
                                                        setGrade(g);
                                                        loadTimetable(g, day);
                                                        setIsGradeDropdownOpen(false);
                                                    }}
                                                    className={`p-5 text-[17px] font-black italic uppercase border-b border-slate-50 last:border-none cursor-pointer ${grade === g ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    {g}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                            <button
                                key={d}
                                onClick={() => { setDay(d); loadTimetable(grade, d); }}
                                className={`px-6 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-md ${day === d ? 'bg-white text-[#42A5F5]' : 'bg-blue-400 text-white border border-blue-300'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Editable Periods */}
            <div className="px-5 -mt-10 space-y-6 relative z-20">
                {periods.length > 0 ? periods.map((p, index) => (
                    <div key={index} className="bg-white p-6 rounded-[3rem] border border-slate-100 relative group shadow-2xl ring-1 ring-slate-50">
                        <button 
                            onClick={() => removePeriod(index)} 
                            className="absolute top-6 right-8 text-rose-500 hover:scale-110 transition-all p-2 bg-rose-50 rounded-xl"
                        >
                            <Trash2 size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 ml-2">
                            <Calendar size={18} className="text-[#42A5F5]" />
                            <h3 className="text-[19px] font-black text-slate-700 uppercase italic">Time slot {index + 1}</h3>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-[17px] text-slate-900 font-bold ml-2 italic">From</label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[2rem] border border-slate-100 shadow-inner">
                                    <input
                                        type="number" placeholder="HH"
                                        className="w-20 p-4 bg-white rounded-2xl border border-slate-200 text-center text-[20px] font-black text-[#42A5F5] outline-none"
                                        value={p.startTime ? p.startTime.split(':')[0] : ''}
                                        onInput={(e) => e.target.value = e.target.value.slice(0, 2)}
                                        onChange={(e) => updateTime(index, 'startTime', 'hour', e.target.value)}
                                        onBlur={() => validateTimeOnBlur(index, 'startTime', 'hour')}
                                    />
                                    <span className="font-black text-slate-400 text-xl">:</span>
                                    <input
                                        type="number" placeholder="MM"
                                        className="w-20 p-4 bg-white rounded-2xl border border-slate-200 text-center text-[20px] font-black text-[#42A5F5] outline-none"
                                        value={p.startTime ? p.startTime.split(':')[1]?.split(' ')[0] : ''}
                                        onInput={(e) => e.target.value = e.target.value.slice(0, 2)}
                                        onChange={(e) => updateTime(index, 'startTime', 'minute', e.target.value)}
                                        onBlur={() => validateTimeOnBlur(index, 'startTime', 'minute')}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newPeriods = JSON.parse(JSON.stringify(periods));
                                            const currentVal = newPeriods[index].startTime || "09:00 AM";
                                            const [time, oldModifier] = currentVal.split(' ');
                                            const newModifier = oldModifier === 'AM' ? 'PM' : 'AM';
                                            newPeriods[index].startTime = `${time} ${newModifier}`;
                                            setPeriods(newPeriods);
                                        }}
                                        className={`flex-1 p-4 rounded-2xl font-black text-[16px] transition-all shadow-sm ${p.startTime?.includes('PM') ? 'bg-slate-800 text-white' : 'bg-[#42A5F5] text-white'}`}
                                    >
                                        {p.startTime?.split(' ')[1] || 'AM'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[17px] text-slate-900 font-bold ml-2 italic">To</label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[2rem] border border-slate-100 shadow-inner">
                                    <input
                                        type="number" placeholder="HH"
                                        className="w-20 p-4 bg-white rounded-2xl border border-slate-200 text-center text-[20px] font-black text-[#42A5F5] outline-none"
                                        value={p.endTime ? p.endTime.split(':')[0] : ''}
                                        onInput={(e) => e.target.value = e.target.value.slice(0, 2)}
                                        onChange={(e) => updateTime(index, 'endTime', 'hour', e.target.value)}
                                        onBlur={() => validateTimeOnBlur(index, 'endTime', 'hour')}
                                    />
                                    <span className="font-black text-slate-400 text-xl">:</span>
                                    <input
                                        type="number" placeholder="MM"
                                        className="w-20 p-4 bg-white rounded-2xl border border-slate-200 text-center text-[20px] font-black text-[#42A5F5] outline-none"
                                        value={p.endTime ? p.endTime.split(':')[1]?.split(' ')[0] : ''}
                                        onInput={(e) => e.target.value = e.target.value.slice(0, 2)}
                                        onChange={(e) => updateTime(index, 'endTime', 'minute', e.target.value)}
                                        onBlur={() => validateTimeOnBlur(index, 'endTime', 'minute')}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newPeriods = JSON.parse(JSON.stringify(periods));
                                            const currentVal = newPeriods[index].endTime || "10:00 AM";
                                            const [time, oldModifier] = currentVal.split(' ');
                                            const newModifier = oldModifier === 'AM' ? 'PM' : 'AM';
                                            newPeriods[index].endTime = `${time} ${newModifier}`;
                                            setPeriods(newPeriods);
                                        }}
                                        className={`flex-1 p-4 rounded-2xl font-black text-[16px] transition-all shadow-sm ${p.endTime?.includes('PM') ? 'bg-slate-800 text-white' : 'bg-[#42A5F5] text-white'}`}
                                    >
                                        {p.endTime?.split(' ')[1] || 'AM'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1 relative">
                                <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Select teacher</label>
                                <div 
                                    onClick={() => setActiveTeacherDropdown(activeTeacherDropdown === index ? null : index)}
                                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-inner h-[65px]"
                                >
                                    <span className="text-[17px] font-black text-[#42A5F5] uppercase italic truncate">
                                        {p.teacherEmpId 
                                            ? `${teachers.find(t => t.employeeId === p.teacherEmpId)?.name} (${p.teacherEmpId})` 
                                            : "Choose faculty"}
                                    </span>
                                    <Plus size={20} className={`text-[#42A5F5] transition-transform duration-300 ${activeTeacherDropdown === index ? 'rotate-45' : 'rotate-0'}`} />
                                </div>

                                <AnimatePresence>
                                    {activeTeacherDropdown === index && (
                                        <>
                                            <div className="fixed inset-0 z-[130]" onClick={() => setActiveTeacherDropdown(null)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute left-0 right-0 top-[110%] z-[140] bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-slate-100"
                                            >
                                                <div className="max-h-60 overflow-y-auto">
                                                    {teachers.map((t) => (
                                                        <div
                                                            key={t.employeeId}
                                                            onClick={() => {
                                                                const n = [...periods];
                                                                n[index].teacherEmpId = t.employeeId;
                                                                n[index].subject = '';
                                                                setPeriods(n);
                                                                setActiveTeacherDropdown(null);
                                                            }}
                                                            className={`p-5 flex flex-col border-b border-slate-50 last:border-none cursor-pointer ${p.teacherEmpId === t.employeeId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                                        >
                                                            <span className={`text-[17px] font-black italic uppercase ${p.teacherEmpId === t.employeeId ? 'text-[#42A5F5]' : 'text-slate-700'}`}>
                                                                {t.name}
                                                            </span>
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Emp ID: {t.employeeId} • {t.subjects.join(', ')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 relative">
                                    <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Assigned subject</label>
                                    <div 
                                        onClick={() => {
                                            if (!p.teacherEmpId) return setMsg("Neural link error: Please select a teacher first! ⚠️");
                                            setActiveSubjectDropdown(activeSubjectDropdown === index ? null : index);
                                        }}
                                        className={`w-full p-5 rounded-2xl border flex items-center justify-between h-[60px] ${!p.teacherEmpId ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' : 'bg-slate-50 border-slate-100 cursor-pointer shadow-inner'}`}
                                    >
                                        <span className={`text-[17px] font-black uppercase italic truncate ${p.subject ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {p.subject || "Subject"}
                                        </span>
                                        <Plus size={18} className="text-slate-400" />
                                    </div>

                                    <AnimatePresence>
                                        {activeSubjectDropdown === index && (
                                            <>
                                                <div className="fixed inset-0 z-[130]" onClick={() => setActiveSubjectDropdown(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute left-0 right-0 top-[110%] z-[140] bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-slate-100"
                                                >
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {teachers.find(t => t.employeeId === p.teacherEmpId)?.subjects.map((sub) => (
                                                            <div
                                                                key={sub}
                                                                onClick={() => {
                                                                    const n = [...periods];
                                                                    n[index].subject = sub;
                                                                    setPeriods(n);
                                                                    setActiveSubjectDropdown(null);
                                                                }}
                                                                className={`p-5 flex items-center justify-between border-b border-slate-50 last:border-none cursor-pointer ${p.subject === sub ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                                            >
                                                                <span className={`text-[16px] font-black italic uppercase ${p.subject === sub ? 'text-[#42A5F5]' : 'text-slate-600'}`}>{sub}</span>
                                                                {p.subject === sub && <Check size={16} className="text-[#42A5F5]" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Room number</label>
                                    <input
                                        type="text" placeholder="Room no"
                                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[18px] font-black text-[#42A5F5] outline-none"
                                        value={p.room}
                                        onChange={(e) => {
                                            const n = [...periods];
                                            n[index].room = e.target.value;
                                            setPeriods(n);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Calendar className="mx-auto text-slate-200 mb-4" size={56} />
                        <p className="text-slate-400 font-bold text-[16px] italic text-center capitalize px-10">Select a neural node to begin modification</p>
                    </div>
                )}

                {grade && (
                    <div className="flex gap-4 pt-4">
                        <button onClick={addPeriod} className="flex-1 bg-white text-[#42A5F5] border-2 border-blue-100 py-5 rounded-[2.5rem] font-black uppercase text-[15px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">
                            <Plus size={22} /> Add block
                        </button>
                        <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-[#42A5F5] text-white py-5 rounded-[2.5rem] font-black uppercase text-[15px] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                            <Save size={22} /> {loading ? "Updating..." : "Save changes"}
                        </button>
                    </div>
                )}
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminEditTimetable;