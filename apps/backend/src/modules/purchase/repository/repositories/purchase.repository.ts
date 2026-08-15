import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PurchaseDoc, PurchaseEntity } from '../entities/purchase.entity';

@Injectable()
export class PurchaseRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  PurchaseEntity,
  PurchaseDoc
> {
  constructor(
    @DatabaseModel(PurchaseEntity.name)
    private readonly _purchaseModel: Model<PurchaseEntity>,
  ) {
    super(_purchaseModel);
  }
}
