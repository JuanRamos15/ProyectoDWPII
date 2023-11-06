var express = require('express');
var router = express.Router();

/* GET (recurso raiz) */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ITGAM', Author: 'Ramos de la Torre Juan'});///render trae las vista y contesta con un html
});

module.exports = router;