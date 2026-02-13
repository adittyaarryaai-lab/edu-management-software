import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Timetable = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Mon');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const schedule = [
    { time: '09:00 AM - 10:00 AM', subject: 'Calculus & Linear Algebra', teacher: 'Dr. Sharma', room: 'Room 302', color: 'border-l-blue-500' },
    { time: '10:15 AM - 11:15 AM', subject: 'Engineering Physics', teacher: 'Prof. Verma', room: 'Lab 1', color: 'border-l-orange-500' },
    { time: '11:30 AM - 12:30 PM', subject: 'Professional Comm.', teacher: 'Ms. Alice', room: 'Seminar Hall', color: 'border-l-green-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold uppercase tracking-tight">Time Table</h1>
          <div className="w-8"></div> 
        </div>

        {/* Horizontal Day Scroller */}
        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl transition-all ${
                activeDay === day ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/10 text-white'
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lectures List */}
      <div className="px-5 -mt-8 space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className={`glass-card p-5 border-l-4 ${item.color} flex gap-4`}>
            <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 min-w-[80px]">
              <Clock size={16} className="text-slate-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-tighter">
                {item.time.split(' - ')[0]}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm mb-1">{item.subject}</h3>
              <p className="text-xs text-slate-500 font-medium">{item.teacher}</p>
              <div className="flex items-center gap-1 mt-2 text-blue-600">
                <MapPin size={12} />
                <span className="text-[10px] font-bold uppercase">{item.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;