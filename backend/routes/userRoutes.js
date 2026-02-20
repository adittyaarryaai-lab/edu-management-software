const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Admin adds a teacher (FIXED: Added Auto-EmployeeID Logic)
// Admin adds a teacher (EMP001 sequence for whole school)
router.post('/add-teacher', protect, adminOnly, async (req, res) => {
    const { name, email, password, subjects } = req.body;
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
            // PadStart will make it 001, 002... and if it reaches 1000, it stays 1000
            nextEmpId = `EMP${nextNo.toString().padStart(3, '0')}`;
        } else {
            nextEmpId = 'EMP001'; // Starting from 001 as requested
        }

        const teacher = await User.create({
            schoolId: req.user.schoolId,
            name, 
            email, 
            password, 
            role: 'teacher', 
            employeeId: nextEmpId,
            subjects
        });
        res.status(201).json({ message: `Teacher assigned with ID: ${nextEmpId}`, teacher });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin adds a student (STU001 sequence SEPARATE for each Grade)
router.post('/add-student', protect, adminOnly, async (req, res) => {
    const { name, email, password, grade } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // FIXED: Find latest student in THIS school AND in THIS specific GRADE
        const lastStudent = await User.findOne({ 
            schoolId: req.user.schoolId, 
            role: 'student',
            grade: grade // Class-wise filter logic
        }).sort({ createdAt: -1 });

        let nextEnrollNo;
        if (lastStudent && lastStudent.enrollmentNo && lastStudent.enrollmentNo.startsWith('STU')) {
            // Hum sirf number nikalenge (e.g., STU001 -> 1)
            const lastNo = parseInt(lastStudent.enrollmentNo.replace('STU', ''));
            const nextNo = lastNo + 1;
            // PadStart handle karega: 009 -> 010 and 999 -> 1000 automatically
            nextEnrollNo = `STU${nextNo.toString().padStart(3, '0')}`;
        } else {
            nextEnrollNo = 'STU001'; // Har nayi class ka pehla bacha STU001 se shuru hoga
        }

        const student = await User.create({
            schoolId: req.user.schoolId,
            name, 
            email, 
            password, 
            role: 'student', 
            enrollmentNo: nextEnrollNo,
            grade
        });
        res.status(201).json({ message: `Student enrolled in ${grade} with ID: ${nextEnrollNo}`, student });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/students/:grade', protect, async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            grade: req.params.grade,
            schoolId: req.user.schoolId // FIXED Isolation
        }).select('name enrollmentNo grade');

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;