import { Module } from '@nestjs/common';
import { PurchaseRepositoryModule } from './repository/purchase.repository.module';
import { PurchaseService } from './services/purchase.service';

@Module({
  imports: [PurchaseRepositoryModule],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
