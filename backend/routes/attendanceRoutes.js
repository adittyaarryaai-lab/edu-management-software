const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect, teacherOnly, adminOnly } = require('../middleware/authMiddleware');

router.get('/my-students', protect, teacherOnly, async (req, res) => {
    try {
        const assignedClass = req.user.assignedClass;
        if (!assignedClass) {
            return res.status(404).json({ message: 'No class assigned to you!' });
        }
        const students = await User.find({
            role: 'student',
            grade: assignedClass,
            schoolId: req.user.schoolId
        }).select('name email enrollmentNo grade');

        res.json({ students, assignedClass });
    } catch (error) {
        res.status(500).json({ message: 'Neural Sync Error' });
    }
});

router.post('/mark', protect, teacherOnly, async (req, res) => {
    const { grade, date, records } = req.body;
    try {
        let attendance = await Attendance.findOne({ grade, date, schoolId: req.user.schoolId });

        if (attendance) {
            attendance.records = records;
            attendance.teacher = req.user._id;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                schoolId: req.user.schoolId, // FIXED: School ID link
                teacher: req.user._id,
                grade,
                date,
                records
            });
        }
        res.status(201).json({ message: 'Attendance Synchronized! ✅', attendance });
    } catch (error) {
        res.status(500).json({ message: 'Server Error saving attendance' });
    }
});

router.get('/view', protect, async (req, res) => {
    const { grade, date } = req.query;
    try {
        const data = await Attendance.findOne({ grade, date, schoolId: req.user.schoolId });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
});

router.get('/student-stats', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        const { month } = req.query; // Frontend se month aayega (e.g., "2026-02")

        // 1. Saari records fetch karo overall stats ke liye
        const allRecords = await Attendance.find({
            'records.studentId': studentId,
            schoolId: req.user.schoolId
        }).sort({ date: 1 });

        // 2. Sirf selected month ki records filter karo history ke liye
        // Agar month query mein hai toh filter karo, nahi toh saari dikhao
        const filteredRecords = month 
            ? allRecords.filter(r => r.date.startsWith(month)) 
            : allRecords;

        let presentDays = 0;
        let totalDays = allRecords.length;
        
        // Overall Percentage nikalne ke liye loop
        allRecords.forEach(record => {
            const entry = record.records.find(r => r.studentId.toString() === studentId.toString());
            if (entry && entry.status === 'Present') presentDays++;
        });

        // Detailed History (Date + Status) taiyar karo selected month ke liye
        const history = filteredRecords.map(record => {
            const entry = record.records.find(r => r.studentId.toString() === studentId.toString());
            return {
                date: record.date,
                status: entry ? entry.status : 'N/A'
            };
        });

        const percentage = totalDays === 0 ? 0 : ((presentDays / totalDays) * 100).toFixed(1);

        res.json({
            totalDays,
            presentDays,
            absentDays: totalDays - presentDays,
            percentage,
            history // Ye bache ko niche list mein dikhega
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats' });
    }
});

router.get('/admin-report/:grade', protect, adminOnly, async (req, res) => {
    try {
        const { grade } = req.params;
        const students = await User.find({
            role: 'student',
            grade,
            schoolId: req.user.schoolId // FIXED
        }).select('name enrollmentNo');

        const attendanceData = await Attendance.find({
            grade,
            schoolId: req.user.schoolId // FIXED
        });

        const report = students.map(student => {
            let present = 0;
            let total = 0;

            attendanceData.forEach(day => {
                const record = day.records.find(r =>
                    (r.studentId && r.studentId.toString() === student._id.toString()) ||
                    (r.student && r.student.toString() === student._id.toString())
                );

                if (record) {
                    total++;
                    if (record.status === 'Present') present++;
                }
            });

            const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

            return {
                name: student.name,
                roll: student.enrollmentNo,
                percentage: percentage,
                status: (percentage < 75 && total > 0) ? 'Low' : 'Good'
            };
        });

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Admin report fetch failed' });
    }
});

module.exports = router;