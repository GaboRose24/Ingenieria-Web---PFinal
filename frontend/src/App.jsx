/**
 * @file App.jsx
 * @description Componente raíz de la aplicación.
 *              Define el sistema de rutas con React Router v6.
 *
 * Rutas:
 *   /            → redirige a /login o /dashboard según sesión
 *   /login       → página de inicio de sesión (pública)
 *   /registro    → página de registro (pública)
 *   /dashboard   → galería de usuarios (protegida, requiere auth)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';

const App = () => (
  <BrowserRouter>
    {/* AuthProvider envuelve toda la app para que cualquier componente
        pueda acceder al contexto de autenticación con useAuth() */}
    <AuthProvider>
      <Routes>
        {/* Ruta raíz → redirigir al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Cualquier ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
