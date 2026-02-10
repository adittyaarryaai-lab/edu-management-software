const PLANS = {
    free: {
        studentLimit: 50,
        staffLimit: 5,
        features: ['attendance', 'notices'],
    },
    pro: {
        studentLimit: 500,
        staffLimit: 50,
        features: ['attendance', 'notices', 'finance', 'exams', 'homework'],
    },
    enterprise: {
        studentLimit: 5000,
        staffLimit: 500,
        features: ['all'],
    }
};

module.exports = PLANS;