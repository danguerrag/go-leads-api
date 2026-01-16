import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailEnabled = this.configService.get<string>('EMAIL_ENABLED', 'false') === 'true';

    if (!emailEnabled) {
      this.logger.warn('Email notifications are disabled. Set EMAIL_ENABLED=true in .env to enable them.');
      return;
    }

    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<number>('EMAIL_PORT', 587);
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    if (!emailHost || !emailUser || !emailPassword) {
      this.logger.warn('Email configuration is incomplete. Email notifications will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    this.logger.log('Email service initialized successfully');
  }

  async sendNewLeadNotification(lead: Lead): Promise<void> {
    if (!this.transporter) {
      this.logger.debug('Email transporter not configured. Skipping email notification.');
      return;
    }

    const recipientEmail = this.configService.get<string>('NOTIFICATION_EMAIL');
    const fromEmail = this.configService.get<string>('EMAIL_FROM', this.configService.get<string>('EMAIL_USER'));

    if (!recipientEmail) {
      this.logger.warn('NOTIFICATION_EMAIL not configured. Cannot send notification.');
      return;
    }

    try {
      const mailOptions = {
        from: fromEmail,
        to: recipientEmail,
        subject: '🎯 Nuevo Lead Recibido',
        html: this.generateLeadEmailTemplate(lead),
        text: this.generateLeadEmailText(lead),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
    }
  }

  private generateLeadEmailTemplate(lead: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 0 0 5px 5px;
            }
            .field {
              margin-bottom: 15px;
              padding: 10px;
              background-color: white;
              border-left: 3px solid #4CAF50;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              margin-top: 5px;
              color: #333;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 Nuevo Lead Recibido</h1>
          </div>
          <div class="content">
            <p>Has recibido un nuevo contacto desde tu página web:</p>
            
            <div class="field">
              <div class="label">👤 Nombre Completo:</div>
              <div class="value">${lead.fullName}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">📱 Teléfono:</div>
              <div class="value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
            </div>
            
            <div class="field">
              <div class="label">💬 Mensaje:</div>
              <div class="value">${lead.message}</div>
            </div>
            
            <div class="field">
              <div class="label">📅 Fecha:</div>
              <div class="value">${new Date(lead.date).toLocaleString('es-ES')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático de tu sistema de gestión de leads.</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateLeadEmailText(lead: any): string {
    return `
Nuevo Lead Recibido
==================

Nombre Completo: ${lead.fullName}
Email: ${lead.email}
Teléfono: ${lead.phone}
Mensaje: ${lead.message}
Fecha: ${new Date(lead.date).toLocaleString('es-ES')}

---
Este es un mensaje automático de tu sistema de gestión de leads.
    `;
  }
}
