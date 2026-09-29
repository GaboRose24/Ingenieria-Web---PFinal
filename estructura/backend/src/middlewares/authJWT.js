// Middleware para proteger endpoints privados. 
// Intercepta la petición, extrae el token de los headers y valida que el usuario tenga sesión activa.

import jwt from 'jsonwebtoken';

export const authJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      errors: { general: 'Token no proporcionado' },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, nombre, correo, rol, iat, exp }
    next();
  } catch (err) {
    const mensaje =
      err.name === 'TokenExpiredError'
        ? 'Token expirado, inicia sesión nuevamente'
        : 'Token inválido';

    return res.status(403).json({ success: false, errors: { general: mensaje } });
  }
};
