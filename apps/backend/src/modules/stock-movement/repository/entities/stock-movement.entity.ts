import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IStockMovementEntity } from '../../interfaces/stock-movement.entity.interface';

export const StockMovementDataBaseName = 'stock_movements';

@DatabaseEntity({ collection: StockMovementDataBaseName })
export class StockMovementEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IStockMovementEntity
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
  quantity: number;

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
  performedBy?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovementEntity);

export type StockMovementDoc = StockMovementEntity & Document;
