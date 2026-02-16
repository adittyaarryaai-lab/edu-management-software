import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, ExternalLink } from 'lucide-react';
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
                    alert("Access Denied: Only Teachers can access this page.");
                    navigate('/');
                }
            }
            finally { setLoading(false); }
        };
        if(assignmentId) fetchSubmissions();
    }, [assignmentId, navigate]);

    const submitGrade = async (subId) => {
        if (!gradeData.grade) return alert("Please enter a grade first!");
        try {
            await API.put(`/assignments/grade/${subId}`, gradeData);
            alert("Grade Assigned Successfully!");
            window.location.reload();
        } catch (err) { 
            alert("Grading failed: Check if you have teacher permissions."); 
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4 active:scale-95 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tight">Student Submissions</h1>
            </div>

            <div className="px-5 -mt-8 space-y-4">
                {submissions.length > 0 ? submissions.map((sub) => (
                    <div key={sub._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-black text-slate-800 uppercase text-sm">{sub.student?.name}</h4>
                            <a 
                                href={`http://localhost:5000${sub.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 flex items-center gap-1 text-[10px] font-black uppercase"
                            >
                                View File <ExternalLink size={12}/>
                            </a>
                        </div>
                        
                        {sub.status === 'Graded' ? (
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                <p className="text-green-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={14}/> Grade: {sub.grade}
                                </p>
                                <p className="text-[10px] text-green-800/60 mt-1 font-bold italic">"{sub.feedback}"</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Grade (A, B, 9/10...)" 
                                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold outline-none focus:border-blue-500"
                                    onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} 
                                />
                                <textarea 
                                    placeholder="Teacher's Feedback" 
                                    className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-bold h-20 outline-none focus:border-blue-500"
                                    onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} 
                                />
                                <button 
                                    onClick={() => submitGrade(sub._id)} 
                                    className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    Submit Grade
                                </button>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-xs uppercase">No submissions yet for this assignment</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherGrading;