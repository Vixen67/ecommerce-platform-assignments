import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const UserForm = ({ onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/users', formData);
            setMessage({ type: 'success', text: 'User added successfully!' });
            setFormData({ name: '', email: '', password: '' });
            if (onUserAdded) onUserAdded();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add user. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card form-card">
            <div className="card-header">
                <UserPlus className="header-icon" />
                <h2>Add New User</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label><User size={18} /> Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                    />
                </div>
                <div className="input-group">
                    <label><Mail size={18} /> Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                    />
                </div>
                <div className="input-group">
                    <label><Lock size={18} /> Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="loader-small"></span> : 'Register User'}
                </button>
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserForm;
