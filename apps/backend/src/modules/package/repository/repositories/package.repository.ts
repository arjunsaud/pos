import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PackageDoc, PackageEntity } from '../entities/package.entity';

@Injectable()
export class PackageRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  PackageEntity,
  PackageDoc
> {
  constructor(
    @DatabaseModel(PackageEntity.name)
    private readonly _packageModel: Model<PackageEntity>,
  ) {
    super(_packageModel);
  }
}
