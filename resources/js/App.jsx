import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './Pages/ProductList';
import Create from './Pages/Admin/Product/Create';
import Index from './Pages/Admin/Product/Index';
import Edit from './Pages/Admin/Product/Edit';
import AdminLayout from './Layouts/AdminLayout'; 
import Dashboard from './Pages/Admin/Dashboard';
import CategoryIndex from './Pages/Admin/Category/CategoryIndex';
import CategoryCreate from './Pages/Admin/Category/CategoryCreate';
import CategoryEdit from './Pages/Admin/Category/CategoryEdit';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';

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

                {/* এডমিন রাউটস (সুরক্ষিত) */}
                <Route path="/admin/*" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Routes>
                                <Route path="products" element={<Index />} />
                                <Route path="products/create" element={<Create />} />
                                <Route path="products/edit/:id" element={<Edit />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="categories" element={<CategoryIndex />} />
                                <Route path="categories/create" element={<CategoryCreate />} />
                                <Route path="categories/edit/:id" element={<CategoryEdit />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

export default App;