import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IStockTransferEntity } from '../../interfaces/stock-transfer.entity.interface';

export const StockTransferDataBaseName = 'stock_transfers';

@DatabaseEntity({ collection: StockTransferDataBaseName })
export class StockTransferEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IStockTransferEntity
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
  transferNumber: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  fromOutletId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  fromOutletName: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  toOutletId: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  toOutletName: string;

  @Prop({
    required: true,
    index: false,
    type: Array,
    default: [],
  })
  items: Record<string, any>[];

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
  reason?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  completedAt?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  createdBy?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  notes?: string;
}

export const StockTransferSchema = SchemaFactory.createForClass(StockTransferEntity);

export type StockTransferDoc = StockTransferEntity & Document;
