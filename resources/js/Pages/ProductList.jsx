import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";

const App = () => {
    const [products, setProducts] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // --- AUTH LOGIC START ---
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) setUser(savedUser);
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload(); 
    };
    // --- AUTH LOGIC END ---

    const fetchProducts = (url = '/api/products') => {
        setLoading(true);
        let fetchUrl = url;
        if (search && url === '/api/products') {
            fetchUrl = `/api/products?search=${search}`;
        }

        axios.get(fetchUrl)
            .then(res => {
                setProducts(res.data.data);
                setLinks(res.data.meta.links);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div className="min-h-screen p-6 mx-auto max-w-7xl bg-gray-50">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-between gap-4 mb-10 md:flex-row">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">
                        PRODUCT <span className="text-indigo-600">HUB</span>
                    </h1>
                    <p className="text-sm text-gray-500">Manage your inventory details with ease</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name, SKU or slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-3 pl-4 pr-10 transition-all border border-gray-200 shadow-sm outline-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute right-3 top-3.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* --- REACT ICON PROFILE SECTION --- */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3 p-1.5 pr-3">
                            {/* Profile Icon with Dynamic Link */}
                            <a 
                                href={
                                    user.role === 'superadmin' ? '/super-admin/dashboard' :
                                    user.role === 'admin' ? '/admin/dashboard' :
                                    user.role === 'moderator' ? '/moderator/dashboard' : '/user/dashboard'
                                }
                                title={`Welcome ${user.name}! Click for Dashboard`}
                                className="text-indigo-600 transition-transform duration-200 hover:scale-110"
                            >
                                <FaUserCircle size={30} />
                            </a>

                     
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <a href="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                                Login
                            </a>
                            <a href="/register" className="hidden sm:block px-5 py-2.5 text-sm font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md">
                                Register
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 mb-4 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 animate-pulse">Fetching inventory data...</p>
                </div>
            ) : (
                <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl group">
                                    <div className="relative overflow-hidden bg-gray-100 h-44">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs italic text-gray-400">No Image Available</div>
                                        )}
                                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col p-5 grow">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-indigo-600 text-[10px] font-bold tracking-widest uppercase bg-indigo-50 px-2 py-0.5 rounded">
                                                {product.category}
                                            </span>
                                            <span className="text-gray-400 text-[10px] font-mono bg-gray-50 px-2 py-0.5 rounded">
                                                SKU: {product.sku}
                                            </span>
                                        </div>
                                        <h2 className="mb-1 text-lg font-bold leading-tight text-gray-800 truncate" title={product.name}>
                                            {product.name}
                                        </h2>
                                        <p className="text-gray-400 text-[10px] mb-3 truncate italic bg-gray-50 p-1 rounded">
                                            Slug: {product.slug}
                                        </p>
                                        <p className="mb-5 text-xs leading-relaxed text-gray-500 line-clamp-3">
                                            {product.description || 'No detailed description provided for this product.'}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50">
                                            <div>
                                                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Current Price</p>
                                                <p className="text-2xl font-black text-gray-900">${product.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Availability</p>
                                                <p className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    {product.stock} Units
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center bg-white border-2 border-gray-200 border-dashed col-span-full rounded-3xl">
                                <p className="text-lg font-medium text-gray-400">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap justify-center gap-3 pb-10 mt-16">
                        {links && links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url || link.active}
                                onClick={() => fetchProducts(link.url)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${link.active
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                        : 'bg-white text-gray-600 hover:bg-indigo-50 border-gray-200'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;