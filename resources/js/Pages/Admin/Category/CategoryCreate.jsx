import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoryCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        
        try {
            const res = await axios.post('/api/categories', { name });
            
            if (res.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Created!',
                    text: res.data.message || 'Category Created Successfully',
                    timer: 2000
                });
                navigate('/admin/categories');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl p-8 mx-auto">
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h2 className="mb-6 text-xl font-black tracking-tight text-gray-800 uppercase">Add New Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Category Name</label>
                        <input 
                            type="text" 
                            value={name}
                            className="w-full p-3 mt-2 transition-all border border-gray-100 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Electronics"
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className={`w-full py-3 font-bold text-white transition-all shadow-lg rounded-xl ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Creating...' : 'Create Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryCreate;