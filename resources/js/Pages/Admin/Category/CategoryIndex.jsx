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
                                <td className="flex justify-center gap-4 px-6 py-4">
                                    {/* Edit Button - Pencil Icon */}
                                    <Link
                                        to={`/admin/categories/edit/${cat.id}`}
                                        className="p-2 text-indigo-600 transition-all duration-200 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white"
                                        title="Edit Category"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Link>

                                    {/* Delete Button - Trash Icon */}
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-red-600 transition-all duration-200 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white"
                                        title="Delete Category"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
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