import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { from } from 'rxjs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', //'smtp.example.com',//process.env.SMTP_HOST, // Cambia a tu servidor SMTP
      port: 587,//(process.env.SMTP_PORT), // Ajusta el puerto según tu servidor SMTP
      secure: false,//process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
      auth: {
        user: 'lara.developer@rastreogo.com',//'test@example.com',//process.env.SMTP_USER, // Cambia a tu usuario SMTP//rastreogonodemailer
        pass:'avvu nrlx wnnj opqj',// 'secret',//process.env.SMTP_PASSWORD, // Cambia a tu contraseña SMTP //avvu nrlx wnnj opqj 
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    
    const mailOptions = {
      from: 'lara.developer@rastreogo.com',//'test@example.com', // Cambia a tu dirección de correo
      to: to,
      subject: subject,
      text: text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      // console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error enviando el correo:', error);
    }
  }

 // async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Implementa la lógica para enviar emails aquí
    //// console.log(`Enviando email a ${to}: ${subject}`);
  //}
}