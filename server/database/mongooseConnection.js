import mongoose from 'mongoose';
import log from '../config/winston';

// creando la funcion de conexion
export default async function connectWithRetry(mongoUrl) {
  try {
    await mongoose.connect(mongoUrl);
    log.info('✔ Conectado con mongo');
  } catch (error) {
    log.error(`😢 No se conecto con mongo 😢${error.message}`);
    log.error(' intentando la conexion en 20 segundos');
    setTimeout(() => connectWithRetry(mongoUrl), 20000);
  }
}
