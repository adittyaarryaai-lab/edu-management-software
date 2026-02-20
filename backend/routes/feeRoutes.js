const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/assign', protect, adminOnly, async (req, res) => {
    const { studentId, totalAmount, dueDate } = req.body;
    try {
        const fee = await Fee.create({
            schoolId: req.user.schoolId, // FIXED
            student: studentId,
            totalAmount,
            dueDate
        });
        res.status(201).json({ message: 'Fees assigned successfully', fee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const fees = await Fee.find({ schoolId: req.user.schoolId }) // FIXED
            .populate('student', 'name email grade');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/my-fees', protect, async (req, res) => {
    try {
        const fee = await Fee.findOne({ 
            student: req.user._id,
            schoolId: req.user.schoolId // FIXED
        });
        if (!fee) {
            return res.status(404).json({ message: 'No fee record found' });
        }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/pay', protect, adminOnly, async (req, res) => {
    const { feeId, amount, method } = req.body;
    try {
        const fee = await Fee.findOne({ _id: feeId, schoolId: req.user.schoolId }); // FIXED Security
        if (!fee) return res.status(404).json({ message: 'Fee record not found' });

        fee.paidAmount += Number(amount);
        
        if (fee.paidAmount >= fee.totalAmount) {
            fee.status = 'Paid';
        } else if (fee.paidAmount > 0) {
            fee.status = 'Partially Paid';
        }

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