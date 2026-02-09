import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/register', formData);
            alert(res.data.message);
            navigate('/login'); // সফল হলে লগইন পেজে নিয়ে যাবে
        } catch (err) {
            console.error(err.response.data);
            alert("Registration Failed! Please check your details.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side: Gradient Section */}
            <div className="flex-col items-center justify-center hidden w-1/2 p-12 text-white lg:flex bg-gradient-to-br from-blue-600 to-indigo-800">
                <div className="max-w-md text-center">
                    <h1 className="mb-6 text-5xl font-bold">Get Started</h1>
                    <p className="mb-8 text-lg text-blue-100">
                        Already have an account? Join our community and start managing your products efficiently.
                    </p>
                    <Link to="/login" className="px-8 py-3 font-semibold transition duration-300 border-2 border-white rounded-full hover:bg-white hover:text-blue-600">
                        Log in
                    </Link>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex items-center justify-center w-full p-8 bg-white lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Create account</h2>
                        <p className="mt-2 text-gray-500">Start your journey with us!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="john.doe@example.com"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} 
                                required 
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                            <label className="block ml-2 text-sm text-gray-700">
                                I accept the <span className="text-blue-600 cursor-pointer hover:underline">terms of the agreement</span>
                            </label>
                        </div>

                        <button type="submit" className="w-full px-4 py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
                            Register
                        </button>
                    </form>

                    {/* Social Register */}
                    <div className="mt-8 text-center">
                        <p className="mb-4 text-sm text-gray-500">Or continue with</p>
                        <div className="flex space-x-4">
                            <button className="flex items-center justify-center flex-1 py-2 transition border border-gray-300 rounded-lg hover:bg-gray-50">
                                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 mr-2" alt="Google" />
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center py-2 bg-[#1877F2] text-white rounded-lg hover:bg-blue-700 transition">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 mr-2 bg-white rounded-full" alt="Facebook" />
                                <span className="text-sm font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-center text-gray-600 lg:hidden">
                        Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;