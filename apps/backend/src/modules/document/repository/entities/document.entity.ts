import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IDocumentEntity } from '../../interfaces/document.entity.interface';

export const DocumentDataBaseName = 'documents';

@DatabaseEntity({ collection: DocumentDataBaseName })
export class DocumentEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IDocumentEntity
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
    type: String,
    default: '',
  })
  tenantName: string;

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
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  fileName: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  fileSize?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'pending',
  })
  status: string;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);

export type DocumentDoc = DocumentEntity & Document;
