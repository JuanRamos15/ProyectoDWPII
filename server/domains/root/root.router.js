import { Router } from 'express';

import rootController from './root.controller';

const router = new Router();
// GET '/root/rootHome'
router.get('/rootHome', rootController.rootNav);
// GET '/root/addBook'
router.get('/addBook', rootController.addBook);
// GET '/root/listBooks'
router.get('/listBooks', rootController.listBooks);

export default router;
