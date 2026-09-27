/**
 * pages/DashboardPage.jsx
 *
 * Galería de tarjetas con todos los usuarios activos (requisito 5).
 * Permite editar y eliminar (lógicamente) usuarios según el rol
 * del usuario autenticado:
 *   - admin     → edita y elimina a cualquiera (excepto a sí mismo)
 *   - operativo → solo edita su propio perfil
 */

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import EditUserModal from '../components/EditUserModal';
import api from '../api/axiosConfig';

const DashboardPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [usuarioEditar, setUsuarioEditar] = useState(null); // null = modal cerrado
  const [busqueda, setBusqueda] = useState('');

  /** Carga todos los usuarios activos desde la API */
  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const { data: resultado } = await api.get('/users');
      if (resultado.success) {
        setUsuarios(resultado.data);
      } else {
        setError(resultado.errors?.general || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError(err.response?.data?.errors?.general || 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  /** Guarda los cambios de un usuario editado */
  const handleGuardar = async (id, datos) => {
    const { data: resultado } = await api.put(`/users/${id}`, datos);
    if (!resultado.success) {
      throw new Error(resultado.errors?.general || resultado.errors?.correo || 'Error al actualizar');
    }
    setUsuarioEditar(null);
    cargarUsuarios();
  };

  /** Realiza la eliminación LÓGICA del usuario (activo = 0 en la BD) */
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
      const { data: resultado } = await api.delete(`/users/${id}`);
      if (!resultado.success) {
        setError(resultado.errors?.general || 'Error al eliminar usuario');
        return;
      }
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.errors?.general || 'Error al eliminar usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>👥 Usuarios registrados</h1>
            <p>{usuariosFiltrados.length} usuario(s) encontrado(s)</p>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {cargando && <div className="loading">⏳ Cargando usuarios...</div>}

        {!cargando && (
          <div className="cards-grid">
            {usuariosFiltrados.length === 0 ? (
              <p className="no-data">No se encontraron usuarios.</p>
            ) : (
              usuariosFiltrados.map((u) => (
                <UserCard
                  key={u.id}
                  usuario={u}
                  onEditar={setUsuarioEditar}
                  onEliminar={handleEliminar}
                />
              ))
            )}
          </div>
        )}
      </main>

      {usuarioEditar && (
        <EditUserModal
          usuario={usuarioEditar}
          onGuardar={handleGuardar}
          onCerrar={() => setUsuarioEditar(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
