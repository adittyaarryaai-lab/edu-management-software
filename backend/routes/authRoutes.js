const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = express.Router();
const User = require('../models/User'); // User model import karna zaroori hai stats ke liye
const { protect } = require('../middleware/authMiddleware'); // Protect middleware for security

router.post('/register', registerUser);
router.post('/login', authUser);

// @desc    Get total student count for dashboard stats
// @route   GET /api/auth/student-stats
// @access  Protected
router.get('/student-stats', protect, async (req, res) => {
    try {
        // Database se sirf wo users count karega jinka role 'student' hai
        const count = await User.countDocuments({ role: 'student' });
        res.json({ totalStudents: count });
    } catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).json({ message: 'Error fetching stats from database' });
    }
});

module.exports = router;