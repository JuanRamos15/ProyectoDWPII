import PDFDocument from 'pdfkit';
import log from '../../config/winston';
// Importando el modelo
import BookModel from './bookRoot.model';
import User from '../user/user.model';

const fs = require('fs');

// import root from './book.model';
const rootNav = (request, response) => {
  response.render('root/rootHome');
};
// GET '/root/register'
const addBook = (req, res) => {
  log.info('Se entrega formulario de registro de libro');
  res.render('root/addBook');
};
// GET '/root/listBooks'
const listBooks = async (req, res) => {
  log.info('Se entrega la lista de libros registrados en el sistema');
  // Obtén la consulta del request
  const { query } = req.query;
  log.info(`Buscando libros con el titulo autor o categoria: ${query}`);
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
const userList = async (req, res) => {
  log.info('Se entrega la lista de usuarios registrados en el sistema');
  // Obtén la consulta del request
  const { query } = req.query;
  log.info(`Buscando usuarios con el nombre o ID: ${query}`);
  // Consulta los usuarios
  let users;
  if (query) {
    // Si se proporcionó una consulta, busca usuarios que coincidan con ese nombre o ID
    users = await User.find({
      $or: [
        { studentId: new RegExp(query, 'i') },
        { firstName: new RegExp(query, 'i') },
      ],
    })
      .lean()
      .exec();
  } else {
    // Si no se proporcionó ninguno, obtén todos los usuarios
    users = await User.find({}).lean().exec();
  }
  log.info(`Encontrados ${users.length} usuarios`);
  // Se entrega la vista dashboardView con el viewmodel users
  res.render('root/userList', { users });
};

// GET '/root/reports'
const bookReport = (req, res) => {
  res.render('root/reports');
};

// POST '/root/reports'
const bookReportPost = async (req, res) => {
  log.info('Ingresando al reporte de libro');
  // Recupera todos los libros de la base de datos
  const books = await BookModel.find();

  // Crea un nuevo documento PDF
  const doc = new PDFDocument();

  // Escribe en el documento PDF
  doc.fontSize(25).text('Reporte de libros', 50, 50);

  let y = 100;
  books.forEach((book) => {
    doc.fontSize(20).text(`Título: ${book.bookTitle}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`Autor: ${book.bookAuthor}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`ISBN: ${book.bookISBN}`, 50, y);
    y += 30;
    doc.fontSize(15).text(`Categoría: ${book.bookCategory}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`Cantidad: ${book.bookQuantity}`, 50, y);
    y += 50;
  });
  doc.end();
  // Guarda el documento PDF en un archivo
  // eslint-disable-next-line
  const stream = doc.pipe(fs.createWriteStream('C:\Users\lower\OneDrive\Escritorio\Reporte-Libros.pdf')); // Reemplaza esto con la ruta donde quieres guardar el PDF

  stream.on('finish', () => {
    // Finaliza el documento PDF
    doc.end();
    log.info('Se termina el reporte de libro');
    // Envía el PDF como respuesta
    // eslint-disable-next-line
    res.download('C:\Users\lower\OneDrive\Escritorio\Reporte-Libros.pdf'); // Reemplaza esto con la ruta donde guardaste el PDF
  });
};

// POST '/root/userReportPost
const userReportPost = async (req, res) => {
  log.info('Ingresando al reporte de Usuarios');
  // Recupera todos los libros de la base de datos
  const users = await User.find();

  // Crea un nuevo documento PDF
  const doc = new PDFDocument();

  // Escribe en el documento PDF
  doc.fontSize(25).text('Reporte de Usuarios', 50, 50);

  let y = 100;
  users.forEach((user) => {
    doc.fontSize(20).text(`Nombre/s: ${user.firstName}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`Apellido/s: ${user.lastname}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`Numero de control: ${user.studentId}`, 50, y);
    y += 30;
    doc.fontSize(15).text(`Carrera: ${user.major}`, 50, y);
    y += 20;
    doc.fontSize(15).text(`Correo: ${user.mail}`, 50, y);
    y += 50;
  });
  doc.end();
  // Guarda el documento PDF en un archivo
  // eslint-disable-next-line
  const stream = doc.pipe(fs.createWriteStream('C:\Users\lower\OneDrive\Escritorio\Reporte-Usuarios.pdf')); // Reemplaza esto con la ruta donde quieres guardar el PDF

  stream.on('finish', () => {
    // Finaliza el documento PDF
    doc.end();
    log.info('Se termina el reporte de libro');
    // Envía el PDF como respuesta
    // eslint-disable-next-line
    res.download('C:\Users\lower\OneDrive\Escritorio\Reporte-Usuarios.pdf'); // Reemplaza esto con la ruta donde guardaste el PDF
  });
};

// DELETE user con root
const deleteUser = async (req, res) => {
  // Extrayendo el id de los parametros
  const { id } = req.params;
  // Usando el modelo para borrar el proyecto
  try {
    const result = await User.findByIdAndRemove(id);
    // Agregando mensaje de flash
    req.flash('successMessage', 'Usuario borrado con exito');
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// GET 'put'/modifyUser'
const modifyUser = async (req, res) => {
  // Se extrae el id de los parametros
  const { id } = req.params;
  // Buscando en la base de datos
  try {
    log.info(`Se inicia la busqueda del usuario con el id: ${id}`);
    const user = await User.findOne({ _id: id }).lean().exec();
    if (user === null) {
      log.info(`No se encontro el usuario con el id: ${id}`);
      return res.status(404).json({ message: 'No se encontro el usuario' });
    }
    // Se manda a renderizar la vista de edicion
    log.info(`Se encontro el usuario con el id: ${id}`);
    return res.render('root/modifyUser', { user });
  } catch (error) {
    log.error(`Error al buscar el usuario con el id: ${id}`);
    return res.status(500).json(error);
  }
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

// GET 'book'/edit/:id'
const bookEdit = async (req, res) => {
  const { id } = req.params;
  // Buscando en la base de datos
  try {
    log.info(`Se inicia la busqueda del libro con el id: ${id}`);
    const book = await BookModel.findOne({ _id: id }).lean().exec();
    if (book === null) {
      log.info(`No se encontro el libro con el id: ${id}`);
      return res.status(404).json({ message: 'No se encontro el libro' });
    }
    // Se manda a renderizar la vista de edicion
    log.info(`Se encontro el libro con el id: ${id}`);
    return res.render('root/editBook', { book });
  } catch (error) {
    log.error(`Error al buscar el proyecto con el id: ${id}`);
    return res.status(500).json({ error });
  }
};

// PUT '/root/edit/:id'
const editPut = async (req, res) => {
  const { id } = req.params;
  // Rescatando la informacion del formulario
  const { errorData: validationError } = req;
  // En caso de haber error
  if (validationError) {
    log.info(
      `Se entrega al cliente error de validación de edit Book con el id: ${id}`
    );
    // Se desestructuran los datos de validación
    const { value: book } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('root/editBook', { book, errorModel });
  }
  // Si no hay error
  const book = await BookModel.findOne({ _id: id });
  if (book === null) {
    log.info(`No se encontro el libro con el id: ${id}`);
    return res.status(404).send('No se encontro el libro');
  }
  // En caso de encontrarse el documento se actualizan los datos
  const { validData: newBook } = req;
  book.bookTitle = newBook.bookTitle;
  book.bookAuthor = newBook.bookAuthor;
  book.bookCategory = newBook.bookCategory;
  book.bookISBN = newBook.bookISBN;
  book.bookQuantity = newBook.bookQuantity;
  try {
    // Se salvan los cambios
    log.info(`Se actualizo el libro con el id: ${id}`);
    await book.save();
    return res.redirect('/root/listBooks');
  } catch (error) {
    log.error(`Error al actualizar el libro con el id: ${id}`);
    // Agregando mensaje de flash
    req.flash('errorMessage', 'Error al actualizar el libro');
    return res.status(500).json(error);
  }
};

// DELETE "/project/:id"
const deleteBook = async (req, res) => {
  // Extrayendo el id de los parametros
  const { id } = req.params;
  // Usando el modelo para borrar el proyecto
  try {
    const result = await BookModel.findByIdAndRemove(id);
    // Agregando mensaje de flash
    req.flash('successMessage', 'Libro borrado con exito');
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// PUT '/user/modify
const modifyUserPut = async (req, res) => {
  const { id } = req.params;
  // Rescatando la informacion del formulario
  const { errorData: validationError } = req;
  // En caso de haber error
  if (validationError) {
    log.info(
      `Se entrega al cliente error de validación de edit User con el id: ${id}`
    );
    // Se desestructuran los datos de validación
    const { value: user } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('root/modifyUser', { user, errorModel });
  }
  // Si no hay error
  const user = await User.findOne({ _id: id });
  if (user === null) {
    log.info(`No se encontro el usuario con el id: ${id}`);
    return res.status(404).send('No se encontro el usuario');
  }
  // En caso de encontrarse el documento se actualizan los datos
  const { validData: newUser } = req;
  user.firstName = newUser.firstName;
  user.lastname = newUser.lastname;
  user.studentId = newUser.studentId;
  user.major = newUser.major;
  user.mail = newUser.mail;
  try {
    // Se salvan los cambios
    log.info(`Se actualizo el usuario con el id: ${id}`);
    await user.save();
    return res.redirect('/root/userList');
  } catch (error) {
    log.error(`Error al actualizar el usuario con el id: ${id}`);
    return res.status(500).json(error);
  }
};

// Exportando los metodos de accion
export default {
  rootNav,
  addBook,
  listBooks,
  penalties,
  loan,
  reserveBook,
  userList,
  modifyUser,
  modifyUserPut,
  deleteUser,
  addBookPost,
  bookEdit,
  deleteBook,
  editPut,
  bookReport,
  bookReportPost,
  userReportPost,
};
