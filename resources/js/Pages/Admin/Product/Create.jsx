import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Create = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        description: '',
        status: 'active'
    });
    
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            await axios.post('/api/products', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json' 
                }
            });
            alert("Product Created Successfully!");
            navigate('/admin/products');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err.response?.data);
                alert("Something went wrong!");
            }
        }
    };

    return (
        <div className="max-w-4xl p-8 mx-auto mt-10 bg-white border border-gray-100 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                <Link to="/admin/products" className="font-semibold text-indigo-600 transition hover:text-indigo-800">
                    ← Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Product Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    {errors.name && <span className="text-xs text-red-500">{errors.name[0]}</span>}
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                    {errors.sku && <span className="text-xs text-red-500">{errors.sku[0]}</span>}
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Price ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                </div>

                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" required />
                </div>

                <div className="col-span-2">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" rows="3"></textarea>
                </div>

                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Product Image</label>
                    <input type="file" onChange={handleImage} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>

                <div className="flex items-center justify-center col-span-1">
                    {preview && <img src={preview} className="object-cover w-24 h-24 border-2 border-indigo-100 rounded-lg shadow-md" alt="Preview" />}
                </div>

                <button type="submit" className="col-span-2 p-4 mt-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                    Save Product
                </button>
            </form>
        </div>
    );
};

export default Create;