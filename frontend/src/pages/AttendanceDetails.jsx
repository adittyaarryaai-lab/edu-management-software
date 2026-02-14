import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // API import kiya
import Loader from '../components/Loader';

const AttendanceDetails = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [overall, setOverall] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAttendance = async () => {
      try {
        // Hum backend se student ki puri attendance history mangayenge
        const { data } = await API.get('/attendance/student-stats'); 
        
        // Note: Filhaal hum wahi logic use kar rahe hain, 
        // aage ja kar hum subject-wise filter backend se hi layenge.
        // Ye niche wala format database structure ke hisab se update hoga.
        
        setOverall(data.percentage);
        
        // Mocking structure for now based on your UI, 
        // real integration mein ye backend array se map hoga
        const mockSubjectData = [
          { subject: "Engineering Physics", delivered: data.totalDays, attended: data.presentDays, percentage: data.percentage, color: "bg-blue-500" },
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
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header Area */}
      <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight uppercase">Attendance</h1>
          <MoreVertical size={20} className="opacity-70" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm opacity-80 font-medium">Overall Attendance Percentage</p>
          <h2 className="text-5xl font-extrabold mt-1">{overall}%</h2>
          <div className="flex justify-center gap-6 mt-4 text-[10px] font-bold uppercase tracking-widest opacity-70">
            <span className="flex items-center gap-1">D: Delivered</span>
            <span className="flex items-center gap-1">A: Attended</span>
          </div>
        </div>
      </div>

      {/* Subject Wise Bars */}
      <div className="px-5 -mt-12 space-y-4">
        {attendanceData.map((item, index) => (
          <div key={index} className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800 text-sm w-2/3 leading-tight">{item.subject}</h3>
              <div className="text-right">
                <span className="text-blue-600 font-extrabold text-lg">{item.percentage}%</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">
              <span>Delivered: {item.delivered}</span>
              <span>Attended: {item.attended}</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`${item.color} h-full transition-all duration-700 ease-out rounded-full`} 
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