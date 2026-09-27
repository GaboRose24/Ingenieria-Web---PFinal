
import * as authService from '../services/authService.js';

/** POST /api/auth/register */
export const register = async (req, res) => {
  try {
    const resultado = await authService.registrar(req.body);

    if (!resultado.success) {
      return res.status(400).json(resultado);
    }
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error en register:', err.message);
    return res.status(500).json({
      success: false,
      errors: { general: 'Error interno del servidor' },
      data: null,
    });
  }
};

/** POST /api/auth/login */
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await authService.login(correo, contrasena);

    if (!resultado.success) {
      return res.status(401).json(resultado);
    }
    return res.status(200).json(resultado);
  } catch (err) {
    console.error('Error en login:', err.message);
    return res.status(500).json({
      success: false,
      errors: { general: 'Error interno del servidor' },
      data: null,
    });
  }
};
