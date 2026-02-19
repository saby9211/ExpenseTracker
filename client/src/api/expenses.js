const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchExpenses({ category = '', sort = 'date_desc' } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);

    const url = `${API_BASE}/expenses${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch expenses (${res.status})`);
    }

    return res.json();
}

export async function createExpense({ amount, category, description, date, idempotencyKey }) {
    const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, description, date, idempotencyKey }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create expense (${res.status})`);
    }

    return res.json();
}
