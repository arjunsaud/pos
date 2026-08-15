import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { TenantEntity, TenantSchema } from './entities/tenant.entity';
import { TenantRepository } from './repositories/tenant.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: TenantEntity.name,
          schema: TenantSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [TenantRepository],
  exports: [TenantRepository],
})
export class TenantRepositoryModule {}
