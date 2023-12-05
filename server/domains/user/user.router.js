// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import userController from './user.controller';

// Importando el validador del usuario
import userValidator from './user.validator';

// Importando el factory de validación
import ValidateFactory from '../../services/validateFactory';

// Creando una isntancia del enrutador
const router = new Router();

// Enrutamos
// GET '/user/login'
router.get('/login', userController.login);

// GET '/user/logout'
router.get('/logout', userController.logout);

// GET '/user/register'
router.get('/register', userController.register);

// GET '/user/userHome'
router.get('/userHome', userController.userHome);

// GET '/user/listBooks'
router.get('/listBooks', userController.listBooks);

// GET '/user/penalties'
router.get('/Penalties', userController.Penalties);

// GET '/user/loan'
router.get('/listLoanBooks', userController.listLoanBooks);
// GET listLoanBooks'
router.get('/listLoanBooks', userController.listLoanBooks);

// GET '/user/reserveBook'
router.get('/reserveBook', userController.reserveBook);

// GET '/user/modify'
router.get('/modify', userController.modify);

// POST '/user/register'
router.post(
  '/register',
  ValidateFactory({
    schema: userValidator.signUpSchema,
    getObject: userValidator.getSignUp,
  }),
  userController.registerPost
);

// POST '/user/login'
// Cuando el usuario hace clic en el boton de login
router.post(
  '/login',
  ValidateFactory({
    schema: userValidator.loginSchema,
    getObject: userValidator.getLogin,
  }),
  userController.loginPost
);

// POST '/user/loan
router.post('/listLoanBooks', userController.postLoan);
// POST '/user/return
router.post('/return', userController.postReturn);
// POST '/user/reserveBook
// POST '/user/reserveBook'
router.post('/reserveBook', userController.postReserve);
// POST Cancelar reserva
router.post('/cancelReservation', userController.postCancelReservation);

// PUT '/user/modify
router.put(
  '/modify',
  ValidateFactory({
    schema: userValidator.modifySchema,
    getObject: userValidator.getModify,
  }),
  userController.postModify
);

// Exporto este tramo de ruta
export default router;
