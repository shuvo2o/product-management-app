import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [products, setProducts] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        PRODUCT <span className="text-indigo-600">HUB</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Manage your inventory details with ease</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name, SKU or slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <div className="absolute right-3 top-3.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Fetching inventory data...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
                                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">No Image Available</div>
                                        )}

                                        {/* Status Badge */}
                                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-indigo-600 text-[10px] font-bold tracking-widest uppercase bg-indigo-50 px-2 py-0.5 rounded">
                                                {product.category}
                                            </span>
                                            <span className="text-gray-400 text-[10px] font-mono bg-gray-50 px-2 py-0.5 rounded">
                                                SKU: {product.sku}
                                            </span>
                                        </div>

                                        <h2 className="font-bold text-gray-800 text-lg leading-tight mb-1 truncate" title={product.name}>
                                            {product.name}
                                        </h2>
                                        <p className="text-gray-400 text-[10px] mb-3 truncate italic bg-gray-50 p-1 rounded">
                                            Slug: {product.slug}
                                        </p>

                                        {/* Description */}
                                        <p className="text-gray-500 text-xs mb-5 line-clamp-3 leading-relaxed">
                                            {product.description || 'No detailed description provided for this product.'}
                                        </p>

                                        {/* Price & Stock */}
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
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
                            <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-lg font-medium">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Section */}
                    <div className="flex flex-wrap justify-center mt-16 gap-3 pb-10">
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