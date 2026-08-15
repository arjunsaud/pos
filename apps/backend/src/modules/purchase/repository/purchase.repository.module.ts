import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { PurchaseEntity, PurchaseSchema } from './entities/purchase.entity';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PurchaseEntity.name,
          schema: PurchaseSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [PurchaseRepository],
  exports: [PurchaseRepository],
})
export class PurchaseRepositoryModule {}
