import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseFilter from './components/ExpenseFilter';
import CategorySummary from './components/CategorySummary';
import AuthPage from './components/AuthPage';
import { fetchExpenses } from './api/expenses';
import { getStoredUser, logout as logoutUser } from './api/auth';

function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('date_desc');

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExpenses({ category, sort });
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, loadExpenses]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setExpenses([]);
    setError('');
  };

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Expense Tracker</h1>
          <p className="header-subtitle">Track, manage, and understand your spending</p>
        </div>
        <div className="header-user">
          <span className="user-name">{user.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          <section className="left-panel">
            <ExpenseForm onExpenseAdded={loadExpenses} />
            <CategorySummary expenses={expenses} />
          </section>

          <section className="right-panel">
            <ExpenseFilter
              category={category}
              sort={sort}
              onCategoryChange={setCategory}
              onSortChange={setSort}
            />
            {error && (
              <div className="message error-message global-error">
                {error}
                <button className="btn-retry" onClick={loadExpenses}>Retry</button>
              </div>
            )}
            <ExpenseList expenses={expenses} loading={loading} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
