export default function ExpenseList({ expenses, loading }) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="expense-list-card">
        <div className="loading-state">
          <span className="spinner large"></span>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-card">
      <div className="list-header">
        <h2>Expenses</h2>
        <div className="total-badge">
          Total: {formatAmount(total)}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add one above!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="date-cell">{formatDate(expense.date)}</td>
                  <td>
                    <span className="category-tag" data-category={expense.category}>{expense.category}</span>
                  </td>
                  <td className="desc-cell">{expense.description || '—'}</td>
                  <td className="amount-cell">{formatAmount(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
