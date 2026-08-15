import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IReferralEntity } from '../../interfaces/referral.entity.interface';

export const ReferralDataBaseName = 'referrals';

@DatabaseEntity({ collection: ReferralDataBaseName })
export class ReferralEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IReferralEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  referrerTenantId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  referrerTenantName: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  referredTenantId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  referredTenantName: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  referralCode: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'pending',
  })
  status: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  rewardType: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  rewardValue: number;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  convertedAt?: string;
}

export const ReferralSchema = SchemaFactory.createForClass(ReferralEntity);

export type ReferralDoc = ReferralEntity & Document;
