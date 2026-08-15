import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import {
  MAIL_JOB,
  MAIL_JOB_NAME,
} from 'src/common/bull-queue/mail.queue.constant';
import {
  MAIL_LOG_ENUM,
  MailLogEntity,
} from 'src/modules/mail-log/entities/mail-log.entities';
import { MailLogRepository } from 'src/modules/mail-log/repository/mail-log.repository';
import {
  IBookingCancel,
  IBookingPayload,
  IForgetPassword,
  IInquiryPayload,
  IMailPayload,
  INotifyBookingUser,
  IResetPassword,
} from '../interface/mail.interface';
import { MailTemplateService } from '../services/mail.template.service';

@Processor(MAIL_JOB)
export class MailProcessor {
  email: string;
  constructor(
    private readonly mailTemplateService: MailTemplateService,
    private readonly mailLogRepo: MailLogRepository,
    private readonly configService: ConfigService,
  ) {
    this.email = this.configService.get('app.notifyEmail');
  }

  @Process(MAIL_JOB_NAME.INQUIRY_NOTIFY_ADMIN)
  async sendInquiryNotificationEmailAdmin(job: Job<IMailPayload>) {
    try {
      const { to } = job.data;
      const mailToSend: IMailPayload = {
        subject: 'New Inquiry Received',
        to,
      };
      mailToSend.html = await this.compileTemplate('inquiry', job.data.context);
      const data = await this._sendTemplateMail(mailToSend);
      await this.mailLogRepo.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Process(MAIL_JOB_NAME.ADD)
  async handleSendMail(job: Job<IMailPayload>) {
    const { subject, text, to, html } = job.data;
    try {
      const data = await this.mailTemplateService.sendMail({
        to,
        subject,
        text,
        html,
      });
      await this.mailLogRepo.create(data);
    } catch (error) {
      throw error;
    }
  }

  //templates
  @Process(MAIL_JOB_NAME.FORGET_PASSWORD)
  async handleSendMailForgetPassword(job: Job<IMailPayload>) {
    try {
      const { subject, to, code } = job.data;
      const mailToSend: IMailPayload = {
        subject,
        to,
      };

      mailToSend.html = await this.compileTemplate('forgetPassword', { code });

      await this._sendTemplateMail(mailToSend);
    } catch (error) {
      throw error;
    }
  }

  @Process(MAIL_JOB_NAME.ADD_NOTIFY_ADMIN)
  async sendBookingNotificationEmailAdmin(job: Job<IBookingPayload>) {
    try {
      const { toEmail } = job.data;
      const mailToSend: IMailPayload = {
        subject: 'New Booking Confirmed',
        to: toEmail,
      };
      mailToSend.html = await this.compileTemplate('notify', job.data);
      const data = await this._sendTemplateMail(mailToSend);
      await this.mailLogRepo.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Process(MAIL_JOB_NAME.ADD_NOTIFY_ADMIN_CANCEL)
  async sendCancelBookingNotificationMailAdmin(job: Job<IBookingCancel>) {
    const { toEmail } = job.data;
    try {
      const mailToSend: IMailPayload = {
        subject: 'Booking Canceled',
        to: toEmail,
      };
      mailToSend.html = await this.compileTemplate('cancel', job.data);

      const data = await this._sendTemplateMail(mailToSend);
      await this.mailLogRepo.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Process(MAIL_JOB_NAME.ADD_NOTIFY_USER)
  async sendBookingNotificationMailUser(job: Job<IBookingPayload>) {
    const { toEmail } = job.data;
    try {
      const mailToSend: IMailPayload = {
        subject: 'Booking Confirmed',
        to: toEmail,
      };

      mailToSend.html = await this.compileTemplate('booking', job.data);
      const data = await this._sendTemplateMail(mailToSend);
      await this.mailLogRepo.create(data);
    } catch (error) {
      throw error;
    }
  }

  //private functions
  private _sendTemplateMail(
    data: IMailPayload,
  ): Promise<Partial<MailLogEntity>> {
    const { to, subject, html, text } = data;

    const mailLog: Partial<MailLogEntity> = {
      status: MAIL_LOG_ENUM.PENDING,
    };
    return new Promise((resolve) => {
      this.mailTemplateService
        .sendMail({ to, subject, html, text })
        .then(() => {
          mailLog.status = MAIL_LOG_ENUM.SUCCESS;
          resolve(mailLog);
        })
        .catch((err) => {
          mailLog.status = MAIL_LOG_ENUM.FAILED;
          let serializedError: Record<string, any> = null;
          try {
            serializedError = JSON.stringify(err) as unknown as Record<
              string,
              any
            >;
          } catch (err) {}
          mailLog.error = serializedError;
          resolve(mailLog);
        });
    });
  }

  async compileTemplate(
    templateName: string,
    context:
      | IBookingPayload
      | IBookingCancel
      | IResetPassword
      | INotifyBookingUser
      | IForgetPassword
      | IMailPayload
      | IInquiryPayload,
  ) {
    try {
      const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found: ${filePath}`);
      }
      const source = fs.readFileSync(filePath, 'utf8');
      const template = Handlebars.compile(source);
      return template(context);
    } catch (error) {
      throw error;
    }
  }
}
