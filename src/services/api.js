import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-backend-production-7404.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : s'exécute AVANT chaque appel vers Spring Boot
api.interceptors.request.use(
  (config) => {
    // On cherche le token JWT dans le localStorage
    const token = localStorage.getItem('jwtToken');
    
    // Si le token existe, on l'ajoute dans l'en-tête (Header) Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;