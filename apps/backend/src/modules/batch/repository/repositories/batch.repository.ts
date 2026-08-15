import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { BatchDoc, BatchEntity } from '../entities/batch.entity';

@Injectable()
export class BatchRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  BatchEntity,
  BatchDoc
> {
  constructor(
    @DatabaseModel(BatchEntity.name)
    private readonly _batchModel: Model<BatchEntity>,
  ) {
    super(_batchModel);
  }
}
