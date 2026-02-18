const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// @desc    Schedule a Live Class (Teacher Only)
router.post('/schedule', protect, teacherOnly, async (req, res) => {
    try {
        const { subject, grade, topic, startTime, meetingLink, status } = req.body;
        const newClass = await LiveClass.create({
            teacher: req.user._id,
            subject,
            grade,
            topic,
            startTime,
            meetingLink,
            status: status || 'Upcoming'
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Meeting schedule fail ho gayi' });
    }
});

// @desc    Get classes for Student (Direct from User Data)
router.get('/my-classes/:grade', protect, async (req, res) => {
    try {
        let filterGrade = req.params.grade;

        if (req.user && req.user.role === 'student') {
            filterGrade = req.user.grade;
        }

        const classes = await LiveClass.find({ grade: filterGrade }).sort({ startTime: 1 });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});
// @desc    Get all classes created by a specific Teacher
router.get('/teacher/my-classes', protect, teacherOnly, async (req, res) => {
    try {
        // Sirf wahi classes layega jo us logged-in teacher ne banayi hain
        const classes = await LiveClass.find({ teacher: req.user._id }).sort({ startTime: 1 });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teacher classes' });
    }
});

module.exports = router;