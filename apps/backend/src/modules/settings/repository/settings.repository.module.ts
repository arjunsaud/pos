import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { SettingsEntity, SettingsSchema } from './entities/settings.entity';
import { SettingsRepository } from './repositories/settings.repository';

@Module({
  providers: [SettingsRepository],
  exports: [SettingsRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SettingsEntity.name,
          schema: SettingsSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class SettingsRepositoryModule {}
