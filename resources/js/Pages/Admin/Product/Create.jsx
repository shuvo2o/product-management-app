import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Create = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        description: '',
        status: 'active',
        category_id: '' 
    });
    
    const [categories, setCategories] = useState([]); 
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                const fetchedData = response.data.data || response.data;
                setCategories(Array.isArray(fetchedData) ? fetchedData : []);
            } catch (err) {
                console.error("Categories fetch failed:", err);
            }
        };
        fetchCategories();
    }, []);

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
        setLoading(true);
        
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
                alert("Something went wrong!");
            }
        } finally {
            setLoading(false);
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
                {/* Product Name */}
                <div className="col-span-2">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Product Name</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className={`w-full p-3 border outline-none rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`} 
                    />
                    {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name[0]}</p>}
                </div>

                {/* Category Dropdown */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Category</label>
                    <select 
                        name="category_id" 
                        value={formData.category_id} 
                        onChange={handleChange} 
                        className={`w-full p-3 bg-white border outline-none rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.category_id ? 'border-red-500' : 'border-gray-200'}`}
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* SKU */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" />
                </div>

                {/* Price */}
                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Price ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" />
                </div>

                {/* Stock */}
                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" />
                </div>
                <div className="col-span-2">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="4"
                        className="w-full p-3 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter product details..."
                    ></textarea>
                    {errors.description && <p className="mt-1 text-xs font-medium text-red-500">{errors.description[0]}</p>}
                </div>

                {/* Status */}
                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Product Image</label>
                    <input type="file" onChange={handleImage} className="w-full text-sm" />
                </div>

                {/* Preview Image */}
                {preview && (
                    <div className="flex justify-center col-span-2">
                        <img src={preview} className="object-cover w-24 h-24 border rounded-lg shadow-sm" alt="Preview" />
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="col-span-2 p-4 mt-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                    {loading ? "Saving..." : "Save Product"}
                </button>
            </form>
        </div>
    );
};

export default Create;