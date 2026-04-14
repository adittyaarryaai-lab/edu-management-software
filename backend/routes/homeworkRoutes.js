const express = require('express');
const router = express.Router();
const Homework = require('../models/Homework');
const { protect } = require('../middleware/authMiddleware');

// 1. TEACHER: Assign or Update Homework
router.post('/assign', protect, async (req, res) => {
    try {
        const { className, subject, date, content } = req.body;
        const schoolId = req.user.schoolId;
        const teacherId = req.user._id;

        // Check if homework already exists for this subject, class, and date
        let homework = await Homework.findOne({ schoolId, className, subject, date });

        if (homework) {
            // Update existing
            homework.content = content;
            homework.teacherId = teacherId; // In case multiple teachers take same subject
            await homework.save();
            return res.json({ message: "Diary Updated! ⚡", homework });
        } else {
            // Create new
            homework = await Homework.create({
                schoolId, teacherId, className, subject, date, content
            });
            return res.status(201).json({ message: "Homework Assigned! 📚", homework });
        }
    } catch (error) {
        res.status(500).json({ message: "Neural Link Error in Homework" });
    }
});

// 2. STUDENT/TEACHER: Get Homework for specific class and date
router.get('/view', protect, async (req, res) => {
    try {
        const { className, date } = req.query;
        const schoolId = req.user.schoolId;

        const diaries = await Homework.find({ schoolId, className, date })
            .populate('teacherId', 'name'); // Taaki bache ko pta chale kis sir ne diya hai

        res.json(diaries);
    } catch (error) {
        res.status(500).json({ message: "Fetch Error" });
    }
});

// 3. TEACHER: Get the most recent diary for a subject/class to edit
router.get('/latest', protect, async (req, res) => {
    try {
        const { className, subject } = req.query;
        const schoolId = req.user.schoolId;

        // Sabse latest entry dhundo is subject aur class ke liye
        const latest = await Homework.findOne({ schoolId, className, subject })
            .sort({ createdAt: -1 });

        if (!latest) return res.json(null);

        // 6 Din wala Logic: Agar diary 6 din se purani hai, toh reset (null) bhej do
        const diaryDate = new Date(latest.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - diaryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 6) return res.json(null);

        res.json(latest);
    } catch (error) {
        res.status(500).json({ message: "Latest Fetch Error" });
    }
});

module.exports = router;