import { Module } from '@nestjs/common';
import { PaymentMethodRepositoryModule } from './repository/payment-method.repository.module';
import { PaymentMethodService } from './services/payment-method.service';

@Module({
  imports: [PaymentMethodRepositoryModule],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
