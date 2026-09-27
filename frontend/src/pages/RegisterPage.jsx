/**
 * pages/RegisterPage.jsx
 *
 * Formulario de registro de usuarios (requisito 3).
 * Las validaciones del lado del cliente siguen el mismo patrón
 * usado en prácticas anteriores (regex sobre nombre/correo/contrasena).
 * El registro público siempre crea un usuario con rol 'operativo';
 * el backend lo fuerza así aunque se intente enviar otro rol.
 */

import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const RegisterPage = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [errors, setErrors] = useState({});
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  if (usuario) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Validaciones del lado cliente (mismo criterio que RegisterForm de prácticas previas) */
  const validate = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,100}$/.test(form.nombre)) {
      nuevosErrores.nombre = 'El nombre debe contener solo letras (3-100 caracteres)';
    }
    if (!form.correo.trim() || !/^\S+@\S+\.\S+$/.test(form.correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido';
    }
    if (!form.contrasena || form.contrasena.length < 6) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (form.contrasena !== form.confirmar) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setCargando(true);
    try {
      const { data: resultado } = await api.post('/auth/register', {
        nombre: form.nombre,
        correo: form.correo,
        contrasena: form.contrasena,
      });

      if (!resultado.success) {
        setErrors(resultado.errors || { general: 'Error al registrar usuario' });
        return;
      }

      setExito('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: 'Error al registrar usuario' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>📝 Registro</h1>
          <p>Crea tu cuenta para acceder al sistema</p>
        </div>

        {errors.general && <div className="alert alert-error">{errors.general}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan López"
              required
              autoFocus
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

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
            />
            {errors.correo && <span className="field-error">{errors.correo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
            {errors.contrasena && <span className="field-error">{errors.contrasena}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmar"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
            />
            {errors.confirmar && <span className="field-error">{errors.confirmar}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
