const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Installment = require('../models/Installment');

// --- DAY 93: FETCH ALL INSTALLMENTS (Point 5) ---
router.get('/installments/list', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Sirf date compare karne ke liye time zero kiya

        // School details fetch karo penalty rate nikalne ke liye
        const School = require('../models/School');
        const school = await School.findById(schoolId);

        // Dono cheezein check karni hain: Rate kitna hai aur Status active hai ya nahi
        const dailyRate = school.penaltySettings?.dailyRate || 0;
        const isPenaltyActive = school.penaltySettings?.isActive || false;

        const installments = await Installment.find({ schoolId })
            .populate('student', 'name grade')
            .sort({ dueDate: 1 });

        const formattedData = installments.map(ins => {
            let totalPenalty = 0;
            let daysLate = 0;
            const dueDate = new Date(ins.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            // FIXED LOGIC: 'isPenaltyActive' true hona zaroori hai penalty lagne ke liye
            if (ins.status === 'Pending' && dueDate < today && isPenaltyActive && dailyRate > 0) {
                const diffTime = Math.abs(today - dueDate);
                daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                totalPenalty = daysLate * dailyRate;
            }

            const baseAmount = ins.amountDue || ins.amount || 0;

            return {
                _id: ins._id,
                studentName: ins.student ? ins.student.name : "Unknown Student",
                grade: ins.student ? ins.student.grade : "N/A",
                amount: baseAmount,
                daysLate: daysLate, // Frontend par dikhane ke liye
                penalty: totalPenalty,
                totalWithPenalty: baseAmount + totalPenalty,
                dueDate: ins.dueDate,
                status: ins.status,
                type: ins.installmentNumber ? `${ins.installmentNumber}${ins.installmentNumber === 1 ? 'st' : ins.installmentNumber === 2 ? 'nd' : 'rd'} Installment` : "Fee Installment"
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error("FEE_ROUTE_ERROR:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- DAY 94: FETCH DEFALUTERS (PENDING + OVERDUE) ---
router.get('/defaulters/list', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date();

        const overdue = await Installment.find({
            schoolId,
            status: 'Pending',
            dueDate: { $lt: today }
        }).populate('student', 'name grade phone enrollmentNo');

        // Defaulters ke liye bhi formatted data bhejenge penalty ke saath
        const formattedOverdue = overdue.map(ins => ({
            ...ins._doc,
            penalty: 100, // Defaulter hai toh penalty pakki hai
            totalAmount: (ins.amountDue || ins.amount || 0) + 100
        }));

        res.json(formattedOverdue);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching defaulters' });
    }
});

// --- DAY 95: GET CURRENT PENALTY SETTINGS ---
router.get('/settings/penalty', protect, async (req, res) => {
    try {
        const School = require('../models/School');
        const school = await School.findById(req.user.schoolId);
        res.json(school.penaltySettings || { dailyRate: 0, isActive: false });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// --- DAY 95: UPDATE PENALTY SETTINGS FROM FRONTEND ---
router.post('/settings/penalty', protect, async (req, res) => {
    try {
        const { dailyRate, isActive } = req.body;
        const School = require('../models/School');

        await School.findByIdAndUpdate(req.user.schoolId, {
            'penaltySettings.dailyRate': dailyRate,
            'penaltySettings.isActive': isActive
        });

        res.json({ message: 'Institutional Penalty Policy Updated! ⚡' });
    } catch (error) {
        res.status(500).json({ message: 'Settings update failed' });
    }
});

module.exports = router;