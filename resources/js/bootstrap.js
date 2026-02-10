import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// --- এই অংশটুকু নিচে যোগ করুন ---

// ১. প্রতিবার রিকোয়েস্ট পাঠানোর সময় অটো টোকেন যোগ করা
window.axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// ২. যদি টোকেন এক্সপায়ার হয় (যেমন কাল হয়েছিল), তবে অটোমেটিক লগআউট করা
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);