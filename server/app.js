// Establishing webpack modules
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
// Importing debug into app.js file
import debug from './services/degubLogger';
// Importing the configuration of the webpack module
import webpackConfig from '../webpack.dev.config';

// cargando depedencia
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Creando la instancia de express
const app = express();

// Establishing a execution mode
const nodeEnviroment = process.env.NODE_ENV || 'production';
if (nodeEnviroment === 'development') {
  // Mensaje de que se comienza a ejecutar el modo de desarrollo
  debug('Ejecutando en modo desarrollo 🛠️');
  // Estableciendo el entorno de node al modo de webpack
  webpackConfig.mode = nodeEnviroment;
  // Emparejando el puerto de webpack con el de node
  webpackConfig.devServer.port = process.env.PORT;
  // Setting up the HMR (Hot Module Replacement)
  webpackConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=1000',
    webpackConfig.entry,
  ];
  // Se agrega el plugin de la configuracion de desarrollo de webpack
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // Se crea el archivo bundle y se guarda en una constante
  const bundle = webpack(webpackConfig);
  // Permitiendo el uso del middleware
  app.use(
    WebpackDevMiddleware(bundle, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  //  Enabling the webpack HMR
  app.use(WebpackHotMiddleware(bundle));
} else {
  console.log('Ejecutando en modo producción 🪖');
}

// configura el motor de plantillas
debug(`📣Ruta de app: ${path.join(__dirname, 'views')}`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// se establecen los middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// crea un srvidor de archivos estaticos
app.use(express.static(path.join(__dirname, '..', 'public')));
// registro de middleware de aplicacion
app.use('/', indexRouter);
// activa usersRouter cunado se solicta el recurso raiz users
app.use('/users', usersRouter);

// catch 404 and forward to error handler este es el utlimo middleware que agarra los errores
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
