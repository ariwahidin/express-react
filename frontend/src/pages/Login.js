import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    // const { setIsAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = e.target.elements;
        try {
            const response = await apiClient.post('auth/login', {
                email: username.value,
                password: password.value
            });

            // localStorage.setItem('py_pos_token_access', response.data.token);
            const { user, token, refreshToken } = response.data;
            login({ user, token, refreshToken });
            navigate('/content/products');

        } catch (error) {
            alert('Login failed: ', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
