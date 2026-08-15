import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { MailLogEntity, MailLogSchema } from '../entities/mail-log.entities';
import { MailLogRepository } from './mail-log.repository';

@Module({
  providers: [MailLogRepository],
  exports: [MailLogRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: MailLogEntity.name,
          schema: MailLogSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class MailLogRepositoryModule {}
