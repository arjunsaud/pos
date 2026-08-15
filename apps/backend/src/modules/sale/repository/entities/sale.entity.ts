import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ISaleEntity } from '../../interfaces/sale.entity.interface';

export const SaleDataBaseName = 'sales';

@DatabaseEntity({ collection: SaleDataBaseName })
export class SaleEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ISaleEntity
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
  invoiceNumber: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  customerName?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  customerPAN?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  customerId?: string;

  @Prop({
    required: true,
    index: false,
    type: Array,
    default: [],
  })
  items: Record<string, any>[];

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  subtotal: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  discount?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  vatAmount?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 13,
  })
  vatPercent?: number;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  total: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  paymentMethod: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'completed',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  staffName?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;
}

export const SaleSchema = SchemaFactory.createForClass(SaleEntity);

export type SaleDoc = SaleEntity & Document;
