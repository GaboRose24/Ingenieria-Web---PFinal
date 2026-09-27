/**
 * components/EditUserModal.jsx
 *
 * Modal para editar los datos de un usuario (requisito 5).
 * Solo el admin puede ver y cambiar el campo 'rol'; el backend
 * también lo revalida por seguridad (nunca confiar solo en el cliente).
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EditUserModal = ({ usuario, onGuardar, onCerrar }) => {
  const { usuario: usuarioActual } = useAuth();
  const esAdmin = usuarioActual?.rol === 'admin';

  const [form, setForm] = useState({
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.correo.trim()) {
      return setError('Nombre y correo son obligatorios');
    }

    setCargando(true);
    try {
      await onGuardar(usuario.id, form);
    } catch (err) {
      setError(err.message || 'Error al actualizar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar usuario</h2>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Solo el admin puede cambiar el rol de un usuario */}
          {esAdmin && (
            <div className="form-group">
              <label htmlFor="rol">Rol</label>
              <select id="rol" name="rol" value={form.rol} onChange={handleChange}>
                <option value="operativo">Operativo</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
