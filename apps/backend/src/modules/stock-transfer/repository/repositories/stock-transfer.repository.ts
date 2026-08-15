import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { StockTransferDoc, StockTransferEntity } from '../entities/stock-transfer.entity';

@Injectable()
export class StockTransferRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  StockTransferEntity,
  StockTransferDoc
> {
  constructor(
    @DatabaseModel(StockTransferEntity.name)
    private readonly _stockTransferModel: Model<StockTransferEntity>,
  ) {
    super(_stockTransferModel);
  }
}
