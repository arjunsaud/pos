import { Module } from '@nestjs/common';
import { VerificationRepositoryModule } from './repository/verification.repository.module';
import { VerificationService } from './verification.service';

@Module({
  imports: [VerificationRepositoryModule],
  exports: [VerificationService],
  providers: [VerificationService],
  controllers: [],
})
export class VerificationModule {}
