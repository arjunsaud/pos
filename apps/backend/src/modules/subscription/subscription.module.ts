import { Module } from '@nestjs/common';
import { SubscriptionRepositoryModule } from './repository/subscription.repository.module';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [SubscriptionRepositoryModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
