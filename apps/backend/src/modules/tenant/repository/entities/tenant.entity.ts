import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ITenantEntity } from '../../interfaces/tenant.entity.interface';

export const TenantDataBaseName = 'tenants';

@DatabaseEntity({ collection: TenantDataBaseName })
export class TenantEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ITenantEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    required: true,
    index: true,
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
    required: true,
    index: true,
    type: String,
    default: 'Basic',
  })
  plan: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'active',
  })
  status: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  domain: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  ownerName: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  productCount?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  monthlyRevenue?: number;

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
  pan?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  vatNumber?: string;
}

export const TenantSchema = SchemaFactory.createForClass(TenantEntity);

export type TenantDoc = TenantEntity & Document;
