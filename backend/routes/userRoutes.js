const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Fee = require('../models/Fee');
router.post('/add-teacher', protect, adminOnly, async (req, res) => {
    const {
        name, email, password, subjects,
        fatherName, motherName, dob, gender, religion,
        phone, address
    } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Step 1: Find the latest teacher in THIS school
        const lastTeacher = await User.findOne({
            schoolId: req.user.schoolId,
            role: 'teacher'
        }).sort({ createdAt: -1 });

        let nextEmpId;
        if (lastTeacher && lastTeacher.employeeId && lastTeacher.employeeId.startsWith('EMP')) {
            const lastNo = parseInt(lastTeacher.employeeId.replace('EMP', ''));
            const nextNo = lastNo + 1;
            nextEmpId = `EMP${nextNo.toString().padStart(3, '0')}`;
        } else {
            nextEmpId = 'EMP001';
        }

        const teacher = await User.create({
            schoolId: req.user.schoolId,
            name,
            email,
            password,
            role: 'teacher',
            employeeId: nextEmpId,
            subjects,
            fatherName,
            motherName,
            dob,
            gender,
            religion,
            phone,
            address // day 78 address object (pincode, district, state, etc)
        });
        res.status(201).json({ message: `Teacher assigned with ID: ${nextEmpId}`, teacher });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin adds a student (STU001 sequence SEPARATE for each Grade + DAY 78 Extended Fields)
router.post('/add-student', protect, adminOnly, async (req, res) => {
    const {
        name, email, password, grade,
        fatherName, motherName, dob, gender, religion, admissionNo,
        phone, address
    } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // FIXED: Find latest student in THIS school AND in THIS specific GRADE
        const lastStudent = await User.findOne({
            schoolId: req.user.schoolId,
            role: 'student',
            grade: grade
        }).sort({ createdAt: -1 });

        let nextEnrollNo;
        if (lastStudent && lastStudent.enrollmentNo && lastStudent.enrollmentNo.startsWith('STU')) {
            const lastNo = parseInt(lastStudent.enrollmentNo.replace('STU', ''));
            const nextNo = lastNo + 1;
            nextEnrollNo = `STU${nextNo.toString().padStart(3, '0')}`;
        } else {
            nextEnrollNo = 'STU001';
        }

        const student = await User.create({
            schoolId: req.user.schoolId,
            name,
            email,
            password,
            role: 'student',
            enrollmentNo: nextEnrollNo,
            grade,
            fatherName,
            motherName,
            dob,
            gender,
            religion,
            admissionNo,
            phone,
            address // day 78 address object
        });
        res.status(201).json({ message: `Student enrolled in ${grade} with ID: ${nextEnrollNo}`, student });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin fetching students by grade (Added select for new fields if needed)
router.get('/students/:grade', protect, async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            grade: req.params.grade,
            schoolId: req.user.schoolId
        }).select('name enrollmentNo grade fatherName motherName dob gender religion admissionNo phone address avatar');

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin fetching all teachers
router.get('/teachers', protect, adminOnly, async (req, res) => {
    try {
        const teachers = await User.find({
            role: { $in: ['teacher', 'finance'] },
            schoolId: req.user.schoolId
        }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Update User Sequence (DAY 78)
// Admin Update User (DAY 85: Added AssignedClass Conflict Check)
router.put('/update/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // --- CONFLICT CHECK FOR TEACHER ASSIGNMENT ---
        if (user.role === 'teacher' && req.body.assignedClass) {
            const classTaken = await User.findOne({
                role: 'teacher',
                assignedClass: req.body.assignedClass.toUpperCase(),
                schoolId: req.user.schoolId,
                _id: { $ne: req.params.id } // Khud ko chhod kar
            });
            if (classTaken) {
                return res.status(400).json({
                    message: `CONFLICT: Class ${req.body.assignedClass} is already assigned to EMP: ${classTaken.employeeId}!`
                });
            }
        }

        // Update fields
        Object.assign(user, req.body);
        if (user.role === 'teacher' && user.assignedClass) {
            user.assignedClass = user.assignedClass.toUpperCase();
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Update failed: ' + error.message });
    }
});

// Admin Delete User (DAY 78)
router.delete('/delete/:id', protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User identity purged' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

router.get('/grades/all', protect, async (req, res) => {
    try {
        const grades = await User.find({
            schoolId: req.user.schoolId,
            role: 'student'
        }).distinct('grade');
        res.json(grades.sort());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grades' });
    }
});

// --- DAY 112/118: ENHANCED FINANCE STATS (FIXED - NO INSTALLMENTS) ---
router.get('/finance/stats', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        const School = require('../models/School');
        const schoolDetails = await School.findById(schoolId).select('schoolName address');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Fetch Today's Payments
        const todayFees = await Fee.find({ schoolId, date: { $gte: today } });
        const collectedToday = todayFees.reduce((sum, f) => sum + f.amountPaid, 0);

        // 2. Fetch Monthly Payments
        const monthFees = await Fee.find({ schoolId, date: { $gte: startOfMonth } });
        const collectedMonth = monthFees.reduce((sum, f) => sum + f.amountPaid, 0);

        // 3. Separate Online Payments Today
        const onlineToday = todayFees
            .filter(f => ['Online', 'PhonePe', 'Google Pay', 'Paytm', 'UPI'].includes(f.paymentMode))
            .reduce((sum, f) => sum + f.amountPaid, 0);

        // 4. Recent Payments
        const recentPayments = await Fee.find({ schoolId })
            .sort({ date: -1 })
            .limit(10)
            .populate('student', 'name grade enrollmentNo');

        // NOTE: Pending Installments logic removed as per Day 118 plan

        res.json({
            schoolName: schoolDetails?.schoolName || "EduFlowAI School",
            schoolAddress: schoolDetails?.address || "Main Campus, India",
            collectedToday,
            collectedMonth,
            onlineToday,
            totalPending: 0, // Dashboard crash na ho isliye temporary 0 bhej rahe hain
            pendingStudentsCount: 0,
            recentPayments: recentPayments.map(p => ({
                _id: p._id,
                studentName: p.student?.name || 'Unknown',
                enrollmentNo: p.student?.enrollmentNo || 'N/A',
                grade: p.student?.grade || 'N/A',
                amount: p.amountPaid,
                paymentMode: p.paymentMode,
                date: p.date.toLocaleDateString(),
                time: p.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
        });
    } catch (error) {
        console.error("Finance Stats Error:", error);
        res.status(500).json({ message: 'Stats Sync Error: ' + error.message });
    }
});

// --- DAY 90: FETCH ALL STUDENTS WITH BASIC FEE INFO ---
router.get('/finance/students-ledger/:grade', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const students = await User.find({
            role: 'student',
            grade: req.params.grade,
            schoolId: schoolId
        }).select('name enrollmentNo grade phone avatar');

        // Note: Future mein yahan total_paid calculation bhi merge karenge
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Ledger Fetch Error' });
    }
});

// --- DAY 119: ADD PAYMENT BY ENROLLMENT NO & FEE CATEGORY ---
router.post('/finance/add-payment', protect, async (req, res) => {
    // 1. Ab hum 'studentId' ki jagah frontend se 'enrollmentNo' aur 'feeCategory' mangwa rahe hain
    const { enrollmentNo, amountPaid, month, year, paymentMode, remarks, feeCategory } = req.body;

    try {
        // 2. Enrollment Number se database mein student ko dhoondo
        const student = await User.findOne({
            enrollmentNo: enrollmentNo,
            schoolId: req.user.schoolId,
            role: 'student'
        });

        // 3. Agar bacha nahi milta toh error do
        if (!student) {
            return res.status(404).json({ message: "Student Identity Not Found! Check Enrollment No. ❌" });
        }

        // userRoutes.js mein add-payment route ke andar Fee.create wala hissa:
        const feeRecord = await Fee.create({
            schoolId: req.user.schoolId,
            student: student._id,
            amountPaid: Number(amountPaid),
            month,
            year: Number(year),
            paymentMode,
            // Strict Labeling: Isse history mein kabhi General Fee nahi aayega
            remarks: `PURPOSE: ${feeCategory}`,
            feeCategory: feeCategory,
            date: new Date()
        });;

        res.status(201).json({
            message: `Payment Linked to ${student.name} Successfully! ✅`,
            feeRecord
        });
    } catch (error) {
        console.error("Payment Process Error:", error);
        res.status(500).json({ message: 'Neural Payment Protocol Failed' });
    }
});

// --- DAY 92: GET RECEIPT DETAILS WITH SCHOOL INFO ---
router.get('/finance/receipt/:feeId', protect, async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.feeId)
            .populate('student', 'name enrollmentNo grade phone')
            .populate({ path: 'schoolId', select: 'name address phone logo' });
        if (!fee) return res.status(404).json({ message: 'Receipt not found' });

        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching receipt' });
    }
});

module.exports = router;