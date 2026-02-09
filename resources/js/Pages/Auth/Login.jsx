import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // আপনার ব্যাকএন্ড এপিআই ইউআরএল নিশ্চিত করুন
            const res = await axios.post('http://localhost:8000/api/login', { email, password });
            
            // টোকেন এবং রোল লোকাল স্টোরেজে সেভ করা
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role[0]); 
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert("Login Successful!");

            // রোল অনুযায়ী ড্যাশবোর্ডে রিডাইরেক্ট
            const role = res.data.role[0];
            if (role === 'superadmin' || role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }

        } catch (err) {
            if (err.response?.status === 403) {
                alert("Your account is pending approval by Admin.");
            } else {
                alert("Invalid Email or Password!");
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side: Gradient Section (Register পেজের সাথে মিল রেখে) */}
            <div className="flex-col items-center justify-center hidden w-1/2 p-12 text-white lg:flex bg-gradient-to-br from-indigo-800 to-blue-600">
                <div className="max-w-md text-center">
                    <h1 className="mb-6 text-5xl font-bold">Welcome Back!</h1>
                    <p className="mb-8 text-lg text-blue-100">
                        To keep connected with us please login with your personal info. 
                        Don't have an account yet?
                    </p>
                    <Link to="/register" className="px-8 py-3 font-semibold transition duration-300 border-2 border-white rounded-full hover:bg-white hover:text-blue-800">
                        Create Account
                    </Link>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center w-full p-8 bg-white lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Login to Account</h2>
                        <p className="mt-2 text-gray-500">Please enter your details to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@company.com"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Forgot Password?</span>
                            </div>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full p-3 mt-1 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label className="block ml-2 text-sm text-gray-700">Remember me</label>
                        </div>

                        <button type="submit" className="w-full px-4 py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
                            Sign In
                        </button>
                    </form>

                    {/* Social Login Section */}
                    <div className="mt-8 text-center">
                        <p className="mb-4 text-sm text-gray-500">Or sign in with</p>
                        <div className="flex space-x-4">
                            <button className="flex items-center justify-center flex-1 py-2 transition border border-gray-300 rounded-lg hover:bg-gray-50">
                                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 mr-2" alt="Google" />
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center py-2 bg-[#1877F2] text-white rounded-lg hover:bg-blue-800 transition">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 mr-2 bg-white rounded-full" alt="Facebook" />
                                <span className="text-sm font-medium">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-center text-gray-600 lg:hidden">
                        New here? <Link to="/register" className="font-bold text-blue-600 hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;