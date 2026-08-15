import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
  AdminEntity,
  AdminSchema,
} from 'src/modules/admin/repository/entities/admin.entity';
import { AdminRepository } from 'src/modules/admin/repository/repositories/admin.repository';

@Module({
  providers: [AdminRepository],
  exports: [AdminRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AdminEntity.name,
          schema: AdminSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AdminRepositoryModule {}
