import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from '../abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from '../decorators/database.decorator';

export const OrgDatabaseName = 'migration_meta';

@DatabaseEntity({ collection: OrgDatabaseName })
export class MigrationMetaEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: true,
    index: true,
    type: Number,
    unique: true,
  })
  timestamp: number;
  @Prop({
    required: true,
    index: true,
    type: String,
  })
  name: string;
}
export const MigrationMetaSchema =
  SchemaFactory.createForClass(MigrationMetaEntity);

export type MigrationMetaDoc = MigrationMetaEntity & Document;
