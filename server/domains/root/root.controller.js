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

export default {
  rootNav,
  addBook,
  listBooks,
};
