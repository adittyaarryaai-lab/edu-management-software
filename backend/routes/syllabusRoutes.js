const express = require('express');
const router = express.Router();
const Syllabus = require('../models/Syllabus');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

router.post('/upload', protect, teacherOnly, async (req, res) => {
    try {
        const { grade, subject, title, description, fileUrl } = req.body;
        const syllabus = await Syllabus.create({
            schoolId: req.user.schoolId, // FIXED
            grade, subject, title, description, fileUrl, uploadedBy: req.user._id
        });
        res.status(201).json(syllabus);
    } catch (error) {
        res.status(500).json({ message: 'Syllabus upload failed' });
    }
});

router.get('/:grade', protect, async (req, res) => {
    try {
        const requestedGrade = req.params.grade;
        if (req.user.role === 'student' && req.user.grade !== requestedGrade) {
            return res.status(403).json({ message: 'Access Denied: Grade Mismatch' });
        }

        const data = await Syllabus.find({ 
            grade: requestedGrade,
            schoolId: req.user.schoolId // FIXED
        }).sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching syllabus' });
    }
});

module.exports = router;