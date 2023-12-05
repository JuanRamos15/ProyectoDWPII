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

// GET '/user/reserveBook'
const reserveBook = async (req, res) => {
  try {
    // Se obtiene el userId del usuario
    const { userId } = req.session;
    log.info('Se entrega lista de libros reservados');

    // Busca todos los libros reservados por el usuario
    const reservedBooks = await BookModel.find({ reservedBy: userId });

    // Renderiza la vista con los libros reservados
    res.render('user/reserveBook', { reservedBooks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los libros reservados');
  }
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

// GET user/confirm/<token>
const confirm = async (req, res) => {
  // Extrayendo datos de validación
  const { validData, errorData } = req;
  if (errorData) return res.json(errorData);
  const { token } = validData;
  // Buscando si existe un usuario con ese token
  const user = await User.findByToken(token);
  if (!user) {
    return res.send('USER WITH TOKEN NOT FOUND');
  }
  // Activate user
  await user.activate();
  // Retornado al usuario validado
  return res.send(`Usuario: ${user.firstName} Validado`);
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
    // Se construye el viewModel del usuario
    const viewModel = {
      ...user.toJSON(),
      // Color de fondo
      backgroundColor: 'cyan darken-2',
    };
    // Se contesta al cliente con el usuario creado
    // El status 200 y se redirige a la pagina de login
    return res.render('user/successfulRegistration', viewModel);
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
    const { id } = req.body;

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

      // Establece la fecha de inicio y final del préstamo
      book.startDate = new Date();
      book.returnDate = new Date();
      book.returnDate.setMinutes(book.returnDate.getMinutes() + 30);

      // Guarda el libro en la base de datos
      await book.save();

      // Informa al cliente que el préstamo fue exitoso
      log.info('El préstamo fue exitoso');
      return res.render('user/listBooks', { book });
    }

    // Informa al cliente que no hay copias disponibles o el libro está prestado
    log.info('No hay copias disponibles o el libro está prestado');
    return res.render('user/listBooks');
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Devolución de libro
// POST '/user/return'
const postReturn = async (req, res) => {
  try {
    // Se obtiene el userId del usuario
    const { userId } = req.session;
    log.info('Se solicita devolución de libro');

    // Obtén el ID del libro del request
    const { id } = req.body;

    // Busca el libro en la base de datos
    const book = await BookModel.findById(id);

    // Verifica si el libro está prestado por el usuario
    if (book.borrowedBy && book.borrowedBy.toString() === userId) {
      // Incrementa la cantidad de libros en 1
      book.bookQuantity += 1;

      // Elimina el campo borrowedBy
      book.borrowedBy = null;

      // Agrega el userId al campo returnedBy
      book.returnedBy = userId;

      // Elimina las fechas de inicio y final del préstamo
      book.startDate = null;
      book.returnDate = null;

      // Guarda el libro en la base de datos
      await book.save();

      // Informa al cliente que la devolución fue exitosa
      log.info('La devolución fue exitosa');
      return res.render('user/listBooks', { book });
    }

    // Informa al cliente que el libro no está prestado por el usuario
    log.info('El libro no está prestado por el usuario');
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
  // Obtén el userId del usuario
  const { userId } = req.session;
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
      borrowedBy: userId, // Solo busca libros prestados por el usuario actual
    })
      .lean()
      .exec();
  } else {
    // Si no se proporcionó ninguno, obtén todos los libros
    books = await BookModel.find({ borrowedBy: userId }).lean().exec(); // Solo busca libros prestados por el usuario actual
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

const postReserve = async (req, res) => {
  try {
    // Se obtiene el userId del usuario
    const { userId } = req.session;
    log.info('Se solicita reserva de libro');

    // Obtén el ID del libro del request
    const { id } = req.body;

    // Busca el libro en la base de datos
    const book = await BookModel.findById(id);

    // Verifica si hay copias disponibles y el libro no está prestado ni reservado
    if (book.bookQuantity > 0 && !book.borrowedBy && !book.reservedBy) {
      // Verifica si el usuario ya tiene prestada o reservada una copia del mismo libro
      const userHasBook = await BookModel.exists({
        _id: id, // Busca el libro actual
        $or: [{ borrowedBy: userId }, { reservedBy: userId }],
      });

      if (userHasBook) {
        return res.send('Ya tienes una copia de este libro reservadado.');
      }

      // Busca al usuario por userId
      const user = await User.findById(userId);

      // Verifica si el usuario existe
      if (!user) {
        return res.send('Usuario no encontrado');
      }

      // Establece el campo reservedBy al userId del usuario
      book.reservedBy = user._id;

      // Guarda el libro en la base de datos
      await book.save();

      // Informa al cliente que la reserva fue exitosa
      log.info('La reserva fue exitosa');
      return res.render('user/listBooks', { book });
    }

    // Informa al cliente que no hay copias disponibles, el libro está reservado
    log.info('No hay copias disponibles, el libro está reservado');
    return res.render('user/listBooks');
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// POST '/user/cancelReservation'
const postCancelReservation = async (req, res) => {
  // Obtén el ID del libro del request
  const { _id } = req.body;
  try {
    const book = await BookModel.findById(_id);
    if (!book) {
      return res.status(404).send({ message: 'Libro no encontrado' });
    }

    book.reservedBy = null; // Cancela la reserva
    await book.save();

    return res
      .status(200)
      .render('user/listBooks', { message: 'La reservacion fue cancelada' });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error al cancelar la reservacion: ${error.message}` });
  }
};

// Exportar todos los metodos de acción
export default {
  login,
  logout,
  register,
  confirm,
  registerPost,
  loginPost,
  userHome,
  listBooks,
  Penalties,
  reserveBook,
  postCancelReservation,
  modify,
  postLoan,
  listLoanBooks,
  postReturn,
  postReserve,
  postModify,
};
