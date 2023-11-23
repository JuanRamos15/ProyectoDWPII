import express from 'express';

const router = express.Router();
/* GET (recurso raiz) */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Instituto Tecnologico de Gustavo A. Madero',
    Author: 'David Y Juan',
  }); /// render trae las vista y contesta con un html
});

export default router;
