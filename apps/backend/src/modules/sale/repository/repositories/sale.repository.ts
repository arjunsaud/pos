import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { SaleDoc, SaleEntity } from '../entities/sale.entity';

@Injectable()
export class SaleRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  SaleEntity,
  SaleDoc
> {
  constructor(
    @DatabaseModel(SaleEntity.name)
    private readonly _saleModel: Model<SaleEntity>,
  ) {
    super(_saleModel);
  }
}
