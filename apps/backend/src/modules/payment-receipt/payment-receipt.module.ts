import { Module } from '@nestjs/common';
import { PaymentReceiptRepositoryModule } from './repository/payment-receipt.repository.module';
import { PaymentReceiptService } from './services/payment-receipt.service';

@Module({
  imports: [PaymentReceiptRepositoryModule],
  providers: [PaymentReceiptService],
  exports: [PaymentReceiptService],
})
export class PaymentReceiptModule {}
