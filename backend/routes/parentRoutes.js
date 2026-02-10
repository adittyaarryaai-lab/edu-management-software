const express = require('express');
const router = express.Router();
const { getChildDashboard } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Parents can access this specific dashboard
router.get('/dashboard', protect, authorize('parent'), getChildDashboard);

module.exports = router;