import React, { useState } from 'react';
import { ArrowLeft, Send, Megaphone, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const TeacherNotices = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        targetGrade: 'All'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/notices', formData);
            alert("Notice Broadcasted Successfully! 🚀");
            navigate('/notice-feed');
        } catch (err) {
            alert("Failed to post notice. Check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4"><ArrowLeft size={20}/></button>
                <h1 className="text-xl font-black uppercase tracking-tight">Broadcast Notice</h1>
            </div>

            <div className="px-5 -mt-8">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-5 border border-slate-50">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Announcement Title</label>
                        <input type="text" placeholder="e.g. Sports Day Update" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:border-blue-500" 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Category</label>
                            <select className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold outline-none"
                                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="General">General</option>
                                <option value="Exam">Exam</option>
                                <option value="Event">Event</option>
                                <option value="Holiday">Holiday</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Target Class</label>
                            <input type="text" placeholder="All / 10-A" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold outline-none"
                                onChange={(e) => setFormData({...formData, targetGrade: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Notice Content</label>
                        <textarea placeholder="Write your message here..." className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold h-32 outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({...formData, content: e.target.value})} required />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                        {loading ? "Transmitting..." : <><Send size={18}/> Push Announcement</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherNotices;