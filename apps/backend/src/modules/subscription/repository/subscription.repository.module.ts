import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { SubscriptionEntity, SubscriptionSchema } from './entities/subscription.entity';
import { SubscriptionRepository } from './repositories/subscription.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SubscriptionEntity.name,
          schema: SubscriptionSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [SubscriptionRepository],
  exports: [SubscriptionRepository],
})
export class SubscriptionRepositoryModule {}
