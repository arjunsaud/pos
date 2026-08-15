import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { OTPDoc, OTPEntity } from '../entities/otp.entity';

@Injectable()
export class VerificationRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  OTPEntity,
  OTPDoc
> {
  constructor(
    @DatabaseModel(OTPEntity.name)
    private readonly verificationModel: Model<OTPEntity>,
  ) {
    super(verificationModel);
  }
}
