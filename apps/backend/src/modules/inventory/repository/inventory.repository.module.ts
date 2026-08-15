import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { InventoryEntity, InventorySchema } from './entities/inventory.entity';
import { InventoryRepository } from './repositories/inventory.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: InventoryEntity.name,
          schema: InventorySchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [InventoryRepository],
  exports: [InventoryRepository],
})
export class InventoryRepositoryModule {}
