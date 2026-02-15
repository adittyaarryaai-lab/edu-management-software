const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// @desc    Create new assignment
// @route   POST /api/assignments/create
router.post('/create', protect, teacherOnly, async (req, res) => {
    const { grade, subject, title, description, dueDate, fileUrl } = req.body;
    try {
        const assignment = await Assignment.create({
            teacher: req.user._id,
            grade,
            subject,
            title,
            description,
            dueDate,
            fileUrl
        });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating assignment' });
    }
});

// @desc    Get assignments for a grade
// @route   GET /api/assignments/:grade
router.get('/:grade', protect, async (req, res) => {
    try {
        const assignments = await Assignment.find({ grade: req.params.grade })
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching assignments' });
    }
});
router.post('/submit', protect, async (req, res) => {
    const { assignmentId, content, fileUrl } = req.body;
    try {
        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            content,
            fileUrl
        });
        res.status(201).json({ message: 'Assignment submitted!', submission });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment' });
    }
});

module.exports = router;