import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/superadmin/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setStats(res.data.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Super Admin Overview</h1>
            {stats && (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={cardStyle}>Admins: {stats.total_admins}</div>
                    <div style={cardStyle}>Moderators: {stats.total_moderators}</div>
                    <div style={cardStyle}>Total Users: {stats.system_users}</div>
                </div>
            )}
        </div>
    );
};

const cardStyle = { padding: '20px', background: '#3498db', color: '#fff', borderRadius: '8px' };
export default SuperAdminDashboard;