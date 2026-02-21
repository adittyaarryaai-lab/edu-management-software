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
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon transition-all active:scale-90">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Assignments</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`p-2 rounded-xl shadow-lg active:scale-90 transition-all border ${showForm ? 'bg-red-500 text-white border-red-500' : 'bg-neon text-void border-neon shadow-[0_0_15px_rgba(61,242,224,0.4)]'}`}
                    >
                        {showForm ? <Plus size={20} className="rotate-45" /> : <Plus size={20} />}
                    </button>
                </div>
                <p className="text-[10px] text-neon/60 font-black uppercase tracking-widest ml-2 italic">Faculty Portal: {user?.name}</p>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-6">
                {showForm && (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-neon/20 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-6 flex items-center gap-2 italic">
                            <FileText size={18} /> Deploy New Task
                        </h3>
                        <form onSubmit={handlePost} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Assignment Title" 
                                className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black text-white italic outline-none focus:border-neon placeholder:text-white/20"
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Sector (e.g. 10-A)" 
                                    className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-[9px] font-black text-white italic outline-none focus:border-neon placeholder:text-white/20"
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Core Subject" 
                                    className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-[9px] font-black text-white italic outline-none focus:border-neon placeholder:text-white/20"
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>
                            <textarea 
                                placeholder="Neural instructions for students..." 
                                rows="3" 
                                className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black text-white italic outline-none focus:border-neon placeholder:text-white/20"
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-4 text-neon/40" size={16} />
                                <input 
                                    type="date" 
                                    className="w-full bg-void border border-white/5 py-4 pl-12 pr-4 rounded-2xl text-[9px] font-black text-white outline-none focus:border-neon appearance-none italic"
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-neon text-void py-5 rounded-[2rem] font-black shadow-[0_0_20px_rgba(61,242,224,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest italic disabled:bg-slate-800 disabled:text-white/20"
                            >
                                {loading ? "Broadcasting..." : <><Send size={16} /> Deploy Assignment Matrix</>}
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Active Class Feed</p>
                    {assignments.length > 0 ? (
                        assignments.map((asgn, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all italic">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neon/10 text-neon p-3 rounded-2xl border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm leading-tight uppercase italic group-hover:text-neon transition-colors">{asgn.title}</h4>
                                        <p className="text-[9px] font-black text-neon/40 uppercase tracking-tighter mt-1">
                                            Sector {asgn.grade} • Deadline: {new Date(asgn.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate(`/teacher/grade/${asgn._id}`)}
                                    className="bg-neon text-void p-3 rounded-xl shadow-[0_0_15px_rgba(61,242,224,0.3)] active:scale-90 transition-all flex items-center gap-2"
                                >
                                    <Users size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest italic">Submissions</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                            <p className="text-white/10 font-black text-[10px] uppercase tracking-[0.4em] italic">No Active Signal Transmissions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignments;