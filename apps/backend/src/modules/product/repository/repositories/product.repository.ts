import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ProductDoc, ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ProductEntity,
  ProductDoc
> {
  constructor(
    @DatabaseModel(ProductEntity.name)
    private readonly _productModel: Model<ProductEntity>,
  ) {
    super(_productModel);
  }
}
