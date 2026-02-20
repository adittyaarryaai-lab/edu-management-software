const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const { search } = req.query;
        let query = { schoolId: req.user.schoolId }; // FIXED: Base isolation
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

router.post('/add', protect, async (req, res) => {
    try {
        const newBook = await Book.create({
            ...req.body,
            schoolId: req.user.schoolId // FIXED
        });
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error adding book' });
    }
});

router.get('/ebooks', protect, async (req, res) => {
    try {
        const ebooks = await Book.find({ 
            isDigital: true,
            schoolId: req.user.schoolId // FIXED
        }).sort({ createdAt: -1 });
        res.json(ebooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching digital material' });
    }
});

module.exports = router;