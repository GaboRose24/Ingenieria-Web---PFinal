/**
 * services/authService.js
 *
 * Responsabilidad: lógica de negocio de autenticación.
 *   1. Validar los datos del formulario.
 *   2. Aplicar reglas de negocio (correo único, hash de contraseña).
 *   3. Generar el JWT en el login.
 *
 * Sigue el mismo patrón usado en la Web App de prácticas anteriores:
 * ruta → controlador → servicio → modelo.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/usersModel.js';

const SALT_ROUNDS = 10;

/**
 * Valida los campos del formulario de registro.
 * @param {{nombre, correo, contrasena}} datos
 * @returns {Object} objeto de errores (vacío si no hay errores)
 */
const validarRegistro = ({ nombre, correo, contrasena }) => {
  const errores = {};

  if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,100}$/.test(nombre)) {
    errores.nombre = 'El nombre debe contener solo letras (3-100 caracteres)';
  }
  if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
    errores.correo = 'Correo inválido';
  }
  if (!contrasena || contrasena.length < 6) {
    errores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errores;
};

/**
 * Registra un nuevo usuario con rol 'operativo' por defecto.
 * @param {{nombre, correo, contrasena, rol?}} datos
 * @returns {Promise<{success:boolean, errors:Object|null, data:Object|null}>}
 */
export const registrar = async (datos) => {
  const { nombre, correo, contrasena } = datos;
  const errores = validarRegistro(datos);

  if (Object.keys(errores).length > 0) {
    return { success: false, errors: errores, data: null };
  }

  // Verificar que el correo no esté ya registrado
  const existente = await findUserByEmail(correo);
  if (existente) {
    return {
      success: false,
      errors: { correo: 'Este correo electrónico ya está registrado' },
      data: null,
    };
  }

  // Hash de la contraseña antes de guardar (nunca en texto plano)
  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  // Por seguridad, el registro público siempre crea rol 'operativo'
  const id = await createUser({ nombre, correo, contrasena: contrasenaHash, rol: 'operativo' });

  return {
    success: true,
    errors: null,
    data: { id, nombre, correo, rol: 'operativo' },
  };
};

/**
 * Valida credenciales y genera un JWT si son correctas.
 * @param {string} correo
 * @param {string} contrasena
 * @returns {Promise<{success:boolean, errors:Object|null, data:Object|null}>}
 */
export const login = async (correo, contrasena) => {
  if (!correo || !contrasena) {
    return { success: false, errors: { general: 'Correo y contraseña son obligatorios' }, data: null };
  }

  const usuario = await findUserByEmail(correo);
  if (!usuario) {
    return { success: false, errors: { general: 'Credenciales incorrectas' }, data: null };
  }

  const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!coincide) {
    return { success: false, errors: { general: 'Credenciales incorrectas' }, data: null };
  }

  // Payload del token: nunca incluir la contraseña
  const payload = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  return { success: true, errors: null, data: { token, usuario: payload } };
};
