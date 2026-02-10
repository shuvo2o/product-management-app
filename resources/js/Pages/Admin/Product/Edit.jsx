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
        status: 'active',
        category_id: '',
        note: '' // স্টক পরিবর্তনের কারণ রাখার জন্য নতুন ফিল্ড
    });

    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    // টোকেনটি লোকাল স্টোরেজ থেকে নিয়ে আসছি
    const token = localStorage.getItem('token');

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('/api/categories', {
                        headers: { 'Authorization': `Bearer ${token}` } // টোকেন যোগ করা হলো
                    }),
                    axios.get(`/api/products/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` } // টোকেন যোগ করা হলো
                    })
                ]);

                if (isMounted) {
                    setCategories(catRes.data.data || catRes.data);
                    const p = prodRes.data.data || prodRes.data;
                    
                    if (p) {
                        setFormData({
                            name: p.name || '',
                            sku: p.sku || '',
                            price: p.price || '',
                            stock: p.stock || '',
                            description: p.description || '',
                            status: p.status || 'active',
                            category_id: p.category_id || '',
                            note: '' // আপডেট করার সময় ডিফল্ট খালি থাকবে
                        });
                        
                        if (p.image) {
                            const imageUrl = p.image.startsWith('http') 
                                ? p.image 
                                : `http://127.0.0.1:8000/storage/${p.image}`;
                            setPreview(imageUrl);
                        }
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Fetch Error:", err);
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [id, token]);

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
        data.append('name', formData.name);
        data.append('sku', formData.sku);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        data.append('category_id', formData.category_id);
        data.append('status', formData.status);
        data.append('note', formData.note); // Note ডাটাবেজে পাঠানোর জন্য যোগ করা হলো

        if (image) {
            data.append('image', image);
        }

        try {
            const response = await axios.post(`/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // এখানে টোকেনটি সবথেকে গুরুত্বপূর্ণ
                }
            });

            if(response.data.status === 'success' || response.data.message) {
                alert("Product and Stock History Updated!");
                navigate('/admin/products');
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else if (err.response?.status === 401) {
                alert("Session expired! Please login again.");
            } else {
                alert("Update failed! Please check console.");
            }
        }
    };

    if (loading) return <div className="p-10 font-bold text-center text-indigo-600">Loading Product Data...</div>;

    return (
        <div className="max-w-4xl p-8 mx-auto mt-10 bg-white border border-gray-100 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">Edit Product</h2>
                <Link to="/admin/products" className="px-4 py-2 text-sm font-bold text-indigo-600 rounded-lg bg-indigo-50">← Back</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">SKU</label>
                        <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock[0]}</p>}
                    </div>

                    {/* নতুন নোট ফিল্ড: স্টক হিস্টোরিতে কি কারণ দেখাবে */}
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Stock Update Note (Optional)</label>
                        <input name="note" value={formData.note} onChange={handleChange} placeholder="e.g., Damaged item or Restock" className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-white border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="col-span-2 p-6 border-2 border-gray-200 border-dashed bg-gray-50 rounded-2xl">
                        <label className="block mb-3 text-sm font-bold text-gray-700">Product Image</label>
                        <div className="flex items-center gap-6">
                            <input type="file" onChange={handleImage} className="text-sm text-gray-500 cursor-pointer" />
                            {preview && <img src={preview} className="object-cover w-20 h-20 rounded-lg shadow-md" alt="Preview" />}
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full p-4 font-extrabold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg active:scale-[0.98] transition-all">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default Edit;