import React, { useState } from 'react';
import { ArrowLeft, Send, Megaphone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const TeacherNotices = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        audience: 'specific_grade', 
        targetGrade: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/notices/create', {
                ...formData,
                targetGrade: formData.targetGrade.trim().toUpperCase()
            });
            setShowToast(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post notice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {showToast && <Toast message="Class Broadcast Successful! 📡" type="success" onClose={() => setShowToast(false)} />}
            
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 active:scale-90 border border-white/10 text-neon transition-all relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">Class Broadcast</h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mt-1 relative z-10">Direct Student Communication</p>
            </div>

            <div className="px-5 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-neon/20 space-y-6">
                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Target Neural Sector</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-4 text-neon/30" size={18} />
                            <input 
                                type="text" 
                                placeholder="e.g. 10-A" 
                                className="w-full bg-void p-4 pl-12 rounded-2xl border border-white/5 text-sm font-black text-white outline-none focus:border-neon transition-all uppercase italic"
                                onChange={(e) => setFormData({...formData, targetGrade: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Signal Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Protocol Update" 
                            className="w-full bg-void p-4 rounded-2xl border border-white/5 text-sm font-black text-white outline-none focus:border-neon transition-all italic uppercase tracking-tighter" 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-neon/40 uppercase ml-2 mb-2 block tracking-widest italic">Neural Payload</label>
                        <textarea 
                            placeholder="Write your detailed transmission here..." 
                            className="w-full bg-void p-4 rounded-2xl border border-white/5 text-sm font-black text-white h-32 outline-none focus:border-neon transition-all italic placeholder:text-white/10"
                            onChange={(e) => setFormData({...formData, content: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_0_30px_rgba(61,242,224,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all italic"
                    >
                        {loading ? "Transmitting..." : <><Send size={18}/> Initiate Broadcast</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherNotices;