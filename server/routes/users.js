var express = require('express');
var router = express.Router();

// GET /users 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//para que se ejecute se debe de entar a un get de /users y despues a /author
router.get('/author', function(_, res) {
  res.render('author',{author: "Ramos de la Torre Juan"});
});

module.exports = router;