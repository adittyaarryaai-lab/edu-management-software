import React, { useState } from 'react';
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
    const [periods, setPeriods] = useState([
        { startTime: '09:00 AM', endTime: '10:00 AM', subject: '', teacher: '' }
    ]);

    const addPeriod = () => {
        setPeriods([...periods, { startTime: '', endTime: '', subject: '', teacher: '' }]);
    };

    const removePeriod = (index) => {
        setPeriods(periods.filter((_, i) => i !== index));
    };
    const handleSave = async () => {
        if (!grade) return alert("Please enter Grade first!");

        setLoading(true);
        try {
            const cleanedPeriods = periods.map(p => {
                const period = {
                    startTime: p.startTime.trim(),
                    endTime: p.endTime.trim(),
                    subject: p.subject.trim()
                };

                const isValidId = /^[0-9a-fA-F]{24}$/.test(p.teacher?.trim());
                if (isValidId) {
                    period.teacher = p.teacher.trim();
                }
                return period;
            });

            const payload = {
                grade: grade.trim().toUpperCase(),
                schedule: [{
                    day: day,
                    periods: cleanedPeriods
                }]
            };

            const { data } = await API.post('/timetable/upload', payload);

            // 1. Success Message
            setMsg(`Timetable for ${grade} Synchronized! ✅`);

            // 2. FORM RESET LOGIC (Yahan se reset hoga)
            setGrade(''); // Grade field khali
            setDay('Monday'); // Day ko default Monday par le aao
            setPeriods([
                { startTime: '09:00 AM', endTime: '10:00 AM', subject: '', teacher: '' }
            ]); // Periods ko wapas ek empty block par reset kar do

        } catch (err) {
            console.error("SERVER ERROR:", err.response?.data);
            alert(`Failed: ${err.response?.data?.message || "Internal Error"}`);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-95 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Timetable Editor</h1>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <input
                        type="text" placeholder="Grade (10-A)"
                        className="bg-slate-900/50 border border-neon/20 p-4 rounded-2xl outline-none placeholder:text-neon/30 font-black text-xs text-white uppercase italic focus:border-neon"
                        value={grade} onChange={(e) => setGrade(e.target.value)}
                    />
                    <div className="relative">
                        <select
                            className="w-full bg-slate-900/50 border border-neon/20 p-4 rounded-2xl outline-none font-black text-xs text-neon/80 italic appearance-none cursor-pointer"
                            value={day} onChange={(e) => setDay(e.target.value)}
                        >
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                <option key={d} value={d} className="bg-void text-white">{d}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon/40 text-[8px]">▼</div>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                {periods.map((p, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 relative group italic">
                        {periods.length > 1 && (
                            <button onClick={() => removePeriod(index)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 p-2 transition-all">
                                <Trash2 size={18} />
                            </button>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-black text-neon/40 uppercase ml-2 italic tracking-widest leading-none">Start Cycle</label>
                                    <input type="text" placeholder="09:00 AM" className="w-full bg-void p-3 rounded-xl border border-neon/10 text-xs font-black text-white italic outline-none focus:border-neon/40 mt-1"
                                        value={p.startTime} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].startTime = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-neon/40 uppercase ml-2 italic tracking-widest leading-none">End Cycle</label>
                                    <input type="text" placeholder="10:00 AM" className="w-full bg-void p-3 rounded-xl border border-neon/10 text-xs font-black text-white italic outline-none focus:border-neon/40 mt-1"
                                        value={p.endTime} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].endTime = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-neon/40 uppercase ml-2 italic tracking-widest leading-none">Subject Identity</label>
                                    <input type="text" placeholder="e.g. QUANTUM PHYSICS" className="w-full bg-void p-4 rounded-2xl border border-neon/10 text-sm font-black text-white italic uppercase outline-none focus:border-neon mt-1"
                                        value={p.subject} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].subject = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-neon/40 uppercase ml-2 italic tracking-widest leading-none">Faculty Hash (Optional)</label>
                                    <input type="text" placeholder="24-char ID or blank" className="w-full bg-void p-4 rounded-2xl border border-white/5 text-[10px] font-mono text-neon/60 outline-none focus:border-neon/40 mt-1"
                                        value={p.teacher} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].teacher = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4 mt-6 italic">
                    <button onClick={addPeriod} className="flex-1 bg-void text-neon border border-neon/20 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                        <Plus size={20} /> Add Block
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-neon text-void py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600"
                    >
                        <Save size={20} /> {loading ? "Syncing..." : "Execute Sync"}
                    </button>
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminTimetable;