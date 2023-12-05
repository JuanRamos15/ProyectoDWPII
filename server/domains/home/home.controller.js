import bcrypt from 'bcrypt';
import log from '../../config/winston';
import User from '../user/user.model';
// Metodos
// GET "/"
// GET "/index"
const home = (req, res) => {
  res.render('home/homeView');
};
// GET "/about"
const about = (req, res) => {
  res.render('home/aboutView', { appVersion: '1.0.0' });
};
// GET "/about"
const register = (req, res) => {
  res.render('user/register');
};
// GET login
const login = (req, res) => {
  res.render('user/login');
};
// GET '/user/logout'
const logout = (req, res) => {
  // Passport incrusta la peticion el metodo logout
  req.logout((err) => {
    if (err) {
      return res.json(err);
    }
    // Creamos el mensaje flash
    req.flash('successMessage', 'Sesión cerrada correctamente');
    // Redireccionamos al login
    return res.redirect('/login');
  });
};

// POST '/user/login'
const loginPost = async (request, response) => {
  // Del formulario obten el correo y contraseña
  const { email, password } = request.body;
  // Intenta
  try {
    // Buscar el usuario en la base de datos por correo electrónico
    const user = await User.findOne({ email });
    // Si el usuario existe y la contraseña es correcta
    if (user && bcrypt.compareSync(password, user.password)) {
      // Si el correo y la contraseña son válidos, redirigir a otra página
      log.info('Se inicia sesion como usuario');
      request.session.studentId = user.studentId;
      response.redirect('userHome');
    } else {
      // Si el correo o la contraseña son incorrectos
      log.info('Correo o contraseña incorrectos');
      response.redirect('login');
    }
  } catch (error) {
    // Manejar cualquier error que ocurra durante la búsqueda en la base de datos
    console.error(error);
  }
};

// POST '/user/register'
const registerPost = async (req, res) => {
  const { validData: userFormData, errorData } = req;
  log.info('Se procesa formulario de registro');
  // Verificando si hay errores
  if (errorData) {
    return res.json(errorData);
  }
  // En caso de no haber errores, se crea el usuario
  try {
    // 1. Se crea una instancia del modelo User
    // mendiante la funcion create del modelo
    const user = await User.create(userFormData);
    log.info(`Usuario creado: ${JSON.stringify(user)}`);
    // 3. Se contesta al cliente con el usuario creado
    req.flash('success', 'Usuario creado exitosamente');
    return res.status(200).redirect('/user/login');
  } catch (error) {
    log.error(error.message);
    return res.json({
      message: error.message,
      name: error.name,
      errors: error.errors,
    });
  }
};
// Controlador Home
export default {
  home,
  about,
  register,
  login,
  loginPost,
  registerPost,
  logout,
};
