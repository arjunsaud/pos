import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { BatchEntity, BatchSchema } from './entities/batch.entity';
import { BatchRepository } from './repositories/batch.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: BatchEntity.name,
          schema: BatchSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [BatchRepository],
  exports: [BatchRepository],
})
export class BatchRepositoryModule {}
