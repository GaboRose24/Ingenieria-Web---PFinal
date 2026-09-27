/**
 * @file axiosConfig.js
 * @description Instancia de Axios configurada con la URL base de la API.
 *              Incluye un interceptor que agrega automáticamente el token
 *              JWT a cada petición si existe en localStorage.
 */

import axios from 'axios';

/** URL base de la API  */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Interceptor de REQUEST:
 * Lee el token de localStorage y lo agrega al header Authorization
 * antes de enviar cualquier petición al backend.
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
 * Interceptor de RESPONSE:
 * Si el servidor devuelve 401 (token ausente/expirado/inválido),
 * limpia el localStorage y redirige al login. */
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
