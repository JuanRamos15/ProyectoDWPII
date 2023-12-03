import { Router } from 'express';

import rootController from './root.controller';

// Importando el factory de validación
import ValidateFactory from '../../services/validateFactory';

// Importando el validador de libros
import bookValidator from './bookRoot.validator';

// importando el validador de usuarios
import userValidator from '../user/user.validator';

const router = new Router();
// GET '/root/rootHome'
router.get('/rootHome', rootController.rootNav);
// GET '/root/addBook'
router.get('/addBook', rootController.addBook);
// GET '/root/listBooks'
router.get('/listBooks', rootController.listBooks);
// GET '/root/penalties'
router.get('/penalties', rootController.penalties);
// GET '/root/loan'
router.get('/loan', rootController.loan);
// GET '/root/reserveBook'
router.get('/reserveBook', rootController.reserveBook);
// Get '/root/modifyUser'
router.get('/modify', rootController.listBooks);
// Get '/root/edit/id'
router.get('/edit/:id', rootController.bookEdit);
// GET '/root/userList'
router.get('/userList', rootController.userList);
// GET 'root/userList'
router.get('/modifyUser/:id', rootController.modifyUser);

// POST '/root/addBook'
router.post(
  '/addBook',
  ValidateFactory({
    schema: bookValidator.bookRootSchema,
    getObject: bookValidator.getBook,
  }),
  rootController.addBookPost
);

// PUT '/root/edit/id'
router.put(
  '/edit/:id',
  ValidateFactory({
    schema: bookValidator.bookRootSchema,
    getObject: bookValidator.getBook,
  }),
  rootController.editPut
);

// DELETE "/project/:id"
router.delete('/:id', rootController.deleteUser);

// DELETE "/project/:id"
router.delete('/:id', rootController.deleteBook);

// PUT '/user/modify
router.put(
  '/modifyUser/:id',
  ValidateFactory({
    schema: userValidator.modifySchema,
    getObject: userValidator.getModify,
  }),
  rootController.modifyUserPut
);

export default router;
