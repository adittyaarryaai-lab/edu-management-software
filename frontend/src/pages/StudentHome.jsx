import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, CreditCard, 
  Bell, Sun, FileText, 
  ClipboardList, UserPlus, MessageSquare, 
  Megaphone, Users, GraduationCap,
  TrendingUp, FileSearch, ClipboardCheck,
  Bus,Book,Video,BookOpen// <--- Ye missing tha, ise add kar diya
} from 'lucide-react';

const StudentHome = () => {
  const mainModules = [
    { title: 'Attendance', icon: <Calendar size={32} />, path: '/attendance', color: 'bg-red-50 text-red-400' },
    { title: 'TimeTable', icon: <Clock size={32} />, path: '/timetable', color: 'bg-blue-50 text-blue-400' },
    { title: 'Fees', icon: <CreditCard size={32} />, path: '/fees', color: 'bg-teal-50 text-teal-400' },
    { title: 'Notice Board', icon: <Megaphone size={32} />, path: '/notice-feed', color: 'bg-indigo-50 text-indigo-400' }, // Day 17 Link
    { title: 'Exam Center', icon: <GraduationCap size={20} />, path: '/exams' },
    { title: 'ID Card', icon: <UserPlus size={20} />, path: '/id-card' },

  ];

  const subModules = [
    { title: 'ERP Notices', icon: <Bell size={20} />, path: '/notices' }, // Day 6 Link
    { title: 'Assignment', icon: <FileText size={20} />, path: '/academic' },
    { title: 'Performance', icon: <TrendingUp size={20} />, path: '/performance' },
    { title: 'Grievance', icon: <FileSearch size={20} />, path: '/support' },
    { title: 'Holidays', icon: <Sun size={20} />, path: '/holidays' },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/feedback' },
    { title: 'Mentorship', icon: <Users size={20} />, path: '/mentors' },
    { title: 'Request Center', icon: <ClipboardCheck size={20} />, path: '/requests' },
    { title: 'Transport', icon: <Bus size={20} />, path: '/transport' },
    { title: 'Library', icon: <Book size={20} />, path: '/library' },
    { title: 'Live Class', icon: <Video size={20} />, path: '/live-class' },
    { title: 'Syllabus', icon: <BookOpen size={20} />, path: '/syllabus' },
  ];

  return (
    <div className="px-5 -mt-10 space-y-8">
      <div className="grid grid-cols-2 gap-4">
        {mainModules.map((m, i) => (
          <Link to={m.path} key={i} className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className={`p-4 rounded-3xl ${m.color}`}>
              {m.icon}
            </div>
            <span className="font-bold text-slate-700 text-sm tracking-tight">{m.title}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-4 gap-y-8 gap-x-2">
          {subModules.map((sm, i) => (
            <Link to={sm.path} key={i} className="flex flex-col items-center gap-2">
              <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl transition-all active:scale-90">
                {sm.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">
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