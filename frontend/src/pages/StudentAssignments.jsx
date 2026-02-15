import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const StudentAssignments = ({ user }) => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    // Submit karne ke baad turant UI update karne ke liye state
    const [submittedIds, setSubmittedIds] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Humne backend se is grade ke assignments mangwaye
                const { data } = await API.get(`/assignments/${user.grade}`);
                setAssignments(data);
                
                // Extra: Agar aapne backend mein submissions check karne ka logic banaya hai
                // toh yahan se hum submitted assignments ki list filter kar sakte hain.
                // Abhi ke liye hum local state se handle karenge submit hote hi.
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
                content: "Assignment submitted via student portal"
            });
            
            // Success! Assignment ID ko submitted list mein daal do
            setSubmittedIds([...submittedIds, assignmentId]);
            
            // Alert hata kar hum direct UI update dikhayenge
        } catch (err) {
            console.error(err);
            alert("❌ Submission Failed!");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-6 active:scale-90 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-tight">Assignments</h1>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] mt-1">Academic Task Manager</p>
            </div>

            <div className="px-5 -mt-12 space-y-4">
                {assignments.length > 0 ? assignments.map((task) => {
                    const isSubmitted = submittedIds.includes(task._id);

                    return (
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
                                
                                <div className="relative overflow-hidden">
                                    {!isSubmitted ? (
                                        <>
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={(e) => handleFileUpload(e, task._id)}
                                                disabled={uploading}
                                            />
                                            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                                <Send size={14}/> 
                                                {uploading ? "Uploading..." : "Submit File"}
                                            </button>
                                        </>
                                    ) : (
                                        // ✅ YE HAI WO GREEN BUTTON JO AAPNE BOLA THA
                                        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100 animate-in zoom-in duration-300">
                                            <CheckCircle size={14}/>
                                            Submitted
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
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