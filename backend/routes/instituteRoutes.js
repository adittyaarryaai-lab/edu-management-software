const express = require('express');
const router = express.Router();

// CORRECTED IMPORT: We must add 'getAdminStats' inside the curly braces
const { registerInstitute, getAdminStats } = require('../controllers/instituteController');

const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/institutes/register
 * @desc    Register a new Institute and create its first Admin
 * @access  Private (Super Admin Only)
 */
router.post('/register', protect, authorize('super-admin'), registerInstitute);

/**
 * @route   GET /api/institutes/admin-stats
 * @desc    Get high-level stats for the Dashboard
 * @access  Private (Admin Only)
 */
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);

module.exports = router;