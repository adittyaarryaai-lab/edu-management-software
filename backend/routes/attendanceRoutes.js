const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware');

// @desc    Save daily attendance
// @route   POST /api/attendance/save
router.post('/save', protect, async (req, res) => {
    const { grade, date, records } = req.body;

    try {
        // Check if attendance already exists for this date and grade
        let attendance = await Attendance.findOne({ grade, date });

        if (attendance) {
            attendance.records = records; // Update if exists
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                teacher: req.user._id,
                grade,
                date,
                records
            });
        }
        res.status(201).json({ message: 'Attendance saved successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: 'Server Error saving attendance' });
    }
});
// @desc    Get student attendance percentage
// @route   GET /api/attendance/student-stats
router.get('/student-stats', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        // Saari attendance records dhoondo jahan is student ka data ho
        const allRecords = await Attendance.find({ 'records.student': studentId });

        let totalDays = allRecords.length;
        let presentDays = 0;

        allRecords.forEach(record => {
            const studentEntry = record.records.find(r => r.student.toString() === studentId.toString());
            if (studentEntry && studentEntry.status === 'Present') {
                presentDays++;
            }
        });

        const percentage = totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);
        
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

module.exports = router;