import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Users, GraduationCap, Globe, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const AdminGlobalNotice = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Meta Data States
    const [availableClasses, setAvailableClasses] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        audience: 'all',
        targetGrade: [], // Now an Array for multiple classes
        targetTeachers: [] // Array for multiple teachers
    });

    // --- DAY 127: FETCH METADATA ---
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [classRes, teacherRes] = await Promise.all([
                    API.get('/notices/meta/classes'),
                    API.get('/notices/meta/teachers')
                ]);
                setAvailableClasses(classRes.data);
                setAvailableTeachers(teacherRes.data);
            } catch (err) { console.error("Meta Sync Error"); }
        };
        fetchMeta();
    }, []);

    // Selection Logic
    const toggleGrade = (grade) => {
        setFormData(prev => ({
            ...prev,
            targetGrade: prev.targetGrade.includes(grade) 
                ? prev.targetGrade.filter(g => g !== grade) 
                : [...prev.targetGrade, grade]
        }));
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        
        // Validation for Class/Staff mode
        if (formData.audience === 'specific_grade' && formData.targetGrade.length === 0) {
            return alert("Neural Link Error: Please select at least one class.");
        }

        setLoading(true);
        try {
            await API.post('/notices/create', {
                ...formData,
                // Agar audience 'all' hai toh 'All' string bhejo, varna selected array
                targetGrade: formData.audience === 'specific_grade' ? formData.targetGrade : 'All'
            });
            setShowToast(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Broadcast Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {showToast && <Toast message="Notice Broadcasted Globally! 🚀" type="success" onClose={() => setShowToast(false)} />}

            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl relative overflow-hidden border-b border-neon/20">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neon/5 to-transparent"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-6 border border-white/10 text-neon transition-all active:scale-90"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                    <Globe className="text-neon animate-spin-slow" /> Global Broadcast
                </h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.3em] mt-1 italic">Neural Network Communication</p>
            </div>

            <div className="px-5 -mt-12 relative z-20">
                <form onSubmit={handleBroadcast} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-neon/20 space-y-6">
                    
                    {/* Audience Selector */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'all', label: 'ALL', icon: <Globe size={14}/> },
                            { id: 'teachers', label: 'STAFF', icon: <Users size={14}/> },
                            { id: 'specific_grade', label: 'CLASS', icon: <GraduationCap size={14}/> }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => setFormData({...formData, audience: opt.id})}
                                className={`py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${formData.audience === opt.id ? 'bg-neon text-void border-neon shadow-[0_0_10px_rgba(61,242,224,0.3)]' : 'bg-void text-neon/40 border-neon/10'}`}
                            >
                                {opt.icon}
                                <span className="text-[8px] font-black uppercase">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* --- DAY 127: MULTI-CLASS DROPDOWN UI --- */}
                    {formData.audience === 'specific_grade' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Target Neural Sectors</label>
                                <button 
                                    type="button" 
                                    onClick={() => setFormData({...formData, targetGrade: availableClasses})}
                                    className="text-[8px] font-black text-neon border-b border-neon/30 pb-0.5 uppercase"
                                > Select All Classes </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-void/50 rounded-2xl border border-white/5 shadow-inner">
                                {availableClasses.length > 0 ? availableClasses.map((cls) => (
                                    <button
                                        key={cls}
                                        type="button"
                                        onClick={() => toggleGrade(cls)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all flex items-center gap-2 ${formData.targetGrade.includes(cls) ? 'bg-neon text-void border-neon' : 'bg-void text-white/40 border-white/5'}`}
                                    >
                                        {formData.targetGrade.includes(cls) && <Check size={10} />}
                                        {cls}
                                    </button>
                                )) : (
                                    <p className="text-[8px] text-white/20 p-2 uppercase">Syncing Classes...</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Broadcast Inputs */}
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Broadcast Title</label>
                        <input 
                            type="text" 
                            placeholder="URGENT: HOLIDAY NOTICE" 
                            className="w-full bg-void p-5 rounded-2xl border border-neon/20 mt-1 font-black outline-none focus:border-neon text-white italic uppercase tracking-widest text-xs"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Neural Message Payload</label>
                        <textarea 
                            rows="4"
                            placeholder="Type your neural message here..." 
                            className="w-full bg-void p-5 rounded-2xl border border-neon/20 mt-1 font-black outline-none focus:border-neon text-white italic text-xs leading-relaxed"
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-neon text-void py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_30px_rgba(61,242,224,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                    >
                        {loading ? "Transmitting Signal..." : <><Send size={18}/> Initiate Broadcast</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminGlobalNotice;