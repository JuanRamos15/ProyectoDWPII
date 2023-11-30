import log from '../../config/winston';
// Importando el modelo
import BookModel from './bookRoot.model';

// import root from './book.model';
const rootNav = (request, response) => {
  response.render('root/rootHome');
};
// GET '/root/register'
const addBook = (req, res) => {
  log.info('Se entrega formulario de registro de libro');
  res.render('root/addBook');
};
// GET '/root/register'
const listBooks = async (req, res) => {
  log.info('Se entrega la lista de libros registrados en el sistema');
  // Consulta los libros
  const books = await BookModel.find({}).lean().exec();
  // Se entrega la vista dashboardView con el viewmodel projects
  res.render('root/listBooks', { books });
};
// Get '/root/penalties'
const penalties = (req, res) => {
  log.info('Se entrega la lista de libros registrados en el sistema');
  res.render('root/Penalties');
};
// GET '/root/loan'
const loan = (req, res) => {
  log.info('Se entrega formulario de prestamo de libro');
  res.render('root/loan');
};
// GET '/root/reserveBook'
const reserveBook = (req, res) => {
  log.info('Se entrega formulario de reserva de libro');
  res.render('root/reserveBook');
};
// GET 'root'/modifyUser'
const modifyUser = (req, res) => {
  log.info('Se entrega formulario de modificacion de usuario');
  res.render('root/modify');
};
// GET '/root/manage'
const manage = (req, res) => {
  log.info('Se entrega formulario de modificacion de usuario');
  res.send('root/manage');
};

// POST "/root/addBook"
const addBookPost = async (req, res) => {
  // Rescatando la info del formulario
  const { errorData: validationError } = req;
  // En caso de haber error
  // se le informa al cliente
  if (validationError) {
    log.info('Se entrega al cliente error de validación de add Book');
    // Se desestructuran los datos de validación
    // y se renombran de  "value" a "book"
    const { value: book } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('root/addBook', { book, errorModel });
  }
  // En caso de que pase la validación
  // Se desestructura la información
  // de la peticion
  const { validData: book } = req;
  try {
    // Creando la instancia de un documento con los valores de 'book'
    const savedBook = await BookModel.create(book);
    // Se informa al cliente que se guardo el libro
    log.info(`Se carga libro ${savedBook}`);
    // Se registra en el log el redireccionamiento
    log.info('Se redirecciona el sistema a /root');
    // Se redirecciona el sistema a la ruta '/root'
    return res.redirect('/root/listBooks');
  } catch (error) {
    // Se registra en el log el error
    log.error(`Error al guardar el libro en la base de datos ${error}`);
    // Se registra en el log el redireccionamiento
    log.info('Se redirecciona el sistema a /root');
    // Agregando mensaje de flash
    req.flash('errorMessage', 'Error al agregar el libro');
    // Se redirecciona el sistema a la ruta '/root'
    return res.redirect('/root/addBook');
  }
};

export default {
  rootNav,
  addBook,
  listBooks,
  penalties,
  loan,
  reserveBook,
  modifyUser,
  manage,
  addBookPost,
};
