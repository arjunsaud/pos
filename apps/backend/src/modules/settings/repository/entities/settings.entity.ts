import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const SettingsDatabaseName = 'settings';

export class PageSettings {
  @Prop({
    required: true,
    type: String,
  })
  key: string;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  isActive: boolean;

  @Prop({
    required: true,
    type: {
      path: String,
      pathWithFilename: String,
      filename: String,
      completedUrl: String,
      baseUrl: String,
      mime: String,
    },
    default: {
      path: '',
      pathWithFilename: '',
      filename: '',
      completedUrl: '',
      baseUrl: '',
      mime: '',
    },
  })
  photo: AwsS3Serialization;

  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: false,
    type: String,
  })
  shortDescription?: string;

  @Prop({
    required: true,
    type: String,
  })
  description: string;
}

@DatabaseEntity({ collection: SettingsDatabaseName })
export class SettingsEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: true,
    type: Number,
    index: true,
    default: 0,
  })
  serviceCharge: number;

  @Prop({
    required: true,
    type: Number,
    index: true,
    default: 0,
  })
  partialPayment: number;

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  isPartialPayment: boolean;

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  maintenanceMode: boolean;

  @Prop({
    required: false,
    type: [PageSettings],
    default: [],
  })
  pages: PageSettings[];
}

export const SettingsSchema = SchemaFactory.createForClass(SettingsEntity);

export type SettingsDoc = SettingsEntity & Document;
