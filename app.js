//cargando depedencia
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('dwpc2:server');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//Creando la instancia de express
var app = express();

// configura el motor de plantillas
debug(`📣Ruta de app: ${path.join(__dirname,'views')}`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// se establecen los middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//crea un srvidor de archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
//registro de middleware de aplicacion
app.use('/', indexRouter);
//activa usersRouter cunado se solicta el recurso raiz users
app.use('/users', usersRouter);
/*app.use('/author',(req,res)=>{
 //res.json({mainDeveloper: "Ramos de la Torre Juan"})
});*/

// catch 404 and forward to error handler este es el utlimo middleware que agarra los errores
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
