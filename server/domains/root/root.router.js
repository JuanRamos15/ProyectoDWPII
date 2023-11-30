import { Router } from 'express';

import rootController from './root.controller';

// Importando el factory de validación
import ValidateFactory from '../../services/validateFactory';

// Importando el validador de libros
import bookValidator from './bookRoot.validator';

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
router.get('/modify', rootController.modifyUser);
// GET '/root/manage'
router.get('/manage', rootController.manage);

// POST '/root/addBook'
router.post(
  '/addBook',
  ValidateFactory({bookValidator.submitBook}),
  rootController.addBookPost
);

export default router;
