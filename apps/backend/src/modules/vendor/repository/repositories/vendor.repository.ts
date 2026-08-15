import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { VendorDoc, VendorEntity } from '../entities/vendor.entity';

@Injectable()
export class VendorRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  VendorEntity,
  VendorDoc
> {
  constructor(
    @DatabaseModel(VendorEntity.name)
    private readonly _vendorModel: Model<VendorEntity>,
  ) {
    super(_vendorModel);
  }
}
