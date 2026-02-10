import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/stock-history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching stock history:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="w-12 h-12 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Stock In/Out History</h2>
                        <p className="text-sm text-gray-500">Monitor all inventory movements and adjustments</p>
                    </div>
                    <button 
                        onClick={fetchHistory}
                        className="p-2 transition-colors rounded-full hover:bg-gray-100"
                        title="Refresh Data"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4 text-center">Type</th>
                                <th className="px-6 py-4 text-center">Quantity</th>
                                <th className="px-6 py-4">Stock Flow</th>
                                <th className="px-6 py-4">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.length > 0 ? history.map((log) => (
                                <tr key={log.id} className="transition-colors hover:bg-gray-50/80 group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700">
                                            {formatDate(log.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-800">{log.product?.name}</div>
                                        <div className="text-[10px] text-gray-400">ID: #{log.product_id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            log.type === 'in' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {log.type === 'in' ? '↑ STOCK IN' : '↓ STOCK OUT'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-center text-gray-700">
                                        {log.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="line-through opacity-50">{log.old_stock}</span>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            <span className="text-sm font-bold text-indigo-600">{log.new_stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm italic text-gray-500 truncate max-w-50" title={log.note}>
                                            {log.note || 'Manual Adjustment'}
                                        </p>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 0h6"></path></svg>
                                            <span className="text-sm">No transaction records found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockHistory;