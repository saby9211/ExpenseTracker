const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: messages.join(', ') });
    }

    // Mongoose duplicate key error (idempotency key collision handled in route)
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate entry detected' });
    }

    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
