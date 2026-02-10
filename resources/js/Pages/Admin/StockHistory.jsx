import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Inventory Movement Report", 14, 15);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Total Transactions: ${history.length}`, 14, 28);

        const tableColumn = ["Date & Time", "Product Name", "Type", "Qty", "Old Stock", "New Stock"];
        const tableRows = history.map(log => [
            formatDate(log.created_at),
            log.product?.name || 'N/A',
            log.type === 'in' ? 'STOCK IN' : 'STOCK OUT',
            log.quantity,
            log.old_stock,
            log.new_stock
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { 
                fillColor: [79, 70, 229], // Indigo 600
                textColor: [255, 255, 255],
                fontStyle: 'bold' 
            },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            margin: { top: 35 },
        });


        doc.save(`inventory_report_${new Date().getTime()}.pdf`);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                {/* Table Header Section */}
                <div className="flex flex-col items-center justify-between gap-4 p-6 border-b md:flex-row border-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Stock In/Out History</h2>
                        <p className="text-sm text-gray-500">Monitor all inventory movements and adjustments</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* PDF Button */}
                        <button 
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all bg-indigo-600 shadow-md rounded-xl hover:bg-indigo-700 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Export to PDF
                        </button>

                        <button 
                            onClick={fetchHistory}
                            className="p-2 transition-colors border border-gray-100 rounded-full hover:bg-gray-100"
                            title="Refresh Data"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                    </div>
                </div>
                
                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
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
                                <tr key={log.id} className="transition-colors hover:bg-gray-50/80">
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {formatDate(log.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-800">{log.product?.name || 'Unknown Product'}</div>
                                        <div className="text-[10px] text-gray-400">ID: #{log.product_id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                                            <span className="opacity-40">{log.old_stock}</span>
                                            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            <span className="text-sm font-bold text-indigo-600">{log.new_stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm italic text-gray-500">
                                        {log.note || 'N/A'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-sm text-center text-gray-400">
                                        No transaction records found
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