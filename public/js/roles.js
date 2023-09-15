export const requireRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.session && req.session.user && req.session.user.role === requiredRole) {
        next();
      } else {
        res.status(403).send('No tienes permisos para acceder a esta página.');
      }
    };
  };