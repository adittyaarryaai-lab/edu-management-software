const cron = require('node-cron');
const School = require('../models/School');
const Transaction = require('../models/Transaction'); 

// Schedule: Raat ke 12 baje (0 0 * * *) ya testing ke liye '*/1 * * * *' use kar sakte ho
cron.schedule('0 0 * * *', async () => {
    console.log("--- ⚡ Cron Job Started: Checking Subscriptions ---");
    try {
        const today = new Date();
        const schools = await School.find({ "subscription.status": 'Active', isDeleted: false });

        for (let school of schools) {
            console.log(`Checking School: ${school.schoolName}`);

            // 1. Agar nextPaymentDate nahi hai, toh onboarding date se 1 mahina aage ki set kar do
            if (!school.subscription.nextPaymentDate) {
                let fallbackDate = new Date(school.subscription.onboardingDate || Date.now());
                fallbackDate.setMonth(fallbackDate.getMonth() + 1);
                school.subscription.nextPaymentDate = fallbackDate;
                await school.save();
                console.log(`Set missing nextPaymentDate for ${school.schoolName}`);
            }

            const nextPayDate = new Date(school.subscription.nextPaymentDate);

            // 2. Comparison Logic (Check if today is >= nextPayDate)
            if (today >= nextPayDate) {
                console.log(`Match Found! Processing payment for ${school.schoolName}`);

                if (school.subscription.hasPaidAdvance) {
                    console.log("Advance already paid. Skipping charge, updating date.");
                    school.subscription.hasPaidAdvance = false; // Reset for next cycle
                } else {
                    console.log(`Charging Monthly Fee: ₹${school.subscription.monthlyFee}`);
                    // Total Paid update karo
                    school.subscription.totalPaid += (school.subscription.monthlyFee || 0);
                    school.subscription.lastPaymentDate = today;

                    const newTx = await Transaction.create({
                        schoolId: school._id,
                        amount: school.subscription.monthlyFee,
                        month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
                        transactionId: `TXN-${Date.now()}`,
                        status: 'Success'
                    });
                    console.log(`✅ Transaction Record Generated: ${newTx.transactionId}`);
                    // --------------------------------------------------
                }

                // Agle mahine ki date set karo
                nextPayDate.setMonth(nextPayDate.getMonth() + 1);
                school.subscription.nextPaymentDate = nextPayDate;

                await school.save();
                console.log(`Payment processed. Next Date: ${nextPayDate}`);
            } else {
                console.log(`Not yet due. Next Payment on: ${nextPayDate.toDateString()}`);
            }
        }
    } catch (error) {
        console.error("Cron Job Error:", error);
    }
    console.log("--- ✅ Cron Job Finished ---");
});