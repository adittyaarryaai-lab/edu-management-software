const express = require('express');
const router = express.Router();
const { protect, financeOnly } = require('../middleware/authMiddleware');
const Fee = require('../models/Fee');
const FeeStructure = require('../models/FeeStructure');

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

// --- DAY 123: UPDATE PENALTY SETTINGS (WITH ACTIVATION TIMESTAMP) ---
router.post('/settings/penalty', protect, async (req, res) => {
    try {
        const { dailyRate, isActive } = req.body;
        const School = require('../models/School');

        await School.findByIdAndUpdate(req.user.schoolId, {
            'penaltySettings.dailyRate': dailyRate,
            'penaltySettings.isActive': isActive,
            'penaltySettings.activatedAt': isActive ? new Date() : null // ON hone par time save
        });

        res.json({ message: isActive ? 'Penalty Activated! ⚡' : 'Penalty Paused! 🛡️' });
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

// --- DAY 123: ULTIMATE STUDENT SUMMARY (CARRY-FORWARD PENALTY) ---
router.get('/student-summary', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        const schoolId = req.user.schoolId;
        const today = new Date();
        const currentMonthName = today.toLocaleString('default', { month: 'long' });
        const currentYear = today.getFullYear();

        const User = require('../models/User');
        const student = await User.findById(studentId).populate('schoolId');
        if (!student) return res.status(404).json({ message: 'Identity missing' });

        const rawGrade = student.grade || "";
        const numericPart = rawGrade.match(/\d+/);
        const classMatch = numericPart ? `Class ${numericPart[0]}` : rawGrade;
        const structure = await FeeStructure.findOne({ schoolId, className: classMatch });
        const allPayments = await Fee.find({ student: studentId, schoolId }).sort({ date: -1 });

        let monthlyStructureTotal = 0;
        let oneTimeLabels = [];
        let structureDetails = {};

        if (structure && structure.fees) {
            Object.keys(structure.fees).forEach(key => {
                const item = structure.fees[key];
                if (item && !item.isNone && item.amount > 0) {
                    const amount = Number(item.amount) || 0;
                    const label = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
                    if (item.billingCycle === 'monthly') {
                        monthlyStructureTotal += amount;
                        structureDetails[key] = { label, amount, billingCycle: 'monthly' };
                    } else {
                        oneTimeLabels.push(label);
                        structureDetails[key] = { label, amount, billingCycle: 'one-time' };
                    }
                }
            });
        }

        const paidThisMonth = allPayments.filter(p => {
            const isCurrent = p.month === currentMonthName && p.year === currentYear;
            const isOneTime = oneTimeLabels.some(label => p.remarks?.toUpperCase().includes(label));
            return isCurrent && !isOneTime;
        }).reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

        const joinDate = new Date(student.createdAt);
        const monthsElapsed = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth()) + 1;
        const totalMonthlyExpected = monthlyStructureTotal * monthsElapsed;

        const totalMonthlyPaidSoFar = allPayments.filter(p => {
            const isOneTime = oneTimeLabels.some(label => p.remarks?.toUpperCase().includes(label));
            return !isOneTime;
        }).reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

        const balance = totalMonthlyExpected - totalMonthlyPaidSoFar;

        // --- DAY 123: INSTANT HIT PENALTY LOGIC ---
        const School = require('../models/School');
        const schoolData = await School.findById(schoolId);
        const pSettings = schoolData.penaltySettings;
        let accruedPenalty = 0;

        if (pSettings?.isActive && balance > 0 && pSettings.activatedAt) {
            const activationDate = new Date(pSettings.activatedAt);
            const today = new Date();

            // Difference in days (Minimum 1 day logic)
            const diffTime = Math.abs(today.getTime() - activationDate.getTime());
            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // RULE: Button daba toh Day 1 ki penalty (₹100) toh lagegi hi lagegi
            diffDays += 1;

            // 11:00 AM Rule: Agar aaj subah ke 11 baj chuke hain 
            // aur activation 11 se pehle ki hai (yaani ek din pura ho gaya technicaly)
            if (today.getHours() >= 11 && today.getDate() !== activationDate.getDate()) {
                // diffDays automatic 2nd day utha lega milliseconds ki wajah se
            }

            accruedPenalty = diffDays * (pSettings.dailyRate || 0);
        }

        const groupedHistory = allPayments.reduce((acc, pay) => {
            const key = `${pay.month} ${pay.year}`;
            if (!acc[key]) acc[key] = [];
            const rawRemarks = pay.remarks || "";
            let displayCategory = "GENERAL FEE";
            if (rawRemarks.toUpperCase().includes("PURPOSE:")) { displayCategory = rawRemarks.split(":")[1].trim(); }
            else if (rawRemarks.includes(":")) { displayCategory = rawRemarks.split(":").pop().trim(); }
            else if (pay.feeCategory && pay.feeCategory !== 'General') { displayCategory = pay.feeCategory; }
            else { displayCategory = rawRemarks || "GENERAL FEE"; }

            acc[key].push({
                id: pay._id, amount: pay.amountPaid,
                category: displayCategory.toUpperCase(), date: pay.date, mode: pay.paymentMode
            });
            return acc;
        }, {});

        res.json({
            studentName: student.name,
            enrollmentNo: student.enrollmentNo, // <--- YE ADD KIYA
            fatherName: student.fatherName,     // <--- YE ADD KIYA
            mobile: student.phone,              // <--- YE ADD KIYA
            grade: student.grade,               // <--- YE ADD KIYA
            schoolName: student.schoolId?.schoolName || "EDUFLOWAI INSTITUTION",
            currentMonth: currentMonthName,
            totalPaidThisMonth: paidThisMonth,
            lastActivity: allPayments.length > 0 ? allPayments[0].date : null,
            totalPenalty: accruedPenalty,
            remainingFees: balance > 0 ? balance : 0, // Ye bina penalty ka pending hai
            grandTotal: (balance > 0 ? balance : 0) + accruedPenalty, // Ye penalty jod kar hai
            advanceBalance: balance < 0 ? Math.abs(balance) : 0,
            totalFeesStructure: monthlyStructureTotal,
            feeStructure: structureDetails,
            paymentHistory: groupedHistory
        });

    } catch (error) {
        console.error("SUMMARY_CRITICAL_ERROR:", error);
        res.status(500).json({ message: 'Neural Link Failure' });
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

// feesRoutes.js mein ye naya route add karo
router.get('/structure/list/all', protect, financeOnly, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        // Sirf className aur updatedAt uthayenge list ke liye
        const list = await FeeStructure.find({ schoolId }).select('className updatedAt').sort({ className: 1 });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching list' });
    }
});

// --- DAY 116: FETCH CLASSES THAT HAVE STUDENTS ---
router.get('/tracker/classes', protect, financeOnly, async (req, res) => {
    try {
        const User = require('../models/User');
        // Sirf un grades ki list nikalna jinmein 'student' role wale bache hain
        const classes = await User.distinct('grade', {
            schoolId: req.user.schoolId,
            role: 'student'
        });
        res.json(classes.sort());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});

// --- DAY 116: FETCH STUDENTS BY CLASS FOR TRACKER ---
// --- DAY 116: FETCH STUDENTS BY CLASS (Updated Fields) ---
router.get('/tracker/students/:grade', protect, financeOnly, async (req, res) => {
    try {
        const User = require('../models/User');
        const students = await User.find({
            schoolId: req.user.schoolId,
            grade: req.params.grade,
            role: 'student'
        }).select('name enrollmentNo grade admissionNo phone'); // admissionNo add kiya agar alag hai toh
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// --- DAY 123: STRICT AUDIT ROUTE (CARRY-FORWARD PENALTY) ---
router.get('/audit/:studentId', protect, financeOnly, async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const schoolId = req.user.schoolId;
        const today = new Date();
        const currentMonthName = today.toLocaleString('default', { month: 'long' });
        const currentYear = today.getFullYear();

        const User = require('../models/User');
        const student = await User.findOne({ _id: studentId, schoolId: schoolId });
        if (!student) return res.status(404).json({ message: 'Identity missing' });

        const rawGrade = student.grade || "";
        const numericPart = rawGrade.match(/\d+/);
        const classMatch = numericPart ? `Class ${numericPart[0]}` : rawGrade;
        const structure = await FeeStructure.findOne({ schoolId, className: classMatch });
        const allPayments = await Fee.find({ student: studentId, schoolId }).sort({ date: -1 });

        let monthlyOnlyStructureTotal = 0;
        let structureDetails = [];
        let oneTimeLabels = [];

        if (structure && structure.fees) {
            Object.keys(structure.fees).forEach(key => {
                const item = structure.fees[key];
                if (item && !item.isNone && item.amount > 0) {
                    const labelName = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
                    const amount = Number(item.amount);
                    if (item.billingCycle === 'monthly') { monthlyOnlyStructureTotal += amount; }
                    else { oneTimeLabels.push(labelName); }

                    const isPaidAlready = allPayments.some(p => p.remarks?.toUpperCase().includes(labelName));
                    structureDetails.push({
                        label: labelName, amount: amount, cycle: item.billingCycle,
                        isPaid: isPaidAlready && item.billingCycle === 'one-time'
                    });
                }
            });
        }

        const collectedThisMonth = allPayments.filter(p => {
            const isCurrentMonth = p.month === currentMonthName && p.year === currentYear;
            const isOneTime = oneTimeLabels.some(label => p.remarks?.toUpperCase().includes(label));
            return isCurrentMonth && !isOneTime;
        }).reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

        const joinDate = new Date(student.createdAt);
        const monthsElapsed = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth()) + 1;
        const totalMonthlyExpectedSoFar = monthlyOnlyStructureTotal * monthsElapsed;

        const totalMonthlyPaidAllTime = allPayments.filter(p => {
            const isOneTime = oneTimeLabels.some(label => p.remarks?.toUpperCase().includes(label));
            return !isOneTime;
        }).reduce((sum, p) => sum + p.amountPaid, 0);

        const balance = totalMonthlyExpectedSoFar - totalMonthlyPaidAllTime;

        // --- DAY 123: INSTANT HIT PENALTY LOGIC ---
        const School = require('../models/School');
        const schoolData = await School.findById(schoolId);
        const pSettings = schoolData.penaltySettings;
        let accruedPenalty = 0;

        if (pSettings?.isActive && balance > 0 && pSettings.activatedAt) {
            const activationDate = new Date(pSettings.activatedAt);
            const today = new Date();

            // Difference in days (Minimum 1 day logic)
            const diffTime = Math.abs(today.getTime() - activationDate.getTime());
            let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // RULE: Button daba toh Day 1 ki penalty (₹100) toh lagegi hi lagegi
            diffDays += 1;

            // 11:00 AM Rule: Agar aaj subah ke 11 baj chuke hain 
            // aur activation 11 se pehle ki hai (yaani ek din pura ho gaya technicaly)
            if (today.getHours() >= 11 && today.getDate() !== activationDate.getDate()) {
                // diffDays automatic 2nd day utha lega milliseconds ki wajah se
            }

            accruedPenalty = diffDays * (pSettings.dailyRate || 0);
        }
        res.json({
            student,
            totalPaidThisMonth: collectedThisMonth,
            totalExpected: monthlyOnlyStructureTotal,
            totalPenalty: accruedPenalty,
            remaining: (balance > 0 ? balance : 0) + accruedPenalty,
            advance: balance < 0 ? Math.abs(balance) : 0,
            currentMonth: currentMonthName,
            structureDetails,
            history: allPayments.reduce((acc, pay) => {
                const key = `${pay.month} ${pay.year}`;
                if (!acc[key]) acc[key] = [];
                const rawRemarks = pay.remarks || "";
                let displayCategory = "GENERAL FEE";
                if (rawRemarks.toUpperCase().includes("PURPOSE:")) { displayCategory = rawRemarks.split(":")[1].trim(); }
                else if (rawRemarks.includes(":")) { displayCategory = rawRemarks.split(":").pop().trim(); }
                else if (pay.feeCategory && pay.feeCategory !== 'General') { displayCategory = pay.feeCategory; }
                else { displayCategory = rawRemarks || "GENERAL FEE"; }
                acc[key].push({ id: pay._id, amount: pay.amountPaid, category: displayCategory.toUpperCase(), date: pay.date, mode: pay.paymentMode });
                return acc;
            }, {}),
            status: ((balance > 0 ? balance : 0) + accruedPenalty) <= 0 ? 'COMPLETED' : 'PENDING'
        });

    } catch (error) {
        console.error("STRICT_AUDIT_ERROR:", error);
        res.status(500).json({ message: 'Neural Ledger Mismatch' });
    }
});

// 1. Get all classes
router.get('/setup/classes', protect, financeOnly, async (req, res) => {
    try {
        const User = require('../models/User');
        const classes = await User.distinct('grade', { schoolId: req.user.schoolId, role: 'student' });
        res.json(classes.sort());
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

// 2. Get students by class
router.get('/setup/students/:grade', protect, financeOnly, async (req, res) => {
    try {
        const User = require('../models/User');
        const students = await User.find({
            grade: req.params.grade,
            schoolId: req.user.schoolId,
            role: 'student'
        }).select('name enrollmentNo');
        res.json(students);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

// --- DAY 120: GET ACTIVE FEE FIELDS (CLEAN LOGIC) ---
router.get('/setup/fields/:grade', protect, financeOnly, async (req, res) => {
    try {
        const rawGrade = req.params.grade;
        const numericPart = rawGrade.match(/\d+/);
        const classMatch = numericPart ? `Class ${numericPart[0]}` : rawGrade;

        const structure = await FeeStructure.findOne({
            schoolId: req.user.schoolId,
            className: classMatch
        });

        if (!structure) return res.json([]);

        // Filter: Sirf wahi components bhej rahe hain jo 'None' nahi hain aur jinki amount set hai
        const activeFields = Object.keys(structure.fees)
            .filter(key =>
                structure.fees[key] &&
                structure.fees[key].isNone === false &&
                structure.fees[key].amount > 0
            )
            .map(key => ({
                key,
                label: key.replace(/([A-Z])/g, ' $1').trim().toUpperCase(),
                amount: structure.fees[key].amount
            }));

        res.json(activeFields);
    } catch (error) {
        console.error("FIELDS_FETCH_ERROR:", error);
        res.status(500).json({ message: 'Fields Sync Error' });
    }
});

module.exports = router;