// Importando passport
import passport from 'passport';
// Importando passport-local
import LocalStrategy from 'passport-local';
// Importando el modelo de usuarios
import User from '../domains/user/user.model';
// Logger
import log from '../config/winston';

// Creando objeto de configuraciones
const localOptions = {
  usernameField: 'mail',
};
// Creando la instancia de estrategia local
const localStrategy = new LocalStrategy(
  localOptions,
  async (mail, password, done) => {
    try {
      // Buscando al usuario en la base de datos
      const user = await User.findOne({ mail });
      // Si no existe el usuario
      if (!user) {
        log.info('Usuario no encontrado');
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      // En caso de que el usuario no este confirmado el usuario
      // falla lo que es la autenticasion
      if (!user.emailConfirmationAt) {
        log.info('Usuario no confirmado');
        return done(null, false, { message: 'Usuario no confirmado' });
      }
      // Si la contraseña no coincide
      if (!user.authenticateUser(password)) {
        log.info('Contraseña incorrecta');
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      // En caso de pasar las pruebas anteriores se regresa error nulo
      // y el usuario
      return done(null, user);
    } catch (error) {
      log.error(`${error.message}`);
      return done(error, false);
    }
  }
);

// Genera y mantiene cookies
passport.serializeUser((user, done) => {
  log.info('Serializando usuario');
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    log.info('Deserializando usuario');
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    log.error(`${error.message}`);
    done(error, null);
  }
});

// Se registra la estrategia
passport.use(localStrategy);
// Se exporta el middleware
export const authLocal = passport.authenticate('local', {
  // Redireccionamiento en caso de fallo
  successRedirect: '/user/userHome',
  failureRedirect: '/login',
  failureFlash: true,
});

// Todo falta por terminar
export const authJwt = {};
