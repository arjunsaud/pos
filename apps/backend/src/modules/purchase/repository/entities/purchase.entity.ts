import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IPurchaseEntity } from '../../interfaces/purchase.entity.interface';

export const PurchaseDataBaseName = 'purchases';

@DatabaseEntity({ collection: PurchaseDataBaseName })
export class PurchaseEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IPurchaseEntity
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
  orderNumber: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  vendorId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  vendorName: string;

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
  vatAmount?: number;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  total: number;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'draft',
  })
  status: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  orderDate: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  expectedDate?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  receivedDate?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  notes?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  createdBy?: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(PurchaseEntity);

export type PurchaseDoc = PurchaseEntity & Document;
