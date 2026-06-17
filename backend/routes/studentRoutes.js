const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-subjects', protect, async (req, res) => {
    try {
        const studentGrade = req.user.grade;

        const timetable = await Timetable.findOne({
            grade: studentGrade.toUpperCase(),
            schoolId: req.user.schoolId
        }).lean();

        if (!timetable) {
            return res.json([]);
        }

        // Sare teachers uthao
        const teachers = await User.find({
            schoolId: req.user.schoolId,
            role: "teacher"
        }).select("name employeeId phone");

        const subjectMap = {};

        timetable.schedule.forEach(day => {
            day.periods.forEach(period => {
                const teacher = teachers.find(
                    t => t.employeeId === period.teacherEmpId
                );

                if (!subjectMap[period.subject]) {
                    subjectMap[period.subject] = new Set();
                }

                if (teacher) {
                    subjectMap[period.subject].add(
                        `${teacher.name}|${teacher.phone || ""}`
                    );
                }
            });
        });

        const result = Object.keys(subjectMap).map(subject => ({
            subject,
            teachers: [...subjectMap[subject]].join(", ")
        }));

        res.json(result);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error fetching subjects" });
    }
});

module.exports = router;