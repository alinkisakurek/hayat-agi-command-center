import axios from 'axios';

// API base URL - Backend hazır olduğunda buraya gerçek URL gelecek
// Varsayılan backend port bu projede `5000` olduğundan default'u ona göre ayarlıyoruz.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie-based session için gerekli
});

// Request interceptor - Her istekte session cookie otomatik gönderilir
api.interceptors.request.use(
  (config) => {
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
      // Auth context'te logout fonksiyonu çağrılacak
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

