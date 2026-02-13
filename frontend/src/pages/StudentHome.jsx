import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, CreditCard, 
  Bell, Sun, FileText, 
  ClipboardList, UserPlus, MessageSquare, 
  HardDrive, Users, GraduationCap,
  TrendingUp, FileSearch, ClipboardCheck
} from 'lucide-react';

const StudentHome = () => {
  // Modules precisely matched to your screenshots
  const mainModules = [
    { title: 'Attendance', icon: <Calendar size={32} />, path: '/attendance', color: 'bg-red-50 text-red-400' },
    { title: 'TimeTable', icon: <Clock size={32} />, path: '/timetable', color: 'bg-blue-50 text-blue-400' },
    { title: 'Fees', icon: <CreditCard size={32} />, path: '/fees', color: 'bg-teal-50 text-teal-400' },
    { title: 'Holidays', icon: <Sun size={32} />, path: '/holidays', color: 'bg-blue-50 text-blue-300' },
    { title: 'Notifications', icon: <Bell size={32} />, path: '/notices', color: 'bg-orange-50 text-orange-400' },
  ];

  const subModules = [
    { title: 'Assignment', icon: <FileText size={20} />, path: '/academic' },
    { title: 'Enrollment', icon: <UserPlus size={20} />, path: '/profile' },
    { title: 'Feedback', icon: <MessageSquare size={20} />, path: '/feedback' },
    { title: 'Undertaking', icon: <ClipboardList size={20} />, path: '/forms' },
    { title: 'Grievance', icon: <FileSearch size={20} />, path: '/support' },
    { title: 'LMS', icon: <HardDrive size={20} />, path: '/lms' },
    { title: 'Mentorship', icon: <Users size={20} />, path: '/mentors' },
    { title: 'NEFT Form', icon: <GraduationCap size={20} />, path: '/finance' },
    { title: 'Performance', icon: <TrendingUp size={20} />, path: '/analytics' },
    { title: 'Request Center', icon: <ClipboardCheck size={20} />, path: '/requests' },
  ];

  return (
    <div className="px-5 -mt-10 space-y-8">
      {/* Main Large Grid */}
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

      {/* Secondary Mini Grid */}
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