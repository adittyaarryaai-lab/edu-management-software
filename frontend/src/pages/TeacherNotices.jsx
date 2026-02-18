import React, { useState } from 'react';
import { ArrowLeft, Send, Megaphone, AlertCircle, Users } from 'lucide-react';
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
        audience: 'specific_grade', // FIXED: Teacher default specific grade hi bhejega
        targetGrade: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // FIXED: targetGrade ko trim karke bhej rahe hain taaki security bypass na ho
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
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {showToast && <Toast message="Class Broadcast Successful! 📡" type="success" onClose={() => setShowToast(false)} />}
            
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4 active:scale-90 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tight italic">Class Broadcast</h1>
                <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mt-1">Direct Student Communication</p>
            </div>

            <div className="px-5 -mt-8">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-5 border border-white relative z-20">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest italic">Target Class / Grade</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input 
                                type="text" 
                                placeholder="e.g. 10-A" 
                                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:border-blue-600 transition-all uppercase"
                                onChange={(e) => setFormData({...formData, targetGrade: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest italic">Broadcast Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Tomorrow's Lab Session" 
                            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest italic">Neural Message</label>
                        <textarea 
                            placeholder="Write your detailed announcement here..." 
                            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold h-32 outline-none focus:border-blue-600 transition-all italic"
                            onChange={(e) => setFormData({...formData, content: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-slate-950 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        {loading ? "Transmitting..." : <><Send size={18}/> Initiate Broadcast</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherNotices;