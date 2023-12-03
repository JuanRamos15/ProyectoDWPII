/* eslint-disable consistent-return */
// Importando mongoose
import mongoose from 'mongoose';

import log from '../../config/winston';
import configKeys from '../../config/configKeys';
import MailSender from '../../services/mailSender';
// Desestructurando la funcion Schema
const { Schema } = mongoose;

// Construcion de un Schema es un objeto vacio
const BookSchema = new Schema({
  bookTitle: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  bookCategory: {
    type: String,
    required: true,
  },
  bookISBN: {
    type: String,
    required: true,
  },
  bookQuantity: {
    type: Number,
    required: true,
  },
  borrowedBy: {
    type: String,
    ref: 'User',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    default: () => {
      // Utiliza una función para calcular la fecha de devolución
      const date = new Date();
      date.setMinutes(date.getMinutes() + 30); // Añade 30 minutos a la fecha actual
      return date;
    },
  },
});

BookSchema.post('save', async function sendLoanMail() {
  // Solo envía el correo si el libro ha sido prestado
  if (!this.borrowedBy) {
    return;
  }

  // Busca al usuario que pidió prestado el libro
  const user = await mongoose.model('user').findById(this.borrowedBy);

  // Verifica si el usuario existe
  if (!user) {
    return;
  }

  // Creando opciones de correo
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

  // Configurando datos de correo
  mailSender.mail = {
    from: 'BibloTec@gamadero.tecnm.mx',
    to: user.mail,
    subject: 'Préstamo de libro',
  };

  try {
    const info = await mailSender.sendMail(
      'loan',
      {
        user: user.firstName,
        lastname: user.lastname,
        mail: user.mail,
        bookTitle: this.bookTitle,
        startDate: this.startDate,
        returnDate: this.returnDate,
      },
      `
      Estimado ${user.firstName} ${user.lastName}  
      has solicitado prestado el libro ${this.bookTitle}.  
      La fecha de inicio del préstamo es ${this.startDate} y la fecha de devolución es ${this.returnDate}.`
    );

    if (!info) return log.info('😭 No se pudo enviar el correo');
    log.info('🎉 Correo enviado con exito');
    return info;
  } catch (error) {
    log.error(`🚨 ERROR al enviar correo: ${error.message}`);
    return null;
  }
});

// copilando el schema
// genera el modelo
export default mongoose.model('book', BookSchema);
