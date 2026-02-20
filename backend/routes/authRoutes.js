const express = require('express');
const { registerUser, authUser, changePassword } = require('../controllers/authController');
const router = express.Router();
const User = require('../models/User'); 
const { protect } = require('../middleware/authMiddleware'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2000000 }, 
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

router.put('/update-profile', protect, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id, schoolId: req.user.schoolId }); // FIXED Isolation
        if (user) {
            if (req.file) {
                user.avatar = `/uploads/avatars/${req.file.filename}`;
            }
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone,
                schoolId: updatedUser.schoolId, // FIXED
                token: req.headers.authorization.split(' ')[1]
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Profile update failed' });
    }
});

router.get('/student-stats', protect, async (req, res) => {
    try {
        const count = await User.countDocuments({ 
            role: 'student',
            schoolId: req.user.schoolId // FIXED: My school only
        });
        res.json({ totalStudents: count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats from database' });
    }
});

module.exports = router;