import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, CreditCard, Bell, Sun, FileText, 
  TrendingUp, FileSearch, ClipboardCheck,
  Bus, Book, Video, BookOpen, Megaphone, Users, GraduationCap, UserPlus, Bot
} from 'lucide-react';
import API from '../api'; 

const StudentHome = () => {
  const navigate = useNavigate();

  const mainModules = [
    { title: 'Attendance', icon: <Calendar size={32} />, path: '/attendance', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'TimeTable', icon: <Clock size={32} />, path: '/timetable', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Fees', icon: <CreditCard size={32} />, path: '/fees', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Notice Board', icon: <Megaphone size={32} />, path: '/notice-feed', color: 'text-neon bg-neon/10 border-neon/20' },
  ];

  const subModules = [
    { title: 'ERP Notices', icon: <Bell size={20} />, path: '/notices' },
    { title: 'Assignment', icon: <FileText size={20} />, path: '/assignments' },
    { title: 'Performance', icon: <TrendingUp size={20} />, path: '/performance' }, 
    { title: 'Mentorship', icon: <Users size={20} />, path: '/mentors' },
    { title: 'Library', icon: <Book size={20} />, path: '/library' },
    { title: 'Live Class', icon: <Video size={20} />, path: '/live-class' },
    { title: 'Syllabus', icon: <BookOpen size={20} />, path: '/syllabus' },
    { title: 'Exam', icon: <GraduationCap size={20} />, path: '/exams' },
  ];

  return (
    <div className="px-5 -mt-10 space-y-8 relative z-10 pb-24 font-sans italic">
      <div className="grid grid-cols-2 gap-4">
        {mainModules.map((m, i) => (
          <Link to={m.path} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-all group hover:border-neon/30">
            <div className={`p-4 rounded-[2rem] border transition-all group-hover:shadow-[0_0_20px_rgba(61,242,224,0.3)] ${m.color}`}>
              {m.icon}
            </div>
            <span className="font-black text-white/90 text-sm tracking-tight uppercase italic">{m.title}</span>
          </Link>
        ))}
      </div>

      <div className="bg-void/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-neon/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <Bot size={16} className="text-neon animate-pulse" />
            <h3 className="text-[10px] font-black text-neon/40 uppercase tracking-[0.3em]">Neural Sub-Modules</h3>
        </div>
        <div className="grid grid-cols-4 gap-y-10 gap-x-2">
          {subModules.map((sm, i) => (
            <Link to={sm.path} key={i} className="flex flex-col items-center gap-3 group">
              <div className="bg-void text-neon/40 p-3 rounded-2xl border border-white/5 group-hover:bg-neon/10 group-hover:text-neon group-hover:border-neon/30 transition-all active:scale-90 shadow-inner">
                {sm.icon}
              </div>
              <span className="text-[9px] font-black text-white/30 text-center leading-tight uppercase tracking-tighter group-hover:text-neon transition-colors">
                {sm.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;