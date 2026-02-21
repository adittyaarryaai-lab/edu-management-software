const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // File path handle karne ke liye
const connectDB = require('./config/db.js');
const upload = require('./middleware/uploadMiddleware'); // Step 2 wala middleware

// Routes Import
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const feeRoutes = require('./routes/feeRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const supportRoutes = require('./routes/supportRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes')
const libraryRoutes = require('./routes/libraryRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const schoolRoutes = require('./routes/schoolRoutes');


dotenv.config();

// Database Connection
connectDB();
require('./utils/paymentCron');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Vite ka default port, ise allow karna zaroori hai
    credentials: true
}));
app.use(express.json());

// --- DAY 44: STATIC FOLDER & UPLOAD API ---
// Isse browser hamare uploads folder ki files dekh payega
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// File Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    // File ka path frontend ko wapas bhej rahe hain
    res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});
// ------------------------------------------

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/school', schoolRoutes);

app.get('/', (req, res) => {
    res.send('EduFlowAI API is running...');
});

// Error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});