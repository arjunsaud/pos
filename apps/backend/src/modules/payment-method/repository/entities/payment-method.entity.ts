import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IPaymentMethodEntity } from '../../interfaces/payment-method.entity.interface';

export const PaymentMethodDataBaseName = 'payment_methods';

@DatabaseEntity({ collection: PaymentMethodDataBaseName })
export class PaymentMethodEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IPaymentMethodEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  type: string;

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
  description?: string;

  @Prop({
    required: false,
    index: true,
    type: Boolean,
    default: true,
  })
  enabled?: boolean;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  accountDetails?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  qrCodeUrl?: string;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethodEntity);

export type PaymentMethodDoc = PaymentMethodEntity & Document;
