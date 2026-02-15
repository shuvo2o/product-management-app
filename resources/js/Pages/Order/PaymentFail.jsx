import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

const PaymentFail = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
            <div className="w-full max-w-md p-8 text-center bg-white border border-red-100 shadow-xl rounded-3xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <FaTimesCircle className="text-5xl text-red-500" />
                    </div>
                </div>
                
                <h1 className="mb-2 text-2xl font-black text-gray-900">Payment Failed!</h1>
                <p className="mb-8 text-gray-500">দুঃখিত, আপনার ট্রানজেকশনটি সফল হয়নি। আপনার কার্ড বা ব্যালেন্স চেক করে আবার চেষ্টা করুন।</p>
                
                <div className="flex items-center gap-3 p-4 mb-8 text-sm text-left border bg-amber-50 rounded-xl text-amber-700 border-amber-100">
                    <FaExclamationTriangle className="text-xl shrink-0" />
                    <p>আপনার অ্যাকাউন্ট থেকে টাকা কেটে নেওয়া হলে সেটি পরবর্তী ২৪-৪৮ ঘণ্টার মধ্যে ফেরত দেওয়া হবে।</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition-all bg-red-500 shadow-md rounded-xl hover:bg-red-600"
                    >
                        <FaRedo /> আবার চেষ্টা করুন
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 font-bold text-gray-500 transition-all hover:text-gray-700"
                    >
                        হোম পেজে ফিরে যান
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;