import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { VendorEntity, VendorSchema } from './entities/vendor.entity';
import { VendorRepository } from './repositories/vendor.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: VendorEntity.name,
          schema: VendorSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [VendorRepository],
  exports: [VendorRepository],
})
export class VendorRepositoryModule {}
