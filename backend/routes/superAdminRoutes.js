const express = require('express');
const router = express.Router();
const School = require('../models/School');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// 1. Add New School & Create its Admin
router.post('/onboard-school', protect, async (req, res) => {
    try {
        const { schoolInfo, adminInfo, subscription } = req.body;
        
        // School Create karo
        const newSchool = await School.create({
            ...schoolInfo,
            adminDetails: adminInfo,
            subscription
        });

        // Us school ka Admin User create karo
        await User.create({
            name: adminInfo.fullName,
            email: adminInfo.email,
            password: req.body.tempPassword, // bcrypt middleware handle kar lega
            role: 'admin',
            schoolId: newSchool._id,
            grade: 'N/A' // Admin has no grade
        });

        res.status(201).json(newSchool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Dashboard Stats (Working logic as per your photos)
router.get('/stats', protect, async (req, res) => {
    try {
        const schools = await School.find();
        const totalRevenue = schools.reduce((acc, curr) => acc + curr.subscription.totalPaid, 0);
        const activeSchools = schools.filter(s => s.subscription.status === 'Active').length;
        
        res.json({
            totalSchools: schools.length,
            activeSchools,
            totalRevenue,
            schools // Pure data for list view
        });
    } catch (error) {
        res.status(500).json({ message: 'Stats fetch failed' });
    }
});

module.exports = router;