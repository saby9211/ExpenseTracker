import { useState } from 'react';
import { register, login } from '../api/auth';

function AuthPage({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = isLogin
                ? await login(email, password)
                : await register(name, email, password);
            onAuthSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" />
            <div className="auth-card">
                <div className="auth-logo">💰</div>
                <h1 className="auth-title">Expense Tracker</h1>
                <p className="auth-subtitle">
                    {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account'}
                </p>

                {error && (
                    <div className="message error-message auth-error">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder={isLogin ? 'Your password' : 'Min 6 characters'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn-submit btn-auth" disabled={loading}>
                        {loading ? (
                            <><span className="spinner"></span> Please wait...</>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" className="btn-toggle" onClick={toggleMode}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthPage;
