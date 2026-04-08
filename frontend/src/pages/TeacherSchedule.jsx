import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Monday');
  const [personalSchedule, setPersonalSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const daysMap = [
    { short: 'Mon', full: 'Monday' }, { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' }, { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' }, { short: 'Sat', full: 'Saturday' }
  ];

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const { data } = await API.get('/timetable/teacher/personal-schedule');
        setPersonalSchedule(data.schedule);
      } catch (err) { console.error("Faculty sync failed"); }
      finally { setLoading(false); }
    };
    fetchPersonalData();
  }, []);

  const currentDayData = personalSchedule?.find(d => d.day === activeDay);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-white text-slate-800 px-6 pt-12 pb-20 rounded-b-[4rem] border-b border-slate-100 shadow-md relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10 px-2">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl border border-[#DDE3EA] text-[#42A5F5] shadow-md active:scale-90 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black italic tracking-tight capitalize">Class schedule</h1>
          <div className="p-3 bg-blue-50 rounded-2xl text-[#42A5F5]">
            <Calendar size={24} />
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex justify-between overflow-x-auto gap-3 no-scrollbar py-2 relative z-10 px-2">
          {daysMap.map((day) => (
            <button
              key={day.full}
              onClick={() => setActiveDay(day.full)}
              className={`flex flex-col items-center min-w-[60px] py-4 rounded-2xl border transition-all ${activeDay === day.full
                  ? 'bg-[#42A5F5] text-white border-[#42A5F5] shadow-lg shadow-blue-100'
                  : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white'
                }`}
            >
              <span className="text-[12px] font-black uppercase italic tracking-wider">{day.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Matrix Area */}
      <div className="px-5 -mt-10 space-y-6 relative z-20">
        {currentDayData && currentDayData.periods.length > 0 ? (
          [...currentDayData.periods]
            .sort((a, b) => {
              const timeA = new Date(`1970/01/01 ${a.startTime}`);
              const timeB = new Date(`1970/01/01 ${b.startTime}`);
              return timeA - timeB;
            })
            .map((item, index) => (
              <div key={index} className="bg-white rounded-[3rem] p-6 border-l-[8px] border-l-[#42A5F5] shadow-xl border border-slate-100 flex gap-5 relative italic group hover:scale-[1.02] transition-transform">
                <span className="absolute top-0 right-10 bg-blue-50 text-[#42A5F5] text-[15px] font-black px-5 py-1.5 rounded-b-2xl uppercase tracking-widest border-x border-b border-blue-100">
                  Class: {item.grade}
                </span>

                {/* Time Slot */}
                <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-5 min-w-[100px]">
                  <Clock size={20} className="text-[#42A5F5] mb-2 animate-pulse" />
                  <span className="text-[15px] font-bold text-slate-700 leading-tight uppercase">{item.startTime}</span>
                  <span className="text-[15px] font-bold text-slate-700 uppercase mt-1 italic">To</span>
                  <span className="text-[15px] font-bold text-slate-700 uppercase mt-1 italic">{item.endTime}</span>
                </div>

                {/* Subject Info */}
                <div className="flex-1 pt-4">
                  <h3 className="font-black text-slate-800 text-[20px] leading-tight mb-2 capitalize italic group-hover:text-[#42A5F5] transition-colors">
                   💠 {item.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 mt-3 bg-slate-50 w-fit px-4 py-1.5 rounded-full border border-slate-100">
                    <MapPin size={18} className="text-[#42A5F5]/60" />
                    <span className="text-[15px] font-black uppercase tracking-wider italic">Room no: {item.room}</span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-sm mx-2">
            <BookOpen className="mx-auto text-slate-200 mb-6 animate-bounce" size={80} />
            <p className="text-slate-300 font-black text-[15px] uppercase tracking-[0.4em] italic text-center px-10">Free from today classes! ⚡</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;