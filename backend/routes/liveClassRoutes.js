const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

// Helper function to calculate overlapping time
const getMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return hours * 60 + minutes;
};

// 1. Get Setup Data: Which classes & subjects does this teacher teach?
router.get('/setup-data', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const empId = req.user.employeeId;

        // Fetch all timetables for this school
        const timetables = await Timetable.find({ schoolId });
        
        const teachingMap = {}; // Format: { "9-A": ["Science", "Math"], "10-B": ["Science"] }

        timetables.forEach(tt => {
            tt.schedule.forEach(day => {
                day.periods.forEach(p => {
                    if (p.teacherEmpId === empId && p.subject && p.subject !== 'Break') {
                        if (!teachingMap[tt.grade]) teachingMap[tt.grade] = new Set();
                        teachingMap[tt.grade].add(p.subject);
                    }
                });
            });
        });

        const formattedData = Object.keys(teachingMap).map(grade => ({
            grade,
            subjects: Array.from(teachingMap[grade])
        })).sort((a, b) => {
            // Logic: Grade string ko split karke number part ko compare karo
            // "9-A" -> 9, "11-C" -> 11
            const gradeA = parseInt(a.grade.split('-')[0]);
            const gradeB = parseInt(b.grade.split('-')[0]);
            
            if (gradeA !== gradeB) {
                return gradeA - gradeB; // Choti grade pehle
            }
            // Agar grade number same hai (e.g., 9-A, 9-B), toh alphabet ke hisab se sort karo
            return a.grade.localeCompare(b.grade);
        });

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch teaching data." });
    }
})

// 2. Propose a new Live Class (With Clash Detection)
router.post('/request', protect, async (req, res) => {
    try {
        const { grade, subjectName, platform, date, startTime, endTime } = req.body;
        
        const newStart = getMinutes(startTime);
        const newEnd = getMinutes(endTime);

        if (newStart >= newEnd) {
            return res.status(400).json({ message: "End time must be strictly after Start time!" });
        }

        // --- CLASH DETECTION LOGIC ---
        // Find if any class is already scheduled/pending for THIS grade on THIS date
        const existingClasses = await LiveClass.find({
            schoolId: req.user.schoolId,
            grade,
            date,
            status: { $in: ['pending', 'approved'] }
        });

        for (let ec of existingClasses) {
            const exStart = getMinutes(ec.startTime);
            const exEnd = getMinutes(ec.endTime);

            // Overlap condition
            if (newStart < exEnd && newEnd > exStart) {
                return res.status(400).json({ 
                    message: `Clash Detected! ${ec.proposerName} already has a ${ec.subjectName} class scheduled from ${ec.startTime} to ${ec.endTime} for Class ${grade}.` 
                });
            }
        }

        const newClass = await LiveClass.create({
            schoolId: req.user.schoolId,
            proposerId: req.user.employeeId,
            proposerName: req.user.name,
            grade,
            subjectName,
            platform,
            date,
            startTime,
            endTime
        });

        res.status(201).json({ message: "Live Class Requested Successfully!", data: newClass });
    } catch (error) {
        res.status(500).json({ message: "Failed to request live class." });
    }
});

// 3. Get My Requests (For Subject Teacher)
router.get('/my-requests', protect, async (req, res) => {
    try {
        const requests = await LiveClass.find({ proposerId: req.user.employeeId, schoolId: req.user.schoolId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your requests." });
    }
});

// 4. Monitor Hub: Get requests for a specific Class Teacher's Grade
router.get('/monitor/:grade', protect, async (req, res) => {
    try {
        const requests = await LiveClass.find({ grade: req.params.grade.trim(), schoolId: req.user.schoolId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching monitor data." });
    }
});

// 5. Approve Request & Auto-Generate REAL Zoom Meetings
router.put('/approve/:id', protect, async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id);
        if (!liveClass) {
            return res.status(404).json({ message: "Record not found." });
        }

        if (liveClass.platform === "Zoom") {
            const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_EMAIL } = process.env;

            const authHeader = Buffer.from(
                `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
            ).toString("base64");

            const tokenResponse = await axios.post(
                "https://zoom.us/oauth/token",
                null,
                {
                    params: {
                        grant_type: "account_credentials",
                        account_id: ZOOM_ACCOUNT_ID
                    },
                    headers: {
                        Authorization: `Basic ${authHeader}`
                    }
                }
            );

            const accessToken = tokenResponse.data.access_token;

            const [day, month, year] = liveClass.date.split("-");
            const [time, modifier] = liveClass.startTime.split(" ");

            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "AM" && hours === 12) hours = 0;
            if (modifier === "PM" && hours !== 12) hours += 12;

            const isoDateTime =
                `${year}-${month}-${day}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

            const zoomMeetingResponse = await axios.post(
                `https://api.zoom.us/v2/users/${ZOOM_EMAIL}/meetings`,
                {
                    topic: `${liveClass.subjectName} Live Class`,
                    type: 2,
                    start_time: isoDateTime,
                    duration: 60,
                    timezone: "Asia/Kolkata",
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: false, // Host se pehle koi nahi ghusega
                        mute_upon_entry: true,
                        waiting_room: true       // <--- YE LINE ADD KI HAI (Waiting room strictly ON)
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            liveClass.hostLink = zoomMeetingResponse.data.start_url;
            liveClass.studentLink = zoomMeetingResponse.data.join_url;
        }

        liveClass.status = "approved";
        await liveClass.save();

        res.json({
            message: "Class Approved! Zoom meeting created."
        });

    } catch (error) {
        console.error("Zoom API Error:", error.response?.data || error.message);

        res.status(500).json({
            message: "Failed to generate Zoom meeting."
        });
    }
});

// 6. Reject/Delete Request
router.delete('/:id', protect, async (req, res) => {
    try {
        await LiveClass.findByIdAndDelete(req.params.id);
        res.json({ message: "Request Rejected & Removed." });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove request." });
    }
});

// 7. STUDENT: Get Approved Live Classes for Student's Grade
router.get('/student-classes', protect, async (req, res) => {
    try {
        const studentGrade = req.user.grade?.trim();

        if (!studentGrade) {
            return res.status(400).json({ message: "Student grade configuration missing." });
        }

        // Sirf wahi classes dhoondho jo is bache ki class (e.g. 9-A) ki hain, aur Approved hain.
        const classes = await LiveClass.find({
            schoolId: req.user.schoolId,
            grade: studentGrade,
            status: 'approved'
        }).sort({ createdAt: -1 }); // Nayi classes pehle dikhengi

        res.json(classes);
    } catch (error) {
        console.error("Fetch Student Classes Error:", error);
        res.status(500).json({ message: "Failed to fetch live classes." });
    }
});

module.exports = router;