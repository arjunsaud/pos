import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IFeatureEntity } from '../../interfaces/feature.entity.interface';

export const FeatureDataBaseName = 'features';

@DatabaseEntity({ collection: FeatureDataBaseName })
export class FeatureEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IFeatureEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  tenantId: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  key: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  label: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  description?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  category: string;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  enabled?: boolean;
}

export const FeatureSchema = SchemaFactory.createForClass(FeatureEntity);

export type FeatureDoc = FeatureEntity & Document;
