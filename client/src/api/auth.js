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

export async function register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Registration failed (${res.status})`);
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

export async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Login failed (${res.status})`);
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
