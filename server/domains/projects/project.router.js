// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import projectController from './project.controller';

// Creando una instancia del enrutador
const router = new Router();

// Enrutamos
// GET /project/projects
router.get('/projects', projectController.showDashboard);
// GET /project/dashboard
router.get('/dashboard', projectController.showDashboard);
// GET /project/add-form
router.get('/add-form', projectController.addForm);
// GET /project/add
router.get('/add', projectController.addForm);
export default router;
