const FeeCategory = require('../models/FeeCategory');
const FeeInvoice = require('../models/FeeInvoice');
const StudentProfile = require('../models/StudentProfile');
const Payment = require('../models/Payment');
const logActivity = require('../utils/logger');

exports.createFeeCategory = async (req, res) => {
    try {
        const { name, amount, description } = req.body;
        const newCategory = new FeeCategory({
            name, amount, description,
            instituteId: req.user.instituteId
        });
        await newCategory.save();
        await logActivity(req, "CREATE_FEE_CATEGORY", "Finance", `Created fee category: ${name}`);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.generateClassInvoices = async (req, res) => {
    try {
        const { classId, feeCategories, dueDate } = req.body;
        const students = await StudentProfile.find({ classId });
        const totalAmount = feeCategories.reduce((sum, item) => sum + item.amount, 0);

        const invoices = students.map(student => ({
            instituteId: req.user.instituteId,
            studentId: student.userId,
            classId: student.classId,
            feeDetails: feeCategories,
            totalAmount,
            dueDate
        }));

        await FeeInvoice.insertMany(invoices);
        await logActivity(req, "GENERATE_INVOICES", "Finance", `Generated ${students.length} invoices`);
        res.status(201).json({ msg: `Invoices generated successfully` });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const { invoiceId, amountPaid, paymentMethod, transactionId } = req.body;
        const invoice = await FeeInvoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

        const payment = new Payment({
            instituteId: req.user.instituteId,
            invoiceId,
            studentId: invoice.studentId,
            amountPaid,
            paymentMethod,
            transactionId
        });
        await payment.save();

        invoice.paidAmount += amountPaid;
        invoice.status = invoice.paidAmount >= invoice.totalAmount ? 'Paid' : 'Partially Paid';
        await invoice.save();

        await logActivity(req, "RECORD_PAYMENT", "Finance", `Paid ${amountPaid} for Invoice ${invoiceId}`);
        res.status(201).json({ msg: "Payment recorded", payment });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.getFinanceStats = async (req, res) => {
    try {
        const invoices = await FeeInvoice.find({ instituteId: req.user.instituteId });
        const stats = {
            totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
            totalCollected: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
        };
        res.json({ ...stats, totalPending: stats.totalRevenue - stats.totalCollected });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// THIS IS THE ONE THE FRONTEND CALLS
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await FeeInvoice.find({ instituteId: req.user.instituteId })
            .populate('studentId', 'name email'); 
        res.json(invoices);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};