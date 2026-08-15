import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { TemplateDoc, TemplateEntity } from '../entities/template.entity';

@Injectable()
export class TemplateRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  TemplateEntity,
  TemplateDoc
> {
  constructor(
    @DatabaseModel(TemplateEntity.name)
    private readonly _templateModel: Model<TemplateEntity>,
  ) {
    super(_templateModel);
  }
}
