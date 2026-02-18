const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Zaroori hai students fetch karne ke liye
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// @desc    1. Get Students for Attendance (Teacher selects Grade)
// @route   GET /api/attendance/students/:grade
router.get('/students/:grade', protect, teacherOnly, async (req, res) => {
    try {
        // Sirf wahi bache uthayega jo us specific grade mein hain
        const students = await User.find({ role: 'student', grade: req.params.grade })
            .select('name email enrollmentNo grade');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Students fetch fail ho gaye' });
    }
});

// @desc    2. Mark or Update daily attendance (Upsert Logic)
// @route   POST /api/attendance/mark
router.post('/mark', protect, teacherOnly, async (req, res) => {
    const { grade, date, records } = req.body;

    try {
        // Check if attendance already exists for this date and grade
        let attendance = await Attendance.findOne({ grade, date });

        if (attendance) {
            attendance.records = records; // Update if exists (Galti sudharne ke liye)
            attendance.teacher = req.user._id; // Kisne update kiya wo record rahega
            await attendance.save();
        } else {
            attendance = await Attendance.create({
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

// @desc    3. Get specific day attendance (To view or edit)
// @route   GET /api/attendance/view
router.get('/view', protect, async (req, res) => {
    const { grade, date } = req.query;
    try {
        const data = await Attendance.findOne({ grade, date });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
});

// @desc    4. Get student attendance stats (Dashboard Visualization)
// @route   GET /api/attendance/student-stats
router.get('/student-stats', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        // Saari records dhoondo jahan ye student entry ho
        const allRecords = await Attendance.find({ 'records.studentId': studentId });

        let totalDays = allRecords.length;
        let presentDays = 0;

        allRecords.forEach(record => {
            const studentEntry = record.records.find(r => r.studentId.toString() === studentId.toString());
            if (studentEntry && studentEntry.status === 'Present') {
                presentDays++;
            }
        });

        const percentage = totalDays === 0 ? 0 : ((presentDays / totalDays) * 100).toFixed(2);

        res.json({
            totalDays,
            presentDays,
            absentDays: totalDays - presentDays,
            percentage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats' });
    }
});
// Student checking their own attendance percentage
router.get('/my-stats', protect, async (req, res) => {
    try {
        const attendance = await Attendance.find({ "records.studentId": req.user._id });
        let present = 0;
        attendance.forEach(day => {
            const record = day.records.find(r => r.studentId.toString() === req.user._id.toString());
            if (record.status === 'Present') present++;
        });
        const percentage = attendance.length > 0 ? (present / attendance.length) * 100 : 0;
        res.json({ total: attendance.length, present, percentage: percentage.toFixed(2) });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

module.exports = router;