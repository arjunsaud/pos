import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { FeatureEntity, FeatureSchema } from './entities/feature.entity';
import { FeatureRepository } from './repositories/feature.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FeatureEntity.name,
          schema: FeatureSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [FeatureRepository],
  exports: [FeatureRepository],
})
export class FeatureRepositoryModule {}
