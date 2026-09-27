
import * as usersService from '../services/usersService.js';

/** GET /api/users — cualquier usuario autenticado */
export const getUsers = async (req, res) => {
  try {
    const usuarios = await usersService.listarActivos();
    res.json({ success: true, errors: null, data: usuarios });
  } catch (err) {
    res.status(500).json({ success: false, errors: { general: err.message }, data: null });
  }
};

/** GET /api/users/:id — cualquier usuario autenticado */
export const getUserById = async (req, res) => {
  try {
    const usuario = await usersService.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        errors: { general: 'Usuario no encontrado' },
        data: null,
      });
    }
    res.json({ success: true, errors: null, data: usuario });
  } catch (err) {
    res.status(500).json({ success: false, errors: { general: err.message }, data: null });
  }
};

/** PUT /api/users/:id — admin (cualquiera) u operativo (solo su propio perfil) */
export const updateUser = async (req, res) => {
  try {
    const resultado = await usersService.actualizar(req.params.id, req.body, req.user);
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ success: false, errors: { general: err.message }, data: null });
  }
};

/** DELETE /api/users/:id — solo admin (eliminación lógica) */
export const deleteUser = async (req, res) => {
  try {
    const resultado = await usersService.eliminarLogico(req.params.id, req.user);
    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ success: false, errors: { general: err.message }, data: null });
  }
};
