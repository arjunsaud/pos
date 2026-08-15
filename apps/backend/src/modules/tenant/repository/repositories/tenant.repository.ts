import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { TenantDoc, TenantEntity } from '../entities/tenant.entity';

@Injectable()
export class TenantRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  TenantEntity,
  TenantDoc
> {
  constructor(
    @DatabaseModel(TenantEntity.name)
    private readonly _tenantModel: Model<TenantEntity>,
  ) {
    super(_tenantModel);
  }
}
