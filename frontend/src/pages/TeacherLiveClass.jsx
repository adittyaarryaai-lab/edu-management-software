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

   // useEffect wala part update karo:
useEffect(() => {
    const fetchMyClasses = async () => {
        try {
            // Naya sahi route hit kar rahe hain
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
        // Bina refresh kiye card add karne ke liye:
        setClasses([...classes, data]); 
        // Form khali karne ke liye:
        setFormData({ subject: '', grade: '', topic: '', startTime: '', meetingLink: '' });
    } catch (err) {
        alert("Schedule Failed!");
    }
};

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4"><ArrowLeft size={20}/></button>
                <h1 className="text-xl font-black uppercase tracking-tight">Meeting Manager</h1>
            </div>

            <div className="px-5 -mt-8 space-y-6">
                {/* Schedule Form */}
                <form onSubmit={handleSchedule} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="SUBJECT" className="bg-slate-50 p-4 rounded-2xl border text-[10px] font-black uppercase outline-none focus:border-blue-500" 
                            onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                        <input type="text" placeholder="GRADE (e.g. 10-A)" className="bg-slate-50 p-4 rounded-2xl border text-[10px] font-black uppercase outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({...formData, grade: e.target.value})} required />
                    </div>
                    <input type="text" placeholder="TOPIC NAME" className="w-full bg-slate-50 p-4 rounded-2xl border text-[10px] font-black uppercase outline-none focus:border-blue-500"
                        onChange={(e) => setFormData({...formData, topic: e.target.value})} required />
                    <input type="datetime-local" className="w-full bg-slate-50 p-4 rounded-2xl border text-[10px] font-black uppercase outline-none"
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
                    <input type="url" placeholder="MEETING LINK (Zoom/Meet)" className="w-full bg-slate-50 p-4 rounded-2xl border text-[10px] font-black outline-none"
                        onChange={(e) => setFormData({...formData, meetingLink: e.target.value})} required />
                    
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <Plus size={16}/> Schedule Session
                    </button>
                </form>

                {/* History List */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Your Active Links</h3>
                    {classes.map((c, i) => (
                        <div key={i} className="bg-white p-5 rounded-[2.5rem] shadow-lg border border-slate-50 flex justify-between items-center">
                            <div>
                                <h4 className="font-black text-slate-800 text-sm uppercase italic">{c.subject}</h4>
                                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{c.grade} • {c.topic}</p>
                            </div>
                            <div className="flex gap-2">
                                <a href={c.meetingLink} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl"><LinkIcon size={16}/></a>
                                <button className="p-3 bg-red-50 text-red-600 rounded-xl"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherLiveClass;