import { Module } from '@nestjs/common';
import { ReturnRefundRepositoryModule } from './repository/return-refund.repository.module';
import { ReturnRefundService } from './services/return-refund.service';

@Module({
  imports: [ReturnRefundRepositoryModule],
  providers: [ReturnRefundService],
  exports: [ReturnRefundService],
})
export class ReturnRefundModule {}
