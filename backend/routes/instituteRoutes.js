const express = require('express');
const router = express.Router();
const Institute = require('../models/Institute');

router.post('/create', async (req, res) => {
    try {
        const newInst = new Institute(req.body);
        const savedInst = await newInst.save();
        res.json(savedInst);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;