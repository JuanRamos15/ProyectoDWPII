// Envio de correo
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
// Template engine de proposiot general
import Handlebars from 'handlebars';
import appRoot from 'app-root-path';
import log from '../config/winston';

// Function to process Temaplate
function processingTemaplate(view, viewModel) {
  // Lee el archivo de la plantilla
  const source = fs.readFileSync(
    path.join(appRoot.toString(), 'server', 'mails', `${view}.hbs`),
    'utf-8'
  );
  // Compila el archivo de la plantilla
  const template = Handlebars.compile(source);
  // Genera el html con los datos del viewModel
  const htmlContent = template(viewModel);
  return htmlContent;
}

// Class
class MailSender {
  // Class constructor
  constructor(options) {
    if (!options) throw new Error('Need options to create a Mail Sender');
    this.transporter = nodemailer.createTransport(options);
    this.mail = {
      from: '',
      to: '',
      subject: '',
      text: '',
      html: '',
    };
  }

  // Methods
  async sendMail(view, viewModel, text) {
    // Input Checking
    if (!view || !viewModel || !text)
      throw new Error('Need to provide "view" and "viewModel"');
    // Mail Checking
    if (
      this.mail.from === '' ||
      this.mail.to === '' ||
      this.mail.subject === ''
    ) {
      log.error('Mail info options object is incomplete');
      throw new Error('Mail info options object is incomplete');
    }
    try {
      this.mail.html = processingTemaplate(view, viewModel);
      this.mail.text = text;
      return this.transporter.sendMail(this.mail);
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}

// Export
export default MailSender;
