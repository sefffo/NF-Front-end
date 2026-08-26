import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  // Backend routes are under /api/... (no /v1 segment)
  // Override via VITE_API_BASE_URL in .env.local if your backend runs on a different origin.
=======
  // Task 96: backend routes have no version segment (api/...), was '/api/v1'
>>>>>>> develop
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
