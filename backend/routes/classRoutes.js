const express = require('express');
const router = express.Router();
const { createClass, getClasses } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only can create
router.post('/', protect, authorize('admin'), createClass);

// Admin and Teachers can view
router.get('/', protect, authorize('admin', 'teacher'), getClasses);

module.exports = router;