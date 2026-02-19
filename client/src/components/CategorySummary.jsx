export default function CategorySummary({ expenses }) {
  if (expenses.length === 0) return null;

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const grandTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="category-summary-card">
      <h2>Category Breakdown</h2>
      <div className="category-bars">
        {sorted.map(([category, total]) => {
          const percent = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
          return (
            <div key={category} className="category-bar-row">
              <div className="category-bar-label">
                <span className="category-tag" data-category={category}>{category}</span>
                <span className="category-bar-amount">{formatAmount(total)}</span>
              </div>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="category-bar-percent">{percent.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
