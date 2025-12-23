import axios from 'axios';

// API base URL - Backend hazır olduğunda buraya gerçek URL gelecek
// Varsayılan backend port bu projede `5001` olduğundan default'u ona göre ayarlıyoruz.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie-based session için gerekli
});

// Request interceptor - Her istekte token'ı header'a ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatası durumunda logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - session expired veya invalid
      // Sadece login sayfasında değilsek logout yap
      const currentPath = window.location.pathname;
      // Bildirilen sorunlar sayfasında 401 hatası geldiğinde direkt logout yapma
      // Çünkü bu sayfa adminOnly gerektiriyor ve token sorunu olabilir
      if (!currentPath.includes('/login') && !currentPath.includes('/auth/login') && !currentPath.includes('/sorunlar')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

