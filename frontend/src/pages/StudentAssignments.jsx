import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const StudentAssignments = ({ user }) => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const { data } = await API.get(`/assignments/${user.grade}`);
                setAssignments(data);
            } catch (err) {
                console.error("Error fetching assignments");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [user.grade]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-6"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black uppercase tracking-tight">Assignments</h1>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] mt-1">Academic Task Manager</p>
            </div>

            <div className="px-5 -mt-12 space-y-4">
                {assignments.length > 0 ? assignments.map((task) => (
                    <div key={task._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 relative overflow-hidden group transition-all hover:border-blue-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                <BookOpen size={20} />
                            </div>
                            <span className="bg-orange-50 text-orange-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <h4 className="font-black text-slate-800 text-lg leading-tight mb-2 uppercase tracking-tighter">{task.title}</h4>
                        <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                By: {task.teacher?.name} • {task.subject}
                            </p>
                            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                <Send size={14}/> Submit
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-bold text-sm uppercase">No pending assignments</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;