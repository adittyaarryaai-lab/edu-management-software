import React, { useState } from 'react';
import { ArrowLeft, Upload, Book, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const TeacherUploadSyllabus = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ grade: '', subject: '', title: '', description: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await API.post('/syllabus/upload', formData);
            alert("Syllabus Uploaded! 🚀");
            navigate(-1);
        } catch (err) { alert("Upload Failed!"); }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans italic">
             <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-2xl shadow-md mb-6"><ArrowLeft /></button>
             <h2 className="text-2xl font-black uppercase mb-8">Upload Syllabus</h2>
             <form onSubmit={handleUpload} className="space-y-4">
                 <input type="text" placeholder="Grade (e.g. 10-A)" className="w-full p-4 rounded-2xl border" onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                 <input type="text" placeholder="Subject" className="w-full p-4 rounded-2xl border" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                 <input type="text" placeholder="Title" className="w-full p-4 rounded-2xl border" onChange={(e) => setFormData({...formData, title: e.target.value})} />
                 <textarea placeholder="Description" className="w-full p-4 rounded-2xl border" onChange={(e) => setFormData({...formData, description: e.target.value})} />
                 <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">BROADCAST SYLLABUS</button>
             </form>
        </div>
    );
};
export default TeacherUploadSyllabus;