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

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const mailOptions = {
      from: 'lara.developer@rastreogo.com',
      to: to,
      subject: 'Restauración de Contraseña - Rastreo Go',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restauración de Contraseña</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #005cb9;
              color: white;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #ffffff;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #005cb9;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #777;
              border-top: 1px solid #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Rastreo Go</h1>
            </div>
            <div class="content">
              <h2>Restauración de Contraseña</h2>
              <p>Hola,</p>
              <p>Has solicitado restaurar tu contraseña en Rastreo Go.</p>
              <p>Para continuar con el proceso, haz clic en el siguiente botón:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button" style="color: white !important;">Restaurar Contraseña</a>
              </div>
              <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
              <p><strong>El enlace expirará en 1 hora.</strong></p>
            </div>
            <div class="footer">
              <p>Saludos,<br>El equipo de Rastreo Go</p>
              <p>&copy; ${new Date().getFullYear()} Rastreo Go. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Has solicitado restaurar tu contraseña en Rastreo Go. Para continuar con el proceso, visita este enlace: ${resetLink}. El enlace expirará en 1 hora.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error enviando el correo de restauración:', error);
      throw error;
    }
  }

 // async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Implementa la lógica para enviar emails aquí
    //// console.log(`Enviando email a ${to}: ${subject}`);
  //}
}