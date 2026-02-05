import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // মেনু আইটেমগুলো এখানে ডিফাইন করা যাতে সহজে ম্যানেজ করা যায়
    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Products List', path: '/admin/products', icon: '📦' },
        { name: 'Add New Product', path: '/admin/products/create', icon: '➕' },
        { name: 'Categories', path: '/admin/categories', icon: '📂' },
        { name: 'Users Management', path: '/admin/users', icon: '👥' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <aside className="flex-col flex-shrink-0 hidden w-64 text-white bg-slate-900 md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-indigo-400">ADMIN <span className="text-white">HUB</span></h1>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2">
                    <p className="px-2 mb-4 text-xs font-bold tracking-widest uppercase text-slate-500">Main Menu</p>

                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}

                    <div className="pt-10">
                        <p className="px-2 mb-4 text-xs font-bold tracking-widest uppercase text-slate-500">System</p>
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                            <span>🌐</span>
                            <span>Visit Public Site</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center w-full gap-3 px-4 py-3 text-red-400 transition hover:bg-red-900/20 rounded-xl">
                        <span>🚪</span>
                        <span className="text-sm font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Header / Navbar */}
                <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-700 uppercase">
                        {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold leading-none text-gray-800">Your Name</p>
                            <p className="text-[10px] text-gray-400 font-bold">Administrator</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-full">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;