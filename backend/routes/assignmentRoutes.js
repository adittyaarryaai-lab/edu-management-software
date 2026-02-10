const express = require('express');
const router = express.Router();
const { createAssignment, getAssignmentsByClass } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Teachers and Admins can create assignments
router.post('/', protect, authorize('teacher', 'admin'), createAssignment);

// Students, Teachers, and Admins can view assignments
router.get('/:classId', protect, getAssignmentsByClass);

module.exports = router;