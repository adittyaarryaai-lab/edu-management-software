const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Create or Update Timetable
// @route   POST /api/timetable/upload
router.post('/upload', protect, adminOnly, async (req, res) => {
    const { grade, schedule } = req.body;
    try {
        let timetable = await Timetable.findOne({ grade });
        if (timetable) {
            timetable.schedule = schedule;
            await timetable.save();
        } else {
            timetable = await Timetable.create({ grade, schedule });
        }
        res.status(201).json({ message: 'Timetable updated successfully', timetable });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get Timetable by Grade
// @route   GET /api/timetable/:grade
router.get('/:grade', protect, async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ grade: req.params.grade })
            .populate('schedule.periods.teacher', 'name');
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;