const Institute = require('../models/Institute');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerInstitute = async (req, res) => {
    try {
        const { name, subdomain, adminName, adminEmail, adminPassword } = req.body;

        // 1. Check if subdomain is taken
        let existingInstitute = await Institute.findOne({ subdomain });
        if (existingInstitute) return res.status(400).json({ msg: "Subdomain already exists" });

        // 2. Create Institute
        const newInstitute = new Institute({
            name,
            subdomain,
            adminEmail
        });
        const savedInstitute = await newInstitute.save();

        // 3. Create Admin User for this Institute
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            instituteId: savedInstitute._id // Linking the user to the institute
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