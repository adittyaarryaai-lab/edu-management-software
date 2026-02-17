import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, CreditCard, Bell, Sun, FileText, 
  TrendingUp, FileSearch, ClipboardCheck,
  Bus, Book, Video, BookOpen, Megaphone, Users, GraduationCap, UserPlus, Bot
} from 'lucide-react';
// Step 1 ka component import kiya
// import NoticeBoard from '../components/NoticeBoard'; 

const StudentHome = () => {
  const mainModules = [
    { title: 'Attendance', icon: <Calendar size={32} />, path: '/attendance', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    { title: 'TimeTable', icon: <Clock size={32} />, path: '/timetable', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { title: 'Fees', icon: <CreditCard size={32} />, path: '/fees', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    { title: 'Notice Board', icon: <Megaphone size={32} />, path: '/notice-feed', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
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
    <div className="px-5 -mt-10 space-y-8 relative z-10 pb-24">
      {/* 1. Main Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mainModules.map((m, i) => (
          <Link to={m.path} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
            <div className={`p-4 rounded-[2rem] border ${m.color}`}>
              {m.icon}
            </div>
            <span className="font-black text-gray-800 text-sm tracking-tight">{m.title}</span>
          </Link>
        ))}
      </div>

      {/* 2. Notice Board (Day 48 - New Addition) */}
      {/* <NoticeBoard /> */}

      {/* 3. Sub-Modules Section */}
      <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <Bot size={16} className="text-blue-400" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Sub-Modules</h3>
        </div>
        <div className="grid grid-cols-4 gap-y-10 gap-x-2">
          {subModules.map((sm, i) => (
            <Link to={sm.path} key={i} className="flex flex-col items-center gap-3 group">
              <div className="bg-white/5 text-slate-300 p-3 rounded-2xl border border-white/5 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all active:scale-90">
                {sm.icon}
              </div>
              <span className="text-[9px] font-black text-slate-500 text-center leading-tight uppercase tracking-tighter">
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