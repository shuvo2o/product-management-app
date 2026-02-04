import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                        {product.category?.name}
                    </span>
                </div>
                <span className="text-xl font-black text-indigo-600">${product.price}</span>
            </div>
            <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                This is a high-quality product from our inventory.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>Stock: {product.stock} units</span>
                <button className="text-indigo-600 font-semibold hover:underline">View Details</button>
            </div>
        </div>
    );
};

export default ProductCard;