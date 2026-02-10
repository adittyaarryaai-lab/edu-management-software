const express = require('express');
const router = express.Router();
const { admitStudent, getStudentsByClass } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Admin can admit students
router.post('/admit', protect, authorize('admin'), admitStudent);

// Admin and Teachers can view student lists
router.get('/class/:classId', protect, authorize('admin', 'teacher'), getStudentsByClass);

module.exports = router;