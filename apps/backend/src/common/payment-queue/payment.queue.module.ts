import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { PAYMENT_JOB } from '../bull-queue/payment.queue.constant';
import { isRedisEnabled } from '../helper/constants/redis.constant';
import { PaymentQueueService } from './payment.queue.service';

@Global()
@Module({
  imports: isRedisEnabled()
    ? [
        BullModule.registerQueue({
          name: PAYMENT_JOB,
        }),
      ]
    : [],
  providers: [PaymentQueueService],
  exports: [PaymentQueueService],
})
export class PaymentQueueModule {}
