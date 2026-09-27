/**
 * @file ProtectedRoute.jsx
 * @description Componente de ruta protegida.
 *              Si el usuario no está autenticado, redirige a /login.
 *              Opcionalmente acepta un prop 'soloAdmin' para rutas
 *              exclusivas de administradores.
 *
 * Uso:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute soloAdmin><AdminPage /></ProtectedRoute>} />
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, soloAdmin = false }) => {
  const { usuario } = useAuth();

  // Sin sesión → al login
  if (!usuario) return <Navigate to="/login" replace />;

  // Si la ruta es solo para admin y el usuario no lo es
  if (soloAdmin && usuario.rol !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
