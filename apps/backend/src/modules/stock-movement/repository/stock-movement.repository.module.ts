import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { StockMovementEntity, StockMovementSchema } from './entities/stock-movement.entity';
import { StockMovementRepository } from './repositories/stock-movement.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: StockMovementEntity.name,
          schema: StockMovementSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [StockMovementRepository],
  exports: [StockMovementRepository],
})
export class StockMovementRepositoryModule {}
