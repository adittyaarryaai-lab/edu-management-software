import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, Plus, Calendar, Clock, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const TeacherLiveClass = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        subject: '', grade: '', topic: '', startTime: '', meetingLink: ''
    });

useEffect(() => {
    const fetchMyClasses = async () => {
        try {
            const { data } = await API.get('/live-classes/teacher/my-classes'); 
            setClasses(data);
        } catch (err) {
            console.error("Teacher classes fetch error:", err);
        }
    };
    fetchMyClasses();
}, []);

const handleSchedule = async (e) => {
    e.preventDefault();
    try {
        const { data } = await API.post('/live-classes/schedule', formData);
        alert("Neural Session Broadcasted! 📡");
        setClasses([...classes, data]); 
        setFormData({ subject: '', grade: '', topic: '', startTime: '', meetingLink: '' });
    } catch (err) {
        alert("Schedule Failed!");
    }
};

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 border border-white/10 text-neon transition-all active:scale-90 relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">Meeting Manager</h1>
            </div>

            <div className="px-5 -mt-8 space-y-6 relative z-20">
                {/* Schedule Form */}
                <form onSubmit={handleSchedule} className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-neon/20 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="SUBJECT" className="bg-void border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-neon text-white italic" 
                            onChange={(e) => setFormData({...formData, subject: e.target.value})} value={formData.subject} required />
                        <input type="text" placeholder="SECTOR (e.g. 10-A)" className="bg-void border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-neon text-white italic"
                            onChange={(e) => setFormData({...formData, grade: e.target.value})} value={formData.grade} required />
                    </div>
                    <input type="text" placeholder="NEURAL TOPIC NAME" className="w-full bg-void border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-neon text-white italic"
                        onChange={(e) => setFormData({...formData, topic: e.target.value})} value={formData.topic} required />
                    <input type="datetime-local" className="w-full bg-void border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase outline-none text-neon italic"
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})} value={formData.startTime} required />
                    <input type="url" placeholder="LINK (Zoom/Meet/Neural)" className="w-full bg-void border border-white/5 p-4 rounded-2xl text-[10px] font-black outline-none focus:border-neon text-white italic"
                        onChange={(e) => setFormData({...formData, meetingLink: e.target.value})} value={formData.meetingLink} required />
                    
                    <button type="submit" className="w-full bg-neon text-void py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all italic">
                        <Plus size={16}/> Schedule Session Matrix
                    </button>
                </form>

                {/* History List */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-widest ml-4 italic">Active Neural Links</h3>
                    {classes.map((c, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white/5 flex justify-between items-center group hover:border-neon/30 transition-all italic">
                            <div>
                                <h4 className="font-black text-white text-sm uppercase italic tracking-tight group-hover:text-neon transition-colors">{c.subject}</h4>
                                <p className="text-[9px] font-black text-neon/40 uppercase tracking-widest mt-1">{c.grade} • {c.topic}</p>
                            </div>
                            <div className="flex gap-2">
                                <a href={c.meetingLink} target="_blank" rel="noreferrer" className="p-3 bg-neon/10 text-neon rounded-xl border border-neon/20 hover:bg-neon hover:text-void transition-all"><LinkIcon size={16}/></a>
                                <button className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherLiveClass;