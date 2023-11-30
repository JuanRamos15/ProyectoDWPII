import bcrypt from 'bcrypt';
import log from '../../config/winston';
import User from './user.model';
import BookModel from '../root/bookRoot.model';

// Action Methods

// GET '/user/logout'
const logout = (req, res) => {
  log.info('Se cierra sesion');
  res.render('user/logout');
};

// GET '/user/register'
const register = (req, res) => {
  log.info('Se entrega formulario de registro');
  res.render('user/register');
};

// GET '/user/login'
const login = (req, res) => {
  // Sirve el formulario de login
  log.info('Se entrega formulario de login');
  res.render('user/login');
};

// GET '/user/userHome'
const userHome = (req, res) => {
  log.info('Se entrega home de usuario');
  res.render('user/userHome');
};

// GET '/user/listBooks'
const listBooks = async (req, res) => {
  log.info('Se entrega la lista de libros registrados en el sistema');
  // Consulta los libros
  const books = await BookModel.find({}).lean().exec();
  // Se entrega la vista dashboardView con el viewmodel projects
  res.render('user/listBooks', { books });
};

// GET '/user/penalties'
const Penalties = (req, res) => {
  log.info('Se entrega lista de multas');
  res.render('user/penalties');
};

// GET '/user/loan'
const loan = (req, res) => {
  log.info('Se entrega lista de libros prestados');
  res.render('user/loan');
};

// GET '/user/reserveBook'
const reserveBook = (req, res) => {
  log.info('Se entrega lista de libros reservados');
  res.render('user/reserveBook');
};

// GET '/user/modify'
const modify = (req, res) => {
  log.info('Se entrega formulario de modificacion de datos');
  res.render('user/modify');
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

export default {
  login,
  logout,
  register,
  registerPost,
  loginPost,
  userHome,
  listBooks,
  Penalties,
  loan,
  reserveBook,
  modify,
};
