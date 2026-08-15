import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
  MigrationMetaDoc,
  MigrationMetaEntity,
} from 'src/common/database/meta/migration-meta.entity';

export class MigrationMetaRepo extends DatabaseMongoObjectIdRepositoryAbstract<
  MigrationMetaEntity,
  MigrationMetaDoc
> {
  constructor(
    @DatabaseModel(MigrationMetaEntity.name)
    private migrationMetaRepo: Model<MigrationMetaEntity>,
  ) {
    super(migrationMetaRepo);
  }
}
