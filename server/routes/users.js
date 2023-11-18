import express from 'express';

const router = express.Router();

// GET /users
router.get('/', (req, res) => {
  res.send('respond with a resource');
});
// para que se ejecute se debe de entar a un get de /users y despues a /author
router.get('/author', (_, res) => {
  res.render('author', { author: 'Ramos de la Torre Juan' });
});

export default router;
