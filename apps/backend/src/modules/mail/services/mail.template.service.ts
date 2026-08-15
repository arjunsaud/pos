import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailTemplateService {
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      port: configService.get<number>('email.port'),
      host: configService.get<string>('email.host'),
      service: configService.get<string>('email.service'),
      secure: false,
      auth: {
        user: configService.get<string>('email.email'),
        pass: configService.get<string>('email.pass'),
      },
    });
  }

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
    } catch (error) {
      throw error;
    }
  }
}
