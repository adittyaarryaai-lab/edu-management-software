const express = require('express');
const router = express.Router();
const { postNotice, getNotices } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Admin and Teachers can post notices
router.post('/', protect, authorize('admin', 'teacher'), postNotice);

// Everyone can view notices (but they only see what is meant for them)
router.get('/', protect, getNotices);

module.exports = router;