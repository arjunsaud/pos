import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { HeldSaleEntity, HeldSaleSchema } from './entities/held-sale.entity';
import { HeldSaleRepository } from './repositories/held-sale.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: HeldSaleEntity.name,
          schema: HeldSaleSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [HeldSaleRepository],
  exports: [HeldSaleRepository],
})
export class HeldSaleRepositoryModule {}
