import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { Queue } from 'bull';
import {
  PAYMENT_JOB,
  PAYMENT_JOB_NAME,
} from '../bull-queue/payment.queue.constant';

export interface IPaymentPayload {
  id: string;
  [key: string]: any;
}

@Injectable()
export class PaymentQueueService {
  private readonly logger = new Logger(PaymentQueueService.name);

  constructor(
    @Optional() @InjectQueue(PAYMENT_JOB) private paymentQueue?: Queue,
  ) {}

  addJob(jobData: IPaymentPayload) {
    if (!this.paymentQueue) {
      this.logger.warn('Payment queue skipped — Redis is disabled');
      return;
    }
    this.paymentQueue.add(PAYMENT_JOB_NAME.RECHECK_PAYMENT, jobData, {
      jobId: `recheck-${jobData.id}`,
      attempts: 5,
      delay: 1000 * 60 * 3,
      backoff: {
        type: 'fixed',
        delay: 1000 * 60 * 5,
      },
      removeOnComplete: true,
      priority: 1,
    });
  }
}
