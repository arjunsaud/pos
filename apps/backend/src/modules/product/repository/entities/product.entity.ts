import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IProductEntity } from '../../interfaces/product.entity.interface';

export const ProductDataBaseName = 'products';

@DatabaseEntity({ collection: ProductDataBaseName })
export class ProductEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IProductEntity
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
  name: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  sku: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  barcode?: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  price: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  costPrice?: number;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  category: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  stock?: number;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  minStock?: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: 'pcs',
  })
  unit: string;

  @Prop({
    required: false,
    index: true,
    type: Boolean,
    default: true,
  })
  isActive?: boolean;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  image?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  vendorId?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  vendorName?: string;

  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  outletId?: string;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  hasBatchTracking?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);

export type ProductDoc = ProductEntity & Document;
