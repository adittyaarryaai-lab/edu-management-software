const express = require('express');
const router = express.Router();
// We import the logic from the controller we created in Step 1
const { registerInstitute } = require('../controllers/instituteController');

/**
 * @route   POST /api/institutes/register
 * @desc    Register a new Institute and create its first Admin
 * @access  Public (In a real SaaS, this might be restricted to Super Admin later)
 */
router.post('/register', registerInstitute);

module.exports = router;