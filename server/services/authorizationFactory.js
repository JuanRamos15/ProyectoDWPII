import log from '../config/winston';

const AuthorizationMiddleware = (role) => (req, res, next) => {
  if (!req.isAuthenticated()) {
    log.info('Requiere acceder con su cuenta');
    req.flash('errorMessage', 'Requiere acceder con su cuenta');
    res.redirect('/user/login');
  }
  if (!(req.user.role === role)) {
    log.info('No tienes permisos para acceder a este recurso');
    req.flash('errorMessage', 'No tienes permisos para acceder a este recurso');
    res.redirect('/');
  }
  // Si todo sale bien, se invoca al siguiente middleware
  return next();
};

export default AuthorizationMiddleware;
