/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import log from '../../config/winston';
import User from './user.model';
import BookModel from '../root/bookRoot.model';

// Action Methods

// GET '/user/logout'
const logout = (req, res) => {
  // Metodo proporcionado por el middleware de sesion de express
  // Destruye la sesion y elimina los datos de la sesion en almacenamiento
  req.session.destroy((error) => {
    if (error) {
      log.error('Error al cerrar la sesion', error);
      res.redirect('userHome');
    }

    log.info('Se cierra sesion');
    res.redirect('home/logout');
  });
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
  // Obtén la consulta del request
  const { query } = req.query;
  log.info(`Buscando libros con el ISBN o título: ${query}`);
  // Consulta los libros
  let books;
  if (query) {
    // Si se proporcionó una consulta, busca libros que coincidan con ese ISBN o título
    books = await BookModel.find({
      $or: [
        { bookAuthor: new RegExp(query, 'i') },
        { bookTitle: new RegExp(query, 'i') },
        { bookCategory: new RegExp(query, 'i') },
      ],
    })
      .lean()
      .exec();
  } else {
    // Si no se proporcionó ninguno, obtén todos los libros
    books = await BookModel.find({}).lean().exec();
  }
  log.info(`Encontrados ${books.length} libros`);
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
const modify = async (req, res) => {
  try {
    // Se encuentra al usuario en la base de datos
    const user = await User.findById(req.session.userId).lean().exec();
    log.info('Se entrega formulario de modificación de usuario');
    // Se pasa el objeto a la vista 'user/modify' para que pueda acceder a los elementos
    // del Schema de mongoose
    res.render('user/modify', { user });
  } catch (err) {
    log.error(err);
  }
};

// POST '/user/login'
// Ingresa el usuario a la pagina
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
      // Se obtiene el id de la sesion
      // eslint-disable-next-line no-underscore-dangle
      request.session.userId = user._id;
      // Se redirige a la pagina de inicio de usuario
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
// Se registra el usuario en la base de datos
const registerPost = async (req, res) => {
  const { validData: userFormData, errorData } = req;
  log.info('Se procesa formulario de registro');
  // Verificando si hay errores
  if (errorData) {
    return res.json(errorData);
  }
  // En caso de no haber errores, se crea el usuario
  try {
    // Se crea una instancia del modelo User
    // mendiante la funcion create del modelo
    const user = await User.create(userFormData);
    // Se guarda la informacion dentro del log.info
    log.info(`Usuario creado: ${JSON.stringify(user)}`);
    // Se contesta al cliente con el usuario creado
    // El status 200 y se redirige a la pagina de login
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

// Prestamo de libro
// POST '/user/loan'
const postLoan = async (req, res) => {
  try {
    // Se obtiene el userId del usuario
    const { userId } = req.session;
    log.info('Se solicita préstamo de libro');

    // Obtén el ID del libro del request
    const { id, startDate, returnDate } = req.body;

    // Busca el libro en la base de datos
    const book = await BookModel.findById(id);

    // Verifica si hay copias disponibles y el libro no está prestado
    if (book.bookQuantity > 0 && !book.borrowedBy) {
      // Verifica si el usuario ya tiene prestada una copia del mismo libro
      const userHasBook = await BookModel.exists({
        _id: id, // Busca el libro actual
        borrowedBy: userId,
      });

      if (userHasBook) {
        return res.send('Ya tienes una copia de este libro prestada.');
      }

      // Reduce la cantidad de libros en 1
      book.bookQuantity -= 1;

      // Busca al usuario por userId
      const user = await User.findById(userId);

      // Verifica si el usuario existe
      if (!user) {
        return res.send('Usuario no encontrado');
      }

      // Establece el campo borrowedBy al userId del usuario
      book.borrowedBy = user._id;

      // Agrega las fechas de inicio y fin al préstamo
      book.startDate = startDate;
      book.returnDate = returnDate;

      // Guarda el libro en la base de datos
      await book.save();

      // Informa al cliente que el préstamo fue exitoso
      log.info('El préstamo fue exitoso');
      return res.render('user/listBooks');
    }

    // Informa al cliente que no hay copias disponibles o el libro está prestado
    log.info('No hay copias disponibles o el libro está prestado');
    return res.render('user/listBooks');
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// GET '/root/listBooks'
const listLoanBooks = async (req, res) => {
  log.info('Se entrega la lista de libros prestados');
  // Obtén la consulta del request
  const { query } = req.query;
  log.info(`Buscando libros con el ISBN o título: ${query}`);
  // Consulta los libros
  let books;
  if (query) {
    // Si se proporcionó una consulta, busca libros que coincidan con ese ISBN o título
    books = await BookModel.find({
      $or: [
        { bookAuthor: new RegExp(query, 'i') },
        { bookTitle: new RegExp(query, 'i') },
        { bookCategory: new RegExp(query, 'i') },
      ],
    })
      .lean()
      .exec();
  } else {
    // Si no se proporcionó ninguno, obtén todos los libros
    books = await BookModel.find({}).lean().exec();
  }
  log.info(`Encontrados ${books.length} libros`);
  // Se entrega la vista dashboardView con el viewmodel projects
  res.render('user/listLoanBooks', { books });
};

// PUT '/user/modify'
// Modifica los datos del usuario
const postModify = async (req, res) => {
  const { userId } = req.session;
  // Rescatando la información del formulario
  const { errorData: validationError } = req;
  // En caso de haber errores
  if (validationError) {
    log.info(`Error de validacion del usuario con ID: ${userId}`);
    // Se desestructura el error
    const { value: user } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('user/modify', { user, errorModel });
  }
  // Si no hay errores
  const user = await User.findById(userId);
  if (user === null) {
    log.info(`No se encontro el usuario con el ID: ${userId}`);
    return res.status(404).send('No se encontro el usuario');
  }
  // En caso de encontrarse el documento se actualizan los datos
  const { validData: newUser } = req;
  // Se actualizan los datos del usuario
  user.firstName = newUser.firstName;
  user.lastname = newUser.lastname;
  user.studentId = newUser.studentId;
  user.major = newUser.major;
  user.mail = newUser.mail;
  try {
    // Se guarda el usuario actualizado
    await user.save();
    log.info(`Se actualizo el usuario con ID: ${userId}`);
    // Se redirecciona a la pagina de modificacion
    return res.status(200).redirect('/user/userHome');
  } catch (error) {
    log.error(`Error al actualizar el usuario con ID: ${userId}`);
    return res.status(500).json(error);
  }
};

// Exportar todos los metodos de acción
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
  postLoan,
  listLoanBooks,
  postModify,
};
