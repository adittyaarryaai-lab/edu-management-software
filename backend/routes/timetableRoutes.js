const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Create or Update Timetable
// @route   POST /api/timetable/upload
router.post('/upload', protect, adminOnly, async (req, res) => {
    const { grade, schedule } = req.body;

    try {
        // 1. Check karo ki is Grade ka timetable pehle se hai ya nahi
        let timetable = await Timetable.findOne({ grade });

        if (timetable) {
            // 2. Agar hai, toh naye din ka data merge karo
            const newDayData = schedule[0]; 
            const dayIndex = timetable.schedule.findIndex(s => s.day === newDayData.day);

            if (dayIndex !== -1) {
                // Din mil gaya, periods update karo
                timetable.schedule[dayIndex].periods = newDayData.periods;
            } else {
                // Naya din hai, push karo
                timetable.schedule.push(newDayData);
            }
            await timetable.save();
        } else {
            // 3. Bilkul naya record banao
            timetable = await Timetable.create({ grade, schedule });
        }

        res.status(201).json({ message: 'Timetable updated successfully', timetable });
    } catch (error) {
        console.error("Timetable Save Error:", error);
        res.status(500).json({ message: 'Server Error saving timetable' });
    }
});

// @desc    Get Timetable by Grade
// @route   GET /api/timetable/:grade
router.get('/:grade', protect, async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ grade: req.params.grade });
        if (!timetable) {
            return res.status(404).json({ message: 'No timetable found' });
        }
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching timetable' });
    }
});

module.exports = router;