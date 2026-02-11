const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    createFeeCategory, 
    generateClassInvoices, 
    recordPayment, 
    getFinanceStats, 
    getAllInvoices 
} = require('../controllers/financeController');

router.post('/category', protect, authorize('admin', 'accountant'), createFeeCategory);
router.post('/generate-invoices', protect, authorize('admin', 'accountant'), generateClassInvoices);
router.post('/record-payment', protect, authorize('admin', 'accountant'), recordPayment);
router.get('/stats', protect, authorize('admin', 'accountant'), getFinanceStats);
router.get('/invoices', protect, authorize('admin', 'accountant'), getAllInvoices);

module.exports = router;