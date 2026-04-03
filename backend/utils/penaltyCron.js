const cron = require('node-cron');
const School = require('../models/School');
const User = require('../models/User');
const Fee = require('../models/Fee');
const FeeStructure = require('../models/FeeStructure');

const freezeAndTurnOffPenalty = async () => {
    try {
        console.log("--- CRON PROTOCOL: MONTHLY PENALTY SNAPSHOT STARTING ---");
        
        // 1. Sirf wahi schools uthao jahan penalty ON hai
        const schools = await School.find({ 'penaltySettings.isActive': true });
        const today = new Date();
        const currentMonth = today.getMonth(); // 0-11
        const currentYear = today.getFullYear();

        for (let school of schools) {
            // Check agar is mahine ka auto-off abhi tak nahi hua hai
            if (school.penaltySettings.lastAutoOffMonth !== currentMonth) {
                
                console.log(`Processing School: ${school.schoolName}...`);

                // 2. Iss school ke saare students pakdo
                const students = await User.find({ schoolId: school._id, role: 'student' });

                for (let student of students) {
                    // 3. Current Balance calculate karo snapshot ke liye
                    const verifiedPayments = await Fee.find({ student: student._id, status: 'Verified' });
                    
                    const numericPart = student.grade?.match(/\d+/);
                    const classMatch = numericPart ? `Class ${numericPart[0]}` : student.grade;
                    const structure = await FeeStructure.findOne({ schoolId: school._id, className: classMatch });

                    let monthlyRate = 0;
                    if (structure && structure.fees) {
                        Object.keys(structure.fees).forEach(k => {
                            if (structure.fees[k].billingCycle === 'monthly') monthlyRate += (Number(structure.fees[k].amount) || 0);
                        });
                    }

                    const joinDate = new Date(student.createdAt);
                    const monthsElapsed = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth()) + 1;
                    const totalExpected = monthlyRate * monthsElapsed;
                    
                    // Penalty-Fine entries ko totalPaid se bahar rakha hai
                    const totalPaid = verifiedPayments.filter(p => !p.remarks?.includes('SYSTEM_FREEZE')).reduce((sum, p) => sum + (p.amountPaid || 0), 0);
                    
                    const balance = totalExpected - totalPaid;

                    // 4. Agar bache ka balance hai, toh penalty freeze (save) karo
                    if (balance > 0 && school.penaltySettings.activatedAt) {
                        const start = new Date(school.penaltySettings.activatedAt);
                        const diffTime = Math.abs(today - new Date(start.getFullYear(), start.getMonth(), start.getDate()));
                        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        // 11:00 AM Rule
                        if (diffDays > 0 && today.getHours() < 11) diffDays -= 1;

                        const fineAmount = diffDays * (school.penaltySettings.dailyRate || 0);

                        if (fineAmount > 0) {
                            // Database entry for Frozen Penalty
                            await Fee.create({
                                schoolId: school._id,
                                student: student._id,
                                amountPaid: 0,
                                penaltyAmount: fineAmount,
                                month: today.toLocaleString('default', { month: 'long' }),
                                year: currentYear,
                                paymentMode: 'UPI', 
                                status: 'Verified',
                                remarks: `SYSTEM_FREEZE: AUTO_OFF_SNAPSHOT_${today.getMonth() + 1}`
                            });
                        }
                    }
                }

                // 5. School ki settings update karo (OFF kar do)
                school.penaltySettings.isActive = false;
                school.penaltySettings.lastAutoOffMonth = currentMonth;
                school.penaltySettings.activatedAt = null; // Reset clock
                await school.save();

                console.log(`✅ Success: Penalties Frozen & Auto-Off for ${school.schoolName}`);
            }
        }
        console.log("--- CRON PROTOCOL: COMPLETED ---");
    } catch (err) {
        console.error("CRON_FATAL_ERROR:", err);
    }
};

// Har mahine ki 1st date ko raat 12:01 AM par chalega
cron.schedule('1 0 1 * *', freezeAndTurnOffPenalty);

module.exports = freezeAndTurnOffPenalty;