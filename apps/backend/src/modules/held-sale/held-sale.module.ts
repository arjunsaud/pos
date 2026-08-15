import { Module } from '@nestjs/common';
import { HeldSaleRepositoryModule } from './repository/held-sale.repository.module';
import { HeldSaleService } from './services/held-sale.service';

@Module({
  imports: [HeldSaleRepositoryModule],
  providers: [HeldSaleService],
  exports: [HeldSaleService],
})
export class HeldSaleModule {}
