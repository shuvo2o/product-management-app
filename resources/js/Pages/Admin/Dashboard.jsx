import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState({
        stats: {
            total_products: 0,
            out_of_stock: 0,
            low_stock: 0,
            total_value: 0
        },
        recent_products: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats');
                if (res.data.status === 'success') {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Dashboard Data Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 bg-gray-50 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-black tracking-tight text-gray-800 uppercase">Dashboard Overview</h1>
                    <p className="text-sm text-gray-400">Manage your inventory and track business health.</p>
                </div>

                {/* 1. Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Products */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Products</p>
                        <h3 className="mt-2 text-3xl font-black text-gray-800">{data.stats.total_products}</h3>
                        <div className="mt-4 px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded inline-block uppercase">In Stock</div>
                    </div>

                    {/* Inventory Value */}
                    <div className="p-6 bg-white border-l-4 border-green-500 shadow-sm rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory Value</p>
                        <h3 className="mt-2 text-3xl font-black text-green-600">${data.stats.total_value}</h3>
                        <p className="mt-2 text-[10px] text-gray-400 font-medium italic">Asset Valuation</p>
                    </div>

                    {/* Out of Stock */}
                    <div className="p-6 bg-white border-l-4 border-red-500 shadow-sm rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Out of Stock</p>
                        <h3 className="mt-2 text-3xl font-black text-red-600">{data.stats.out_of_stock}</h3>
                        <p className="mt-2 text-[10px] text-red-400 font-bold animate-pulse uppercase tracking-tighter">Needs Restock</p>
                    </div>

                    {/* Low Stock */}
                    <div className="p-6 bg-white border-l-4 border-orange-400 shadow-sm rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Low Stock Alert</p>
                        <h3 className="mt-2 text-3xl font-black text-orange-500">{data.stats.low_stock}</h3>
                        <p className="mt-2 text-[10px] text-gray-400 font-medium">Items &lt; 5 units</p>
                    </div>
                </div>

                {/* 2. Recent Products Table */}
                <div className="mt-10 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div className="flex items-center justify-between p-6 border-b border-gray-50">
                        <h3 className="text-sm font-black tracking-widest text-gray-800 uppercase">Recently Added Products</h3>
                        <Link to="/admin/products" className="px-4 py-1.5 bg-gray-50 text-indigo-600 text-[10px] font-black rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase">
                            View All Inventory
                        </Link>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.recent_products.length > 0 ? data.recent_products.map((product) => (
                                    <tr key={product.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{product.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">{product.category_name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-gray-900">${product.price}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-bold ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.stock} units left
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-10 text-sm italic text-center text-gray-400">No recent products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;