import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ReturnRefundDoc, ReturnRefundEntity } from '../entities/return-refund.entity';

@Injectable()
export class ReturnRefundRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ReturnRefundEntity,
  ReturnRefundDoc
> {
  constructor(
    @DatabaseModel(ReturnRefundEntity.name)
    private readonly _returnRefundModel: Model<ReturnRefundEntity>,
  ) {
    super(_returnRefundModel);
  }
}
