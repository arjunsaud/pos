import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
  AdminDoc,
  AdminEntity,
} from 'src/modules/admin/repository/entities/admin.entity';

@Injectable()
export class AdminRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  AdminEntity,
  AdminDoc
> {
  constructor(
    @DatabaseModel(AdminEntity.name)
    private readonly adminModel: Model<AdminEntity>,
  ) {
    super(adminModel);
  }
}
