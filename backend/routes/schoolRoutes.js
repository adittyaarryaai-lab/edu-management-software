const express = require('express');
const router = express.Router();
const School = require('../models/School');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    School Admin pays next month's fee in advance
// @route   POST /api/school/pay-advance
router.post('/pay-advance', protect, adminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId);
        if (!school) return res.status(404).json({ message: "School not found" });

        // Logic: Total paid mein monthly fee add karo
        school.subscription.totalPaid += school.subscription.monthlyFee;
        
        // Mark as advance paid taaki Cron Job paise na kaate
        school.subscription.hasPaidAdvance = true;
        
        // Agli payment date ko 1 mahina aage badha do
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

module.exports = router;