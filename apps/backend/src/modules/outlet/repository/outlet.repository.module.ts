import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { OutletEntity, OutletSchema } from './entities/outlet.entity';
import { OutletRepository } from './repositories/outlet.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: OutletEntity.name,
          schema: OutletSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [OutletRepository],
  exports: [OutletRepository],
})
export class OutletRepositoryModule {}
