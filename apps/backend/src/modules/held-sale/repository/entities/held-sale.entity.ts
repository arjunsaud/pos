import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IHeldSaleEntity } from '../../interfaces/held-sale.entity.interface';

export const HeldSaleDataBaseName = 'held_sales';

@DatabaseEntity({ collection: HeldSaleDataBaseName })
export class HeldSaleEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IHeldSaleEntity
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
    index: false,
    type: Array,
    default: [],
  })
  cart: Record<string, any>[];

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
    type: String,
    default: '',
  })
  heldAt: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  total: number;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;
}

export const HeldSaleSchema = SchemaFactory.createForClass(HeldSaleEntity);

export type HeldSaleDoc = HeldSaleEntity & Document;
