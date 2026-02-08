import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_products: 0,
        out_of_stock: 0,
        low_stock: 0,
        total_value: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats');
                if (res.data.status === 'success') {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Stats Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 font-bold text-center text-indigo-600 animate-pulse">Loading Analytics...</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-2xl font-black tracking-tight text-gray-800 uppercase">Business Overview</h1>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Products */}
                    <div className="flex flex-col justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Total Products</p>
                            <h3 className="mt-2 text-3xl font-black text-gray-800">{stats.total_products}</h3>
                        </div>
                        <div className="mt-4 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block w-fit">Active in Catalog</div>
                    </div>

                    {/* Total Value */}
                    <div className="p-6 bg-white border border-l-4 border-gray-100 shadow-sm rounded-2xl border-l-green-500">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Inventory Value</p>
                        <h3 className="mt-2 text-3xl font-black text-green-600">${stats.total_value}</h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Estimated Market Price</p>
                    </div>

                    {/* Out of Stock */}
                    <div className="p-6 bg-white border border-l-4 border-gray-100 shadow-sm rounded-2xl border-l-red-500">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Out of Stock</p>
                        <h3 className="mt-2 text-3xl font-black text-red-600">{stats.out_of_stock}</h3>
                        <p className="text-[10px] text-red-400 mt-2 font-bold animate-pulse uppercase">Restock Needed</p>
                    </div>

                    {/* Low Stock */}
                    <div className="p-6 bg-white border border-l-4 border-gray-100 shadow-sm rounded-2xl border-l-orange-400">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Low Stock Alert</p>
                        <h3 className="mt-2 text-3xl font-black text-orange-500">{stats.low_stock}</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-medium italic">Items under 5 units</p>
                    </div>
                </div>

                {/* Future Chart Section */}
                <div className="p-20 mt-10 text-sm font-bold tracking-widest text-center text-gray-400 uppercase border-2 border-gray-200 border-dashed rounded-3xl">
                    Sales & Stock Charts Coming Soon
                </div>
            </div>
        </div>
    );
};

export default Dashboard;