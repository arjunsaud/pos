import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { PackageEntity, PackageSchema } from './entities/package.entity';
import { PackageRepository } from './repositories/package.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PackageEntity.name,
          schema: PackageSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [PackageRepository],
  exports: [PackageRepository],
})
export class PackageRepositoryModule {}
