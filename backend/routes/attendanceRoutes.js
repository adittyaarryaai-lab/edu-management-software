const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByClass } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Teachers and Admins can mark attendance
router.post('/', protect, authorize('admin', 'teacher'), markAttendance);

// View attendance history
router.get('/', protect, authorize('admin', 'teacher'), getAttendanceByClass);

module.exports = router;