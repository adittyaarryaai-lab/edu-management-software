const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Fee = require('../models/Fee'); // Pehle model import karo top par

// Admin adds a teacher (FIXED: Added Auto-EmployeeID Logic + DAY 78 Extended Fields)
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
// Admin fetching unique grades from Student list (DAY 87 FIX)
router.get('/grades/all', protect, adminOnly, async (req, res) => {
    try {
        const grades = await User.find({
            schoolId: req.user.schoolId,
            role: 'student'
        }).distinct('grade');

        // Sort grades alphabetically (Optional)
        res.json(grades.sort());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grades from students' });
    }
});

router.get('/finance/stats', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Today's Collection
        const todayFees = await Fee.find({
            schoolId,
            date: { $gte: today }
        });
        const collectedToday = todayFees.reduce((sum, f) => sum + f.amountPaid, 0);

        // 2. This Month's Collection
        const monthFees = await Fee.find({
            schoolId,
            date: { $gte: startOfMonth }
        });
        const collectedMonth = monthFees.reduce((sum, f) => sum + f.amountPaid, 0);

        // 3. Recent 5 Payments for the List
        const recentPayments = await Fee.find({ schoolId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('student', 'name grade');

        // Note: Pending fees logic Day 94 mein detail mein aayega
        res.json({
            collectedToday,
            collectedMonth,
            totalPending: 0, // Day 94 placeholder
            pendingStudentsCount: 0, // Day 94 placeholder
            recentPayments: recentPayments.map(p => ({
                studentName: p.student?.name || 'Unknown',
                grade: p.student?.grade || 'N/A',
                amount: p.amountPaid,
                date: p.date.toLocaleDateString()
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Stats Sync Error' });
    }
});

module.exports = router;