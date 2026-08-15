import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ITemplateEntity } from '../../interfaces/template.entity.interface';

export const TemplateDatabaseName = 'print_templates';

@DatabaseEntity({ collection: TemplateDatabaseName })
export class TemplateEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ITemplateEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    enum: ['invoice', 'receipt'],
  })
  type: 'invoice' | 'receipt';

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    default: '',
  })
  html: string;

  @Prop({
    required: true,
    type: String,
    default: 'a4',
  })
  paperSize: string;

  @Prop({
    required: true,
    index: true,
    type: Boolean,
    default: false,
  })
  isDefault: boolean;

  @Prop({
    required: true,
    index: true,
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const TemplateSchema = SchemaFactory.createForClass(TemplateEntity);

export type TemplateDoc = TemplateEntity & Document;
