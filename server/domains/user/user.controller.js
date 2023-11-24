// Metodos
// actions methods
import log from '../../config/winston';
// Action Methods

// GET '/user/login'
const login = (req, res) => {
  // Sirve el formulario de login
  log.info('Se entrega formulario de login');
  res.render('user/login');
};
// get 'user/logout'
const logout = (req, res) => {
  res.send('🚧UNDER CONSTRUCTION GET ´/user/logout´ 🚧');
};
// get 'user/register'
const register = (req, res) => {
  log.info('Se entrega formulario de registro');
  res.render('user/register');
};

// Controlador Home
export default {
  login,
  logout,
  register,
};
