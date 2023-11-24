// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import userController from './user.controller';

// Creando una instancia del enrutador
const router = new Router();

// Enrutamos
// GET /user/login
router.get('/login', userController.login);
// GET /user/logout
router.get('/logout', userController.logout);
// GET /user/regitro
router.get('/register', userController.register);
// Exporto este tramo de ruta
export default router;
