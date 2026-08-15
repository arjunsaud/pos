import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IPromotionEntity } from '../../interfaces/promotion.entity.interface';

export const PromotionDataBaseName = 'promotions';

@DatabaseEntity({ collection: PromotionDataBaseName })
export class PromotionEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IPromotionEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  code: string;

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
    required: true,
    index: true,
    type: String,
    default: '',
  })
  type: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  value: number;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'scheduled',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  maxUses?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  usedCount?: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  validFrom: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  validUntil: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  createdBy?: string;
}

export const PromotionSchema = SchemaFactory.createForClass(PromotionEntity);

export type PromotionDoc = PromotionEntity & Document;
