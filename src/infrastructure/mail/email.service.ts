import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Para desarrollo: usar Mailtrap (gratuito)
    // Registrarse en https://mailtrap.io y obtener credenciales
    const host = process.env.MAIL_HOST || 'smtp.mailtrap.io';
    const port = parseInt(process.env.MAIL_PORT || '587');
    const user = process.env.MAIL_USER || 'your_mailtrap_user';
    const pass = process.env.MAIL_PASS || 'your_mailtrap_pass';
    const from = process.env.MAIL_FROM || 'noreply@frapenangels.com';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });

    // Verificar conexión
    if (process.env.NODE_ENV !== 'production') {
      this.transporter
        .verify()
        .then(() => console.log('✅ Email service configured successfully'))
        .catch((err) => console.log('⚠️ Email service warning:', err.message));
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@frapenangels.com',
      to: email,
      subject: 'Recupera tu contraseña - Frapen Angels',
      html: `
        <h2>Recuperar Contraseña</h2>
        <p>Hola,</p>
        <p>Has solicitado recuperar tu contraseña. Haz clic en el enlace de abajo para cambiarla:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">
            Cambiar Contraseña
          </a>
        </p>
        <p>O copia este enlace en tu navegador: ${resetUrl}</p>
        <p style="color: #999; font-size: 12px;">Este enlace expirará en 15 minutos.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, ignora este email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Error sending email to ${email}:`, error);
      throw new Error('Error al enviar el email de recuperación');
    }
  }
}
