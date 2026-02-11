const Institute = require('../models/Institute');
const User = require('../models/User');
const FeeInvoice = require('../models/FeeInvoice'); // New import for stats
const bcrypt = require('bcryptjs');

// 1. Register a new Institute (Used by Super Admin)
exports.registerInstitute = async (req, res) => {
    try {
        const { name, subdomain, adminName, adminEmail, adminPassword } = req.body;

        // Check if subdomain is taken
        let existingInstitute = await Institute.findOne({ subdomain });
        if (existingInstitute) return res.status(400).json({ msg: "Subdomain already exists" });

        // Create Institute
        const newInstitute = new Institute({
            name,
            subdomain,
            adminEmail
        });
        const savedInstitute = await newInstitute.save();

        // Create Admin User for this Institute
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            instituteId: savedInstitute._id 
        });

        await newAdmin.save();

        res.status(201).json({
            msg: "Institute and Admin created successfully",
            institute: savedInstitute
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 2. Get Admin Stats (Used for Dashboard Cards)
exports.getAdminStats = async (req, res) => {
    try {
        // req.user.instituteId comes from your protect middleware
        const instituteId = req.user.instituteId;

        // Count Students
        const studentCount = await User.countDocuments({ 
            instituteId, 
            role: 'student' 
        });
        
        // Count Teachers
        const teacherCount = await User.countDocuments({ 
            instituteId, 
            role: 'teacher' 
        });

        // Calculate Revenue from Invoices
        const invoices = await FeeInvoice.find({ instituteId });
        
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

        res.json({
            studentCount,
            teacherCount,
            totalRevenue,
            totalCollected,
            pendingFees: totalRevenue - totalCollected
        });
    } catch (err) {
        console.error("Stats Error:", err.message);
        res.status(500).json({ msg: "Server Error while fetching dashboard stats" });
    }
};