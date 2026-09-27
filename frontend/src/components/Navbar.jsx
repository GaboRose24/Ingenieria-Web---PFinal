/**
 * @file Navbar.jsx
 * @description Barra de navegación superior.
 *              Muestra el nombre, rol del usuario y el botón de cerrar sesión.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Limpia token y estado
    navigate('/login'); // Redirige al login
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">🎓 Práctica Final</div>

      {usuario && (
        <div className="navbar-user">
          <span>
            Hola, <strong>{usuario.nombre}</strong>
            <span className={`badge ${usuario.rol === 'admin' ? 'badge-admin' : 'badge-op'}`}>
              {usuario.rol}
            </span>
          </span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
