const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User'); 
const { protect, teacherOnly, adminOnly } = require('../middleware/authMiddleware');

router.get('/students/:grade', protect, teacherOnly, async (req, res) => {
    try {
        const students = await User.find({ 
            role: 'student', 
            grade: req.params.grade,
            schoolId: req.user.schoolId // FIXED: Only my school students
        })
            .select('name email enrollmentNo grade');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Students fetch fail ho gaye' });
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
        const allRecords = await Attendance.find({ 
            'records.studentId': studentId,
            schoolId: req.user.schoolId // FIXED
        });

        let totalDays = allRecords.length;
        let presentDays = 0;
        let absentHistory = []; 

        allRecords.forEach(record => {
            const studentEntry = record.records.find(r => r.studentId.toString() === studentId.toString());
            if (studentEntry) {
                if (studentEntry.status === 'Present') {
                    presentDays++;
                } else {
                    absentHistory.push({ date: record.date, status: studentEntry.status });
                }
            }
        });

        const percentage = totalDays === 0 ? 0 : ((presentDays / totalDays) * 100).toFixed(1);

        res.json({
            totalDays,
            presentDays,
            absentDays: totalDays - presentDays,
            percentage,
            absentHistory 
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