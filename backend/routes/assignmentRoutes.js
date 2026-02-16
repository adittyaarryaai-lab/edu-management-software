const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// @desc    Create new assignment
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

// @desc    Submit an assignment
router.post('/submit', protect, async (req, res) => {
    const { assignmentId, content, fileUrl } = req.body;
    try {
        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            content,
            fileUrl,
            status: 'Submitted'
        });
        res.status(201).json({ message: 'Assignment submitted!', submission });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment' });
    }
});

// @desc    Get all submissions for an assignment
router.get('/submissions/:assignmentId', protect, teacherOnly, async (req, res) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.assignmentId })
            .populate('student', 'name email grade')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching submissions' });
    }
});

// @desc    Grade a submission
router.put('/grade/:submissionId', protect, teacherOnly, async (req, res) => {
    const { grade, feedback } = req.body;
    try {
        const submission = await Submission.findByIdAndUpdate(
            req.params.submissionId,
            { grade, feedback, status: 'Graded' },
            { new: true }
        );
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json({ message: 'Grading completed!', submission });
    } catch (error) {
        res.status(500).json({ message: 'Server Error grading assignment' });
    }
});
// @desc    Get student's graded performance
// @route   GET /api/assignments/my-results
router.get('/my-results', protect, async (req, res) => {
    try {
        // Aapke database mein "Graded" hai, isliye hum direct wahi dhoondenge
        const results = await Submission.find({
            student: req.user._id,
            status: "Graded"
        })
            .populate('assignment', 'title subject grade')
            .sort({ updatedAt: -1 });

        console.log("Found results count:", results.length); // Terminal check karo
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching results' });
    }
});

module.exports = router;