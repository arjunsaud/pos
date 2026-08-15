import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PromotionDoc, PromotionEntity } from '../entities/promotion.entity';

@Injectable()
export class PromotionRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  PromotionEntity,
  PromotionDoc
> {
  constructor(
    @DatabaseModel(PromotionEntity.name)
    private readonly _promotionModel: Model<PromotionEntity>,
  ) {
    super(_promotionModel);
  }
}
