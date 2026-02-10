const express = require('express');
const router = express.Router();
const { createFeeCategory, generateClassInvoices } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/category', protect, authorize('admin', 'accountant'), createFeeCategory);
router.post('/generate-invoices', protect, authorize('admin', 'accountant'), generateClassInvoices);

module.exports = router;