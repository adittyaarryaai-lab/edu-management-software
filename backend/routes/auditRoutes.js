const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const logs = await AuditLog.find({ instituteId: req.user.instituteId })
            .populate('userId', ['name', 'role'])
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;