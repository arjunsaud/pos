import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { SubscriptionDoc, SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  SubscriptionEntity,
  SubscriptionDoc
> {
  constructor(
    @DatabaseModel(SubscriptionEntity.name)
    private readonly _subscriptionModel: Model<SubscriptionEntity>,
  ) {
    super(_subscriptionModel);
  }
}
