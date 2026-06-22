const express = require('express');
const router = express.Router();
const AdmitCard = require('../models/AdmitCard');
const Datesheet = require('../models/Datesheet');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 1. Fetch available datesheets for dropdown (Allows AI AND Structured Manual Datesheets)
router.get('/available-datesheets', protect, adminOnly, async (req, res) => {
    try {
        const datesheets = await Datesheet.find({ 
            schoolId: req.user.schoolId,
            // $expr logic checks if the schedule array has at least 1 item. 
            // Isse AI aur Manual (jisme tune wizard use kiya hai) dono allow ho jayenge!
            $expr: { $gt: [{ $size: { $ifNull: ["$schedule", []] } }, 0] } 
        }).sort({ createdAt: -1 });
        res.json(datesheets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch datesheets." });
    }
});

// 2. Publish Admit Card Event
router.post('/publish', protect, adminOnly, async (req, res) => {
    try {
        const { datesheetId, batch, examType, instructions } = req.body;
        
        // Check if already published for this datesheet
        const existing = await AdmitCard.findOne({ datesheetId, schoolId: req.user.schoolId });
        if (existing) {
            return res.status(400).json({ message: "Admit Card for this Datesheet is already published!" });
        }

        const newAdmitCard = await AdmitCard.create({
            schoolId: req.user.schoolId,
            datesheetId,
            batch,
            examType,
            instructions
        });

        res.status(201).json({ message: "Admit Cards Published to Students! 🚀", data: newAdmitCard });
    } catch (error) {
        res.status(500).json({ message: "Failed to publish Admit Cards." });
    }
});

// 3. ADMIN: Fetch all published admit cards
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        const admitCards = await AdmitCard.find({ schoolId: req.user.schoolId })
            .populate('datesheetId', 'title classes') // Datesheet ka naam aur classes fetch karne ke liye
            .sort({ createdAt: -1 });
        res.json(admitCards);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admit cards." });
    }
});

// 4. ADMIN: Delete a specific admit card
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await AdmitCard.findByIdAndDelete(req.params.id);
        res.json({ message: "Admit Card deleted permanently." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete admit card." });
    }
});

// 5. STUDENT: Fetch Admit Cards specific to their grade
router.get('/my-admitcards', protect, async (req, res) => {
    try {
        const studentGrade = req.user.grade;
        if (!studentGrade) return res.status(400).json({ message: "Student grade missing." });

        // DYNAMIC BASE GRADE: "9-A" ban jayega "9"
        const baseGrade = String(studentGrade).split('-')[0].trim().toUpperCase();

        const admitCards = await AdmitCard.find({ schoolId: req.user.schoolId })
            .populate({
                path: 'datesheetId',
                // MATCH LOGIC: Ya toh exact "9-A" mile ya base class "9" mile
                match: { classes: { $in: [studentGrade.toUpperCase(), baseGrade] } }
            })
            .sort({ createdAt: -1 })
            .lean(); // LEAN IS VERY IMPORTANT HERE

        // Filter valid ones
        const validAdmitCards = admitCards.filter(ac => ac.datesheetId !== null);

        const School = require('../models/School');
        const schoolDoc = await School.findById(req.user.schoolId).select('schoolName logo');

        const responseData = validAdmitCards.map(ac => ({
            ...ac,
            schoolName: schoolDoc?.schoolName || "EduFlowAI Public School",
            schoolLogo: schoolDoc?.logo || null
        }));

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admit cards." });
    }
});

module.exports = router;