// Se importa el objeto "engine" y se renombra a "exphns"
import { engine as exphbs } from 'express-handlebars';
import path from 'path';

// Funcion de configuracion
export default (app) => {
  // Se regristra el motor de plantillas
  app.engine(
    'hbs',
    exphbs({
      // Se define la extension de la plantilla
      extname: '.hbs',
      // Se define el nombre del layout por defecto
      defaultLayout: 'main',
    })
  );
  console.log(__dirname);

  // Se selecciona el motor de plantilla
  app.set('view engine', 'hbs');
  // Se establecen las rutas de las vistas
  app.set('views', path.join(__dirname, '..', 'views'));

  // Se retorna la instancia de app
  return app;
};
