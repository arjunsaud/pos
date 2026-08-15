import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CustomerDoc, CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  CustomerEntity,
  CustomerDoc
> {
  constructor(
    @DatabaseModel(CustomerEntity.name)
    private readonly _customerModel: Model<CustomerEntity>,
  ) {
    super(_customerModel);
  }
}
