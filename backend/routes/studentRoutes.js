const express = require('express');
const router = express.Router();
const { 
    admitStudent, 
    getStudentsByClass, 
    getAllStudents // Add this import from Step 1
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { checkLimit } = require('../middleware/planGuard');

// 1. Admit Student (Only Admin + Subject to Plan Limits)
// Note: We combined the plan check and authorization here.
router.post('/admit', protect, authorize('admin'), checkLimit('student'), admitStudent);

// 2. Get All Students (For the Student Directory/Table)
router.get('/all', protect, authorize('admin', 'teacher'), getAllStudents);

// 3. Get Students by specific Class (For Attendance/Marks)
router.get('/class/:classId', protect, authorize('admin', 'teacher'), getStudentsByClass);

module.exports = router;