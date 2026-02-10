const express = require('express');
const router = express.Router();
const { admitStudent, getStudentsByClass } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkLimit } = require('../middleware/planGuard');

// Only Admin can admit students
router.post('/admit', protect, authorize('admin'), admitStudent);

// Admin and Teachers can view student lists
router.get('/class/:classId', protect, authorize('admin', 'teacher'), getStudentsByClass);
router.post('/admit', protect, authorize('admin'), checkLimit('student'), admitStudent);

module.exports = router;