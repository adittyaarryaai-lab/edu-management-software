import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ExternalLink, Award } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const TeacherGrading = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data } = await API.get(`/assignments/submissions/${assignmentId}`);
                setSubmissions(data);
            } catch (err) { 
                console.error(err);
                if (err.response?.status === 403) {
                    alert("Access Denied: Faculty node only.");
                    navigate('/');
                }
            }
            finally { setLoading(false); }
        };
        if(assignmentId) fetchSubmissions();
    }, [assignmentId, navigate]);

    const submitGrade = async (subId) => {
        if (!gradeData.grade) return alert("Enter evaluation cipher first!");
        try {
            await API.put(`/assignments/grade/${subId}`, gradeData);
            alert("Grade Successfully Transmitted!");
            window.location.reload();
        } catch (err) { 
            alert("Grading failed: Check node permissions."); 
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 active:scale-95 transition-all border border-white/10 text-neon relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">Student Node Submissions</h1>
            </div>

            <div className="px-5 -mt-8 space-y-4 relative z-20">
                {submissions.length > 0 ? submissions.map((sub) => (
                    <div key={sub._id} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 italic">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-black text-white uppercase text-sm italic tracking-tight">{sub.student?.name}</h4>
                            <a 
                                href={`http://localhost:5000${sub.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-neon flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-neon/5 px-4 py-2 rounded-xl border border-neon/20 hover:bg-neon hover:text-void transition-all shadow-inner"
                            >
                                Decrypt Data <ExternalLink size={12}/>
                            </a>
                        </div>
                        
                        {sub.status === 'Graded' ? (
                            <div className="bg-neon/5 p-4 rounded-2xl border border-neon/20 shadow-inner">
                                <p className="text-neon font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                    <CheckCircle size={14}/> Evaluation Cipher: {sub.grade}
                                </p>
                                <p className="text-[10px] text-white/40 mt-2 font-black italic">"{sub.feedback}"</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Evaluation Cipher (A, 9/10...)" 
                                    className="w-full bg-void border border-white/5 p-4 rounded-2xl text-xs font-black text-white outline-none focus:border-neon italic"
                                    onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} 
                                />
                                <textarea 
                                    placeholder="Faculty Feedback Logs" 
                                    className="w-full bg-void border border-white/5 p-4 rounded-2xl text-xs font-black text-white h-20 outline-none focus:border-neon italic placeholder:text-white/10"
                                    onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} 
                                />
                                <button 
                                    onClick={() => submitGrade(sub._id)} 
                                    className="w-full bg-neon text-void py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-[0_0_20px_rgba(61,242,224,0.3)] italic"
                                >
                                    Transmit Evaluation
                                </button>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                        <p className="text-white/10 font-black text-[10px] uppercase tracking-[0.4em] italic">No Transmission Data Found For This Node</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherGrading;