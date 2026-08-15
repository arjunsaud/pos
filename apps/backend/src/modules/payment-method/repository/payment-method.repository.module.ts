import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { PaymentMethodEntity, PaymentMethodSchema } from './entities/payment-method.entity';
import { PaymentMethodRepository } from './repositories/payment-method.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PaymentMethodEntity.name,
          schema: PaymentMethodSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [PaymentMethodRepository],
  exports: [PaymentMethodRepository],
})
export class PaymentMethodRepositoryModule {}
