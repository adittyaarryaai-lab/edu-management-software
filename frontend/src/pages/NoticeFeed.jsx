import React from 'react';
import { ArrowLeft, Megaphone, Calendar, ExternalLink, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoticeFeed = () => {
    const navigate = useNavigate();

    const notices = [
        {
            tag: "Urgent",
            tagColor: "bg-red-500",
            title: "Makeup Examination Date Sheet 2026 Released",
            date: "13 Feb 2026",
            author: "Exam Controller",
            description: "The official date sheet for the makeup examination session Feb-2026 has been uploaded. Students are advised to download the PDF.",
            hasAttachment: true,
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
        },
        {
            tag: "Event",
            tagColor: "bg-blue-500",
            title: "Annual Tech Fest - EduFlow 2026",
            date: "10 Feb 2026",
            author: "Cultural Committee",
            description: "Get ready for the biggest tech fest of the year! Registrations for hackathons and coding competitions are now open.",
            hasAttachment: false,
            imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header Area */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Notice Board</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Megaphone size={20}/></div>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2">Stay updated with the latest campus news and announcements.</p>
            </div>

            {/* Notice List */}
            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {notices.map((n, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-white">
                        {/* Notice Image */}
                        <img src={n.imageUrl} alt="notice" className="w-full h-40 object-cover" />
                        
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className={`${n.tagColor} text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest`}>
                                    {n.tag}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar size={12} />
                                    <span className="text-[10px] font-bold uppercase">{n.date}</span>
                                </div>
                            </div>

                            <h3 className="font-black text-slate-800 text-base leading-tight mb-2">{n.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.description}</p>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">By: {n.author}</span>
                                
                                <div className="flex gap-2">
                                    {n.hasAttachment && (
                                        <button className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase bg-blue-50 px-3 py-1.5 rounded-xl">
                                            <Download size={14} /> PDF
                                        </button>
                                    )}
                                    <button className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px] uppercase bg-slate-50 px-3 py-1.5 rounded-xl">
                                        <ExternalLink size={14} /> Read
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeFeed;