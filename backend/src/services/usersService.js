/**
 * services/usersService.js
 *
 * Responsabilidad: lógica de negocio de la gestión de usuarios
 * (listar, editar, eliminación lógica). Aplica las reglas de
 * permisos por rol descritas en el requisito 5 de la práctica.
 */

import {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from '../models/usersModel.js';

/**
 * Lista todos los usuarios activos.
 * @returns {Promise<Array>}
 */
export const listarActivos = () => getAllUsers();

/**
 * Obtiene un usuario por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export const obtenerPorId = (id) => getUserById(id);

/**
 * Actualiza los datos de un usuario.
 * Un usuario 'operativo' NUNCA puede cambiarse el rol a sí mismo,
 * aunque lo intente enviar en el body — solo un 'admin' puede
 * modificar el rol de cualquier usuario.
 *
 * @param {number} idObjetivo   - ID del usuario a editar
 * @param {Object} datos        - { nombre, correo, rol }
 * @param {Object} solicitante  - req.user (usuario autenticado)
 * @returns {Promise<{success:boolean, errors:Object|null, data:Object|null}>}
 */
export const actualizar = async (idObjetivo, datos, solicitante) => {
  const actual = await getUserById(idObjetivo);
  if (!actual) {
    return { success: false, errors: { general: 'Usuario no encontrado' }, data: null };
  }

  const esAdmin = solicitante.rol === 'admin';

  const nombre = datos.nombre?.trim() || actual.nombre;
  const correo = datos.correo?.trim() || actual.correo;
  // Solo el admin puede cambiar el rol; el operativo conserva el suyo
  const rol = esAdmin && datos.rol ? datos.rol : actual.rol;

  try {
    const actualizado = await updateUser(idObjetivo, { nombre, correo, rol });
    if (!actualizado) {
      return { success: false, errors: { general: 'No se pudo actualizar' }, data: null };
    }
    return { success: true, errors: null, data: { id: idObjetivo, nombre, correo, rol } };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, errors: { correo: 'El correo ya está en uso' }, data: null };
    }
    throw err;
  }
};

/**
 * Elimina lógicamente a un usuario (activo = 0).
 * Un admin no puede eliminarse a sí mismo (evita quedarse sin acceso).
 *
 * @param {number} idObjetivo
 * @param {Object} solicitante - req.user
 * @returns {Promise<{success:boolean, errors:Object|null, data:Object|null}>}
 */
export const eliminarLogico = async (idObjetivo, solicitante) => {
  if (Number(idObjetivo) === solicitante.id) {
    return { success: false, errors: { general: 'No puedes eliminarte a ti mismo' }, data: null };
  }

  const eliminado = await softDeleteUser(idObjetivo);
  if (!eliminado) {
    return { success: false, errors: { general: 'Usuario no encontrado' }, data: null };
  }

  return { success: true, errors: null, data: { id: idObjetivo } };
};
