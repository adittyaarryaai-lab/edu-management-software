const multer = require('multer');
const path = require('path');

// Storage logic
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Ye folder manualy bana dena backend root mein
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload;