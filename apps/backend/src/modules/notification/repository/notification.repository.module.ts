import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { NotificationEntity, NotificationSchema } from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: NotificationEntity.name,
          schema: NotificationSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationRepositoryModule {}
