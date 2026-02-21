import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AttendanceDetails = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [overall, setOverall] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAttendance = async () => {
      try {
        const { data } = await API.get('/attendance/student-stats'); 
        setOverall(data.percentage);
        const mockSubjectData = [
          { subject: "Engineering Physics", delivered: data.totalDays, attended: data.presentDays, percentage: data.percentage, color: "bg-neon" },
        ];
        setAttendanceData(mockSubjectData);
      } catch (err) {
        console.error("Error fetching details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAttendance();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-void pb-20 font-sans italic">
      <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Neural Presence</h1>
          <MoreVertical size={20} className="text-neon/50" />
        </div>

        <div className="mt-4 text-center relative z-10">
          <p className="text-[10px] text-neon/40 font-black uppercase tracking-[0.3em]">Total Attendance Index</p>
          <h2 className="text-6xl font-black mt-1 text-white tracking-tighter">{overall}%</h2>
          <div className="flex justify-center gap-6 mt-6 text-[8px] font-black uppercase tracking-widest text-neon/60">
            <span className="flex items-center gap-1">D: Delivered</span>
            <span className="flex items-center gap-1">A: Attended</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 space-y-4 relative z-20">
        {attendanceData.map((item, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-white text-sm w-2/3 leading-tight uppercase italic tracking-tight">{item.subject}</h3>
              <div className="text-right">
                <span className="text-neon font-black text-xl italic">{item.percentage}%</span>
              </div>
            </div>

            <div className="flex justify-between text-[8px] font-black text-neon/40 mb-3 uppercase tracking-widest">
              <span>Sync Cycles: {item.delivered}</span>
              <span>Success: {item.attended}</span>
            </div>

            <div className="w-full bg-void h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`${item.color} h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(61,242,224,0.4)]`} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceDetails;