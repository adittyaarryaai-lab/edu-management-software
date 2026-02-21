import React, { useState } from 'react';
import { ArrowLeft, Send, Users, GraduationCap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const AdminGlobalNotice = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        audience: 'all',
        targetGrade: ''
    });

    const handleBroadcast = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/notices/create', formData);
            setShowToast(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Broadcast Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void dark:bg-void pb-24 font-sans italic">
            {showToast && <Toast message="Notice Broadcasted Globally! 🚀" type="success" onClose={() => setShowToast(false)} />}

            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl relative overflow-hidden border-b border-neon/20">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neon/5 to-transparent"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-6 border border-white/10 text-neon"><ArrowLeft size={20}/></button>
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

                    {formData.audience === 'specific_grade' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Target Neural Grade</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 10-A" 
                                className="w-full bg-void p-4 rounded-2xl border border-neon/20 mt-1 font-black outline-none focus:border-neon text-white italic"
                                onChange={(e) => setFormData({...formData, targetGrade: e.target.value})}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Broadcast Title</label>
                        <input 
                            type="text" 
                            placeholder="URGENT: HOLIDAY NOTICE" 
                            className="w-full bg-void p-4 rounded-2xl border border-neon/20 mt-1 font-black outline-none focus:border-neon text-white italic uppercase"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 tracking-widest italic">Neural Message Payload</label>
                        <textarea 
                            rows="4"
                            placeholder="Type your neural message here..." 
                            className="w-full bg-void p-4 rounded-2xl border border-neon/20 mt-1 font-black outline-none focus:border-neon text-white italic"
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_25px_rgba(61,242,224,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                    >
                        {loading ? "Transmitting..." : <><Send size={18}/> Initiate Broadcast</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminGlobalNotice;