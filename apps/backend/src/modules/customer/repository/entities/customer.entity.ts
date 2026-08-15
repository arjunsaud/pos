import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ICustomerEntity } from '../../interfaces/customer.entity.interface';

export const CustomerDataBaseName = 'customers';

@DatabaseEntity({ collection: CustomerDataBaseName })
export class CustomerEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ICustomerEntity
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
    required: false,
    index: false,
    type: String,
    default: '',
  })
  email?: string;

  @Prop({
    required: true,
    index: true,
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
  address?: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  totalPurchases?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  totalSpent?: number;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  lastVisit?: string;

  @Prop({
    required: false,
    index: true,
    type: Boolean,
    default: true,
  })
  isActive?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  loyaltyPoints?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  creditBalance?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  creditLimit?: number;
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);

export type CustomerDoc = CustomerEntity & Document;
