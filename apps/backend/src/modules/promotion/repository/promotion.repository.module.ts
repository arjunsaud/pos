import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { PromotionEntity, PromotionSchema } from './entities/promotion.entity';
import { PromotionRepository } from './repositories/promotion.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PromotionEntity.name,
          schema: PromotionSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [PromotionRepository],
  exports: [PromotionRepository],
})
export class PromotionRepositoryModule {}
