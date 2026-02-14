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
      // Check if user and grade exists
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
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold uppercase tracking-tight">Time Table</h1>
            <p className="text-[10px] font-bold opacity-70 tracking-widest uppercase">
                {user?.grade ? `Grade: ${user.grade}` : "Grade: Not Assigned"}
            </p>
          </div>
          <div className="w-8"></div> 
        </div>

        <div className="flex justify-between overflow-x-auto gap-2 no-scrollbar py-2">
          {daysMap.map((day) => (
            <button
              key={day.full}
              onClick={() => setActiveDay(day.full)}
              className={`flex flex-col items-center min-w-[55px] py-3 rounded-2xl transition-all duration-300 ${
                activeDay === day.full ? 'bg-white text-blue-600 shadow-xl scale-105' : 'bg-white/10 text-white'
              }`}
            >
              <span className="text-xs font-bold">{day.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-4">
        {currentSchedule && currentSchedule.periods.length > 0 ? (
          currentSchedule.periods.map((item, index) => (
            <div key={index} className="glass-card p-5 border-l-4 border-l-blue-500 flex gap-4 animate-in fade-in duration-300">
              <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 min-w-[90px]">
                <Clock size={16} className="text-slate-400 mb-1" />
                <span className="text-[10px] font-black text-slate-800 text-center uppercase tracking-tighter">
                  {item.startTime}
                </span>
                <span className="text-[8px] font-bold text-slate-300 text-center uppercase">
                  TO {item.endTime}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-black text-slate-800 text-sm mb-1 uppercase leading-tight">{item.subject}</h3>
                <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                  <span className="text-blue-500">●</span> {item.teacher?.name || "Professor"}
                </p>
                <div className="flex items-center gap-1 mt-3 text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                  <MapPin size={12} />
                  <span className="text-[9px] font-black uppercase">Hall 204</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200">
            <BookOpen className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Lectures Scheduled</p>
            <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-tight">Select another day or check later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;