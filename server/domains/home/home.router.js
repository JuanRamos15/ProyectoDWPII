// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import homeController from './home.controller';
// Importando el validador del usuario
import userValidator from '../user/user.validator';

// Importando el factory de validación
import ValidateFactory from '../../services/validateFactory';

// Creando una instancia del enrutador
const router = new Router();

// Enrutamos
// GET '/'
// GET '/home'
// GET '/index
router.get(['/', '/homeView'], homeController.home);
router.get('/about', homeController.about);
router.get('/register', homeController.register);
router.get('/login', homeController.login);
// GET '/user/logout'
router.get('/logout', homeController.logout);

// POST '/user/register'
router.post(
  '/register',
  ValidateFactory(userValidator.signUp),
  homeController.registerPost
);

// POST '/user/login'
// Cuando el usuario hace clic en el boton de login
router.post(
  '/login',
  ValidateFactory(userValidator.login),
  homeController.loginPost
);
// Exporto este tramo de ruta
export default router;
