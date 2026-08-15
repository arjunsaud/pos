import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { FeatureDoc, FeatureEntity } from '../entities/feature.entity';

@Injectable()
export class FeatureRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  FeatureEntity,
  FeatureDoc
> {
  constructor(
    @DatabaseModel(FeatureEntity.name)
    private readonly _featureModel: Model<FeatureEntity>,
  ) {
    super(_featureModel);
  }
}
