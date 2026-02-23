const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET: Fetch all teachers for dropdown (EMP ID + Subjects)
router.get('/teachers-list', protect, adminOnly, async (req, res) => {
    try {
        const teachers = await User.find({
            schoolId: req.user.schoolId,
            role: 'teacher'
        }).select('employeeId subjects name');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculty data' });
    }
});

// POST: Create or Update Timetable
router.post('/upload', protect, adminOnly, async (req, res) => {
    const { grade, schedule } = req.body;

    if (!grade || !schedule || schedule.length === 0) {
        return res.status(400).json({ message: "Invalid Matrix Data: Grade and Schedule required." });
    }

    try {
        // Strict Isolation: Apne hi school ka timetable dhoondo
        let timetable = await Timetable.findOne({
            grade: grade.toUpperCase(),
            schoolId: req.user.schoolId
        });

        const newDayData = schedule[0];

        if (timetable) {
            // Find if this day already exists in the schedule array
            const dayIndex = timetable.schedule.findIndex(s => s.day === newDayData.day);

            if (dayIndex !== -1) {
                // Update existing day's periods
                timetable.schedule[dayIndex].periods = newDayData.periods;
            } else {
                // Add new day to the schedule
                timetable.schedule.push(newDayData);
            }
            await timetable.save();
        } else {
            // Create new entry for this grade
            timetable = await Timetable.create({
                schoolId: req.user.schoolId,
                grade: grade.toUpperCase(),
                schedule: [newDayData]
            });
        }

        res.status(201).json({ message: 'Matrix Synchronized!', timetable });
    } catch (error) {
        console.error("TIMETABLE SYNC ERROR:", error);
        res.status(500).json({ message: "Backend Sync Failed: " + error.message });
    }
});

// GET: Fetch all available grades for this school
router.get('/grades/list', protect, adminOnly, async (req, res) => {
    try {
        const grades = await Timetable.find({ schoolId: req.user.schoolId }).distinct('grade');
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grades' });
    }
});

// GET: Fetch timetable for a specific grade
router.get('/:grade', protect, async (req, res) => {
    try {
        const timetable = await Timetable.findOne({
            grade: req.params.grade.toUpperCase(),
            schoolId: req.user.schoolId
        });
        res.json(timetable || { schedule: [] });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;