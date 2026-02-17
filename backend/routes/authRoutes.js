const express = require('express');
const { registerUser, authUser, changePassword } = require('../controllers/authController');
const router = express.Router();
const User = require('../models/User'); // User model import karna zaroori hai stats ke liye
const { protect } = require('../middleware/authMiddleware'); // Protect middleware for security
const multer = require('multer');
const path = require('path');

// --- STEP 2: MULTER SETUP FOR AVATARS ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        // User ID ke saath timestamp taaki file unique rahe
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2000000 }, // Max 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only Images (JPG, PNG, WEBP) are allowed!');
        }
    }
});

router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/change-password', protect, changePassword);

// @desc    Update User Profile (Avatar & Phone)
// @route   PUT /api/auth/update-profile
router.put('/update-profile', protect, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            // Agar file upload hui hai toh path update karo
            if (req.file) {
                user.avatar = `/uploads/avatars/${req.file.filename}`;
            }
            // Phone update logic (optional)
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();
            
            // Response mein updated data aur purana token bhej rahe hain
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                token: req.headers.authorization.split(' ')[1]
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: 'Profile update failed' });
    }
});

// @desc    Get total student count for dashboard stats
// @route   GET /api/auth/student-stats
// @access  Protected
router.get('/student-stats', protect, async (req, res) => {
    try {
        // Database se sirf wo users count karega jinka role 'student' hai
        const count = await User.countDocuments({ role: 'student' });
        res.json({ totalStudents: count });
    } catch (error) {
        console.error("Error fetching student stats:", error);
        res.status(500).json({ message: 'Error fetching stats from database' });
    }
});

module.exports = router;