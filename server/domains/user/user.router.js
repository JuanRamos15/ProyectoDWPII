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
router.get('/penalties', userController.penalties);

// GET '/user/loan'
router.get('/loan', userController.loan);

// GET '/user/reserveBook'
router.get('/reserveBook', userController.reserveBook);

// GET '/user/modify'
router.get('/modify', userController.modify);

// POST '/user/register'
router.post(
  '/register',
  ValidateFactory(userValidator.signUp),
  userController.registerPost
);

// POST '/user/login'
// Cuando el usuario hace clic en el boton de login
router.post(
  '/login',
  ValidateFactory(userValidator.login),
  userController.loginPost
);

// Exporto este tramo de ruta
export default router;
