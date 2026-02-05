import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    // ১. প্রোডাক্ট ডাটা লোড করা
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        axios.get(`/api/products/${id}`, {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (isMounted) {
                const p = res.data.data;
                if (p) {
                    setFormData({
                        name: p.name || '',
                        sku: p.sku || '',
                        price: p.price || '',
                        stock: p.stock || '',
                        description: p.description || '',
                        status: p.status || 'active'
                    });
                    if (p.image) setPreview(p.image);
                }
                setLoading(false);
            }
        })
        .catch(err => {
            if (isMounted) {
                console.error("Fetch Error:", err.response);
                setLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [id]);

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

    // ২. আপডেট সাবমিট করা
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        // ইমেজ সহ ডাটা পাঠাতে FormData ব্যবহার করতে হয়
        const data = new FormData();
        data.append('name', formData.name);
        data.append('sku', formData.sku);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        data.append('status', formData.status);
        
        if (image) {
            data.append('image', image);
        }
        
        /**
         * গুরুত্বপূর্ণ: লারাভেলে ফাইল আপলোড করার সময় PUT কাজ করে না। 
         * তাই POST রিকোয়েস্ট পাঠিয়ে মেথড স্পুফিং (_method: PUT) করতে হয়।
         */
        data.append('_method', 'PUT');

        try {
            await axios.post(`/api/products/${id}`, data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            alert("Success! Product Updated.");
            navigate('/admin/products');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Update Error:", err.response);
                alert("Update failed! Please check console.");
            }
        }
    };

    if (loading) return <div className="p-10 font-bold text-center text-indigo-600">Loading Product Data...</div>;

    return (
        <div className="max-w-4xl p-8 mx-auto bg-white border border-gray-100 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">Edit Product</h2>
                <Link to="/admin/products" className="px-4 py-2 text-sm font-bold text-indigo-600 transition rounded-lg bg-indigo-50 hover:bg-indigo-100">
                    ← Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 transition border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        {errors.name && <span className="block mt-1 text-sm font-medium text-red-500">{errors.name[0]}</span>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">SKU</label>
                        <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        {errors.sku && <span className="block mt-1 text-sm font-medium text-red-500">{errors.sku[0]}</span>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" rows="3"></textarea>
                    </div>

                    <div className="col-span-2 p-6 border border-gray-300 border-dashed bg-gray-50 rounded-2xl">
                        <label className="block mb-3 text-sm font-bold text-gray-700">Product Image</label>
                        <div className="flex items-center gap-6">
                            <input type="file" onChange={handleImage} className="text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
                            {preview && (
                                <div className="relative">
                                    <img src={preview} className="object-cover w-24 h-24 border-2 border-white rounded-lg shadow-md" alt="preview" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full p-4 mt-4 font-extrabold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                    Update Product Information
                </button>
            </form>
        </div>
    );
};

export default Edit;