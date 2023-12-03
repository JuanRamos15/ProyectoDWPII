// 1. Importando Mongoose
import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

import log from '../../config/winston';
import configKeys from '../../config/configKeys';
import MailSender from '../../services/mailSender';

// 2. Desestructurando la fn Schema
const { Schema } = mongoose;
// 3. Creando el esquema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    studentId: { type: String, required: true },
    major: { type: String, required: true },
    mail: {
      type: String,
      unique: true,
      required: [true, 'Es necesario ingresar email'],
      validate: {
        validator(mail) {
          // eslint-disable-next-line no-useless-escape
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(mail);
        },
        message: `{VALUE} no es un email válido`,
      },
    },
    password: {
      type: String,
      required: [true, 'Es necesario ingresar password'],
      trim: true,
      minLength: [6, 'Password debe ser de al menos 6 caracteres'],
      validate: {
        validator(password) {
          if (process.env.NODE_ENV === 'development') {
            // Sin validación rigurosa en Dev
            return true;
          }
          return validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            returnScore: false,
          });
        },
        message: 'Es necesario ingresar una contraseña fuerte',
      },
    },
    // agrega una propiedad que identifica el rol del usuario como user o admin
    role: {
      type: String,
      enum: ['user', 'root'],
      message: '{VALUE} no es un rol valido',
      default: 'user',
    },
    emailConfirmationToken: String,
    emailConfirmationAt: Date,
  },
  { timestamps: true }
);

// Adding Plugins to Schema
UserSchema.plugin(uniqueValidator);

// Asignando métodos de instancia
UserSchema.methods = {
  // Método para encriptar el password
  hashPassword() {
    return bcrypt.hashSync(this.password, 10);
  },
  // Genera un token de 64 caracteres aleatorios
  generateConfirmationToken() {
    return crypto.randomBytes(64).toString('hex');
  },
  // Función de transformación a JSON personalizada
  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastname: this.lastname,
      studentId: this.studentId,
      major: this.major,
      mail: this.mail,
      role: this.role,
      emailConfirmationToken: this.emailConfirmationToken,
      emailConfirmationAt: this.emailConfirmationAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
  // Metodo para comparar la contraseña usado en el controlador
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

// Hooks
UserSchema.pre('save', function presave(next) {
  // Encriptar el password
  if (this.isModified('password')) {
    this.password = this.hashPassword();
  }
  // Creando el token de confirmacion
  this.emailConfirmationToken = this.generateConfirmationToken();
  return next();
});

UserSchema.post('save', async function sendConfirmationMail() {
  // Creating Mail options
  const options = {
    host: configKeys.SMTP_HOST,
    port: configKeys.SMTP_PORT,
    secure: false,
    auth: {
      user: configKeys.MAIL_USERNAME,
      pass: configKeys.MAIL_PASSWORD,
    },
  };

  const mailSender = new MailSender(options);

  // Configuring mail data
  mailSender.mail = {
    from: 'BibloTec@gamadero.tecnm.mx',
    to: this.mail,
    subject: 'Account confirmation',
  };

  try {
    const info = await mailSender.sendMail(
      'confirmation',
      {
        user: this.firstName,
        lastname: this.lastname,
        mail: this.mail,
        token: this.emailConfirmationToken,
      },
      `
      Estimado ${this.firstName} ${this.lastname}  
      hemos enviado un correo de confirmación a ${this.mail}  
      favor de hacer clic en enlace de dicho correo`
    );

    if (!info) return log.info('😭 No se pudo enviar el correo');
    log.info('🎉 Correo enviado con exito');
    return info;
  } catch (error) {
    log.error(`🚨 ERROR al enviar correo: ${error.message}`);
    return null;
  }
});

// 4. Compilando el modelo y exportándolo
export default mongoose.model('user', UserSchema);
