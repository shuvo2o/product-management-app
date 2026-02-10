import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ১. লোকাল স্টোরেজ থেকে ইউজারের রোল গেট করা
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out from your account!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            borderRadius: '15px'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.post('http://localhost:8000/api/logout', {}, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json'
                        }
                    });
                } catch (error) {
                    console.error("Logout API Error:", error);
                } finally {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('user');

                    Swal.fire({
                        title: 'Logged Out!',
                        text: 'Redirecting to login page...',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                }
            }
        });
    };

    // ২. মেনু আইটেমগুলোকে রোল অনুযায়ী ফিল্টার করা
    const allMenuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', roles: ['superadmin', 'admin', 'moderator', 'user'] },
        { name: 'Categories', path: '/admin/categories', icon: '📂', roles: ['superadmin'] },
        { name: 'Products List', path: '/admin/products', icon: '📦', roles: ['superadmin'] },
        { name: 'Add New Product', path: '/admin/products/create', icon: '➕', roles: ['superadmin'] },
        { name: 'Users Management', path: '/admin/users', icon: '👥', roles: ['superadmin'] }, 
        { name: 'Stock History', path: '/admin/stock-history', icon: '📜', roles: ['superadmin'] }, 
    ];

    // শুধুমাত্র সেই মেনুগুলো ফিল্টার করা হচ্ছে যেগুলোতে ইউজারের পারমিশন আছে
    const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentMenuItem = menuItems.find(item => location.pathname === item.path) || 
                          menuItems.find(item => location.pathname.startsWith(item.path + '/'));

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="flex-col hidden w-64 text-white shrink-0 bg-slate-900 md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-indigo-400">ADMIN <span className="text-white">HUB</span></h1>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2">
                    <p className="px-2 mb-4 text-xs font-bold tracking-widest uppercase text-slate-500">Main Menu</p>

                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full gap-3 px-4 py-3 text-red-400 transition hover:bg-red-900/20 rounded-xl"
                    >
                        <span>🚪</span>
                        <span className="text-sm font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            <div className="flex flex-col flex-1">
                <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-700 uppercase">
                        {currentMenuItem?.name || 'Admin Panel'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold leading-none text-gray-800">{user.name || 'Your Name'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{userRole || 'Administrator'}</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-full">
                            {user.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;