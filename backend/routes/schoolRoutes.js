const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Transaction = require('../models/Transaction'); // FIXED: Transaction model import kiya
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    School Admin pays next month's fee in advance
// @route   POST /api/school/pay-advance
router.post('/pay-advance', protect, adminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId);
        if (!school) return res.status(404).json({ message: "School not found" });

        const today = new Date();

        // 1. Transaction Record Create Karo (History ke liye)
        await Transaction.create({
            schoolId: school._id,
            amount: school.subscription.monthlyFee,
            month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
            transactionId: `TXN-ADV-${Date.now()}`,
            status: 'Success'
        });

        // 2. School Subscription Update
        school.subscription.totalPaid += school.subscription.monthlyFee;
        school.subscription.hasPaidAdvance = true;
        
        const currentNextDate = new Date(school.subscription.nextPaymentDate || Date.now());
        currentNextDate.setMonth(currentNextDate.getMonth() + 1);
        school.subscription.nextPaymentDate = currentNextDate;

        await school.save();
        
        res.json({ 
            message: "Advance Payment Successful! Next month's status: SECURED ✅",
            subscription: school.subscription 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Payment processing failed" });
    }
});

// @desc    Get current school's subscription status (for Admin Dashboard)
router.get('/subscription-status', protect, adminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId).select('subscription schoolName');
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: "Error fetching status" });
    }
});

// FIXED: Day 74 - Fetch all transactions for the logged-in school
// @route   GET /api/school/transactions
router.get('/transactions', protect, adminOnly, async (req, res) => {
    try {
        // Sirf apne school ki history dikhao
        const transactions = await Transaction.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history" });
    }
});

module.exports = router;