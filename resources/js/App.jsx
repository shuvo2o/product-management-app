import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// আপনার আগের সব ইম্পোর্ট
import ProductList from './Pages/ProductList'; // এই ইম্পোর্টটি নিশ্চিত করুন
import Create from './Pages/Admin/Product/Create';
import Index from './Pages/Admin/Product/Index';
import Edit from './Pages/Admin/Product/Edit';
import AdminLayout from './Layouts/AdminLayout'; 
import Dashboard from './Pages/Admin/Dashboard'; // এটি আপনার বর্তমান এডমিন ড্যাশবোর্ড
import CategoryIndex from './Pages/Admin/Category/CategoryIndex';
import CategoryCreate from './Pages/Admin/Category/CategoryCreate';
import CategoryEdit from './Pages/Admin/Category/CategoryEdit';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import UsersManagement from './Pages/Admin/UsersManagement'; 
import StockHistory from './Pages/Admin/StockHistory';

// নতুন ড্যাশবোর্ড পেজগুলো ইম্পোর্ট করুন
import SuperAdminDashboard from './Pages/Dashboards/SuperAdminDashboard';
import ModeratorDashboard from './Pages/Dashboards/ModeratorDashboard';
import UserDashboard from './Pages/Dashboards/UserDashboard';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                {/* পাবলিক রাউটস */}
                <Route path="/" element={<ProductList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* সুরক্ষিত ড্যাশবোর্ড রাউটস - আপনার আগের সব এডমিন রাউট এখানে আছে */}
                <Route path="/*" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Routes>
                                {/* আপনার আগের সব এডমিন রাউট */}
                                <Route path="admin/dashboard" element={<Dashboard />} />
                                <Route path="admin/products" element={<Index />} />
                                <Route path="admin/products/create" element={<Create />} />
                                <Route path="admin/products/edit/:id" element={<Edit />} />
                                <Route path="admin/categories" element={<CategoryIndex />} />
                                <Route path="admin/categories/create" element={<CategoryCreate />} />
                                <Route path="admin/categories/edit/:id" element={<CategoryEdit />} />
                                <Route path="admin/users" element={<UsersManagement />} />
                                <Route path="admin/stock-history" element={<StockHistory />} />

                                {/* নতুন ড্যাশবোর্ড রাউটগুলো */}
                                <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
                                <Route path="moderator/dashboard" element={<ModeratorDashboard />} />
                                <Route path="dashboard" element={<UserDashboard />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                {/* ভুল পাথে গেলে হোমপেজে নিয়ে যাবে */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

export default App;