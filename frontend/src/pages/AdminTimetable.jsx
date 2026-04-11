import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

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

    const [availableGrades, setAvailableGrades] = useState([]);
    const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
    const [activeTeacherDropdown, setActiveTeacherDropdown] = useState(null); // index store karega
    const [activeSubjectDropdown, setActiveSubjectDropdown] = useState(null); // index store karega

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const { data } = await API.get('/timetable/meta/student-grades');
                setAvailableGrades(data);
            } catch (err) { console.error("Grades fetch failed"); }
        };
        fetchGrades();
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await API.get('/timetable/teachers-list');
            setTeachers(data);
        } catch (err) { console.error("Faculty fetch failed"); }
    };

    const addPeriod = () => {
        setPeriods([...periods, { startTime: '', endTime: '', subject: '', room: '', teacherEmpId: '' }]);
    };

    const removePeriod = (index) => {
        setPeriods(periods.filter((_, i) => i !== index));
    };

    // 1. ISKO ALAG SE RAKHO (Main Level Par)
    const fetchAvailability = async (index, currentDay, startTime) => {
        if (!startTime || !currentDay) return;
        try {
            const { data } = await API.post('/timetable/meta/available-resources', {
                day: currentDay,
                startTime,
                excludeGrade: grade
            });

            const newPeriods = [...periods];
            newPeriods[index].availableTeachers = data.availableTeachers;
            newPeriods[index].occupiedRooms = data.occupiedRooms;
            setPeriods(newPeriods);
        } catch (err) { console.error("Availability check failed"); }
    };

    // 2. Updated UpdateTime (AM/PM par turant fetch karega)
    const updateTime = (index, field, type, value) => {
        const newPeriods = [...periods];
        const currentStr = newPeriods[index][field] || "09:00 AM";
        let [time, modifier] = currentStr.split(' ');
        let [hour, minute] = time.split(':');

        if (type === 'hour') hour = value.slice(0, 2);
        if (type === 'minute') minute = value.slice(0, 2);

        // --- MOBILE FIX: Direct Assignment ---
        if (type === 'period') {
            modifier = value;
        }

        const updatedTimeStr = `${hour}:${minute} ${modifier}`;
        newPeriods[index][field] = updatedTimeStr;
        setPeriods(newPeriods);

        // Agar modifier (AM/PM) badla hai, toh turant fetch karo bina kisi delay ke
        if (type === 'period') {
            fetchAvailability(index, day, updatedTimeStr);
        }
    };

    // 3. validateTimeOnBlur (Fetch add kar diya)
    // validateTimeOnBlur ko simple rakho, ye sirf correction karega
    const validateTimeOnBlur = (index, field, type) => {
        const newPeriods = [...periods];
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

        // AM/PM ko capital kardo automatically
        if (type === 'period') {
            modifier = modifier.toUpperCase();
            if (modifier !== 'AM' && modifier !== 'PM') modifier = 'AM';
        }

        const finalTime = `${hour}:${minute} ${modifier}`;
        newPeriods[index][field] = finalTime;
        setPeriods(newPeriods);

        fetchAvailability(index, day, finalTime);
    };

    const handleSave = async () => {
    if (!grade) {
        setMsg("Neural Link Error: Please select class sector! ⚠️");
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
            grade: grade.trim().toUpperCase(),
            schedule: [{
                day: day,
                periods: periods.map(p => ({
                    startTime: p.startTime,
                    endTime: p.endTime,
                    subject: p.subject.toUpperCase(),
                    room: p.room || "N/A",
                    teacherEmpId: p.teacherEmpId
                }))
            }]
        };

        const res = await API.post('/timetable/upload', payload);
        // Success Message
        setMsg(`Matrix synchronized for ${grade} (${day})! ⚡`);

        // Reset fields after successful sync
        setGrade('');
        setPeriods([{ startTime: '09:00 AM', endTime: '10:00 AM', subject: '', room: '', teacherEmpId: '' }]);
    } catch (err) {
        // --- YE LINE SAARA KAAM KAREGI ---
        // Backend se aane wala conflict message yahan toast mein jayega
        setMsg(err.response?.data?.message || "Critical Sync Failure!");
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
                    Timetable management
                </h1>
                <p className="text-[14px] font-black text-blue-100 uppercase tracking-[0.2em] mt-2 italic">Schedule manager</p>

                {/* Top Controls Container */}
                <div className="mt-8 space-y-4 px-2">
                    {/* --- SMART CLASS SECTOR DROPDOWN (REPLACES INPUT) --- */}
                    <div className="relative z-[120]">
                        <div
                            onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                            className="w-full bg-white border border-blue-100 p-5 rounded-3xl shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <span className="font-black text-[18px] text-[#42A5F5] uppercase italic">
                                {grade || "Select class sector"}
                            </span>
                            <div className={`transition-transform duration-300 ${isGradeDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                                <Plus size={22} className="text-[#42A5F5]" />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
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
                                            {availableGrades.length > 0 ? (
                                                availableGrades.map((g) => (
                                                    <div
                                                        key={g}
                                                        onClick={() => {
                                                            setGrade(g);
                                                            setIsGradeDropdownOpen(false);
                                                        }}
                                                        className={`p-5 text-[17px] font-black italic uppercase transition-all border-b border-slate-50 last:border-none cursor-pointer
                                        ${grade === g ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                                    >
                                                        {g}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-5 text-center text-slate-400 font-bold italic">
                                                    No classes found in student records
                                                </div>
                                            )}
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
                                onClick={() => setDay(d)}
                                className={`px-6 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-md ${day === d ? 'bg-white text-[#42A5F5]' : 'bg-blue-400 text-white border border-blue-300'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Slots Container */}
            <div className="px-5 -mt-10 space-y-6 relative z-20">
                {periods.map((p, index) => (
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

                        <div className="space-y-6 mb-6">
                            {/* --- FROM SECTOR --- */}
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
                                            const currentModifier = p.startTime?.includes('AM') ? 'PM' : 'AM';
                                            updateTime(index, 'startTime', 'period', currentModifier);
                                        }}
                                        className={`flex-1 p-4 rounded-2xl font-black text-[16px] transition-all shadow-sm ${p.startTime?.includes('PM') ? 'bg-slate-800 text-white' : 'bg-[#42A5F5] text-white'}`}
                                    >
                                        {p.startTime?.includes('PM') ? 'PM' : 'AM'}
                                    </button>
                                </div>
                            </div>

                            {/* --- TO SECTOR --- */}
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
                                            const currentModifier = p.endTime?.includes('AM') ? 'PM' : 'AM';
                                            updateTime(index, 'endTime', 'period', currentModifier);
                                        }}
                                        className={`flex-1 p-4 rounded-2xl font-black text-[16px] transition-all shadow-sm ${p.endTime?.includes('PM') ? 'bg-slate-800 text-white' : 'bg-[#42A5F5] text-white'}`}
                                    >
                                        {p.endTime?.includes('PM') ? 'PM' : 'AM'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 1. ASSIGNED FACULTY (School ke saare teachers aayenge) */}
                            <div className="space-y-1 relative">
                                <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Select teacher</label>

                                {/* Custom Dropdown Trigger */}
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

                                {/* Custom Dropdown Menu */}
                                <AnimatePresence>
                                    {activeTeacherDropdown === index && (
                                        <>
                                            {/* Overlay to close dropdown */}
                                            <div className="fixed inset-0 z-[130]" onClick={() => setActiveTeacherDropdown(null)} />

                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute left-0 right-0 top-[110%] z-[140] bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-slate-100"
                                            >
                                                <div className="max-h-60 overflow-y-auto scrollbar-hide">
                                                    {teachers.length > 0 ? (
                                                        teachers.map((t) => (
                                                            <div
                                                                key={t.employeeId}
                                                                onClick={() => {
                                                                    const n = [...periods];
                                                                    n[index].teacherEmpId = t.employeeId;
                                                                    n[index].subject = ''; // Subject reset
                                                                    setPeriods(n);
                                                                    setActiveTeacherDropdown(null);
                                                                }}
                                                                className={`p-5 flex flex-col border-b border-slate-50 last:border-none cursor-pointer transition-all ${p.teacherEmpId === t.employeeId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                                            >
                                                                <span className={`text-[17px] font-black italic uppercase ${p.teacherEmpId === t.employeeId ? 'text-[#42A5F5]' : 'text-slate-700'}`}>
                                                                    {t.name}
                                                                </span>
                                                                <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                                                                    Emp ID: {t.employeeId} • {t.subjects.join(', ')}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-5 text-center text-slate-400 font-bold italic">No teachers found</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* 2. SUBJECT (Sirf slected teacher ke registered subjects dikhenge) */}
                                {/* 2. SUBJECT (Sirf selected teacher ke registered subjects dikhenge) */}
                                <div className="space-y-1 relative">
                                    <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Subjects</label>

                                    {/* Custom Dropdown Trigger */}
                                    <div
                                        onClick={() => {
                                            if (!p.teacherEmpId) {
                                                // alert hatakar setMsg use kiya
                                                setMsg("Please select a teacher first! ⚠️");
                                                return;
                                            }
                                            setActiveSubjectDropdown(activeSubjectDropdown === index ? null : index);
                                        }}
                                        className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all shadow-inner h-[60px] 
            ${!p.teacherEmpId ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' : 'bg-slate-50 border-slate-100 cursor-pointer active:scale-[0.98]'}`}
                                    >
                                        <span className={`text-[17px] font-black uppercase italic truncate ${p.subject ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {p.subject || "Choose subject"}
                                        </span>
                                        <Plus size={18} className={`text-slate-400 transition-transform duration-300 ${activeSubjectDropdown === index ? 'rotate-45' : 'rotate-0'}`} />
                                    </div>

                                    {/* Custom Dropdown Menu */}
                                    <AnimatePresence>
                                        {activeSubjectDropdown === index && (
                                            <>
                                                {/* Overlay to close dropdown */}
                                                <div className="fixed inset-0 z-[130]" onClick={() => setActiveSubjectDropdown(null)} />

                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute left-0 right-0 top-[110%] z-[140] bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-slate-100"
                                                >
                                                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                                                        {p.teacherEmpId && teachers.find(t => t.employeeId === p.teacherEmpId)?.subjects.length > 0 ? (
                                                            teachers.find(t => t.employeeId === p.teacherEmpId).subjects.map((sub) => (
                                                                <div
                                                                    key={sub}
                                                                    onClick={() => {
                                                                        const n = [...periods];
                                                                        n[index].subject = sub;
                                                                        setPeriods(n);
                                                                        setActiveSubjectDropdown(null);
                                                                    }}
                                                                    className={`p-5 flex items-center justify-between border-b border-slate-50 last:border-none cursor-pointer transition-all ${p.subject === sub ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                                                >
                                                                    <span className={`text-[16px] font-black italic uppercase ${p.subject === sub ? 'text-[#42A5F5]' : 'text-slate-600'}`}>
                                                                        {sub}
                                                                    </span>
                                                                    {p.subject === sub && <Check size={16} className="text-[#42A5F5]" />}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-5 text-center text-slate-400 font-bold italic">No subjects registered</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 3. ROOM NUMBER (Khaali hai ya nahi Admin khud likhega) */}
                                <div className="space-y-1">
                                    <label className="text-[17px] text-slate-900 font-bold ml-2 italic">Room number</label>
                                    <input
                                        type="text"
                                        placeholder="Room no"
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
                ))}

                <div className="flex gap-4 pt-6">
                    <button onClick={addPeriod} className="flex-1 bg-white text-[#42A5F5] border-2 border-blue-100 py-5 rounded-[2.5rem] font-black uppercase text-[15px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">
                        <Plus size={22} /> Add slot
                    </button>
                    <button onClick={handleSave} disabled={loading} className="flex-1 bg-[#42A5F5] text-white py-5 rounded-[2.5rem] font-black uppercase text-[15px] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <Save size={22} /> {loading ? "Saving..." : "Execute"}
                    </button>
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminTimetable;