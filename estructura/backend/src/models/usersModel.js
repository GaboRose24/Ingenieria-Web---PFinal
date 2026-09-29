
import { pool } from '../config/db.js';


const CAMPOS_SEGUROS = 'id, nombre, correo, rol, activo, created_at, updated_at';

/**
 * Obtiene todos los usuarios ACTIVOS (activo = 1).
 * @returns {Promise<Array>} lista de usuarios
 */
export const getAllUsers = async () => {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS_SEGUROS} FROM users WHERE activo = 1 ORDER BY created_at DESC`
  );
  return rows;
};

/**
 * Obtiene un usuario activo por su ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export const getUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS_SEGUROS} FROM users WHERE id = ? AND activo = 1`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Obtiene un usuario por correo (incluye contrasena, para validar login).
 * @param {string} correo
 * @returns {Promise<Object|null>}
 */
export const findUserByEmail = async (correo) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, contrasena, rol FROM users WHERE correo = ? AND activo = 1',
    [correo]
  );
  return rows[0] || null;
};

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {{nombre:string, correo:string, contrasena:string, rol?:string}} user
 * @returns {Promise<number>} ID del usuario creado
 */
export const createUser = async ({ nombre, correo, contrasena, rol = 'operativo' }) => {
  const [result] = await pool.query(
    'INSERT INTO users (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, contrasena, rol]
  );
  return result.insertId;
};

/**
 * Actualiza nombre, correo y rol de un usuario activo.
 * @param {number} id
 * @param {{nombre:string, correo:string, rol:string}} datos
 * @returns {Promise<boolean>}
 */
export const updateUser = async (id, { nombre, correo, rol }) => {
  const [result] = await pool.query(
    'UPDATE users SET nombre = ?, correo = ?, rol = ? WHERE id = ? AND activo = 1',
    [nombre, correo, rol, id]
  );
  return result.affectedRows > 0;
};

/**
 * Actualiza solo la contraseña (ya hasheada) de un usuario.
 * @param {number} id
 * @param {string} contrasenaHash
 * @returns {Promise<boolean>}
 */
export const updatePassword = async (id, contrasenaHash) => {
  const [result] = await pool.query(
    'UPDATE users SET contrasena = ? WHERE id = ? AND activo = 1',
    [contrasenaHash, id]
  );
  return result.affectedRows > 0;
};

/**
 * ELIMINACIÓN LÓGICA — marca activo = 0 y registra deleted_at.
 * El registro NUNCA se borra físicamente de la tabla.
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export const softDeleteUser = async (id) => {
  const [result] = await pool.query(
    'UPDATE users SET activo = 0, deleted_at = NOW() WHERE id = ? AND activo = 1',
    [id]
  );
  return result.affectedRows > 0;
};
