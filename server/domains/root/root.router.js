import { Router } from 'express';

import rootController from './root.controller';

const router = new Router();

router.get('/', rootController.rootNav);

export default router;
