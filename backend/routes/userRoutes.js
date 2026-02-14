const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Admin adds a teacher
router.post('/add-teacher', protect, adminOnly, async (req, res) => {
    const { name, email, password, employeeId, subjects } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const teacher = await User.create({
            name, email, password, role: 'teacher', employeeId, subjects
        });
        res.status(201).json({ message: 'Teacher added successfully', teacher });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// Admin adds a student
router.post('/add-student', protect, adminOnly, async (req, res) => {
    const { name, email, password, enrollmentNo, grade } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const student = await User.create({
            name, email, password, role: 'student', enrollmentNo, grade
        });
        res.status(201).json({ message: 'Student Enrolled successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;