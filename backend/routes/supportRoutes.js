const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// @desc    Post a new query (Student Only)
router.post('/ask', protect, async (req, res) => {
    try {
        const { subject, query, isUrgent } = req.body;
        const newQuery = await Support.create({
            student: req.user._id,
            subject,
            query,
            isUrgent
        });
        res.status(201).json(newQuery);
    } catch (error) {
        res.status(500).json({ message: 'Query submit nahi ho payi' });
    }
});

// @desc    Get all queries for a student
router.get('/my-queries', protect, async (req, res) => {
    try {
        const queries = await Support.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries' });
    }
});

module.exports = router;