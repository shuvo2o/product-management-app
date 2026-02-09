import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoryIndex = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`/api/categories/${id}`);
                Swal.fire('Deleted!', 'Category removed.', 'success');
                fetchCategories();
            }
        });
    };

    if (loading) return <div className="p-10 font-bold text-center">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black tracking-tight text-gray-800 uppercase">Categories</h2>
                <Link to="/admin/categories/create" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 transition-all">+ New Category</Link>
            </div>
            
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map(cat => (
                            <tr key={cat.id} className="transition-all hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-700">{cat.name}</td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{cat.slug}</td>
                                <td className="flex justify-center gap-3 px-6 py-4">
                                    <Link to={`/admin/categories/edit/${cat.id}`} className="text-indigo-500 hover:text-indigo-700">Edit</Link>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryIndex;