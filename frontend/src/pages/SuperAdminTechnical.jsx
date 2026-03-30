import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, CheckCircle2, User, School, ExternalLink, ArrowLeft } from 'lucide-react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const SuperAdminTechnical = () => {
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: '' });
    const [zoomImg, setZoomImg] = useState(null); // Screenshot zoom ke liye

    const loadIssues = async () => {
        try {
            const { data } = await API.get('/technical/all-reports');
            setIssues(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadIssues(); }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await API.put(`/technical/update-status/${id}`, { status: newStatus });
            setToast({ show: true, msg: `Signal marked as ${newStatus}!` }); // Toast dikhao
            setTimeout(() => setToast({ show: false, msg: '' }), 3000); // 3 sec baad hatao
            loadIssues();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="min-h-screen bg-[#0B0F14] p-6 text-white font-sans italic">
            <div className="flex items-center gap-4 mb-8">
                {/* DASHBOARD BACK BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white/5 p-3 rounded-2xl border border-white/10 text-cyan-400 hover:bg-cyan-400/10 active:scale-90 transition-all shadow-lg"
                >
                    <ArrowLeft size={20} />
                </button>

                <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <ShieldAlert className="text-cyan-400" /> Technical Issues
                </h1>
            </div>

            <div className="grid gap-6">
                {issues.map((issue) => (
                    <div key={issue._id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${issue.status === 'Pending' ? 'bg-amber-500 text-black' : 'bg-cyan-500 text-black'}`}>
                                    {issue.status}
                                </span>
                                <h3 className="text-lg font-black text-white uppercase mt-2">{issue.issueType}</h3>
                            </div>
                            {/* Execute Actions */}
                            <div className="flex gap-2">
                                <button onClick={() => updateStatus(issue._id, 'Received')} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 text-[9px] font-black uppercase">Mark Received</button>
                                <button onClick={() => updateStatus(issue._id, 'Resolved')} className="bg-cyan-500 text-black p-3 rounded-2xl text-[9px] font-black uppercase">Mark Resolved</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personnel Data */}
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                                <p className="text-[10px] text-white/40 font-black uppercase flex items-center gap-2"><User size={12} /> Reported By: <span className="text-white">{issue.userId?.name} ({issue.userId?.role})</span></p>
                                <p className="text-[10px] text-white/40 font-black uppercase flex items-center gap-2"><School size={12} /> School: <span className="text-white">{issue.schoolId?.schoolName}</span></p>
                                <p className="text-[11px] text-white/80 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 italic">"{issue.description || 'No description provided.'}"</p>
                            </div>

                            {/* Screenshot Proof */}
                            {issue.screenshot ? (
                                <div
                                    className="relative group cursor-zoom-in"
                                    onClick={() => setZoomImg(`http://localhost:5000${issue.screenshot}`)} // Zoom open karo
                                >
                                    <img src={`http://localhost:5000${issue.screenshot}`} className="w-full h-40 object-cover rounded-2xl border border-white/10" alt="Evidence" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl">
                                        <ExternalLink className="text-cyan-400" />
                                    </div>
                                </div>
                            ) : <div className="h-40 bg-black/20 rounded-2xl flex items-center justify-center border border-dashed border-white/10 text-white/20 text-[10px] font-black uppercase">No Screenshot</div>}
                        </div>
                    </div>
                ))}
            </div>
            {toast.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] bg-cyan-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-[0_0_30px_rgba(34,211,238,0.4)] animate-bounce">
                    {toast.msg}
                </div>
            )}
            {zoomImg && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop with Blur */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setZoomImg(null)}></div>

                    {/* Full Image Container */}
                    <div className="relative z-10 max-w-4xl w-full h-full flex flex-col items-center justify-center">
                        <button
                            onClick={() => setZoomImg(null)}
                            className="absolute top-0 right-0 m-4 bg-white text-black p-3 rounded-full font-black uppercase text-[10px] flex items-center gap-2 shadow-2xl active:scale-90 transition-all"
                        >
                            <ArrowLeft size={16} /> Back to Logs
                        </button>
                        <img src={zoomImg} className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border border-white/10 object-contain" alt="Zoomed" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminTechnical;