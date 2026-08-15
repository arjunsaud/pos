import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { HeldSaleDoc, HeldSaleEntity } from '../entities/held-sale.entity';

@Injectable()
export class HeldSaleRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  HeldSaleEntity,
  HeldSaleDoc
> {
  constructor(
    @DatabaseModel(HeldSaleEntity.name)
    private readonly _heldSaleModel: Model<HeldSaleEntity>,
  ) {
    super(_heldSaleModel);
  }
}
