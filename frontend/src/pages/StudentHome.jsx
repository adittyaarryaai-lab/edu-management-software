import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, CreditCard, Bell, Sun, FileText,
  TrendingUp, FileSearch, ClipboardCheck,
  Bus, Book, Video, BookOpen, Megaphone, Users, GraduationCap, UserPlus, Bot, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Smooth animation ke liye
import API from '../api';

const StudentHome = ({ user, searchQuery }) => {
  const navigate = useNavigate();
  // --- NEW STATE: Arrow toggle ke liye ---
  const [isExpanded, setIsExpanded] = useState(false);

  const topRowModules = [
    { title: 'Attendance', icon: <Calendar size={36} />, path: '/attendance', bgColor: 'bg-[#FFEBEE]', iconColor: 'bg-[#FFCDD2] text-[#E53935]' },
    { title: 'TimeTable', icon: <Clock size={36} />, path: '/timetable', bgColor: 'bg-[#E8EAF6]', iconColor: 'bg-[#C5CAE9] text-[#3F51B5]' },
  ];

  // Niche wale 3 chote modules
  const bottomRowModules = [
    { title: 'Fees', icon: <CreditCard size={28} />, path: '/student/fees', bgColor: 'bg-[#E0F2F1]', iconColor: 'bg-[#B2DFDB] text-[#00897B]' },
    { title: 'Class Diary', icon: <BookOpen size={28} />, path: '/class-diary', bgColor: 'bg-[#E3F2FD]', iconColor: 'bg-[#BBDEFB] text-[#1E88E5]' },
    { title: 'Notices', icon: <Megaphone size={28} />, path: '/notice-feed', bgColor: 'bg-[#FFF3E0]', iconColor: 'bg-[#FFE0B2] text-[#FB8C00]' },
  ];

  const subModules = [
    { title: 'Assignment', icon: <FileText size={24} />, path: '/assignments' },
     { title: 'Mentorship', icon: <Users size={24} />, path: '/mentors' },
    { title: 'ERP Notices', icon: <Bell size={24} />, path: '/notices' },
    { title: 'Performance', icon: <TrendingUp size={24} />, path: '/performance' },
    { title: 'Library', icon: <Book size={24} />, path: '/library' },
    { title: 'Live Class', icon: <Video size={24} />, path: '/live-class' },
    { title: 'Syllabus', icon: <BookOpen size={24} />, path: '/syllabus' },
    { title: 'Exam', icon: <GraduationCap size={24} />, path: '/exams' },
  ];

  // Ye wo modules hain jo sirf arrow click karne par dikhenge
  const extraModules = [
    { title: 'Bus Tracker', icon: <Bus size={24} />, path: '/transport' },
    { title: 'E-Books', icon: <BookOpen size={24} />, path: '/ebooks' },
  ];

  // Pehle filter karke ek variable mein store karlo
  const filteredSub = subModules.filter(sm =>
    sm.title.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  const filteredExtra = extraModules.filter(em =>
    em.title.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  // Check karo ki total kuch mila ya nahi
  const noResults = filteredSub.length === 0 && filteredExtra.length === 0;

  return (
    <div className="px-5 -mt-19 space-y-5 relative z-10 pb-24 font-sans bg-[#F8FAFC]">

      {/* --- MAIN MODULES (Optimized for Laptop & Mobile) --- */}
      <div className="space-y-4 pt-4">
        
        {/* TOP ROW: 2 BIG MODULES */}
        <div className="grid grid-cols-2 gap-4">
          {topRowModules.map((m, i) => (
            <Link
              to={m.path}
              key={i}
              className={`${m.bgColor} rounded-[2.5rem] p-6 flex flex-col items-start justify-between min-h-[170px] shadow-sm border border-white/60 active:scale-95 transition-all relative overflow-hidden group`}
            >
              <span className="font-black text-slate-800 text-xl z-10 italic leading-tight">{m.title}</span>
              <div className={`self-end p-5 rounded-[2rem] ${m.iconColor} shadow-inner group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
              {/* Soft background shape for detail */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            </Link>
          ))}
        </div>

        {/* BOTTOM ROW: 3 SMALLER MODULES */}
        <div className="grid grid-cols-3 gap-4">
          {bottomRowModules.map((m, i) => (
            <Link
              to={m.path}
              key={i}
              className={`${m.bgColor} rounded-[2rem] p-4 flex flex-col items-start justify-between min-h-[140px] shadow-sm border border-white/50 active:scale-95 transition-all relative overflow-hidden group`}
            >
              <span className="font-black text-slate-800 text-[15px] z-10 italic leading-tight">{m.title}</span>
              <div className={`self-end p-3 rounded-[1.5rem] ${m.iconColor} shadow-inner group-hover:rotate-12 transition-transform`}>
                {m.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- SUB-MODULES CONTAINER --- */}
      <div className="bg-white rounded-[3.5rem] p-8 lg:p-12 shadow-sm border border-slate-100 relative min-h-[200px] flex flex-col justify-center">

        {/* AGAR KUCH NA MILE TOH YE DIKHAO */}
        {noResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 w-full col-span-full"
          >
            <Bot size={48} className="text-slate-200 mb-4 animate-bounce" />
            <p className="text-slate-400 font-bold text-sm lg:text-base italic uppercase tracking-widest">
              No Module Found...
            </p>
          </motion.div>
        ) : (
          /* AGAR RESULTS HAIN TOH GRID DIKHAO */
          <div className="grid grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-4">
            {filteredSub.map((sm, i) => (
              <Link to={sm.path} key={i} className="flex flex-col items-center gap-4 group">
                <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-[2rem] bg-[#E3F2FD] text-[#2196F3] group-hover:bg-[#2196F3] group-hover:text-white transition-all active:scale-90 border border-blue-50">
                  {sm.icon}
                </div>
                <span className="text-xs lg:text-sm font-bold text-slate-600 text-center leading-tight">
                  {sm.title}
                </span>
              </Link>
            ))}

            {/* --- EXTRA MODULES (Animated Slide) --- */}
            {/* Extra Modules (Sirf tab jab search match ho aur expanded ho) */}
            {/* --- EXTRA MODULES (Animated Slide) --- */}
            <AnimatePresence>
              {/* LOGIC: Ya toh manually Expand kiya ho, YA FIR search chal rahi ho */}
              {(isExpanded || searchQuery) && filteredExtra.map((em, i) => (
                <motion.div
                  key={`extra-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Link to={em.path} className="flex flex-col items-center gap-4 group">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-[2rem] bg-[#E3F2FD] text-[#2196F3] group-hover:bg-[#9C27B0] group-hover:text-white transition-all active:scale-90 border border-purple-50">
                      {em.icon}
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-slate-600 text-center leading-tight">
                      {em.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- TOGGLE ARROW (isExpanded toggle karega) --- */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex justify-center w-full mt-8 hover:scale-110 transition-transform cursor-pointer"
        >
          <div className="bg-slate-50 p-2 rounded-full border border-slate-100 shadow-sm">
            {isExpanded ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentHome;