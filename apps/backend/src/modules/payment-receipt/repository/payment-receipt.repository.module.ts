import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { PaymentReceiptEntity, PaymentReceiptSchema } from './entities/payment-receipt.entity';
import { PaymentReceiptRepository } from './repositories/payment-receipt.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PaymentReceiptEntity.name,
          schema: PaymentReceiptSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [PaymentReceiptRepository],
  exports: [PaymentReceiptRepository],
})
export class PaymentReceiptRepositoryModule {}
