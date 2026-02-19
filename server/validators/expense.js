const { body, validationResult } = require('express-validator');

const validateExpense = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category must be a string')
        .trim(),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .trim(),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date'),
    body('idempotencyKey')
        .optional()
        .isString(),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg);
        return res.status(400).json({ error: messages.join(', ') });
    }
    next();
};

module.exports = { validateExpense, handleValidationErrors };
