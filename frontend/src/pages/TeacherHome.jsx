import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, BookOpen, Users, 
  FilePlus, CalendarDays, ClipboardList
} from 'lucide-react';

const TeacherHome = ({ user }) => {
  const teacherModules = [
    { title: 'Attendance', icon: <CheckSquare size={32} />, path: '/teacher/attendance', color: 'bg-green-50 text-green-500' },
    { title: 'My Schedule', icon: <CalendarDays size={32} />, path: '/timetable', color: 'bg-blue-50 text-blue-500' },
    { title: 'Assignments', icon: <FilePlus size={32} />, path: '/teacher/assignments', color: 'bg-orange-50 text-orange-500' },
    { title: 'Class List', icon: <Users size={32} />, path: '/teacher/students', color: 'bg-purple-50 text-purple-500' },
  ];

  const quickStats = [
    { label: 'Classes Today', value: '4', icon: <BookOpen size={20}/> },
    { label: 'Total Students', value: '120', icon: <Users size={20}/> },
    { label: 'Pending Leaves', value: '2', icon: <ClipboardList size={20}/> },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Adjusted Blue Header height and padding */}
      <div className="nav-gradient text-white px-6 pt-4 pb-20 rounded-b-[3.5rem] shadow-lg mb-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Teacher Portal</p>
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {/* 2. Content Area with proper Negative Margin */}
      <div className="px-5 -mt-12 space-y-6 relative z-10">
        
        {/* Quick Stats Card - Fixed Overlap */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 flex justify-between items-center border border-white">
          {quickStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 border-r last:border-0 border-slate-50">
              <div className="text-blue-500 mb-1 opacity-80">{stat.icon}</div>
              <span className="text-xl font-black text-slate-800">{stat.value}</span>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-tighter text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Icon Grid */}
        <div className="grid grid-cols-2 gap-4">
          {teacherModules.map((m, i) => (
            <Link to={m.path} key={i} className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 shadow-md border border-slate-50 active:scale-95 transition-all">
              <div className={`p-4 rounded-3xl ${m.color}`}>
                {m.icon}
              </div>
              <span className="font-bold text-slate-700 text-sm tracking-tight">{m.title}</span>
            </Link>
          ))}
        </div>

        {/* Staff Meeting Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Staff Meeting</h3>
            <p className="text-xs opacity-80 leading-relaxed">Today at 04:00 PM in Conference Room A.</p>
            <button className="mt-4 bg-white/20 px-6 py-2 rounded-xl text-[10px] font-bold uppercase backdrop-blur-md border border-white/10 active:scale-90 transition-all">
              View Details
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;