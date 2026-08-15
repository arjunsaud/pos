import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IContentEntity } from '../../interfaces/content.entity.interface';

export const ContentDataBaseName = 'contents';

@DatabaseEntity({ collection: ContentDataBaseName })
export class ContentEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IContentEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  key: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  title: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  body: string;
}

export const ContentSchema = SchemaFactory.createForClass(ContentEntity);

export type ContentDoc = ContentEntity & Document;
