const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/upload', protect, adminOnly, async (req, res) => {
    const { grade, schedule } = req.body;
    try {
        let timetable = await Timetable.findOne({ grade, schoolId: req.user.schoolId });

        if (timetable) {
            const newDayData = schedule[0]; 
            const dayIndex = timetable.schedule.findIndex(s => s.day === newDayData.day);

            if (dayIndex !== -1) {
                // Purane periods replace karne se pehle ensure karo ki fields sahi hain
                timetable.schedule[dayIndex].periods = newDayData.periods;
            } else {
                timetable.schedule.push(newDayData);
            }
            
            // Validate before saving to catch specific Mongoose errors
            await timetable.save();
        } else {
            timetable = await Timetable.create({ 
                schoolId: req.user.schoolId,
                grade, 
                schedule 
            });
        }
        res.status(201).json({ message: 'Timetable updated successfully', timetable });
    } catch (error) {
        // TERMINAL MEI DEKHO: Yahan asli error print hoga (jaise CastError: Cast to ObjectId failed)
        console.error("CRITICAL BACKEND ERROR:", error); 
        res.status(500).json({ message: error.message });
    }
});

router.get('/:grade', protect, async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ 
            grade: req.params.grade,
            schoolId: req.user.schoolId // FIXED
        });
        if (!timetable) {
            return res.status(404).json({ message: 'No timetable found' });
        }
        res.json(timetable);
    } catch (error) {
        console.error("Timetable Save Error:", error); // Terminal mein asli error dikhega
        res.status(500).json({ message: 'Server Error fetching timetable' });
    }
});

module.exports = router;