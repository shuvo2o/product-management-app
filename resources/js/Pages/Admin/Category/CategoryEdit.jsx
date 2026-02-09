import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoryEdit = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/categories/${id}`).then(res => setName(res.data.data.name));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/categories/${id}`, { name });
            Swal.fire('Updated', 'Category name changed', 'success');
            navigate('/admin/categories');
        } catch (err) {
            Swal.fire('Error', 'Failed to update', 'error');
        }
    };

    return (
        <div className="max-w-xl p-8 mx-auto">
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h2 className="mb-6 text-xl font-black text-gray-800 uppercase">Edit Category</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Category Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            className="w-full p-3 mt-2 border border-gray-100 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <button className="w-full py-3 font-bold text-white transition-all bg-green-600 shadow-lg rounded-xl hover:bg-green-700">Update Category</button>
                </form>
            </div>
        </div>
    );
};

export default CategoryEdit;