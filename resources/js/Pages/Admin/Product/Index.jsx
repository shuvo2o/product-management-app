import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminIndex = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products?page=${page}`);
            if (res.data.status === 'success') {
                setProducts(res.data.data);
                setPagination(res.data.meta);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/products/${id}`);
                    Swal.fire('Deleted!', 'Success', 'success');
                    fetchProducts(pagination.current_page);
                } catch (err) {
                    Swal.fire('Error!', 'Failed', 'error');
                }
            }
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-10 h-10 border-t-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 overflow-x-hidden bg-gray-50 md:p-6 lg:p-8">
            <div className="flex flex-col mx-auto overflow-hidden bg-white border border-gray-200 shadow-sm max-w-7xl rounded-2xl">

                {/* Header */}
                <div className="flex flex-col items-center justify-between gap-4 p-5 border-b border-gray-100 sm:flex-row">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-800">Inventory Management</h2>
                        <p className="text-xs font-medium text-gray-400">Total: {pagination.total} Products</p>
                    </div>
                    <Link
                        to="/admin/products/create"
                        className="w-full sm:w-auto px-5 py-2.5 text-center text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        + Add Product
                    </Link>
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-collapse table-auto min-w-1000px">
                        <thead className="text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4">Product Info</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">SKU / Slug</th>
                                <th className="px-6 py-4">Price & Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="transition-colors hover:bg-indigo-50/20">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/150'}
                                                    className="object-cover w-10 h-10 rounded-lg shadow-sm"
                                                    alt={product.name}
                                                />
                                                <div className="text-sm font-bold text-gray-700 truncate max-w-150px">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase bg-indigo-100 text-indigo-600 rounded">
                                                {product.category_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-500 line-clamp-2 max-w-[200px]" title={product.description}>
                                                {product.description || <span className="italic text-gray-300">No description</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs leading-none text-gray-400">{product.sku}</div>
                                            <div className="text-[11px] text-gray-300 italic truncate mt-1 max-w-[100px]">{product.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-black text-gray-900">${product.price}</div>
                                            <div className={`text-[10px] font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>{product.stock} in stock</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`/admin/products/edit/${product.id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md border border-indigo-100 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </Link>
                                                <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-red-500 hover:bg-red-500 hover:text-white rounded-md border border-red-100 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="p-12 italic text-center text-gray-400">Empty.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {pagination.current_page} / {pagination.last_page}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => fetchProducts(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className="px-4 py-2 text-[10px] font-black bg-white border border-gray-200 rounded-lg hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
                        >
                            PREV
                        </button>
                        <button
                            onClick={() => fetchProducts(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-4 py-2 text-[10px] font-black bg-white border border-gray-200 rounded-lg hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminIndex;