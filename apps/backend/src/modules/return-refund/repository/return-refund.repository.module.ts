import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ReturnRefundEntity, ReturnRefundSchema } from './entities/return-refund.entity';
import { ReturnRefundRepository } from './repositories/return-refund.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ReturnRefundEntity.name,
          schema: ReturnRefundSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ReturnRefundRepository],
  exports: [ReturnRefundRepository],
})
export class ReturnRefundRepositoryModule {}
