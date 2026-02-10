const express = require('express');
const router = express.Router();
const { getStudentTrend } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Accessible by Admin, Teachers, and the Parent of that student
router.get('/student-trend/:studentId', protect, getStudentTrend);

module.exports = router;