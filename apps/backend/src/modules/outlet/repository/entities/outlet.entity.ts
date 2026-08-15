import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IOutletEntity } from '../../interfaces/outlet.entity.interface';

export const OutletDataBaseName = 'outlets';

@DatabaseEntity({ collection: OutletDataBaseName })
export class OutletEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IOutletEntity
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
  name: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  address: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  city: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  phone: string;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  isDefault?: boolean;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'active',
  })
  status: string;
}

export const OutletSchema = SchemaFactory.createForClass(OutletEntity);

export type OutletDoc = OutletEntity & Document;
