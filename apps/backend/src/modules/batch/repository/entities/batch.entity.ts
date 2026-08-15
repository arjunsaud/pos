import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IBatchEntity } from '../../interfaces/batch.entity.interface';

export const BatchDataBaseName = 'batches';

@DatabaseEntity({ collection: BatchDataBaseName })
export class BatchEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IBatchEntity
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
  productId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  productName: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  sku: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  batchNumber: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  quantity: number;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  remainingQty: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  costPrice?: number;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  mfgDate?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  expiryDate?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'good',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  receivedDate?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;
}

export const BatchSchema = SchemaFactory.createForClass(BatchEntity);

export type BatchDoc = BatchEntity & Document;
