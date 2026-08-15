import { Module } from '@nestjs/common';
import { SaleRepositoryModule } from './repository/sale.repository.module';
import { SaleService } from './services/sale.service';

@Module({
  imports: [SaleRepositoryModule],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
