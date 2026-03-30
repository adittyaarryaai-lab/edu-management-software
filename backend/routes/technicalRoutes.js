const express = require('express');
const router = express.Router();
const TechnicalIssue = require('../models/TechnicalIssue');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- 1. Isko add karo folder banane ke liye

// --- DAY 138: AUTO-FOLDER PROTOCOL ---
const uploadPath = 'uploads/tech_issues/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, `ISSUE_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// User issues submit karega
router.post('/report', protect, upload.single('screenshot'), async (req, res) => {
    try {
        const { issueType, description } = req.body;
        
        // Debugging logs (Terminal mein dekho kya aa rha hai)
        console.log("Issue Reported by:", req.user._id);

        const issue = await TechnicalIssue.create({
            userId: req.user._id,
            schoolId: req.user.schoolId,
            issueType,
            description,
            screenshot: req.file ? `/uploads/tech_issues/${req.file.filename}` : null
        });

        res.status(201).json({ success: true, issue });
    } catch (error) { 
        // 2. Exact error terminal mein dikhega taaki humein pata chale crash kyon hua
        console.error("DETAILED_TECH_REPORT_ERROR:", error); 
        res.status(500).json({ message: error.message || 'Neural Link Error' }); 
    }
});

// User apni history dekhega
router.get('/my-history', protect, async (req, res) => {
    const issues = await TechnicalIssue.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
});

// SuperAdmin saare issues dekhega
router.get('/all-reports', protect, superAdminOnly, async (req, res) => {
    const issues = await TechnicalIssue.find().populate('userId', 'name role').populate('schoolId', 'schoolName').sort({ createdAt: -1 });
    res.json(issues);
});

// --- DAY 138: UPDATE ISSUE STATUS (SUPERADMIN ONLY) ---
router.put('/update-status/:id', protect, superAdminOnly, async (req, res) => {
    try {
        const { status } = req.body; // Status: 'Received', 'In Progress', 'Resolved'
        const issue = await TechnicalIssue.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json({ success: true, message: `Node updated to ${status}! ⚡`, issue });
    } catch (error) {
        res.status(500).json({ message: 'Status update failed' });
    }
});

module.exports = router;