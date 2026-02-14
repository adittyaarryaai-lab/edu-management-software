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
            // FIX: Teacher ID ko clean karo. Agar khali string hai toh use undefined bhejenge
            // taaki Mongoose validation fail na ho.
            const cleanedPeriods = periods.map(p => {
                const period = { ...p };
                if (!period.teacher || period.teacher.trim() === "") {
                    delete period.teacher; // Khali teacher field uda do
                }
                return period;
            });

            const payload = {
                grade,
                schedule: [{ day, periods: cleanedPeriods }]
            };

            await API.post('/timetable/upload', payload);
            setMsg(`Timetable for ${grade} (${day}) saved!`);
        } catch (err) {
            console.error("Save Error:", err.response?.data);
            alert(err.response?.data?.message || "Error saving timetable. Check Console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-95 transition-all">
                        <ArrowLeft size={20}/>
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Timetable Editor</h1>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" placeholder="Grade (10-A)" 
                        className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none placeholder:text-white/50 font-bold"
                        value={grade} onChange={(e) => setGrade(e.target.value)}
                    />
                    <select 
                        className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none font-bold"
                        value={day} onChange={(e) => setDay(e.target.value)}
                    >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                            <option key={d} value={d} className="text-slate-800">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4">
                {periods.map((p, index) => (
                    <div key={index} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 relative animate-in slide-in-from-right duration-300">
                        <button onClick={() => removePeriod(index)} className="absolute top-4 right-4 text-red-400 p-2 active:scale-90 transition-all">
                            <Trash2 size={18}/>
                        </button>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Start Time</label>
                                    <input type="text" placeholder="09:00 AM" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold" 
                                        value={p.startTime} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].startTime = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">End Time</label>
                                    <input type="text" placeholder="10:00 AM" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold"
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
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Subject</label>
                                    <input type="text" placeholder="e.g. Mathematics" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold"
                                        value={p.subject} onChange={(e) => {
                                            const newPeriods = [...periods];
                                            newPeriods[index].subject = e.target.value;
                                            setPeriods(newPeriods);
                                        }}
                                    />
                                </div>
                                {/* Teacher ID input - abhi manually bhar rahe hain, baad mein dropdown karenge */}
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Teacher ID (Optional)</label>
                                    <input type="text" placeholder="MongoID or leave blank" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-mono"
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

                <div className="flex gap-4 mt-6">
                    <button onClick={addPeriod} className="flex-1 bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                        <Plus size={20}/> Add Period
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:bg-slate-300"
                    >
                        <Save size={20}/> {loading ? "Saving..." : "Save All"}
                    </button>
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminTimetable;