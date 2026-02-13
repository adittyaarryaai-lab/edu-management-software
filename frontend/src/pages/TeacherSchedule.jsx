import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Fri');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mock Schedule for Teacher
  const schedule = [
    { time: '09:10 - 10:00', subject: 'Public Speaking (PP)', class: 'SectionA (A-105)', type: 'Lecture', color: 'border-l-blue-500' },
    { time: '11:00 - 12:40', subject: 'Web Dev - II (React)', class: 'SectionB-FS (LAB-03)', type: 'Practical', color: 'border-l-purple-500' },
    { time: '02:00 - 03:00', subject: 'Project Mentorship', class: 'Final Year', type: 'Meeting', color: 'border-l-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold uppercase tracking-tight text-center flex-1 mr-8">My Schedule</h1>
        </div>

        {/* Horizontal Day Scroller */}
        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl transition-all ${
                activeDay === day ? 'bg-white text-blue-600 shadow-xl scale-105' : 'bg-white/10 text-white'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{day}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
            <Calendar size={12}/> {activeDay}, 13 Feb 2026
        </p>

        {schedule.map((item, index) => (
          <div key={index} className={`bg-white rounded-[2rem] p-5 border-l-[6px] ${item.color} shadow-lg shadow-slate-200/50 flex gap-4 relative overflow-hidden`}>
            {/* Class Type Tag */}
            <span className="absolute top-0 right-8 bg-slate-50 text-slate-400 text-[8px] font-black px-3 py-1 rounded-b-lg uppercase">
                {item.type}
            </span>

            <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 min-w-[90px]">
              <Clock size={16} className="text-blue-500 mb-1" />
              <span className="text-[10px] font-black text-slate-700 text-center leading-tight">
                {item.time}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-extrabold text-slate-800 text-sm leading-tight mb-1">{item.subject}</h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={12} className="text-blue-400"/>
                    <span className="text-[10px] font-bold uppercase">{item.class}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Users size={12} className="text-purple-400"/>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">65 Students Assigned</span>
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