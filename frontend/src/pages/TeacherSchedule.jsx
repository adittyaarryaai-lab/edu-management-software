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
      } catch (err) { console.error("Faculty Sync Failed"); }
      finally { setLoading(false); }
    };
    fetchPersonalData();
  }, []);

  const currentDayData = personalSchedule?.find(d => d.day === activeDay);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
      {/* Header same as before */}
      <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] border-b border-neon/20 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10 px-2">
          <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-black uppercase tracking-tighter italic">Class Schedule</h1>
        </div>

        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2 relative z-10 px-2">
          {daysMap.map((day) => (
            <button key={day.full} onClick={() => setActiveDay(day.full)}
              className={`flex flex-col items-center min-w-[55px] py-3 rounded-2xl border transition-all ${activeDay === day.full ? 'bg-neon text-void border-neon shadow-[0_0_20px_rgba(61,242,224,0.4)]' : 'bg-white/5 text-neon/40 border-white/5'
                }`}
            >
              <span className="text-[10px] font-black uppercase italic">{day.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Matrix */}
      <div className="px-5 -mt-8 space-y-4 relative z-20">
        {currentDayData && currentDayData.periods.length > 0 ? (
          [...currentDayData.periods]
            .sort((a, b) => {
              // Time ko compare karne ke liye am/pm format ko handle kiya
              const timeA = new Date(`1970/01/01 ${a.startTime}`);
              const timeB = new Date(`1970/01/01 ${b.startTime}`);
              return timeA - timeB;
            })
            .map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-5 border-l-[6px] border-l-neon shadow-2xl border-white/5 flex gap-4 relative italic group">
                <span className="absolute top-0 right-8 bg-neon/10 text-neon text-[8px] font-black px-4 py-1 rounded-b-lg uppercase">
                  Class: {item.grade}
                </span>

                <div className="flex flex-col items-center justify-center border-r border-white/5 pr-4 min-w-[90px]">
                  <Clock size={16} className="text-neon mb-1 animate-pulse" />
                  <span className="text-[10px] font-black text-white leading-tight uppercase">{item.startTime}</span>
                  <span className="text-[8px] font-black text-white/20 uppercase mt-1 italic">To {item.endTime}</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-white text-sm leading-tight mb-1 uppercase italic group-hover:text-neon transition-colors">{item.subject}</h3>
                  <div className="flex items-center gap-1.5 text-white/40 mt-2">
                    <MapPin size={12} className="text-neon/60" />
                    <span className="text-[9px] font-black uppercase tracking-tighter italic">ROOM NO.: {item.room}</span>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-20 bg-void border border-dashed border-white/5 shadow-inner">
            <BookOpen className="mx-auto text-neon/10 mb-4 animate-pulse" size={48} />
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic text-center">Free from today classes! ⚡</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;