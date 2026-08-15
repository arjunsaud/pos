import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IReturnRefundEntity } from '../../interfaces/return-refund.entity.interface';

export const ReturnRefundDataBaseName = 'return_refunds';

@DatabaseEntity({ collection: ReturnRefundDataBaseName })
export class ReturnRefundEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IReturnRefundEntity
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
  returnNumber: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  saleId: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  invoiceNumber: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  customerName?: string;

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
  refundAmount: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  refundMethod: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'requested',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  reason?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  processedBy?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  processedAt?: string;
}

export const ReturnRefundSchema = SchemaFactory.createForClass(ReturnRefundEntity);

export type ReturnRefundDoc = ReturnRefundEntity & Document;
