const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// --- DAY 136: ASK QUERY (STRICT MODEL SYNC) ---
router.post('/ask', protect, async (req, res) => {
    try {
        const { subject, query, isUrgent } = req.body;
        const User = require('../models/User');

        // 1. Student ki details lo (req.user._id humein middleware se mil raha hai)
        const student = await User.findById(req.user._id);
        
        if (!student || !student.grade) {
            return res.status(400).json({ message: 'Student Grade Node not found in database' });
        }

        // Student ki class (e.g., "9-C")
        const studentGrade = student.grade.trim();

        // 2. Teacher dhoondo jahan assignedClass == student's grade
        // Hum regex use karenge taaki agar case ka thoda fark ho (9-c vs 9-C) toh bhi match ho jaye
        const assignedTeacher = await User.findOne({ 
            schoolId: req.user.schoolId, 
            role: 'teacher', 
            assignedClass: { $regex: new RegExp(`^${studentGrade}$`, 'i') } 
        });

        // Debugging for Terminal (Tujhe console mein dikhega ki kya ho raha hai)
        console.log(`--- SUPPORT LINKING SYSTEM ---`);
        console.log(`Target Grade: ${studentGrade}`);
        console.log(`Teacher Found: ${assignedTeacher ? assignedTeacher.name : 'NULL - No teacher assigned to this class'}`);

        // 3. Query create karo
        const newQuery = await Support.create({
            schoolId: req.user.schoolId,
            student: req.user._id,
            // Agar teacher mila toh uska ID jayega, varna null (taki mix na ho)
            teacher: assignedTeacher ? assignedTeacher._id : null, 
            subject,
            query,
            isUrgent
        });

        res.status(201).json(newQuery);
    } catch (error) {
        console.error("CRITICAL_SUPPORT_ERROR:", error);
        res.status(500).json({ message: 'Neural Link Failure' });
    }
});

router.get('/my-queries', protect, async (req, res) => {
    try {
        const queries = await Support.find({ 
            student: req.user._id,
            schoolId: req.user.schoolId // FIXED
        }).sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching queries' });
    }
});

// --- DAY 136: GET TEACHER SPECIFIC QUERIES ---
router.get('/all-queries', protect, teacherOnly, async (req, res) => {
    try {
        // Sirf wahi queries dikhao jo is teacher ko assign hain
        const queries = await Support.find({ 
            schoolId: req.user.schoolId,
            teacher: req.user._id 
        })
        .populate('student', 'name grade')
        .sort({ isUrgent: -1, createdAt: -1 });

        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sector queries' });
    }
});

router.put('/resolve/:id', protect, teacherOnly, async (req, res) => {
    try {
        const { answer } = req.body;
        const query = await Support.findOneAndUpdate(
            { _id: req.params.id, schoolId: req.user.schoolId }, // FIXED Security
            { 
                answer, 
                status: 'Resolved',
                teacher: req.user._id 
            },
            { new: true }
        );
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: 'Error resolving query' });
    }
});

module.exports = router;