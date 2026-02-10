const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user (Admin/Teacher/Student)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, instituteId } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            instituteId
        });

        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err); // This will show the error in your VS Code terminal
        res.status(500).json({ error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role, instituteId: user.instituteId },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error(err); // This will show the error in your VS Code terminal
        res.status(500).json({ error: err.message });
    }
};