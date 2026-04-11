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

// POST: Create or Update Timetable with Conflict Detection
router.post('/upload', protect, adminOnly, async (req, res) => {
    const { grade, schedule } = req.body;
    const schoolId = req.user.schoolId;

    if (!grade || !schedule || schedule.length === 0) {
        return res.status(400).json({ message: "Invalid Matrix Data: Grade and Schedule required." });
    }

    try {
        const newDayData = schedule[0];
        const targetDay = newDayData.day;

        // --- NEURAL CONFLICT CHECK START ---
        // Pura school ka timetable uthao (Sirf is grade ko chhod kar jo hum upload kar rahe hain)
        const otherTimetables = await Timetable.find({ 
            schoolId, 
            grade: { $ne: grade.toUpperCase() } 
        });

        // Har ek period ko check karo conflict ke liye
        for (let i = 0; i < newDayData.periods.length; i++) {
            const period = newDayData.periods[i];
            const slotNum = i + 1; // 1-based Slot number for display

            for (const otherDoc of otherTimetables) {
                // Check karo agar doosri class ka us din ka schedule exist karta hai
                const dayMatch = otherDoc.schedule.find(s => s.day === targetDay);
                
                if (dayMatch) {
                    // 1. TEACHER CONFLICT: Kya ye teacher us time kisi aur class mein hai?
                    const teacherConflict = dayMatch.periods.find(p =>
                        p.teacherEmpId === period.teacherEmpId &&
                        p.startTime === period.startTime
                    );

                    if (teacherConflict) {
                        return res.status(400).json({
                            message: `This teacher is already assigned in Slot ${slotNum} to Class ${otherDoc.grade}! ⚠️`
                        });
                    }

                    // 2. ROOM CONFLICT: Kya ye room us time occupied hai?
                    const roomConflict = dayMatch.periods.find(p =>
                        p.room !== "N/A" && 
                        p.room.trim().toUpperCase() === period.room.trim().toUpperCase() &&
                        p.startTime === period.startTime
                    );

                    if (roomConflict) {
                        return res.status(400).json({
                            message: `This room is already assigned in Slot ${slotNum} to Class ${otherDoc.grade}! ⚠️`
                        });
                    }
                }
            }
        }
        // --- NEURAL CONFLICT CHECK END ---

        // Agar koi conflict nahi mila, toh save/update karo
        let timetable = await Timetable.findOne({ grade: grade.toUpperCase(), schoolId });

        if (timetable) {
            const dayIndex = timetable.schedule.findIndex(s => s.day === targetDay);
            if (dayIndex !== -1) {
                // Agar din pehle se hai, toh periods replace karo
                timetable.schedule[dayIndex].periods = newDayData.periods;
            } else {
                // Naya din add karo
                timetable.schedule.push(newDayData);
            }
            await timetable.save();
        } else {
            // Nayi class ka naya document banao
            timetable = await Timetable.create({ 
                schoolId, 
                grade: grade.toUpperCase(), 
                schedule: [newDayData] 
            });
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

// GET: Fetch all unique classes (grades) from Student records
router.get('/meta/student-grades', protect, adminOnly, async (req, res) => {
    try {
        const User = require('../models/User');
        // Students ke records se unique grades nikalo
        const grades = await User.distinct('grade', { 
            schoolId: req.user.schoolId, 
            role: 'student',
            grade: { $ne: null } // Jo null nahi hain
        });
        res.json(grades.sort()); // Sort karke bhej do
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student grades' });
    }
});

// --- GET: FETCH AVAILABLE TEACHERS & ROOMS FOR A SLOT ---
router.post('/meta/available-resources', protect, adminOnly, async (req, res) => {
    try {
        const { day, startTime, excludeGrade } = req.body;
        const schoolId = req.user.schoolId;

        // 1. Pura school ka timetable nikalo us din ka
        const allTimetables = await Timetable.find({ schoolId });

        let occupiedTeachers = [];
        let occupiedRooms = [];

        allTimetables.forEach(t => {
            // Agar hum usi class ko edit kar rahe hain toh usey skip karo
            if (t.grade === excludeGrade?.toUpperCase()) return;

            const dayMatch = t.schedule.find(s => s.day === day);
            if (dayMatch) {
                dayMatch.periods.forEach(p => {
                    if (p.startTime === startTime) {
                        occupiedTeachers.push(p.teacherEmpId);
                        occupiedRooms.push(p.room);
                    }
                });
            }
        });

        // 2. Un Teachers ki list nikalo jo occupied nahi hain
        const availableTeachers = await User.find({
            schoolId,
            role: 'teacher',
            employeeId: { $nin: occupiedTeachers }
        }).select('employeeId name subjects');

        res.json({ availableTeachers, occupiedRooms });
    } catch (error) {
        res.status(500).json({ message: 'Resource sync failed' });
    }
});
module.exports = router;