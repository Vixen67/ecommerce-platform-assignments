import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import axios from 'axios';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoginView, setIsLoginView] = useState(!token);

    const handleUserAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await axios.post('http://localhost:5000/api/login', loginData);
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsLoginView(false);
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoginView(true);
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <ShieldCheck size={32} color="#6366f1" />
                    <h1>AuthSystem</h1>
                </div>
                <div className="nav-actions">
                    {user ? (
                        <div className="user-info">
                            <span>Welcome, <strong>{user.name}</strong></span>
                            <button onClick={handleLogout} className="btn-logout">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsLoginView(true)} className="btn-login">
                            <LogIn size={18} /> Login
                        </button>
                    )}
                </div>
            </nav>

            <main className="main-content">
                <div className="grid-container">
                    <div className="column">
                        <UserForm onUserAdded={handleUserAdded} />
                    </div>
                    <div className="column">
                        {isLoginView && !token ? (
                            <div className="card login-card">
                                <div className="card-header">
                                    <LogIn className="header-icon" />
                                    <h2>Admin Login</h2>
                                </div>
                                <p className="hint">Log in to view and manage the user list.</p>
                                <form onSubmit={handleLogin}>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            placeholder="Admin Email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {loginError && <p className="error-text">{loginError}</p>}
                                    <button type="submit" className="btn btn-secondary">Login to Dashboard</button>
                                </form>
                            </div>
                        ) : (
                            <UserList refreshTrigger={refreshTrigger} token={token} />
                        )}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; 2026 User Management System | Assignment 3</p>
            </footer>
        </div>
    );
}

export default App;
