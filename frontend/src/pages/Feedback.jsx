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
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Feedback</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><MessageSquare size={20}/></div>
                </div>
                <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.3em] ml-2">Neural Input: Improve Experience Matrix</p>
            </div>

            {/* Feedback Form */}
            <div className="px-5 -mt-12 relative z-20 space-y-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10 text-center">
                    <h3 className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mb-6 italic">Rate User Faculty</h3>
                    
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
                                    className={s <= rating ? "fill-neon text-neon drop-shadow-[0_0_10px_rgba(61,242,224,0.6)]" : "text-white/10"} 
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <select className="w-full bg-void border border-neon/20 py-4 px-6 rounded-2xl text-xs font-black text-neon/80 outline-none focus:border-neon transition-all uppercase italic">
                            <option className="bg-void">Select Faculty Module</option>
                            <option className="bg-void">Mr. Sahil Sharma (Web Dev)</option>
                            <option className="bg-void">Dr. Anjali Verma (Cloud)</option>
                        </select>

                        <textarea 
                            placeholder="Write your neural suggestions here..." 
                            rows="4" 
                            className="w-full bg-void border border-neon/20 py-4 px-6 rounded-2xl text-xs font-black text-white outline-none focus:border-neon transition-all italic placeholder:text-white/20"
                        ></textarea>

                        <button 
                            onClick={handleSubmit}
                            className="w-full bg-neon text-void py-4 rounded-3xl font-black shadow-[0_0_20px_rgba(61,242,224,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest italic"
                        >
                            <Send size={18} />
                            <span>Transmit Feedback</span>
                        </button>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-3 bg-neon/5 p-5 rounded-[2rem] border border-neon/10">
                    <ThumbsUp className="text-neon shrink-0 animate-pulse" size={20} />
                    <p className="text-[9px] font-black text-neon/60 leading-relaxed uppercase tracking-tighter italic">
                        ANONYMOUS PROTOCOL: YOUR IDENTITY IS ENCRYPTED FROM THE RECIPIENT.
                    </p>
                </div>
            </div>

            {showToast && <Toast message="Thank you for your feedback!" onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default Feedback;