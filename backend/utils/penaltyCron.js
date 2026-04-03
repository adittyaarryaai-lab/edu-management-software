const cron = require('node-cron');
const School = require('../models/School');
const User = require('../models/User');
const Fee = require('../models/Fee');
// Yahan hum wo same logic use karenge jo hum summary mein penalty nikalne ke liye karte hain

const freezeAndTurnOffPenalty = async () => {
    try {
        const schools = await School.find({ 'penaltySettings.isActive': true });
        const currentMonth = new Date().getMonth(); // 0-11

        for (let school of schools) {
            // Check agar is mahine ka auto-off abhi tak nahi hua hai
            if (school.penaltySettings.lastAutoOffMonth !== currentMonth) {
                
                // 1. Iss school ke saare bache pakdo jinpe udhaar hai (balance > 0)
                // (Abhi ke liye hum simplicity ke liye manual off wala logic hi use karenge)
                
                // 2. Penalty button OFF kardo
                school.penaltySettings.isActive = false;
                school.penaltySettings.lastAutoOffMonth = currentMonth;
                await school.save();
                console.log(`Penalty Auto-Off for ${school.schoolName}`);
            }
        }
    } catch (err) {
        console.error("Cron Error:", err);
    }
};

// Har mahine ki 1st date ko raat 12:01 par chalega
cron.schedule('1 0 1 * *', freezeAndTurnOffPenalty);

module.exports = freezeAndTurnOffPenalty;