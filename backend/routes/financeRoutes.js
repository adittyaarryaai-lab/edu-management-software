const express = require('express');
const router = express.Router();
// const { createFeeCategory, generateClassInvoices } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createFeeCategory, generateClassInvoices, recordPayment, getFinanceStats } = require('../controllers/financeController');

router.post('/category', protect, authorize('admin', 'accountant'), createFeeCategory);
router.post('/generate-invoices', protect, authorize('admin', 'accountant'), generateClassInvoices);
router.post('/record-payment', protect, authorize('admin', 'accountant'), recordPayment);
router.get('/stats', protect, authorize('admin', 'accountant'), getFinanceStats);

module.exports = router;