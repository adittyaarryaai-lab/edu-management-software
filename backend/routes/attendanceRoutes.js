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

module.exports = router;