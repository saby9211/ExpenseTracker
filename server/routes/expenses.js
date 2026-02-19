const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { validateExpense, handleValidationErrors } = require('../validators/expense');

// POST /api/expenses — Create a new expense
router.post('/', validateExpense, handleValidationErrors, async (req, res, next) => {
    try {
        const { amount, category, description, date, idempotencyKey } = req.body;

        // Idempotency: if a key is provided, check for existing expense
        if (idempotencyKey) {
            const existing = await Expense.findOne({ idempotencyKey });
            if (existing) {
                return res.status(200).json(existing.toJSON());
            }
        }

        const expense = new Expense({
            amount,
            category,
            description: description || '',
            date,
            idempotencyKey: idempotencyKey || undefined,
        });

        const saved = await expense.save();
        res.status(201).json(saved.toJSON());
    } catch (error) {
        // Handle race condition: if two identical idempotency keys arrive simultaneously
        if (error.code === 11000 && req.body.idempotencyKey) {
            const existing = await Expense.findOne({ idempotencyKey: req.body.idempotencyKey });
            if (existing) {
                return res.status(200).json(existing.toJSON());
            }
        }
        next(error);
    }
});

// GET /api/expenses — List expenses with optional filter/sort
router.get('/', async (req, res, next) => {
    try {
        const { category, sort } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }

        let query = Expense.find(filter);

        // Default sort: newest first
        if (sort === 'date_desc' || !sort) {
            query = query.sort({ date: -1, created_at: -1 });
        } else if (sort === 'date_asc') {
            query = query.sort({ date: 1, created_at: 1 });
        }

        const expenses = await query.exec();
        res.json(expenses.map((e) => e.toJSON()));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
