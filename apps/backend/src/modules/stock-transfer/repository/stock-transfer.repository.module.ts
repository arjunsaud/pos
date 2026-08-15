import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { StockTransferEntity, StockTransferSchema } from './entities/stock-transfer.entity';
import { StockTransferRepository } from './repositories/stock-transfer.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: StockTransferEntity.name,
          schema: StockTransferSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [StockTransferRepository],
  exports: [StockTransferRepository],
})
export class StockTransferRepositoryModule {}
