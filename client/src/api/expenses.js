import { getToken } from './auth';

// Determine API base URL
let API_BASE = import.meta.env.VITE_API_URL;

// If not set by environment variable, detect based on hostname
if (!API_BASE) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE = '/api'; // Use proxy for local development
    } else {
        // Production deployment
        API_BASE = 'https://expense-tracker-sri4.onrender.com/api';
    }
}

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
