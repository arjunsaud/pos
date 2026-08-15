import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ContractDoc, ContractEntity } from '../entities/contract.entity';

@Injectable()
export class ContractRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ContractEntity,
  ContractDoc
> {
  constructor(
    @DatabaseModel(ContractEntity.name)
    private readonly _contractModel: Model<ContractEntity>,
  ) {
    super(_contractModel);
  }
}
