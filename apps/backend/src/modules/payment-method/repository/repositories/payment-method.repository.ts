import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PaymentMethodDoc, PaymentMethodEntity } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  PaymentMethodEntity,
  PaymentMethodDoc
> {
  constructor(
    @DatabaseModel(PaymentMethodEntity.name)
    private readonly _paymentMethodModel: Model<PaymentMethodEntity>,
  ) {
    super(_paymentMethodModel);
  }
}
