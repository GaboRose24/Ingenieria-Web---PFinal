/**
 * components/UserCard.jsx
 *
 * Tarjeta individual de usuario para la galería del dashboard
 * (requisito 5). El avatar se genera con ui-avatars.com a partir
 * del nombre, igual que en el ejemplo de galería de prácticas
 * anteriores (galleryReact/TarjetaUsuario.jsx).
 *
 * Reglas de permisos (requisito 5):
 *   - admin     → puede editar y eliminar a cualquier usuario
 *   - operativo → solo puede editar su propio perfil
 */

import { useAuth } from '../context/AuthContext';

const colorPorRol = { admin: '4361ee', operativo: '06d6a0' };

const UserCard = ({ usuario, onEditar, onEliminar }) => {
  const { usuario: usuarioActual } = useAuth();

  const esAdmin = usuarioActual?.rol === 'admin';
  const esPropietario = usuarioActual?.id === usuario.id;
  const puedeEditar = esAdmin || esPropietario;
  const puedeEliminar = esAdmin && usuarioActual?.id !== usuario.id; // evita autoeliminarse

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}&size=128&background=${colorPorRol[usuario.rol] || '999'}&color=fff`;

  return (
    <div className="user-card">
      <img className="card-avatar-img" src={avatarUrl} alt={usuario.nombre} />

      <div className="card-info">
        <h3 className="card-nombre">{usuario.nombre}</h3>
        <p className="card-email">📧 {usuario.correo}</p>
        <p className="card-fecha">📅 {new Date(usuario.created_at).toLocaleDateString('es-MX')}</p>
        <span className={`badge ${usuario.rol === 'admin' ? 'badge-admin' : 'badge-op'}`}>
          {usuario.rol}
        </span>
      </div>

      <div className="card-actions">
        {puedeEditar && (
          <button className="btn btn-edit" onClick={() => onEditar(usuario)}>
            ✏️ Editar
          </button>
        )}
        {puedeEliminar && (
          <button className="btn btn-danger" onClick={() => onEliminar(usuario.id)}>
            🗑️ Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
