import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Award, BookOpen, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader'; 

const Performance = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // FIXED: Cache break karne ke liye timestamp add kiya hai
                const { data } = await API.get(`/assignments/my-results?t=${new Date().getTime()}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });
                
                if (data && Array.isArray(data)) {
                    setResults(data);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error("Error fetching performance data", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-28 rounded-b-[3.5rem] shadow-lg relative z-10 text-center">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight italic">Academic Results</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><TrendingUp size={20}/></div>
                </div>

                <div className="inline-flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-full w-32 h-32 border-4 border-white/20 shadow-xl mx-auto">
                    {/* Safe access using optional chaining */}
                    <span className="text-4xl font-black">{results?.length || 0}</span>
                    <span className="text-[10px] font-black uppercase opacity-70 tracking-widest">Tasks Graded</span>
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] opacity-80">Session 2026 • Term 1</p>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 flex justify-around items-center border border-white">
                    <div className="text-center border-r border-slate-100 pr-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Status</p>
                        <p className="text-lg font-black text-green-600 uppercase">Verified</p>
                    </div>
                    <div className="text-center pl-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Achievement</p>
                        <p className="text-lg font-black text-blue-600 uppercase">Active</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
                        <Award size={14} className="text-orange-400" /> Graded Submissions
                    </h3>

                    {results && results.length > 0 ? results.map((item, i) => (
                        <div key={item._id || i} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-50 space-y-4 hover:shadow-blue-50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl shadow-inner">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tight">
                                            {item.assignment?.title || "Untitled Assignment"}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                            {item.assignment?.subject || "General"} • {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Recent'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg">
                                    <span className="text-xs font-black italic">{item.grade || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex gap-3 items-start">
                                <MessageSquare size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Teacher's Note</p>
                                    <p className="text-[11px] text-slate-600 font-bold italic leading-relaxed">
                                        "{item.feedback || 'Excellent work! Keep maintaining your academic standard.'}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                            <Award className="mx-auto text-slate-100 mb-4" size={60} />
                            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">No Graded Records Found</p>
                        </div>
                    )}
                </div>

                <button className="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-xs tracking-widest mt-4">
                    <TrendingUp size={18} />
                    Download Progress Report
                </button>
            </div>
        </div>
    );
};

export default Performance;