/**
 * pages/LoginPage.jsx
 *
 * Formulario de inicio de sesión (requisito 3).
 * Llama a AuthContext.login(), que guarda el JWT y redirige
 * al dashboard si las credenciales son correctas.
 */

import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, usuario, cargando } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');

  // Si ya hay sesión activa, ir directo al dashboard
  if (usuario) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.correo, form.contrasena);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Iniciar sesión</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
