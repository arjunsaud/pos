import { Module } from '@nestjs/common';
import { StockTransferRepositoryModule } from './repository/stock-transfer.repository.module';
import { StockTransferService } from './services/stock-transfer.service';

@Module({
  imports: [StockTransferRepositoryModule],
  providers: [StockTransferService],
  exports: [StockTransferService],
})
export class StockTransferModule {}
