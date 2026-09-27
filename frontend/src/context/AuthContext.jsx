/**
 * context/AuthContext.jsx
 *
 * Contexto global de autenticación.
 * Expone: usuario actual, token JWT, funciones login/logout.
 * El token y el usuario se persisten en localStorage para
 * sobrevivir recargas de página (requisito 4 — seguimiento
 * del login en las interfaces posteriores).
 *
 * Uso en cualquier componente:
 *   const { usuario, login, logout, cargando } = useAuth();
 */

import { createContext, useContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Leer datos persistidos al iniciar la app
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Inicia sesión: llama a la API, guarda token y datos del usuario.
   * @param {string} correo
   * @param {string} contrasena
   */
  const login = async (correo, contrasena) => {
    setCargando(true);
    setError(null);
    try {
      const { data: resultado } = await api.post('/auth/login', { correo, contrasena });

      if (!resultado.success) {
        const msg = resultado.errors?.general || 'Error al iniciar sesión';
        setError(msg);
        throw new Error(msg);
      }

      const { token, usuario: datosUsuario } = resultado.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));
      setUsuario(datosUsuario);
    } catch (err) {
      const msg = err.response?.data?.errors?.general || err.message || 'Error al iniciar sesión';
      setError(msg);
      throw new Error(msg);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Cierra sesión: elimina el token y los datos del usuario del cliente.
   * El backend usa JWT sin estado (stateless), por lo que "invalidar"
   * el token equivale a descartarlo del lado del cliente.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook para consumir el contexto de autenticación. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
