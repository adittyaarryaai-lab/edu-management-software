const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all books or search books
router.get('/', protect, async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

// @desc    Add a new book (Admin/Teacher Only)
router.post('/add', protect, async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error adding book' });
    }
});

module.exports = router;