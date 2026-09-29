
 
import axios from 'axios';
 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  
 /*Rutas que NO requieren sesión previa: si fallan con 401, es una
  credencial incorrecta, no una sesión expirada, así que nunca
  deben disparar el redirect/logout automático de abajo */
const RUTAS_PUBLICAS = ['/auth/login', '/auth/register'];
 
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
 
/**
  Lee el token de localStorage y lo agrega al header Authorization
  antes de enviar cualquier petición al backend.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
/**
  Si el servidor devuelve 401 (token ausente/expirado/inválido) en una
  ruta protegida, limpia el localStorage y redirige al login. */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esRutaAuth = RUTAS_PUBLICAS.some((ruta) => error.config?.url?.includes(ruta));
 
    if (error.response?.status === 401 && !esRutaAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export default api;