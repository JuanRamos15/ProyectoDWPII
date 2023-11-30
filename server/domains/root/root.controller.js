import log from '../../config/winston';
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
const listBooks = (req, res) => {
  log.info('Se entrega la lista de libros registrados en el sistema');
  res.render('root/listBooks');
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

export default {
  rootNav,
  addBook,
  listBooks,
  penalties,
  loan,
  reserveBook,
  modifyUser,
};
