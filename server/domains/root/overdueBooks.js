// overdueBooks.js
import configKeys from '../../config/configKeys';
import MailSender from '../../services/mailSender';

const mongoose = require('mongoose');

const BookModel = mongoose.model('Book');
const UserModel = mongoose.model('User');

const checkOverdueBooks = async () => {
  // Obtén la fecha actual
  const currentDate = new Date();

  // Busca libros que deberían haber sido devueltos
  const overdueBooks = await BookModel.find({
    returnDate: { $lt: currentDate },
    borrowedBy: { $ne: null },
  });

  // Para cada libro vencido, envía un correo al usuario
  for (const book of overdueBooks) {
    const user = await UserModel.findById(book.borrowedBy);
    if (user) {
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
        subject: 'Libro vencido',
      };

      try {
        const info = await mailSender.sendMail(
          'overdue',
          {
            user: user.firstName,
            lastname: user.lastname,
            mail: user.mail,
            bookTitle: book.bookTitle,
          },
          `
          Estimado ${user.firstName} ${user.lastName}  
          El libro ${book.bookTitle} que has prestado ha vencido.  
          Por favor, devuélvelo lo antes posible.`
        );

        if (!info) return log.info('😭 No se pudo enviar el correo');
        log.info('🎉 Correo enviado con exito');
        return info;
      } catch (error) {
        log.error(`🚨 ERROR al enviar correo: ${error.message}`);
        return null;
      }
    }
  }
};

// Ejecuta la función checkOverdueBooks cada día
setInterval(checkOverdueBooks, 24 * 60 * 60 * 1000);
