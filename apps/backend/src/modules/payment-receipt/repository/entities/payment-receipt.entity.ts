import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IPaymentReceiptEntity } from '../../interfaces/payment-receipt.entity.interface';

export const PaymentReceiptDataBaseName = 'payment_receipts';

@DatabaseEntity({ collection: PaymentReceiptDataBaseName })
export class PaymentReceiptEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IPaymentReceiptEntity
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
  tenantName: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  amount: number;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  packageId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  packageName: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  paymentMethod: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  receiptFile?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'pending',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  uploadedAt?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  reviewedAt?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  reviewedBy?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  notes?: string;
}

export const PaymentReceiptSchema = SchemaFactory.createForClass(PaymentReceiptEntity);

export type PaymentReceiptDoc = PaymentReceiptEntity & Document;
