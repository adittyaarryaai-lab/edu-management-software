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
// @desc    Get logged in student's fee details
// @route   GET /api/fees/my-fees
router.get('/my-fees', protect, async (req, res) => {
    try {
        // req.user._id hume protect middleware se milta hai
        const fee = await Fee.findOne({ student: req.user._id });
        if (!fee) {
            return res.status(404).json({ message: 'No fee record found' });
        }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @desc    Record a payment (Admin Only)
// @route   POST /api/fees/pay
router.post('/pay', protect, adminOnly, async (req, res) => {
    const { feeId, amount, method } = req.body;

    try {
        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: 'Fee record not found' });

        // Update Paid Amount
        fee.paidAmount += Number(amount);
        
        // Update Status Logic
        if (fee.paidAmount >= fee.totalAmount) {
            fee.status = 'Paid';
        } else if (fee.paidAmount > 0) {
            fee.status = 'Partially Paid';
        }

        // Add to Payment History
        fee.paymentHistory.push({
            amount: Number(amount),
            method: method || 'Cash',
            date: Date.now()
        });

        await fee.save();
        res.json({ message: 'Payment recorded successfully', fee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error recording payment' });
    }
});

module.exports = router;