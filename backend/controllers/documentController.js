const Document = require('../models/Document');

exports.uploadDocumentRecord = async (req, res) => {
    try {
        const { fileName, fileUrl, fileType, category, studentId } = req.body;

        const newDoc = new Document({
            instituteId: req.user.instituteId,
            uploadedBy: req.user.id,
            fileName,
            fileUrl,
            fileType,
            category,
            studentId
        });

        await newDoc.save();
        res.status(201).json({ msg: "Document record saved successfully", newDoc });
    } catch (err) {
        res.status(500).send("Server Error in Document Management");
    }
};

exports.getStudentDocuments = async (req, res) => {
    try {
        const { studentId } = req.params;
        const docs = await Document.find({ studentId, instituteId: req.user.instituteId });
        res.json(docs);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};