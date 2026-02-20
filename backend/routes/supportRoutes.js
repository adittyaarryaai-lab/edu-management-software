const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

router.post('/ask', protect, async (req, res) => {
    try {
        const { subject, query, isUrgent } = req.body;
        const newQuery = await Support.create({
            schoolId: req.user.schoolId, // FIXED
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

router.get('/my-queries', protect, async (req, res) => {
    try {
        const queries = await Support.find({ 
            student: req.user._id,
            schoolId: req.user.schoolId // FIXED
        }).sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries' });
    }
});

router.get('/all-queries', protect, teacherOnly, async (req, res) => {
    try {
        const queries = await Support.find({ schoolId: req.user.schoolId }) // FIXED
            .populate('student', 'name grade')
            .sort({ isUrgent: -1, createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries' });
    }
});

router.put('/resolve/:id', protect, teacherOnly, async (req, res) => {
    try {
        const { answer } = req.body;
        const query = await Support.findOneAndUpdate(
            { _id: req.params.id, schoolId: req.user.schoolId }, // FIXED Security
            { 
                answer, 
                status: 'Resolved',
                teacher: req.user._id 
            },
            { new: true }
        );
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving query' });
    }
});

module.exports = router;