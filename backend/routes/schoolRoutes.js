const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Generate PDF Invoice for a transaction
router.get('/invoice/:txId', protect, adminOnly, async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.txId).populate('schoolId');
        if (!tx) return res.status(404).send("Transaction not found");

        const doc = new PDFDocument({ margin: 50 });

        // HTTP Headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${tx.transactionId}.pdf`);

        doc.pipe(res);

        // --- PDF Design Start ---
        doc.fillColor("#444444").fontSize(20).text("EduFlowAI - Official Invoice", { align: "right" });
        doc.moveDown();

        // School Details
        doc.fillColor("#000000").fontSize(12).text(`School: ${tx.schoolId.schoolName}`);
        doc.text(`Address: ${tx.schoolId.address}`);
        doc.moveDown();

        // Transaction Details
        doc.text(`Transaction ID: ${tx.transactionId}`);
        doc.text(`Billing Month: ${tx.month}`);
        doc.text(`Date: ${new Date(tx.paymentDate).toLocaleDateString()}`);
        doc.moveDown();

        // Table Header
        doc.rect(50, 250, 500, 20).fill("#f1f5f9");
        doc.fillColor("#000000").text("Description", 60, 255);
        doc.text("Amount", 450, 255);

        // Table Content
        doc.text(`Subscription Fee - ${tx.month}`, 60, 280);
        doc.text(`Rs. ${tx.amount}`, 450, 280);

        doc.moveDown(5);
        doc.fontSize(14).text(`Total Paid: Rs. ${tx.amount}`, { align: "right" });

        doc.fontSize(10).fillColor("gray").text("This is a computer-generated invoice and requires no signature.", 50, 700, { align: "center" });

        doc.end();
    } catch (err) {
        res.status(500).send("PDF Generation Error");
    }
});
// @desc    School Admin pays next month's fee in advance
// @route   POST /api/school/pay-advance
router.post('/pay-advance', protect, adminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId);
        if (!school) return res.status(404).json({ message: "School not found" });

        const today = new Date();

        // 1. Transaction Record Create Karo (History ke liye)
        await Transaction.create({
            schoolId: school._id,
            amount: school.subscription.monthlyFee,
            month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
            transactionId: `TXN-ADV-${Date.now()}`,
            status: 'Success'
        });

        // 2. School Subscription Update
        school.subscription.totalPaid += school.subscription.monthlyFee;
        school.subscription.hasPaidAdvance = true;

        const currentNextDate = new Date(school.subscription.nextPaymentDate || Date.now());
        currentNextDate.setMonth(currentNextDate.getMonth() + 1);
        school.subscription.nextPaymentDate = currentNextDate;

        await school.save();

        res.json({
            message: "Advance Payment Successful! Next month's status: SECURED ✅",
            subscription: school.subscription
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Payment processing failed" });
    }
});

// @desc    Get current school's subscription status (for Admin Dashboard)
router.get('/subscription-status', protect, adminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId).select('subscription schoolName');
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: "Error fetching status" });
    }
});

// FIXED: Day 74 - Fetch all transactions for the logged-in school
// @route   GET /api/school/transactions
router.get('/transactions', protect, adminOnly, async (req, res) => {
    try {
        // Sirf apne school ki history dikhao
        const transactions = await Transaction.find({ schoolId: req.user.schoolId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction history" });
    }
});

module.exports = router;