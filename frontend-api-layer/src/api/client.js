import axios from 'axios';

// Single axios instance: base URL, token injection and error normalisation
// live here so components never touch axios directly.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin')) window.location.href = '/admin/login';
    }
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : 'Network error. Please try again.');
    return Promise.reject({ message, details: error.response?.data?.details, status: error.response?.status });
  }
);

export default api;
