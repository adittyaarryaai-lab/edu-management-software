import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Fri');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const schedule = [
    { time: '09:10 - 10:00', subject: 'Public Speaking (PP)', class: 'SectionA (A-105)', type: 'Lecture', color: 'border-l-neon' },
    { time: '11:00 - 12:40', subject: 'Web Dev - II (React)', class: 'SectionB-FS (LAB-03)', type: 'Practical', color: 'border-l-neon' },
    { time: '02:00 - 03:00', subject: 'Project Mentorship', class: 'Final Year', type: 'Meeting', color: 'border-l-neon' },
  ];

  return (
    <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
      <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter italic text-center flex-1 mr-8">Faculty Schedule</h1>
        </div>

        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2 relative z-10 px-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl transition-all duration-500 border ${
                activeDay === day ? 'bg-neon text-void border-neon shadow-[0_0_20px_rgba(61,242,224,0.4)] scale-105' : 'bg-white/5 text-neon/40 border-white/5'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest italic">{day}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-4 relative z-20">
        <p className="text-[9px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 flex items-center gap-2 italic">
            <Calendar size={12}/> {activeDay} Sequence Matrix
        </p>

        {schedule.map((item, index) => (
          <div key={index} className={`bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-5 border-l-[6px] ${item.color} shadow-2xl border-white/5 flex gap-4 relative overflow-hidden group hover:border-neon/30 transition-all italic`}>
            <span className="absolute top-0 right-8 bg-neon/10 text-neon text-[8px] font-black px-4 py-1 rounded-b-lg uppercase tracking-widest">
                {item.type}
            </span>

            <div className="flex flex-col items-center justify-center border-r border-white/5 pr-4 min-w-[90px]">
              <Clock size={16} className="text-neon mb-1 animate-pulse" />
              <span className="text-[10px] font-black text-white text-center leading-tight">
                {item.time}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-black text-white text-sm leading-tight mb-1 uppercase italic tracking-tight group-hover:text-neon transition-colors">{item.subject}</h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-white/40">
                    <MapPin size={12} className="text-neon/60"/>
                    <span className="text-[9px] font-black uppercase tracking-tighter">{item.class}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                    <Users size={12} className="text-neon/60"/>
                    <span className="text-[9px] font-black uppercase tracking-tighter">Personnel Assigned</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSchedule;