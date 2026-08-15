import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IPackageEntity } from '../../interfaces/package.entity.interface';

export const PackageDataBaseName = 'packages';

@DatabaseEntity({ collection: PackageDataBaseName })
export class PackageEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IPackageEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 0,
  })
  price: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: 'monthly',
  })
  interval: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'active',
  })
  status: string;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 50,
  })
  maxProducts: number;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 1,
  })
  maxStaff: number;

  @Prop({
    required: true,
    index: false,
    type: Number,
    default: 1,
  })
  maxOutlets: number;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: 'basic',
  })
  analytics: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: 'basic',
  })
  support: string;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  paymentGateway?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  billing?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  receipt?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  canExport?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  inventory?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  skuManagement?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: true,
  })
  pos?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  multipleOutlets?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  vendors?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  invoicePrinting?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  trainingAndSupport?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  customDomain?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  dailyBackup?: boolean;

  @Prop({
    required: false,
    index: false,
    type: Boolean,
    default: false,
  })
  popular?: boolean;
}

export const PackageSchema = SchemaFactory.createForClass(PackageEntity);

export type PackageDoc = PackageEntity & Document;
