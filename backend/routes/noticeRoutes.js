const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, adminOnly, teacherOnly } = require('../middleware/authMiddleware');

// @desc    Post a new notice
// @route   POST /api/notices
router.post('/', protect, teacherOnly, async (req, res) => {
    try {
        const { title, content, targetGrade, category } = req.body;
        const notice = await Notice.create({
            title, content, targetGrade, category, postedBy: req.user._id
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice' });
    }
});

// @desc    Get all notices
// @route   GET /api/notices
router.get('/', protect, async (req, res) => {
    try {
        const notices = await Notice.find()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
});

module.exports = router;