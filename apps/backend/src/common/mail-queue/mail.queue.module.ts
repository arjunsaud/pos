import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MAIL_JOB } from '../bull-queue/mail.queue.constant';
import { isRedisEnabled } from '../helper/constants/redis.constant';
import { MailQueueService } from './mail.queue.service';

@Global()
@Module({
  imports: isRedisEnabled()
    ? [
        BullModule.registerQueue({
          name: MAIL_JOB,
        }),
      ]
    : [],
  providers: [MailQueueService],
  exports: [MailQueueService],
})
export class MailQueueModule {}
