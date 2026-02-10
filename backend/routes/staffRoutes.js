const express = require('express');
const router = express.Router();
const { addStaff, getStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Admin can add staff
router.post('/add', protect, authorize('admin'), addStaff);

// Admin can view all staff
router.get('/', protect, authorize('admin'), getStaff);

module.exports = router;