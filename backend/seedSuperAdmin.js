const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "master@eduflowai.com"; // Your Master Email
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Super Admin already exists.");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("masterpassword123", salt);

        const superAdmin = new User({
            name: "EduFlow Master",
            email: email,
            password: hashedPassword,
            role: "super-admin"
            // No instituteId needed for Super Admin
        });

        await superAdmin.save();
        console.log("✅ Super Admin created successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedSuperAdmin();