import nodemailer from 'nodemailer';
import { resolve } from 'path';
// import exphbs from 'express-handlebars';
import { create } from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail {
  constructor() {
    const host = 'smtp.umbler.com'
    const port = 587
    const secure = false
    const auth = {
        user: 'naoresponda@msbtec.com.br',
        pass: '',
    }

    // @ts-ignore
    this.transporter = nodemailer.createTransport({
      // @ts-ignore
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'resources', 'views', 'emails');

    // @ts-ignore
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: create({
          defaultLayout: 'src/resources/views/emails/send',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );    
  }

  sendMail(message: any) {
    // @ts-ignore
    return this.transporter.sendMail({
      from: 'Noreply <naoresponda@msbtec.com.br',
      ...message,
    });
  }
}

export default new Mail();