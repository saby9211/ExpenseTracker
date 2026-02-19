import { getToken } from './auth';

// Determine API base URL - hardcode for production, use proxy for local dev
const getAPIBase = () => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    // Local development - use proxy
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return '/api';
    }
    
    // Production - use absolute URL
    return 'https://expense-tracker-sri4.onrender.com/api';
};

const API_BASE = getAPIBase();

function authHeaders() {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function fetchExpenses({ category = '', sort = 'date_desc' } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);

    const url = `${API_BASE}/expenses${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url, {
        headers: authHeaders(),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch expenses (${res.status})`);
    }

    return res.json();
}

export async function createExpense({ amount, category, description, date, idempotencyKey }) {
    const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ amount, category, description, date, idempotencyKey }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create expense (${res.status})`);
    }

    return res.json();
}
