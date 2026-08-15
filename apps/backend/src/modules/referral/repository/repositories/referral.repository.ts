import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ReferralDoc, ReferralEntity } from '../entities/referral.entity';

@Injectable()
export class ReferralRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ReferralEntity,
  ReferralDoc
> {
  constructor(
    @DatabaseModel(ReferralEntity.name)
    private readonly _referralModel: Model<ReferralEntity>,
  ) {
    super(_referralModel);
  }
}
