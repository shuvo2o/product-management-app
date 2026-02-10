import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModeratorDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/moderator/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setStats(res.data.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Moderator Dashboard</h1>
            {stats && (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={cardStyle}>Pending Products: {stats.pending_products}</div>
                    <div style={cardStyle}>Out of Stock: {stats.out_of_stock}</div>
                </div>
            )}
        </div>
    );
};

const cardStyle = { padding: '20px', background: '#f1c40f', color: '#000', borderRadius: '8px' };
export default ModeratorDashboard;