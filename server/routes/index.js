import express from 'express';

const router = express.Router();
/* GET (recurso raiz) */
router.get('/', (req, res) => {
  res.render('index', { title: 'index', Author: 'Ramos de la Torre Juan' }); /// render trae las vista y contesta con un html
});

export default router;
