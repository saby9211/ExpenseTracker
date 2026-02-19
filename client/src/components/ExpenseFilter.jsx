const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

export default function ExpenseFilter({ category, sort, onCategoryChange, onSortChange }) {
  return (
    <div className="expense-filter">
      <div className="filter-group">
        <label htmlFor="filter-category">Filter by Category</label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-sort">Sort by Date</label>
        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
