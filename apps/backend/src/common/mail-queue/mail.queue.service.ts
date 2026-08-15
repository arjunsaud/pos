import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { Queue } from 'bull';
import {
  MAIL_JOB,
  MAIL_JOB_NAME,
} from 'src/common/bull-queue/mail.queue.constant';
import {
  IBookingCancel,
  IBookingPayload,
  IMailPayload,
  INotifyBookingUser,
} from '../../modules/mail/interface/mail.interface';

@Injectable()
export class MailQueueService {
  private readonly logger = new Logger(MailQueueService.name);

  constructor(
    @Optional() @InjectQueue(MAIL_JOB) private mailQueue?: Queue,
  ) {}

  private enqueue(name: string, context: unknown) {
    if (!this.mailQueue) {
      this.logger.warn(`Queue skipped (${name}) — Redis is disabled`);
      return;
    }
    this.mailQueue.add(name, context, {
      attempts: 5,
      priority: 1,
      removeOnComplete: true,
    });
  }

  addJob(context: IMailPayload) {
    this.enqueue(MAIL_JOB_NAME.ADD, context);
  }

  addJobBookingConfirmNotifyAdmin(context: IBookingPayload) {
    this.enqueue(MAIL_JOB_NAME.ADD_NOTIFY_ADMIN, context);
  }

  addJobBookingCancelNotifyAdmin(context: IBookingCancel) {
    this.enqueue(MAIL_JOB_NAME.ADD_NOTIFY_ADMIN_CANCEL, context);
  }

  addJobBookingConfirmNotifyUser(context: INotifyBookingUser) {
    this.enqueue(MAIL_JOB_NAME.ADD_NOTIFY_USER, context);
  }

  addJobForgetPassword(context: IMailPayload) {
    this.enqueue(MAIL_JOB_NAME.FORGET_PASSWORD, context);
  }

  addJobInquiryNotifyAdmin(context: IMailPayload) {
    this.enqueue(MAIL_JOB_NAME.INQUIRY_NOTIFY_ADMIN, context);
  }
}
