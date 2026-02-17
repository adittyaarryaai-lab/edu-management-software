import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, BookOpen, Users, FilePlus, CalendarDays, ClipboardList, Bot, Activity, Megaphone } from 'lucide-react';
import API from '../api'; // Backend connection ke liye

const TeacherHome = ({ user }) => {
  const [studentCount, setStudentCount] = useState(0);

  // Day 49: Fetching real-time student statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/auth/student-stats');
        setStudentCount(data.totalStudents);
      } catch (err) {
        console.error("Error fetching student stats:", err);
        setStudentCount(120); // Fallback if API fails
      }
    };
    fetchStats();
  }, []);

  const teacherModules = [
    { title: 'Attendance', icon: <CheckSquare size={32} />, path: '/teacher/attendance', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { title: 'My Schedule', icon: <CalendarDays size={32} />, path: '/timetable', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { title: 'Assignments', icon: <FilePlus size={32} />, path: '/teacher/assignments', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { title: 'Class List', icon: <Users size={32} />, path: '/teacher/students', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    // Day 49: Naya Broadcast Module (For posting)
    { title: 'Broadcast', icon: <Bot size={32} />, path: '/teacher/notices', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    // FIXED: Notice Feed module added for manual access
    { title: 'Notice Feed', icon: <Megaphone size={32} />, path: '/notice-feed', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  ];

  const quickStats = [
    { label: 'Classes Today', value: '4', icon: <BookOpen size={16}/> },
    { label: 'Students', value: studentCount, icon: <Users size={16}/> }, 
    { label: 'Leaves', value: '2', icon: <ClipboardList size={16}/> },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-5 mt-0 space-y-6 relative z-10 pb-24">
        {/* Quick Stats Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex justify-between items-center">
          {quickStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 border-r last:border-0 border-white/5">
              <div className="text-blue-400 mb-1 opacity-80">{stat.icon}</div>
              <span className="text-xl font-black text-white tracking-tighter">{stat.value}</span>
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Icon Grid */}
        <div className="grid grid-cols-2 gap-4">
          {teacherModules.map((m, i) => (
            <Link to={m.path} key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 shadow-xl border border-white/10 active:scale-95 transition-all">
              <div className={`p-4 rounded-[2rem] border ${m.color}`}>
                {m.icon}
              </div>
              <span className="font-black text-gray-800 text-sm tracking-tight">{m.title}</span>
            </Link>
          ))}
        </div>

        {/* Meeting Card */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-white/10 rounded-[3rem] p-7 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-blue-400" />
                <h3 className="font-black text-lg tracking-tight uppercase italic">Staff Briefing</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">System sync today at 04:00 PM. Room A-204.</p>
            <button className="mt-5 bg-blue-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-90 transition-all">
              Initialize
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;