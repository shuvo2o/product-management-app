import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // App.jsx কে ইম্পোর্ট করছি

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}