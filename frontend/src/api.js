import axios from 'axios';

// 🔥 FIXED: Ab ye dynamic hai. Production mein Vercel se URL uthayega, local par localhost.
const API = axios.create({ 
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' 
});

API.interceptors.request.use((req) => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user && user.token) {
            req.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

export default API;