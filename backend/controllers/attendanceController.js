const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
    try {
        const { classId, date, records } = req.body;

        // Convert string date to a normalized Date object (Y-M-D) to avoid time-zone issues
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0,0,0,0);

        const newAttendance = new Attendance({
            instituteId: req.user.instituteId,
            classId,
            date: attendanceDate,
            records,
            markedBy: req.user.id
        });

        await newAttendance.save();
        res.status(201).json({ msg: "Attendance marked successfully" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Attendance already marked for this date" });
        }
        res.status(500).send("Server Error");
    }
};

exports.getAttendanceByClass = async (req, res) => {
    try {
        const { classId, date } = req.query;
        const searchDate = new Date(date);
        searchDate.setHours(0,0,0,0);

        const attendance = await Attendance.findOne({ classId, date: searchDate })
            .populate('records.studentId', ['name']);
        
        if (!attendance) return res.status(404).json({ msg: "No records found" });
        res.json(attendance);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};