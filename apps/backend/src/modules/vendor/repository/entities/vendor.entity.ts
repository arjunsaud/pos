import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IVendorEntity } from '../../interfaces/vendor.entity.interface';

export const VendorDataBaseName = 'vendors';

@DatabaseEntity({ collection: VendorDataBaseName })
export class VendorEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IVendorEntity
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
  contactPerson: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  email: string;

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
    type: String,
    default: '',
  })
  pan?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  vatNumber?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  address?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  city?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'active',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  productCount?: number;
}

export const VendorSchema = SchemaFactory.createForClass(VendorEntity);

export type VendorDoc = VendorEntity & Document;
