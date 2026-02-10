const Mark = require('../models/Mark');
const StudentProfile = require('../models/StudentProfile');

exports.getStudentTrend = async (req, res) => {
    try {
        const { studentId } = req.params;

        // 1. Get all marks for the student sorted by exam date
        const marks = await Mark.find({ studentId })
            .populate('examId', ['name', 'createdAt'])
            .sort('createdAt');

        if (!marks.length) return res.status(404).json({ msg: "No academic data found" });

        // 2. Group marks by subject to see progress
        const performanceMap = {};
        marks.forEach(record => {
            if (!performanceMap[record.subject]) {
                performanceMap[record.subject] = [];
            }
            performanceMap[record.subject].push({
                exam: record.examId.name,
                percentage: (record.marksObtained / record.maxMarks) * 100
            });
        });

        // 3. Simple AI Insight Logic: Check if the last score is lower than the previous one
        const insights = [];
        for (let subject in performanceMap) {
            const history = performanceMap[subject];
            if (history.length >= 2) {
                const latest = history[history.length - 1].percentage;
                const previous = history[history.length - 2].percentage;
                
                if (latest < previous - 10) {
                    insights.push(`Alert: Significant drop in ${subject} (${(previous - latest).toFixed(1)}% decrease).`);
                } else if (latest > previous + 5) {
                    insights.push(`Great: Improvement detected in ${subject}!`);
                }
            }
        }

        res.json({
            studentId,
            subjectTrends: performanceMap,
            aiInsights: insights.length > 0 ? insights : ["No significant changes in performance."]
        });
    } catch (err) {
        res.status(500).send("Server Error in Analytics");
    }
};