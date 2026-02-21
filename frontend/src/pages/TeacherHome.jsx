import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, BookOpen, Users, FilePlus, CalendarDays, 
  ClipboardList, Bot, Activity, Megaphone, MessageCircle, 
  Layers, Video
} from 'lucide-react';
import API from '../api'; 

const TeacherHome = ({ user }) => {
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/auth/student-stats');
        setStudentCount(data.totalStudents);
      } catch (err) {
        console.error("Error fetching student stats:", err);
        setStudentCount(120); 
      }
    };
    fetchStats();
  }, []);

  const teacherModules = [
    { title: 'Attendance', icon: <CheckSquare size={32} />, path: '/teacher/attendance', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Schedule', icon: <CalendarDays size={32} />, path: '/timetable', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Assignments', icon: <FilePlus size={32} />, path: '/teacher/assignments', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Class List', icon: <Users size={32} />, path: '/teacher/students', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Live Class', icon: <Video size={32} />, path: '/teacher/live-class', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Broadcast', icon: <Bot size={32} />, path: '/teacher/notices', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Notice Feed', icon: <Megaphone size={32} />, path: '/notice-feed', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Support', icon: <MessageCircle size={32} />, path: '/teacher/support', color: 'text-neon bg-neon/10 border-neon/20' },
    { title: 'Syllabus', icon: <Layers size={32} />, path: '/teacher/upload-syllabus', color: 'text-neon bg-neon/10 border-neon/20' },
  ];

  const quickStats = [
    { label: 'Active Blocks', value: '4', icon: <BookOpen size={16}/> },
    { label: 'Neural Nodes', value: studentCount, icon: <Users size={16}/> }, 
    { label: 'Downtime', value: '2', icon: <ClipboardList size={16}/> },
  ];

  return (
    <div className="min-h-screen bg-void font-sans italic text-white">
      <div className="px-5 mt-0 space-y-6 relative z-10 pb-24">
        
        {/* Quick Stats Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-neon/20 flex justify-between items-center italic">
          {quickStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 border-r last:border-0 border-white/5">
              <div className="text-neon mb-1 opacity-60 group-hover:scale-110 transition-all">{stat.icon}</div>
              <span className="text-xl font-black text-white tracking-tighter italic">{stat.value}</span>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] text-center italic leading-none">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Icon Grid */}
        <div className="grid grid-cols-2 gap-4">
          {teacherModules.map((m, i) => (
            <Link to={m.path} key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3 shadow-2xl border border-white/5 active:scale-95 transition-all group hover:border-neon/30 italic">
              <div className={`p-4 rounded-[2rem] border transition-all group-hover:shadow-[0_0_20px_rgba(61,242,224,0.3)] ${m.color}`}>
                {m.icon}
              </div>
              <span className="font-black text-white/80 text-xs tracking-tight uppercase tracking-[0.1em] group-hover:text-neon transition-colors">{m.title}</span>
            </Link>
          ))}
        </div>

        {/* Staff Briefing Card */}
        <div className="bg-void border border-neon/20 rounded-[3rem] p-7 text-white shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-neon animate-pulse" />
                <h3 className="font-black text-lg tracking-tight uppercase italic text-white/90">Personnel Briefing</h3>
            </div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed italic">System synchronization sequence today at 1600 HRS. Node Sector A-204.</p>
            <button className="mt-6 bg-neon text-void px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.4)] active:scale-90 transition-all italic">
              Acknowledge
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-neon/5 rounded-full blur-3xl group-hover:bg-neon/10 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;