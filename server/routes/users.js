const express = require('express');

const router = express.Router();

// GET /users
router.get('/', (res) => {
  res.send('Response with a resource');
});

// Para que se ejecute se debe de entar a un get de /users y despues a /author
router.get('/author', (_, res) => {
  res.render('author', {
    author: 'Juan y David',
  });
});

module.exports = router;
