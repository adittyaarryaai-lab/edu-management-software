import React, { useState } from 'react';
import API from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            // Save token and user info
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setMessage(`Welcome, ${res.data.user.name}!`);
            window.location.reload(); // Temporary way to refresh state
        } catch (err) {
            setMessage(err.response?.data?.msg || "Login Failed ❌");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>EduFlowAI Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" placeholder="Email" required 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="password" placeholder="Password" required 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;