// Importando lo que es el core de Winston
import winston, { format } from 'winston';
import path from 'path';

// Se desestructura funciones para realizar la composicion del formato
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

// Creando variable del directorio raiz
// eslint-disable-next-line
global['__rootdir'] = path.resolve(process.cwd());

// Se define un esquema de colores segun la gravedad del asunto
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando el esquema de colores a winston
winston.addColors(colors);

// A continuacion se crean las plantillas para los formatos
const myConsoleFormat = combine(
  // Agregando colores al formato
  colorize({ all: true }),
  // Agregando una etiqueta al log
  label({ label: '📢' }),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Agregando una funcion para la impresion
  printf(
    (info) => `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`
  )
);

// Formato que tendran los archivos
const myFileFormat = combine(
  // Quitando todo tipo de colorizacion
  format.uncolorize(),
  // Agregando la fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Establenciendo la salida en formato JSON
  prettyPrint()
);

// Creando el objeto de opciones para cada tipo de transporte
const options = {
  infoFile: {
    level: 'info',
    filename: `${__rootdir}/server/logs/info.log`,
    handleExceptions: false,
    maxSize: 5242880,
    maxFiles: 5,
    format: myFileFormat,
  },
  wantFile: {
    level: 'info',
    filename: `${__rootdir}/server/logs/warn.log`,
    handleExceptions: false,
    maxSize: 5242880,
    maxFiles: 5,
    format: myFileFormat,
  },
  errorFile: {
    level: 'error',
    filename: `${__rootdir}/server/logs/error.log`,
    handleExceptions: false,
    maxSize: 5242880,
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
};

// Se crea instancia de logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.infoFile),
    new winston.transports.File(options.wantFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // <- No finaliza al momento de encontrarse con excepciones no manejadas
});

// Estableciendo un flujo de entrada que servira para interceptar el log morgan
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

// Finalmente exportamos el logger
export default logger;
