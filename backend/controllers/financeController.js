const FeeCategory = require('../models/FeeCategory');
const FeeInvoice = require('../models/FeeInvoice');
const StudentProfile = require('../models/StudentProfile');
const Payment = require('../models/Payment');
const logActivity = require('../utils/logger'); // Import the helper

// 1. Create a Fee Category
exports.createFeeCategory = async (req, res) => {
    try {
        const { name, amount, description } = req.body;
        const newCategory = new FeeCategory({
            name, amount, description,
            instituteId: req.user.instituteId
        });
        await newCategory.save();
        
        // ADD LOGGING HERE TOO
        await logActivity(req, "CREATE_FEE_CATEGORY", "Finance", `Created fee category: ${name}`);

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 2. Generate Invoices for a whole Class (Bulk)
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

        // LOGGING
        await logActivity(req, "GENERATE_INVOICES", "Finance", `Generated ${students.length} invoices for class ${classId}`);

        res.status(201).json({ msg: `Invoices generated for ${students.length} students` });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 3. Record Payment (Corrected & Merged)
exports.recordPayment = async (req, res) => {
    try {
        const { invoiceId, amountPaid, paymentMethod, transactionId } = req.body;

        const invoice = await FeeInvoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

        // Create Payment Record
        const payment = new Payment({
            instituteId: req.user.instituteId,
            invoiceId,
            studentId: invoice.studentId,
            amountPaid,
            paymentMethod,
            transactionId
        });
        await payment.save();

        // Update Invoice Status
        invoice.paidAmount += amountPaid;
        if (invoice.paidAmount >= invoice.totalAmount) {
            invoice.status = 'Paid';
        } else {
            invoice.status = 'Partially Paid';
        }
        await invoice.save();

        // THE CRITICAL LOGGING LINE
        await logActivity(req, "RECORD_PAYMENT", "Finance", `Recorded payment of ${amountPaid} for Invoice ${invoiceId}`);

        res.status(201).json({ msg: "Payment recorded and invoice updated", payment });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// 4. Get Finance Stats
exports.getFinanceStats = async (req, res) => {
    try {
        const invoices = await FeeInvoice.find({ instituteId: req.user.instituteId });
        const stats = {
            totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
            totalCollected: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
            totalPending: 0
        };
        stats.totalPending = stats.totalRevenue - stats.totalCollected;
        res.json(stats);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};