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
    const schoolId = req.user.schoolId;

    if (!grade || !schedule || schedule.length === 0) {
        return res.status(400).json({ message: "Invalid Matrix Data: Grade and Schedule required." });
    }

    try {
        const newDayData = schedule[0];

        // --- NEURAL CONFLICT CHECK START ---
        // Pura school ka timetable uthao (Is grade ko chhod kar)
        const otherTimetables = await Timetable.find({ schoolId, grade: { $ne: grade.toUpperCase() } });

        for (const period of newDayData.periods) {
            for (const other of otherTimetables) {
                const dayMatch = other.schedule.find(s => s.day === newDayData.day);
                if (dayMatch) {
                    const conflict = dayMatch.periods.find(p =>
                        p.teacherEmpId === period.teacherEmpId &&
                        p.startTime === period.startTime
                    );
                    if (conflict) {
                        return res.status(400).json({
                            message: `IDENTITY CONFLICT: EMP ID ${period.teacherEmpId} is already assigned to Class ${other.grade} during this cycle (${period.startTime})! ⚠️`
                        });
                    }
                }
            }
        }
        // --- NEURAL CONFLICT CHECK END ---

        let timetable = await Timetable.findOne({ grade: grade.toUpperCase(), schoolId });

        if (timetable) {
            const dayIndex = timetable.schedule.findIndex(s => s.day === newDayData.day);
            if (dayIndex !== -1) {
                timetable.schedule[dayIndex].periods = newDayData.periods;
            } else {
                timetable.schedule.push(newDayData);
            }
            await timetable.save();
        } else {
            timetable = await Timetable.create({ schoolId, grade: grade.toUpperCase(), schedule: [newDayData] });
        }

        res.status(201).json({ message: 'Matrix Synchronized!', timetable });
    } catch (error) {
        res.status(500).json({ message: "Sync Failed: " + error.message });
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
        }).lean(); // lean() use kiya taki hum object modify kar saken

        if (timetable) {
            // Saare teachers ki list nikalo unke employeeId ke saath
            const teachers = await User.find({ schoolId: req.user.schoolId, role: 'teacher' }).select('name employeeId');

            // Schedule ke andar teacherEmpId ko replace karo ya Name add karo
            timetable.schedule.forEach(day => {
                day.periods.forEach(period => {
                    const prof = teachers.find(t => t.employeeId === period.teacherEmpId);
                    period.teacherName = prof ? prof.name : "Neural Professor";
                });
            });
        }

        res.json(timetable || { schedule: [] });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET: Fetch personal schedule for a Teacher (Based on EMP ID)
router.get('/teacher/personal-schedule', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const empId = req.user.employeeId;

        // Pura school ka timetable uthao
        const allGradesTimetable = await Timetable.find({ schoolId });

        let personalSchedule = [
            { day: 'Monday', periods: [] },
            { day: 'Tuesday', periods: [] },
            { day: 'Wednesday', periods: [] },
            { day: 'Thursday', periods: [] },
            { day: 'Friday', periods: [] },
            { day: 'Saturday', periods: [] }
        ];

        // Har class aur har din ke periods check karo jahan ye EMP ID ho
        allGradesTimetable.forEach(t => {
            t.schedule.forEach(dayNode => {
                const myPeriods = dayNode.periods.filter(p => p.teacherEmpId === empId);
                if (myPeriods.length > 0) {
                    const targetDay = personalSchedule.find(d => d.day === dayNode.day);
                    myPeriods.forEach(mp => {
                        targetDay.periods.push({
                            ...mp.toObject(),
                            grade: t.grade // Taki teacher ko pata chale kis class mein jana hai
                        });
                    });
                }
            });
        });

        res.json({ schedule: personalSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Neural Link Failure: ' + error.message });
    }
});

module.exports = router;