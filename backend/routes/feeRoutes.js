const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Assign fees to a student
// @route   POST /api/fees/assign
router.post('/assign', protect, adminOnly, async (req, res) => {
    const { studentId, totalAmount, dueDate } = req.body;
    try {
        const fee = await Fee.create({
            student: studentId,
            totalAmount,
            dueDate
        });
        res.status(201).json({ message: 'Fees assigned successfully', fee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all fee records (For Admin)
// @route   GET /api/fees/all
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'name email grade');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;