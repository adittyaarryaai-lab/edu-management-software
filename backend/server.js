const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Add this
const authRoutes = require('./routes/authRoutes');
const instituteRoutes = require('./routes/instituteRoutes');
const classRoutes = require('./routes/classRoutes');
const staffRoutes = require('./routes/staffRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const financeRoutes = require('./routes/financeRoutes');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/finance', financeRoutes);
// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log("DB Connection Error: ", err));

app.get('/', (req, res) => {
    res.send("EduFlowAI Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is sprinting on port ${PORT}`);
});

// app.use('/api/institute', require('./routes/instituteRoutes'));