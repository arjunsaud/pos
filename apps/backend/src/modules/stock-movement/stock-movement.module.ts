import { Module } from '@nestjs/common';
import { StockMovementRepositoryModule } from './repository/stock-movement.repository.module';
import { StockMovementService } from './services/stock-movement.service';

@Module({
  imports: [StockMovementRepositoryModule],
  providers: [StockMovementService],
  exports: [StockMovementService],
})
export class StockMovementModule {}
