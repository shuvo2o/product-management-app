import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/user/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setStats(res.data.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>My Dashboard</h1>
            {stats && (
                <div style={{ padding: '20px', background: '#ecf0f1', borderRadius: '8px' }}>
                    <h3>Welcome, {stats.name}</h3>
                    <p>Status: <strong>{stats.account_status}</strong></p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;