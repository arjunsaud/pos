import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { OutletDoc, OutletEntity } from '../entities/outlet.entity';

@Injectable()
export class OutletRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  OutletEntity,
  OutletDoc
> {
  constructor(
    @DatabaseModel(OutletEntity.name)
    private readonly _outletModel: Model<OutletEntity>,
  ) {
    super(_outletModel);
  }
}
