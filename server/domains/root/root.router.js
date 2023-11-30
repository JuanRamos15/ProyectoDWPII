import { Router } from 'express';

import rootController from './root.controller';

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

export default router;
