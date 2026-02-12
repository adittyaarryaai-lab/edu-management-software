import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Megaphone, Calendar, Send, Users } from 'lucide-react';

const Notices = ({ user }) => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState({ title: '', message: '', targetAudience: 'all' });

    const fetchNotices = async () => {
        const res = await API.get('/notices');
        setNotices(res.data);
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/notices', newNotice);
            setNewNotice({ title: '', message: '', targetAudience: 'all' });
            fetchNotices();
            alert("Announcement Published!");
        } catch (err) {
            alert("Error posting notice");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Post a Notice (Only for Admin/Teacher) */}
            {(user.role === 'admin' || user.role === 'teacher') && (
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Megaphone className="text-blue-600" size={20} /> New Announcement
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Notice Title" required
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newNotice.title}
                                onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                            />
                            <textarea 
                                placeholder="Type your message here..." required rows="4"
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newNotice.message}
                                onChange={e => setNewNotice({...newNotice, message: e.target.value})}
                            ></textarea>
                            <select 
                                className="w-full border p-2 rounded-lg"
                                value={newNotice.targetAudience}
                                onChange={e => setNewNotice({...newNotice, targetAudience: e.target.value})}
                            >
                                <option value="all">Everyone</option>
                                <option value="teacher">Teachers Only</option>
                                <option value="student">Students Only</option>
                                <option value="parent">Parents Only</option>
                            </select>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                                <Send size={18} /> Post Notice
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Notice Feed */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Latest Notices</h3>
                {notices.length === 0 && <p className="text-slate-500">No announcements yet.</p>}
                {notices.map((notice) => (
                    <div key={notice._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-slate-800">{notice.title}</h4>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                <Users size={12} /> {notice.targetAudience}
                            </span>
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">{notice.message}</p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <Calendar size={14} />
                            {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notices;