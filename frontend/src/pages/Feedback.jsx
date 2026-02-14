import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Star, Send, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Feedback = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = () => {
        setShowToast(true);
        setTimeout(() => navigate('/dashboard'), 2000);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Feedback</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><MessageSquare size={20}/></div>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2">Your feedback helps us improve the academic experience.</p>
            </div>

            {/* Feedback Form */}
            <div className="px-5 -mt-12 relative z-20 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 text-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Rate your Faculty</h3>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                                key={s} 
                                onClick={() => setRating(s)}
                                className="transition-all active:scale-75"
                            >
                                <Star 
                                    size={36} 
                                    className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <select className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
                            <option>Select Faculty/Teacher</option>
                            <option>Mr. Sahil Sharma (Web Dev)</option>
                            <option>Dr. Anjali Verma (Cloud)</option>
                        </select>

                        <textarea 
                            placeholder="Write your suggestions here..." 
                            rows="4" 
                            className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl text-xs outline-none focus:border-blue-500 transition-all"
                        ></textarea>

                        <button 
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-4 rounded-3xl font-bold shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <Send size={18} />
                            <span>Submit Feedback</span>
                        </button>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-3 bg-blue-50 p-5 rounded-[2rem] border border-blue-100">
                    <ThumbsUp className="text-blue-500 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-blue-600 leading-relaxed uppercase">
                        Anonymous: Your identity will not be shared with the faculty.
                    </p>
                </div>
            </div>

            {showToast && <Toast message="Thank you for your feedback!" onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default Feedback;