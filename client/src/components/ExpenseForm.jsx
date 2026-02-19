import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns'; 
import 'react-datepicker/dist/react-datepicker.css';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

// Helper for year range: 10 years back to current year
const years = Array.from({ length: 11 }, (_, i) => getYear(new Date()) - 10 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return 'Amount must be a positive number';
    }
    if (!formData.category) {
      return 'Please select a category';
    }
    if (!formData.date) {
      return 'Date is required';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { createExpense } = await import('../api/expenses.js');
      await createExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date.toISOString().split('T')[0],
        idempotencyKey: uuidv4(),
      });

      setSuccess('Expense added successfully!');
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date(),
      });

      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      setError(err.message || 'Failed to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="expense-form-card">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={submitting}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="What was this expense for?"
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd MMM yyyy"
              maxDate={new Date()}
              disabled={submitting}
              className="datepicker-input"
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="custom-datepicker-header">
                  {/* High-level Date Display */}
                  <div className="header-selection-display">
                    <span className="header-year">{getYear(date)}</span>
                    <h3 className="header-full-date">
                      {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </h3>
                  </div>

                  {/* Navigation Controls */}
                  <div className="header-controls">
                    <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="nav-btn">
                      &lt;
                    </button>
                    
                    <div className="select-group">
                      <select
                        value={getYear(date)}
                        onChange={({ target: { value } }) => changeYear(value)}
                      >
                        {years.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>

                      <select
                        value={months[getMonth(date)]}
                        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                      >
                        {months.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="nav-btn">
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? (
            <><span className="spinner"></span> Adding...</>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>
    </div>
  );
}