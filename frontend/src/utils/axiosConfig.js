import axios from 'axios';
import { navigateTo } from './navigation';

const apiClient = axios.create({
  baseURL: 'http://localhost:3005/express-api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('py_pos_token_access');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    localStorage.removeItem('py_pos_token_access');
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('py_pos_token_access_refresh');

    if (refreshToken) {
      try {
        const response = await axios.post('http://localhost:3005/express-api/auth/token', { token: refreshToken });
        const newAccessToken = response.data.token;
        localStorage.setItem('py_pos_token_access', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('py_pos_token_access');
        localStorage.removeItem('py_pos_token_access_refresh');
        navigateTo('/auth/login');
      }
    } else {
      navigateTo('/auth/login');
    }
    navigateTo('/auth/login');
  }
  return Promise.reject(error);
});

export default apiClient;
