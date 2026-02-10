const express = require('express');
const router = express.Router();
const { createExam, uploadMarks, getStudentResult } = require('../controllers/examController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('admin'), createExam);
router.post('/upload-marks', protect, authorize('admin', 'teacher'), uploadMarks);
router.get('/result/:examId/:studentId', protect, getStudentResult);

module.exports = router;