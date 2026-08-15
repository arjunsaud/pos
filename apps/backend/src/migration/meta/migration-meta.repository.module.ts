import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationMetaRepo } from './migration-meta.repository';
import {
  MigrationMetaEntity,
  MigrationMetaSchema,
} from 'src/common/database/meta/migration-meta.entity';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';

@Module({
  providers: [MigrationMetaRepo],
  exports: [MigrationMetaRepo],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: MigrationMetaEntity.name,
          schema: MigrationMetaSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class MigrationMetaRepositoryModule {}
