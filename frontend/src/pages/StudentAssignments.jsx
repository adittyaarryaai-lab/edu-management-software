import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, Send, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const StudentAssignments = ({ user }) => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submittedIds, setSubmittedIds] = useState([]);

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

    const handleFileUpload = async (e, assignmentId) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const { data: filePath } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await API.post('/assignments/submit', {
                assignmentId,
                fileUrl: filePath,
                content: "Assignment submitted via student portal node"
            });
            setSubmittedIds([...submittedIds, assignmentId]);
        } catch (err) {
            console.error(err);
            alert("❌ Neural Uplink Failed!");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-6 active:scale-90 transition-all border border-white/10 text-neon relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic relative z-10">Assignments</h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mt-1 relative z-10 italic">Academic Task Manager</p>
                <div className="absolute right-6 top-16 text-neon/5 animate-spin-slow"><Zap size={120}/></div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-4">
                {assignments.length > 0 ? assignments.map((task) => {
                    const isSubmitted = submittedIds.includes(task._id);

                    return (
                        <div key={task._id} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden group transition-all hover:border-neon/30 italic">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-neon/10 text-neon p-3 rounded-2xl border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                    <BookOpen size={20} />
                                </div>
                                <span className="bg-void border border-orange-500/30 text-orange-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic shadow-[0_0_10px_rgba(251,146,60,0.1)]">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <h4 className="font-black text-white text-lg leading-tight mb-2 uppercase tracking-tighter group-hover:text-neon transition-colors">{task.title}</h4>
                            <p className="text-[11px] text-white/40 font-medium mb-4 line-clamp-2 italic">{task.description}</p>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <p className="text-[9px] font-black text-neon/30 uppercase tracking-[0.2em] italic">
                                    Node: {task.teacher?.name} • {task.subject}
                                </p>
                                
                                <div className="relative overflow-hidden">
                                    {!isSubmitted ? (
                                        <>
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={(e) => handleFileUpload(e, task._id)}
                                                disabled={uploading}
                                            />
                                            <button className="flex items-center gap-2 bg-neon text-void px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(61,242,224,0.3)] active:scale-95 transition-all italic">
                                                <Send size={14}/> 
                                                {uploading ? "Transmitting..." : "Submit Matrix"}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-neon/10 text-neon px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-neon/20 animate-in zoom-in duration-500 italic">
                                            <CheckCircle size={14}/>
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                        <FileText className="mx-auto text-white/5 mb-4 animate-pulse" size={48} />
                        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Pending Tasks Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAssignments;