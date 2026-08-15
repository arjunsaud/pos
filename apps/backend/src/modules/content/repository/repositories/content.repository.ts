import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ContentDoc, ContentEntity } from '../entities/content.entity';

@Injectable()
export class ContentRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ContentEntity,
  ContentDoc
> {
  constructor(
    @DatabaseModel(ContentEntity.name)
    private readonly _contentModel: Model<ContentEntity>,
  ) {
    super(_contentModel);
  }
}
