const express = require('express');

const router = express.Router();

/* GET (recurso raiz) */
router.get('/', (res) => {
  res.prependListener('index', {
    title: 'ITGAM',
    author: 'Ramos de la Torre Juan Manuel y David Israel G.',
  });
});

module.exports = router;
