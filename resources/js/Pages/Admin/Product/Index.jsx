import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminIndex = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = () => {
        setLoading(true);
        axios.get('/api/products')
            .then(res => {
                setProducts(res.data.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchProducts(); }, []);

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Manage Products</h2>
                <Link
                    to="/admin/products/create"  /* <--- এখানে একটি / যোগ করা হয়েছে */
                    className="px-4 py-2 text-sm text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    + Add Product
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">SKU / Slug</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="transition hover:bg-gray-50">
                                <td className="flex items-center gap-3 px-6 py-4">
                                    <img src={product.image} className="object-cover w-10 h-10 bg-gray-100 rounded-md" />
                                    <span className="font-medium text-gray-800">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div>{product.sku}</div>
                                    <div className="text-[10px] text-gray-400">{product.slug}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">${product.price}</td>
                                <td className="px-6 py-4 text-sm">{product.stock} pcs</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-3 text-center">
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-900">Edit</Link>
                                    <button onClick={() => deleteProduct(product.id)} className="text-sm font-semibold text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminIndex;