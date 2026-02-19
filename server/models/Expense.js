const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: mongoose.Types.Decimal128,
            required: [true, 'Amount is required'],
            validate: {
                validator: function (v) {
                    return parseFloat(v.toString()) > 0;
                },
                message: 'Amount must be greater than 0',
            },
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                // Convert Decimal128 to a number for JSON responses
                ret.amount = parseFloat(ret.amount.toString());
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

module.exports = mongoose.model('Expense', expenseSchema);
