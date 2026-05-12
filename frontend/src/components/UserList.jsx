import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Loader, AlertCircle, RefreshCw } from 'lucide-react';

const UserList = ({ refreshTrigger, token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        if (!token) {
            setError('Please login to view the user list.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger, token]);

    return (
        <div className="card list-card">
            <div className="card-header">
                <Users className="header-icon" />
                <h2>Registered Users</h2>
                <button onClick={fetchUsers} className="btn-icon" title="Refresh">
                    <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                </button>
            </div>

            {loading && (
                <div className="loading-state">
                    <Loader className="spinning" size={48} />
                    <p>Fetching users...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <AlertCircle size={48} />
                    <p>{error}</p>
                    <button onClick={fetchUsers} className="btn btn-outline">Try Again</button>
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <div className="empty-state">
                    <p>No users found. Add one to get started!</p>
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;
