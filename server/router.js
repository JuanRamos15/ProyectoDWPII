import createError from 'http-errors';
// Impornting winston logger
import log from './config/winston';

// Importando enrutador home
import homeRouter from './domains/home/home.router';
import userRouter from './domains/user/user.router';
import projectsRouter from './domains/projects/project.router';
// Función que agrega rutas
const addRoutes = (app) => {
  // Agregando enrutado de Home
  app.use('/', homeRouter);
  app.use('/about', homeRouter);
  app.use('/user', userRouter);
  app.use('/project', projectsRouter);
  // ERRORES
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    log.info(`404 Pagina no encontrada ${req.method} ${req.originalUrl}`);
    next(createError(404));
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    log.error(`${err.status || 500} - ${err.message}`);
    res.render('error');
  });

  return app;
};

export default { addRoutes };
