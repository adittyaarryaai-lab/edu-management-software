import React, { useState } from 'react';
import { ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const TeacherUploadSyllabus = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ grade: '', subject: '', title: '', description: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await API.post('/syllabus/upload', formData);
            alert("Neural Mapping Uploaded! 🚀");
            navigate(-1);
        } catch (err) { alert("Upload Failed!"); }
    };

    return (
        <div className="min-h-screen bg-void p-6 font-sans italic text-white">
             <button onClick={() => navigate(-1)} className="bg-white/5 p-3 rounded-2xl shadow-lg mb-8 border border-white/10 text-neon transition-all active:scale-90"><ArrowLeft /></button>
             <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                 <Layers className="text-neon animate-pulse" /> Upload Syllabus Matrix
             </h2>
             <form onSubmit={handleUpload} className="space-y-5 bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-neon/20 shadow-2xl">
                 <input type="text" placeholder="SECTOR (e.g. 10-A)" className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black text-white italic outline-none focus:border-neon uppercase" onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                 <input type="text" placeholder="SUBJECT NODE" className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black text-white italic outline-none focus:border-neon uppercase" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                 <input type="text" placeholder="MODULE TITLE" className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black text-white italic outline-none focus:border-neon uppercase" onChange={(e) => setFormData({...formData, title: e.target.value})} />
                 <textarea placeholder="DETAILED SYLLABUS DESCRIPTION..." className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black text-white italic h-32 outline-none focus:border-neon" onChange={(e) => setFormData({...formData, description: e.target.value})} />
                 <button className="w-full bg-neon text-void py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_0_30px_rgba(61,242,224,0.4)] active:scale-95 transition-all italic">
                     Broadcast Syllabus Protocol
                 </button>
             </form>
        </div>
    );
};
export default TeacherUploadSyllabus;