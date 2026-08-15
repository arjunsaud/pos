import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/user/repository/entities/user.entity';

@Injectable()
export class UserRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  UserEntity,
  UserDoc
> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    super(userModel);
  }
}
