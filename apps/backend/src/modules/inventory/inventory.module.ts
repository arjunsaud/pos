import { Module } from '@nestjs/common';
import { InventoryRepositoryModule } from './repository/inventory.repository.module';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [InventoryRepositoryModule],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
