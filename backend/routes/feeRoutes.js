const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Installment = require('../models/Installment');
const Fee = require('../models/Fee');

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
// --- DAY 96 FIX: FETCH DEFALUTERS WITH DYNAMIC PENALTY ---
router.get('/defaulters/list', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // School ki penalty settings uthao
        const School = require('../models/School');
        const school = await School.findById(schoolId);
        const dailyRate = school.penaltySettings?.dailyRate || 0;
        const isPenaltyActive = school.penaltySettings?.isActive || false;

        const overdue = await Installment.find({
            schoolId,
            status: 'Pending',
            dueDate: { $lt: today }
        })
        .populate('student', 'name grade phone enrollmentNo')
        .populate('schoolId', 'schoolName');

        const formattedOverdue = overdue.map(ins => {
            let totalPenalty = 0;
            let daysLate = 0;
            const dueDate = new Date(ins.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            // LOGIC: Agar toggle ON hai toh penalty calculate karo
            if (isPenaltyActive && dailyRate > 0) {
                const diffTime = Math.abs(today - dueDate);
                daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                totalPenalty = daysLate * dailyRate;
            }

            const baseAmount = ins.amountDue || ins.amount || 0;

            return {
                ...ins._doc, // Purana sara data
                penalty: totalPenalty,
                daysLate: daysLate,
                totalAmount: baseAmount + totalPenalty
            };
        });

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

// --- DAY 96: TRIGGER MANUAL ALERT (Point 8) ---
router.get('/reports/summary', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        // 1. Fetch History (Asli payments ki list)
        // 'populate' student detail mangwayega
        const feeHistory = await Fee.find({ schoolId })
            .sort({ date: -1 })
            .populate('student', 'name grade');

        // 2. Total Math (Sum of all payments)
        const totalCollected = feeHistory.reduce((sum, f) => sum + f.amountPaid, 0);

        // 3. Class-wise Math (Aggregation)
        const classWise = await Fee.aggregate([
            { $match: { schoolId: req.user.schoolId } },
            { 
                $lookup: { 
                    from: 'users', // Compass mein 'users' collection hai
                    localField: 'student', 
                    foreignField: '_id', 
                    as: 'studentInfo' 
                } 
            },
            { $unwind: { path: '$studentInfo', preserveNullAndEmptyArrays: true } },
            { 
                $group: { 
                    _id: '$studentInfo.grade', 
                    total: { $sum: '$amountPaid' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalCollected,
            transactionCount: feeHistory.length,
            classWise: classWise.filter(item => item._id !== null), // Sirf jin bacho ki class hai wo dikhao
            history: feeHistory // Naye formatted list data frontend ke liye
        });
    } catch (error) {
        console.error("REPORT_API_ERROR:", error);
        res.status(500).json({ message: 'Failed to generate simple report' });
    }
});

module.exports = router;