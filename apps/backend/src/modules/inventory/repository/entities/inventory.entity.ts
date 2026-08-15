import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IInventoryEntity } from '../../interfaces/inventory.entity.interface';

export const InventoryDataBaseName = 'inventories';

@DatabaseEntity({ collection: InventoryDataBaseName })
export class InventoryEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IInventoryEntity
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
    index: true,
    type: String,
    default: '',
  })
  productName: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  sku: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  currentStock: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  minStock?: number;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;
}

export const InventorySchema = SchemaFactory.createForClass(InventoryEntity);

export type InventoryDoc = InventoryEntity & Document;
