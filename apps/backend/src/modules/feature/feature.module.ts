import { Module } from '@nestjs/common';
import { FeatureRepositoryModule } from './repository/feature.repository.module';
import { FeatureService } from './services/feature.service';

@Module({
  imports: [FeatureRepositoryModule],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
