import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { StockMovementDoc, StockMovementEntity } from '../entities/stock-movement.entity';

@Injectable()
export class StockMovementRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  StockMovementEntity,
  StockMovementDoc
> {
  constructor(
    @DatabaseModel(StockMovementEntity.name)
    private readonly _stockMovementModel: Model<StockMovementEntity>,
  ) {
    super(_stockMovementModel);
  }
}
