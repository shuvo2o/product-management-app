import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaBolt, FaShieldAlt, FaArrowLeft, FaTruck, FaRegCheckCircle } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';

const Checkout = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(location.state?.product || null); 
    const [loading, setLoading] = useState(!product);

    useEffect(() => {
        if (!product) {
            axios.get(`/api/products/${id}`)
                .then(res => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching product:", err);
                    setLoading(false);
                });
        }
    }, [id, product]);

    const handlePaymentInitiate = async () => {
        // পেমেন্ট শুরু হওয়ার সময় প্রফেশনাল লোডিং দেখানো [cite: 2026-02-15]
        Swal.fire({
            title: 'Processing Order...',
            text: 'Please wait while we redirect you to the payment gateway.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // আপনার পেমেন্ট ইনিশিয়েট করার মেইন রিকোয়েস্ট [cite: 2026-02-15]
            const response = await axios.post(`/api/payment/initiate`, { 
                productId: product.id,
                amount: product.price,
                phone: "01700000000", 
                address: "Dhaka, Bangladesh" 
            });

            if (response.data && response.data.status === 'success' && response.data.url) {
                // SSLCommerz গেটওয়ে ইউআরএল-এ রিডাইরেক্ট [cite: 2026-02-15]
                window.location.href = response.data.url; 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Payment gateway link not found. Please try again.',
                });
            }
        } catch (err) {
            console.error("Payment initiation failed:", err);
            // সার্ভার এরর হলে ইউজারকে বিস্তারিত জানানো [cite: 2026-02-15]
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: err.response?.data?.message || 'Server error occurred. Please check your connection or token.',
            });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="py-20 font-bold text-center text-red-500">Product not found!</div>;

    return (
        <div className="min-h-screen pb-12 bg-gray-50">
            {/* Header Section */}
            <div className="py-4 mb-8 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between max-w-6xl px-6 mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-indigo-600">
                        <FaArrowLeft /> Back to Shop
                    </button>
                    <h1 className="text-xl font-black tracking-tight text-gray-900">
                        PRODUCT <span className="text-indigo-600">HUB</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl px-6 mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    {/* Product Details Card */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-gray-800">
                                <FaRegCheckCircle className="text-indigo-600" /> Review Your Order
                            </h2>
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div className="flex-shrink-0 w-full h-40 overflow-hidden bg-gray-100 md:w-40 rounded-xl">
                                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase px-2 py-1 rounded-md">
                                                {product.category}
                                            </span>
                                            <h3 className="mt-2 text-xl font-bold text-gray-900">{product.name}</h3>
                                            <p className="mt-1 text-sm text-gray-400">SKU: {product.sku || 'PRD-CUSTOM'}</p>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">${product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><FaTruck className="text-indigo-500" /> Fast Delivery</span>
                                        <span className="flex items-center gap-1"><FaShieldAlt className="text-green-500" /> Secure SSL Encryption</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky p-6 bg-white border border-gray-100 shadow-xl rounded-2xl top-8">
                            <h2 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h2>
                            
                            <div className="mb-6 space-y-4">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800">${product.price}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200 border-dashed">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-indigo-600">${product.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePaymentInitiate}
                                className="flex items-center justify-center w-full gap-3 py-4 text-lg font-bold text-white transition-all bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 active:scale-95"
                            >
                                <FaBolt className="text-yellow-300" />
                                Confirm & Pay Now
                            </button>

                            <p className="flex items-center justify-center gap-1 mt-4 text-xs text-center text-gray-400">
                                <FaShieldAlt /> Secured by SSLCommerz Sandbox
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;