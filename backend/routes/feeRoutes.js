const express = require('express');
const router = express.Router();
const { protect, financeOnly } = require('../middleware/authMiddleware');
const Installment = require('../models/Installment');
const Fee = require('../models/Fee');
const FeeStructure = require('../models/FeeStructure');

// --- DAY 93: FETCH ALL INSTALLMENTS (Point 5) ---
router.get('/installments/list', protect, financeOnly, async (req, res) => {
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
router.get('/defaulters/list', protect, financeOnly, async (req, res) => {
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
router.get('/reports/summary', protect, financeOnly, async (req, res) => {
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

// --- DAY 102: STUDENT SIDE SUMMARY WITH DYNAMIC PENALTY (Point 4) ---
// --- DAY 102 & 103: STUDENT SIDE SUMMARY + HISTORY (Point 4 & 5) ---
// --- DAY 109: ENHANCED SUMMARY WITH ACTUAL STUDENT & SCHOOL DETAILS ---
router.get('/student-summary', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        const schoolId = req.user.schoolId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Fetch Actual Student Details from Database
        const User = require('../models/User');
        const student = await User.findById(studentId).populate('schoolId');

        if (!student) return res.status(404).json({ message: 'Student identity not found' });

        // 2. Fetch School & Penalty Settings
        const School = require('../models/School');
        const school = await School.findById(schoolId);
        const dailyRate = school?.penaltySettings?.dailyRate || 0;
        const isPenaltyActive = school?.penaltySettings?.isActive || false;

        // 3. Fetch Installments & Payments
        const installments = await Installment.find({ student: studentId, schoolId });
        const payments = await Fee.find({ student: studentId, schoolId });

        // 4. Penalty & Installment Processing
        let totalPenaltyAccrued = 0;
        const processedInstallments = installments.map(ins => {
            let penalty = 0;
            const dueDate = new Date(ins.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            if (ins.status === 'Pending' && dueDate < today && isPenaltyActive) {
                const diffTime = Math.abs(today - dueDate);
                const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                penalty = daysLate * dailyRate;
                totalPenaltyAccrued += penalty;
            }

            return {
                id: ins._id,
                number: ins.installmentNumber || 0,
                amount: Number(ins.amountDue) || 0,
                penalty: penalty,
                totalWithPenalty: (Number(ins.amountDue) || 0) + penalty,
                dueDate: ins.dueDate,
                status: (ins.status === 'Pending' && dueDate < today) ? 'Overdue' : ins.status,
                type: ins.type || 'Tuition Fee'
            };
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        // 5. Financial Math
        const totalFees = installments.reduce((sum, ins) => sum + (Number(ins.amountDue) || 0), 0);
        const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

        // 6. Final JSON Response with REAL DATA & PAYMENT SETTINGS
        res.json({
            // Student Profile
            studentName: student.name,
            enrollmentNo: student.enrollmentNo || 'N/A',
            grade: student.grade || 'N/A',
            fatherName: student.fatherName || 'N/A',
            address: student.address || 'N/A',
            schoolName: student.schoolId?.schoolName || "EduFlowAI Institution",

            // PAYMENT SETTINGS (Ye naya part hai Day 110 ke liye)
            paymentSettings: {
                upiId: school?.paymentSettings?.upiId || "",
                merchantName: school?.paymentSettings?.merchantName || student.schoolId?.schoolName
            },

            // Financial Summary
            totalFees,
            totalPaid,
            remainingFees: (totalFees + totalPenaltyAccrued) - totalPaid,
            totalPenalty: totalPenaltyAccrued,
            installmentList: processedInstallments,
            paymentHistory: payments.map(p => ({
                id: p._id,
                amount: p.amountPaid,
                date: p.date,
                mode: p.paymentMode || 'N/A',
                month: p.month,
                year: p.year
            })).sort((a, b) => new Date(b.date) - new Date(a.date)),

            nextDueDate: processedInstallments.filter(ins => ins.status !== 'Paid')[0]?.dueDate || 'No Pending',
            lastPaymentDate: payments.length > 0 ? payments[0].date : 'N/A',
            status: totalFees === 0 ? 'Not Set' : (totalFees - totalPaid) <= 0 ? 'Fully Paid' : 'Pending'
        });
    } catch (error) {
        console.error("Day 109 Sync Error:", error);
        res.status(500).json({ message: 'Neural Sync Failed: Internal Server Error' });
    }
});

// --- DAY 104: GET RECEIPT DATA (Point 6) ---
// Is route ka kaam hai payment ki details + student info + school details nikalna
router.get('/receipt/:paymentId', protect, async (req, res) => {
    try {
        const payment = await Fee.findById(req.params.paymentId)
            .populate({
                path: 'student',
                select: 'name enrollmentNo grade fatherName phone address'
            })
            .populate({
                path: 'schoolId',
                select: 'schoolName schoolAddress schoolContact logo' // Check your School model fields
            });

        if (!payment) {
            return res.status(404).json({ message: 'Receipt Identity Not Found! ❌' });
        }

        // Security Check: Student sirf apni hi receipt dekh sake
        if (req.user.role === 'student' && payment.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Neural Access Denied: Unauthorized Identity! 🛡️' });
        }

        res.json(payment);
    } catch (error) {
        console.error("Receipt Fetch Error:", error);
        res.status(500).json({ message: 'Error generating receipt data' });
    }
});

// --- DAY 111: FINALIZE ONLINE PAYMENT (Point 9) ---
router.post('/finalize-online-payment', protect, async (req, res) => {
    try {
        const { amount, method, month, year } = req.body;
        const studentId = req.user._id;
        const schoolId = req.user.schoolId;

        // 1. Create Real Fee Record
        const newFee = await Fee.create({
            schoolId,
            student: studentId,
            amountPaid: amount,
            month: month || new Date().toLocaleString('default', { month: 'long' }),
            year: year || new Date().getFullYear(),
            paymentMode: method || 'UPI',
            date: new Date()
        });

        // 2. Update Installment Status (Sabse purani pending installment ko 'Paid' karo)
        // Logic: Jitne paise aaye hain uske hisab se installments update karo
        const pendingInstallment = await Installment.findOne({
            student: studentId,
            schoolId,
            status: { $in: ['Pending', 'Overdue'] }
        }).sort({ dueDate: 1 });

        if (pendingInstallment) {
            pendingInstallment.status = 'Paid';
            pendingInstallment.paymentId = newFee._id;
            await pendingInstallment.save();
        }

        res.status(201).json({
            message: 'Neural Payment Captured Successfully! ⚡',
            feeId: newFee._id
        });
    } catch (error) {
        console.error("Payment Finalize Error:", error);
        res.status(500).json({ message: 'Payment Synchronization Failed' });
    }
});

// --- DAY 111: AUTO-DETECTION STATUS CHECK (Point 9) ---
// Ye route check karega ki pichle 1 minute mein is bache ki koi payment aayi hai?
router.get('/check-payment-status', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        // Sirf pichle 60 seconds ki history check karenge taaki purani payments redirect na karein
        const oneMinuteAgo = new Date(Date.now() - 60000);

        const recentPayment = await Fee.findOne({
            student: studentId,
            date: { $gte: oneMinuteAgo }
        }).sort({ date: -1 });

        if (recentPayment) {
            return res.json({
                success: true,
                message: "Neural Signal Captured: Payment Detected! ⚡"
            });
        }

        res.json({ success: false });
    } catch (error) {
        console.error("Polling Error:", error);
        res.status(500).json({ success: false });
    }
});

// Ensure this route in feesRoutes.js looks like this:
// --- DAY 111: FIXING 500 INTERNAL SERVER ERROR ---
// --- DAY 111: FIXING 500 INTERNAL SERVER ERROR (CRITICAL FIX) ---
router.post('/capture-online-payment', protect, async (req, res) => {
    try {
        const { amount, method } = req.body;
        const studentId = req.user._id;
        const schoolId = req.user.schoolId;

        // Validation: Agar amount 0 ya null hai toh process mat karo
        const finalAmount = Number(amount) || 0;
        if (finalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid Amount" });
        }

        console.log(`[PAYMENT] Attempting capture for Student: ${studentId}, Amount: ${finalAmount}`);

        // 1. Create Fee Record
        // Make sure Fee model is imported at the top of this file
        const newFee = await Fee.create({
            schoolId: schoolId,
            student: studentId,
            amountPaid: finalAmount,
            month: new Date().toLocaleString('default', { month: 'long' }),
            year: new Date().getFullYear(),
            paymentMode: 'Online', // 'method' ki jagah direct 'Online' likh do validation bypass karne ke liye
            date: new Date()
        });

        // 2. Update Installments Status
        // Sabhi pending/overdue installments ko 'Paid' mark karo
        const updateResult = await Installment.updateMany(
            {
                student: studentId,
                schoolId: schoolId,
                status: { $ne: 'Paid' }
            },
            {
                $set: {
                    status: 'Paid',
                    paymentId: newFee._id
                }
            }
        );

        console.log(`[PAYMENT] Success! Fee ID: ${newFee._id}, Updated Docs: ${updateResult.modifiedCount}`);

        res.status(201).json({
            success: true,
            message: 'Neural Capture Successful! 🛡️'
        });

    } catch (error) {
        // Console mein error dekho: Yahan se pata chalega exact galti kya hai
        console.error("CRITICAL_BACKEND_ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});
// --- DAY 111: REAL-TIME PAYMENT CHECKER ---
router.get('/verify-online-status', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        // Sirf pichle 2 minute ki transactions check karenge
        const twoMinutesAgo = new Date(Date.now() - 120000);

        const latestPayment = await Fee.findOne({
            student: studentId,
            date: { $gte: twoMinutesAgo }
        }).sort({ date: -1 });

        if (latestPayment) {
            return res.json({
                success: true,
                message: "Neural Signal: Payment Received! ⚡"
            });
        }
        res.json({ success: false });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

/**
 * @DESC   Save or Update Master Fee Structure for a specific class
 * @ROUTE  POST /api/fees/structure/update
 * @ACCESS Private (Finance Only)
 */
router.post('/structure/update', protect, financeOnly, async (req, res) => {
    try {
        const { className, fees } = req.body;
        const schoolId = req.user.schoolId;

        if (!className) {
            return res.status(400).json({ message: 'Class Selection Required!' });
        }

        // findOneAndUpdate ka use karke hum Check + Create/Update ek saath kar rahe hain
        const structure = await FeeStructure.findOneAndUpdate(
            { schoolId, className },
            { 
                fees, 
                updatedBy: req.user._id 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ 
            message: `Neural Link Established: ${className} Configuration Locked! ⚡`, 
            structure 
        });
    } catch (error) {
        console.error("STRUCTURE_UPDATE_ERROR:", error);
        res.status(500).json({ message: 'Internal Server Error: Could not sync structure' });
    }
});

/**
 * @DESC   Fetch Fee Structure for a specific class to populate the form
 * @ROUTE  GET /api/fees/structure/:className
 * @ACCESS Private (Finance Only)
 */
router.get('/structure/:className', protect, financeOnly, async (req, res) => {
    try {
        const { className } = req.params;
        const schoolId = req.user.schoolId;

        const structure = await FeeStructure.findOne({ schoolId, className });
        
        if (!structure) {
            // Agar data nahi hai, toh frontend ko signal bhejo taaki wo khali form dikhaye
            return res.json({ notFound: true, message: "No blueprint found for this sector." });
        }

        res.json(structure);
    } catch (error) {
        console.error("STRUCTURE_FETCH_ERROR:", error);
        res.status(500).json({ message: 'Error fetching class blueprint' });
    }
});

module.exports = router;