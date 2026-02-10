const Class = require('../models/Class');

// Create a New Class
exports.createClass = async (req, res) => {
    try {
        const { className, sections, academicYear } = req.body;
        
        // req.user.instituteId comes from our 'protect' middleware!
        const newClass = new Class({
            className,
            sections,
            academicYear,
            instituteId: req.user.instituteId
        });

        await newClass.save();
        res.status(201).json(newClass);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get all Classes for the logged-in Institute
exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.find({ instituteId: req.user.instituteId });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};