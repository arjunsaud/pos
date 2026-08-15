import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { PaymentReceiptDoc, PaymentReceiptEntity } from '../entities/payment-receipt.entity';

@Injectable()
export class PaymentReceiptRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  PaymentReceiptEntity,
  PaymentReceiptDoc
> {
  constructor(
    @DatabaseModel(PaymentReceiptEntity.name)
    private readonly _paymentReceiptModel: Model<PaymentReceiptEntity>,
  ) {
    super(_paymentReceiptModel);
  }
}
