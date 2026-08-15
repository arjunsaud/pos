import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { SaleEntity, SaleSchema } from './entities/sale.entity';
import { SaleRepository } from './repositories/sale.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SaleEntity.name,
          schema: SaleSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [SaleRepository],
  exports: [SaleRepository],
})
export class SaleRepositoryModule {}
