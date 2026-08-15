import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { DocumentDoc, DocumentEntity } from '../entities/document.entity';

@Injectable()
export class DocumentRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  DocumentEntity,
  DocumentDoc
> {
  constructor(
    @DatabaseModel(DocumentEntity.name)
    private readonly _documentModel: Model<DocumentEntity>,
  ) {
    super(_documentModel);
  }
}
