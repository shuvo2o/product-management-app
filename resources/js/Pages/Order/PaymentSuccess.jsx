import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const transactionId = searchParams.get('id');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-3xl">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <FaCheckCircle className="text-4xl text-green-500" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="mb-2 text-3xl font-black text-gray-900">Payment Successful!</h1>
                <p className="mb-6 text-gray-500">
                    Thank you for your purchase. Your order has been confirmed and is being processed.
                </p>

                {/* Transaction Box */}
                <div className="p-4 mb-8 border border-gray-300 border-dashed bg-gray-50 rounded-xl">
                    <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Transaction ID</p>
                    <p className="font-mono text-sm font-bold text-indigo-600 break-all">
                        {transactionId || "N/A"}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-4 py-3 font-bold text-white transition-all bg-gray-900 rounded-xl hover:bg-gray-800 active:scale-95"
                    >
                        <FaHome /> Home
                    </button>
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center justify-center gap-2 px-4 py-3 font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95"
                    >
                        <FaShoppingBag /> My Orders
                    </button>
                </div>
            </div>

            {/* Support Text */}
            <p className="mt-8 text-sm text-gray-400">
                Having issues? <a href="#" className="text-indigo-500 underline">Contact Support</a>
            </p>
        </div>
    );
};

export default PaymentSuccess;