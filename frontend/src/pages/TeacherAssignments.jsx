import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Clock, Send, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader';

const TeacherAssignments = ({ user }) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        grade: '',
        subject: '',
        dueDate: ''
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const { data } = await API.get(`/assignments/${user?.grade || '10-A'}`);
                setAssignments(data);
            } catch (err) {
                console.error("Error fetching assignments");
            } finally {
                setFetching(false);
            }
        };
        fetchAssignments();
    }, [user]);

    const handlePost = async (e) => {
        e.preventDefault();
        if(!formData.title || !formData.grade || !formData.dueDate) return alert("Please fill mandatory fields!");
        
        setLoading(true);
        try {
            await API.post('/assignments/create', formData);
            alert("Assignment Posted Successfully!");
            setShowForm(false);
            window.location.reload();
        } catch (err) {
            alert("Error posting assignment");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Assignments</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`p-2 rounded-xl shadow-lg active:scale-90 transition-all ${showForm ? 'bg-red-500 text-white' : 'bg-white text-blue-600'}`}
                    >
                        {showForm ? <Plus size={20} className="rotate-45" /> : <Plus size={20} />}
                    </button>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2 uppercase tracking-widest">Portal: {user?.name}</p>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-6">
                {showForm && (
                    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                            <FileText size={18} className="text-blue-500" /> New Task
                        </h3>
                        <form onSubmit={handlePost} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Assignment Title" 
                                className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-sm outline-none focus:border-blue-300 font-bold"
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Grade (e.g. 10-A)" 
                                    className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-[10px] outline-none font-bold"
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Subject" 
                                    className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-[10px] outline-none font-bold"
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>
                            <textarea 
                                placeholder="Instructions for students..." 
                                rows="3" 
                                className="w-full bg-slate-50 border border-slate-100 py-3 px-4 rounded-2xl text-sm outline-none focus:border-blue-300 font-medium"
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 text-slate-400" size={16} />
                                <input 
                                    type="date" 
                                    className="w-full bg-slate-50 border border-slate-100 py-3.5 pl-12 pr-4 rounded-2xl text-[10px] outline-none font-black"
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em] disabled:bg-slate-300"
                            >
                                {loading ? "Broadcasting..." : <><Send size={16} /> Deploy Assignment</>}
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Class Feed</p>
                    {assignments.length > 0 ? (
                        assignments.map((asgn, i) => (
                            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{asgn.title}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                            {asgn.grade} • Due: {new Date(asgn.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* FIXED: Added 'View Submissions' button here */}
                                <button 
                                    onClick={() => navigate(`/teacher/grade/${asgn._id}`)}
                                    className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md active:scale-90 transition-all flex items-center gap-2"
                                >
                                    <Users size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Submissions</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">No Active Assignments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignments;