import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ISubscriptionEntity } from '../../interfaces/subscription.entity.interface';

export const SubscriptionDataBaseName = 'subscriptions';

@DatabaseEntity({ collection: SubscriptionDataBaseName })
export class SubscriptionEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ISubscriptionEntity
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
    index: true,
    type: String,
    default: 'trial',
  })
  status: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  startDate: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  endDate: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  amount: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: 'NPR',
  })
  currency: string;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  autoRenew?: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionEntity);

export type SubscriptionDoc = SubscriptionEntity & Document;
