import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronRight, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import Loader from '../components/Loader';

const ClassDiary = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [homeworkList, setHomeworkList] = useState([]);
    
    // Aj ki date set karo format: YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    // Pichle 5 din ki dates generate karne ke liye logic
    const getDates = () => {
        let dates = [];
        for (let i = 0; i < 5; i++) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            dates.push({
                full: d.toISOString().split('T')[0],
                day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
                date: d.getDate()
            });
        }
        return dates;
    };

    const datesMenu = getDates();

    useEffect(() => {
        const fetchHomework = async () => {
            setLoading(true);
            try {
                // User info se class nikaal lo (Assume user storage mein hai)
                const user = JSON.parse(localStorage.getItem('user'));
                const className = user?.grade;
                
                const { data } = await API.get(`/homework/view?className=${className}&date=${selectedDate}`);
                setHomeworkList(data);
            } catch (err) { console.error("Diary Fetch Failed"); }
            finally { setLoading(false); }
        };
        fetchHomework();
    }, [selectedDate]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            {/* Header */}
            <div className="bg-[#42A5F5] text-slate-800 px-6 pt-12 pb-24 rounded-b-[4rem] border-b border-slate-100 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 relative z-10 px-2">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl border border-[#DDE3EA] text-[#42A5F5] shadow-md active:scale-90 transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-4xl font-black italic tracking-tight capitalize">Class Diary</h1>
                    <div className="p-3 bg-blue-50 rounded-2xl text-[#42A5F5]">
                        <BookOpen size={24} />
                    </div>
                </div>

                {/* Date Scroller */}
                <div className="flex justify-between gap-3 overflow-x-auto no-scrollbar py-2 relative z-10 px-2">
                    {datesMenu.map((d) => (
                        <button
                            key={d.full}
                            onClick={() => setSelectedDate(d.full)}
                            className={`flex flex-col items-center min-w-[65px] py-4 rounded-3xl border transition-all ${selectedDate === d.full
                                ? 'bg-[#42A5F5] text-white border-[#42A5F5] shadow-lg shadow-blue-100'
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white'
                            }`}
                        >
                            <span className="text-[10px] font-black uppercase mb-1 tracking-widest">{d.day}</span>
                            <span className="text-[18px] font-black">{d.date}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Homework List */}
            <div className="px-6 -mt-10 space-y-6 relative z-20">
                {loading ? <div className="py-20"><Loader /></div> : (
                    <AnimatePresence mode='wait'>
    {homeworkList.length > 0 ? (
        /* Sabhi cards ko ek single motion.div mein wrap kiya taaki 'wait' mode sahi chale */
        <motion.div 
            key="diary-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {homeworkList.map((item, i) => (
                <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-xl relative group overflow-hidden"
                >
                    {/* Subject Label */}
                    <div className="absolute top-0 right-0 px-6 py-2 bg-blue-50 text-[#42A5F5] rounded-bl-3xl font-black text-lg uppercase tracking-tighter border-l border-b border-blue-100">
                        {item.subject}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#42A5F5]">
                                <BookOpen size={26} />
                            </div>
                            <div>
                                <h4 className="font-black text-[23px] text-slate-800 leading-tight">Homework</h4>
                                <p className="text-lg font-bold text-slate-400 italic">By Prof. {item.teacherId?.name || "Faculty"}</p>
                            </div>
                        </div>

                        {/* Content Box */}
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                            <p className="text-[19px] font-bold text-slate-600 leading-relaxed italic">
                                {item.content}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-[15px] font-black uppercase text-slate-600 tracking-widest px-2">
                            <span className="flex items-center gap-2">
                                <Clock size={12}/> Updated at {new Date(item.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    ) : (
        /* Empty state ko bhi ek alag key di taaki transiton smooth ho */
        <motion.div 
            key="empty-diary"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-[3.5rem] p-16 text-center border-2 border-dashed border-slate-100"
        >
            <Sun size={60} className="mx-auto text-amber-300 mb-6 animate-spin-slow" />
            <h3 className="text-xl font-black text-slate-800 italic">No Homework Found</h3>
            <p className="text-sm font-bold text-slate-400 mt-2">Enjoy your day! No diary entries for this date. ❄️</p>
        </motion.div>
    )}
</AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ClassDiary;