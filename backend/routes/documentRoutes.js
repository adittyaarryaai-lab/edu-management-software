const express = require('express');
const router = express.Router();
const { uploadDocumentRecord, getStudentDocuments } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admins and Teachers can upload/view documents
router.post('/upload', protect, authorize('admin', 'teacher'), uploadDocumentRecord);
router.get('/student/:studentId', protect, getStudentDocuments);

module.exports = router;