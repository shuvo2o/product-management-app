import axios from 'axios';

const productService = {
    getAll: async (params = {}) => {
        try {
            const response = await axios.get('/api/products', { params });
            return response.data; 
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
};

export default productService;