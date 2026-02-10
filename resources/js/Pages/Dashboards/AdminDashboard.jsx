import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setStats(res.data.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {stats && (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={cardStyle}>Pending Approvals: {stats.pending_users}</div>
                    <div style={cardStyle}>Low Stock Items: {stats.low_stock_items}</div>
                </div>
            )}
        </div>
    );
};

const cardStyle = { padding: '20px', background: '#2ecc71', color: '#fff', borderRadius: '8px' };
export default AdminDashboard;