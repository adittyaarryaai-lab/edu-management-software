const express = require('express');
const router = express.Router();
const ExamSyllabus = require('../models/ExamSyllabus');
const Timetable = require('../models/Timetable');
const { protect } = require('../middleware/authMiddleware');

// 1. CLASS TEACHER: Initiate Syllabus Collection (SECURED)
router.post('/initiate', protect, async (req, res) => {
    try {
        const { title } = req.body;
        const schoolId = req.user.schoolId;
        
        // SECURITY CHECK: Backend automatically picks the assigned class
        const targetGrade = req.user.assignedClass;

        if (!targetGrade) {
            return res.status(403).json({ message: "Access Denied: You are not an incharge of any class." });
        }

        // Step A: Timetable se class ke saare subjects aur teachers nikalo
        const timetable = await Timetable.findOne({ grade: targetGrade.toUpperCase(), schoolId });
        if (!timetable) {
            return res.status(404).json({ message: `Timetable not found for Class ${targetGrade}.` });
        }

        const subjectMap = {};
        timetable.schedule.forEach(day => {
            day.periods.forEach(p => {
                if (p.subject && p.teacherEmpId) {
                    if (!subjectMap[p.subject]) subjectMap[p.subject] = new Set();
                    subjectMap[p.subject].add(p.teacherEmpId);
                }
            });
        });

        // Step B: Array format mein convert karo
        const subjectsArray = Object.keys(subjectMap).map(sub => ({
            subjectName: sub,
            assignedTeachers: Array.from(subjectMap[sub]),
            isSubmitted: false
        }));

        // Step C: Naya ExamSyllabus document create karo
        const newSyllabus = await ExamSyllabus.create({
            schoolId,
            grade: targetGrade.toUpperCase(),
            title,
            classTeacherId: req.user.employeeId,
            status: 'collecting',
            subjects: subjectsArray
        });

        res.status(201).json({ message: "Syllabus request sent to all subject teachers!", data: newSyllabus });
    } catch (error) {
        res.status(500).json({ message: "Error initiating syllabus: " + error.message });
    }
});

// 2. SUBJECT TEACHER: Fetch pending requests for their subjects
router.get('/pending', protect, async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const empId = req.user.employeeId;

        // Wo requests dhoondo jo abhi 'collecting' status mein hain
        // Aur jinme ye teacher mapped hai (lekin abhi submit nahi kiya hai)
        const pendingRequests = await ExamSyllabus.find({
            schoolId,
            status: 'collecting',
            'subjects': {
                $elemMatch: {
                    assignedTeachers: empId,
                    isSubmitted: false
                }
            }
        });

        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending requests." });
    }
});

// 3. SUBJECT TEACHER: Submit their part of the syllabus
router.post('/submit/:syllabusId', protect, async (req, res) => {
    try {
        const { subjectName, content, action } = req.body; // action: 'submit' or 'none'
        const { syllabusId } = req.params;
        const empId = req.user.employeeId;

        const syllabus = await ExamSyllabus.findById(syllabusId);
        if (!syllabus) return res.status(404).json({ message: "Syllabus block not found." });

        // Subject dhoondo
        const subjectIndex = syllabus.subjects.findIndex(s => s.subjectName === subjectName);
        if (subjectIndex === -1) return res.status(404).json({ message: "Subject not found." });

        if (action === 'none') {
            // Agar do teachers hain aur ek 'none' select karta hai, toh content "N/A" mark kar sakte hain
            // Ya fir is specific teacher ko assigned list se hata sakte hain taaki doosra submit kare.
            // Abhi ke liye simple rakhte hain: isSubmitted = true, content = "Teacher bypassed"
            syllabus.subjects[subjectIndex].content = "Not Applicable";
        } else {
            syllabus.subjects[subjectIndex].content = content;
        }

        syllabus.subjects[subjectIndex].isSubmitted = true;
        syllabus.subjects[subjectIndex].submittedBy = empId;

        await syllabus.save();
        res.json({ message: "Syllabus section submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Submission failed." });
    }
});

// 4. CLASS TEACHER: Check status & Publish
router.get('/monitor/:grade', protect, async (req, res) => {
    try {
        const syllabuses = await ExamSyllabus.find({ 
            grade: req.params.grade.toUpperCase(), 
            schoolId: req.user.schoolId 
        });
        res.json(syllabuses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching monitor data." });
    }
});

// 5. CLASS TEACHER: Edit specific subject content
router.put('/edit-subject/:syllabusId', protect, async (req, res) => {
    try {
        const { subjectName, content } = req.body;
        const syllabus = await ExamSyllabus.findById(req.params.syllabusId);
        if (!syllabus) return res.status(404).json({ message: "Syllabus not found." });

        const subjectIndex = syllabus.subjects.findIndex(s => s.subjectName === subjectName);
        if (subjectIndex !== -1) {
            syllabus.subjects[subjectIndex].content = content;
            await syllabus.save();
            res.json({ message: "Content updated successfully!" });
        } else {
            res.status(404).json({ message: "Subject not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating content." });
    }
});

// 6. CLASS TEACHER: Delete the entire syllabus request
router.delete('/:syllabusId', protect, async (req, res) => {
    try {
        await ExamSyllabus.findByIdAndDelete(req.params.syllabusId);
        res.json({ message: "Entire Syllabus Request Deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting request." });
    }
});

// 7. CLASS TEACHER: Publish to Students
router.put('/publish/:syllabusId', protect, async (req, res) => {
    try {
        const syllabus = await ExamSyllabus.findById(req.params.syllabusId);
        if (!syllabus) return res.status(404).json({ message: "Not found." });
        
        syllabus.status = 'published';
        await syllabus.save();
        
        res.json({ message: "Published to Student Dashboard Successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Publishing failed." });
    }
});

module.exports = router;