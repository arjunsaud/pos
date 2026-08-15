import { Module } from '@nestjs/common';
import { ReferralRepositoryModule } from './repository/referral.repository.module';
import { ReferralService } from './services/referral.service';

@Module({
  imports: [ReferralRepositoryModule],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
