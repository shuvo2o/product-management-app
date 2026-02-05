import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './Pages/ProductList';
import Create from './Pages/Admin/Product/Create';
import Index from './Pages/Admin/Product/Index';
import Edit from './Pages/Admin/Product/Edit';
import AdminLayout from './Layouts/AdminLayout'; 

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/admin/*" element={
                    <AdminLayout>
                        <Routes>
                            <Route path="products" element={<Index />} />
                            <Route path="/products/create" element={<Create />} />
                            <Route path="products/edit/:id" element={<Edit />} />
                        </Routes>
                    </AdminLayout>
                } />
            </Routes>
        </div>
    );
};

export default App;