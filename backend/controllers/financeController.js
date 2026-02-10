const FeeCategory = require('../models/FeeCategory');
const FeeInvoice = require('../models/FeeInvoice');
const StudentProfile = require('../models/StudentProfile');

// Create a Fee Category
exports.createFeeCategory = async (req, res) => {
    try {
        const { name, amount, description } = req.body;
        const newCategory = new FeeCategory({
            name, amount, description,
            instituteId: req.user.instituteId
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Generate Invoices for a whole Class (Bulk)
exports.generateClassInvoices = async (req, res) => {
    try {
        const { classId, feeCategories, dueDate } = req.body; 
        // feeCategories is an array of objects: [{category: "Tuition", amount: 5000}]

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
        res.status(201).json({ msg: `Invoices generated for ${students.length} students` });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};