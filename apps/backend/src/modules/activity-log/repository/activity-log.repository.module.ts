import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ActivityLogEntity, ActivityLogSchema } from './entities/activity-log.entity';
import { ActivityLogRepository } from './repositories/activity-log.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ActivityLogEntity.name,
          schema: ActivityLogSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ActivityLogRepository],
  exports: [ActivityLogRepository],
})
export class ActivityLogRepositoryModule {}
