import { Module } from '@nestjs/common';
import { PromotionRepositoryModule } from './repository/promotion.repository.module';
import { PromotionService } from './services/promotion.service';

@Module({
  imports: [PromotionRepositoryModule],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
