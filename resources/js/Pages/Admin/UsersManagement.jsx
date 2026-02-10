import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // পেন্ডিং ইউজারদের লিস্ট নিয়ে আসা
    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/pending-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // ইউজার এপ্রুভ করার ফাংশন
    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve User?',
            text: "This user will gain access to the system.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            confirmButtonText: 'Yes, Approve!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.post(`http://localhost:8000/api/approve-user/${id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    Swal.fire('Approved!', 'User has been approved.', 'success');
                    fetchPendingUsers(); 
                } catch (err) {
                    Swal.fire('Error', 'Something went wrong!', 'error');
                }
            }
        });
    };

    // ইউজার ডিলিট করার ফাংশন
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:8000/api/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    Swal.fire('Deleted!', 'User has been removed.', 'success');
                    fetchPendingUsers(); 
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete user!', 'error');
                }
            }
        });
    };

    if (loading) {
        return <div className="p-6 text-center">Loading users...</div>;
    }

    return (
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Pending Approval Requests</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-sm text-gray-400 uppercase border-b border-gray-100">
                            <th className="px-2 py-4">Name</th>
                            <th className="px-2 py-4">Email</th>
                            <th className="px-2 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user.id} className="transition border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-2 py-4 font-medium text-gray-700">{user.name}</td>
                                <td className="px-2 py-4 text-gray-600">{user.email}</td>
                                <td className="flex justify-center gap-2 px-2 py-4">
                                    <button 
                                        onClick={() => handleApprove(user.id)}
                                        className="px-4 py-2 font-bold text-green-700 transition bg-green-100 rounded-lg hover:bg-green-200"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="px-4 py-2 font-bold text-red-700 transition bg-red-100 rounded-lg hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="py-10 text-center text-gray-400">No pending requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;