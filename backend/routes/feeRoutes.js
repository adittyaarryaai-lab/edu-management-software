const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Installment = require('../models/Installment');

// --- DAY 93: FETCH ALL INSTALLMENTS (Point 5) ---
router.get('/installments/list', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        // Populate student detail properly
        const installments = await Installment.find({ schoolId })
            .populate('student', 'name grade') 
            .sort({ dueDate: 1 });

        const formattedData = installments.map(ins => {
            return {
                _id: ins._id,
                studentName: ins.student ? ins.student.name : "Unknown Student",
                grade: ins.student ? ins.student.grade : "N/A",
                amount: ins.amountDue || ins.amount || 0, 
                dueDate: ins.dueDate,
                status: ins.status,
                type: ins.installmentNumber ? `${ins.installmentNumber}${ins.installmentNumber === 1 ? 'st' : ins.installmentNumber === 2 ? 'nd' : 'rd'} Installment` : "Fee Installment"
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error("FEE_ROUTE_ERROR:", error);
        res.status(500).json({ message: 'Internal Server Error in Fee Routes' });
    }
});

// --- DAY 94: FETCH DEFALUTERS (PENDING + OVERDUE) ---
router.get('/defaulters/list', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date();

        // Query: Status 'Pending' ho AUR dueDate aaj se purani ho
        const overdue = await Installment.find({
            schoolId,
            status: 'Pending',
            dueDate: { $lt: today }
        }).populate('student', 'name grade phone enrollmentNo');

        res.json(overdue);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching defaulters' });
    }
});

module.exports = router;