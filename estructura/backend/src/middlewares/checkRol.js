// Middleware de autorización estricta.
// Bloquea el acceso a cualquier usuario que no tenga el rol de 'admin', protegiendo rutas sensibles.

export const soloAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      errors: { general: 'Acción restringida: se requiere rol de administrador' },
    });
  }
  next();
};


export const adminOPropietario = (req, res, next) => {
  const esAdmin = req.user?.rol === 'admin';
  const esPropietario = Number(req.params.id) === req.user?.id;

  if (!esAdmin && !esPropietario) {
    return res.status(403).json({
      success: false,
      errors: { general: 'No tienes permiso para modificar este usuario' },
    });
  }
  next();
};
