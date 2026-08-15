import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { InventoryDoc, InventoryEntity } from '../entities/inventory.entity';

@Injectable()
export class InventoryRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  InventoryEntity,
  InventoryDoc
> {
  constructor(
    @DatabaseModel(InventoryEntity.name)
    private readonly _inventoryModel: Model<InventoryEntity>,
  ) {
    super(_inventoryModel);
  }
}
