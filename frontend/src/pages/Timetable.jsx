import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader';

const Timetable = ({ user }) => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Monday'); 
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  const daysMap = [
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' },
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user?.grade) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get(`/timetable/${user.grade}`);
        setTimetable(data);
      } catch (err) {
        console.error("Timetable fetch error");
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [user]); 

  const currentSchedule = timetable?.schedule?.find(d => d.day === activeDay);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-void pb-20 font-sans italic text-white">
      <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Schedule Matrix</h1>
            <p className="text-[9px] font-black text-neon/40 tracking-[0.3em] uppercase italic">
                {user?.grade ? `Sector Node: ${user.grade}` : "Node Not Assigned"}
            </p>
          </div>
          <div className="w-8"></div> 
        </div>

        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2 relative z-10 px-2">
          {daysMap.map((day) => (
            <button
              key={day.full}
              onClick={() => setActiveDay(day.full)}
              className={`flex flex-col items-center min-w-[55px] py-3 rounded-2xl transition-all duration-500 border ${
                activeDay === day.full ? 'bg-neon text-void border-neon shadow-[0_0_20px_rgba(61,242,224,0.4)] scale-105' : 'bg-white/5 text-neon/40 border-white/5'
              }`}
            >
              <span className="text-[10px] font-black italic uppercase tracking-widest">{day.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-4 relative z-20">
        {currentSchedule && currentSchedule.periods.length > 0 ? (
          currentSchedule.periods.map((item, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-xl p-5 border-l-4 border-l-neon shadow-2xl border-white/5 flex gap-4 animate-in fade-in duration-500 italic group">
              <div className="flex flex-col items-center justify-center border-r border-white/5 pr-4 min-w-[90px]">
                <Clock size={16} className="text-neon/40 mb-1 group-hover:animate-pulse" />
                <span className="text-[10px] font-black text-white text-center uppercase tracking-tighter leading-none">
                  {item.startTime}
                </span>
                <span className="text-[8px] font-black text-white/20 text-center uppercase mt-1">
                  TO {item.endTime}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-black text-white text-sm mb-1 uppercase leading-tight italic group-hover:text-neon transition-colors">{item.subject}</h3>
                <p className="text-[10px] text-white/30 font-black flex items-center gap-1.5 uppercase italic">
                  <span className="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_8px_rgba(61,242,224,1)]"></span> {item.teacher?.name || "Neural Professor"}
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-neon bg-neon/10 w-fit px-3 py-1 rounded-lg border border-neon/20 shadow-inner">
                  <MapPin size={10} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Sector Node 204</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
            <BookOpen className="mx-auto text-neon/10 mb-4 animate-pulse" size={48} />
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Lectures Scheduled In This Matrix</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;