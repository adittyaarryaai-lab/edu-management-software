import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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